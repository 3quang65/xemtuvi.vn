// Kho mẫu huấn luyện luận giải (L-c8e74f). Lõi dùng chung cho lưu / nạp / thống kê.
// Kho nằm NGOÀI repo công khai: ~/xemtuvi-data/mau-luan-giai/ (đổi bằng MAU_LUAN_GIAI_DIR). Không chứa tên/SĐT/email khách.
// Mẫu dương: <YYYY-MM>.jsonl · mẫu âm: am-<YYYY-MM>.jsonl (theo tháng của trường `ngay`).
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const ROOT = path.join(__dirname, '../..');
const HOME = process.env.HOME || '/home/claude';
const KHO = process.env.MAU_LUAN_GIAI_DIR || path.join(HOME, 'xemtuvi-data', 'mau-luan-giai');
const NGUON = ['claude', 'hanh', 'duc', 'mau'];
const NGUON_GOC = ['sach', 'nguoi', 'claude', 'claude-bien-tap-nguoi'];
const TANG = ['bai', 'doan'];
// Ngưỡng mẫu dương (Minh chốt 31/10, L-733080): TB ≥ 7,5; không tiêu chí < 6; Sâu ≥ 6; An toàn = 10; Đúng ≥ 8.
const NGUONG = { tb: 7.5, tieuChiMin: 6, sauMin: 6, anToan: 10, dungMin: 8 };

function nhapTs() {
  if (require.extensions['.ts']) return;
  let ts;
  for (const p of [ROOT, path.join(HOME, 'xemtuvi.vn')]) { try { ts = require(require.resolve('typescript', { paths: [p] })); break; } catch { /* thử chỗ khác */ } }
  if (!ts) throw new Error('Không tìm thấy gói typescript (chạy trong repo xemtuvi.vn đã npm ci)');
  require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { fileName: f, compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText, f);
}
let _engine;
function engine() { if (!_engine) { nhapTs(); _engine = require(path.join(ROOT, 'src/lib/tuvi/index.ts')); } return _engine; }

function tuCam() {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'src/lib/luan-giai/ai/tu-cam.json'), 'utf8')).tuCam || []; } catch { return []; }
}
function gitHash(...paths) {
  try { return execFileSync('git', ['-C', ROOT, 'log', '-1', '--format=%h', '--', ...paths], { encoding: 'utf8' }).trim() || 'khong-ro'; } catch { return 'khong-ro'; }
}
const phienBanQuyTac = () => gitHash('src/lib/tuvi');
const phienBanKho = () => gitHash('src/lib/luan-giai/ai/quy-tac.json', 'src/lib/luan-giai/ai/quy-tac-khung.json');

const sao = (s) => s.ten + (s.dacTinh ? `(${s.dacTinh})` : '') + (s.hoa ? `[${s.hoa}]` : '');
/** Lá số có cấu trúc từ đầu vào sinh. Chỉ dữ liệu lá số: bỏ `ten`. `ngay` (YYYY-MM-DD) dùng tính tuổi mụ và đại vận hiện tại. */
function laSoCauTruc(input, ngay) {
  const { lapLaSo } = engine();
  const { ten, ...sach } = input;
  const ls = lapLaSo(sach);
  const namXem = Number(ngay.slice(0, 4));
  const tuoiMu = namXem - ls.am.nam + 1;
  const cung = ls.cung.map((c) => ({
    ten: c.ten, chi: c.tenChi, can: c.can, laThan: c.laThan, tuan: c.tuan, triet: c.triet,
    chinhTinh: c.chinhTinh.map(sao), catTinh: c.catTinh.map(sao), hungTinh: c.hungTinh.map(sao), phuTinh: c.phuTinh.map(sao),
    trangSinh: c.trangSinh, daiVan: c.daiVan, daiVanTu: c.daiVanTu,
  }));
  const dv = cung.find((c) => tuoiMu >= c.daiVanTu && tuoiMu < c.daiVanTu + 10);
  return {
    dauVao: sach,
    gioiTinh: ls.gioiTinh, amDuongLy: ls.amDuongLy, am: ls.am, canChi: ls.canChi, conGiap: ls.conGiap,
    banMenh: ls.banMenh, cuc: ls.cuc, sinhKhac: ls.sinhKhac, menhTai: ls.menhTai, thanTai: ls.thanTai,
    menhChu: ls.menhChu, thanChu: ls.thanChu, tuan: ls.tuan, triet: ls.triet,
    tuoiMu, daiVanHienTai: dv ? { cung: dv.ten, chi: dv.chi, tuoi: dv.daiVan } : null,
    cung,
  };
}
const laSoId = (ls) => 'LS-' + crypto.createHash('sha1').update(JSON.stringify(ls.dauVao)).digest('hex').slice(0, 10);

const diemTB = (d) => Math.round(((d.dung + d.sau + d.giong + d.anToan) / 4) * 100) / 100;
/** Phân loại theo ngưỡng Minh chốt. Trả { duong, lyDo[] }. */
function phanLoai(d) {
  const lyDo = [];
  const tb = diemTB(d);
  if (tb < NGUONG.tb) lyDo.push(`tb-duoi-${NGUONG.tb}`);
  for (const [k, v] of Object.entries(d)) if (v < NGUONG.tieuChiMin) lyDo.push(`${k}-duoi-${NGUONG.tieuChiMin}`);
  if (d.sau < NGUONG.sauMin && !lyDo.includes(`sau-duoi-${NGUONG.sauMin}`)) lyDo.push('sau-thap');
  if (d.anToan < NGUONG.anToan) lyDo.push('an-toan-duoi-10');
  if (d.dung < NGUONG.dungMin) lyDo.push(`dung-duoi-${NGUONG.dungMin}`);
  return { duong: lyDo.length === 0, lyDo: [...new Set(lyDo)] };
}

const RE_RIENG_TU = [
  [/(?:\+?84|\b0)[\s.\-]?\d{2,3}[\s.\-]?\d{3}[\s.\-]?\d{3,4}\b/, 'số điện thoại'],
  [/[\w.+-]+@[\w-]+\.[\w.-]+/, 'email'],
];
/** Kiểm đủ trường và quy tắc cấm. Ném Error nếu sai (lệnh lưu từ chối mẫu sai). */
function kiemTra(m) {
  const loi = [];
  const can = ['id', 'ngay', 'tang', 'laSo', 'laSoId', 'cauHoi', 'loiGiai', 'maQuyTac', 'tyLeChuMau', 'nguoiViet', 'nguoiBienTap', 'nguoiCham', 'diem', 'diemThu', 'loai', 'phienBanQuyTac', 'phienBanKho', 'nguon', 'nguonGoc', 'quyenSoHuu'];
  for (const k of can) if (m[k] === undefined || m[k] === '') loi.push(`thiếu trường ${k}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(m.ngay || '')) loi.push('ngay phải dạng YYYY-MM-DD');
  if (!TANG.includes(m.tang)) loi.push('tang phải là bai|doan');
  if (!NGUON.includes(m.nguon)) loi.push('nguon phải là ' + NGUON.join('|'));
  if (!NGUON_GOC.includes(m.nguonGoc)) loi.push('nguonGoc phải là ' + NGUON_GOC.join('|'));
  if (m.quyenSoHuu !== 'xemtuvi.vn') loi.push('quyenSoHuu phải là xemtuvi.vn');
  if (!Array.isArray(m.maQuyTac)) loi.push('maQuyTac phải là mảng');
  if (m.tyLeChuMau !== null && !(typeof m.tyLeChuMau === 'number' && m.tyLeChuMau >= 0 && m.tyLeChuMau <= 100)) loi.push('tyLeChuMau là số 0–100 hoặc null (chưa đo)');
  const d = m.diemThu;
  if (!d || ['dung', 'sau', 'giong', 'anToan'].some((k) => !(typeof d[k] === 'number' && d[k] >= 0 && d[k] <= 10))) loi.push('diemThu cần đủ 4 số 0–10 (dung, sau, giong, anToan)');
  else {
    if (Math.abs(diemTB(d) - m.diem) > 0.011) loi.push(`diem ${m.diem} ≠ trung bình 4 tiêu chí ${diemTB(d)}`);
    const pl = phanLoai(d);
    if (pl.duong && m.loai !== 'duong') loi.push('đạt ngưỡng dương nhưng loai=am (không hạ điểm/nhãn)');
    if (!pl.duong && m.loai === 'duong') loi.push('chưa đạt ngưỡng dương (' + pl.lyDo.join(', ') + '): lưu thành mẫu âm, không nâng điểm');
  }
  if (m.loai === 'am' && !m.lyDoAm) loi.push('mẫu âm bắt buộc có lyDoAm');
  if (!['duong', 'am'].includes(m.loai)) loi.push('loai phải là duong|am');
  const chu = [m.cauHoi, m.loiGiai].join('\n');
  for (const [re, ten] of RE_RIENG_TU) if (re.test(chu)) loi.push(`chứa ${ten} (cấm dữ liệu khách)`);
  if (m.laSo && (m.laSo.ten || m.laSo.dauVao?.ten)) loi.push('laSo không được chứa tên khách');
  if (m.loai === 'duong') { const low = chu.toLowerCase(); for (const t of tuCam()) if (low.includes(t.toLowerCase())) loi.push(`chứa từ cấm "${t}" (mẫu dương)`); }
  if (typeof m.loiGiai === 'string' && m.loiGiai.trim().length < 80) loi.push('loiGiai quá ngắn (<80 ký tự)');
  if (loi.length) throw new Error(loi.join('; '));
}

const tepCua = (m) => path.join(KHO, (m.loai === 'am' ? 'am-' : '') + m.ngay.slice(0, 7) + '.jsonl');
function docTatCa() {
  if (!fs.existsSync(KHO)) return [];
  const ra = [];
  for (const f of fs.readdirSync(KHO).filter((x) => /^(am-)?\d{4}-\d{2}\.jsonl$/.test(x)).sort())
    for (const l of fs.readFileSync(path.join(KHO, f), 'utf8').split('\n')) if (l.trim()) ra.push(JSON.parse(l));
  return ra;
}
/** Thêm một mẫu (idempotent theo id). Trả 'moi' | 'trung'. */
function luu(m, { tuyChon = {} } = {}) {
  kiemTra(m);
  fs.mkdirSync(KHO, { recursive: true, mode: 0o700 });
  const f = tepCua(m);
  const co = (tuyChon.daCo || new Set(docTatCa().map((x) => x.id)));
  if (co.has(m.id)) return 'trung';
  fs.appendFileSync(f, JSON.stringify(m) + '\n', { mode: 0o600 });
  co.add(m.id);
  return 'moi';
}
const idMau = (laSoIdV, chuyenDe, loiGiai) => 'M-' + crypto.createHash('sha1').update(`${laSoIdV}|${chuyenDe}|${loiGiai.trim()}`).digest('hex').slice(0, 12);
const hom = () => new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);

/** Mã quy tắc nhận từ chú thích `_↳ ID ·` và `<!-- quy tắc: ID, ID -->` trong lời giải. */
function maQuyTacTu(text) {
  const ra = new Set();
  for (const m of text.matchAll(/_↳\s*([A-Z][A-Z0-9-]{3,})\s*·/g)) ra.add(m[1]);
  for (const m of text.matchAll(/<!--\s*quy tắc:\s*([^·>]*?)(?:·|-->)/g)) for (const x of m[1].split(/[,\s]+/)) if (/^[A-Z][A-Z0-9-]{3,}$/.test(x)) ra.add(x);
  return [...ra];
}
/** Dựng bản ghi đầy đủ từ tham số. `dauVao` là ThongTinSinh (không tên). Chưa kiểm tra: gọi luu() để kiểm. */
function taoMau(o) {
  const ngay = o.ngay || hom();
  const laSo = laSoCauTruc(o.dauVao, ngay);
  const lsId = laSoId(laSo);
  const d = o.diemThu;
  const pl = d ? phanLoai(d) : { duong: false, lyDo: ['thieu-diem'] };
  const loai = pl.duong ? 'duong' : 'am';
  const m = {
    id: idMau(lsId, o.chuyenDe || '', o.loiGiai), ngay, tang: o.tang || 'bai', chuyenDe: o.chuyenDe || null,
    laSo, laSoId: lsId, cauHoi: o.cauHoi || ('Luận giải ' + (o.chuyenDe || 'tổng quan') + ' theo lá số trên'),
    loiGiai: o.loiGiai, maQuyTac: o.maQuyTac || maQuyTacTu(o.loiGiai), tyLeChuMau: o.tyLeChuMau ?? null,
    nguoiViet: o.nguoiViet, nguoiBienTap: o.nguoiBienTap || o.nguoiViet, nguoiCham: o.nguoiCham,
    diem: d ? diemTB(d) : undefined, diemThu: d, loai, phienBanQuyTac: phienBanQuyTac(), phienBanKho: phienBanKho(),
    nguon: o.nguon, nguonGoc: o.nguonGoc, quyenSoHuu: 'xemtuvi.vn',
  };
  if (loai === 'am') m.lyDoAm = o.lyDoAm ? o.lyDoAm + ' [' + pl.lyDo.join(',') + ']' : pl.lyDo.join(',');
  if (o.ghiChu) m.ghiChu = o.ghiChu;
  return m;
}

module.exports = { maQuyTacTu, taoMau, ROOT, KHO, NGUONG, NGUON, NGUON_GOC, laSoCauTruc, laSoId, diemTB, phanLoai, kiemTra, luu, docTatCa, idMau, hom, phienBanQuyTac, phienBanKho };
