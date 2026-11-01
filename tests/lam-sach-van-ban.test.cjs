// L-2bd01e: làm sạch văn bản tự do (độ dài, ký tự điều khiển, null byte, HTML/script) ở báo lỗi, hỏi đáp, liên hệ.
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { lamSachVanBan } = nap('lib/lam-sach-van-ban.ts');
const bl = nap('lib/may-chu/bao-loi.ts');
const lh = nap('lib/may-chu/lien-he.ts');

test('bỏ null byte và ký tự điều khiển', () => {
  assert.equal(lamSachVanBan('a\u0000b\u0007c\u007Fd'), 'abcd');
});
test('bỏ thẻ <script> cùng nội dung, và thẻ HTML khác', () => {
  assert.equal(lamSachVanBan('Chào <script>alert(1)</script>bạn'), 'Chào bạn');
  assert.equal(lamSachVanBan('<img src=x onerror=alert(1)>Lỗi <b>nặng</b>'), 'Lỗi nặng');
  assert.equal(lamSachVanBan('<scr\u0000ipt>x</scr\u0000ipt>ok'), 'ok');
  assert.ok(!/[<>]/.test(lamSachVanBan('a <script src=//x.y ok')));
});
test('cắt theo độ dài tối đa', () => {
  assert.equal(lamSachVanBan('x'.repeat(5000), 100).length, 100);
});
test('báo lỗi: moTa có <script> không lưu thẻ; chuỗi dài bị từ chối; null byte bị bỏ', () => {
  const r = bl.kiemTraBaoLoi({ moTa: 'Không thấy nội dung <script>alert(1)</script> sau khi mua' });
  assert.equal(r.ok, true);
  assert.ok(!/script|<|>/.test(r.v.moTa));
  assert.equal(bl.kiemTraBaoLoi({ moTa: 'x'.repeat(5000) }).ok, false);
  const n = bl.kiemTraBaoLoi({ moTa: 'Không thấy\u0000 nội dung', thietBi: '<b>iPhone</b>\u0000' });
  assert.ok(!n.v.moTa.includes('\u0000'));
  assert.equal(n.v.thietBi, 'iPhone');
});
test('liên hệ: email/số có null byte hoặc <script> bị từ chối', () => {
  assert.equal(lh.chuanHoa('email', 'a\u0000@b.vn'), null);
  assert.equal(lh.chuanHoa('email', '<script>@b.vn'), null);
  assert.equal(lh.chuanHoa('zalo', '0912345678\u0000'), null);
  assert.deepEqual(lh.lamSachNguon({ ref: '<script>alert(1)</script>', trang: 'x'.repeat(500), utm_source: 'fb\u0000' }), {});
});
