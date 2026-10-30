// Thu email/Zalo có đồng ý: không đồng ý thì không lưu; hủy được; nguồn UTM được làm sạch.
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const x = nap('lib/may-chu/xu-ly.ts');
const { chuanHoa } = nap('lib/may-chu/lien-he.ts');
const { kiemTraSuKien, trangCua } = require('../src/lib/su-kien.js');

const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
const HOST = 'xemtuvi.test';
const post = (url, body, origin = 'https://' + HOST) =>
  new Request('https://' + HOST + url, { method: 'POST', headers: { host: HOST, 'content-type': 'application/json', ...(origin ? { origin } : {}) }, body: JSON.stringify(body) });
const dem = () => M.db.prepare('SELECT COUNT(*) n FROM lien_he').get().n;

test('chuẩn hóa email và số Zalo', () => {
  assert.deepEqual(chuanHoa('email', '  Lan.Nguyen@Gmail.COM '), { loai: 'email', giaTri: 'lan.nguyen@gmail.com' });
  assert.deepEqual(chuanHoa('zalo', '+84 912.345.678'), { loai: 'zalo', giaTri: '0912345678' });
  assert.deepEqual(chuanHoa('zalo', '0912-345-678'), { loai: 'zalo', giaTri: '0912345678' });
  for (const [l, v] of [['email', 'abc'], ['email', 'a@b'], ['email', 'a b@c.vn'], ['zalo', '12345'], ['zalo', '0212345678'], ['khac', 'a@b.vn'], ['email', 5], ['zalo', null]])
    assert.equal(chuanHoa(l, v), null, `${l} ${v}`);
});

test('chưa tích đồng ý (thiếu, false, "true", 1): không lưu gì', async () => {
  for (const dongY of [undefined, false, 'true', 1, null]) {
    const r = await x.lienHeGhi(post('/api/lien-he', { loai: 'email', giaTri: 'a@b.vn', ...(dongY === undefined ? {} : { dongY }) }), M);
    assert.equal(r.status, 400);
    assert.equal((await r.json()).loi, 'chua_dong_y');
  }
  assert.equal(dem(), 0);
});

test('sai liên hệ hoặc khác nguồn: từ chối, không lưu', async () => {
  assert.equal((await x.lienHeGhi(post('/api/lien-he', { loai: 'email', giaTri: 'abc', dongY: true }), M)).status, 400);
  assert.equal((await x.lienHeGhi(post('/api/lien-he', { loai: 'email', giaTri: 'a@b.vn', dongY: true }, 'https://evil.test'), M)).status, 403);
  assert.equal((await x.lienHeGhi(post('/api/lien-he', { loai: 'email', giaTri: 'a@b.vn', dongY: true }, null), M)).status, 403);
  assert.equal(dem(), 0);
});

test('đồng ý: lưu kèm thời điểm và nguồn đã làm sạch; không lưu trường lạ', async () => {
  const truoc = Date.now();
  const r = await x.lienHeGhi(post('/api/lien-he', {
    loai: 'zalo', giaTri: '0912 345 678', dongY: true,
    nguon: { utm_source: 'meta', utm_campaign: 'van-2027', trang: '/', ref: 'tuvi.vn', utm_term: '<script>', ngaySinh: '1995-08-15', utm_medium: 'x'.repeat(101) },
  }), M);
  assert.equal(r.status, 200);
  const { duongHuy } = await r.json();
  assert.match(duongHuy, /^\/huy-dang-ky\?ma=[\w-]{20,40}$/);
  const d = M.db.prepare('SELECT * FROM lien_he').get();
  assert.equal(d.gia_tri, '0912345678');
  assert.equal(d.loai, 'zalo');
  assert.ok(d.dong_y_luc >= truoc && d.dong_y_luc <= Date.now());
  assert.deepEqual(JSON.parse(d.nguon), { utm_source: 'meta', utm_campaign: 'van-2027', trang: '/', ref: 'tuvi.vn' });
  assert.equal(d.huy_luc, null);
  assert.ok(!JSON.stringify(d).includes('1995'));
});

test('gửi lại cùng liên hệ: không tạo dòng thứ hai, giữ mã hủy', async () => {
  const a = await (await x.lienHeGhi(post('/api/lien-he', { loai: 'email', giaTri: 'Lan@x.vn', dongY: true }), M)).json();
  const b = await (await x.lienHeGhi(post('/api/lien-he', { loai: 'email', giaTri: 'lan@x.vn', dongY: true }), M)).json();
  assert.equal(a.duongHuy, b.duongHuy);
  assert.equal(M.db.prepare("SELECT COUNT(*) n FROM lien_he WHERE gia_tri='lan@x.vn'").get().n, 1);
});

test('hủy đăng ký: đặt huy_luc, gọi lại vẫn ổn, mã sai bị từ chối; đăng ký lại thì bỏ trạng thái hủy', async () => {
  const { duongHuy } = await (await x.lienHeGhi(post('/api/lien-he', { loai: 'email', giaTri: 'huy@x.vn', dongY: true }), M)).json();
  const ma = duongHuy.split('ma=')[1];
  assert.equal((await x.lienHeHuy(post('/api/lien-he/huy', { ma: 'sai-sai-sai-sai-sai-sai' }), M)).status, 404);
  assert.equal((await x.lienHeHuy(post('/api/lien-he/huy', { ma: '' }), M)).status, 404);
  assert.equal((await x.lienHeHuy(post('/api/lien-he/huy', { ma }), M)).status, 200);
  const l1 = M.db.prepare("SELECT huy_luc FROM lien_he WHERE gia_tri='huy@x.vn'").get().huy_luc;
  assert.ok(l1 > 0);
  assert.equal((await x.lienHeHuy(post('/api/lien-he/huy', { ma }), M)).status, 200);
  assert.equal(M.db.prepare("SELECT huy_luc FROM lien_he WHERE gia_tri='huy@x.vn'").get().huy_luc, l1);
  await x.lienHeGhi(post('/api/lien-he', { loai: 'email', giaTri: 'huy@x.vn', dongY: true }), M);
  assert.equal(M.db.prepare("SELECT huy_luc FROM lien_he WHERE gia_tri='huy@x.vn'").get().huy_luc, null);
});

test('sự kiện phễu de_lai_lien_he hợp lệ, thuộc màn form, không nhận dữ liệu liên hệ', () => {
  const phien = 'a1b2c3d4e5f6a7b8';
  assert.deepEqual(kiemTraSuKien({ ten: 'de_lai_lien_he', phien }), { ten: 'de_lai_lien_he', phien });
  assert.equal(kiemTraSuKien({ ten: 'de_lai_lien_he', phien, email: 'a@b.vn' }), null);
  assert.equal(trangCua('de_lai_lien_he'), 'form');
});
