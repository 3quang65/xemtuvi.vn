// Báo lỗi / góp ý của khách (trang /tro-giup#bao-loi). Kiểm dữ liệu, giới hạn độ dài, chống gửi dồn.
// Cố ý KHÔNG có trường ngày giờ sinh; trường nào ngoài danh sách bị bỏ.
import type { Csdl } from './csdl';

export const GIOI_HAN_BAO_LOI = { moTa: 1000, moTaToiThieu: 10, maDon: 40, goi: 40, thietBi: 120, gioKhach: 40 } as const;
const TINH_HUONG = new Set(['E04', 'E05', 'E07', 'E08']);
/** Mỗi nguồn gửi tối đa 5 báo lỗi / 10 phút; toàn site tối đa 200 / giờ. */
export const TOC_DO = { moiNguon: 5, cuaSoNguon: 10 * 60_000, toanSite: 200, cuaSoSite: 60 * 60_000 } as const;

export interface BaoLoi { moTa: string; maDon: string; goi: string; thietBi: string; gioKhach: string; tinhHuong: string }
export type KetQuaKiem = { ok: true; v: BaoLoi } | { ok: false; truong: keyof BaoLoi | 'chung'; thongDiep: string };

// eslint-disable-next-line no-control-regex
const KY_TU_DIEU_KHIEN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const lamSach = (s: string, toiDa: number, nhieuDong = false) =>
  (nhieuDong ? s.replace(/\r\n?/g, '\n') : s.replace(/\s+/g, ' ')).replace(KY_TU_DIEU_KHIEN, '').trim().slice(0, toiDa);

export function kiemTraBaoLoi(b: unknown): KetQuaKiem {
  if (!b || typeof b !== 'object' || Array.isArray(b)) return { ok: false, truong: 'chung', thongDiep: 'Dữ liệu không hợp lệ.' };
  const o = b as Record<string, unknown>;
  const chuoi = (k: string) => (typeof o[k] === 'string' ? (o[k] as string) : '');
  if (typeof o.moTa !== 'string') return { ok: false, truong: 'moTa', thongDiep: 'Bạn mô tả giúp mình điều đã xảy ra nhé.' };
  if (o.moTa.length > GIOI_HAN_BAO_LOI.moTa * 2) return { ok: false, truong: 'moTa', thongDiep: `Phần mô tả dài quá, bạn rút gọn trong ${GIOI_HAN_BAO_LOI.moTa} ký tự giúp mình.` };
  const moTa = lamSach(o.moTa, GIOI_HAN_BAO_LOI.moTa + 1, true);
  if (moTa.length < GIOI_HAN_BAO_LOI.moTaToiThieu) return { ok: false, truong: 'moTa', thongDiep: 'Bạn mô tả giúp mình điều đã xảy ra nhé (ít nhất vài chữ).' };
  if (moTa.length > GIOI_HAN_BAO_LOI.moTa) return { ok: false, truong: 'moTa', thongDiep: `Phần mô tả dài quá, bạn rút gọn trong ${GIOI_HAN_BAO_LOI.moTa} ký tự giúp mình.` };
  const maDon = lamSach(chuoi('maDon'), GIOI_HAN_BAO_LOI.maDon);
  if (maDon && !/^[A-Za-z0-9\-_ ]+$/.test(maDon)) return { ok: false, truong: 'maDon', thongDiep: 'Mã đơn chỉ gồm chữ không dấu, số và dấu gạch ngang.' };
  const th = chuoi('tinhHuong');
  return {
    ok: true,
    v: {
      moTa, maDon,
      goi: lamSach(chuoi('goi'), GIOI_HAN_BAO_LOI.goi),
      thietBi: lamSach(chuoi('thietBi'), GIOI_HAN_BAO_LOI.thietBi),
      gioKhach: lamSach(chuoi('gioKhach'), GIOI_HAN_BAO_LOI.gioKhach),
      tinhHuong: TINH_HUONG.has(th) ? th : '',
    },
  };
}

/** Bộ đếm theo nguồn (trong bộ nhớ tiến trình; mất khi khởi động lại là chấp nhận được). */
const lanGui = new Map<string, number[]>();
export function choPhepTheoNguon(nguon: string, bayGio = Date.now()): boolean {
  const moc = bayGio - TOC_DO.cuaSoNguon;
  const ds = (lanGui.get(nguon) ?? []).filter((t) => t > moc);
  if (ds.length >= TOC_DO.moiNguon) { lanGui.set(nguon, ds); return false; }
  ds.push(bayGio); lanGui.set(nguon, ds);
  if (lanGui.size > 5000) for (const [k, v] of lanGui) if (!v.some((t) => t > moc)) lanGui.delete(k);
  return true;
}
export const xoaBoDemNguon = () => lanGui.clear();

export function choPhepToanSite(db: Csdl, bayGio = Date.now()): boolean {
  const n = (db.prepare('SELECT COUNT(*) n FROM bao_loi WHERE tao_luc > ?').get(bayGio - TOC_DO.cuaSoSite) as { n: number }).n;
  return n < TOC_DO.toanSite;
}

export function luuBaoLoi(db: Csdl, v: BaoLoi, nguoiDungId: number | null, bayGio = Date.now()): number {
  return Number(db.prepare('INSERT INTO bao_loi (tao_luc, mo_ta, ma_don, goi, thiet_bi, gio_khach, tinh_huong, nguoi_dung_id) VALUES (?,?,?,?,?,?,?,?)')
    .run(bayGio, v.moTa, v.maDon, v.goi, v.thietBi, v.gioKhach, v.tinhHuong, nguoiDungId).lastInsertRowid);
}
