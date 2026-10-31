// L-c8a890: tốc độ + bố cục di động (D1 CLS khi lá số hiện). Kiểm tra nguồn; số đo thật: docs/kiem-thu/toc-do-di-dong.md.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const doc = (p) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const css = doc('src/app/globals.css');

test('D1: khi lá số hiện, phần giới thiệu bên dưới ẩn đi thay vì bị đẩy xuống (tránh CLS 0.35)', () => {
  assert.match(css, /main:has\(\.ket-qua\)\s+\.gioi-thieu\s*\{[^}]*display:\s*none/);
});

test('D3: phien.ts (nạp ở layout cho mọi trang) không kéo engine lập lá số vào gói JS', () => {
  const p = doc('src/lib/phien.ts');
  assert.doesNotMatch(p, /import\s+(?!type\b)[^;]*from\s+'@\/lib\/tuvi'/);
  assert.doesNotMatch(p, /lapLaSo\(/);
  assert.match(doc('src/lib/useLaSoDaLuu.ts'), /lapLaSo/);
});

test('D2: tiêu đề và câu dẫn của /chon-goi render từ máy chủ (không chờ hydrate)', () => {
  const trang = doc('src/app/chon-goi/page.tsx');
  assert.match(trang, /<h1>Chọn gói luận giải<\/h1>/);
  assert.doesNotMatch(doc('src/components/ChonGoi.tsx'), /<h1>/);
});

const mobile = css.slice(css.indexOf('@media (max-width: 640px)'));
test('L1: nhãn tứ hóa trong ô bàn >= 0,72rem (11,5px) trên điện thoại', () => {
  assert.match(mobile, /\.ban \.sao \.hoa\s*\{[^}]*font-size:\s*0\.72rem/);
});

test('L3: nút đổi năm ‹ › giữ rộng 44px, không bị co lại trong hàng flex', () => {
  assert.match(mobile, /\.nam-xem button\s*\{[^}]*flex:\s*0 0 44px/);
});
