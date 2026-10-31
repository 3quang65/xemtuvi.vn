// NAM-LUU-03: từ tuổi âm (mụ) >= mốc trong nen-cung-thang.json thì dùng câu quyNhanLuuTuoi50 (việc L-1182ed).
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const VN = nap('lib/luan-giai/ai/van-nam.ts');
const NEN = require('../src/lib/luan-giai/ai/quy-tac-van/nen-cung-thang.json').quyNhanLuuTuoi50;
const VAN = require('../src/lib/luan-giai/ai/quy-tac-van/van-nam-2027.json');
const tim = (o) => Array.isArray(o) ? o.flatMap(tim) : o && typeof o === 'object' ? (o.id === 'NAM-LUU-03' ? [o] : Object.values(o).flatMap(tim)) : [];
const q = tim(VAN)[0];
const MOC = NEN.tuoiTu;
const CUNG = Object.keys(NEN).filter((k) => !k.startsWith('_') && k !== 'tuoiTu');

test('mốc tuổi nằm trong JSON và là 50', () => assert.equal(MOC, 50));
test('đủ 12 cung', () => { assert.equal(CUNG.length, 12); assert.deepEqual([...CUNG].sort(), Object.keys(q.noiDungTheoCung).sort()); });
test('tuổi 49 giữ câu cũ', () => assert.equal(VN.quyTacTheoTuoi(q, MOC - 1), q));
test('tuổi 50 và trên dùng câu mới cho cả 12 cung, câu cũ không còn', () => {
  for (const tuoi of [MOC, MOC + 20]) {
    const r = VN.quyTacTheoTuoi(q, tuoi);
    for (const c of CUNG) {
      assert.equal(r.noiDungTheoCung[c], NEN[c], c);
      assert.notEqual(r.noiDungTheoCung[c], q.noiDungTheoCung[c], c);
    }
  }
});
test('câu mới không lẫn chữ của câu cũ (học hành, thầy cô, học trò, tìm hiểu, trình bày bản thân)', () => {
  const CU = /học hành|thầy cô|học trò|tìm hiểu|trình bày bản thân/;
  for (const c of CUNG) assert.ok(!CU.test(NEN[c]), c);
});
test('quy tắc khác không bị đổi; không đổi dữ liệu gốc', () => {
  const khac = { id: 'NAM-LUU-04', noiDungTheoCung: { Mệnh: 'x' } };
  assert.equal(VN.quyTacTheoTuoi(khac, 70), khac);
  const truoc = JSON.stringify(q);
  VN.quyTacTheoTuoi(q, 70);
  assert.equal(JSON.stringify(q), truoc);
});
