// L-57a890: /toi hiện hướng dẫn + nút lập lá số khi tài khoản chưa có lá số.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const Module = require('node:module');
const goc = Module._resolveFilename;
Module._resolveFilename = function (req, ...r) { if (req.startsWith('@/')) req = path.join(__dirname, '../src', req.slice(2)); return goc.call(this, req, ...r); };
require.extensions['.tsx'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { fileName: f, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, f);
require.extensions['.ts'] = require.extensions['.ts'] || ((m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { fileName: f, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, f));
const { ToiChuaCoLaSo } = require('../src/components/TaiKhoanToi.tsx');
const nguon = fs.readFileSync(path.join(__dirname, '../src/components/TaiKhoanToi.tsx'), 'utf8');

test('trạng thái rỗng: có tiêu đề, hướng dẫn và nút dẫn về trang lập lá số', () => {
  const h = renderToStaticMarkup(React.createElement(ToiChuaCoLaSo));
  assert.match(h, /Bạn chưa có lá số nào/);
  assert.match(h, /ngày, giờ sinh/);
  assert.match(h, /<a [^>]*href="\/"[^>]*>Lập lá số của tôi<\/a>/);
  assert.match(h, /aria-labelledby="toi-rong-tieu-de"/);
  assert.doesNotMatch(h, /(sắp gặp hạn|giải hạn)/i);
});

test('trang /toi chỉ hiện trạng thái rỗng khi API trả danh sách lá số trống', () => {
  assert.match(nguon, /laSoIds\?: unknown\[\]/);
  assert.match(nguon, /soLaSo === 0 \? <ToiChuaCoLaSo \/>/);
});
