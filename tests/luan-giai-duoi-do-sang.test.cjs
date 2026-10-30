// T-080e3a: câu đuôi theo độ sáng ("Độ sáng kém, nên bù đắp…") lặp ở mọi mục: gộp còn tối đa một câu mỗi mức độ sáng mỗi bài,
// có lời riêng theo chuyên đề. Không sửa tay JSON quy tắc.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => {
  m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText, f);
};
const { lapLaSo } = require('../src/lib/tuvi/index.ts');
const AI = require('../src/lib/luan-giai/ai/index.ts');
const TC = require('../docs/nghien-cuu/tuvi-test-cases.json').cases;
const CD = ['menh', 'quan-loc', 'phu-the', 'tai-bach', 'dien-trach'];
const KEM = 'Độ sáng kém, nên bù đắp bằng sự chuẩn bị kỹ và học hỏi thêm.';
const TB = 'Độ sáng trung bình, hiệu quả phụ thuộc vào sự rèn luyện và hoàn cảnh.';

test('gopDuoiDoSang: giữ đuôi ở lần đầu mỗi mức (lời theo chuyên đề), các lần sau bỏ đuôi', () => {
  const da = new Set();
  const a = AI.gopDuoiDoSang(`Tử Vi tại Mệnh: dẫn dắt. ${KEM}`, da, 'quan-loc');
  assert.match(a, /^Tử Vi tại Mệnh: dẫn dắt\. .*kém sáng.*công việc/);
  assert.ok(!a.includes('Độ sáng kém'));
  assert.equal(AI.gopDuoiDoSang(`Thiên Cơ tại Mệnh: tinh tế. ${KEM}`, da, 'quan-loc'), 'Thiên Cơ tại Mệnh: tinh tế.');
  const b = AI.gopDuoiDoSang(`Thái Âm: dịu. ${TB}`, da, 'quan-loc');
  assert.match(b, /trung bình/);
  assert.equal(AI.gopDuoiDoSang('Câu không đuôi.', da, 'menh'), 'Câu không đuôi.');
});

test('đuôi độ sáng của hai chuyên đề khác nhau không trùng chữ', () => {
  const lời = CD.map((cd) => AI.gopDuoiDoSang(`X: y. ${KEM}`, new Set(), cd));
  assert.equal(new Set(lời).size, CD.length);
});

test(`${TC.length} lá số × ${CD.length} chuyên đề: không câu khuôn nào xuất hiện quá 1 lần trong một bài`, async () => {
  const loi = [];
  for (const tc of TC) {
    const ls = lapLaSo(tc.input);
    for (const cd of CD) {
      const bai = await AI.sinhLuanGiai(ls, cd, { boQuaCache: true });
      const dem = new Map();
      for (const m of bai.muc) for (const d of m.nhanDinh) {
        assert.ok(!d.text.includes('Độ sáng kém, nên bù đắp'), `${tc.id}/${cd}: còn đuôi cũ`);
        for (const c of d.text.split(/(?<=[.!?])\s+/).filter((x) => x.length >= 30)) dem.set(c, (dem.get(c) ?? 0) + 1);
      }
      for (const [c, n] of dem) if (n > 1) loi.push(`${tc.id}/${cd} x${n}: ${c.slice(0, 80)}`);
    }
  }
  assert.deepEqual(loi, []);
});
