// Bàn phím trên form lập lá số: bấm Lập lá số khi trống -> focus phải vào ô lỗi đầu; chụp 375px/1366px.
const path = require('path');
const { chromium } = require(path.join(process.env.HOME, 'cong-cu/pw/node_modules/playwright'));
const U = process.argv[2] || 'http://localhost:3258';
(async () => {
  const b = await chromium.launch();
  for (const [ten, w] of [['375', 375], ['1366', 1366]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: 800 } })).newPage();
    await p.goto(U + '/', { waitUntil: 'networkidle', timeout: 120000 });
    await p.focus('button.nut-chinh[type=submit]'); await p.keyboard.press('Enter');
    await p.waitForSelector('[role=alert]', { timeout: 20000 });
    await p.waitForTimeout(300);
    console.log(ten, 'focus:', await p.evaluate(() => document.activeElement.id), '| tom tat:', await p.$eval('#loi-tom-tat', (e) => e.textContent));
    await p.screenshot({ path: path.join(__dirname, `loi-focus-${ten}.png`) });
  }
  await b.close();
})();
