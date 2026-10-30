// L2: gộp mọi quyền của một lá số (trọn lá số + chủ đề mua thêm + thành viên), không chỉ quyền gần nhất.
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { tongHopQuyen, CHU_DE_TRON } = nap('lib/quyen-xem.ts');

const q = (loai, laSoId, chuDe = null) => ({ loai, laSoId, chuDe });

test('không quyền → null', () => {
  assert.equal(tongHopQuyen([], 1, [1]), null);
  assert.equal(tongHopQuyen([q('tron_la_so', 2)], 1, [1, 2]), null);
});
test('trọn lá số rồi mua thêm chủ đề: vẫn đủ 4 chủ đề (L2)', () => {
  const r = tongHopQuyen([q('tron_la_so', 1), q('chu_de', 1, 'su-nghiep')], 1, [1]);
  assert.equal(r.goi, 'tron-la-so');
  assert.deepEqual(r.dsChuDe, CHU_DE_TRON);
});
test('chỉ chủ đề: gộp các chủ đề, theo thứ tự chuẩn, bỏ trùng', () => {
  const r = tongHopQuyen([q('chu_de', 1, 'su-nghiep'), q('chu_de', 1, 'ban-than'), q('chu_de', 1, 'su-nghiep'), q('chu_de', 2, 'tinh-cam')], 1, [1, 2]);
  assert.equal(r.goi, 'mot-chu-de');
  assert.deepEqual(r.dsChuDe, ['ban-than', 'su-nghiep']);
});
test('thành viên: phủ 3 lá số đầu, lá số thứ 4 thì không', () => {
  const ds = [1, 2, 3, 4];
  assert.equal(tongHopQuyen([q('thanh_vien', null)], 3, ds).goi, 'thanh-vien-nam');
  assert.equal(tongHopQuyen([q('thanh_vien', null)], 4, ds), null);
  assert.equal(tongHopQuyen([q('thanh_vien', null), q('chu_de', 4, 'ban-than')], 4, ds).goi, 'mot-chu-de');
});
test('thành viên + trọn lá số: hiện gói rộng nhất', () => {
  assert.equal(tongHopQuyen([q('tron_la_so', 1), q('thanh_vien', null)], 1, [1]).goi, 'thanh-vien-nam');
});
test('chọn lá số mặc định: lá số có quyền đầu tiên', () => {
  const { laSoMacDinh } = nap('lib/quyen-xem.ts');
  assert.equal(laSoMacDinh([q('tron_la_so', 2)], [1, 2]), 2);
  assert.equal(laSoMacDinh([], [5, 6]), 5);
  assert.equal(laSoMacDinh([], []), null);
});

test('L1/L2: LuanGiai không phụ thuộc sessionStorage và không dùng quyền gần nhất', () => {
  const src = require('node:fs').readFileSync(require('node:path').join(__dirname, '../src/components/LuanGiai.tsx'), 'utf8');
  assert.doesNotMatch(src, /useLaSoDaLuu/);
  assert.doesNotMatch(src, /\.at\(-1\)/);
  assert.match(src, /\/api\/la-so/);
});
