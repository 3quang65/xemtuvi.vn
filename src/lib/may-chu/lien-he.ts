// Thu liên hệ (email / số Zalo) có đồng ý rõ ràng. Không gửi gì ra ngoài ở bước này.
import { randomBytes } from 'node:crypto';
import type { Csdl } from './csdl';

/** Phiên bản câu chữ hai ô đồng ý (khớp LienHe.tsx); đổi câu chữ thì tăng số. */
export const BAN_CHU_LIEN_HE = 'lap-la-so-v2';
export type LoaiLienHe = 'email' | 'zalo';
export const KHOA_NGUON = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'trang', 'ref'] as const;

const RE_EMAIL = /^[^\s@]{1,64}@[^\s@.]+(\.[^\s@.]+)+$/;
const RE_DT = /^(?:0|\+?84)([35789]\d{8})$/;

/** Chuẩn hóa; trả null nếu không hợp lệ. Email về chữ thường; số về dạng 0xxxxxxxxx. */
export function chuanHoa(loai: unknown, giaTri: unknown): { loai: LoaiLienHe; giaTri: string } | null {
  if (typeof giaTri !== 'string') return null;
  const s = giaTri.trim();
  if (loai === 'email') return s.length <= 120 && RE_EMAIL.test(s) ? { loai, giaTri: s.toLowerCase() } : null;
  if (loai === 'zalo') {
    const m = RE_DT.exec(s.replace(/[\s.\-]/g, ''));
    return m ? { loai, giaTri: '0' + m[1] } : null;
  }
  return null;
}

/** Giữ đúng các khóa nguồn đã biết, giá trị chuỗi ngắn, ký tự thường gặp trong UTM; bỏ phần còn lại. */
export function lamSachNguon(v: unknown): Record<string, string> {
  const ra: Record<string, string> = {};
  if (!v || typeof v !== 'object' || Array.isArray(v)) return ra;
  for (const k of KHOA_NGUON) {
    const x = (v as Record<string, unknown>)[k];
    if (typeof x === 'string' && x.length > 0 && x.length <= 100 && /^[\w.\-:/+%~ ]+$/.test(x)) ra[k] = x;
  }
  return ra;
}

/** Lưu khi đã đồng ý (dongY phải đúng true). Trả mã hủy; cùng liên hệ gửi lại thì giữ mã cũ, và đăng ký lại nếu từng hủy. */
export function luuLienHe(db: Csdl, o: { loai: LoaiLienHe; giaTri: string; nguon: Record<string, string>; nguoiDungId?: number | null; bayGio?: number }): { maHuy: string } {
  const luc = o.bayGio ?? Date.now();
  const cu = db.prepare('SELECT ma_huy, huy_luc FROM lien_he WHERE loai=? AND gia_tri=?').get(o.loai, o.giaTri) as { ma_huy: string; huy_luc: number | null } | undefined;
  if (cu) {
    if (cu.huy_luc !== null) db.prepare('UPDATE lien_he SET huy_luc=NULL, dong_y_luc=?, nguon=?, ban_chu=?, nguoi_dung_id=COALESCE(?, nguoi_dung_id) WHERE ma_huy=?').run(luc, JSON.stringify(o.nguon), BAN_CHU_LIEN_HE, o.nguoiDungId ?? null, cu.ma_huy);
    return { maHuy: cu.ma_huy };
  }
  const maHuy = randomBytes(18).toString('base64url');
  db.prepare('INSERT INTO lien_he (loai, gia_tri, ma_huy, dong_y_luc, nguon, ban_chu, nguoi_dung_id) VALUES (?,?,?,?,?,?,?)').run(o.loai, o.giaTri, maHuy, luc, JSON.stringify(o.nguon), BAN_CHU_LIEN_HE, o.nguoiDungId ?? null);
  return { maHuy };
}

/** Hủy theo mã trong đường dẫn hủy. Gọi lại nhiều lần vẫn trả true nếu mã đúng; mã sai trả false. */
export function huyLienHe(db: Csdl, maHuy: string, bayGio = Date.now()): boolean {
  if (!/^[\w-]{20,40}$/.test(maHuy)) return false;
  const r = db.prepare('UPDATE lien_he SET huy_luc=COALESCE(huy_luc, ?) WHERE ma_huy=?').run(bayGio, maHuy);
  return r.changes > 0;
}
