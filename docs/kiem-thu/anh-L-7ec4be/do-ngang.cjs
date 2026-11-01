// Đo ô chạm ở 667x375 (ngang) và 375x812. Dùng: node do-ngang.cjs [http://localhost:3299]
const path = require('path');
const { chromium } = require(path.join(process.env.HOME, 'cong-cu/pw/node_modules/playwright'));
const U = process.argv[2] || 'http://localhost:3299';
const DO = (p) => p.evaluate(() => {
  const r = (e) => { const b = e.getBoundingClientRect(); return `${Math.round(b.width)}x${Math.round(b.height)}`; };
  const out = {};
  out.logo = r(document.querySelector('.ten-trang'));
  out.chanTrang = [...document.querySelectorAll('footer a')].map((a) => a.textContent.trim().slice(0, 14) + ' ' + r(a));
  const lk = document.querySelector('.lk-nho'); out.sinhNuocNgoai = lk ? r(lk) : 'không thấy';
  return out;
});
(async () => {
  const b = await chromium.launch(); let loi = 0;
  for (const [w, h] of [[667, 375], [375, 812]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage(); await p.goto(U + '/', { waitUntil: 'load' }); await p.getByLabel('Nữ').waitFor();
    const o = await DO(p); console.log(`${w}x${h}`, JSON.stringify(o));
    const tat = [o.logo, o.sinhNuocNgoai, ...o.chanTrang].map((s) => s.split(' ').pop().split('x').map(Number));
    if (tat.some(([a, c]) => a < 44 || c < 44)) { loi++; console.log('  → CÒN ô <44px'); }
    if (w === 667) await p.screenshot({ path: path.join(__dirname, 'sau-667.png') });
    await ctx.close();
  }
  await b.close(); process.exit(loi ? 1 : 0);
})();
