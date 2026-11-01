// L-3ff71c (FE13): hiệu ứng chuyển bước trong form lập lá số, tắt khi prefers-reduced-motion.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const css = fs.readFileSync(path.join(__dirname, '../src/app/globals.css'), 'utf8');
const tsx = fs.readFileSync(path.join(__dirname, '../src/components/LapLaSo.tsx'), 'utf8');

test('có keyframes chuyển bước tiến và lùi, .buoc-vao dùng animation', () => {
  assert.match(css, /@keyframes buoc-tien/);
  assert.match(css, /@keyframes buoc-lui/);
  assert.match(css, /\.buoc-vao\s*\{[^}]*animation:[^}]*buoc-tien/);
  assert.match(css, /\.buoc-vao\.lui\s*\{[^}]*animation-name:\s*buoc-lui/);
});
test('khối reduced-motion tắt animation của .buoc-vao', () => {
  const m = css.match(/@media \(prefers-reduced-motion: reduce\) \{[^@]*\.buoc-vao[^}]*animation:\s*none/);
  assert.ok(m, 'reduced-motion chưa tắt .buoc-vao');
});
test('hiệu ứng chỉ dùng opacity/transform (mượt, không giật bố cục)', () => {
  const k = css.match(/@keyframes buoc-tien \{[\s\S]*?\n\}/)[0];
  assert.doesNotMatch(k, /(height|width|margin|top|left)\s*:/);
});
test('LapLaSo gắn buoc-vao cho khu nước ngoài và kết quả', () => {
  assert.ok((tsx.match(/buoc-vao/g) || []).length >= 2);
});
