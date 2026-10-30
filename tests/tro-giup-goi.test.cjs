// Cờ công bố giá và gói ẩn (L-b19e60).
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const goi = nap('lib/goi.ts');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const dv = nap('lib/may-chu/dich-vu.ts');

test('cờ công bố giá mặc định TẮT: giaCongBo không trả số nào', () => {
  assert.equal(goi.CONG_BO_GIA, false);
  for (const ma of ['mot-chu-de', 'tron-la-so', 'thanh-vien-nam']) assert.equal(goi.giaCongBo(ma), null);
});

test('cờ bật: giá lấy đúng từ goi.ts, gói lạ thì null', () => {
  assert.equal(goi.giaCongBo('tron-la-so', true), goi.dinhDangGia(goi.layGoi('tron-la-so').gia));
  assert.equal(goi.giaCongBo('mot-chu-de', true), goi.dinhDangGia(goi.layGoi('mot-chu-de').gia));
  assert.equal(goi.giaCongBo('khong-co', true), null);
});

test('Thành viên năm là gói ẩn, dữ liệu vẫn còn; goiDangBan bỏ gói ẩn', () => {
  const nam = goi.GOI.find((g) => g.ma === 'thanh-vien-nam');
  assert.equal(nam.an, true);
  assert.equal(nam.gia, 299000);
  assert.deepEqual(goi.goiDangBan(goi.GOI).map((g) => g.ma), ['mot-chu-de', 'tron-la-so']);
  assert.equal(goi.goiDangBan(goi.goiTheoBang({ 'thanh-vien-nam': 199000 }).goi).length, 2);
});

test('máy chủ từ chối tạo đơn gói ẩn; MO_GOI_AN=1 (test nâng gói) thì cho', () => {
  const db = moCsdl(':memory:');
  const nd = dv.dangNhapThu(db, 'a@example.vn');
  delete process.env.MO_GOI_AN;
  assert.throws(() => dv.taoDon(db, nd, { maGoi: 'thanh-vien-nam' }), (e) => e.ma === 'goi_an');
  assert.equal(db.prepare('SELECT COUNT(*) n FROM don_hang').get().n, 0);
  process.env.MO_GOI_AN = '1';
  try { assert.equal(dv.taoDon(db, nd, { maGoi: 'thanh-vien-nam' }).maGoi, 'thanh-vien-nam'); } finally { delete process.env.MO_GOI_AN; }
});

test('giaHienThi (/chon-goi, /thanh-toan): cờ tắt hiện chữ trung tính, không số; cờ bật hiện giá đúng (L-1964d2)', () => {
  assert.equal(goi.giaHienThi(99000), goi.CHU_CHUA_CONG_BO);
  assert.doesNotMatch(goi.giaHienThi(29000), /\d/);
  assert.equal(goi.giaHienThi(99000, true), goi.dinhDangGia(99000));
});
