// Trợ giúp cho test: cho phép require() trực tiếp tệp .ts của máy chủ (biên dịch bằng typescript).
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
if (!require.extensions['.ts']) {
  require.extensions['.ts'] = (m, f) => {
    const js = ts.transpileModule(fs.readFileSync(f, 'utf8'), { fileName: f, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    m._compile(js, f);
  };
}
// Bí danh '@/' như tsconfig
const Module = require('node:module');
const goc = Module._resolveFilename;
Module._resolveFilename = function (req, ...r) {
  if (req.startsWith('@/')) req = path.join(__dirname, '../src', req.slice(2));
  return goc.call(this, req, ...r);
};
module.exports = (rel) => require(path.join(__dirname, '../src', rel));
