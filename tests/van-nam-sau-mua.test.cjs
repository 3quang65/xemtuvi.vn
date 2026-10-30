// P19: nhắc sau mua gói Vận 2027 (combo, lưu nguyệt chỉ bật khi P18 xong).
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const tg = nap('lib/tro-giup.ts');
const goi = nap('lib/goi.ts');

test('gói không phải Vận 2027 thì không có nhắc', () => {
  for (const ma of ['mot-chu-de', 'tron-la-so', 'thanh-vien-nam']) assert.equal(tg.nhacSauMuaVanNam(ma, true), null);
});
test('mua lẻ: có gợi ý Trọn lá số, có link chọn gói, không giá/hạn chót/ép mua', () => {
  const n = tg.nhacSauMuaVanNam('van-nam-2027');
  assert.equal(n.combo.href, '/chon-goi');
  assert.doesNotMatch(n.dongCombo, /\d+\s?(đ|k)\b|hết hạn|chỉ còn|nhanh tay|tiết kiệm/i);
});
test('mua gói gộp: báo đã gồm cả hai, không link mua thêm', () => {
  const n = tg.nhacSauMuaVanNam('tron-la-so-kem-van-nam');
  assert.equal(n.combo, null);
  assert.match(n.dongCombo, /đã gồm/);
});
test('lưu nguyệt: cờ P18 mặc định TẮT; bật thì mới có câu nhắc', () => {
  assert.equal(goi.LUU_NGUYET_SAN_SANG, false);
  assert.equal(tg.nhacSauMuaVanNam('van-nam-2027').luuNguyet, null);
  assert.equal(tg.nhacSauMuaVanNam('tron-la-so-kem-van-nam').luuNguyet, null);
  assert.match(tg.nhacSauMuaVanNam('van-nam-2027', true).luuNguyet, /hủy/);
});
