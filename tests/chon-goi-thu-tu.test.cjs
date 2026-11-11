// L-c094a7 F5: gói chính (Trọn lá số, khuyên dùng) lên trước; khu Vận năm xuống sau, trừ khi khách vào từ ý định Vận năm.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const src = fs.readFileSync(require('node:path').join(__dirname, '..', 'src/components/ChonGoi.tsx'), 'utf8');

test('khu Vận năm mặc định xếp sau gói chính, ý định Vận năm thì lên đầu', () => {
  assert.match(src, /style=\{\{ order: uuTienVanNam \? -1 : 1 \}\}/);
});
test('lưới gói chính không bị đẩy xuống', () => {
  assert.match(src, /<ul className="luoi-goi" style=\{\{ order: 0 \}\}>/);
});
