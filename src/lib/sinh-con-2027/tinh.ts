// Công cụ "Sinh con 2027 hợp bố mẹ": logic thuần, không gọi engine an sao.
// Quy tắc: docs/san-pham/sinh-con-2027-quy-tac.md (mục 1–5). Bản kiểm tham chiếu: docs/san-pham/sinh-con-2027-kiem.py.

export const NAM_MIN = 1960;
export const NAM_MAX = 2010;

export const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'] as const;
export const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const;
export type Hanh = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
export type Muc = 'thuan' | 'can-bang' | 'can-luu-y';

// 30 nạp âm theo thứ tự hoa giáp (spec an sao mục 3.1); phần tử floor(n/2), n = (6c − 5z) mod 60. Hành là chữ cuối.
const NAP_AM = [
  'Hải Trung Kim', 'Lô Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim', 'Sơn Đầu Hỏa',
  'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc', 'Tuyền Trung Thủy', 'Ốc Thượng Thổ',
  'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy', 'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc',
  'Bích Thượng Thổ', 'Kim Bạch Kim', 'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Trạch Thổ', 'Thoa Xuyến Kim',
  'Tang Đố Mộc', 'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy',
] as const;

const SINH: Record<Hanh, Hanh> = { Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim', Kim: 'Thủy', Thủy: 'Mộc' };
const KHAC: Record<Hanh, Hanh> = { Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc' };
const CON_HANH: Hanh = 'Thủy'; // Đinh Mùi 2027, Thiên Hà Thủy
export const NAM_CON = 2027;

/** Ngày mùng 1 Tết (ngày, tháng dương lịch) theo lịch Việt, đối chiếu engine tham chiếu (quy tắc mục 4). */
const TET: Record<number, [number, number]> = {
  1960: [28, 1], 1961: [15, 2], 1962: [5, 2], 1963: [25, 1], 1964: [13, 2], 1965: [2, 2], 1966: [21, 1], 1967: [9, 2],
  1968: [29, 1], 1969: [16, 2], 1970: [6, 2], 1971: [27, 1], 1972: [15, 2], 1973: [3, 2], 1974: [23, 1], 1975: [11, 2],
  1976: [31, 1], 1977: [18, 2], 1978: [7, 2], 1979: [28, 1], 1980: [16, 2], 1981: [5, 2], 1982: [25, 1], 1983: [13, 2],
  1984: [2, 2], 1985: [21, 1], 1986: [9, 2], 1987: [29, 1], 1988: [17, 2], 1989: [6, 2], 1990: [27, 1], 1991: [15, 2],
  1992: [4, 2], 1993: [23, 1], 1994: [10, 2], 1995: [31, 1], 1996: [19, 2], 1997: [7, 2], 1998: [28, 1], 1999: [16, 2],
  2000: [5, 2], 2001: [24, 1], 2002: [12, 2], 2003: [1, 2], 2004: [22, 1], 2005: [9, 2], 2006: [29, 1], 2007: [17, 2],
  2008: [7, 2], 2009: [26, 1], 2010: [14, 2],
};
export const tetCuaNam = (nam: number): [number, number] | undefined => TET[nam];

export const canChi = (namAm: number) => ({ c: (((namAm - 4) % 10) + 10) % 10, z: (((namAm - 4) % 12) + 12) % 12 });
const napAmIdx = (c: number, z: number) => Math.floor((((6 * c - 5 * z) % 60) + 60) % 60 / 2);

/** Tiêu chí A: quan hệ địa chi với Mùi. */
export function diemChi(z: number): { diem: number; loai: 'tam-hop' | 'luc-hop' | 'luc-xung' | 'cung-chi' | 'khong' } {
  if (z === 3 || z === 11) return { diem: 1, loai: 'tam-hop' };
  if (z === 6) return { diem: 1, loai: 'luc-hop' };
  if (z === 1) return { diem: -1, loai: 'luc-xung' };
  if (z === 7) return { diem: 0, loai: 'cung-chi' };
  return { diem: 0, loai: 'khong' };
}

/** Tiêu chí B: hành nạp âm với Thủy. */
export function diemHanh(h: Hanh): { diem: number; loai: 'binh-hoa' | 'sinh-thuy' | 'thuy-sinh' | 'khac-thuy' | 'thuy-khac' } {
  if (h === CON_HANH) return { diem: 0, loai: 'binh-hoa' };
  if (SINH[h] === CON_HANH) return { diem: 1, loai: 'sinh-thuy' };
  if (SINH[CON_HANH] === h) return { diem: 1, loai: 'thuy-sinh' };
  if (KHAC[h] === CON_HANH) return { diem: -1, loai: 'khac-thuy' };
  return { diem: -1, loai: 'thuy-khac' };
}

export const mucTheoTong = (t: number): Muc => (t >= 2 ? 'thuan' : t <= -2 ? 'can-luu-y' : 'can-bang');

export type NhapNguoi = { nam: number; thang?: number; ngay?: number };
export type MotNguoi = {
  namDuong: number; namAm: number; truocTet: boolean; chuaBietTet: boolean;
  can: string; chi: string; chiIdx: number; napAm: string; hanh: Hanh; A: number; B: number; s: number;
  loaiA: ReturnType<typeof diemChi>['loai']; loaiB: ReturnType<typeof diemHanh>['loai'];
};

const ngayTrongThang = (nam: number, thang: number) =>
  thang === 2 ? ((nam % 4 === 0 && nam % 100 !== 0) || nam % 400 === 0 ? 29 : 28) : [4, 6, 9, 11].includes(thang) ? 30 : 31;

/** Kiểm đầu vào; trả thông báo lỗi hoặc null. */
export function kiemNhap(n: NhapNguoi): string | null {
  if (!Number.isInteger(n.nam) || n.nam < NAM_MIN || n.nam > NAM_MAX) return `Năm sinh cần nằm trong khoảng ${NAM_MIN}–${NAM_MAX}.`;
  if (n.thang === undefined && n.ngay === undefined) return null;
  if (n.thang === undefined || n.ngay === undefined) return 'Hãy nhập đủ cả ngày và tháng sinh, hoặc để trống cả hai.';
  if (n.thang !== 1 && n.thang !== 2) return 'Chỉ cần nhập ngày tháng khi sinh vào tháng 1 hoặc tháng 2 dương lịch.';
  if (!Number.isInteger(n.ngay) || n.ngay < 1 || n.ngay > ngayTrongThang(n.nam, n.thang)) return 'Ngày sinh chưa đúng với tháng đã chọn.';
  return null;
}

/** Một người: năm âm = năm dương, hoặc năm trước nếu sinh tháng 1–2 dương và trước mùng 1 Tết. */
export function motNguoi(n: NhapNguoi): MotNguoi {
  const loi = kiemNhap(n);
  if (loi) throw new RangeError(loi);
  let truocTet = false;
  if (n.thang !== undefined && n.ngay !== undefined) {
    const [td, tt] = TET[n.nam];
    truocTet = n.thang < tt || (n.thang === tt && n.ngay < td);
  }
  const namAm = truocTet ? n.nam - 1 : n.nam;
  const { c, z } = canChi(namAm);
  const napAm = NAP_AM[napAmIdx(c, z)];
  const hanh = napAm.split(' ').pop() as Hanh;
  const a = diemChi(z), b = diemHanh(hanh);
  return {
    namDuong: n.nam, namAm, truocTet, chuaBietTet: n.thang === undefined && n.ngay === undefined,
    can: CAN[c], chi: CHI[z], chiIdx: z, napAm, hanh, A: a.diem, B: b.diem, s: a.diem + b.diem, loaiA: a.loai, loaiB: b.loai,
  };
}

export function danhGia(bo: NhapNguoi, me: NhapNguoi) {
  const b = motNguoi(bo), m = motNguoi(me), tong = b.s + m.s;
  return { bo: b, me: m, tong, muc: mucTheoTong(tong) };
}
