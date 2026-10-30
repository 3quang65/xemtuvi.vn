// Trạng thái phía trình duyệt: thông tin sinh (sessionStorage, không lên URL/máy chủ),
// mã phiên đo lường, tài khoản thử và gói đã mở (localStorage, bản thử).
import { lapLaSo, type LaSo, type ThongTinSinh } from '@/lib/tuvi';

const K_SINH = 'xtv.sinh';
const K_PHIEN = 'xtv.phien';
const K_TK = 'xtv.taikhoan-thu';
const K_GOI = 'xtv.goi-da-mo';

const kho = (loai: 'session' | 'local') => (typeof window === 'undefined' ? null : loai === 'session' ? window.sessionStorage : window.localStorage);

function doc<T>(loai: 'session' | 'local', khoa: string): T | null {
  try { const s = kho(loai)?.getItem(khoa); return s ? (JSON.parse(s) as T) : null; } catch { return null; }
}
function ghi(loai: 'session' | 'local', khoa: string, v: unknown) {
  try { kho(loai)?.setItem(khoa, JSON.stringify(v)); } catch { /* trình duyệt chặn lưu: bỏ qua */ }
}

export const luuThongTinSinh = (t: ThongTinSinh) => ghi('session', K_SINH, t);
export const docThongTinSinh = () => doc<ThongTinSinh>('session', K_SINH);

/** Lập lại lá số từ thông tin đã lưu; null nếu chưa có hoặc không lập được. */
export function laSoDaLuu(): LaSo | null {
  const t = docThongTinSinh();
  if (!t) return null;
  try { return lapLaSo(t); } catch { return null; }
}

export type NhaCungCap = 'google' | 'zalo';
export interface TaiKhoanThu { nhaCungCap: NhaCungCap; id: string; thu: true }
export const docTaiKhoanThu = () => doc<TaiKhoanThu>('local', K_TK);
export function taoTaiKhoanThu(nhaCungCap: NhaCungCap): TaiKhoanThu {
  const tk: TaiKhoanThu = { nhaCungCap, id: 'thu-' + maNgauNhien(8), thu: true };
  ghi('local', K_TK, tk);
  return tk;
}
export const docGoiDaMo = () => doc<{ ma: string; chuDe?: string; luc: number }>('local', K_GOI);
export const luuGoiDaMo = (ma: string, chuDe?: string) => ghi('local', K_GOI, { ma, ...(chuDe ? { chuDe } : {}), luc: Date.now() });

function maNgauNhien(doDai: number): string {
  const b = new Uint8Array(Math.ceil(doDai / 2));
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('').slice(0, doDai);
}

function maPhien(): string {
  const cu = kho('session')?.getItem(K_PHIEN);
  if (cu) return cu;
  const moi = maNgauNhien(24);
  try { kho('session')?.setItem(K_PHIEN, moi); } catch { /* bỏ qua */ }
  return moi;
}

/** Gửi sự kiện đo phễu. Không bao giờ làm hỏng giao diện. */
export function guiSuKien(ten: string, tuyChon?: { goi?: string; chuDe?: string }) {
  try {
    const body = new Blob([JSON.stringify({ ten, phien: maPhien(), ...(tuyChon?.goi ? { goi: tuyChon.goi } : {}), ...(tuyChon?.chuDe ? { chuDe: tuyChon.chuDe } : {}) })], { type: 'application/json' });
    if (!navigator.sendBeacon('/api/su-kien', body)) {
      void fetch('/api/su-kien', { method: 'POST', body, keepalive: true }).catch(() => {});
    }
  } catch { /* bỏ qua */ }
}
