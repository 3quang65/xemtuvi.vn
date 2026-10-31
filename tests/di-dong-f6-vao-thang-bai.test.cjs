// L-d7cd2b: giao diện điện thoại 375px (F3 cỡ chữ và ô bấm, F5 gói Khuyên dùng lên đầu, F6 vào thẳng bài).
// Kiểm tra nguồn CSS/TSX (đo thật bằng Playwright: docs/kiem-thu/anh-L-d7cd2b/chup-va-do.cjs).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const doc = (p) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const css = doc('src/app/globals.css');

/** Nối nội dung mọi khối @media (max-width: 640px) (khối không lồng nhau). */
function khoiDienThoai() {
  const out = [];
  const re = /@media \(max-width: 640px\) \{/g; let m;
  while ((m = re.exec(css))) {
    let sau = re.lastIndex, sau2 = 1;
    while (sau2 > 0 && sau < css.length) { const ch = css[sau++]; if (ch === '{') sau2++; else if (ch === '}') sau2--; }
    out.push(css.slice(re.lastIndex, sau - 1));
  }
  return out.join('\n');
}
const dt = khoiDienThoai();
const luat = (chon) => { const re = new RegExp(chon.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^{}]*\\{([^}]*)\\}', 'g'); const r = []; let m; while ((m = re.exec(dt))) r.push(m[1]); return r.join(';'); };
const px = (khoi, thuoc) => { const m = new RegExp(thuoc + ':\\s*([\\d.]+)(px|rem)').exec(khoi); return m ? parseFloat(m[1]) * (m[2] === 'rem' ? 16 : 1) : null; };

test('F6: thanh toán giả lập xong chuyển thẳng /luan-giai, không còn nút "Xem luận giải của tôi"', () => {
  const tt = doc('src/components/ThanhToan.tsx');
  assert.match(tt, /thanh_toan_xong[\s\S]{0,200}router\.replace\('\/luan-giai'\)/);
  assert.doesNotMatch(tt, /Xem luận giải của tôi/);
});

test('F6: nhóm tab chuyên đề cuộn ngang một hàng', () => {
  assert.match(doc('src/components/LuanGiai.tsx'), /role="tablist"[^>]*className="tab-chu-de"|className="tab-chu-de"[^>]*role="tablist"/);
  const k = css.slice(css.indexOf('.tab-chu-de {'));
  assert.match(k, /overflow-x:\s*auto/); assert.match(k, /flex-wrap:\s*nowrap|white-space:\s*nowrap/);
  assert.ok(px(css.slice(css.indexOf('.tab-chu-de button')), 'min-height') >= 44);
});
