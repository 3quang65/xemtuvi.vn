// In mảng Sự nghiệp (Vận 2027) cho các lá số của phiếu Thư L-5e7bce mục 4 điều 2, dạng bản in 4 phần.
// Chạy trong bản sao đã áp giả lập: node docs/luan-giai/van-nam/bo-sung-L-d94399/in-su-nghiep.cjs [nam:gioiTinh:thang:gio ...]
// Chỉ đọc; không sửa src.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => {
  m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText, f);
};
const ROOT = path.join(__dirname, '../../../..');
const { lapLaSo } = require(path.join(ROOT, 'src/lib/tuvi/index.ts'));
const VN = require(path.join(ROOT, 'src/lib/luan-giai/ai/van-nam.ts'));
const MAC_DINH = ['1970:nu:5:5', '2000:nu:5:5', '1990:nam:4:9', '2000:nam:4:9', '2010:nam:4:9'];
(async () => {
  const out = [];
  for (const k of process.argv.slice(2).length ? process.argv.slice(2) : MAC_DINH) {
    const [nam, gioiTinh, thang, gio] = k.split(':');
    const ls = lapLaSo({ lich: 'duong', ngay: 12, thang: +thang, nam: +nam, gio: +gio, phut: 0, gioiTinh });
    const bai = await VN.sinhVanNam(ls, { boQuaCache: true });
    const m = bai.muc.find((x) => x.id === 'su-nghiep');
    out.push(`### Canh ${nam} ${gioiTinh} ${thang}/${gio}h`);
    for (const nd of m.nhanDinh) {
      const id = nd.thamChieu.quyTacId;
      if (nd.cauDan || !nd.viecNenLam) { out.push(`- [câu dẫn ${nd.phan} ${id}] ${nd.text}`); continue; }
      const v = nd.viecNenLam;
      out.push(`- [4 phần ${nd.phan} ${id}]`, `  (a) ${nd.canCu}`, `  (b) ${nd.text}`, `  (c) ${nd.nguon}`,
        `  (d) ${v.cau} Cách đo: ${v.thuocDo} (${v.thoiHanThang} tháng) — ${nd.thamChieu.viecBam}`);
    }
    out.push('');
  }
  console.log(out.join('\n'));
})();
