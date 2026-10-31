// L-bf67de: trang chủ (/ và /chon-goi chuyển về /) không được nạp engine an sao + luận giải ngay từ đầu (giảm TBT di động).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const nap = require('./_nap-ts.cjs');
const doc = (p) => fs.readFileSync(path.join(__dirname, '..', 'src', p), 'utf8');
/** Các import tĩnh (không phải `import type`) của một file. */
const importTinh = (src) => [...src.matchAll(/^import\s+(?!type\b)[^;]*?from\s+'([^']+)'/gms)].map((m) => m[1]);

test('module nhẹ nhe.ts có hàm giờ/múi giờ và index.ts vẫn xuất lại đúng', () => {
  const nhe = nap('lib/tuvi/nhe.ts');
  const idx = nap('lib/tuvi/index.ts');
  for (const k of ['muiGioHopLe', 'nhanMuiGio', 'canhGio', 'CHI', 'GIO_SINH']) assert.ok(nhe[k] !== undefined, k);
  assert.equal(idx.canhGio(23), 'Tý muộn');
  assert.equal(nhe.nhanMuiGio(5.5), 'UTC+5:30');
});

test('loi-nhap, nuoc-ngoai chỉ nạp module nhẹ, không nạp engine', () => {
  for (const f of ['lib/loi-nhap.ts', 'lib/nuoc-ngoai.ts']) {
    assert.ok(!importTinh(doc(f)).some((s) => /(^|\/)tuvi$|tuvi\/index/.test(s)), f);
  }
});

test('LapLaSo không import tĩnh engine, LaSoBan, TomTatMienPhi, LienHe', () => {
  const ds = importTinh(doc('components/LapLaSo.tsx'));
  for (const s of ds) assert.ok(!/@\/lib\/tuvi$|\/LaSoBan$|\/TomTatMienPhi$|\/LienHe$/.test(s), s);
});
