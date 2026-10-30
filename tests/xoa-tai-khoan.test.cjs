// Xóa tài khoản và dữ liệu (L-d16fb9): lá số, quyền, cờ đồng ý bị xóa; đơn hàng còn, ẩn danh; ô đồng ý ghi thời điểm và phiên bản câu chữ.
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const x = nap('lib/may-chu/xu-ly.ts');
const { BAN_CHU_LIEN_HE } = nap('lib/may-chu/lien-he.ts');

process.env.DANG_NHAP_THU = '1';
process.env.CONG_THANH_TOAN = 'gia_lap';
const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
const HOST = 'xemtuvi.test';
const SINH = { lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 10, phut: 30, gioiTinh: 'nu' };
const yc = (url, { method = 'GET', body, cookie, origin = 'https://' + HOST } = {}) => {
  const h = { host: HOST };
  if (method === 'POST') { h['content-type'] = 'application/json'; if (origin) h.origin = origin; }
  if (cookie) h.cookie = cookie;
  return new Request('https://' + HOST + url, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
};
const dem = (b, w = '1=1', ...a) => M.db.prepare(`SELECT COUNT(*) n FROM ${b} WHERE ${w}`).get(...a).n;
async function dangNhap(email) {
  const r = await x.dangNhap(yc('/api/dang-nhap', { method: 'POST', body: { nhaCungCap: 'google', email } }), M);
  return 'xtv_phien=' + /xtv_phien=([^;]+)/.exec(r.headers.get('set-cookie'))[1];
}

test('ô đồng ý: mặc định không lưu; có tích thì lưu thời điểm + phiên bản câu chữ, gắn tài khoản nếu đang đăng nhập', async () => {
  const kd = await x.lienHeGhi(yc('/api/lien-he', { method: 'POST', body: { loai: 'email', giaTri: 'a@b.vn' } }), M);
  assert.equal(kd.status, 400);
  assert.equal(dem('lien_he'), 0);
  const ck = await dangNhap('gan@x.vn');
  await x.lienHeGhi(yc('/api/lien-he', { method: 'POST', cookie: ck, body: { loai: 'zalo', giaTri: '0912345678', dongY: true } }), M);
  const d = M.db.prepare('SELECT * FROM lien_he').get();
  assert.equal(d.ban_chu, BAN_CHU_LIEN_HE);
  assert.ok(d.nguoi_dung_id > 0 && d.dong_y_luc > 0);
  M.db.prepare('DELETE FROM lien_he').run();
});

test('xóa tài khoản: cần đăng nhập và xác nhận; xong thì không còn lá số/quyền/đồng ý, đơn còn ẩn danh', async () => {
  const ck = await dangNhap('xoa@x.vn');
  const khac = await dangNhap('giu@x.vn');
  const ls = await (await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie: ck, body: { thongTinSinh: SINH } }), M)).json();
  await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie: khac, body: { thongTinSinh: SINH } }), M);
  const don = await (await x.donHangTao(yc('/api/don-hang', { method: 'POST', cookie: ck, body: { maGoi: 'tron-la-so', laSoId: ls.id } }), M)).json();
  assert.equal((await x.thanhToanGiaLap(yc('/api/thanh-toan/gia-lap', { method: 'POST', cookie: ck, body: { donHangId: don.id } }), M)).status, 200);
  for (const [loai, giaTri] of [['email', 'xoa@x.vn'], ['zalo', '0987654321']]) await x.lienHeGhi(yc('/api/lien-he', { method: 'POST', cookie: ck, body: { loai, giaTri, dongY: true } }), M);
  await x.lienHeGhi(yc('/api/lien-he', { method: 'POST', body: { loai: 'email', giaTri: 'giu@x.vn', dongY: true } }), M);
  await x.nhanTinGhi(yc('/api/nhan-tin', { method: 'POST', body: { email: 'xoa@x.vn', dongY: true } }), M);
  const id = M.db.prepare("SELECT id FROM nguoi_dung WHERE ma_ngoai='xoa@x.vn'").get().id;

  assert.equal((await x.toiXoa(yc('/api/toi/xoa', { method: 'POST', body: { xacNhan: true } }), M)).status, 401);
  assert.equal((await x.toiXoa(yc('/api/toi/xoa', { method: 'POST', cookie: ck, body: {} }), M)).status, 400);
  assert.equal((await x.toiXoa(yc('/api/toi/xoa', { method: 'POST', cookie: ck, body: { xacNhan: true }, origin: 'https://evil.test' }), M)).status, 403);
  assert.equal(dem('la_so', 'nguoi_dung_id=?', id), 1);

  const r = await x.toiXoa(yc('/api/toi/xoa', { method: 'POST', cookie: ck, body: { xacNhan: true } }), M);
  assert.equal(r.status, 200);
  assert.match(r.headers.get('set-cookie'), /xtv_phien=;|Max-Age=0/);
  assert.equal(dem('la_so', 'nguoi_dung_id=?', id), 0);
  assert.equal(dem('quyen_xem', 'nguoi_dung_id=?', id), 0);
  assert.equal(dem('phien', 'nguoi_dung_id=?', id), 0);
  assert.equal(dem('lien_he', "gia_tri IN ('xoa@x.vn','0987654321')"), 0);
  assert.equal(dem('nhan_tin_van_nam', "email='xoa@x.vn'"), 0);
  const nd = M.db.prepare('SELECT * FROM nguoi_dung WHERE id=?').get(id);
  assert.equal(nd.email, null);
  assert.ok(!JSON.stringify(nd).includes('xoa@x.vn'));
  const dh = M.db.prepare('SELECT * FROM don_hang WHERE id=?').get(don.id);
  assert.equal(dh.trang_thai, 'da_tra');
  assert.equal(dh.la_so_id, null);
  // cookie cũ không còn dùng được; người khác không bị ảnh hưởng
  assert.equal((await (await x.toi(yc('/api/toi', { cookie: ck }), M)).json()).dangNhap, false);
  assert.equal(dem('la_so', "nguoi_dung_id=(SELECT id FROM nguoi_dung WHERE ma_ngoai='giu@x.vn')"), 1);
  assert.equal(dem('lien_he', "gia_tri='giu@x.vn'"), 1);
  // đăng ký lại cùng email được tài khoản mới, trống
  const moi = await dangNhap('xoa@x.vn');
  assert.equal((await (await x.laSoDoc(yc('/api/la-so', { cookie: moi }), M)).json()).laSo.length, 0);
});
