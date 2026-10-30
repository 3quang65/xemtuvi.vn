import type { LaSo } from '@/lib/tuvi';
import { chonDoanMenh, type DoanLuan } from './chon-doan';
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

/** Đoạn mẫu cho màn chọn gói (ví dụ minh họa, không phải lá số của khách). */
export const DOAN_MAU = (duLieu.menh['Thái Âm'] ?? []).find((r) => r.ma === 'MENH-TA-01')!;
