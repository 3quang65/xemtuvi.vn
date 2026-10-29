// Lớp bọc có kiểu dữ liệu cho bộ máy an sao (tuvi-raw.js, xem NOTICE).
// Mọi phần giao diện và luận giải chỉ được gọi qua file này,
// để sau này thay/sửa engine mà không ảnh hưởng chỗ khác.

// eslint-disable-next-line @typescript-eslint/no-require-imports
import TuViRaw from './tuvi-raw.js';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import LichRaw from './lich-raw.js';

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

/** Quy ước an sao ở các điểm trường phái khác nhau (đặc tả mục 10). Không truyền thì dùng mặc định. */
export interface QuyUoc {
  muiGioLich: 'lichSu' | 'utc7';
  gioTyMuon: 'ngaySau' | 'giuNgay';
  /** 10.6 — Hỏa, Linh tuổi Tỵ Dậu Sửu: câu phú (Hỏa Mão, Linh Tuất) hay engine cũ (Hỏa Tuất, Linh Mão) */
  hoaLinh: 'cauPhu' | 'ansaotuvi';
  /** 10.8 — Thiên Khôi, Thiên Việt: Toàn Thư (mặc định), biến thể "Canh Tân phùng Mã Hổ", hay engine cũ */
  khoiViet: 'toanThu' | 'canhTanMaHo' | 'ansaotuvi';
  /** 10.9 — Phá Toái: iztro/sách Trung Quốc (mặc định) hay engine cũ (đổi Tỵ và Dậu) */
  phaToai: 'iztro' | 'ansaotuvi';
  /** 10.10 — Lưu Hà: sách Trung Quốc (Đinh Thân, Canh Thìn) hay engine cũ (Đinh Thìn, Canh Thân) */
  luuHa: 'trungQuoc' | 'ansaotuvi';
  /** 10.11 — Thiên Trù can Quý: Tuất (mặc định) hay Hợi (iztro) */
  thienTruQuy: 'tuat' | 'hoi';
  /** 10.7 — Thiên Giải: Thân + 2(M−1) (mặc định), theo cặp tháng, hay Thân + (M−1) */
  thienGiai: 'thienLuong' | 'capThang' | 'thanThuan';
}

export interface ThongTinSinh {
  lich: 'duong' | 'am';
  ngay: number;
  thang: number;
  nam: number;
  nhuan?: boolean;
  gio: number; // 0–23, giờ đồng hồ
  phut?: number; // 0–59
  mienNamTruoc1975?: boolean; // sinh ở miền Nam, giờ khai sinh theo đồng hồ UTC+8 (1960–1975)
  gioiTinh: 'nam' | 'nu';
  ten?: string;
  quyUoc?: Partial<QuyUoc>;
}

export interface LaSo {
  ten: string;
  gioiTinh: 'Nam' | 'Nữ';
  amDuong: string;
  amDuongLy: string;
  duong: { ngay: number; thang: number; nam: number };
  am: { ngay: number; thang: number; nam: number; nhuan: boolean };
  gio: { chi: string; khoang: string; canChi: string; dongHo: string };
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
  /** Giờ sinh sau khi quy về giờ chuẩn UTC+7 (đặc tả 1.2) */
  gioChuan: { ngay: number; thang: number; nam: number; gio: string; daQuyDoi: boolean };
  /** Múi giờ đã dùng để đổi âm lịch (8 với ngày trước 1968) */
  amLichTz: 7 | 8;
  /** Chỉ số nội bộ (0 = Giáp/Tý) để an sao lưu */
  chiSo: { canNam: number; chiNam: number; thang: number; gio: number };
  quyUoc: QuyUoc;
  cung: Cung[]; // 12 phần tử, chỉ số = chi (0 = Tý)
}

/** Sao lưu niên, lưu tứ hóa và vận hạn của một năm xem (đặc tả mục 7). Chỉ số cung: 0 = Tý … 11 = Hợi. */
export interface LuuNien {
  namXem: number; // năm âm lịch
  canChi: string;
  tuoiMu: number;
  saoLuu: { key: string; ten: string; chi: number }[];
  luuTuHoa: { hoa: 'Hóa Lộc' | 'Hóa Quyền' | 'Hóa Khoa' | 'Hóa Kỵ'; sao: string; chi: number }[];
  luuThaiTue: number;
  daiVan: number | null;
  tieuHan: number | null;
  luuNguyet: number[]; // cung của tháng 1…12
}

interface Engine {
  anLaSo(opts: ThongTinSinh): LaSo;
  anLuuNien(ls: LaSo, namXem: number, tuyChon?: { dayDu?: boolean }): LuuNien;
  tomTat(ls: LaSo): string;
}

const engine = TuViRaw as unknown as Engine;
const Lich = LichRaw as unknown as { duongSangAm(d: number, m: number, y: number): { nam: number } };

/** Kiểm tra dữ liệu đầu vào trước khi an sao. Trả về thông báo lỗi tiếng Việt, hoặc null nếu hợp lệ. */
export function kiemTraThongTin(t: Partial<ThongTinSinh>): string | null {
  const { ngay, thang, nam, gio, gioiTinh } = t;
  if (!gioiTinh) return 'Vui lòng chọn giới tính.';
  if (!Number.isInteger(nam) || nam! < 1900 || nam! > 2100) return 'Năm sinh cần trong khoảng 1900–2100.';
  if (!Number.isInteger(thang) || thang! < 1 || thang! > 12) return 'Tháng sinh không hợp lệ.';
  if (!Number.isInteger(ngay) || ngay! < 1 || ngay! > 31) return 'Ngày sinh không hợp lệ.';
  if (!Number.isInteger(gio) || gio! < 0 || gio! > 23) return 'Vui lòng chọn giờ sinh.';
  if (t.phut != null && (!Number.isInteger(t.phut) || t.phut < 0 || t.phut > 59)) return 'Phút sinh cần trong khoảng 0–59.';
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

/** Các quy ước đã áp dụng cho lá số này, viết cho người xem ("Lá số lập theo…"). */
export function moTaQuyUoc(ls: LaSo): string[] {
  const ds: string[] = [];
  const g = ls.gioChuan;
  if (g.daQuyDoi) ds.push(`Giờ khai sinh miền Nam (đồng hồ UTC+8) đã quy về giờ chuẩn: ${g.gio} ngày ${g.ngay}/${g.thang}/${g.nam}.`);
  if (g.gio.startsWith('23:')) {
    ds.push(ls.quyUoc.gioTyMuon === 'ngaySau'
      ? 'Sinh từ 23 giờ: tính sang ngày hôm sau (giờ Tý của ngày mới).'
      : 'Sinh từ 23 giờ: giữ ngày sinh cũ, chỉ đổi sang giờ Tý (theo lựa chọn của bạn).');
  }
  if (ls.amLichTz === 8) ds.push('Âm lịch trước năm 1968 tính theo lịch thời đó (múi giờ UTC+8).');
  return ds;
}

/**
 * An sao lưu cho năm âm lịch namXem. Mặc định 9 sao lưu phổ biến ở phái Việt và lưu tứ hóa;
 * dayDu thêm Lưu Khôi, Việt, Xương, Khúc, Hồng Loan, Thiên Hỷ.
 */
export function luuNien(ls: LaSo, namXem: number, dayDu = false): LuuNien {
  return engine.anLuuNien(ls, namXem, { dayDu });
}

/** Năm âm lịch hiện tại theo giờ Việt Nam. */
export function namAmHienTai(): number {
  const vn = new Date(Date.now() + 7 * 3600 * 1000);
  return Lich.duongSangAm(vn.getUTCDate(), vn.getUTCMonth() + 1, vn.getUTCFullYear()).nam;
}

/** Tóm tắt lá số thành văn bản gọn (dùng làm đầu vào cho phần luận giải). */
export function tomTatLaSo(ls: LaSo): string {
  return engine.tomTat(ls);
}

export const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const;
/** Tên canh giờ của giờ đồng hồ 0–23 (23h là Tý muộn, 0h là Tý sớm). */
export function canhGio(gio: number): string {
  return gio === 23 ? 'Tý muộn' : gio === 0 ? 'Tý sớm' : CHI[Math.floor(((gio + 1) % 24) / 2)];
}
export const GIO_SINH = [
  'Tý (23h–1h)', 'Sửu (1h–3h)', 'Dần (3h–5h)', 'Mão (5h–7h)', 'Thìn (7h–9h)', 'Tỵ (9h–11h)',
  'Ngọ (11h–13h)', 'Mùi (13h–15h)', 'Thân (15h–17h)', 'Dậu (17h–19h)', 'Tuất (19h–21h)', 'Hợi (21h–23h)',
] as const;
