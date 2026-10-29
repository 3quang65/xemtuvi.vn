// Lớp bọc có kiểu dữ liệu cho bộ máy an sao (tuvi-raw.js, xem NOTICE).
// Mọi phần giao diện và luận giải chỉ được gọi qua file này,
// để sau này thay/sửa engine mà không ảnh hưởng chỗ khác.

// eslint-disable-next-line @typescript-eslint/no-require-imports
import TuViRaw from './tuvi-raw.js';

export type NguHanh = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
export type DacTinh = 'M' | 'V' | 'Đ' | 'B' | 'H';

export interface Sao {
  key: string;
  ten: string;
  hanh: NguHanh;
  loai: 'chinh' | 'cat' | 'sat';
  dacTinh: DacTinh | null;
  dacTinhTen: 'Miếu' | 'Vượng' | 'Đắc' | 'Bình' | 'Hãm' | null;
  hoa: string | null;
}

export interface Cung {
  chi: number; // 0 = Tý … 11 = Hợi
  tenChi: string;
  can: string;
  ten: string; // Mệnh, Phụ Mẫu, …
  hanhCung: NguHanh;
  laThan: boolean;
  tuan: boolean;
  triet: boolean;
  chinhTinh: Sao[];
  catTinh: Sao[];
  hungTinh: Sao[];
  phuTinh: Sao[];
  trangSinh: string;
  daiVan: string;
  daiVanTu: number;
  tieuHan: string;
}

export interface ThongTinSinh {
  lich: 'duong' | 'am';
  ngay: number;
  thang: number;
  nam: number;
  nhuan?: boolean;
  gio: number; // 0–23
  gioiTinh: 'nam' | 'nu';
  ten?: string;
}

export interface LaSo {
  ten: string;
  gioiTinh: 'Nam' | 'Nữ';
  amDuong: string;
  amDuongLy: string;
  duong: { ngay: number; thang: number; nam: number };
  am: { ngay: number; thang: number; nam: number; nhuan: boolean };
  gio: { chi: string; khoang: string; canChi: string };
  canChi: { nam: string; thang: string; ngay: string; gio: string };
  conGiap: string;
  banMenh: string;
  hanhMenh: NguHanh;
  cuc: string;
  cucHanh: NguHanh;
  sinhKhac: string;
  menhTai: string;
  thanTai: string;
  menhChu: string;
  thanChu: string;
  tuan: string;
  triet: string;
  cung: Cung[]; // 12 phần tử, chỉ số = chi (0 = Tý)
}

interface Engine {
  anLaSo(opts: ThongTinSinh): LaSo;
  tomTat(ls: LaSo): string;
}

const engine = TuViRaw as unknown as Engine;

/** Kiểm tra dữ liệu đầu vào trước khi an sao. Trả về thông báo lỗi tiếng Việt, hoặc null nếu hợp lệ. */
export function kiemTraThongTin(t: Partial<ThongTinSinh>): string | null {
  const { ngay, thang, nam, gio, gioiTinh } = t;
  if (!gioiTinh) return 'Vui lòng chọn giới tính.';
  if (!Number.isInteger(nam) || nam! < 1900 || nam! > 2100) return 'Năm sinh cần trong khoảng 1900–2100.';
  if (!Number.isInteger(thang) || thang! < 1 || thang! > 12) return 'Tháng sinh không hợp lệ.';
  if (!Number.isInteger(ngay) || ngay! < 1 || ngay! > 31) return 'Ngày sinh không hợp lệ.';
  if (!Number.isInteger(gio) || gio! < 0 || gio! > 23) return 'Vui lòng chọn giờ sinh.';
  if (t.lich === 'duong') {
    const d = new Date(Date.UTC(nam!, thang! - 1, ngay!));
    if (d.getUTCDate() !== ngay) return 'Ngày dương lịch không tồn tại.';
  } else if (ngay! > 30) {
    return 'Tháng âm lịch chỉ có tối đa 30 ngày.';
  }
  return null;
}

/** Lập lá số. Ném lỗi nếu ngày âm lịch không tồn tại. */
export function lapLaSo(t: ThongTinSinh): LaSo {
  const loi = kiemTraThongTin(t);
  if (loi) throw new Error(loi);
  return engine.anLaSo(t);
}

/** Tóm tắt lá số thành văn bản gọn (dùng làm đầu vào cho phần luận giải). */
export function tomTatLaSo(ls: LaSo): string {
  return engine.tomTat(ls);
}

export const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const;
export const GIO_SINH = [
  'Tý (23h–1h)', 'Sửu (1h–3h)', 'Dần (3h–5h)', 'Mão (5h–7h)', 'Thìn (7h–9h)', 'Tỵ (9h–11h)',
  'Ngọ (11h–13h)', 'Mùi (13h–15h)', 'Thân (15h–17h)', 'Dậu (17h–19h)', 'Tuất (19h–21h)', 'Hợi (21h–23h)',
] as const;
