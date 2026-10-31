// Xử lý HTTP cho các API (route.ts chỉ gọi vào đây). Nhận MayChu để test được bằng CSDL tạm.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { thuMucDuLieu } from './ma-hoa';
import { kiemTraThongTin, type ThongTinSinh } from '../tuvi';
import type { MayChu } from './csdl';
import * as dv from './dich-vu';
import { luanGiaiChoKhach } from './luan-giai-may-chu';
import { hoiLaSo, lichSuHoi } from './hoi-dap';
import { choPhepToanSite, choPhepTheoNguon, kiemTraBaoLoi, luuBaoLoi } from './bao-loi';
import { chuanHoa, huyLienHe, lamSachNguon, luuLienHe } from './lien-he';
import { huyNhanTin, luuNhanTin } from './nhan-tin';
import { trangCua } from '../su-kien';
import { ghiSuKien } from '../ghi-su-kien';
import { daDungMa, dungMa, chuDeMoi, kiemMa, nguonDaDung } from './ma-moi';
import { ghiLoi } from './nhat-ky';
import { bangGiaCuaYeuCau } from './thu-gia';
import { biChan, ghiSai, xoaSaiCuaEmail } from './ma-khoi-phuc';
import * as gg from './google-oauth';
import { cookieDat, cookieXoa, cungNguon, docCookie, docPhien, taoPhien, xoaPhien } from './phien';

const DAU = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, no-store' };
const json = (v: unknown, status = 200, them: Record<string, string> = {}) => new Response(JSON.stringify(v), { status, headers: { ...DAU, ...them } });
const loi = (status: number, ma: string, thongDiep: string) => json({ loi: ma, thongDiep }, status);

async function doc(req: Request): Promise<Record<string, unknown> | null> {
  const t = await req.text();
  if (t.length > 4096) return null;
  try { const v = JSON.parse(t); return v && typeof v === 'object' && !Array.isArray(v) ? v : null; } catch { return null; }
}

/** Gói chung cho mọi POST: kiểm Origin, bọc lỗi nghiệp vụ. */
async function chay(req: Request, f: () => Promise<Response> | Response): Promise<Response> {
  if (req.method === 'POST' && !cungNguon(req)) return loi(403, 'nguon_sai', 'Yêu cầu không đến từ chính trang này.');
  try { return await f(); } catch (e) {
    if (e instanceof dv.LoiNghiepVu) return loi(e.trangThai, e.ma, e.message);
    throw e;
  }
}

const PHIEN_DO = /^[A-Za-z0-9_-]{16,32}$/;
const nguoiDung = (req: Request, m: MayChu) => docPhien(m.db, docCookie(req));
const canDangNhap = () => loi(401, 'chua_dang_nhap', 'Cần đăng nhập.');

/** Danh sách email được đăng nhập thử: biến EMAIL_THU_CHO_PHEP (phân cách bằng dấu phẩy) hoặc tệp ~/xemtuvi-data/email-thu.txt (mỗi dòng một email). Mục bắt đầu bằng @ cho cả tên miền. Rỗng = không ai được vào. Không nằm trong repo. */
function emailDuocThu(email: string): boolean {
  let ds = process.env.EMAIL_THU_CHO_PHEP || '';
  if (!ds) { try { ds = readFileSync(process.env.EMAIL_THU_FILE || path.join(thuMucDuLieu(), 'email-thu.txt'), 'utf8'); } catch { /* không có tệp = rỗng */ } }
  const e = email.trim().toLowerCase();
  return ds.split(/[,\s]+/).map((x) => x.trim().toLowerCase()).filter(Boolean).some((x) => (x.startsWith('@') ? e.endsWith(x) && e.indexOf('@') === e.length - x.length : e === x));
}

import { giaiMaNguon, TEN_COOKIE_NGUON } from '@/lib/nguon-khach';
const nguonKhachCuaYeuCau = (req: Request) => { const n = giaiMaNguon(docCookie(req, TEN_COOKIE_NGUON)); return Object.keys(n).length ? { nguon: n } : {}; };

export const dangNhap = (req: Request, m: MayChu) => chay(req, async () => {
  if (process.env.DANG_NHAP_THU !== '1') return loi(404, 'tat', 'Đăng nhập thử đang tắt.');
  const b = await doc(req);
  if (!b || typeof b.email !== 'string') return loi(400, 'du_lieu_sai', 'Thiếu email.');
  if (!emailDuocThu(b.email)) return loi(403, 'dang_thu_nghiem', 'Tính năng đang thử nghiệm, chưa mở cho email này.');
  const ip = nguonGui(req), e = b.email.trim().toLowerCase();
  const vao = (id: number, them: Record<string, unknown> = {}) => json({ ok: true, ...them }, 200, { 'Set-Cookie': cookieDat(taoPhien(m.db, id)) });
  if (!dv.coNguoiDung(m.db, e)) {
    if (biChan(m.db, e, ip)) return loi(429, 'sai_nhieu', 'Bạn thử nhiều lần chưa đúng. Chờ 15 phút rồi thử lại nhé.');
    const { id, maKhoiPhuc } = dv.taoTaiKhoanThu(m.db, e);
    return vao(id, { moi: true, maKhoiPhuc });
  }
  if (biChan(m.db, e, ip)) return loi(429, 'sai_nhieu', 'Bạn thử nhiều lần chưa đúng. Chờ 15 phút rồi thử lại nhé.');
  const kq = dv.kiemDangNhapThu(m.db, e, b.maKhoiPhuc);
  if (typeof kq === 'number') { xoaSaiCuaEmail(m.db, e); return vao(kq, { moi: false }); }
  if (kq === 'chua_co_ma') return loi(401, 'chua_co_ma', 'Tài khoản thử này chưa có mã khôi phục. Vui lòng liên hệ hỗ trợ.');
  ghiSai(m.db, e, ip);
  return loi(401, 'sai_thong_tin', 'Email hoặc mã khôi phục chưa đúng.');
});

/** GET /api/dang-nhap/cau-hinh: giao diện biết nên hiện nút nào. */
export const cauHinhDangNhap = () => json({ google: !!gg.cauHinhGoogle(), thu: process.env.DANG_NHAP_THU === '1' });

function redirectUri(req: Request): string {
  const goc = process.env.GOOGLE_REDIRECT_URI?.trim();
  if (goc) return goc;
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '';
  return `https://${host}/api/dang-nhap/google/callback`;
}
const chuyen = (url: string, cookie: string) => new Response(null, { status: 302, headers: { Location: url, 'Set-Cookie': cookie, 'Cache-Control': 'private, no-store' } });

/** GET /api/dang-nhap/google?ve=/duong-dan: sinh state + PKCE + nonce (cookie HttpOnly 10 phút) rồi chuyển sang Google. */
export function googleBatDau(req: Request) {
  const cfg = gg.cauHinhGoogle();
  if (!cfg) return loi(404, 'tat', 'Đăng nhập Google chưa bật.');
  const { url, cookie } = gg.batDau(cfg, redirectUri(req), new URL(req.url).searchParams.get('ve'));
  return chuyen(url, cookie);
}

/** GET /api/dang-nhap/google/callback?code&state: kiểm state khớp cookie, đổi mã (PKCE), chỉ nhận email Google đã xác minh, rồi tạo phiên. */
export async function googleVe(req: Request, m: MayChu, f?: gg.Fetch): Promise<Response> {
  const cfg = gg.cauHinhGoogle();
  if (!cfg) return loi(404, 'tat', 'Đăng nhập Google chưa bật.');
  const q = new URL(req.url).searchParams;
  const p = gg.docPhienOauth(docCookie(req, gg.TEN_COOKIE_OAUTH));
  const quayLai = (ma: string) => chuyen(`/dang-nhap-loi?ma=${ma}`, gg.cookieOauthXoa()); // xóa cookie dù thành công hay thất bại: dùng một lần
  const state = q.get('state'), code = q.get('code');
  if (!p || !state || !gg.soSanhAnToan(state, p.state)) return quayLai('state_sai');
  if (q.get('error') || !code) return quayLai('huy');
  try {
    const hs = await gg.doiMa(cfg, redirectUri(req), code, p, f);
    const { id } = dv.dangNhapGoogle(m.db, hs.sub, hs.email);
    const ph = new Headers({ Location: gg.veAnToan(p.ve), 'Cache-Control': 'private, no-store' });
    ph.append('Set-Cookie', cookieDat(taoPhien(m.db, id)));
    ph.append('Set-Cookie', gg.cookieOauthXoa());
    return new Response(null, { status: 302, headers: ph });
  } catch (e) {
    if (e instanceof gg.LoiGoogle) return quayLai(e.ma);
    ghiLoi('loi', '/api/dang-nhap/google', 'google_that_bai', e instanceof Error ? e.message : 'không rõ');
    return quayLai('loi_may_chu');
  }
}

export const dangXuat = (req: Request, m: MayChu) => chay(req, () => {
  xoaPhien(m.db, docCookie(req));
  return json({ ok: true }, 200, { 'Set-Cookie': cookieXoa() });
});

export function toi(req: Request, m: MayChu) {
  const id = nguoiDung(req, m);
  if (!id) return json({ dangNhap: false });
  const nd = m.db.prepare('SELECT email FROM nguoi_dung WHERE id=?').get(id) as { email: string };
  // donGanNhat: đơn đã trả mới nhất, để thông báo E07 và biểu mẫu báo lỗi tự điền mã đơn.
  const don = m.db.prepare("SELECT id FROM don_hang WHERE nguoi_dung_id=? AND trang_thai='da_tra' ORDER BY id DESC LIMIT 1").get(id) as { id: number } | undefined;
  return json({ dangNhap: true, email: nd.email, quyen: dv.dsQuyen(m.db, id), laSoIds: dv.dsLaSo(m.db, m.khoa, id).map((l) => l.id), donGanNhat: don?.id ?? null, soLaSoThanhVien: dv.LA_SO_THANH_VIEN });
}

/** POST /api/toi/xoa {xacNhan:'XOA'}: xóa tài khoản đang đăng nhập và dữ liệu của nó; đơn hàng giữ ở dạng ẩn danh. */
export const toiXoa = (req: Request, m: MayChu) => chay(req, async () => {
  const id = nguoiDung(req, m); if (!id) return canDangNhap();
  const b = await doc(req);
  if (!b || typeof b.xacNhan !== 'string' || b.xacNhan.trim().toUpperCase() !== 'XOA') return loi(400, 'chua_xac_nhan', 'Gõ XOA để xác nhận xóa dữ liệu.');
  dv.xoaTaiKhoan(m.db, id);
  return json({ ok: true }, 200, { 'Set-Cookie': cookieXoa() });
});

export const laSoGhi = (req: Request, m: MayChu) => chay(req, async () => {
  const id = nguoiDung(req, m); if (!id) return canDangNhap();
  const b = await doc(req);
  const t = b?.thongTinSinh as Partial<ThongTinSinh> | undefined;
  if (!t || typeof t !== 'object') return loi(400, 'du_lieu_sai', 'Thiếu thông tin sinh.');
  const e = kiemTraThongTin(t);
  if (e) return loi(400, 'sinh_sai', e);
  // Chỉ giữ các trường đã biết, không lưu rác từ trình duyệt.
  const { lich, ngay, thang, nam, nhuan, gio, phut, mienNamTruoc1975, sinhNuocNgoai, muiGioUTC, nuoc, gioiTinh, ten, quyUoc } = t;
  const sach = Object.fromEntries(Object.entries({ lich, ngay, thang, nam, nhuan, gio, phut, mienNamTruoc1975, sinhNuocNgoai, muiGioUTC, nuoc: typeof nuoc === 'string' ? nuoc.slice(0, 40) : undefined, gioiTinh, ten: typeof ten === 'string' ? ten.slice(0, 60) : undefined, quyUoc }).filter(([, v]) => v !== undefined));
  return json({ id: dv.luuLaSo(m.db, m.khoa, id, sach, typeof ten === 'string' ? ten : undefined) });
});

export function laSoDoc(req: Request, m: MayChu) {
  const id = nguoiDung(req, m); if (!id) return canDangNhap();
  return json({ laSo: dv.dsLaSo(m.db, m.khoa, id) });
}

export const donHangTao = (req: Request, m: MayChu) => chay(req, async () => {
  const id = nguoiDung(req, m); if (!id) return canDangNhap();
  const b = await doc(req);
  if (!b) return loi(400, 'du_lieu_sai', 'Dữ liệu không hợp lệ.');
  // Cố ý chỉ lấy maGoi, chuDe, laSoId: mọi trường khác (như soTien) bị bỏ qua.
  return json(dv.taoDon(m.db, id, { maGoi: b.maGoi, chuDe: b.chuDe, laSoId: b.laSoId, bang: bangGiaCuaYeuCau(req) }), 201);
});

/** GET /api/don-hang?maGoi=thanh-vien-nam : số tiền sẽ được trừ (máy chủ tự tính) để trang thanh toán hiện đúng tổng. */
export function donHangTru(req: Request, m: MayChu) {
  const id = nguoiDung(req, m); if (!id) return canDangNhap();
  const ma = new URL(req.url).searchParams.get('maGoi');
  return json({ tru: ma === 'thanh-vien-nam' ? dv.truNangGoiCuaToi(m.db, id, bangGiaCuaYeuCau(req)) : 0 });
}

export const thanhToanGiaLap = (req: Request, m: MayChu) => chay(req, async () => {
  if (process.env.CONG_THANH_TOAN !== 'gia_lap') return loi(404, 'tat', 'Thanh toán giả lập đang tắt.');
  const id = nguoiDung(req, m); if (!id) return canDangNhap();
  const b = await doc(req);
  const donId = b?.donHangId;
  if (!Number.isInteger(donId)) return loi(400, 'du_lieu_sai', 'Thiếu mã đơn.');
  const don = dv.layDon(m.db, donId as number);
  if (!don || don.nguoiDungId !== id) return loi(404, 'khong_co_don', 'Không có đơn này.');
  const kq = dv.xacNhanDaTra(m.db, don.id, 'gia_lap', `gia_lap-${don.id}`);
  return json({ ok: true, ...kq, trangThai: 'da_tra' });
});

/** Chỗ cắm cổng thật: sau này kiểm chữ ký rồi gọi xacNhanDaTra(). Bản MVP chưa hỗ trợ. */
export const webhook = (_req: Request) => loi(501, 'chua_ho_tro', 'Cổng thanh toán này chưa được kết nối.');

/** GET /api/luan-giai?laSo=&chuDe= : chỉ trả chuyên đề khách đã mua; chưa mua 403, không kèm nội dung. */
export async function luanGiai(req: Request, m: MayChu) {
  const id = nguoiDung(req, m); if (!id) return canDangNhap();
  const u = new URL(req.url);
  const laSo = Number(u.searchParams.get('laSo'));
  const chuDe = u.searchParams.get('chuDe') ?? '';
  if (!Number.isInteger(laSo) || laSo <= 0 || !chuDe) return loi(400, 'du_lieu_sai', 'Thiếu lá số hoặc chủ đề.');
  try {
    return json(await luanGiaiChoKhach(m.db, m.khoa, id, laSo, chuDe));
  } catch (e) {
    if (e instanceof dv.LoiNghiepVu) return loi(e.trangThai, e.ma, e.message);
    ghiLoi('loi', '/api/luan-giai', 'sinh_that_bai', e instanceof Error ? e.message : 'không rõ');
    return loi(500, 'loi_may_chu', 'Chưa tạo được luận giải, vui lòng thử lại.');
  }
}

/** GET /api/hoi-dap?laSoId= : lịch sử hỏi đáp, số câu còn lại, ngày làm mới. Chỉ Thành viên năm (lá số trong 3 lá số đầu); khác 403. */
export function hoiDapDoc(req: Request, m: MayChu) {
  const id = nguoiDung(req, m); if (!id) return canDangNhap();
  const laSo = Number(new URL(req.url).searchParams.get('laSoId'));
  if (!Number.isInteger(laSo) || laSo <= 0) return loi(400, 'du_lieu_sai', 'Thiếu lá số.');
  try { return json(lichSuHoi(m.db, m.khoa, id, laSo)); } catch (e) {
    if (e instanceof dv.LoiNghiepVu) return loi(e.trangThai, e.ma, e.message);
    throw e;
  }
}

/** POST /api/hoi-dap {laSoId, cau}: trả lời ghép từ nhận định có mã quy tắc; chỉ trừ lượt khi trả lời được. Câu 6 trong tháng → 429 het_luot. */
export const hoiDapGhi = (req: Request, m: MayChu) => chay(req, async () => {
  const id = nguoiDung(req, m); if (!id) return canDangNhap();
  const b = await doc(req);
  if (!b || !Number.isInteger(b.laSoId)) return loi(400, 'du_lieu_sai', 'Dữ liệu không hợp lệ.');
  try { return json(await hoiLaSo(m.db, m.khoa, id, b.laSoId as number, b.cau)); } catch (e) {
    if (e instanceof dv.LoiNghiepVu) return loi(e.trangThai, e.ma, e.message);
    ghiLoi('loi', '/api/hoi-dap', 'tra_loi_that_bai', e instanceof Error ? e.message : 'không rõ'); // không ghi câu hỏi/câu trả lời
    return loi(500, 'loi_may_chu', 'Chưa trả lời được, vui lòng thử lại. Lượt hỏi của bạn không bị trừ.');
  }
});

/** POST /api/lien-he {loai, giaTri, dongY:true, nguon?}: không đồng ý (khác đúng true) thì không lưu gì. */
export const lienHeGhi = (req: Request, m: MayChu) => chay(req, async () => {
  const b = await doc(req);
  if (!b) return loi(400, 'du_lieu_sai', 'Dữ liệu không hợp lệ.');
  if (b.dongY !== true) return loi(400, 'chua_dong_y', 'Cần tích đồng ý nhận tin trước khi gửi.');
  const lh = chuanHoa(b.loai, b.giaTri);
  if (!lh) return loi(400, 'lien_he_sai', b.loai === 'zalo' ? 'Số điện thoại chưa đúng.' : 'Email chưa đúng.');
  const { maHuy } = luuLienHe(m.db, { ...lh, nguon: lamSachNguon(b.nguon), nguoiDungId: nguoiDung(req, m) });
  return json({ ok: true, duongHuy: `/huy-dang-ky?ma=${maHuy}` });
});

/** POST /api/nhan-tin {email, dongY:true, nguon?}: đăng ký nhận tin Vận 2027; chưa tích đồng ý thì không lưu gì. Chỉ ghi sự kiện dang_ky_nhan_tin, không có email. */
export const nhanTinGhi = (req: Request, m: MayChu) => chay(req, async () => {
  const b = await doc(req);
  if (!b) return loi(400, 'du_lieu_sai', 'Dữ liệu không hợp lệ.');
  if (b.dongY !== true) return loi(400, 'chua_dong_y', 'Cần tích đồng ý nhận tin trước khi gửi.');
  const lh = chuanHoa('email', b.email);
  if (!lh) return loi(400, 'lien_he_sai', 'Email chưa đúng.');
  const { maHuy } = luuNhanTin(m.db, { email: lh.giaTri, nguon: lamSachNguon(b.nguon) });
  if (typeof b.phien === 'string' && PHIEN_DO.test(b.phien)) await ghiSuKien({ ten: 'dang_ky_nhan_tin', phien: b.phien, trang: trangCua('dang_ky_nhan_tin'), ...nguonKhachCuaYeuCau(req) });
  return json({ ok: true, duongHuy: `/huy-dang-ky?ma=${maHuy}` });
});

/** POST /api/lien-he/huy {ma}: hủy đăng ký nhận tin (mã của liên hệ lá số hoặc của nhận tin Vận 2027). */
export const lienHeHuy = (req: Request, m: MayChu) => chay(req, async () => {
  const b = await doc(req);
  if (!b || typeof b.ma !== 'string' || !(huyLienHe(m.db, b.ma) || huyNhanTin(m.db, b.ma))) return loi(404, 'khong_co', 'Liên kết hủy không đúng hoặc đã hết hiệu lực.');
  return json({ ok: true });
});


/** POST /api/ma-moi/vao {ma, phien}: mã hợp lệ → ghi vao_moi kèm nguon lấy từ mã (không tin máy khách).
 * Thử kín 16/11: khách chưa đăng nhập (guest) không được dùng mã mời 0đ — buộc tạo tài khoản để lưu/xem sâu.
 * Mã sai trả 200 hopLe:false để trang báo nhẹ nhàng.
 */
export const maMoiVao = (req: Request, m: MayChu) => chay(req, async () => {
  const b = await doc(req);
  if (!b || typeof b.phien !== 'string' || !PHIEN_DO.test(b.phien)) return loi(400, 'du_lieu_sai', 'Dữ liệu không hợp lệ.');
  const kq = kiemMa(m.db, b.ma);
  if (!kq.hopLe) return json({ hopLe: false, ly: kq.ly });
  // Thử kín 16/11: khách chưa đăng nhập (guest) không được dùng mã mời 0đ — buộc tạo tài khoản để lưu/xem sâu.
  const id = nguoiDung(req, m); if (!id) return canDangNhap();
  await ghiSuKien({ ten: 'vao_moi', phien: b.phien, trang: trangCua('vao_moi'), nguon: kq.nguon });
  return json({ hopLe: true });
});

/** GET /api/ma-moi/kiem?ma= : khung "mời mở miễn phí" dùng để biết hiện gì (đã dùng chưa, chuyên đề nào được chọn). */
export function maMoiKiem(req: Request, m: MayChu) {
  const ma = new URL(req.url).searchParams.get('ma');
  let kq = kiemMa(m.db, ma);
  const id = nguoiDung(req, m);
  const daDung = id ? daDungMa(m.db, id) : false;
  const nguonCu = id && !kq.hopLe ? nguonDaDung(m.db, id, ma) : null; // mã đã hết lượt vì chính người này dùng: vẫn hợp lệ để hiện Góp ý
  if (nguonCu) kq = { hopLe: true, nguon: nguonCu };
  const gopY = process.env.GOP_Y_URL?.trim();
  return json({ hopLe: kq.hopLe, ...(kq.hopLe ? { nguon: kq.nguon, ...(gopY && /^https:\/\//.test(gopY) ? { gopYUrl: gopY } : {}) } : { ly: kq.ly }), chuDe: chuDeMoi(), dangNhap: !!id, daDung });
}

/** POST /api/ma-moi/dung {ma, laSoId, chuDe, phien}: mở một chuyên đề miễn phí. */
export const maMoiDung = (req: Request, m: MayChu) => chay(req, async () => {
  const id = nguoiDung(req, m); if (!id) return canDangNhap();
  const b = await doc(req);
  if (!b || typeof b.phien !== 'string' || !PHIEN_DO.test(b.phien)) return loi(400, 'du_lieu_sai', 'Dữ liệu không hợp lệ.');
  const kq = dungMa(m.db, id, { ma: b.ma, laSoId: b.laSoId, chuDe: b.chuDe });
  await ghiSuKien({ ten: 'dung_ma_moi', phien: b.phien, trang: trangCua('dung_ma_moi'), nguon: kq.nguon, chuDe: kq.chuDe });
  return json({ ok: true, chuDe: kq.chuDe });
});

/** Nguồn gửi để chống gửi dồn: địa chỉ do Cloudflare/nginx đặt; chỉ lưu dạng băm làm khóa đếm (bảng nguon_gui), không lưu địa chỉ gốc. */
const nguonGui = (req: Request) => req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'khong-ro';

/** POST /api/bao-loi {moTa, maDon?, goi?, thietBi?, gioKhach?, tinhHuong?}: lưu báo lỗi/góp ý. Không nhận ngày giờ sinh. */
export const baoLoiGhi = (req: Request, m: MayChu) => chay(req, async () => {
  const b = await doc(req);
  const kq = kiemTraBaoLoi(b);
  if (!kq.ok) return json({ loi: 'du_lieu_sai', truong: kq.truong, thongDiep: kq.thongDiep }, 400);
  if (!choPhepTheoNguon(m.db, nguonGui(req)) || !choPhepToanSite(m.db)) return loi(429, 'gui_don', 'Bạn gửi hơi nhanh. Chờ ít phút rồi gửi lại giúp mình nhé.');
  luuBaoLoi(m.db, kq.v, nguoiDung(req, m));
  return json({ ok: true }, 201);
});
