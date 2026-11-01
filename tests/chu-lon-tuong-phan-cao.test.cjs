// L-502fe5 (FE9): cỡ chữ theo hệ thống + prefers-contrast; không khóa cỡ chữ bằng px ở thân trang.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const css = fs.readFileSync(path.join(__dirname, '../src/app/globals.css'), 'utf8');

test('body dùng rem, không khóa 16px (tôn trọng cỡ chữ hệ thống)', () => {
  const body = css.match(/\nbody \{[^}]*\}/)[0];
  assert.match(body, /font-size:\s*1rem/);
  assert.doesNotMatch(body, /font-size:\s*\d+px/);
});
test('có khối @media (prefers-contrast: more) chỉnh màu chữ phụ, viền, nút', () => {
  const m = css.match(/@media \(prefers-contrast: more\) \{[\s\S]*?\n\}/);
  assert.ok(m, 'thiếu prefers-contrast: more');
  for (const k of ['--muc-nhat', '--vien-dam', '--ngoc']) assert.ok(m[0].includes(k), 'thiếu ' + k);
  assert.match(m[0], /text-decoration:\s*underline/);
});
test('có forced-colors giữ viền nút/ô nhập', () => {
  assert.match(css, /@media \(forced-colors: active\)/);
});
test('trang luận giải/bài đọc không đặt font-size px cố định (trừ hero có clamp)', () => {
  const bad = css.split('\n').filter(l => /\.(trang-buoc|bai-doc|luan-giai)[^{]*\{[^}]*font-size:\s*\d+px/.test(l));
  assert.deepEqual(bad, []);
});
