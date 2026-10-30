// T-66d481 (Phúc báo): câu đuôi khuôn "Đây là nét nền…" lặp ở nhiều mục Cách cục. Chặn lặp câu trong một bài.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => {
  m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText, f);
};
const { lapLaSo } = require('../src/lib/tuvi/index.ts');
const AI = require('../src/lib/luan-giai/ai/index.ts');
const TC = require('../docs/nghien-cuu/tuvi-test-cases.json').cases;

test('Bộ quy tắc khung không còn đuôi khuôn "Đây là nét nền"', () => {
  const khung = fs.readFileSync(path.join(__dirname, '../src/lib/luan-giai/ai/quy-tac-khung.json'), 'utf8');
  assert.ok(!khung.includes('Đây là nét nền'));
});

for (const cd of ['menh', 'quan-loc', 'phu-the']) {
  test(`${cd}: không câu nào lặp lại trong mục Cách cục của một bài (${TC.length} lá số)`, async () => {
    for (const tc of TC) {
      const bai = await AI.sinhLuanGiai(lapLaSo(tc.input), cd, { boQuaCache: true });
      // So từng câu con (tách theo dấu chấm) trong các mục Cách cục: một câu đuôi chung không được xuất hiện ≥ 2 lần.
      const dem = new Map();
      for (const m of bai.muc.filter((x) => x.id === 'cach-cuc')) for (const d of m.nhanDinh) {
        for (const c of d.text.split(/(?<=[.!?])\s+/).filter((x) => x.length >= 30)) dem.set(c, (dem.get(c) ?? 0) + 1);
      }
      for (const [c, n] of dem) assert.ok(n <= 1, `${tc.id}/${cd}: câu lặp ${n} lần: ${c}`);
    }
  });
}
