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

test('F3: ô bấm trên điện thoại cao tối thiểu 44px (giới tính, âm lịch, đồng ý nhận tin, nút năm, liên kết nhỏ)', () => {
  for (const s of ['.chon-doi label', '.chon-doi.nho label', '.nam-xem button', '.lk-nho']) {
    const k = luat(s); assert.ok(k, `thiếu luật điện thoại cho ${s}`);
    assert.ok(px(k, 'min-height') >= 44 || px(k, 'height') >= 44, `${s} chưa đủ 44px`);
  }
  assert.ok(px(luat('.nam-xem button'), 'width') >= 44, 'nút năm chưa rộng 44px');
});

test('F3: chữ thân trên điện thoại >= 16px; tên cung và sao trong lá số >= 14px', () => {
  for (const s of ['.tt-ghi-chu', '.ghi-chu-rieng-tu']) assert.ok(px(luat(s), 'font-size') >= 16, `${s} dưới 16px`);
  for (const s of ['.cung-dau strong', '.chinh-tinh']) assert.ok(px(luat(s), 'font-size') >= 14, `${s} dưới 14px`);
  assert.ok(px(luat('.sao sup'), 'font-size') >= 11 || /display:\s*none/.test(luat('.sao sup')), 'chữ viết tắt độ sáng còn quá nhỏ');
});

