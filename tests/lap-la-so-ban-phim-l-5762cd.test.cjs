// L-5762cd: trợ năng bàn phím cho form lập lá số (nhãn, thứ tự Tab, thông báo lỗi aria-live, focus vào ô lỗi đầu).
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
const bien = (f) => ts.transpileModule(fs.readFileSync(f, 'utf8'), { fileName: f, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
require.extensions['.tsx'] = (m, f) => m._compile(bien(f), f);
require.extensions['.ts'] = require.extensions['.ts'] || ((m, f) => m._compile(bien(f), f));
const nguonPath = path.join(__dirname, '../src/components/LapLaSo.tsx');
const nguon = fs.readFileSync(nguonPath, 'utf8');

// Đồ họa phụ thuộc trình duyệt (next/dynamic) không cần cho phần form.
const dyn = require.resolve('next/dynamic');
require.cache[dyn] = { id: dyn, filename: dyn, loaded: true, exports: { __esModule: true, default: () => () => null } };
const LapLaSo = require(nguonPath).default;
const html = renderToStaticMarkup(React.createElement(LapLaSo));
const form = html.slice(html.indexOf('<form'), html.indexOf('</form>'));
const thePhanTu = (ten) => [...form.matchAll(new RegExp(`<${ten}\\b[^>]*>`, 'g'))].map((m) => m[0]);

test('mọi ô nhập đều có tên truy cập (label bọc ngoài hoặc aria-label)', () => {
  const o = [...thePhanTu('input'), ...thePhanTu('select')];
  assert.ok(o.length >= 8, `chỉ thấy ${o.length} ô`);
  for (const t of o) {
    assert.ok(/aria-label="[^"]+"/.test(t) || /type="(radio|checkbox)"/.test(t) || /maxLength="60"/.test(t), `ô thiếu nhãn: ${t}`);
  }
  // ô radio/checkbox nằm trong <label> hoặc <fieldset><legend>
  assert.equal((form.match(/<fieldset/g) || []).length, (form.match(/<legend/g) || []).length);
  // ô họ tên: input nằm trong <label> có chữ
  assert.match(form, /<label class="o"><span>Họ tên/);
});

test('thứ tự Tab theo thứ tự đọc: không dùng tabindex dương', () => {
  assert.doesNotMatch(form, /tabindex="[1-9]/i);
  const thuTu = ['Họ tên', 'Giới tính', 'Ngày sinh', 'Giờ sinh'].map((x) => form.indexOf(x));
  assert.deepEqual([...thuTu].sort((a, b) => a - b), thuTu);
  assert.ok(form.lastIndexOf('Lập lá số') > form.indexOf('Giờ sinh'));
});

test('ô giới tính, ngày, giờ gắn aria-invalid khi có lỗi (nguồn)', () => {
  assert.match(nguon, /name="gt"[^>]*aria-invalid=\{loi\?\.o === 'gioiTinh'\}/);
  assert.match(nguon, /aria-label="Phút sinh"[^>]*aria-invalid=\{loi\?\.o === 'gio'\}/);
});

test('lỗi được đọc ngay (role=alert / aria-live) và có chỗ chứa cố định cho trình đọc màn hình', () => {
  const tbl = fs.readFileSync(path.join(__dirname, '../src/components/ThongBaoLoi.tsx'), 'utf8');
  assert.match(tbl, /role="alert"/);
  assert.match(nguon, /role="alert" className="loi-muigio"/);
  assert.match(form, /id="loi-tom-tat"[^>]*role="status"[^>]*aria-live="polite"/);
});

test('submit lỗi: đưa focus vào ô lỗi đầu tiên (không chỉ cuộn)', () => {
  const m = /if \(l\) \{ setLoi\(l\);[^\n]*\n/.exec(nguon);
  assert.ok(m, 'không thấy nhánh báo lỗi');
  assert.match(m[0], /requestAnimationFrame\(\(\) => veO\(l\.o\)\)/);
  assert.doesNotMatch(m[0], /scrollIntoView/);
});
