// Trang /quyen-rieng-tu: có tệp nội dung, trang đọc đúng tệp đó, có link ở chân trang và trong sitemap.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const doc = (r) => fs.readFileSync(path.join(__dirname, '..', r), 'utf8');

test('nội dung có tiêu đề H1', () => {
  assert.match(doc('content/quyen-rieng-tu.md'), /^# Chính sách quyền riêng tư/m);
});
test('trang có metadata, canonical và đọc content/quyen-rieng-tu.md', () => {
  const p = doc('src/app/quyen-rieng-tu/page.tsx');
  assert.match(p, /title:/);
  assert.match(p, /description:/);
  assert.match(p, /canonical: '\/quyen-rieng-tu'/);
  assert.match(p, /quyen-rieng-tu\.md/);
});
test('ChanTrang có link Quyền riêng tư', () => {
  assert.match(doc('src/components/Khung.tsx'), /<a href="\/quyen-rieng-tu">Quyền riêng tư<\/a>/);
});
test('sitemap có /quyen-rieng-tu', () => {
  assert.match(doc('src/app/sitemap.ts'), /\/quyen-rieng-tu/);
});
