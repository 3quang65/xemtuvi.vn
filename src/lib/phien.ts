// Trạng thái phía trình duyệt: thông tin sinh (sessionStorage, không lên URL/máy chủ),
// mã phiên đo lường. Tài khoản, đơn, quyền xem nằm trên máy chủ (src/lib/may-chu).
import { lapLaSo, type LaSo, type ThongTinSinh } from '@/lib/tuvi';

const K_SINH = 'xtv.sinh';
const K_PHIEN = 'xtv.phien';
const K_NGUON = 'xtv.nguon';

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

/** Nhớ nguồn truy cập (UTM, trang đầu, nơi giới thiệu) ở lần vào đầu tiên của tab; chỉ dùng khi khách để lại liên hệ. */
export function ghiNguon() {
  if (typeof window === 'undefined' || kho('session')?.getItem(K_NGUON)) return;
  const q = new URLSearchParams(window.location.search);
  const nguon: Record<string, string> = { trang: window.location.pathname };
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) { const v = q.get(k); if (v) nguon[k] = v.slice(0, 100); }
  try { if (document.referrer) nguon.ref = new URL(document.referrer).hostname; } catch { /* bỏ qua */ }
  ghi('session', K_NGUON, nguon);
}
export const docNguon = () => doc<Record<string, string>>('session', K_NGUON) ?? {};
