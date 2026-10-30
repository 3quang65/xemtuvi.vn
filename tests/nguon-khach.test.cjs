const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { nguonTuYeuCau, moHoaNguon, giaiMaNguon } = nap('lib/nguon-khach.ts');

test('UTM + ref ngoài site được giữ, chữ thường, cắt 64, chỉ chữ-số -_.', () => {
  const q = new URLSearchParams({ utm_source: 'FB', utm_campaign: 't1', utm_medium: 'a'.repeat(100), utm_content: 'x y<script>' });
  const n = nguonTuYeuCau(q, 'https://www.Google.com/search?q=abc', 'xemtuvi.vn');
  assert.equal(n.utm_source, 'fb'); assert.equal(n.utm_campaign, 't1');
  assert.equal(n.utm_medium.length, 64); assert.equal(n.utm_content, 'xyscript');
  assert.equal(n.ref, 'www.google.com'); // chỉ tên máy chủ, không đường dẫn/query
});
test('Vào thẳng hoặc giới thiệu từ chính site: rỗng', () => {
  assert.deepEqual(nguonTuYeuCau(new URLSearchParams(), null, 'xemtuvi.vn'), {});
  assert.deepEqual(nguonTuYeuCau(new URLSearchParams(), 'https://xemtuvi.vn/a', 'xemtuvi.vn:443'), {});
  assert.deepEqual(nguonTuYeuCau(new URLSearchParams(), 'không phải url', 'xemtuvi.vn'), {});
});
test('Cookie: mã hóa rồi giải lại; cookie bị sửa vẫn được làm sạch; không nhận trường lạ', () => {
  const n = { utm_source: 'fb', utm_campaign: 't1', ref: 'tuvi.vn' };
  assert.deepEqual(giaiMaNguon(moHoaNguon(n)), n);
  assert.deepEqual(giaiMaNguon('utm_source=FB%20!!&ip=1.2.3.4&ua=x&utm_term=a'), { utm_source: 'fb' });
  assert.deepEqual(giaiMaNguon(null), {});
});
