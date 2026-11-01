const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { lapLaSo } = nap('lib/tuvi/index.ts');
const { laSoView, VI_TRI_CHI } = nap('lib/xemtuvi-moi/view.ts');
const fs = require('node:fs'); const path = require('node:path');

const ls = lapLaSo({ lich: 'duong', ngay: 15, thang: 6, nam: 1990, gio: 10, gioiTinh: 'nu' });
const v = laSoView(ls);

test('view có đủ 12 cung theo chi, đúng một cung Mệnh', () => {
  assert.equal(v.cung.length, 12);
  v.cung.forEach((c, i) => assert.equal(c.chi, i));
  assert.equal(v.cung.filter((c) => c.laMenh).length, 1);
});
test('view giữ nguyên chính tinh của engine (14 chính tinh)', () => {
  const dem = ls.cung.reduce((n, c) => n + c.chinhTinh.length, 0);
  assert.equal(v.cung.reduce((n, c) => n + c.chinhTinh.length, 0), dem);
});
test('VI_TRI_CHI: 12 ô khác nhau, chỉ ở viền 4×4', () => {
  const k = new Set(VI_TRI_CHI.map(([h, c]) => `${h},${c}`));
  assert.equal(k.size, 12);
  VI_TRI_CHI.forEach(([h, c]) => assert.ok(h === 1 || h === 4 || c === 1 || c === 4));
});
test('CSS grid-area khớp VI_TRI_CHI', () => {
  const css = fs.readFileSync(path.join(__dirname, '../src/styles/xemtuvi-moi/la-so-grid.css'), 'utf8');
  VI_TRI_CHI.forEach(([h, c], i) => assert.ok(css.includes(`[data-chi="${i}"] { grid-area: ${h} / ${c}; }`), `chi ${i}`));
});
