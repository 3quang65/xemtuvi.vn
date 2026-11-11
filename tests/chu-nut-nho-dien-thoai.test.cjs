// L-c094a7 F3: chữ phụ ngoài ô lá số >= 14px (0.875rem) và nút/ô chọn có vùng bấm >= 44px.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const css = fs.readFileSync(require('node:path').join(__dirname, '..', 'src/app/globals.css'), 'utf8');
const rule = (sel) => { const m = css.match(new RegExp('(?:^|\\n)' + sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\{([^}]*)\\}')); assert.ok(m, 'thiếu luật ' + sel); return m[1]; };
const cheTrong = (sel) => { const m = rule(sel).match(/font-size:\s*([\d.]+)rem/); return m ? parseFloat(m[1]) : null; };
const minH = (sel) => { const m = rule(sel).match(/min-height:\s*(\d+)px/); return m ? +m[1] : 0; };

test('chữ phụ ngoài ô lá số không dưới 0.875rem', () => {
  for (const s of ['.loi-muigio', '.nhom-sao h4', '.chu-giai', '.chan-trang', '.tt-doan footer', '.doan-nguon', '.nhan-chinh', '.lh-dong-y', '.nhuan', '.nuoc-ngoai', '.chon-doi.nho label']) {
    assert.ok(cheTrong(s) === null || cheTrong(s) >= 0.875, `${s} = ${cheTrong(s)}rem`);
  }
});
test('vùng bấm >= 44px: chọn đôi nhỏ, liên kết nhỏ', () => {
  assert.ok(minH('.chon-doi.nho label') >= 44);
  assert.ok(minH('.lk-nho') >= 44);
});
test('ô đồng ý nhận tin: vùng bấm 44px', () => {
  assert.match(css, /\.lh-dong-y\s*\{[^}]*min-height:\s*44px/);
});
