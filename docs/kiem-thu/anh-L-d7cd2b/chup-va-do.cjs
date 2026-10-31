// Chụp và đo ở 375px. Dùng: node chup-va-do.cjs <truoc|sau> [http://localhost:3201]
const path = require('path');
const { chromium } = require(path.join(process.env.HOME, 'cong-cu/pw/node_modules/playwright'));
const tien = process.argv[2] || 'sau', U = process.argv[3] || 'http://localhost:3201', OUT = __dirname;
const email = `do-${Date.now()}@example.vn`;
const dem = (p) => p.evaluate(() => {
  const o = { ngang: document.documentElement.scrollWidth - innerWidth, chuNhoThan: 0, chuNhoLaSo: 0, nutNho: [], vd: [] };
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; const seen = new Set();
  while ((n = w.nextNode())) {
    if (!n.textContent.trim()) continue; const el = n.parentElement; if (seen.has(el)) continue; seen.add(el);
    const r = el.getBoundingClientRect(); if (!r.width || !r.height || getComputedStyle(el).visibility === 'hidden') continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (el.closest('.ban')) { if (fs < 14) o.chuNhoLaSo++; }
    else if (fs < 16) { o.chuNhoThan++; const k = `${el.tagName}.${el.className} ${fs}px`; if (!o.vd.includes(k)) o.vd.push(k); }
  }
  for (const e of document.querySelectorAll('a,button,input:not([type=hidden]),select,[role=tab],summary')) {
    const r = e.getBoundingClientRect(); const lb = e.labels && e.labels[0] ? e.labels[0].getBoundingClientRect() : null;
    const h = Math.max(r.height, lb ? lb.height : 0); if (!r.width || getComputedStyle(e).visibility === 'hidden') continue;
    if (e.type === 'radio' || e.type === 'checkbox') { if (h < 44) o.nutNho.push(`${e.type} ${Math.round(r.width)}x${Math.round(h)}`); continue; }
    if (r.height < 44) o.nutNho.push(`${(e.innerText || e.getAttribute('aria-label') || e.id || e.tagName).slice(0, 22).replace(/\n/g, ' ')} ${Math.round(r.width)}x${Math.round(r.height)}`);
  }
  o.soNutNho = o.nutNho.length; o.nutNho = o.nutNho.slice(0, 10); return o;
});
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 375, height: 667 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); const loi = []; p.on('pageerror', (e) => loi.push(e.message));
  const chup = (n, full) => p.screenshot({ path: `${OUT}/${tien}-${n}.png`, fullPage: !!full });
  const do_ = async (n) => console.log(`DO ${n}:`, JSON.stringify(await dem(p)));
  await p.goto(U + '/', { waitUntil: 'load' }); await p.getByLabel('Nữ').waitFor();
  await chup('f3-trang-chu', true); await do_('trang-chu');
  await p.getByLabel('Nữ').check(); await p.getByLabel('Ngày sinh').fill('15'); await p.getByLabel('Tháng sinh').fill('8'); await p.getByLabel('Năm sinh').fill('1995');
  await p.getByLabel('Giờ sinh').selectOption({ index: 5 }); await p.getByLabel('Phút sinh').fill('30');
  await p.getByRole('button', { name: 'Lập lá số' }).click(); await p.waitForSelector('.tom-tat');
  await chup('f3-la-so', true); await do_('la-so');
  await p.getByRole('link', { name: 'Xem luận giải chuyên sâu' }).click(); await p.waitForURL('**/chon-goi'); await p.getByRole('button', { name: 'Chọn gói này' }).first().waitFor();
  await chup('f1-f5-chon-goi-man-dau'); await chup('f1-chon-goi-day-du', true); await do_('chon-goi');
  console.log('GIA chon-goi:', (await p.locator('.the-goi .gia').allInnerTexts()).join(' | '));
  console.log('THU TU the:', (await p.locator('.the-goi h3').allInnerTexts()).join(' > '));
  console.log('Y the Khuyen dung:', Math.round((await p.locator('.the-goi.noi-bat').first().boundingBox()).y + await p.evaluate(() => scrollY)));
  await p.getByRole('listitem').filter({ hasText: 'Khuyên dùng' }).getByRole('button').click(); await p.waitForURL('**/thanh-toan?goi=tron-la-so'); await p.getByLabel('Email của bạn').waitFor();
  await chup('f1-thanh-toan', true); await do_('thanh-toan');
  await p.getByLabel('Email của bạn').fill(email); await p.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  await p.getByRole('button', { name: 'Tôi đã lưu mã, tiếp tục' }).waitFor(); await p.getByRole('button', { name: 'Tôi đã lưu mã, tiếp tục' }).click();
  await p.getByRole('button', { name: 'Thanh toán (giả lập)' }).waitFor();
  console.log('TONG:', (await p.locator('dl.don').innerText()).replace(/\s+/g, ' '));
  await p.getByRole('button', { name: 'Thanh toán (giả lập)' }).click();
  await p.waitForFunction(() => location.pathname === '/luan-giai' || [...document.querySelectorAll('a')].some((a) => /Xem luận giải của tôi/.test(a.textContent)), null, { timeout: 60000 }); await p.waitForTimeout(500); console.log('URL sau thanh toan:', p.url());
  await chup('f6-sau-thanh-toan');
  const lk = p.getByRole('link', { name: 'Xem luận giải của tôi' });
  if (await lk.count()) { await lk.click(); }
  else console.log('CHUYEN THANG vao bai (khong qua trang xac nhan)');
  await p.waitForURL('**/luan-giai'); await p.waitForSelector('.bai-luan h3'); await p.waitForTimeout(800);
  await chup('f6-bai-man-dau'); await chup('f6-bai-day-du', true); await do_('bai');
  const y = await p.evaluate(() => { const h = document.querySelector('.bai-luan h3'); return Math.round(h.getBoundingClientRect().top + scrollY); });
  console.log('Y noi dung bai (px tu dau trang), man hinh = 667:', y);
  console.log('LOI JS:', JSON.stringify(loi)); await b.close();
})().catch((e) => { console.log('LOI', e.message); process.exit(1); });
