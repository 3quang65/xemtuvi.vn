// run: node --test tests/tai-khoan-toi-trong.test.cjs (L-1eec23)
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname, '../src/components/TaiKhoanToi.tsx'), 'utf8');

test('đọc laSoIds và donGanNhat từ /api/toi', () => {
  assert.match(src, /laSoIds/);
  assert.match(src, /donGanNhat/);
});
test('trạng thái rỗng: có câu hướng dẫn và nút hành động', () => {
  assert.match(src, /toi-trong/);
  assert.match(src, /Bạn chưa có lá số nào/);
  assert.match(src, /<Link href="\/" className="nut-chinh nut-lien-ket">Lập lá số đầu tiên<\/Link>/);
});
test('trạng thái rỗng chỉ hiện khi không có lá số và không có đơn', () => {
  assert.match(src, /!coLaSo\s*&&\s*!coDon/);
});
