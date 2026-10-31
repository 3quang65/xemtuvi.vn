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

test('F5: điện thoại đưa gói Khuyên dùng lên đầu danh sách gói, thẻ gói đứng trước đoạn mẫu', () => {
  assert.match(luat('.the-goi.noi-bat'), /order:\s*-1/);
  assert.match(luat('.khu-chon-goi'), /order:\s*1/);
  assert.match(luat('.doan-khoa'), /order:\s*[2-9]/);
});

