// Nguồn khách lần vào đầu (first-touch): cookie xtv_nguon 30 ngày, đặt ở middleware; sự kiện phễu đọc lại để gắn trường `nguon`.
// Chỉ utm_* và ref (tên máy chủ giới thiệu). Không IP, không user-agent. Tệp thuần, chạy được cả ở middleware (edge).
export const TEN_COOKIE_NGUON = 'xtv_nguon';
export const NGAY_NGUON = 30;
const TRUONG = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ref'] as const;

/** Chữ thường, chỉ giữ chữ-số và - _ . , cắt ≤ 64 ký tự; rỗng thì null. */
const lam = (v: unknown): string | null => {
  const x = typeof v === 'string' ? v.toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 64) : '';
  return x || null;
};

export type NguonKhach = Partial<Record<(typeof TRUONG)[number], string>>;

/** Lấy utm_* từ query và ref từ tên máy chủ trang giới thiệu (bỏ qua chính site). Rỗng nếu khách vào thẳng. */
export function nguonTuYeuCau(query: URLSearchParams, referer: string | null, host: string): NguonKhach {
  const ra: NguonKhach = {};
  for (const k of TRUONG) { if (k === 'ref') continue; const v = lam(query.get(k)); if (v) ra[k] = v; }
  try {
    const h = referer ? new URL(referer).hostname.toLowerCase() : '';
    if (h && h !== host.split(':')[0].toLowerCase()) { const v = lam(h); if (v) ra.ref = v; }
  } catch { /* Referer hỏng: bỏ qua */ }
  return ra;
}

export const moHoaNguon = (n: NguonKhach) => new URLSearchParams(Object.entries(n) as [string, string][]).toString();

/** Giải mã cookie, làm sạch lại từng trường (không tin cookie). */
export function giaiMaNguon(cookie: string | null | undefined): NguonKhach {
  const ra: NguonKhach = {};
  if (!cookie) return ra;
  const q = new URLSearchParams(cookie.slice(0, 512));
  for (const k of TRUONG) { const v = lam(q.get(k)); if (v) ra[k] = v; }
  return ra;
}

export const cookieNguon = (n: NguonKhach) => `${TEN_COOKIE_NGUON}=${moHoaNguon(n)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${NGAY_NGUON * 86400}`;
