// Kiểm thử hàm chọn đoạn luận Mệnh cho phần tóm tắt miễn phí.
const test = require('node:test');
const assert = require('node:assert/strict');
const { chonDoanMenh } = require('../src/lib/luan-giai/chon-doan.js');
const DL = require('../src/lib/luan-giai/menh-chinh-tinh.json');

test('Sao miếu: Tử Vi miếu → MENH-TV-01, chép nguyên văn, có nguồn rút gọn', () => {
  const r = chonDoanMenh([{ ten: 'Tử Vi', dacTinh: 'M' }]);
  assert.equal(r.voChinhDieu, false);
  assert.deepEqual(r.doan.map((d) => d.ma), ['MENH-TV-01']);
  assert.match(r.doan[0].cau, /^Miếu ở Dần, Thân, Tỵ, Ngọ \(M\)/);
  assert.deepEqual(r.doan[0].nguon, ['Tân Biên', 'Toàn Thư']);
});

test('Sao hãm: Liêm Trinh hãm → MENH-LT-02 (không lấy quy tắc miếu)', () => {
  const r = chonDoanMenh([{ ten: 'Liêm Trinh', dacTinh: 'H' }]);
  assert.deepEqual(r.doan.map((d) => d.ma), ['MENH-LT-02']);
});

test('Độ sáng đắc dùng quy tắc miếu/vượng/đắc; bình dùng quy tắc bình', () => {
  assert.deepEqual(chonDoanMenh([{ ten: 'Thiên Phủ', dacTinh: 'Đ' }]).doan.map((d) => d.ma), ['MENH-TP-01']);
  assert.deepEqual(chonDoanMenh([{ ten: 'Thiên Phủ', dacTinh: 'B' }]).doan.map((d) => d.ma), ['MENH-TP-02']);
});

test('Chưa có quy tắc cho độ sáng đó thì không ép: Thất Sát vượng → không đoạn', () => {
  const r = chonDoanMenh([{ ten: 'Thất Sát', dacTinh: 'V' }]);
  assert.deepEqual(r.doan, []);
});

test('Hai chính tinh đồng cung: mỗi sao một đoạn, tối đa 2', () => {
  const r = chonDoanMenh([{ ten: 'Tử Vi', dacTinh: 'M' }, { ten: 'Thiên Phủ', dacTinh: 'M' }]);
  assert.deepEqual(r.doan.map((d) => d.ma), ['MENH-TV-01', 'MENH-TP-01']);
});

test('Mệnh vô chính diệu → CHUNG-VCD-01 và có nguồn', () => {
  const r = chonDoanMenh([]);
  assert.equal(r.voChinhDieu, true);
  assert.deepEqual(r.doan.map((d) => d.ma), ['CHUNG-VCD-01']);
  assert.match(r.doan[0].cau, /mượn chính tinh/);
  assert.ok(r.doan[0].nguon.includes('Toàn Thư'));
});

test('Dữ liệu: đủ 14 chính tinh, không còn ghi chú nội bộ, mã không trùng', () => {
  assert.equal(Object.keys(DL.menh).length, 14);
  const tatCa = Object.values(DL.menh).flat().concat(DL.voChinhDieu);
  assert.equal(new Set(tatCa.map((r) => r.ma)).size, tatCa.length);
  for (const r of tatCa) assert.doesNotMatch(r.cau, /đã trung tính hóa|⚑/);
});

test('Quy tắc cần sao đi kèm không hiện khi chưa xét sao phụ: Thất Sát hãm, Thiên Tướng hãm → không đoạn', () => {
  assert.equal(chonDoanMenh([{ ten: 'Thất Sát', dacTinh: 'H' }]).doan.length, 0);
  assert.equal(chonDoanMenh([{ ten: 'Thiên Tướng', dacTinh: 'H' }]).doan.length, 0);
});
