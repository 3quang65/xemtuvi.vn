// Đo số đoạn đủ 4 phần theo mảng cho 25 lá số tuổi Canh (như tests/luan-giai-van-nam-4-phan.test.cjs) + VN01–VN03,
// và liệt kê đoạn bị loại (thiếu (a)/(d)) theo mã quy tắc. Chạy: node docs/luan-giai/van-nam/bo-sung-L-d94399/do-doan-du.cjs [> file.md]
// Chỉ đọc; không sửa src. Dùng để lập bảng trước/sau việc L-2381a4.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => {
  m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText, f);
};
const ROOT = path.join(__dirname, '../../../..');
const { lapLaSo } = require(path.join(ROOT, 'src/lib/tuvi/index.ts'));
const VN = require(path.join(ROOT, 'src/lib/luan-giai/ai/van-nam.ts'));
const DIR = path.join(ROOT, 'docs/luan-giai/van-nam/');
const DU_LIEU = fs.readFileSync(DIR + 'du-lieu.md', 'utf8').split(/\n(?=## VN)/).slice(1);
const DAU_VAO = DU_LIEU.map((k, i) => ({ ten: `VN0${i + 1}`, inp: JSON.parse(k.match(/Đầu vào: `(\{.*\})`/)[1]) }));
const CANH = [];
for (const nam of [1970, 1980, 1990, 2000, 2010]) for (const [thang, gio, gioiTinh] of [[4, 9, 'nam'], [5, 5, 'nu'], [7, 15, 'nam'], [10, 21, 'nu'], [12, 1, 'nu']])
  CANH.push({ ten: `Canh ${nam} ${gioiTinh} ${thang}/${gio}h`, inp: { lich: 'duong', ngay: 12, thang, nam, gio, phut: 0, gioiTinh } });
const MANG = ['tong-quan', 'su-nghiep', 'tai-chinh', 'tinh-cam', 'suc-khoe'];
(async () => {
  const thieu = { d: {}, a: {} };
  const dong = [];
  let laThieu = 0;
  for (const { ten, inp } of [...DAU_VAO, ...CANH]) {
    const ls = lapLaSo(inp);
    const bai = await VN.sinhVanNam(ls, { boQuaCache: true });
    const cho = await VN.doanChoVanNam(ls);
    const dem = Object.fromEntries(MANG.map((m) => [m, 0]));
    for (const m of bai.muc) dem[m.id] = (m.nhanDinh || []).filter((n) => !n.cauDan).length;
    const mangThieu = MANG.slice(1).filter((m) => !dem[m]);
    if (mangThieu.length) laThieu++;
    dong.push(`| ${ten} | ${MANG.map((m) => dem[m] ?? '-').join(' | ')} | ${mangThieu.join(', ') || 'đủ'} | ${cho.map((d) => `${d.quyTacId}@${d.cung}${/\(a\)/.test(d.lyDo) ? '(a)' : ''}`).join(', ')} |`);
    for (const d of cho) {
      const k = /\(a\)/.test(d.lyDo) ? 'a' : 'd';
      thieu[k][d.quyTacId] = thieu[k][d.quyTacId] || { so: 0, cung: new Set(), laSo: new Set() };
      thieu[k][d.quyTacId].so++; thieu[k][d.quyTacId].cung.add(d.cung); thieu[k][d.quyTacId].laSo.add(ten);
    }
  }
  const out = [];
  out.push(`# Đo đoạn đủ 4 phần — Vận 2027 (${new Date().toISOString().slice(0, 10)}, HEAD ${require('child_process').execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim()})`, '');
  out.push(`Lá số có ít nhất một mảng trống: **${laThieu}/${DAU_VAO.length + CANH.length}**.`, '');
  out.push('| Lá số | Tổng quan | Sự nghiệp | Tài chính | Tình cảm | Sức khỏe | Mảng trống | Đoạn bị loại (mã@cung; (a) = thiếu căn cứ, còn lại thiếu việc) |', '|---|---|---|---|---|---|---|---|', ...dong, '');
  for (const [k, tieuDe] of [['d', 'Thiếu (d) — không mẫu việc nào bám được, theo mã quy tắc (số lần, cung, số lá số)'], ['a', 'Thiếu (a) — không dựng được căn cứ']]) {
    out.push(`## ${tieuDe}`, '', '| Mã quy tắc | Số lần | Cung | Số lá số |', '|---|---|---|---|');
    for (const [id, v] of Object.entries(thieu[k]).sort((x, y) => y[1].so - x[1].so)) out.push(`| ${id} | ${v.so} | ${[...v.cung].join(', ')} | ${v.laSo.size} |`);
    out.push('');
  }
  console.log(out.join('\n'));
})();
