import type { LaSo } from '@/lib/tuvi';
import { chonDoanMenh, type DoanLuan } from './chon-doan';
import { chonDoanMau, type DoanMau } from './doan-mau';
import duLieu from './menh-chinh-tinh.json';

export interface TomTatMienPhi {
  banMenh: string; // nạp âm
  cuc: string;
  chinhTinhMenh: { ten: string; dacTinhTen: string | null }[];
  voChinhDieu: boolean;
  /** Cung chính tinh được mượn khi Mệnh vô chính diệu (xung chiếu) */
  chinhTinhXungChieu: string[];
  thanCu: string; // tên cung có Thân
  doan: DoanLuan[];
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
