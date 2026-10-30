// Chuyên đề "Vận năm 2027" (mã cố định `van-nam-2027`): luận năm Đinh Mùi từ lá số thật, gồm đầu bài, tổng quan năm,
// bốn mảng và 12 tháng. Quy tắc do Hạnh soạn (docs/luan-giai/van-nam/DINH-DANG.md), đọc từ MỘT file:
// quy-tac-van/van-nam-2027.json (thay bản chốt chỉ cần chép đè file, không sửa code). Engine chỉ gọi qua src/lib/tuvi.
import fs from 'node:fs';
import path from 'node:path';
import type { Cung, LaSo, LuuNien, Sao } from '@/lib/tuvi';
import { luuNien } from '../../tuvi';
import { bam, doc, ghi } from './cache';
import { khopDieuKien, cungTheoViTri, type DieuKien } from './khop-v2';
import { locTuCam, type TuCamCauHinh } from './loc';
import tuCamJson from './tu-cam.json';
import quyTacVanJson from './quy-tac-van/van-10-nam.json';
import { GHI_CHU, PHIEN_BAN_QUY_TAC, khoaCache, sinhLuanGiai } from './index';

export const MA_VAN_NAM = 'van-nam-2027';
const NAM_HOP_LE = 2027;
const CAN_CHI_HOP_LE = 'Đinh Mùi';

type Lop = 'nam' | 'tieu-han' | 'thai-tue' | 'dai-van' | 'thang' | 'cung-goc';
/** Điều kiện bản 2 cộng các trường riêng của lớp năm (xem DINH-DANG.md, mục "Điều kiện mới"). */
type DieuKienNam = DieuKien & {
  tenCung?: string[];
  trung?: ('dai-van' | 'tieu-han' | 'thai-tue')[];
  saoLuu?: string[];
  luuHoa?: string;
  chiNamSinh?: string[];
  khongCoYeuToNam?: boolean;
  nhom?: string[][];
};
export interface QuyTacNam {
  id: string;
  chuyenDe: string;
  namXem?: number;
  lop: Lop;
  cung: string;
  loai: string;
  muc: string;
  phan?: string;
  dieuKien: DieuKienNam[];
  khong?: DieuKienNam[];
  noiDung: string;
  nguon: string[];
  truongPhai: string;
  uuTien?: number;
}

export interface NhanDinhNam {
  text: string;
  /** Vị trí trong mục: tổng quan có `phan`; bốn mảng có nen/nam-nay/goi-y. */
  phan?: string;
  thamChieu: { quyTacId: string; sao: string[]; cung: string; nguon: string; truongPhai: string };
}
export interface ThangNam {
  thang: number;
  /** Ngày dương lịch bắt đầu tháng âm lịch, d/m/yyyy. */
  tuNgay: string;
  cung: string;
  thangMoc: boolean;
  nhanDinh: NhanDinhNam[];
}
export interface BaiVanNam {
  chuyenDe: typeof MA_VAN_NAM;
  namXem: number;
  canChi: string;
  tuoiMu: number;
  dauBai: { tuNgay: string; denNgay: string; nhanDinh: NhanDinhNam[] };
  /** Mục tổng quan và bốn mảng theo khung DINH-DANG.md. */
  muc: { id: string; tieuDe: string; nhanDinh: NhanDinhNam[] }[];
  thang: ThangNam[];
  ghiChuTruongPhai: string;
  ghiChu: string;
  phienBan: string;
}
/** Bản xem trước miễn phí: không có mã quy tắc, không có nội dung tháng. */
export interface XemTruocVanNam {
  chuyenDe: typeof MA_VAN_NAM;
  namXem: number;
  canChi: string;
  dauBai: { tuNgay: string; denNgay: string; cau: string[] };
  thaiTue: string[];
  diemThuan: string | null;
  cungThang: { thang: number; cung: string }[];
  ghiChu: string;
  phienBan: string;
}

const TU_CAM = tuCamJson as unknown as TuCamCauHinh;
const QUY_TAC_VAN_10 = quyTacVanJson as unknown as (QuyTacNam & { cungVan?: string })[];

/** Đọc mỗi lần nạp module từ một file; bản chốt thay bằng cách chép đè file này. */
function napQuyTac(): QuyTacNam[] {
  const tep = path.join(process.cwd(), 'src/lib/luan-giai/ai/quy-tac-van/van-nam-2027.json');
  return JSON.parse(fs.readFileSync(tep, 'utf8')) as QuyTacNam[];
}
const QUY_TAC = napQuyTac();
/** Tăng số này mỗi khi đổi cách ghép bài để cache cũ không bị dùng lại. */
const PHIEN_BAN_GHEP = 'gh1';
export const PHIEN_BAN_VAN_NAM = bam(JSON.stringify([QUY_TAC, PHIEN_BAN_QUY_TAC, PHIEN_BAN_GHEP])).slice(0, 12);
const NAM_CO_QUY_TAC = new Set(QUY_TAC.map((q) => q.namXem ?? NAM_HOP_LE));

// Ngày dương lịch bắt đầu 12 tháng âm lịch và hết năm (engine lịch; test đối chiếu lại bằng engine).
const NGAY_THANG: Record<number, { thang: string[]; het: string }> = {
  2027: {
    thang: ['6/2/2027', '8/3/2027', '7/4/2027', '6/5/2027', '5/6/2027', '4/7/2027', '2/8/2027', '1/9/2027', '30/9/2027', '29/10/2027', '28/11/2027', '28/12/2027'],
    het: '25/1/2028',
  },
};

const TEN_MUC: Record<string, string> = {
  'tong-quan': 'Tổng quan năm', 'su-nghiep': 'Sự nghiệp', 'tai-chinh': 'Tài chính', 'tinh-cam': 'Tình cảm', 'suc-khoe': 'Sức khỏe',
};
const MANG: { id: string; cung: string }[] = [
  { id: 'su-nghiep', cung: 'Quan Lộc' }, { id: 'tai-chinh', cung: 'Tài Bạch' }, { id: 'tinh-cam', cung: 'Phu Thê' }, { id: 'suc-khoe', cung: 'Tật Ách' },
];
const PHAN_TONG_QUAN = ['boi-canh', 'thai-tue', 'tieu-han', 'tu-hoa', 'sao-luu'];
/** Số đoạn tối đa mỗi phần (NAM-PP-10: cắt theo ưu tiên, đoạn cung nền `-01-` luôn giữ). */
const TOI_DA: Record<string, number> = { 'thai-tue': 5, 'tieu-han': 5, 'tu-hoa': 4, 'sao-luu': 3 };
const TOI_DA_NAM_NAY = 3;
const THU_TU_LOAI: Record<string, number> = { CT: 0, CC: 1, HOA: 2, SP: 3, YN: 4 };

// ---------------------------------------------------------------- lá số mở rộng với sao lưu

const SAO_GIA = (ten: string): Sao => ({ key: ten, ten, hanh: 'Kim', loai: 'cat', dacTinh: null, dacTinhTen: null, hoa: null });

/**
 * Lá số mở rộng: mỗi cung có thêm sao lưu (tên "L. …") và sao giả "@Hóa Lộc" / "@Hóa Lộc:Thái Âm" cho lưu hóa,
 * để dùng nguyên bộ khớp bản 2 (khop-v2) cho điều kiện của lớp năm.
 */
function moRong(ls: LaSo, ln: LuuNien): LaSo {
  return {
    ...ls,
    cung: ls.cung.map((c) => ({
      ...c,
      phuTinh: [
        ...c.phuTinh,
        ...ln.saoLuu.filter((s) => s.chi === c.chi).map((s) => SAO_GIA(s.ten)),
        ...ln.luuTuHoa.filter((h) => h.chi === c.chi).flatMap((h) => [SAO_GIA(`@${h.hoa}`), SAO_GIA(`@${h.hoa}:${h.sao}`)]),
      ],
    })),
  };
}

const saoCua = (c: Cung): Sao[] => [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh];
const sang = (s?: Sao) => !!s?.dacTinhTen && ['Miếu', 'Vượng', 'Đắc'].includes(s.dacTinhTen);

interface Ngu {
  ls: LaSo; // đã mở rộng
  ln: LuuNien;
  chiNamSinh: string;
}

/** Một điều kiện lớp năm tại cung gốc g → tên sao khớp (có thể rỗng); null nếu không khớp. */
function khopMotDieuKien(n: Ngu, g: Cung, k: DieuKienNam): string[] | null {
  if (k.tenCung && !k.tenCung.includes(g.ten)) return null;
  if (k.chiNamSinh && !k.chiNamSinh.includes(n.chiNamSinh)) return null;
  if (k.trung) {
    const chi = { 'dai-van': n.ln.daiVan, 'tieu-han': n.ln.tieuHan, 'thai-tue': n.ln.luuThaiTue };
    if (!k.trung.every((l) => chi[l] === g.chi)) return null;
  }
  if (k.khongCoYeuToNam) {
    const xung = (g.chi + 6) % 12;
    const chamNam = [n.ln.daiVan, n.ln.tieuHan, n.ln.luuThaiTue].some((x) => x === g.chi || x === xung)
      || n.ln.luuTuHoa.some((h) => h.chi === g.chi || h.chi === xung)
      || n.ln.saoLuu.some((s) => s.chi === g.chi || s.chi === xung);
    if (chamNam) return null;
  }
  const ds = cungTheoViTri(n.ls, g, k.viTri);
  if (k.nhom) {
    const co = (e: string) => {
      const [loai, ten = ''] = e.split(':');
      return ds.some((c) => saoCua(c).some((x) => {
        if (loai === 'hoa') return x.hoa === ten;
        if (loai === 'luuHoa') return x.ten === `@${ten}`;
        return x.ten === loai && (ten !== 'sáng' || sang(x));
      }));
    };
    if (k.nhom.filter((nhom) => nhom.some(co)).length < (k.toiThieu ?? k.nhom.length)) return null;
    return [];
  }
  // Chuyển điều kiện riêng của lớp năm sang điều kiện bản 2 trên lá số mở rộng.
  const { tenCung: _a, trung: _b, saoLuu, luuHoa, chiNamSinh: _c, khongCoYeuToNam: _d, nhom: _e, ...chuan } = k;
  const std: DieuKien = { ...chuan };
  if (saoLuu) {
    std.sao = [...(std.sao ?? []), ...saoLuu];
    std.toiThieu = k.toiThieu ?? saoLuu.length;
  }
  if (luuHoa) {
    // Có sao: sao đầu phải mang lưu hóa này, cùng cung (giữ nguyên độ sáng của sao đầu).
    std.sao = std.sao?.length ? [...std.sao, `@${luuHoa}:${std.sao[0]}`] : [`@${luuHoa}`];
  }
  const r = khopDieuKien(n.ls, g, std);
  return r === null ? null : r.filter((s) => !s.startsWith('@'));
}

/** Quy tắc khớp tại cung gốc g → sao khớp; null nếu không khớp. */
function khopQuyTacNam(n: Ngu, g: Cung, q: QuyTacNam): string[] | null {
  const sao = new Set<string>();
  for (const k of q.dieuKien) {
    const r = khopMotDieuKien(n, g, k);
    if (r === null) return null;
    r.forEach((s) => sao.add(s));
  }
  for (const k of q.khong ?? []) if (khopMotDieuKien(n, g, k) !== null) return null;
  return [...sao];
}

// ---------------------------------------------------------------- ghép bài

interface Khop {
  q: QuyTacNam;
  text: string;
  sao: string[];
  cung: Cung;
  /** Lớp của đoạn (khác q.lop khi đoạn chính tinh mượn từ bộ đại vận). */
  phan?: string;
}

const cungTheoTen = (ls: LaSo, ten: string) => ls.cung.find((c) => c.ten === ten)!;

/** Cung gốc cần thử cho một quy tắc (thang: 12 tháng xử lý ở nơi gọi). */
function cungGocCua(n: Ngu, q: QuyTacNam): Cung[] {
  const { ls, ln } = n;
  switch (q.lop) {
    case 'nam': return [ls.cung[0]];
    case 'tieu-han': return ln.tieuHan == null ? [] : [ls.cung[ln.tieuHan]];
    case 'thai-tue': return [ls.cung[ln.luuThaiTue]];
    case 'dai-van': return ln.daiVan == null ? [] : [ls.cung[ln.daiVan]];
    case 'thang': return [];
    case 'cung-goc': return q.cung === '*' ? ls.cung : [cungTheoTen(ls, q.cung)];
  }
}

function dien(q: QuyTacNam, sao: string[], g: Cung): string {
  return q.noiDung.replaceAll('{sao}', sao.join(', ')).replaceAll('{cung}', g.ten);
}

/** Đổi chữ "10 năm / giai đoạn / cung vận" của bộ đại vận thành "năm nay" (NAM-PP-06). */
function doiSangNam(s: string, nhan: string): string {
  return s
    .replace(/[Cc]ung vận/g, (m) => (m[0] === 'C' ? 'Cung ' : 'cung ') + nhan)
    .replace(/tọa vận/g, `tọa ở cung ${nhan}`)
    .replace(/chủ đề nổi bật của 10 năm này/g, 'chủ đề nổi bật của năm nay')
    .replace(/10 năm này/g, 'năm nay')
    .replace(/vận rèn/g, 'năm rèn')
    .replace(/giai đoạn/g, 'năm');
}

const xepHang = (a: Khop, b: Khop) => (THU_TU_LOAI[a.q.loai] ?? 9) - (THU_TU_LOAI[b.q.loai] ?? 9) || (b.q.uuTien ?? 0) - (a.q.uuTien ?? 0);
const laNen = (k: Khop) => /^NAM-(TT|TH)-01/.test(k.q.id);

function chinhTinhCuaCung(n: Ngu, g: Cung, nhan: string, phan: string): Khop[] {
  return QUY_TAC_VAN_10
    .filter((q) => q.id.startsWith('VAN-CT-') && (!q.cungVan || q.cungVan === '*' || q.cungVan === g.ten))
    .flatMap((q) => {
      const sao = khopQuyTacNam(n, g, q);
      if (sao === null) return [];
      const qNam = { ...q, lop: phan as Lop, cung: g.ten, noiDung: doiSangNam(q.noiDung, nhan) };
      return [{ q: qNam, text: dien(qNam, sao, g), sao, cung: g, phan }];
    });
}

function thamChieu(k: Khop) {
  return { quyTacId: k.q.id, sao: k.sao, cung: k.cung.ten, nguon: k.q.nguon.join('; '), truongPhai: k.q.truongPhai };
}
function nhanDinh(k: Khop, phan?: string): NhanDinhNam | null {
  const text = locTuCam(k.text, TU_CAM);
  if (text === null) return null;
  return { text, ...(phan ? { phan } : {}), thamChieu: thamChieu(k) };
}
const gom = (ds: Khop[], phan?: string) => ds.flatMap((k) => { const x = nhanDinh(k, phan); return x ? [x] : []; });

/** "chủ đề nổi lên là X." của rule NAM-THANG-03-* → X, để viết câu Tóm lại. */
function chuDeCung(ten: string): string {
  const q = QUY_TAC.find((x) => x.lop === 'thang' && x.dieuKien.some((k) => k.tenCung?.includes(ten)));
  const m = q?.noiDung.match(/chủ đề nổi lên là (.+?)\.?$/);
  return m ? m[1] : ten;
}

function tomLai(n: Ngu): Khop {
  const { ls, ln } = n;
  const ten = (chi: number | null) => (chi == null ? '' : ls.cung[chi].ten);
  const tt = ten(ln.luuThaiTue), th = ten(ln.tieuHan);
  const hoa = (h: string) => ln.luuTuHoa.find((x) => x.hoa === h);
  const lop = hoa('Hóa Lộc'), ky = hoa('Hóa Kỵ');
  const cau = [
    `Năm ${ln.namXem}: trọng điểm của năm nằm ở cung ${tt} (${chuDeCung(tt)}), còn việc riêng của bạn dễ được khơi lên ở cung ${th} (${chuDeCung(th)}).`,
    lop ? `Nguồn lợi, cơ hội của năm dễ đến qua lĩnh vực của cung ${ten(lop.chi)}` : '',
    ky ? `${lop ? ', ' : ''}còn cung ${ten(ky.chi)} là nơi nên làm chậm, ghi rõ và kiểm lại trước khi chốt.` : lop ? '.' : '',
  ].join('');
  const q: QuyTacNam = {
    id: 'NAM-PP-10-TOM-LAI', chuyenDe: 'van-nam', lop: 'nam', cung: 'Năm', loai: 'YN', muc: 'tong-quan', phan: 'tom-lai', dieuKien: [],
    noiDung: cau, nguon: ['Đặc tả an sao xemtuvi.vn'], truongPhai: 'Tam hợp phái Việt',
  };
  return { q, text: cau, sao: [], cung: ls.cung[ln.luuThaiTue], phan: 'tom-lai' };
}

function thangMoc(n: Ngu, c: Cung): boolean {
  const { ln } = n;
  return [ln.tieuHan, ln.luuThaiTue, ln.daiVan].includes(c.chi) || ln.luuTuHoa.some((h) => h.chi === c.chi && (h.hoa === 'Hóa Lộc' || h.hoa === 'Hóa Kỵ'));
}

export function kiemTraNamXem(namXem: number, ls: LaSo): void {
  if (!Number.isInteger(namXem) || !NAM_CO_QUY_TAC.has(namXem) || !NGAY_THANG[namXem]) {
    throw new Error(`Chuyên đề Vận năm chưa có bộ quy tắc cho năm ${namXem}; hiện chỉ có năm ${NAM_HOP_LE} (${CAN_CHI_HOP_LE}).`);
  }
  const cc = luuNien(ls, namXem).canChi;
  if (cc !== CAN_CHI_HOP_LE) throw new Error(`Quy tắc Vận năm chỉ hợp lệ cho năm ${CAN_CHI_HOP_LE}, không phải ${cc}.`);
}

function ghepBai(ls: LaSo, namXem: number) {
  const ln = luuNien(ls, namXem, true);
  const n: Ngu = { ls: moRong(ls, ln), ln, chiNamSinh: ls.canChi.nam.split(' ')[1] };
  const cungN = (chi: number) => n.ls.cung[chi];

  // Mọi đoạn khớp của các lớp (trừ tháng).
  const tatCa: Khop[] = [];
  for (const q of QUY_TAC) {
    if (q.lop === 'thang') continue;
    for (const g of cungGocCua(n, q)) {
      const sao = khopQuyTacNam(n, g, q);
      if (sao !== null) tatCa.push({ q, text: dien(q, sao, g), sao, cung: g });
    }
  }
  // Chính tinh tại cung Lưu Thái Tuế và cung tiểu hạn (bộ VAN-CT đổi chữ sang "năm nay").
  const chinhTinh = [
    ...chinhTinhCuaCung(n, cungN(ln.luuThaiTue), 'Lưu Thái Tuế', 'thai-tue'),
    ...(ln.tieuHan == null ? [] : chinhTinhCuaCung(n, cungN(ln.tieuHan), 'tiểu hạn', 'tieu-han')),
  ];
  // Bối cảnh 10 năm: cung đại vận đang đi (bộ VAN-CUNG, giữ nguyên chữ vì đây đúng là chuyện 10 năm).
  const dv = ln.daiVan == null ? null : cungN(ln.daiVan);
  const boiCanhVan: Khop[] = dv
    ? QUY_TAC_VAN_10.filter((q) => /^VAN-CUNG-\d+$/.test(q.id) && q.cungVan === dv.ten).map((q) => ({ q: { ...q, cung: dv.ten }, text: q.noiDung, sao: [], cung: dv, phan: 'boi-canh' }))
    : [];
  const phanCua = (k: Khop) => k.phan ?? k.q.phan;
  const tongQuan = [...tatCa, ...chinhTinh, ...boiCanhVan].filter((k) => k.q.muc === 'tong-quan' || k.phan);

  const muc: BaiVanNam['muc'] = [];
  // 1. Tổng quan: theo thứ tự phan, mỗi phan cắt theo ưu tiên; NAM-TT-06 tối đa một câu cả bài.
  const phanRa: NhanDinhNam[] = [];
  let daTo = false;
  for (const phan of PHAN_TONG_QUAN) {
    let ds = tongQuan.filter((k) => phanCua(k) === phan);
    ds = [...ds.filter(laNen), ...ds.filter((k) => !laNen(k)).sort(xepHang)];
    ds = ds.filter((k) => {
      if (k.q.id !== 'NAM-TT-06') return true;
      if (daTo) return false;
      daTo = true;
      return true;
    });
    if (TOI_DA[phan]) ds = ds.slice(0, TOI_DA[phan]);
    phanRa.push(...gom(ds, phan));
  }
  phanRa.push(...gom([tomLai(n)], 'tom-lai'));
  muc.push({ id: 'tong-quan', tieuDe: TEN_MUC['tong-quan'], nhanDinh: phanRa });

  // 2. Bốn mảng: nền (bộ 12 cung) + năm nay + gợi ý.
  const dichNen: Record<string, 'quan-loc' | 'phu-the' | undefined> = { 'su-nghiep': 'quan-loc', 'tinh-cam': 'phu-the' };
  for (const m of MANG) {
    const g = cungTheoTen(n.ls, m.cung);
    const lienQuan = new Set([g.ten, cungN((g.chi + 6) % 12).ten]);
    const rieng3 = new Set([g.ten]); // yếu tố năm của lớp tổng quan chỉ lấy tại chính cung của mảng
    if (m.id === 'su-nghiep' && [ln.tieuHan, ln.luuThaiTue].some((x) => x != null && n.ls.cung[x].ten === 'Phụ Mẫu')) { lienQuan.add('Phụ Mẫu'); rieng3.add('Phụ Mẫu'); }
    const rieng = tatCa.filter((k) => k.q.muc === m.id && !(k.q.cung === '*' && !lienQuan.has(k.cung.ten)));
    const goiY = rieng.filter((k) => k.q.phan === 'goi-y' || /-NHIP$/.test(k.q.id));
    const namNayRieng = rieng.filter((k) => !goiY.includes(k)).sort(xepHang);
    // Yếu tố năm tại cung của mảng (và xung chiếu) lấy từ lớp tổng quan, không lặp đoạn đã có.
    const tuTongQuan = tatCa.filter((k) => k.q.muc === 'tong-quan' && k.q.lop === 'cung-goc' && rieng3.has(k.cung.ten)).sort(xepHang);
    // Cung của mảng chính là Lưu Thái Tuế / tiểu hạn: câu chủ đề của lớp đó (NAM-TT-01, NAM-TH-01).
    const lopCung = tatCa.filter((k) => laNen(k) && k.cung.ten === g.ten);
    let namNay = [...new Map([...namNayRieng, ...lopCung, ...tuTongQuan].map((k) => [k.q.id + '|' + k.cung.ten, k])).values()].slice(0, TOI_DA_NAM_NAY);
    if (!namNay.length) {
      // Không có yếu tố nào chạm trực tiếp: dùng câu NAM-MANG-01 (nền của lá số, giữ nhịp đều).
      const q = QUY_TAC.find((x) => /^NAM-MANG-01-.+-NEN$/.test(x.id) && x.muc === m.id && x.cung === g.ten);
      if (q) namNay = [{ q, text: dien(q, [], g), sao: [], cung: g }];
    }
    const nen: NhanDinhNam[] = [];
    muc.push({ id: m.id, tieuDe: TEN_MUC[m.id], nhanDinh: [...nen, ...gom(namNay, 'nam-nay'), ...gom(goiY, 'goi-y')] });
  }

  // 3. Mười hai tháng.
  const ngay = NGAY_THANG[namXem];
  const thang: ThangNam[] = ln.luuNguyet.map((chi, i) => {
    const c = cungN(chi);
    const chuDe = QUY_TAC.filter((q) => q.lop === 'thang').flatMap((q) => {
      const sao = khopQuyTacNam(n, c, q);
      return sao === null ? [] : [{ q, text: dien(q, sao, c), sao, cung: c } as Khop];
    });
    // Một điểm từ sao lưu / lưu hóa tại cung tháng (ưu tiên hóa rồi sao lưu, không dùng câu tô thêm NAM-TT-06).
    const diem = tatCa.filter((k) => k.cung.chi === chi && k.q.lop === 'cung-goc' && k.q.id !== 'NAM-TT-06' && k.q.muc !== 'su-nghiep' && !/-NHIP$/.test(k.q.id) && !/-NEN$/.test(k.q.id)).sort(xepHang).slice(0, 1);
    return { thang: i + 1, tuNgay: ngay.thang[i], cung: c.ten, thangMoc: thangMoc(n, c), nhanDinh: gom([...chuDe.slice(0, 1), ...diem]) };
  });

  const dauBai = {
    tuNgay: ngay.thang[0], denNgay: ngay.het,
    nhanDinh: gom(tatCa.filter((k) => k.q.muc === 'dau-bai'), 'dau-bai'),
  };
  return { ln, tatCa, muc, thang, dauBai };
}

const GHI_CHU_TRUONG_PHAI =
  'Xemtuvi.vn luận năm theo phái Việt: đọc cả cung Lưu Thái Tuế (trọng điểm năm) lẫn cung tiểu hạn (việc riêng), không xếp lại 12 cung lưu niên như phái Trung Quốc; tháng tính theo Đẩu Quân. Bảng Tứ hóa can Đinh giống nhau giữa các phái.';

/** Bài Vận năm đầy đủ (gói trả phí). Cache theo lá số + năm xem. Năm khác 2027 (Đinh Mùi) bị từ chối. */
export async function sinhVanNam(ls: LaSo, tuyChon: { namXem?: number; boQuaCache?: boolean } = {}): Promise<BaiVanNam> {
  const namXem = tuyChon.namXem ?? NAM_HOP_LE;
  kiemTraNamXem(namXem, ls);
  const khoa = khoaCache(ls, `${MA_VAN_NAM}@${namXem}`, PHIEN_BAN_VAN_NAM);
  if (!tuyChon.boQuaCache) {
    const co = doc<BaiVanNam>(khoa);
    if (co) return co;
  }
  const { ln, muc, thang, dauBai } = ghepBai(ls, namXem);
  const mucNen = await Promise.all(muc.map(async (m) => {
    const loai = ({ 'su-nghiep': 'quan-loc', 'tinh-cam': 'phu-the' } as Record<string, 'quan-loc' | 'phu-the'>)[m.id];
    if (!loai) return m;
    const nen = (await sinhLuanGiai(ls, loai, { boQuaCache: tuyChon.boQuaCache })).muc.find((x) => x.id === 'phong-cach')?.nhanDinh[0];
    return nen ? { ...m, nhanDinh: [{ text: nen.text, phan: 'nen', thamChieu: { quyTacId: nen.thamChieu.quyTacId, sao: nen.thamChieu.sao, cung: nen.thamChieu.cung, nguon: nen.thamChieu.nguon, truongPhai: nen.thamChieu.truongPhai } }, ...m.nhanDinh] } : m;
  }));
  const kq: BaiVanNam = {
    chuyenDe: MA_VAN_NAM, namXem, canChi: ln.canChi, tuoiMu: ln.tuoiMu, dauBai, muc: mucNen, thang,
    ghiChuTruongPhai: GHI_CHU_TRUONG_PHAI, ghiChu: GHI_CHU, phienBan: PHIEN_BAN_VAN_NAM,
  };
  if (!tuyChon.boQuaCache) ghi(khoa, kq);
  return kq;
}

/** Điểm thuận ưu tiên cho bản xem trước (NAM-CAM-03: không dùng câu gây lo để kéo mua). */
const DIEM_THUAN = ['NAM-HOA-LOC-SANG', 'NAM-HOA-KHOA-SANG', 'NAM-HOA-QUYEN-SANG', 'NAM-TH-04', 'NAM-TH-04-TT', 'NAM-LUU-03', 'NAM-LUU-04', 'NAM-LUU-05-PHU', 'NAM-LUU-01', 'NAM-TH-03-LOC', 'NAM-TH-03-KHOA', 'NAM-TH-03-QUYEN'];

/** Bản xem trước miễn phí: đầu bài + trọng điểm Lưu Thái Tuế + một điểm thuận + tên 12 cung tháng, không nội dung tháng, không mã quy tắc. */
export function xemTruocVanNam(ls: LaSo, tuyChon: { namXem?: number } = {}): XemTruocVanNam {
  const namXem = tuyChon.namXem ?? NAM_HOP_LE;
  kiemTraNamXem(namXem, ls);
  const { ln, tatCa, thang, dauBai } = ghepBai(ls, namXem);
  const van = (k: Khop[]) => k.flatMap((x) => { const t = locTuCam(x.text, TU_CAM); return t ? [t] : []; });
  const thaiTue = tatCa.filter((k) => k.q.lop === 'thai-tue' && /^NAM-TT-01-/.test(k.q.id));
  const thuan = DIEM_THUAN.flatMap((id) => tatCa.filter((k) => k.q.id === id))[0];
  return {
    chuyenDe: MA_VAN_NAM, namXem, canChi: ln.canChi,
    dauBai: { tuNgay: dauBai.tuNgay, denNgay: dauBai.denNgay, cau: dauBai.nhanDinh.map((x) => x.text) },
    thaiTue: van(thaiTue),
    diemThuan: thuan ? van([thuan])[0] ?? null : null,
    cungThang: thang.map((t) => ({ thang: t.thang, cung: t.cung })),
    ghiChu: GHI_CHU, phienBan: PHIEN_BAN_VAN_NAM,
  };
}
