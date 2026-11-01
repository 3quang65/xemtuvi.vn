// L-7ec4be: màn ngang điện thoại (667x375, rộng >640 nên khối max-width:640px không áp dụng) vẫn phải có ô chạm >= 44px.
// Đo thật bằng Playwright: docs/kiem-thu/anh-L-7ec4be/do-ngang.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const css = fs.readFileSync(path.join(__dirname, '..', 'src/app/globals.css'), 'utf8');

function khoi(dau) {
  const i = css.indexOf(dau); if (i < 0) return null;
  let j = i + dau.length, d = 1;
  while (d > 0 && j < css.length) { const c = css[j++]; if (c === '{') d++; else if (c === '}') d--; }
  return css.slice(i + dau.length, j - 1);
}

test('màn ngang thấp (max-height:500px, landscape) có min-height 44px cho liên kết chân trang, logo, "Sinh ở nước ngoài?"', () => {
  const k = khoi('@media (max-height: 500px) and (orientation: landscape) {');
  assert.ok(k, 'thiếu khối @media màn ngang thấp');
  for (const s of ['footer a', '.ten-trang', '.lk-nho']) {
    assert.ok(k.includes(s), `thiếu luật cho ${s}`);
  }
  assert.ok(/min-height:\s*44px/.test(k), 'thiếu min-height: 44px');
  assert.ok(/min-width:\s*44px/.test(k), 'thiếu min-width: 44px');
});
