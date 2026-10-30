// node kiem.cjs <thư mục ảnh> [url]
const path = require('path');
const { chromium } = require(path.join(process.env.HOME, 'cong-cu/pw/node_modules/playwright'));
const out = process.argv[2]; const url = process.argv[3] || 'http://localhost:3000';
require('fs').mkdirSync(out, { recursive: true });
const contrastJs = () => {
  const parse = (c) => c.match(/[\d.]+/g).map(Number);
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const bg = (el) => { let layers = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c[3] === 0 || (c.length === 4 && c[3] === 0)) continue; layers.push(c); if ((c[3] ?? 1) >= 1) break; } let base = [255, 255, 255]; for (const c of layers.reverse()) { const a = c[3] ?? 1; base = base.map((v, i) => c[i] * a + v * (1 - a)); } return base; };
  const bad = [];
  document.querySelectorAll('body *').forEach((el) => {
    const t = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ');
    if (!t) return; const s = getComputedStyle(el); if (s.display === 'none' || s.visibility === 'hidden') return;
    const r = el.getBoundingClientRect(); if (!r.width) return;
    const fg = parse(s.color); const b = bg(el); const a = fg[3] ?? 1; const f = fg.slice(0, 3).map((v, i) => v * a + b[i] * (1 - a));
    const L1 = lum(f), L2 = lum(b); const cr = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const px = parseFloat(s.fontSize); const big = px >= 24 || (px >= 18.66 && +s.fontWeight >= 700);
    if (cr < (big ? 3 : 4.5)) bad.push(`${cr.toFixed(2)} ${s.color} trên rgb(${b.map(Math.round)}) "${t.slice(0, 30)}" <${el.tagName.toLowerCase()}.${el.className}>`);
  });
  return bad;
};
(async () => {
  const b = await chromium.launch(); let fail = 0;
  for (const [w, h] of [[375, 812], [1366, 768]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(url); await p.waitForLoadState('networkidle');
    const tag = `${w}x${h}`;
    await p.screenshot({ path: `${out}/trang-chu-${tag}.png` });
    await p.locator('.phieu').screenshot({ path: `${out}/form-${tag}.png` });
    const ovf1 = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    const c1 = await p.evaluate(contrastJs);
    await p.getByLabel('Nữ').check(); await p.getByLabel('Ngày sinh').fill('15'); await p.getByLabel('Tháng sinh').fill('8');
    await p.getByLabel('Năm sinh').fill('1995'); await p.getByLabel('Giờ sinh').selectOption({ index: 5 }); await p.getByLabel('Phút sinh').fill('30');
    await p.getByRole('button', { name: 'Lập lá số' }).click(); await p.waitForSelector('.ket-qua');
    await p.locator('.o-cung').nth(2).click();
    await p.locator('.ket-qua').screenshot({ path: `${out}/la-so-${tag}.png` });
    const ovf2 = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    const c2 = await p.evaluate(contrastJs);
    const bad = [...new Set([...c1, ...c2])];
    console.log(tag, 'tràn ngang:', ovf1, ovf2, '| lỗi trang:', errs.length, '| chữ dưới AA:', bad.length); bad.forEach((x) => console.log('  ', x));
    if (ovf1 > 0 || ovf2 > 0 || bad.length) fail = 1;
  }
  await b.close(); process.exit(fail);
})();
