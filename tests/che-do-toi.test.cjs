// L-d0abe7 (FE19): chế độ tối cho trang đọc luận giải — dùng biến màu, nút chuyển nhớ bằng localStorage, tương phản >= 4.5.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const doc = (p) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const css = doc('src/app/globals.css');

/** Đọc các biến --ten: #hex trong khối có bộ chọn `sel` (khối đầu tiên khớp). */
function bien(sel) {
  const i = css.indexOf(sel + ' {');
  assert.ok(i >= 0, `thiếu khối ${sel}`);
  const khoi = css.slice(i, css.indexOf('}', i));
  const o = {};
  for (const m of khoi.matchAll(/(--[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)) o[m[1]] = m[2];
  return o;
}
const lum = (h) => {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const tyLe = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// [chữ, nền] — các cặp thật đang dùng ở trang đọc luận giải và thành phần chung
const CAP = [
  ['--muc', '--nen'], ['--muc', '--giay'], ['--muc-nhat', '--nen'], ['--muc-nhat', '--giay'],
  ['--ngoc', '--giay'], ['--ngoc', '--nen'], ['--ngoc-dam', '--ngoc-nhat'], ['--tren-ngoc', '--ngoc'], ['--tren-ngoc', '--hoang'],
  ['--sen', '--giay'], ['--sen', '--nen'], ['--muc', '--nen-loi'], ['--hoang', '--giay'], ['--hoang', '--nen'],
  ['--kim', '--giay'], ['--moc', '--giay'], ['--thuy', '--giay'], ['--hoa', '--giay'], ['--tho', '--giay'],
  ['--thuan-chu', '--thuan-nen'], ['--luu-y-chu', '--luu-y-nen'],
];
for (const [ten, sel] of [['sáng', ':root'], ['tối', 'html[data-theme="dark"]']]) {
  test(`tương phản ≥ 4.5 — giao diện ${ten}`, () => {
    const v = { ...bien(':root'), ...(sel === ':root' ? {} : bien(sel)) };
    const loi = [];
    for (const [c, n] of CAP) {
      assert.ok(v[c] && v[n], `thiếu biến ${c} hoặc ${n}`);
      const r = tyLe(v[c], v[n]);
      if (r < 4.5) loi.push(`${c} ${v[c]} / ${n} ${v[n]} = ${r.toFixed(2)}`);
    }
    assert.deepEqual(loi, []);
  });
}

test('giao diện tối thật sự đổi nền và chữ', () => {
  const s = bien(':root'), t = bien('html[data-theme="dark"]');
  assert.ok(lum(t['--nen']) < 0.05 && lum(s['--nen']) > 0.5);
  assert.ok(lum(t['--muc']) > 0.5);
});

test('không còn màu cứng ngoài khối biến (chữ trắng, nền hex) trong globals.css', () => {
  const sauBien = css.slice(css.indexOf('}', css.indexOf(':root {')));
  const tronKhoiToi = sauBien.replace(/html\[data-theme="dark"\] \{[^}]*\}/g, '');
  const con = [...tronKhoiToi.matchAll(/[^;{}]*(#[0-9a-fA-F]{3,8}\b)[^;}]*/g)].map((m) => m[0].trim());
  assert.deepEqual(con, []);
});

test('nút chuyển: lưu localStorage, đặt data-theme, có aria-pressed, nằm ở đầu trang', () => {
  const nut = doc('src/components/NutCheDo.tsx');
  assert.match(nut, /'use client'/);
  assert.match(nut, /localStorage\.setItem\(KHOA/);
  assert.match(nut, /data-theme|dataset\.theme/);
  assert.match(nut, /aria-pressed/);
  assert.match(doc('src/components/Khung.tsx'), /<NutCheDo \/>/);
});

test('layout: script đặt theme trước khi vẽ (không nháy trắng), theo hệ thống khi chưa chọn', () => {
  const l = doc('src/app/layout.tsx');
  assert.match(l, /localStorage\.getItem/);
  assert.match(l, /prefers-color-scheme: dark/);
  assert.match(l, /suppressHydrationWarning/);
});
