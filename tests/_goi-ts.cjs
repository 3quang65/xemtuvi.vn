// Trợ giúp cho test: đọc giá từ src/lib/goi.ts (không có file .test.cjs nên npm test không chạy trực tiếp).
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
function tra() {
  const nguon = fs.readFileSync(path.join(__dirname, '../src/lib/goi.ts'), 'utf8');
  const js = ts.transpileModule(nguon, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const m = { exports: {} };
  new Function('module', 'exports', 'require', js)(m, m.exports, (x) => require(path.join(__dirname, '../src/lib', x.replace(/^\.\//, ''))));
  return Object.fromEntries(m.exports.GOI.map((g) => [g.ma, g.gia]));
}
module.exports = { tra };
