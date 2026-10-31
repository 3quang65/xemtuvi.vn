// Trạng thái phía trình duyệt: thông tin sinh (sessionStorage, không lên URL/máy chủ),
// mã phiên đo lường. Tài khoản, đơn, quyền xem nằm trên máy chủ (src/lib/may-chu).
import { lapLaSo, type LaSo, type ThongTinSinh } from '@/lib/tuvi';

const K_SINH = 'xtv.sinh';
const K_PHIEN = 'xtv.phien';
const K_NGUON = 'xtv.nguon';
const K_VAO = 'xtv.vao-trang';
const K_Y_DINH = 'xtv.y-dinh';
const K_NAM_GOI_Y = 'xtv.nam-goi-y';
const K_MA_MOI = 'xtv.ma-moi';

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

/** Năm sinh từ công cụ /sinh-con-2027, chỉ trong tab này (không lên URL/máy chủ); form lập lá số lấy một lần để điền sẵn ô năm. */
export const luuNamGoiY = (n: number) => ghi('session', K_NAM_GOI_Y, n);
export function layNamGoiY(): number | null {
  const n = doc<number>('session', K_NAM_GOI_Y);
  try { kho('session')?.removeItem(K_NAM_GOI_Y); } catch { /* bỏ qua */ }
  return typeof n === 'number' ? n : null;
}

/** Ý định từ trang đích (ví dụ 'van-nam-2027'): màn chọn gói đưa khu đó lên đầu. */
export const luuYDinh = (v: string) => ghi('session', K_Y_DINH, v);
export const docYDinh = () => doc<string>('session', K_Y_DINH);

export type NhaCungCap = 'google' | 'zalo';

function maNgauNhien(doDai: number): string {
  const b = new Uint8Array(Math.ceil(doDai / 2));
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('').slice(0, doDai);
}

export function maPhien(): string {
  const cu = kho('session')?.getItem(K_PHIEN);
  if (cu) return cu;
  const moi = maNgauNhien(24);
  try { kho('session')?.setItem(K_PHIEN, moi); } catch { /* bỏ qua */ }
  return moi;
}

let nhanhHienTai: 'goc' | 'thu' | null = null;
/** Nhánh thử giá của thiết bị (từ /api/gia). Chỉ để gắn vào sự kiện; máy chủ vẫn tự tính nhánh từ cookie. */
export const datNhanh = (n: 'goc' | 'thu' | null) => { nhanhHienTai = n; };

/** Gửi sự kiện đo phễu. Không bao giờ làm hỏng giao diện. */
export function guiSuKien(ten: string, tuyChon?: { goi?: string; chuDe?: string; nguon?: Record<string, string>; truong?: Record<string, string | number | boolean> }) {
  try {
    const body = new Blob([JSON.stringify({ ten, phien: maPhien(), ...(tuyChon?.goi ? { goi: tuyChon.goi } : {}), ...(tuyChon?.chuDe ? { chuDe: tuyChon.chuDe } : {}), ...(tuyChon?.goi && nhanhHienTai ? { nhanh: nhanhHienTai } : {}), ...tuyChon?.nguon, ...tuyChon?.truong })], { type: 'application/json' });
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
/** Chuẩn hóa giá trị UTM theo quy ước (chữ thường, không dấu, '-' thay khoảng trắng); null nếu còn ký tự lạ. */
function chuanUtm(v: string | null): string | null {
  const x = (v ?? '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/\s+/g, '-').slice(0, 50);
  return /^[a-z0-9][a-z0-9._-]*$/.test(x) ? x : null;
}

/** Ghi `vao_trang` đúng 1 lần cho mỗi phiên (tab), ở trang đầu tiên. Nguồn lưu một lần; các sự kiện sau gắn vào phiên ở máy chủ/báo cáo. */
export function ghiVaoTrang() {
  if (typeof window === 'undefined' || kho('session')?.getItem(K_VAO)) return;
  try { kho('session')?.setItem(K_VAO, '1'); } catch { return; } // không lưu được thì không gửi, tránh lặp mỗi trang
  ghiNguon();
  const q = new URLSearchParams(window.location.search);
  const nguon: Record<string, string> = {};
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) { const v = chuanUtm(q.get(k)); if (v) nguon[k] = v; }
  try { const h = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : ''; if (h) nguon.ref = h; } catch { /* bỏ qua */ }
  const p = window.location.pathname.toLowerCase();
  nguon.dich = /^\/moi(\/|$)/.test(p) ? '/moi' : p.replace(/\/+$/, '').split('/').slice(0, 3).join('/') || '/'; // mã mời là thông tin riêng: chỉ giữ '/moi'
  nguon.may = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'dien-thoai' : 'may-tinh';
  guiSuKien('vao_trang', { nguon });
}

export const docNguon = () => doc<Record<string, string>>('session', K_NGUON) ?? {};

/** Mã mời của khách (từ /moi/<ma>), chỉ trong tab này. Máy chủ vẫn kiểm lại mỗi lần dùng. */
export const luuMaMoi = (v: string) => ghi('session', K_MA_MOI, v);
export const docMaMoi = () => doc<string>('session', K_MA_MOI);
