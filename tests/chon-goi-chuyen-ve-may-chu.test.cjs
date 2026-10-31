// L-bf67de: vào /chon-goi khi chưa có thông tin sinh thì máy chủ chuyển về / ngay (302), không chờ hydrate rồi router.replace
// (cách cũ làm Lighthouse mô phỏng LCP của /chon-goi lên 9,3 s vì trang chủ vẽ sau khi chuyển).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const nap = require('./_nap-ts.cjs');
const doc = (p) => fs.readFileSync(path.join(__dirname, '..', 'src', p), 'utf8');

test('canChuyenVeTrangChu: chỉ /chon-goi và chỉ khi không có cờ phiên', () => {
  const { canChuyenVeTrangChu } = nap('lib/co-phien.ts');
  assert.equal(canChuyenVeTrangChu('/chon-goi', false), true);
  assert.equal(canChuyenVeTrangChu('/chon-goi/', false), true);
  assert.equal(canChuyenVeTrangChu('/chon-goi', true), false);
  assert.equal(canChuyenVeTrangChu('/', false), false);
  assert.equal(canChuyenVeTrangChu('/thanh-toan', false), false);
});

test('cờ phiên không chứa thông tin sinh, đặt khi lưu thông tin sinh', () => {
  const { COOKIE_CO_SINH, chuoiCookieCoSinh } = nap('lib/co-phien.ts');
  const c = chuoiCookieCoSinh();
  assert.match(c, new RegExp('^' + COOKIE_CO_SINH + '=1;'));
  assert.match(c, /path=\//i);
  assert.match(c, /samesite=lax/i);
  assert.doesNotMatch(c, /max-age|expires/i); // cookie phiên, hết khi đóng trình duyệt
  assert.match(doc('lib/phien.ts'), /luuThongTinSinh[\s\S]*chuoiCookieCoSinh/);
});

test('middleware chuyển 302 về / và không cho cache', () => {
  const src = doc('middleware.ts');
  assert.match(src, /canChuyenVeTrangChu/);
  assert.match(src, /NextResponse\.redirect\(new URL\('\/', .*302/);
  assert.match(src, /no-store/);
});
