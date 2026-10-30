// Báo lỗi / góp ý của khách (trang /tro-giup#bao-loi). Kiểm dữ liệu, giới hạn độ dài, chống gửi dồn.
// Cố ý KHÔNG có trường ngày giờ sinh; trường nào ngoài danh sách bị bỏ.
import { createHash } from 'node:crypto';
import type { Csdl } from './csdl';
import { chuanHoa } from './lien-he';

export const GIOI_HAN_BAO_LOI = { moTa: 1000, moTaToiThieu: 10, maDon: 40, goi: 40, thietBi: 120, gioKhach: 40, lienHe: 120 } as const;
const TINH_HUONG = new Set(['E04', 'E05', 'E07', 'E08']);
/** Mỗi nguồn gửi tối đa 5 báo lỗi / 10 phút; toàn site tối đa 200 / giờ. */
export const TOC_DO = { moiNguon: 5, cuaSoNguon: 10 * 60_000, toanSite: 200, cuaSoSite: 60 * 60_000 } as const;

export interface BaoLoi { moTa: string; maDon: string; goi: string; thietBi: string; gioKhach: string; tinhHuong: string; lienHe: string }
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
  // Ô tùy chọn "Email hoặc Zalo để mình trả lời": có '@' thì coi là email, không thì là số Zalo. Chỉ lưu giá trị đã chuẩn hóa.
  const lienTho = chuoi('lienHe').trim();
  let lienHe = '';
  if (lienTho) {
    const c = lienTho.length <= GIOI_HAN_BAO_LOI.lienHe ? chuanHoa(lienTho.includes('@') ? 'email' : 'zalo', lienTho) : null;
    if (!c) return { ok: false, truong: 'lienHe', thongDiep: 'Email hoặc số Zalo chưa đúng dạng. Bạn kiểm tra lại, hoặc để trống ô này cũng được nhé.' };
    lienHe = c.giaTri;
  }
  return {
    ok: true,
    v: {
      moTa, maDon,
      goi: lamSach(chuoi('goi'), GIOI_HAN_BAO_LOI.goi),
      thietBi: lamSach(chuoi('thietBi'), GIOI_HAN_BAO_LOI.thietBi),
      gioKhach: lamSach(chuoi('gioKhach'), GIOI_HAN_BAO_LOI.gioKhach),
      tinhHuong: TINH_HUONG.has(th) ? th : '',
      lienHe,
    },
  };
}

/**
 * Bộ đếm theo nguồn, lưu bảng nguon_gui (bền qua khởi động lại). Chỉ lưu băm SHA-256 của nguồn, không lưu địa chỉ gốc;
 * dòng quá cửa sổ bị xóa mỗi lần kiểm.
 */
const bamNguon = (nguon: string) => createHash('sha256').update(nguon).digest('hex').slice(0, 32);
export function choPhepTheoNguon(db: Csdl, nguon: string, bayGio = Date.now()): boolean {
  const k = bamNguon(nguon);
  return db.transaction(() => {
    db.prepare('DELETE FROM nguon_gui WHERE luc <= ?').run(bayGio - TOC_DO.cuaSoNguon);
    const n = (db.prepare('SELECT COUNT(*) n FROM nguon_gui WHERE khoa = ?').get(k) as { n: number }).n;
    if (n >= TOC_DO.moiNguon) return false;
    db.prepare('INSERT INTO nguon_gui (khoa, luc) VALUES (?, ?)').run(k, bayGio);
    return true;
  }).immediate();
}
export const xoaBoDemNguon = (db: Csdl) => { db.prepare('DELETE FROM nguon_gui').run(); };

export function choPhepToanSite(db: Csdl, bayGio = Date.now()): boolean {
  const n = (db.prepare('SELECT COUNT(*) n FROM bao_loi WHERE tao_luc > ?').get(bayGio - TOC_DO.cuaSoSite) as { n: number }).n;
  return n < TOC_DO.toanSite;
}

export function luuBaoLoi(db: Csdl, v: BaoLoi, nguoiDungId: number | null, bayGio = Date.now()): number {
  return Number(db.prepare('INSERT INTO bao_loi (tao_luc, mo_ta, ma_don, goi, thiet_bi, gio_khach, tinh_huong, nguoi_dung_id, lien_he_tra_loi) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(bayGio, v.moTa, v.maDon, v.goi, v.thietBi, v.gioKhach, v.tinhHuong, nguoiDungId, v.lienHe).lastInsertRowid);
}
