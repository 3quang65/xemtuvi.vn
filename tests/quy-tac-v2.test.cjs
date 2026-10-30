// Nghiệm thu bộ quy tắc luận giải bản 2 (L-90ad99): định dạng, số lượng, mã nghiên cứu, nguồn, cách cục, độ phủ.
// Đặc tả: docs/luan-giai/quy-tac-v2/DINH-DANG.md. Thư mục quy tắc: src/lib/luan-giai/ai/quy-tac-v2/*.json
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => {
  m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText, f);
};
const { lapLaSo } = require('../src/lib/tuvi/index.ts');
const { khopQuyTac } = require('../src/lib/luan-giai/ai/khop-v2.ts');
const { locTuCam } = require('../src/lib/luan-giai/ai/loc.ts');
const GOC = path.join(__dirname, '..');
const DIR = path.join(GOC, 'src/lib/luan-giai/ai/quy-tac-v2');
const TU_CAM = JSON.parse(fs.readFileSync(path.join(GOC, 'src/lib/luan-giai/ai/tu-cam.json'), 'utf8'));
const NC = fs.readFileSync(path.join(GOC, 'docs/nghien-cuu/luan-giai-12-cung.md'), 'utf8');
const MA_NC = new Set([...NC.matchAll(/^- \*\*\[([A-Z]+(?:-[A-Z0-9]+)+)\]\*\*/gm)].map((m) => m[1]));
const CHUYEN_DE = ['menh', 'quan-loc', 'phu-the', 'tai-bach', 'dien-trach'];
// Cách cục của mọi chuyên đề sinh ở bộ khung (scripts/luan-giai/tao-khung.cjs), không soạn tay trong quy-tac-v2/.
const KHUNG = JSON.parse(fs.readFileSync(path.join(GOC, 'src/lib/luan-giai/ai/quy-tac-khung.json'), 'utf8'));
const SACH = ['Tử Vi Đẩu Số Toàn Thư (Hy Di Trần Đoàn)', 'Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)', 'Tử Vi Nghiệm Lý Toàn Thư (Thiên Lương)',
  'Tử Vi Chỉ Nam (Song An Đỗ Văn Lưu)', 'Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)', 'Tử Vi Hàm Số (Nguyễn Phát Lộc)', 'Trung Châu phái (Vương Đình Chi)',
  'Phi tinh – Tứ Hóa phái', 'Đặc tả an sao xemtuvi.vn'];
const CACH_CUC = ['Tử Phủ Vũ Tướng', 'Sát Phá Tham', 'Cơ Nguyệt Đồng Lương', 'Cự Nhật', 'Hỏa Tham / Linh Tham', 'Tử Phá', 'Cơ Lương', 'Nhật Nguyệt', 'Tham Đào', 'Không Kiếp giáp / chiếu'];
const LOAI = ['YN', 'CT', 'C', 'SP', 'CC', 'HOA', 'TUAN', 'TRIET', 'VCD'];
const VI_TRI = ['chinh', 'xung', 'tam-hop', 'tam-phuong', 'hop-chieu', 'giap'];
const DO_SANG = ['Miếu', 'Vượng', 'Đắc', 'Bình', 'Hãm'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

// QT_TEP=menh.json,cach-cuc.json: chỉ kiểm các file này (khi đang soạn từng phần). QT_MIN: ngưỡng số quy tắc (mặc định 150).
const CHI_TEP = process.env.QT_TEP ? process.env.QT_TEP.split(',') : null;
const MIN = Number(process.env.QT_MIN ?? 150);
const QT = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.json') && (!CHI_TEP || CHI_TEP.includes(f))).flatMap((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')).map((q) => ({ ...q, _tep: f }))) : [];

// Lá số ngẫu nhiên có hạt giống cố định: dùng cho tên sao/cung hợp lệ và kiểm tra độ phủ điều kiện.
let hat = 20261030;
const ngau = (n) => { hat = (hat * 1103515245 + 12345) % 2147483648; return hat % n; };
const LA_SO = Array.from({ length: 2500 }, () => lapLaSo({ lich: 'duong', ngay: 1 + ngau(28), thang: 1 + ngau(12), nam: 1960 + ngau(50), gio: ngau(24), phut: 30, gioiTinh: ngau(2) ? 'nam' : 'nu' }));
const TEN_SAO = new Set(LA_SO.slice(0, 200).flatMap((ls) => ls.cung.flatMap((c) => [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh].map((s) => s.ten))));
const TEN_CUNG = new Set(LA_SO[0].cung.map((c) => c.ten));

function loiDieuKien(k) {
  const loi = [];
  for (const s of k.sao ?? []) if (!TEN_SAO.has(s)) loi.push(`sao lạ "${s}"`);
  if (k.viTri && !VI_TRI.includes(k.viTri)) loi.push(`viTri lạ ${k.viTri}`);
  for (const d of k.doSang ?? []) if (!DO_SANG.includes(d)) loi.push(`độ sáng lạ ${d}`);
  for (const c of k.chi ?? []) if (!CHI.includes(c)) loi.push(`chi lạ ${c}`);
  for (const c of k.canNam ?? []) if (!CAN.includes(c)) loi.push(`can lạ ${c}`);
  if (k.hoa && !['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'].includes(k.hoa)) loi.push(`hóa lạ ${k.hoa}`);
  if (k.doSang && !(k.sao ?? []).length) loi.push('doSang cần sao');
  if ((k.rai || k.toiThieu !== undefined) && (k.doSang || k.hoa)) loi.push('rai/toiThieu không đi với doSang/hoa');
  const biet = ['sao', 'rai', 'toiThieu', 'viTri', 'doSang', 'hoa', 'chi', 'tuan', 'triet', 'voChinhDieu', 'gioiTinh', 'canNam'];
  for (const x of Object.keys(k)) if (!biet.includes(x)) loi.push(`trường lạ ${x}`);
  return loi;
}

// Chưa có file quy tắc nào (đang soạn) thì bỏ qua cả bộ, không chặn commit.
const tt = (ten, a, b) => test(ten, { skip: QT.length ? (b ? a.skip : false) : 'chưa có quy tắc bản 2' }, b ?? a);
const CD_CO = CHUYEN_DE.filter((cd) => QT.some((q) => q.chuyenDe === cd));

tt('id không trùng', () => {
  const trung = QT.map((q) => q.id).filter((x, i, a) => a.indexOf(x) !== i);
  assert.deepEqual(trung, []);
});

tt('định dạng từng quy tắc hợp lệ', () => {
  const loi = [];
  for (const q of QT) {
    const l = [];
    if (!CHUYEN_DE.includes(q.chuyenDe)) l.push('chuyenDe');
    if (!TEN_CUNG.has(q.cung)) l.push(`cung "${q.cung}"`);
    if (!LOAI.includes(q.loai)) l.push(`loai ${q.loai}`);
    if (!Array.isArray(q.dieuKien)) l.push('dieuKien không phải mảng');
    if (!q.noiDung || q.noiDung.length < 40) l.push('noiDung quá ngắn');
    if (!q.muc || !q.truongPhai) l.push('thiếu muc/truongPhai');
    for (const k of [...(q.dieuKien ?? []), ...(q.khong ?? [])]) l.push(...loiDieuKien(k));
    if (q.loai === 'CC' && !q.cachCuc) l.push('CC thiếu cachCuc');
    if (l.length) loi.push(`${q.id} (${q._tep}): ${l.join('; ')}`);
  }
  assert.deepEqual(loi, []);
});

tt(`mỗi chuyên đề ≥ ${MIN} quy tắc`, () => {
  for (const cd of CD_CO) {
    const n = [...QT, ...KHUNG].filter((q) => q.chuyenDe === cd).length; // tính cả phần khung (Tứ hóa, sát tinh hợp chiếu, cách cục)
    assert.ok(n >= MIN, `${cd}: ${n} quy tắc`);
  }
});

tt('100% có mã nghiên cứu thật và ≥ 1 nguồn đúng tên; 0 "Thái Thúc"', () => {
  const loi = [];
  for (const q of QT) {
    if (!Array.isArray(q.maNghienCuu) || !q.maNghienCuu.length) loi.push(`${q.id}: thiếu mã nghiên cứu`);
    for (const m of q.maNghienCuu ?? []) if (!MA_NC.has(m)) loi.push(`${q.id}: mã ${m} không có trong luan-giai-12-cung.md`);
    if (!Array.isArray(q.nguon) || !q.nguon.length) loi.push(`${q.id}: thiếu nguồn`);
    for (const n of q.nguon ?? []) if (!SACH.includes(n) && !/^Tư liệu web: .{6,}/.test(n)) loi.push(`${q.id}: nguồn sai tên "${n}"`);
  }
  assert.deepEqual(loi, []);
  assert.equal(JSON.stringify(QT).includes('Thái Thúc'), false);
});

tt('đủ 10 cách cục ưu tiên mỗi chuyên đề, mỗi cách có quy tắc phá cách', { skip: CHI_TEP && !CHI_TEP.includes('cach-cuc.json') }, () => {
  for (const cd of CD_CO) {
    const cc = [...QT, ...KHUNG].filter((q) => q.chuyenDe === cd && q.loai === 'CC');
    for (const ten of CACH_CUC) {
      assert.ok(cc.some((q) => q.cachCuc === ten && !q.phaCach), `${cd}: thiếu cách ${ten}`);
      assert.ok(cc.some((q) => q.cachCuc === ten && q.phaCach), `${cd}: cách ${ten} thiếu phá cách`);
    }
  }
});

tt('Tuần, Triệt tách riêng; câu sạch từ cấm và không có đuôi khuôn', () => {
  const loi = [];
  for (const cd of CHI_TEP && !CHI_TEP.some((f) => f !== 'cach-cuc.json') ? [] : CD_CO) {
    const tuan = new Set(QT.filter((q) => q.chuyenDe === cd && q.loai === 'TUAN').map((q) => q.noiDung));
    const triet = QT.filter((q) => q.chuyenDe === cd && q.loai === 'TRIET');
    if (!tuan.size || !triet.length) loi.push(`${cd}: thiếu TUAN hoặc TRIET`);
    for (const q of triet) if (tuan.has(q.noiDung)) loi.push(`${q.id}: chép câu Tuần`);
  }
  for (const q of QT) {
    if (locTuCam(q.noiDung, TU_CAM) === null) loi.push(`${q.id}: dính từ cấm`);
    if (/góp thêm sắc thái|Độ sáng tốt, nên phát huy chủ động/.test(q.noiDung)) loi.push(`${q.id}: đuôi khuôn`);
  }
  assert.deepEqual(loi, []);
});

tt('điều kiện khớp được trên lá số thật (≤ 5% quy tắc không bao giờ khớp trong 2.500 lá số)', () => {
  const khong = QT.filter((q) => !LA_SO.some((ls) => khopQuyTac(ls, q) !== null));
  if (khong.length) console.log('Không khớp lá số nào:', khong.map((q) => q.id).join(', '));
  assert.ok(khong.length <= QT.length * 0.05, `${khong.length}/${QT.length} quy tắc không bao giờ khớp`);
});
