// Đo tần suất khớp từng quy tắc bản 2 trên 2.500 lá số ngẫu nhiên (cùng hạt giống với test).
// Dùng để rà điều kiện: khớp 0% (điều kiện sai/quá chặt) hoặc khớp quá nhiều (thiếu điều kiện).
// Chạy: node scripts/luan-giai/do-phu-v2.cjs [file.json] [--tren 30]  → in quy tắc 0% và quy tắc ≥ 30%.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => {
  m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText, f);
};
const GOC = path.join(__dirname, '../..');
const { lapLaSo } = require(path.join(GOC, 'src/lib/tuvi/index.ts'));
const { khopQuyTac } = require(path.join(GOC, 'src/lib/luan-giai/ai/khop-v2.ts'));
const DIR = path.join(GOC, 'src/lib/luan-giai/ai/quy-tac-v2');
const args = process.argv.slice(2);
const tren = Number(args[args.indexOf('--tren') + 1] || 30);
const tep = args.filter((a) => a.endsWith('.json'));
const QT = fs.readdirSync(DIR).filter((f) => f.endsWith('.json') && (!tep.length || tep.includes(f))).flatMap((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')));
let hat = 20261030;
const ngau = (n) => { hat = (hat * 1103515245 + 12345) % 2147483648; return hat % n; };
const LS = Array.from({ length: 2500 }, () => lapLaSo({ lich: 'duong', ngay: 1 + ngau(28), thang: 1 + ngau(12), nam: 1960 + ngau(50), gio: ngau(24), phut: 30, gioiTinh: ngau(2) ? 'nam' : 'nu' }));
const kq = QT.map((q) => ({ id: q.id, loai: q.loai, pt: (100 * LS.filter((ls) => khopQuyTac(ls, q) !== null).length) / LS.length }));
const in_ = (ds) => ds.forEach((x) => console.log(`${x.pt.toFixed(1).padStart(5)}%  ${x.loai.padEnd(5)} ${x.id}`));
console.log(`== ${QT.length} quy tắc; 0%:`); in_(kq.filter((x) => x.pt === 0));
console.log(`== ≥ ${tren}%:`); in_(kq.filter((x) => x.pt >= tren && x.loai !== 'YN'));
const bai = {}; // số quy tắc trung bình mỗi bài theo chuyên đề
for (const cd of ['menh', 'quan-loc', 'phu-the']) { const q = QT.filter((x) => x.chuyenDe === cd); if (q.length) bai[cd] = (LS.slice(0, 300).reduce((s, ls) => s + q.filter((x) => khopQuyTac(ls, x) !== null).length, 0) / 300).toFixed(1); }
console.log('== số câu trung bình/bài:', bai);
