// Phân loại lỗi ở form lập lá số thành E01 (thiếu), E02 (ngày sai), E03 (giờ sai) để hiện đúng thông báo dưới đúng ô.
// Khớp kiemTraThongTin() của engine: trả null khi và chỉ khi engine cũng chấp nhận (có test đối chiếu).
import { muiGioHopLe } from './tuvi/nhe';
import type { ThongTinSinh } from './tuvi';

export type OLoi = 'gioiTinh' | 'ngay' | 'gio' | 'muiGio';
export interface LoiNhap { ma: 'E01' | 'E02' | 'E03'; o: OLoi; thieu?: string[]; lich?: 'duong' | 'am'; nhuan?: boolean }

const co = (n: unknown) => typeof n === 'number' && Number.isFinite(n) && n !== 0;

export function phanLoaiLoiNhap(t: Partial<ThongTinSinh>): LoiNhap | null {
  const thieu: { ten: string; o: OLoi }[] = [];
  if (!t.gioiTinh) thieu.push({ ten: 'giới tính', o: 'gioiTinh' });
  if (!co(t.ngay) || !co(t.thang) || !co(t.nam)) thieu.push({ ten: 'ngày, tháng, năm sinh', o: 'ngay' });
  if (typeof t.gio !== 'number' || !Number.isFinite(t.gio)) thieu.push({ ten: 'giờ sinh', o: 'gio' });
  // Sinh ở nước ngoài chỉ có nghĩa khi nhập dương lịch
  const nuocNgoai = !!t.sinhNuocNgoai && t.lich !== 'am';
  if (nuocNgoai && t.muiGioUTC == null) thieu.push({ ten: 'múi giờ nơi sinh', o: 'muiGio' });
  if (thieu.length) return { ma: 'E01', o: thieu[0].o, thieu: thieu.map((x) => x.ten) };

  const { ngay, thang, nam, gio } = t as { ngay: number; thang: number; nam: number; gio: number };
  const e02 = (): LoiNhap => ({ ma: 'E02', o: 'ngay', lich: t.lich === 'am' ? 'am' : 'duong', nhuan: t.lich === 'am' && !!t.nhuan });
  if (!Number.isInteger(nam) || nam < 1900 || nam > 2100 || !Number.isInteger(thang) || thang < 1 || thang > 12 || !Number.isInteger(ngay) || ngay < 1 || ngay > 31) return e02();
  if (t.lich === 'duong') {
    if (new Date(Date.UTC(nam, thang - 1, ngay)).getUTCDate() !== ngay) return e02();
  } else if (ngay > 30) return e02();
  if (!Number.isInteger(gio) || gio < 0 || gio > 23) return { ma: 'E03', o: 'gio' };
  if (t.phut != null && (!Number.isInteger(t.phut) || t.phut < 0 || t.phut > 59)) return { ma: 'E03', o: 'gio' };
  // Mã E04 đã dành cho lỗi phía hệ thống nên lỗi múi giờ dùng E03 gắn vào ô muiGio
  if (t.sinhNuocNgoai && t.mienNamTruoc1975) return { ma: 'E03', o: 'muiGio' };
  if (nuocNgoai && !muiGioHopLe(t.muiGioUTC)) return { ma: 'E03', o: 'muiGio' };
  return null;
}

/** "a", "a và b", "a, b và c". */
export function noiTen(ds: string[]): string {
  return ds.length <= 1 ? ds.join('') : `${ds.slice(0, -1).join(', ')} và ${ds[ds.length - 1]}`;
}
