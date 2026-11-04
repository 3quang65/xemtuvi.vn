// L-6f7e17: mục cấu hình rỗng vẫn ẩn khỏi khách, nhưng phải được đếm + cảnh báo.
// (protects: dien-trach đủ 6/6 mục; fails_when: thiếu mục nguoi-than/phong-cach; no_claim: không kiểm chất lượng nội dung)
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

test('ghiNhanMucMat: mục rỗng được đếm, cảnh báo 1 lần, mục có nội dung không bị tính', () => {
  AI.xoaThongKeMucMat();
  const warn = console.warn; const dong = []; console.warn = (s) => dong.push(s);
  try {
    const ra = [{ id: 'a', nhanDinh: [1] }, { id: 'b', nhanDinh: [] }];
    assert.deepEqual(AI.ghiNhanMucMat('x', ['a', 'b', 'c'], ra), ['b', 'c']);
    AI.ghiNhanMucMat('x', ['a', 'b', 'c'], ra);
  } finally { console.warn = warn; }
  assert.deepEqual(AI.thongKeMucMat().x, { soLuot: 2, mat: { b: 2, c: 2 } });
  assert.equal(dong.length, 2);
  AI.xoaThongKeMucMat();
});

test('sinhLuanGiai dien-trach: mục rỗng ẩn khỏi khách nhưng được đếm', async () => {
  AI.xoaThongKeMucMat();
  const warn = console.warn; console.warn = () => {};
  try {
    for (const tc of TC) {
      const bai = await AI.sinhLuanGiai(lapLaSo(tc.input), 'dien-trach', { boQuaCache: true });
      assert.ok(bai.muc.every((m) => m.nhanDinh.length), `${tc.id}: không được trả mục rỗng ra khách`);
    }
  } finally { console.warn = warn; }
  const tk = AI.thongKeMucMat()['dien-trach'];
  assert.equal(tk.soLuot, TC.length);
});
