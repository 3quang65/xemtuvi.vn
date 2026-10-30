// Phiên đăng nhập: mã ngẫu nhiên 32 byte trong cookie; CSDL chỉ lưu băm SHA-256.
import { createHash, randomBytes } from 'node:crypto';
import type { Csdl } from './csdl';

export const TEN_COOKIE = 'xtv_phien';
export const SO_NGAY_PHIEN = 90;
const NGAY = 86_400_000;

const bam = (ma: string) => createHash('sha256').update(ma).digest('hex');

export function taoPhien(db: Csdl, nguoiDungId: number, bayGio = Date.now()): string {
  const ma = randomBytes(32).toString('base64url');
  db.prepare('INSERT INTO phien (ma_bam, nguoi_dung_id, het_han) VALUES (?,?,?)').run(bam(ma), nguoiDungId, bayGio + SO_NGAY_PHIEN * NGAY);
  return ma;
}

/** Trả id người dùng nếu phiên còn hạn; phiên hết hạn bị xóa. */
export function docPhien(db: Csdl, ma: string | null | undefined, bayGio = Date.now()): number | null {
  if (!ma) return null;
  const d = db.prepare('SELECT nguoi_dung_id AS id, het_han AS h FROM phien WHERE ma_bam = ?').get(bam(ma)) as { id: number; h: number } | undefined;
  if (!d) return null;
  if (d.h <= bayGio) { xoaPhien(db, ma); return null; }
  return d.id;
}

export function xoaPhien(db: Csdl, ma: string | null | undefined) {
  if (ma) db.prepare('DELETE FROM phien WHERE ma_bam = ?').run(bam(ma));
}

export function docCookie(req: Request, ten = TEN_COOKIE): string | null {
  for (const p of (req.headers.get('cookie') ?? '').split(';')) {
    const i = p.indexOf('=');
    if (i > 0 && p.slice(0, i).trim() === ten) return decodeURIComponent(p.slice(i + 1).trim());
  }
  return null;
}

export const cookieDat = (ma: string) => `${TEN_COOKIE}=${ma}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SO_NGAY_PHIEN * 86400}`;
export const cookieXoa = () => `${TEN_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

/** POST chỉ nhận khi Origin trùng chính site (chặn trang khác giả mạo). Thiếu Origin → từ chối. */
export function cungNguon(req: Request): boolean {
  const o = req.headers.get('origin');
  if (!o) return false;
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  try { return !!host && new URL(o).host === host; } catch { return false; }
}
