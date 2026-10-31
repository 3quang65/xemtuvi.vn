// Thành viên năm chỉ phủ 3 lá số đầu: lá số thứ 4 trở đi hiện thông báo nhẹ + nút mua lẻ, không rơi vào "chưa mở gói nào",
// và không gọi API nội dung (nhánh mới không dựng BaiLuan/VanNam/HoiLaSo nên không có 403 hay E07).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
process.env.MO_GOI_AN = '1';
const SRC = path.join(__dirname, '../src');
require.extensions['.ts'] = require.extensions['.tsx'] = (m, f) => {
  m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { fileName: f, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX } }).outputText, f);
};
const goc = Module._resolveFilename;
Module._resolveFilename = function (req, ...r) {
  if (req.startsWith('@/')) req = path.join(SRC, req.slice(2));
  return goc.call(this, req, ...r);
};
// Giá: dùng bảng thật, cổng Vận 2027 mở (SSR không chạy useEffect nên không thể hỏi /api/gia).
const goi = require(path.join(SRC, 'lib/goi.ts'));
const duongGia = path.join(SRC, 'lib/useGia.ts');
require.cache[duongGia] = { id: duongGia, filename: duongGia, loaded: true, exports: { useGia: () => ({ san: true, goi: [], vanNam: goi.goiTheoBang(undefined).vanNam }) } };
const { renderToStaticMarkup } = require('react-dom/server');
const React = require('react');
const { laNgoaiGoiNam, NgoaiGoiNam } = require(path.join(SRC, 'components/NgoaiGoiNam.tsx'));

const NAM = [{ loai: 'thanh_vien', chuDe: null, laSoId: null }];
const IDS = [11, 12, 13, 14, 15];

test('lá số 1–3: vẫn trong gói năm, không phải nhánh ngoài gói', () => {
  for (const id of [11, 12, 13]) assert.equal(laNgoaiGoiNam(NAM, id, IDS, 3), false);
});
test('lá số 4 trở đi: ngoài gói năm', () => {
  assert.equal(laNgoaiGoiNam(NAM, 14, IDS, 3), true);
  assert.equal(laNgoaiGoiNam(NAM, 15, IDS, 3), true);
});
test('không có thành viên năm: giữ câu cũ (không vào nhánh mới)', () => {
  assert.equal(laNgoaiGoiNam([], 14, IDS, 3), false);
  assert.equal(laNgoaiGoiNam([{ loai: 'tron_la_so', chuDe: null, laSoId: 11 }], 14, IDS, 3), false);
  assert.equal(laNgoaiGoiNam(NAM, 14, IDS, 0), false); // máy chủ chưa trả số
});
test('lá số 4 đã mua lẻ thì không còn là "ngoài gói"', () => {
  assert.equal(laNgoaiGoiNam([...NAM, { loai: 'tron_la_so', chuDe: null, laSoId: 14 }], 14, IDS, 3), false);
  assert.equal(laNgoaiGoiNam([...NAM, { loai: 'van_nam', chuDe: null, laSoId: 14 }], 14, IDS, 3), false);
});
test('hiển thị: thông báo + 2 nút mua lẻ đúng lá số, không có "chưa mở gói nào"', () => {
  const html = renderToStaticMarkup(React.createElement(NgoaiGoiNam, { laSoId: 14, soLaSo: 3 }));
  assert.match(html, /Lá số này nằm ngoài 3 lá số của gói năm/);
  assert.match(html, /href="\/thanh-toan\?goi=tron-la-so&amp;laSo=14"[^>]*>Trọn lá số/);
  assert.match(html, /href="\/thanh-toan\?goi=van-nam-2027&amp;laSo=14"[^>]*>Vận năm/);
  assert.doesNotMatch(html, /chưa mở gói nào/);
  assert.doesNotMatch(html, /tron-la-so-kem-van-nam/); // không bán gộp ở đây
});
test('LuanGiai: nhánh ngoài gói không dựng BaiLuan/VanNam/HoiLaSo/ThongBaoLoi và không gửi sự kiện lỗi', () => {
  const src = fs.readFileSync(path.join(SRC, 'components/LuanGiai.tsx'), 'utf8');
  const a = src.indexOf('if (ngoaiGoiNam');
  const nhanh = src.slice(a, src.indexOf('if (!goi || laSoId === null)', a));
  assert.match(nhanh, /<NgoaiGoiNam/);
  assert.doesNotMatch(nhanh, /BaiLuan|VanNam laSoId|HoiLaSo|LoiNoiDung|ThongBaoLoi|guiSuKien|E07/);
  const ngoai = fs.readFileSync(path.join(SRC, 'components/NgoaiGoiNam.tsx'), 'utf8');
  assert.doesNotMatch(ngoai, /fetch\(|guiSuKien|E07|useTai/);
});
test('/api/toi trả số lá số của gói năm lấy từ hằng máy chủ', async () => {
  const nap = require('./_nap-ts.cjs');
  const { moCsdl } = nap('lib/may-chu/csdl.ts');
  const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
  const x = nap('lib/may-chu/xu-ly.ts');
  require('./_dang-nhap.cjs')(x);
  const dv = nap('lib/may-chu/dich-vu.ts');
  process.env.DANG_NHAP_THU = '1'; process.env.EMAIL_THU_CHO_PHEP = '@example.vn'; process.env.CONG_THANH_TOAN = 'gia_lap';
  const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
  const H = 'xemtuvi.test';
  const yc = (url, o = {}) => new Request('https://' + H + url, { method: o.body ? 'POST' : 'GET', headers: { host: H, ...(o.body ? { 'content-type': 'application/json', origin: 'https://' + H } : {}), ...(o.cookie ? { cookie: o.cookie } : {}) }, body: o.body ? JSON.stringify(o.body) : undefined });
  const r = await x.dangNhap(yc('/api/dang-nhap', { body: { nhaCungCap: 'google', email: 'ngoai@example.vn' } }), M);
  const cookie = 'xtv_phien=' + /xtv_phien=([^;]+)/.exec(r.headers.get('set-cookie'))[1];
  const t = await (await x.toi(yc('/api/toi', { cookie }), M)).json();
  assert.equal(t.soLaSoThanhVien, dv.LA_SO_THANH_VIEN);
  assert.equal(t.soLaSoThanhVien, 3);
});
