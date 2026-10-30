// Mã khôi phục cho đăng nhập thử (thay email OTP khi chưa có dịch vụ thư): sinh, băm scrypt có muối, so khớp, giới hạn lần sai.
import { createHash, randomBytes, randomInt, scryptSync, timingSafeEqual } from 'node:crypto';
import type { Csdl } from './csdl';

// 31 ký tự: bỏ 0, O, 1, I, L cho khó đọc nhầm. 31^10 ≈ 8×10^14.
const BANG = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const DO_DAI_MA = 10;
export const TOI_DA_SAI = 5;
export const CUA_SO_SAI = 15 * 60_000;

export function sinhMa(): string {
  let s = '';
  for (let i = 0; i < DO_DAI_MA; i++) s += BANG[randomInt(BANG.length)];
  return s;
}
/** Cho phép khách gõ chữ thường, có dấu cách hoặc gạch ngang. */
export const chuanHoaMa = (v: unknown) => (typeof v === 'string' ? v.toUpperCase().replace(/[\s-]/g, '') : '');

export function bamMa(ma: string): string {
  const muoi = randomBytes(16);
  return `${muoi.toString('hex')}$${scryptSync(ma, muoi, 32).toString('hex')}`;
}
export function kiemMaKhoiPhuc(ma: string, luu: string | null): boolean {
  const [m, h] = (luu ?? '').split('$');
  if (!m || !h) return false;
  const a = scryptSync(ma, Buffer.from(m, 'hex'), 32), b = Buffer.from(h, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

const khoaIp = (ip: string) => 'i:' + createHash('sha256').update(ip).digest('hex').slice(0, 16);
const khoaEmail = (e: string) => 'e:' + e;

/** Đã đủ 5 lần sai trong 15 phút theo email hoặc theo địa chỉ chưa? */
export function biChan(db: Csdl, email: string, ip: string, bayGio = Date.now()): boolean {
  const n = (k: string) => (db.prepare('SELECT COUNT(*) n FROM dang_nhap_sai WHERE khoa=? AND luc>?').get(k, bayGio - CUA_SO_SAI) as { n: number }).n;
  return n(khoaEmail(email)) >= TOI_DA_SAI || n(khoaIp(ip)) >= TOI_DA_SAI;
}
export function ghiSai(db: Csdl, email: string, ip: string, bayGio = Date.now()) {
  db.prepare('DELETE FROM dang_nhap_sai WHERE luc<=?').run(bayGio - CUA_SO_SAI);
  const them = db.prepare('INSERT INTO dang_nhap_sai (khoa, luc) VALUES (?,?)');
  them.run(khoaEmail(email), bayGio); them.run(khoaIp(ip), bayGio);
}
export const xoaSaiCuaEmail = (db: Csdl, email: string) => { db.prepare('DELETE FROM dang_nhap_sai WHERE khoa=?').run(khoaEmail(email)); };
