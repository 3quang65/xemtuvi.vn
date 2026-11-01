// Chụp sáng/tối ở 375px và 1366px + đo tương phản thật của chữ. Dùng: node chup.cjs [url] [đường dẫn trang]
const path = require('path');
const { chromium } = require(path.join(process.env.HOME, 'cong-cu/pw/node_modules/playwright'));
const U = process.argv[2] || 'http://localhost:3299', TRANG = process.argv[3] || '/cung/menh', OUT = __dirname;
const lum = ([r, g, b]) => { const c = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
(async () => {
  const b = await chromium.launch();
  for (const [ten, w, h, mobile] of [['375', 375, 667, true], ['1366', 1366, 768, false]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, colorScheme: 'light' });
    const p = await ctx.newPage(); const loi = []; p.on('pageerror', (e) => loi.push(e.message));
    await p.goto(U + TRANG, { waitUntil: 'load' });
    await p.screenshot({ path: `${OUT}/sang-${ten}.png`, fullPage: true });
    await p.getByRole('button', { name: 'Chế độ tối' }).click();
    const luu = await p.evaluate(() => localStorage.getItem('xtv-che-do'));
    await p.screenshot({ path: `${OUT}/toi-${ten}.png`, fullPage: true });
    await p.reload({ waitUntil: 'load' });
    const sau = await p.evaluate(() => document.documentElement.dataset.theme);
    // chữ nhỏ nhất tương phản với nền tổ tiên đầu tiên có nền
    const kq = await p.evaluate(() => {
      const nenCua = (el) => { for (let e = el; e; e = e.parentElement) { const m = getComputedStyle(e).backgroundColor.match(/[\d.]+/g).map(Number); if (m.length < 4 || m[3] > 0.95) return m.slice(0, 3); } return [255, 255, 255]; };
      const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; const seen = new Set();
      while ((n = w.nextNode())) { if (!n.textContent.trim()) continue; const el = n.parentElement; if (seen.has(el)) continue; seen.add(el); const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
        out.push({ t: n.textContent.trim().slice(0, 20), c: getComputedStyle(el).color.match(/[\d.]+/g).slice(0, 3).map(Number), n: nenCua(el) }); }
      return out; });
    let min = 99, ví = '';
    for (const k of kq) { const [a, c] = [lum(k.c), lum(k.n)].sort((x, y) => y - x); const r = (a + 0.05) / (c + 0.05); if (r < min) { min = r; ví = k.t; } }
    console.log(`${ten}px: lưu=${luu}, sau tải lại=${sau}, tương phản chữ thấp nhất (tối)=${min.toFixed(2)} ("${ví}"), ${kq.length} đoạn chữ, lỗi JS=${loi.length}`);
    await ctx.close();
  }
  await b.close();
})();
