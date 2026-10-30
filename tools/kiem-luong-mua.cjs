// node tools/kiem-luong-mua.cjs <thư mục ảnh> [url]  — đi hết luồng mua ở 375×812, chụp từng màn.
const path = require('path');
const { chromium } = require(path.join(process.env.HOME, 'cong-cu/pw/node_modules/playwright'));
const out = process.argv[2]; const url = (process.argv[3] || 'http://localhost:3100').replace(/\/$/, '');
require('fs').mkdirSync(out, { recursive: true });
const tran = (p) => p.evaluate(() => document.documentElement.scrollWidth - innerWidth);

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 375, height: 812 } });
  const loi = []; p.on('pageerror', (e) => loi.push(e.message));
  const man = []; let fail = 0;
  const ghi = async (ten, tenAnh, full) => {
    const t = await tran(p); if (t > 0) { fail = 1; }
    man.push(ten); console.log(`man ${man.length}: ${ten} | tràn ngang: ${t}`);
    await p.screenshot({ path: `${out}/luong-mua-${tenAnh}.png`, fullPage: !!full });
  };

  // Vào thẳng /chon-goi và /thanh-toan khi chưa lập lá số → về /
  for (const u of ['/chon-goi', '/thanh-toan?goi=tron-la-so']) {
    await p.goto(url + u); await p.waitForURL(url + '/');
    console.log('chưa có lá số:', u, '→ /', 'OK');
  }

  await p.goto(url + '/'); await p.waitForLoadState('networkidle');
  await ghi('form', '1-form');
  await p.getByLabel('Nữ').check(); await p.getByLabel('Ngày sinh').fill('15'); await p.getByLabel('Tháng sinh').fill('8');
  await p.getByLabel('Năm sinh').fill('1995'); await p.getByLabel('Giờ sinh').selectOption({ index: 5 }); await p.getByLabel('Phút sinh').fill('30');
  await p.getByRole('button', { name: 'Lập lá số' }).click(); await p.waitForSelector('.tom-tat');
  await p.locator('.tom-tat').scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
  await ghi('tom-tat', '2-la-so-tom-tat');
  await p.locator('.tom-tat').screenshot({ path: `${out}/luong-mua-2b-tom-tat.png` });
  const urlSach = await p.evaluate(() => location.href + document.cookie);
  if (/1995|15/.test(new URL(p.url()).search)) { fail = 1; console.log('LỖI: ngày sinh trên URL'); }

  await p.getByRole('link', { name: 'Xem luận giải chuyên sâu' }).click(); await p.waitForURL('**/chon-goi'); await p.waitForSelector('.the-goi');
  await ghi('chon-goi', '3-chon-goi', true);
  const nutChinh3 = await p.locator('.nut-chinh').count(); if (nutChinh3 !== 1) { fail = 1; console.log('LỖI: chon-goi có', nutChinh3, 'nút chính'); }
  await p.locator('.the-goi.noi-bat .nut-chinh').click(); await p.waitForURL('**/thanh-toan?goi=tron-la-so'); await p.waitForSelector('.khoi-buoc');
  await ghi('thanh-toan', '4-thanh-toan-chua-dang-nhap');
  await p.getByRole('button', { name: 'Tiếp tục với Google' }).click(); await p.waitForSelector('.da-dang-nhap');
  await p.screenshot({ path: `${out}/luong-mua-4b-thanh-toan-da-dang-nhap.png` });
  const nutChinh4 = await p.locator('.nut-chinh').count(); if (nutChinh4 !== 1) { fail = 1; console.log('LỖI: thanh-toan có', nutChinh4, 'nút chính'); }
  await p.getByRole('button', { name: 'Thanh toán (giả lập)' }).click(); await p.waitForURL('**/luan-giai'); await p.waitForSelector('.tom-tat');
  await p.waitForTimeout(500);
  const t = await tran(p); if (t > 0) fail = 1;
  await p.screenshot({ path: `${out}/luong-mua-5-luan-giai.png`, fullPage: true });
  console.log('đích: /luan-giai | tràn ngang:', t, '| có chữ "đang chuẩn bị":', await p.getByText('đang chuẩn bị').count() > 0);

  // Gói chủ đề: chọn chủ đề ngay trong thẻ gói, rồi sang thanh toán; thiếu/sai chủ đề → về /chon-goi
  await p.goto(url + '/chon-goi'); await p.waitForSelector('.the-goi');
  const nutCD = p.locator('.the-goi', { hasText: 'Mở một chủ đề' }).getByRole('button', { name: 'Chọn một chủ đề trước' });
  console.log('chưa chọn chủ đề → nút bị khóa:', await nutCD.isDisabled() ? 'OK' : 'LỖI'); if (!await nutCD.isDisabled()) fail = 1;
  await p.getByLabel('Tình cảm').check();
  await p.locator('.the-goi', { hasText: 'Mở một chủ đề' }).getByRole('button', { name: 'Chọn gói này' }).click();
  await p.waitForURL('**/thanh-toan?goi=mot-chu-de&chuDe=tinh-cam'); await p.waitForSelector('.khoi-buoc');
  const coCD = await p.locator('.don').getByText('Tình cảm').count(); console.log('thanh toán hiện chủ đề:', coCD ? 'OK' : 'LỖI'); if (!coCD) fail = 1;
  await p.screenshot({ path: `${out}/luong-mua-6-thanh-toan-chu-de.png` });
  await p.getByRole('button', { name: 'Thanh toán (giả lập)' }).click(); await p.waitForURL('**/luan-giai'); await p.waitForSelector('.da-dang-nhap');
  const daMo = await p.locator('.da-dang-nhap').innerText(); console.log('luận giải:', daMo, daMo.includes('Tình cảm') ? 'OK' : 'LỖI'); if (!daMo.includes('Tình cảm')) fail = 1;
  for (const u of ['/thanh-toan?goi=mot-chu-de', '/thanh-toan?goi=mot-chu-de&chuDe=xay-nha']) {
    await p.goto(url + u); await p.waitForURL('**/chon-goi'); console.log('chuDe thiếu/sai:', u, '→ /chon-goi OK');
  }
  const nhanKD = await p.locator('.the-goi.noi-bat .nhan-chinh').innerText(); console.log('nhãn gói giữa:', nhanKD, nhanKD === 'Khuyên dùng' ? 'OK' : 'LỖI'); if (nhanKD !== 'Khuyên dùng') fail = 1;

  // Đã đăng nhập thử rồi → lần sau bỏ bước chọn tài khoản
  await p.goto(url + '/thanh-toan?goi=thanh-vien-nam'); await p.waitForSelector('.khoi-buoc');
  const conNutDN = await p.getByRole('button', { name: 'Tiếp tục với Google' }).count();
  console.log('đã đăng nhập thử → còn nút chọn tài khoản:', conNutDN, conNutDN ? 'LỖI' : 'OK'); if (conNutDN) fail = 1;

  console.log('SỐ MÀN TRƯỚC TRANG ĐÍCH:', man.length, man.length === 4 ? 'OK' : 'LỖI'); if (man.length !== 4) fail = 1;
  console.log('lỗi trang:', loi.length); if (loi.length) fail = 1;
  await b.close(); process.exit(fail);
})();
