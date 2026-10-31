// Trang /phuong-phap: có tệp nội dung, trang đọc đúng tệp đó, có link ở chân trang, sitemap và trang chọn gói.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const doc = (r) => fs.readFileSync(path.join(__dirname, '..', r), 'utf8');

test('nội dung có H1 và mục Trường phái', () => {
  const md = doc('content/phuong-phap.md');
  assert.match(md, /^# Phương pháp & nguồn/m);
  assert.match(md, /^## Trường phái/m);
});
test('trang có metadata, canonical, index và đọc content/phuong-phap.md', () => {
  const p = doc('src/app/phuong-phap/page.tsx');
  assert.match(p, /title:/);
  assert.match(p, /description:/);
  assert.match(p, /canonical: '\/phuong-phap'/);
  assert.match(p, /index: true/);
  assert.match(p, /phuong-phap\.md/);
  assert.match(p, /<h1>Phương pháp &amp; nguồn<\/h1>/);
});
test('ChanTrang có link Phương pháp & nguồn', () => {
  assert.match(doc('src/components/Khung.tsx'), /<a href="\/phuong-phap">Phương pháp &amp; nguồn<\/a>/);
});
test('sitemap có /phuong-phap', () => {
  assert.match(doc('src/app/sitemap.ts'), /\/phuong-phap/);
});
test('trang chọn gói có link /phuong-phap, ngoài nút mua', () => {
  const c = doc('src/components/ChonGoi.tsx');
  assert.match(c, /href="\/phuong-phap"/);
  assert.match(c, /Luận giải dựa trên 948 quy tắc/);
});
