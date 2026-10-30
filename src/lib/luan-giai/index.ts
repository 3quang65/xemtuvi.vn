import type { LaSo } from '@/lib/tuvi';
import { chonDoanMenh, type DoanLuan } from './chon-doan';
import { chonDoanMau, type DoanMau } from './doan-mau';
import duLieu from './menh-chinh-tinh.json';
import boCau from './tom-tat-mien-phi.json';

export interface TomTatMienPhi {
  banMenh: string; // nạp âm
  cuc: string;
  chinhTinhMenh: { ten: string; dacTinhTen: string | null }[];
  voChinhDieu: boolean;
  /** Cung chính tinh được mượn khi Mệnh vô chính diệu (xung chiếu) */
  chinhTinhXungChieu: string[];
  thanCu: string; // tên cung có Thân
  doan: DoanLuan[];
  /** Các nhận định riêng của lá số, theo thứ tự hiện cho khách (bộ câu tom-tat-mien-phi.json). */
  cau: CauTomTat[];
  /** Câu dẫn sang bản chuyên sâu, nêu sao tam hợp của chính lá số. */
  dan: string;
  /** Ghi chú cuối: hệ thống chọn câu theo những sao nào. */
  ghiChu: string;
}

export interface CauTomTat {
  loai: 'chinhTinh' | 'voChinhDieu' | 'tuHoa' | 'tuanTriet' | 'phuTinh' | 'thanCu';
  /** Phần nêu sao/cung của lá số, in đậm trước nhận định, ví dụ "Thái Dương (Vượng) thủ Mệnh tại Mão" */
  nhan: string;
  y: string;
  nguon: string[];
}

type Muc = { y: string; nguon: string[] };
const BO = boCau as unknown as {
  chinhTinh: Record<string, Record<string, Muc>>;
  thanCu: Record<string, Muc>;
  tuHoa: Record<string, Muc>;
  tuanTriet: Record<string, Muc>;
  phuTinh: Record<string, Muc>;
  voChinhDieu: Muc;
};
/** Tối đa số câu điểm nhấn (Tứ hóa, Tuần/Triệt, sao phụ) để tóm tắt vẫn ngắn. */
const TOI_DA_DIEM_NHAN = 3;

const tenSao = (ds: { ten: string }[]) => ds.map((s) => s.ten).join(', ');
const lietKe = (ds: string[]) => (ds.length > 1 ? `${ds.slice(0, -1).join(', ')} và ${ds[ds.length - 1]}` : ds[0] ?? '');

function cauCuaLaSo(ls: LaSo): { cau: CauTomTat[]; dan: string; ghiChu: string } {
  const theoTen = (ten: string) => ls.cung.find((c) => c.ten === ten)!;
  const menh = theoTen('Mệnh');
  const xung = ls.cung[(menh.chi + 6) % 12];
  const cau: CauTomTat[] = [];

  if (menh.chinhTinh.length === 0) {
    const saoXung = xung.chinhTinh.length ? lietKe(xung.chinhTinh.map((s) => s.ten)) : 'các chính tinh ở tam hợp';
    const m = BO.voChinhDieu;
    cau.push({ loai: 'voChinhDieu', nhan: `Mệnh vô chính diệu tại ${menh.tenChi}`, y: m.y.replace(/\{saoXung\}/g, saoXung), nguon: m.nguon });
  }
  // Vô chính diệu: luận mượn chính tinh cung xung chiếu (lực yếu hơn tọa thủ, đã nói trong câu trên).
  for (const s of menh.chinhTinh.length ? [] : xung.chinhTinh.slice(0, 2)) {
    const m = BO.chinhTinh[s.ten]?.[s.dacTinh ?? 'B'];
    if (m) cau.push({ loai: 'chinhTinh', nhan: `Mượn ${s.ten}${s.dacTinhTen ? ` (${s.dacTinhTen})` : ''} từ Thiên Di tại ${xung.tenChi}`, y: m.y, nguon: m.nguon });
  }
  for (const s of menh.chinhTinh.slice(0, 2)) {
    const m = BO.chinhTinh[s.ten]?.[s.dacTinh ?? 'B'];
    if (m) cau.push({ loai: 'chinhTinh', nhan: `${s.ten}${s.dacTinhTen ? ` (${s.dacTinhTen})` : ''} thủ Mệnh tại ${menh.tenChi}`, y: m.y, nguon: m.nguon });
  }

  const diemNhan: CauTomTat[] = [];
  const saoMenh = [...menh.chinhTinh, ...menh.catTinh, ...menh.hungTinh, ...menh.phuTinh];
  for (const s of saoMenh) {
    const m = s.hoa ? BO.tuHoa[s.hoa] : undefined;
    if (m) diemNhan.push({ loai: 'tuHoa', nhan: `${s.hoa} đi cùng ${s.ten} tại Mệnh`, y: m.y.replace(/\{sao\}/g, s.ten), nguon: m.nguon });
  }
  for (const [co, ten] of [[menh.tuan, 'Tuần'], [menh.triet, 'Triệt']] as const) {
    const m = BO.tuanTriet[ten];
    if (co && m) diemNhan.push({ loai: 'tuanTriet', nhan: `${ten} án ngữ Mệnh`, y: m.y, nguon: m.nguon });
  }
  // Sao phụ theo thứ tự ưu tiên trong bộ câu (sát tinh trước, rồi cát tinh, rồi đào hoa).
  for (const ten of Object.keys(BO.phuTinh)) {
    const s = saoMenh.find((x) => x.ten === ten);
    if (s) diemNhan.push({ loai: 'phuTinh', nhan: `${s.ten}${s.dacTinhTen ? ` (${s.dacTinhTen})` : ''} đồng cung Mệnh`, y: BO.phuTinh[ten].y, nguon: BO.phuTinh[ten].nguon });
  }
  cau.push(...diemNhan.slice(0, TOI_DA_DIEM_NHAN));

  const than = ls.cung.find((c) => c.laThan);
  const mThan = than ? BO.thanCu[than.ten] : undefined;
  if (than && mThan) {
    const nhan = than.ten === 'Mệnh' ? 'Thân cư Mệnh' : `Thân cư ${than.ten}${than.chinhTinh.length ? ` (${tenSao(than.chinhTinh)})` : ''}`;
    cau.push({ loai: 'thanCu', nhan, y: mThan.y, nguon: mThan.nguon });
  }

  const moTa = (ten: string) => {
    const c = theoTen(ten);
    return c.chinhTinh.length ? `${lietKe(c.chinhTinh.map((s) => s.ten))} ở ${ten}` : `${ten} vô chính diệu`;
  };
  const dan = `Bản chuyên sâu xét tiếp thế tam hợp chiếu về Mệnh: ${moTa('Quan Lộc')}, ${moTa('Tài Bạch')}, ${moTa('Thiên Di')} (xung chiếu), cùng đại vận từng giai đoạn.`;
  const daXet = [...new Set(cau.map((c) => c.nhan.replace(/ \(.*?\)/g, '').replace(/^Mượn /, '').replace(/ (thủ|đi cùng|đồng cung|án ngữ|từ|tại).*$/, '')))];
  const ghiChu = `Các câu trên do hệ thống chọn từ bộ quy tắc luận giải theo ${lietKe(daXet)} trong lá số của bạn; chưa xét hợp chiếu và vận hạn.`;
  return { cau, dan, ghiChu };
}


export function tomTatMienPhi(ls: LaSo): TomTatMienPhi {
  const menh = ls.cung.find((c) => c.ten === 'Mệnh')!;
  const than = ls.cung.find((c) => c.laThan);
  const { voChinhDieu, doan } = chonDoanMenh(menh.chinhTinh.map((s) => ({ ten: s.ten, dacTinh: s.dacTinh })));
  const xung = ls.cung[(menh.chi + 6) % 12];
  return {
    banMenh: ls.banMenh,
    cuc: ls.cuc,
    chinhTinhMenh: menh.chinhTinh.map((s) => ({ ten: s.ten, dacTinhTen: s.dacTinhTen })),
    voChinhDieu,
    chinhTinhXungChieu: voChinhDieu ? xung.chinhTinh.map((s) => s.ten) : [],
    thanCu: than ? than.ten : '',
    doan,
    ...cauCuaLaSo(ls),
  };
}

/** Bỏ vế điều kiện độ sáng đầu câu ("Miếu ở Dần, Thân (M), …: ") để khách đọc thẳng phần nhận định. */
export function nhanDinh(cau: string): string {
  const i = cau.indexOf(': ');
  return /^(Miếu|Vượng|Đắc|Bình|Hãm)/.test(cau) && i > 0 ? cau.slice(i + 2) : cau;
}

/** Tên chính tinh của một quy tắc (theo mã), để ghi trước đoạn luận. */
export function saoCuaQuyTac(ma: string): string | null {
  for (const [ten, ds] of Object.entries(duLieu.menh)) if (ds.some((r) => r.ma === ma)) return ten;
  return null;
}

export { tachDoanMau, type DoanMau } from './doan-mau';

/** Đoạn mẫu màn chọn gói lấy từ chính lá số (Quan Lộc / Phu Thê); null nếu không có quy tắc khớp. */
export function doanMauCuaLaSo(ls: LaSo): DoanMau | null {
  return chonDoanMau(ls.cung.map((c) => ({ ten: c.ten, chi: c.chi, tenChi: c.tenChi, chinhTinh: c.chinhTinh.map((s) => s.ten) })));
}

/** Đoạn mẫu dự phòng khi lá số không có quy tắc khớp (ví dụ minh họa, không phải lá số của khách). */
export const DOAN_MAU = (duLieu.menh['Thái Âm'] ?? []).find((r) => r.ma === 'MENH-TA-01')!;


/** Các đoạn chữ của phần luận trong tóm tắt miễn phí, đúng thứ tự khách thấy (dùng để đo câu trùng). */
export function vanBanTomTat(t: TomTatMienPhi): string[] {
  return [...t.cau.map((c) => `${c.nhan}: ${c.y}`), t.dan, t.ghiChu];
}
