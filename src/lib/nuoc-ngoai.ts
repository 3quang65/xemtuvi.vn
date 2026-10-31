// Danh sách tĩnh các nước/múi giờ Việt kiều hay gặp cho ô "Sinh ở nước ngoài?".
// Không dùng IANA/Intl: luật giờ mùa hè đổi theo năm nên khách tự chọn múi đúng mùa lúc sinh (nhãn ghi rõ giờ mùa hè/mùa đông).
import { muiGioHopLe, nhanMuiGio } from './tuvi';

export interface MuiNuoc { id: string; nuoc: string; nhan: string; mui: number }

interface Vung { nuoc: string; vung?: string; dong: number; he?: number; heGhiChu?: string }

// dong = giờ mùa đông (giờ chuẩn); he = giờ mùa hè nếu nước đó có đổi giờ
const VUNG: Vung[] = [
  { nuoc: 'Hoa Kỳ', vung: 'miền Đông (New York, Florida)', dong: -5, he: -4, heGhiChu: 'khoảng tháng 3–11' },
  { nuoc: 'Hoa Kỳ', vung: 'miền Trung (Texas, Chicago)', dong: -6, he: -5, heGhiChu: 'khoảng tháng 3–11' },
  { nuoc: 'Hoa Kỳ', vung: 'miền Núi (Colorado, Utah)', dong: -7, he: -6, heGhiChu: 'khoảng tháng 3–11' },
  { nuoc: 'Hoa Kỳ', vung: 'bờ Tây (California, Washington)', dong: -8, he: -7, heGhiChu: 'khoảng tháng 3–11' },
  { nuoc: 'Hoa Kỳ', vung: 'Hawaii', dong: -10 },
  { nuoc: 'Canada', vung: 'Toronto, Montréal', dong: -5, he: -4, heGhiChu: 'khoảng tháng 3–11' },
  { nuoc: 'Canada', vung: 'Vancouver', dong: -8, he: -7, heGhiChu: 'khoảng tháng 3–11' },
  { nuoc: 'Úc', vung: 'Sydney, Melbourne', dong: 10, he: 11, heGhiChu: 'khoảng tháng 10–4' },
  { nuoc: 'Úc', vung: 'Brisbane', dong: 10 },
  { nuoc: 'Úc', vung: 'Perth', dong: 8 },
  { nuoc: 'New Zealand', dong: 12, he: 13, heGhiChu: 'khoảng tháng 9–4' },
  { nuoc: 'Pháp', dong: 1, he: 2, heGhiChu: 'khoảng tháng 3–10' },
  { nuoc: 'Đức', dong: 1, he: 2, heGhiChu: 'khoảng tháng 3–10' },
  { nuoc: 'Anh', dong: 0, he: 1, heGhiChu: 'khoảng tháng 3–10' },
  { nuoc: 'Na Uy', dong: 1, he: 2, heGhiChu: 'khoảng tháng 3–10' },
  { nuoc: 'Thụy Điển', dong: 1, he: 2, heGhiChu: 'khoảng tháng 3–10' },
  { nuoc: 'Séc', dong: 1, he: 2, heGhiChu: 'khoảng tháng 3–10' },
  { nuoc: 'Ba Lan', dong: 1, he: 2, heGhiChu: 'khoảng tháng 3–10' },
  { nuoc: 'Nga (Moskva)', dong: 3 },
  { nuoc: 'Nhật Bản', dong: 9 },
  { nuoc: 'Hàn Quốc', dong: 9 },
  { nuoc: 'Đài Loan', dong: 8 },
  { nuoc: 'Trung Quốc, Hồng Kông, Macao', dong: 8 },
  { nuoc: 'Singapore', dong: 8 },
  { nuoc: 'Malaysia', dong: 8 },
  { nuoc: 'Philippines', dong: 8 },
  { nuoc: 'Thái Lan', dong: 7 },
  { nuoc: 'Campuchia', dong: 7 },
  { nuoc: 'Lào', dong: 7 },
  { nuoc: 'Ấn Độ', dong: 5.5 },
  { nuoc: 'Các Tiểu vương quốc Ả Rập (Dubai)', dong: 4 },
];

const bo = (m: number, ten: string) => `${ten} (${nhanMuiGio(m)})`;

/** Mỗi dòng của ô chọn: một múi giờ cụ thể, giờ mùa hè/mùa đông ghi rõ trong nhãn. */
export const DANH_SACH_MUI: MuiNuoc[] = VUNG.flatMap((v, i): MuiNuoc[] => {
  const ten = v.vung ? `${v.nuoc} · ${v.vung}` : v.nuoc;
  if (v.he == null) return [{ id: `v${i}`, nuoc: v.nuoc, nhan: bo(v.dong, ten), mui: v.dong }];
  return [
    { id: `v${i}d`, nuoc: v.nuoc, nhan: bo(v.dong, `${ten} · giờ mùa đông`), mui: v.dong },
    { id: `v${i}h`, nuoc: v.nuoc, nhan: bo(v.he, `${ten} · giờ mùa hè, ${v.heGhiChu}`), mui: v.he },
  ];
});

export const MUI_KHAC = 'khac';

/** Đọc "-5", "+5:30", "5,5", "UTC+9" thành số múi giờ; null nếu không hợp lệ (−12…+14, bước 0,25). */
export function docMuiGio(chu: string): number | null {
  const s = chu.trim().replace(/^utc/i, '').replace(/\s+/g, '').replace('−', '-').replace(',', '.');
  const m = /^([+-]?)(\d{1,2})(?::(\d{2})|\.(\d+))?$/.exec(s);
  if (!m) return null;
  let v = Number(m[2]);
  if (m[3] != null) { if (Number(m[3]) > 59) return null; v += Number(m[3]) / 60; }
  else if (m[4] != null) v += Number('0.' + m[4]);
  if (m[1] === '-') v = -v;
  return muiGioHopLe(v) ? v : null;
}

const hh = (p: number) => `${String(Math.floor(p / 60)).padStart(2, '0')}:${String(p % 60).padStart(2, '0')}`;

/** Dòng xem trước: "21:00 Hoa Kỳ = 09:00 Việt Nam (hôm sau)". null khi chưa đủ giờ hoặc múi giờ. */
export function xemTruocQuyDoi(gio: number, phut: number, mui: number, nuoc: string): { dongHo: string; vn: string; lech: -1 | 0 | 1; cau: string } | null {
  if (!Number.isInteger(gio) || gio < 0 || gio > 23 || !Number.isInteger(phut) || phut < 0 || phut > 59 || !muiGioHopLe(mui)) return null;
  const tong = gio * 60 + phut - Math.round((mui - 7) * 60);
  const lech = Math.floor(tong / 1440) as -1 | 0 | 1;
  const vn = hh(((tong % 1440) + 1440) % 1440);
  const dongHo = hh(gio * 60 + phut);
  const ghi = lech === 1 ? ' (ngày hôm sau)' : lech === -1 ? ' (ngày hôm trước)' : '';
  return { dongHo, vn, lech, cau: `${dongHo} ${nuoc} = ${vn} Việt Nam${ghi}` };
}
