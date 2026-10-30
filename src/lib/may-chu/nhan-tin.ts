// Đăng ký nhận tin Vận 2027 (bảng nhan_tin_van_nam). Chưa gửi thư nào ở bước này.
import { randomBytes } from 'node:crypto';
import type { Csdl } from './csdl';

/** Phiên bản câu chữ ô đồng ý (khớp NhanTinVanNam.tsx); đổi câu chữ thì tăng số. */
export const BAN_CHU_DONG_Y = 'van-nam-2027-v1';

/** Lưu khi đã đồng ý. Trả mã hủy; cùng email gửi lại thì giữ mã cũ, và đăng ký lại nếu từng hủy. */
export function luuNhanTin(db: Csdl, o: { email: string; nguon: Record<string, string>; bayGio?: number }): { maHuy: string } {
  const luc = o.bayGio ?? Date.now();
  const cu = db.prepare('SELECT ma_huy, huy_luc FROM nhan_tin_van_nam WHERE email=?').get(o.email) as { ma_huy: string; huy_luc: number | null } | undefined;
  if (cu) {
    if (cu.huy_luc !== null) db.prepare('UPDATE nhan_tin_van_nam SET huy_luc=NULL, dong_y_luc=?, nguon=?, ban_chu=? WHERE ma_huy=?').run(luc, JSON.stringify(o.nguon), BAN_CHU_DONG_Y, cu.ma_huy);
    return { maHuy: cu.ma_huy };
  }
  const maHuy = randomBytes(18).toString('base64url');
  db.prepare('INSERT INTO nhan_tin_van_nam (email, ma_huy, dong_y_luc, nguon, ban_chu) VALUES (?,?,?,?,?)').run(o.email, maHuy, luc, JSON.stringify(o.nguon), BAN_CHU_DONG_Y);
  return { maHuy };
}

/** Hủy theo mã. Gọi lại nhiều lần vẫn trả true nếu mã đúng; mã sai trả false. */
export function huyNhanTin(db: Csdl, maHuy: string, bayGio = Date.now()): boolean {
  if (!/^[\w-]{20,40}$/.test(maHuy)) return false;
  return db.prepare('UPDATE nhan_tin_van_nam SET huy_luc=COALESCE(huy_luc, ?) WHERE ma_huy=?').run(bayGio, maHuy).changes > 0;
}
