// L-d9246d: dòng "Căn cứ" dưới mỗi nhận định.
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { dongCanCu } = nap('lib/luan-giai/can-cu.ts');

test('đủ sao, yếu tố, cung, nguồn, trường phái', () => {
  assert.equal(
    dongCanCu({ sao: ['Thiên Cơ', 'Thái Âm'], yeuTo: ['Cách Cơ Nguyệt Đồng Lương'], cung: 'Mệnh', nguon: 'Toàn Thư', truongPhai: 'Tam hợp phái Việt' }),
    'Căn cứ: sao Thiên Cơ, Thái Âm; yếu tố Cách Cơ Nguyệt Đồng Lương; cung Mệnh; nguồn Toàn Thư; trường phái Tam hợp phái Việt');
});
test('không có sao/yếu tố (VAN-CUNG-00/13): chỉ in phần có, không chỗ trống', () => {
  const s = dongCanCu({ sao: [], cung: 'Phúc Đức', nguon: 'Tân Biên', truongPhai: 'Tam hợp phái Việt' });
  assert.equal(s, 'Căn cứ: cung Phúc Đức; nguồn Tân Biên; trường phái Tam hợp phái Việt');
  assert.ok(!/sao|yếu tố|;\s*;|:\s*;/.test(s.replace('trường phái', '')));
});
test('không có gì thì trả chuỗi rỗng', () => assert.equal(dongCanCu({ sao: [] }), ''));
test('mọi nhận định bài Bản thân đều có dòng căn cứ có cung', async () => {
  const { lapLaSo } = nap('lib/tuvi/index.ts');
  const AI = nap('lib/luan-giai/ai/index.ts');
  const ls = lapLaSo({ lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 5, phut: 30, gioiTinh: 'nu' });
  const bai = await AI.sinhLuanGiai(ls, 'menh', { boQuaCache: true });
  for (const m of bai.muc) for (const n of m.nhanDinh) assert.match(dongCanCu(n.thamChieu), /^Căn cứ: .*cung .*nguồn .*trường phái /);
});
