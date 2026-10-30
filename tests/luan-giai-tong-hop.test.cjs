// L-28bc46: lớp tổng hợp chỉ chạy khi bật tuỳ chọn tongHop; mặc định không đổi bài.
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { lapLaSo } = nap('lib/tuvi/index.ts');
const AI = nap('lib/luan-giai/ai/index.ts');
const ls = lapLaSo({ lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 4, phut: 30, gioiTinh: 'nu' });
test('mặc định không có mục Tóm lại', async () => {
  const b = await AI.sinhLuanGiai(ls, 'menh', { boQuaCache: true });
  assert.ok(!b.muc.some((m) => m.id === 'tom-lai'));
});
test('tongHop:true thêm mục Tóm lại đầu bài, mọi câu tổng hợp có nguồn', async () => {
  const b = await AI.sinhLuanGiai(ls, 'menh', { boQuaCache: true, tongHop: true });
  assert.equal(b.muc[0].id, 'tom-lai');
  for (const n of b.muc[0].nhanDinh) assert.ok(n.thamChieu.nguon && n.thamChieu.truongPhai);
});
