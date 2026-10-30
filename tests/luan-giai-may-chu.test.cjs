// BE3: luận giải sinh + khóa phía máy chủ.
const test = require('node:test');
process.env.MO_GOI_AN = '1'; // gói Thành viên năm đang ẩn; test này kiểm luồng gói năm nên mở lại
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const x = nap('lib/may-chu/xu-ly.ts');
require('./_dang-nhap.cjs')(x);

process.env.DANG_NHAP_THU = '1'; process.env.EMAIL_THU_CHO_PHEP = '@example.vn';
process.env.CONG_THANH_TOAN = 'gia_lap';
process.env.NHAT_KY_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'nhat-ky-'));
const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
const HOST = 'xemtuvi.test';
const SINH = { lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 10, phut: 30, gioiTinh: 'nu' };

function yc(url, { method = 'GET', body, cookie } = {}) {
  const h = { host: HOST };
  if (method === 'POST') { h['content-type'] = 'application/json'; h.origin = 'https://' + HOST; }
  if (cookie) h.cookie = cookie;
  return new Request('https://' + HOST + url, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
}
const j = (r) => r.json();
async function khach(email, goi, thuong = {}) {
  const r = await x.dangNhap(yc('/api/dang-nhap', { method: 'POST', body: { email } }), M);
  const cookie = 'xtv_phien=' + /xtv_phien=([^;]+)/.exec(r.headers.get('set-cookie'))[1];
  const ls = await j(await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie, body: { thongTinSinh: SINH } }), M));
  if (goi) {
    const don = await j(await x.donHangTao(yc('/api/don-hang', { method: 'POST', cookie, body: { maGoi: goi, laSoId: ls.id, ...thuong } }), M));
    await x.thanhToanGiaLap(yc('/api/thanh-toan/gia-lap', { method: 'POST', cookie, body: { donHangId: don.id } }), M);
  }
  return { cookie, laSo: ls.id };
}
const lay = (k, cd, laSo = k.laSo) => x.luanGiai(yc(`/api/luan-giai?laSo=${laSo}&chuDe=${cd}`, { cookie: k.cookie }), M);

test('chưa đăng nhập: 401, không nội dung', async () => {
  const r = await x.luanGiai(yc('/api/luan-giai?laSo=1&chuDe=ban-than'), M);
  assert.equal(r.status, 401);
  assert.equal(r.headers.get('cache-control'), 'private, no-store');
});

test('chưa mua: 403 không kèm nội dung luận giải', async () => {
  const k = await khach('chua-mua@example.vn');
  const r = await lay(k, 'ban-than');
  assert.equal(r.status, 403);
  const t = await r.text();
  assert.ok(!t.includes('nhanDinh') && !t.includes('thamChieu') && t.length < 200, t);
  assert.equal(r.headers.get('cache-control'), 'private, no-store');
});

test('mua 1 chủ đề: đúng chuyên đề 200, chủ đề khác 403', async () => {
  const k = await khach('mot-cd@example.vn', 'mot-chu-de', { chuDe: 'ban-than' });
  const ok = await lay(k, 'ban-than');
  assert.equal(ok.status, 200);
  assert.equal(ok.headers.get('cache-control'), 'private, no-store');
  const b = await j(ok);
  assert.equal(b.chuyenDe, 'menh');
  assert.ok(b.muc.length > 0 && b.muc[0].nhanDinh[0].thamChieu.nguon);
  assert.equal((await lay(k, 'tinh-cam')).status, 403);
  assert.equal((await lay(k, 'van-10-nam')).status, 403);
});

test('lá số của người khác: 403', async () => {
  const a = await khach('a-chu@example.vn', 'tron-la-so');
  const b = await khach('b-la@example.vn');
  assert.equal((await lay(b, 'ban-than', a.laSo)).status, 403);
});

test('tham số sai: 400', async () => {
  const k = await khach('sai@example.vn', 'tron-la-so');
  assert.equal((await lay(k, 'khong-co')).status, 400);
  assert.equal((await x.luanGiai(yc('/api/luan-giai?chuDe=ban-than', { cookie: k.cookie }), M)).status, 400);
});

test('trọn lá số: mọi chuyên đề có nội dung, kể cả Tài chính và Gia đạo', async () => {
  const k = await khach('tron@example.vn', 'tron-la-so');
  for (const cd of ['ban-than', 'tinh-cam', 'su-nghiep', 'tai-chinh', 'gia-dao']) assert.equal((await lay(k, cd)).status, 200, cd);
  assert.equal((await lay(k, 'van-10-nam')).status, 200);
  const tc = await j(await lay(k, 'tai-chinh')), gd = await j(await lay(k, 'gia-dao'));
  assert.equal(tc.chuyenDe, 'tai-bach');
  assert.equal(gd.chuyenDe, 'dien-trach');
  assert.ok(tc.muc.length && gd.muc.length, 'có ít nhất một mục luận');
});

test('mua lẻ chủ đề đang bán: người đã mua xem được (200), chủ đề khác bị chặn (403)', async () => {
  const a = await khach('tc-mua@example.vn', 'mot-chu-de', { chuDe: 'su-nghiep' });
  assert.equal((await lay(a, 'su-nghiep')).status, 200);
  assert.equal((await lay(a, 'tinh-cam')).status, 403);
});

test('bộ nhớ đệm: lưu mã hóa, lần hai đọc từ đệm, kết quả giống hệt', async () => {
  const k = await khach('dem@example.vn', 'tron-la-so');
  const a = await j(await lay(k, 'su-nghiep'));
  const n = M.db.prepare('SELECT COUNT(*) n FROM luan_giai_luu').get().n;
  assert.ok(n >= 1);
  const hang = M.db.prepare('SELECT * FROM luan_giai_luu').all();
  const cau = a.muc[0].nhanDinh[0].text;
  for (const h of hang) assert.ok(!h.noi_dung_ma_hoa.includes(cau.slice(0, 20)), 'không lưu bản rõ');
  const b = await j(await lay(k, 'su-nghiep'));
  assert.deepEqual(b, a);
  assert.equal(M.db.prepare('SELECT COUNT(*) n FROM luan_giai_luu').get().n, n);
});

test('thành viên năm xem được lá số đầu; hết hạn thì 403', async () => {
  const k = await khach('tv@example.vn', 'thanh-vien-nam');
  assert.equal((await lay(k, 'ban-than')).status, 200);
  M.db.prepare("UPDATE quyen_xem SET den_luc=1 WHERE loai='thanh_vien' AND nguoi_dung_id=(SELECT id FROM nguoi_dung WHERE email='tv@example.vn')").run();
  assert.equal((await lay(k, 'ban-than')).status, 403);
});

test('nhật ký lỗi: ghi đúng trường, không lộ email', async () => {
  const nk = nap('lib/may-chu/nhat-ky.ts');
  nk.ghiLoi('route', '/api/thu', 'thu_nghiem', 'lỗi thử');
  const tep = fs.readdirSync(process.env.NHAT_KY_DIR).find((t) => /^loi-\d{4}-\d\d-\d\d\.jsonl$/.test(t));
  const o = JSON.parse(fs.readFileSync(path.join(process.env.NHAT_KY_DIR, tep), 'utf8').trim().split('\n').pop());
  assert.deepEqual(Object.keys(o).sort(), ['ma_loi', 'muc', 'route', 't', 'thong_diep']);
});

test('robots chặn /api/, /luan-giai, /thanh-toan; trang noindex', () => {
  const src = fs.readFileSync(path.join(__dirname, '../src/app/robots.ts'), 'utf8');
  for (const p of ['/api/', '/luan-giai', '/thanh-toan']) assert.ok(src.includes(`'${p}'`), p);
  for (const t of ['luan-giai', 'thanh-toan']) assert.match(fs.readFileSync(path.join(__dirname, `../src/app/${t}/page.tsx`), 'utf8'), /index: false/);
});

// Cần `npm run build` trước; bỏ qua nếu chưa có .next.
test('JS gửi xuống trình duyệt không chứa câu luận giải trả phí', { skip: !fs.existsSync(path.join(__dirname, '../.next/static')) }, () => {
  const goc = path.join(__dirname, '../src/lib/luan-giai/ai');
  const cong = new Set(JSON.stringify([require('../src/lib/luan-giai/menh-chinh-tinh.json'), require('../src/lib/luan-giai/doan-mau.json')]).split(/["\\]/));
  const cau = [];
  const them = (v) => { if (Array.isArray(v)) v.forEach(them); else if (v && typeof v === 'object') { if (typeof v.noiDung === 'string') cau.push(v.noiDung); Object.values(v).forEach(them); } };
  for (const f of ['quy-tac.json', 'quy-tac-khung.json', 'quy-tac-van/van-10-nam.json']) them(require(path.join(goc, f)));
  if (fs.existsSync(path.join(goc, 'quy-tac-v2'))) for (const f of fs.readdirSync(path.join(goc, 'quy-tac-v2'))) if (f.endsWith('.json')) them(require(path.join(goc, 'quy-tac-v2', f)));
  const dai = cau.map((c) => c.replace(/\{[a-z]+\}.*/, '').trim().slice(0, 40)).filter((c) => c.length >= 25 && !cong.has(c) && ![...cong].some((p) => p.includes(c)));
  assert.ok(dai.length > 50, 'phải có đủ câu mẫu để kiểm');
  const js = [];
  (function duyet(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) duyet(p); else if (p.endsWith('.js')) js.push(fs.readFileSync(p, 'utf8')); } })(path.join(__dirname, '../.next/static'));
  const kho = js.join('\n');
  const lo = dai.filter((c) => kho.includes(c));
  assert.deepEqual(lo, []);
});
