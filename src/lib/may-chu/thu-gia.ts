// Thử nghiệm giá (kinh-doanh/thu-gia_v1.md). Mặc định TẮT. Bật/tắt và giá nhánh nằm trong tệp cấu hình, đổi không cần sửa code.
// Nhánh theo thiết bị: cookie xtv_nhanh = "<thử>.<goc|thu>", chia 50/50 lần đầu. Máy chủ tự tính nhánh và giá, không tin trình duyệt.
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import type { BangGia } from '../goi';
import { MA_GOI } from '../goi-ma.js';
import { docCookie } from './phien';

export const TEN_COOKIE_NHANH = 'xtv_nhanh';
export type Nhanh = 'goc' | 'thu';
export interface CauHinhThuGia { thu: string; bang: BangGia } // thu = mã thử nghiệm ('a', 'b'); bang = giá nhánh "thu"
export interface NhanhYeuCau { nhanh: Nhanh; thu: string; setCookie?: string }

const MAU_THU = /^[a-z0-9-]{1,20}$/;

/** Đọc cấu hình từ nội dung JSON. Trả null (= tắt) nếu tắt hoặc có điều gì sai: sai thì không bật, không đoán. */
export function chuanCauHinh(v: unknown): CauHinhThuGia | null {
  if (!v || typeof v !== 'object') return null;
  const c = v as { bat?: unknown; thu?: unknown; thuNghiem?: unknown };
  if (c.bat !== true || typeof c.thu !== 'string' || !MAU_THU.test(c.thu)) return null;
  const tn = c.thuNghiem && typeof c.thuNghiem === 'object' ? (c.thuNghiem as Record<string, unknown>)[c.thu] : null;
  if (!tn || typeof tn !== 'object') return null;
  const bang: BangGia = {};
  for (const [ma, gia] of Object.entries(tn)) {
    if (!(MA_GOI as readonly string[]).includes(ma) || typeof gia !== 'number' || !Number.isInteger(gia) || gia <= 0) return null;
    bang[ma as keyof BangGia] = gia;
  }
  return Object.keys(bang).length ? { thu: c.thu, bang } : null;
}

/** Xóa bộ nhớ đệm cấu hình (dùng trong test khi đổi tệp). */
export const xoaNhoCauHinh = () => { nho = null; };
let nho: { luc: number; cfg: CauHinhThuGia | null } | null = null;
/** Cấu hình hiện tại (đọc lại tệp sau tối đa 5 giây). Tệp: THU_GIA_FILE hoặc ~/xemtuvi-data/thu-gia.json. */
export function cauHinhThuGia(): CauHinhThuGia | null {
  const bay = Date.now();
  if (nho && bay - nho.luc < 5000) return nho.cfg;
  let cfg: CauHinhThuGia | null = null;
  try { cfg = chuanCauHinh(JSON.parse(readFileSync(process.env.THU_GIA_FILE || path.join(homedir(), 'xemtuvi-data', 'thu-gia.json'), 'utf8'))); } catch { /* không có tệp = tắt */ }
  nho = { luc: bay, cfg };
  return cfg;
}

/** Nhánh đã gán cho thiết bị (cookie), không tạo mới. Tắt, chưa gán, hoặc cookie của thử nghiệm khác thì null. */
export function nhanhDaGan(req: Request, cfg: CauHinhThuGia | null = cauHinhThuGia()): { nhanh: Nhanh; thu: string } | null {
  if (!cfg) return null;
  const [thu, nhanh] = (docCookie(req, TEN_COOKIE_NHANH) ?? '').split('.');
  return thu === cfg.thu && (nhanh === 'goc' || nhanh === 'thu') ? { nhanh, thu } : null;
}

/** Nhánh của thiết bị này cho màn giá. Chưa gán thì chia 50/50 và trả setCookie. Tắt thì null. */
export function nhanhCuaYeuCau(req: Request, cfg: CauHinhThuGia | null = cauHinhThuGia(), ngauNhien: () => number = Math.random): NhanhYeuCau | null {
  if (!cfg) return null;
  const co = nhanhDaGan(req, cfg);
  if (co) return co;
  const moi: Nhanh = ngauNhien() < 0.5 ? 'goc' : 'thu';
  return { nhanh: moi, thu: cfg.thu, setCookie: `${TEN_COOKIE_NHANH}=${cfg.thu}.${moi}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${180 * 86400}` };
}

/** Bảng giá áp cho đơn/sự kiện: nhánh "thu" thì bảng giá thử, còn lại (kể cả tắt, chưa gán) undefined = giá hiện hành. */
export function bangGiaCuaYeuCau(req: Request, cfg: CauHinhThuGia | null = cauHinhThuGia()): BangGia | undefined {
  const n = nhanhDaGan(req, cfg);
  return n && n.nhanh === 'thu' && cfg ? cfg.bang : undefined;
}
