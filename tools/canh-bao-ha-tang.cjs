#!/usr/bin/env node
// Cảnh báo hạ tầng miễn phí (L-af0e74). Chạy cron mỗi 5 phút. Gửi: office event "..." --actor Sơn --kind canh-bao
//  (a) pm2 `xemtuvi` chết/không online, hoặc restart ≥ 3 lần trong 60 phút
//  (b) nginx 5xx: ≥ 10 lỗi 5xx trong 15 phút (đọc access.log)
//  (c) đĩa / > 85% hoặc RAM > 85%
//  (d) chứng chỉ HTTPS (v3.xemtuvi.vn, v3ad.xemtuvi.vn) còn < 14 ngày
// Chống spam: cùng một cảnh báo không gửi lại trong 60 phút. Dùng: node tools/canh-bao-ha-tang.cjs [--in] [--gia-lap=a|b|c|d]
// Thử: hạ ngưỡng bằng biến môi trường (NGUONG_RESTART, NGUONG_5XX, NGUONG_DIA, NGUONG_RAM, NGUONG_CC_NGAY, CUA_SO_5XX_PHUT, TRANG_THAI)
// hoặc --gia-lap (a: pm2 chết, b: 12 lỗi 5xx giả, c: đĩa 99%, d: chứng chỉ 3 ngày). Thông điệp thử có tiền tố [THỬ].
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync } = require('child_process');
const HOME = process.env.HOME || '/home/claude';
const TT = process.env.TRANG_THAI || path.join(HOME, 'xemtuvi-data', 'canh-bao-trang-thai.json');
const LOG = process.env.NGINX_LOG || '/var/log/nginx/access.log';
const N = {
  restart: +(process.env.NGUONG_RESTART ?? 3), s5xx: +(process.env.NGUONG_5XX ?? 10), cuaSo5xx: +(process.env.CUA_SO_5XX_PHUT ?? 15),
  dia: +(process.env.NGUONG_DIA ?? 85), ram: +(process.env.NGUONG_RAM ?? 85), ccNgay: +(process.env.NGUONG_CC_NGAY ?? 14),
};
const MIEN = (process.env.MIEN_HTTPS || 'v3.xemtuvi.vn,v3ad.xemtuvi.vn').split(',');
const gl = (process.argv.find((a) => a.startsWith('--gia-lap=')) || '').slice(10);
const thu = !!gl || Object.keys(process.env).some((k) => /^(NGUONG_|CUA_SO_5XX|TRANG_THAI$|MIEN_HTTPS)/.test(k));
const chiIn = process.argv.includes('--in');
const run = (c, a, o = {}) => spawnSync(c, a, { encoding: 'utf8', timeout: 20000, ...o });
let tt = {}; try { tt = JSON.parse(fs.readFileSync(TT, 'utf8')); } catch {}
tt.mau ??= []; tt.da_gui ??= {};
const bay = Date.now(), canhBao = [];

// (a) pm2
let pm = null;
try { const j = JSON.parse(run('pm2', ['jlist']).stdout.replace(/^[^[]*/, '')); pm = j.filter((p) => p.name === 'xemtuvi'); } catch {}
if (gl === 'a') pm = [];
if (!pm || !pm.length || pm.some((p) => p.pm2_env.status !== 'online')) {
  const d = pm && pm.length ? pm.map((p) => p.pm2_env.status).join(',') : 'không có tiến trình';
  canhBao.push(['pm2-chet', `pm2 xemtuvi không online (${d})`]);
}
if (pm && pm.length) {
  const rs = pm.reduce((a, p) => a + (p.pm2_env.restart_time || 0), 0);
  tt.mau.push([bay, rs]); tt.mau = tt.mau.filter(([t]) => bay - t < 3 * 3600e3);
  const goc = tt.mau.find(([t]) => bay - t <= 60 * 60e3 + 90e3); // mẫu cũ nhất trong ~60 phút
  const dr = goc ? rs - goc[1] : 0;
  if (dr >= N.restart) canhBao.push(['pm2-restart', `pm2 xemtuvi restart ${dr} lần trong ${Math.round((bay - goc[0]) / 60e3)} phút (ngưỡng ${N.restart}/giờ)`]);
}

// (b) nginx 5xx
const MO = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
let n5 = 0, doc = 'ok';
if (gl === 'b') n5 = 12;
else {
  // Đọc 100 MB cuối (đếm theo số dòng sẽ hụt cửa sổ khi tải cao: 500 req/s = 50.000 dòng chỉ ~100 giây)
  let r = run('tail', ['-c', '100000000', LOG], { maxBuffer: 150e6 });
  if (r.status !== 0) r = run('sudo', ['-n', 'tail', '-c', '100000000', LOG], { maxBuffer: 150e6 });
  if (r.status !== 0) { doc = 'không đọc được log'; canhBao.push(['nginx-log', `Không đọc được ${LOG} (cảnh báo 5xx tắt)`]); }
  else for (const l of r.stdout.split('\n')) {
    const m = l.match(/\[(\d+)\/(\w+)\/(\d+):(\d+):(\d+):(\d+) \+0000\] "[^"]*" (\d{3}) /);
    if (!m || m[7][0] !== '5') continue;
    const t = Date.UTC(+m[3], MO[m[2]], +m[1], +m[4], +m[5], +m[6]);
    if (bay - t <= N.cuaSo5xx * 60e3) n5++;
  }
}
if (n5 >= N.s5xx) canhBao.push(['nginx-5xx', `nginx trả ${n5} lỗi 5xx trong ${N.cuaSo5xx} phút (ngưỡng ${N.s5xx})`]);

// (c) đĩa, RAM
let dia = +(run('df', ['--output=pcent', '/']).stdout.split('\n')[1] || '0').replace('%', '');
if (gl === 'c') dia = 99;
const ram = Math.round((1 - os.freemem() / os.totalmem()) * 100); // freemem = MemAvailable
if (dia > N.dia) canhBao.push(['dia', `Đĩa / đầy ${dia}% (ngưỡng ${N.dia}%)`]);
if (ram > N.ram) canhBao.push(['ram', `RAM dùng ${ram}% (ngưỡng ${N.ram}%)`]);

// (d) chứng chỉ HTTPS (đọc qua TLS cục bộ, không cần quyền đọc /etc/letsencrypt)
const ngayCC = {};
for (const m of MIEN) {
  const r = run('bash', ['-c', `echo | openssl s_client -connect 127.0.0.1:443 -servername ${m} 2>/dev/null | openssl x509 -noout -enddate`]);
  const mm = (r.stdout || '').match(/notAfter=(.*)/);
  let ngay = mm ? Math.floor((Date.parse(mm[1]) - bay) / 86400e3) : null;
  if (gl === 'd') ngay = 3;
  ngayCC[m] = ngay;
  if (ngay === null) canhBao.push([`cc-doc-${m}`, `Không đọc được chứng chỉ HTTPS của ${m}`]);
  else if (ngay < N.ccNgay) canhBao.push([`cc-${m}`, `Chứng chỉ HTTPS ${m} còn ${ngay} ngày (ngưỡng ${N.ccNgay})`]);
}

const tomTat = `pm2=${pm ? pm.map((p) => p.pm2_env.status).join('/') : '?'} 5xx/${N.cuaSo5xx}p=${n5}${doc === 'ok' ? '' : '(' + doc + ')'} dia=${dia}% ram=${ram}% cc=${Object.entries(ngayCC).map(([k, v]) => k.split('.')[0] + ':' + v + 'n').join(',')}`;
console.log(`${new Date().toISOString()} ${canhBao.length ? 'CẢNH BÁO ' + canhBao.map((c) => c[0]).join(',') : 'ok'} | ${tomTat}`);
for (const [khoa, nd] of canhBao) {
  const lan = tt.da_gui[khoa] || 0;
  if (!thu && bay - lan < 60 * 60e3) { console.log(`  (đã báo < 60 phút, bỏ qua) ${khoa}`); continue; }
  const msg = `${thu ? '[THỬ] ' : ''}${nd}`;
  console.log(`  -> ${msg}`);
  if (!chiIn) { run('office', ['event', msg, '--actor', 'Sơn', '--kind', 'canh-bao']); if (!thu) tt.da_gui[khoa] = bay; }
}
if (!thu) { try { fs.mkdirSync(path.dirname(TT), { recursive: true }); fs.writeFileSync(TT, JSON.stringify(tt)); } catch {} }
else if (process.env.TRANG_THAI) fs.writeFileSync(TT, JSON.stringify(tt));
