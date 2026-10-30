// Dòng giá Vận 2027 + gói gộp (dong-gia-van-2027_v1): so sánh tính từ giá, hạn bán, cổng mở bán.
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const g = nap('lib/goi.ts');
const gop = (bang) => g.goiTheoBang(bang).vanNam.find((x) => x.ma === 'tron-la-so-kem-van-nam');

test('soSanh tính từ giá hiện hành, không gõ cứng', () => {
  const tong = g.goiTheoBang().goi.find((x) => x.ma === 'tron-la-so').gia + g.GIA_VAN_NAM_2027;
  assert.deepEqual(gop().soSanh, [`Mua riêng ${g.dinhDangGia(tong)}`, `tiết kiệm ${g.dinhDangGia(tong - g.GIA_TRON_LA_SO_KEM_VAN_NAM)}`]);
});
test('soSanh đổi theo giá (bảng giá nhánh thử)', () => {
  const a = gop().soSanh;
  const b = gop({ 'van-nam-2027': g.GIA_VAN_NAM_2027 + 10000 }).soSanh;
  assert.notDeepEqual(a, b);
  assert.equal(b[0], `Mua riêng ${g.dinhDangGia(g.giaMuaRiengVaTietKiem().tongMuaRieng + 10000)}`);
});
test('tiết kiệm <= 0 thì không có dòng so sánh', () => {
  assert.equal(gop({ 'tron-la-so-kem-van-nam': 500000 }).soSanh, undefined);
});
test('ngayVN: ngày/tháng/năm không số 0 đầu', () => {
  assert.equal(g.ngayVN('2027-02-06'), '6/2/2027');
  assert.equal(g.ngayVN('2026-12-15'), '15/12/2026');
});
test('dòng chữ hạn bán và dòng gói gộp ở trang luận giải', () => {
  const x = gop();
  assert.equal(g.dongHanBan(x), 'Bán đến hết 6/2/2027');
  assert.equal(g.dongGoiGop(x), `Gói gộp: mua riêng ${x.soSanh[0].slice(10)} · ${x.soSanh[1]} · bán đến hết 6/2/2027`);
  assert.equal(g.dongHanBan(g.goiTheoBang().vanNam[0]), null);
});
test('sau hết 6/2/2027 giờ VN thẻ gộp ẩn, thẻ lẻ còn', () => {
  const ds = g.goiTheoBang().vanNam;
  const ma = (t) => g.goiDangBan(ds, Date.parse(t)).map((x) => x.ma);
  assert.deepEqual(ma('2027-02-06T23:00:00+07:00'), ['van-nam-2027', 'tron-la-so-kem-van-nam']);
  assert.deepEqual(ma('2027-02-07T00:01:00+07:00'), ['van-nam-2027']);
});
test('khu bán Vận ẩn khi cổng đóng: trước 15/12 hoặc cờ Thư tắt', () => {
  const ds = g.goiTheoBang().vanNam;
  const t = (s) => Date.parse(s);
  assert.deepEqual(g.khuVanNam(ds, t('2026-12-20T09:00:00+07:00'), false), []);
  assert.deepEqual(g.khuVanNam(ds, t('2026-12-09T23:00:00+07:00'), true), []);
  assert.deepEqual(g.khuVanNam(ds, t('2026-12-14T23:00:00+07:00'), true), []);
  assert.equal(g.khuVanNam(ds, t('2026-12-15T00:00:00+07:00'), true).length, 2);
  assert.deepEqual(g.khuVanNam(ds, t('2027-02-07T09:00:00+07:00'), true).map((x) => x.ma), ['van-nam-2027']);
  assert.equal(g.khuVanNam(ds, t('2027-02-10T09:00:00+07:00'), true).length, 1);
});
test('chữ dẫn khu Vận: 2 thẻ và 1 thẻ', () => {
  const ds = g.goiTheoBang().vanNam;
  assert.match(g.chuDanVanNam(ds), /Mua lẻ hoặc gộp/);
  assert.equal(g.chuDanVanNam(ds.slice(0, 1)), 'Luận riêng năm 2027 cho lá số này.');
});

test('L-eb6204 B2: thẻ gộp render MỘT dòng chữ thường, số từ biến', () => {
  const fs = require('node:fs');
  const src = fs.readFileSync(require('node:path').join(__dirname, '../src/components/ThanGoi.tsx'), 'utf8');
  assert.match(src, /<p className="so-sanh">\{g\.soSanh\.join\(' · '\)\}<\/p>/);
  const css = fs.readFileSync(require('node:path').join(__dirname, '../src/app/globals.css'), 'utf8');
  assert.doesNotMatch(css, /\.khu-van-nam \.so-sanh li/);
  assert.doesNotMatch(css, /text-transform: uppercase/);
  const x = gop(); const { tongMuaRieng, tietKiem } = g.giaMuaRiengVaTietKiem();
  assert.equal(x.soSanh.join(' · '), `Mua riêng ${g.dinhDangGia(tongMuaRieng)} · tiết kiệm ${g.dinhDangGia(tietKiem)}`);
});
