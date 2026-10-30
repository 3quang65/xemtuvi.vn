// Đăng nhập thử chỉ nhận email trong danh sách cho phép; email ngoài -> 403 và không đọc được lá số.
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const x = nap('lib/may-chu/xu-ly.ts');
process.env.DANG_NHAP_THU = '1';
process.env.EMAIL_THU_FILE = '/nonexistent/email-thu.txt';
const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
const H = 'xemtuvi.test';
const yc = (url, body, cookie) => new Request('https://' + H + url, { method: body ? 'POST' : 'GET', headers: { host: H, origin: 'https://' + H, 'content-type': 'application/json', ...(cookie ? { cookie } : {}) }, body: body ? JSON.stringify(body) : undefined });

test('email ngoài danh sách bị 403, không có phiên, không đọc được lá số', async () => {
  process.env.EMAIL_THU_CHO_PHEP = 'Anh@Cho-Phep.vn, @noi-bo.vn';
  const r = await x.dangNhap(yc('/api/dang-nhap', { email: 'nan-nhan@gmail.com' }), M);
  assert.equal(r.status, 403);
  assert.equal(r.headers.get('set-cookie'), null);
  assert.equal((await x.laSoDoc(yc('/api/la-so'), M)).status, 401);
  assert.equal((await x.dangNhap(yc('/api/dang-nhap', { email: 'x@evil-noi-bo.vn' }), M)).status, 403);
  assert.equal((await x.dangNhap(yc('/api/dang-nhap', { email: 'a@noi-bo.vn@evil.com' }), M)).status, 403);
});
test('email trong danh sách (không phân biệt hoa thường) đăng nhập được; danh sách rỗng chặn tất cả', async () => {
  assert.equal((await x.dangNhap(yc('/api/dang-nhap', { email: 'anh@cho-phep.VN' }), M)).status, 200);
  assert.equal((await x.dangNhap(yc('/api/dang-nhap', { email: 'b@noi-bo.vn' }), M)).status, 200);
  process.env.EMAIL_THU_CHO_PHEP = '';
  assert.equal((await x.dangNhap(yc('/api/dang-nhap', { email: 'anh@cho-phep.vn' }), M)).status, 403);
});
