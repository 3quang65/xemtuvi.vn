// In phễu mua từ các file sự kiện. Chạy: node tools/pheu.cjs  (DATA_DIR=… để đổi thư mục)
const fs = require('fs');
const os = require('os');
const path = require('path');
const { TEN_SU_KIEN } = require('../src/lib/su-kien.js');

function thuMucMacDinh() { return process.env.DATA_DIR || path.join(os.homedir(), 'xemtuvi-data', 'su-kien'); }

function docThuMuc(dir) {
  if (!fs.existsSync(dir)) return [];
  const ra = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.jsonl')).sort()) {
    for (const l of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) {
      if (!l.trim()) continue;
      try { const o = JSON.parse(l); if (o && o.ten && o.phien) ra.push(o); } catch { /* bỏ dòng hỏng */ }
    }
  }
  return ra;
}

const chia = (a, b) => (b ? a / b : null);

function tinhPheu(dongs) {
  const phienTheoSk = Object.fromEntries(TEN_SU_KIEN.map((t) => [t, new Set()]));
  const trangTheoPhien = new Map();
  for (const d of dongs) {
    if (!phienTheoSk[d.ten]) continue;
    phienTheoSk[d.ten].add(d.phien);
    if (!trangTheoPhien.has(d.phien)) trangTheoPhien.set(d.phien, new Set());
    if (d.trang) trangTheoPhien.get(d.phien).add(d.trang);
  }
  const phien = Object.fromEntries(TEN_SU_KIEN.map((t) => [t, phienTheoSk[t].size]));
  const xong = [...phienTheoSk.thanh_toan_xong];
  const soMan = xong.map((p) => trangTheoPhien.get(p).size);
  return {
    phien,
    tiLe: {
      lapTrenVao: chia(phien.lap_la_so, phien.vao_form),
      bamTrenLap: chia(phien.bam_xem_sau, phien.lap_la_so),
      muaTrenBam: chia(phien.thanh_toan_xong, phien.bam_xem_sau),
    },
    soManTrungBinh: soMan.length ? soMan.reduce((a, b) => a + b, 0) / soMan.length : null,
  };
}

const pct = (x) => (x === null ? 'chưa có dữ liệu' : (x * 100).toFixed(1) + '%');

function in_(p) {
  console.log('Số phiên theo sự kiện');
  for (const t of TEN_SU_KIEN) console.log('  ' + t.padEnd(16) + p.phien[t]);
  console.log('Tỉ lệ');
  console.log('  lap_la_so / vao_form          ' + pct(p.tiLe.lapTrenVao) + '  (mục tiêu ≥ 70%)');
  console.log('  bam_xem_sau / lap_la_so       ' + pct(p.tiLe.bamTrenLap));
  console.log('  thanh_toan_xong / bam_xem_sau ' + pct(p.tiLe.muaTrenBam));
  console.log('Số màn hình trung bình của phiên đã thanh toán: ' + (p.soManTrungBinh === null ? 'chưa có' : p.soManTrungBinh.toFixed(1)) + '  (tối đa 4)');
}

if (require.main === module) {
  const dir = thuMucMacDinh();
  const dongs = docThuMuc(dir);
  console.log('Thư mục: ' + dir + ' · ' + dongs.length + ' dòng');
  in_(tinhPheu(dongs));
}

module.exports = { tinhPheu, docThuMuc };
