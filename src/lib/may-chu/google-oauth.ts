// Đăng nhập Google (OAuth 2.0 mã ủy quyền + PKCE S256 + state + nonce). Không thư viện ngoài; gọi Google qua `fetch` truyền vào để test.
// Client ID/Secret: biến môi trường hoặc ~/xemtuvi-data/.env (ngoài repo). Không bao giờ ghi/in.
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { thuMucDuLieu } from './ma-hoa';

export const TEN_COOKIE_OAUTH = 'xtv_oauth';
export const HAN_OAUTH_GIAY = 600; // Khách có 10 phút để xong màn Google
const URL_XAC_THUC = 'https://accounts.google.com/o/oauth2/v2/auth';
const URL_DOI_MA = 'https://oauth2.googleapis.com/token';
const ISS = ['https://accounts.google.com', 'accounts.google.com'];

export interface CauHinhGoogle { clientId: string; clientSecret: string }
export type Fetch = (url: string, init?: RequestInit) => Promise<Response>;
export class LoiGoogle extends Error { constructor(public ma: string, thongDiep: string) { super(thongDiep); } }

function docEnv(ten: string): string {
  const e = process.env[ten]?.trim();
  if (e) return e;
  const tep = path.join(thuMucDuLieu(), '.env');
  if (existsSync(tep)) {
    for (const dong of readFileSync(tep, 'utf8').split(/\r?\n/)) {
      const m = new RegExp(`^\\s*${ten}\\s*=\\s*(.*?)\\s*$`).exec(dong);
      if (m) return m[1].replace(/^["']|["']$/g, '');
    }
  }
  return '';
}

/** null = chưa cấu hình → nút Google ẩn, các đường dẫn trả 404. */
export function cauHinhGoogle(): CauHinhGoogle | null {
  const clientId = docEnv('GOOGLE_CLIENT_ID'), clientSecret = docEnv('GOOGLE_CLIENT_SECRET');
  return clientId && clientSecret ? { clientId, clientSecret } : null;
}

const b64u = (b: Buffer) => b.toString('base64url');
export const ngauNhien = (n = 32) => b64u(randomBytes(n));
export const thuThachPkce = (verifier: string) => b64u(createHash('sha256').update(verifier).digest());

export function soSanhAnToan(a: string, b: string): boolean {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && x.length > 0 && timingSafeEqual(x, y);
}

/** Chỉ nhận đường dẫn nội bộ ("/abc?x=1"); mọi thứ khác (//evil, http://, \) về "/". Chống chuyển hướng ra ngoài. */
export function veAnToan(v: unknown): string {
  if (typeof v !== 'string' || v.length > 300 || !/^\/(?![/\\])[^\r\n\\]*$/.test(v)) return '/';
  return v;
}

export interface PhienOauth { state: string; verifier: string; nonce: string; ve: string }

export function batDau(cfg: CauHinhGoogle, redirectUri: string, ve: unknown): { url: string; cookie: string } {
  const p: PhienOauth = { state: ngauNhien(), verifier: ngauNhien(48), nonce: ngauNhien(), ve: veAnToan(ve) };
  const q = new URLSearchParams({
    client_id: cfg.clientId, redirect_uri: redirectUri, response_type: 'code', scope: 'openid email profile',
    state: p.state, nonce: p.nonce, code_challenge: thuThachPkce(p.verifier), code_challenge_method: 'S256',
    prompt: 'select_account', access_type: 'online',
  });
  const gt = Buffer.from(JSON.stringify(p)).toString('base64url');
  return { url: `${URL_XAC_THUC}?${q}`, cookie: `${TEN_COOKIE_OAUTH}=${gt}; Path=/api/dang-nhap/google; HttpOnly; Secure; SameSite=Lax; Max-Age=${HAN_OAUTH_GIAY}` };
}
export const cookieOauthXoa = () => `${TEN_COOKIE_OAUTH}=; Path=/api/dang-nhap/google; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

export function docPhienOauth(giaTri: string | null): PhienOauth | null {
  if (!giaTri) return null;
  try {
    const p = JSON.parse(Buffer.from(giaTri, 'base64url').toString('utf8'));
    return [p?.state, p?.verifier, p?.nonce, p?.ve].every((x) => typeof x === 'string') && p.state && p.verifier && p.nonce ? p : null;
  } catch { return null; }
}

export interface HoSoGoogle { sub: string; email: string }

/** Giải phần claims của id_token. Chữ ký không cần kiểm lại: token lấy trực tiếp từ Google qua TLS ở bước đổi mã (OpenID Connect Core 3.1.3.7). */
function claims(idToken: unknown): Record<string, unknown> {
  const ph = typeof idToken === 'string' ? idToken.split('.') : [];
  if (ph.length !== 3) throw new LoiGoogle('token_sai', 'Google trả dữ liệu không hợp lệ.');
  try { return JSON.parse(Buffer.from(ph[1], 'base64url').toString('utf8')); } catch { throw new LoiGoogle('token_sai', 'Google trả dữ liệu không hợp lệ.'); }
}

/** Kiểm các điều kiện bắt buộc: đúng bên phát hành, đúng ứng dụng, còn hạn, đúng nonce, email ĐÃ được Google xác minh. */
export function kiemClaims(c: Record<string, unknown>, cfg: CauHinhGoogle, nonce: string, bayGio = Date.now()): HoSoGoogle {
  if (typeof c.iss !== 'string' || !ISS.includes(c.iss)) throw new LoiGoogle('token_sai', 'Google trả dữ liệu không hợp lệ.');
  const aud = Array.isArray(c.aud) ? c.aud : [c.aud];
  if (!aud.includes(cfg.clientId) || (c.azp !== undefined && c.azp !== cfg.clientId)) throw new LoiGoogle('token_sai', 'Google trả dữ liệu không hợp lệ.');
  if (typeof c.exp !== 'number' || c.exp * 1000 <= bayGio) throw new LoiGoogle('token_het_han', 'Phiên đăng nhập Google đã hết hạn, thử lại nhé.');
  if (typeof c.nonce !== 'string' || !soSanhAnToan(c.nonce, nonce)) throw new LoiGoogle('nonce_sai', 'Phiên đăng nhập không khớp, thử lại nhé.');
  if (typeof c.sub !== 'string' || !c.sub || typeof c.email !== 'string' || !c.email.includes('@')) throw new LoiGoogle('thieu_email', 'Tài khoản Google không cung cấp email.');
  if (c.email_verified !== true) throw new LoiGoogle('email_chua_xac_minh', 'Email Google này chưa được xác minh.');
  return { sub: c.sub, email: c.email.trim().toLowerCase() };
}

/** Đổi mã lấy token (gửi kèm code_verifier + client_secret) rồi kiểm claims. */
export async function doiMa(cfg: CauHinhGoogle, redirectUri: string, code: string, p: PhienOauth, f: Fetch = fetch, bayGio = Date.now()): Promise<HoSoGoogle> {
  const r = await f(URL_DOI_MA, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, signal: AbortSignal.timeout(10_000),
    body: new URLSearchParams({ code, client_id: cfg.clientId, client_secret: cfg.clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code', code_verifier: p.verifier }),
  });
  if (!r.ok) throw new LoiGoogle('doi_ma_that_bai', 'Google từ chối mã đăng nhập, thử lại nhé.');
  const d = await r.json().catch(() => null) as { id_token?: unknown } | null;
  return kiemClaims(claims(d?.id_token), cfg, p.nonce, bayGio);
}

