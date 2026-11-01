// Chụp /toi ở trạng thái rỗng (giả lập API) ở 375px và 1366px. Dùng: node chup.cjs [http://localhost:3257]
const path = require('path');
const { chromium } = require(path.join(process.env.HOME, 'cong-cu/pw/node_modules/playwright'));
const U = process.argv[2] || 'http://localhost:3257';
(async () => {
  const b = await chromium.launch();
  for (const [ten, w, h] of [['375', 375, 800], ['1366', 1366, 800]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await p.route('**/api/toi', (r) => r.fulfill({ json: { dangNhap: true, email: 'khach@example.vn', laSoIds: [] } }));
    await p.goto(U + '/toi', { waitUntil: 'networkidle', timeout: 90000 });
    await p.waitForSelector('.toi-rong', { timeout: 60000 });
    console.log(ten, 'ngang-thua', await p.evaluate(() => document.documentElement.scrollWidth - innerWidth), 'nut', await p.$eval('.toi-rong a', (e) => e.getBoundingClientRect().height));
    await p.screenshot({ path: path.join(__dirname, `toi-rong-${ten}.png`) });
  }
  await b.close();
})();
