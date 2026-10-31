// Cờ công bố giá và gói ẩn (L-b19e60).
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const goi = nap('lib/goi.ts');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const dv = nap('lib/may-chu/dich-vu.ts');

test('cờ công bố giá mặc định BẬT: giaCongBo trả giá đúng goi.ts; gói lạ thì null (L-d7cd2b)', () => {
  assert.equal(goi.CONG_BO_GIA, true);
  assert.equal(goi.giaCongBo('mot-chu-de'), '29.000đ');
  assert.equal(goi.giaCongBo('tron-la-so'), '99.000đ');
  assert.equal(goi.giaCongBo('van-nam-2027'), '49.000đ');
  assert.equal(goi.giaCongBo('tron-la-so-kem-van-nam'), '129.000đ');
  assert.equal(goi.giaCongBo('khong-co'), null);
});

test('cờ tắt (truyền tường minh): giaCongBo không trả số nào', () => {
  for (const ma of ['mot-chu-de', 'tron-la-so', 'thanh-vien-nam']) assert.equal(goi.giaCongBo(ma, false), null);
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

test('giaHienThi (/chon-goi, /thanh-toan): mặc định hiện giá thật, không còn chữ "Sẽ công bố"; cờ tắt vẫn hiện chữ trung tính (L-d7cd2b)', () => {
  assert.equal(goi.giaHienThi(99000), '99.000đ');
  assert.equal(goi.giaHienThi(29000), '29.000đ');
  assert.equal(goi.giaHienThi(99000, false), goi.CHU_CHUA_CONG_BO);
  assert.doesNotMatch(goi.giaHienThi(29000, false), /\d/);
  for (const g of [...goi.GOI, ...goi.GOI_VAN_NAM]) assert.doesNotMatch(goi.giaHienThi(g.gia), /công bố/);
});

test('câu hoàn tiền (gắn thanh toán thật) vẫn TẮT, tách khỏi cờ giá', () => {
  assert.equal(goi.CONG_BO_HOAN_TIEN, false);
});
