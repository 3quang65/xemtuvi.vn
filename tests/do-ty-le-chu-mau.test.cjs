// L-9279a8 (B1): đo tyLeChuMau = % từ của bài nằm trong chuỗi >= 8 từ liên tiếp trùng noiDung một quy tắc.
const test = require('node:test');
const assert = require('node:assert/strict');
const { tachTu, tyLeChuMau, baiThanhVanBan } = require('../tools/lib/chu-mau.cjs');

const QT = ['Tử Vi tại Mệnh: bạn có xu hướng thích giữ vai trò dẫn dắt, coi trọng thể diện.'];

test('tách từ: chữ thường, bỏ dấu câu, giữ dấu tiếng Việt', () => {
  assert.deepEqual(tachTu('Tử Vi, tại "Mệnh": ĐÂY là—ví dụ.'), ['tử', 'vi', 'tại', 'mệnh', 'đây', 'là', 'ví', 'dụ']);
});
test('bài toàn chữ mẫu = 100', () => {
  assert.equal(tyLeChuMau(QT[0], QT), 100);
});
test('bài không trùng = 0', () => {
  assert.equal(tyLeChuMau('Hôm nay trời đẹp và tôi đi dạo quanh hồ một vòng dài rất lâu.', QT), 0);
});
test('ngưỡng: trùng 7 từ = 0, trùng 8 từ = chỉ 8 từ đó', () => {
  const m = 'một hai ba bốn năm sáu bảy tám chín mười';
  assert.equal(tyLeChuMau('x một hai ba bốn năm sáu bảy y', [m]), 0); // 7 từ
  const r = tyLeChuMau('x một hai ba bốn năm sáu bảy tám y', [m]); // 8 từ / 10 từ
  assert.equal(r, 80);
});
test('khác dấu tiếng Việt không tính là trùng', () => {
  assert.equal(tyLeChuMau('ma hai ba bốn năm sáu bảy tám', ['mà hai ba bốn năm sáu bảy tám']), 0);
});
test('hai đoạn trùng nằm chồng lên nhau không đếm hai lần; bài rỗng = 0', () => {
  const m = 'a1 a2 a3 a4 a5 a6 a7 a8 a9 a10';
  assert.equal(tyLeChuMau('a1 a2 a3 a4 a5 a6 a7 a8 a9 a10', [m]), 100);
  assert.equal(tyLeChuMau('', [m]), 0);
});
test('baiThanhVanBan gom text các nhận định của mọi mục', () => {
  assert.equal(baiThanhVanBan({ muc: [{ nhanDinh: [{ text: 'a' }, { text: 'b' }] }, { nhanDinh: [{ text: 'c' }] }] }), 'a\nb\nc');
});
