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
