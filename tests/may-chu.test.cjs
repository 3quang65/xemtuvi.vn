// Test tích hợp BE2: gọi thẳng các hàm xử lý HTTP với CSDL tạm (không cần mở cổng).
const test = require('node:test');
process.env.MO_GOI_AN = '1'; // gói Thành viên năm đang ẩn; test này kiểm luồng gói năm nên mở lại
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const x = nap('lib/may-chu/xu-ly.ts');
const dv = nap('lib/may-chu/dich-vu.ts');
const ph = nap('lib/may-chu/phien.ts');
const { tra } = require('./_goi-ts.cjs');

process.env.DANG_NHAP_THU = '1';
process.env.CONG_THANH_TOAN = 'gia_lap';
const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
const HOST = 'xemtuvi.test';
const SINH = { lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 10, phut: 30, gioiTinh: 'nu' };

function yc(url, { method = 'GET', body, cookie, origin = 'https://' + HOST } = {}) {
  const h = { host: HOST };
  if (method === 'POST') { h['content-type'] = 'application/json'; if (origin) h.origin = origin; }
  if (cookie) h.cookie = cookie;
  return new Request('https://' + HOST + url, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
}
const j = async (r) => r.json();
const layCookie = (r) => /xtv_phien=([^;]+)/.exec(r.headers.get('set-cookie'))[1];

async function dangNhap(email) {
  const r = await x.dangNhap(yc('/api/dang-nhap', { method: 'POST', body: { nhaCungCap: 'google', email } }), M);
  assert.equal(r.status, 200);
  assert.match(r.headers.get('set-cookie'), /HttpOnly; Secure; SameSite=Lax/);
  return 'xtv_phien=' + layCookie(r);
}
async function mua(cookie, goi, thuong = {}) {
  const ls = await j(await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie, body: { thongTinSinh: SINH } }), M));
  const rd = await x.donHangTao(yc('/api/don-hang', { method: 'POST', cookie, body: { maGoi: goi, laSoId: ls.id, ...thuong } }), M);
  return { ls: ls.id, rd, don: rd.status === 201 ? await j(rd) : null };
}
const traTien = (cookie, donHangId) => x.thanhToanGiaLap(yc('/api/thanh-toan/gia-lap', { method: 'POST', cookie, body: { donHangId } }), M);

test('mua ở máy A, đăng nhập máy B (cookie khác) cùng email: /api/toi cùng quyền', async () => {
  const A = await dangNhap('Khach@Example.vn');
  const { don } = await mua(A, 'tron-la-so');
  assert.equal((await traTien(A, don.id)).status, 200);
  const B = await dangNhap('khach@example.vn');
  assert.notEqual(A, B);
  const a = await j(x.toi(yc('/api/toi', { cookie: A }), M));
  const b = await j(x.toi(yc('/api/toi', { cookie: B }), M));
  assert.equal(a.quyen.length, 1);
  assert.deepEqual(b.quyen, a.quyen);
  assert.equal(b.quyen[0].loai, 'tron_la_so');
  assert.deepEqual(b.laSoIds, a.laSoIds);
});

test('so_tien giả từ trình duyệt bị bỏ qua; giá lấy từ goi.ts', async () => {
  const gia = tra();
  const C = await dangNhap('gia@example.vn');
  const { don } = await mua(C, 'tron-la-so', { soTien: 1, so_tien: 1, giaTien: 1 });
  assert.equal(don.soTien, gia['tron-la-so']);
  assert.equal(M.db.prepare('SELECT so_tien FROM don_hang WHERE id=?').get(don.id).so_tien, gia['tron-la-so']);
});

test('gọi gia-lap 2 lần chỉ cấp 1 quyền', async () => {
  const D = await dangNhap('hai-lan@example.vn');
  const { don } = await mua(D, 'mot-chu-de', { chuDe: 'tinh-cam' });
  const r1 = await j(await traTien(D, don.id)); const r2 = await j(await traTien(D, don.id));
  assert.equal(r1.daCapMoi, true); assert.equal(r2.daCapMoi, false);
  assert.equal(M.db.prepare('SELECT COUNT(*) n FROM quyen_xem WHERE don_hang_id=?').get(don.id).n, 1);
  const t = await j(x.toi(yc('/api/toi', { cookie: D }), M));
  assert.equal(t.quyen.length, 1); assert.equal(t.quyen[0].chuDe, 'tinh-cam');
});

test('thành viên năm hết hạn sau 365 ngày; quyền theo lá số', async () => {
  const E = await dangNhap('tv@example.vn');
  const rd = await x.donHangTao(yc('/api/don-hang', { method: 'POST', cookie: E, body: { maGoi: 'thanh-vien-nam' } }), M);
  assert.equal(rd.status, 201);
  const don = await j(rd);
  await traTien(E, don.id);
  const q = M.db.prepare('SELECT tu_luc, den_luc, la_so_id FROM quyen_xem WHERE don_hang_id=?').get(don.id);
  assert.equal(q.den_luc - q.tu_luc, 365 * 86400000); assert.equal(q.la_so_id, null);
  const uid = M.db.prepare('SELECT nguoi_dung_id n FROM don_hang WHERE id=?').get(don.id).n;
  const ls = dv.luuLaSo(M.db, M.khoa, uid, SINH);
  assert.equal(dv.coQuyenXem(M.db, uid, ls, 'tinh-cam'), true);
  assert.equal(dv.coQuyenXem(M.db, uid, ls, null, q.den_luc + 1), false, 'hết hạn');
  assert.equal(dv.dsQuyen(M.db, uid, q.den_luc + 1).length, 0);
});

test('quyền chủ đề chỉ đúng chủ đề và đúng lá số; không đăng nhập thì không thấy', async () => {
  const F = await dangNhap('cd@example.vn');
  const { ls, don } = await mua(F, 'mot-chu-de', { chuDe: 'su-nghiep' });
  await traTien(F, don.id);
  const uid = M.db.prepare('SELECT nguoi_dung_id n FROM don_hang WHERE id=?').get(don.id).n;
  assert.equal(dv.coQuyenXem(M.db, uid, ls, 'su-nghiep'), true);
  assert.equal(dv.coQuyenXem(M.db, uid, ls, 'tai-chinh'), false);
  assert.equal(dv.coQuyenXem(M.db, uid, 999999, 'su-nghiep'), false);
  assert.equal((await j(x.toi(yc('/api/toi'), M))).dangNhap, false);
});

test('bảo vệ: Origin lạ/thiếu, chưa đăng nhập, đơn của người khác, đơn sai', async () => {
  const G = await dangNhap('g@example.vn'); const H = await dangNhap('h@example.vn');
  const body = { maGoi: 'tron-la-so', laSoId: 1 };
  assert.equal((await x.donHangTao(yc('/api/don-hang', { method: 'POST', cookie: G, body, origin: 'https://xau.example' }), M)).status, 403);
  assert.equal((await x.donHangTao(yc('/api/don-hang', { method: 'POST', cookie: G, body, origin: null }), M)).status, 403);
  assert.equal((await x.donHangTao(yc('/api/don-hang', { method: 'POST', body }), M)).status, 401);
  const { don } = await mua(G, 'tron-la-so');
  assert.equal((await traTien(H, don.id)).status, 404, 'đơn người khác');
  assert.equal((await x.donHangTao(yc('/api/don-hang', { method: 'POST', cookie: G, body: { maGoi: 'mot-chu-de', chuDe: 'xau', laSoId: 1 } }), M)).status, 400);
  assert.equal((await x.donHangTao(yc('/api/don-hang', { method: 'POST', cookie: G, body: { maGoi: 'khong-co', laSoId: 1 } }), M)).status, 400);
  const lsH = await j(await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie: H, body: { thongTinSinh: { ...SINH, nam: 1980 } } }), M));
  assert.equal((await x.donHangTao(yc('/api/don-hang', { method: 'POST', cookie: G, body: { maGoi: 'tron-la-so', laSoId: lsH.id } }), M)).status, 403, 'lá số người khác');
  assert.equal((await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie: G, body: { thongTinSinh: { ...SINH, nam: 1500 } } }), M)).status, 400);
});

test('đăng xuất xóa phiên; tắt cờ thì 404; webhook 501; dữ liệu sinh mã hóa trong CSDL; no-store', async () => {
  const I = await dangNhap('i@example.vn');
  const ls = await j(await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie: I, body: { thongTinSinh: SINH } }), M));
  const ls2 = await j(await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie: I, body: { thongTinSinh: SINH } }), M));
  assert.equal(ls.id, ls2.id, 'lưu trùng không nhân đôi');
  const tho = M.db.prepare('SELECT sinh_ma_hoa s FROM la_so WHERE id=?').get(ls.id).s;
  assert.ok(!tho.includes('1995'));
  const ds = await j(x.laSoDoc(yc('/api/la-so', { cookie: I }), M));
  assert.deepEqual(ds.laSo[0].thongTinSinh, SINH);
  assert.equal(x.toi(yc('/api/toi', { cookie: I }), M).headers.get('cache-control'), 'private, no-store');

  assert.equal((await x.dangXuat(yc('/api/dang-xuat', { method: 'POST', cookie: I }), M)).status, 200);
  assert.equal((await j(x.toi(yc('/api/toi', { cookie: I }), M))).dangNhap, false);

  assert.equal((await x.webhook(yc('/api/thanh-toan/webhook/payos', { method: 'POST' }))).status, 501);
  process.env.DANG_NHAP_THU = '0';
  assert.equal((await x.dangNhap(yc('/api/dang-nhap', { method: 'POST', body: { email: 'z@z.vn' } }), M)).status, 404);
  process.env.DANG_NHAP_THU = '1';
  process.env.CONG_THANH_TOAN = 'khac';
  const J = await dangNhap('j@example.vn');
  const { don } = await mua(J, 'tron-la-so');
  assert.equal((await traTien(J, don.id)).status, 404);
  process.env.CONG_THANH_TOAN = 'gia_lap';
});

test('phiên hết hạn bị từ chối và xóa', () => {
  const id = dv.dangNhapThu(M.db, 'het@example.vn');
  const ma = ph.taoPhien(M.db, id);
  assert.equal(ph.docPhien(M.db, ma), id);
  assert.equal(ph.docPhien(M.db, ma, Date.now() + 91 * 86400000), null);
  assert.equal(ph.docPhien(M.db, ma), null);
  assert.ok(!M.db.prepare('SELECT 1 FROM phien WHERE ma_bam = ?').get(ma), 'CSDL không lưu mã gốc');
});
