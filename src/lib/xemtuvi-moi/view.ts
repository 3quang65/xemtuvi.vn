import type { Cung, LaSo, NguHanh, Sao } from '@/lib/tuvi';

/** Mô hình hiển thị tối thiểu cho lưới lá số mới; tách khỏi engine để thay giao diện không đụng an sao. */
export interface SaoView { ten: string; hanh: NguHanh; loai: 'chinh' | 'cat' | 'sat' | 'phu'; sang: string | null; hoa: string | null }
export interface CungView {
  chi: number; tenChi: string; can: string; ten: string;
  laMenh: boolean; laThan: boolean; tuan: boolean; triet: boolean;
  daiVan: string; tieuHan: string;
  chinhTinh: SaoView[]; phuTinh: SaoView[];
}
export interface LaSoView {
  ten: string; gioiTinh: string; canChi: string; banMenh: string; cuc: string; amDuong: string;
  cung: CungView[]; // đủ 12 phần tử, chỉ số = chi (0 = Tý)
}

const saoView = (s: Sao, loai?: SaoView['loai']): SaoView => ({ ten: s.ten, hanh: s.hanh, loai: loai ?? s.loai, sang: s.dacTinhTen, hoa: s.hoa });

export function cungView(c: Cung): CungView {
  return {
    chi: c.chi, tenChi: c.tenChi, can: c.can, ten: c.ten,
    laMenh: c.ten === 'Mệnh', laThan: c.laThan, tuan: c.tuan, triet: c.triet,
    daiVan: c.daiVan, tieuHan: c.tieuHan,
    chinhTinh: c.chinhTinh.map((s) => saoView(s)),
    phuTinh: [...c.catTinh, ...c.hungTinh].map((s) => saoView(s)).concat(c.phuTinh.map((s) => saoView(s, 'phu'))),
  };
}

export function laSoView(ls: LaSo): LaSoView {
  return {
    ten: ls.ten, gioiTinh: ls.gioiTinh, banMenh: ls.banMenh, cuc: ls.cuc, amDuong: ls.amDuong,
    canChi: `${ls.canChi.gio} ${ls.canChi.ngay} ${ls.canChi.thang} ${ls.canChi.nam}`,
    cung: ls.cung.map(cungView),
  };
}

/** Ô (hàng, cột) của 12 địa chi trên địa bàn 4×4, 1-based. Cố định theo truyền thống: Tỵ góc trên trái, Dần góc dưới trái. */
export const VI_TRI_CHI: ReadonlyArray<readonly [number, number]> = [
  [4, 3], [4, 2], [4, 1], [3, 1], [2, 1], [1, 1], [1, 2], [1, 3], [1, 4], [2, 4], [3, 4], [4, 4],
];
