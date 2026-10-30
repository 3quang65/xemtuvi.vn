// Xử lý HTTP cho các API (route.ts chỉ gọi vào đây). Nhận MayChu để test được bằng CSDL tạm.
import { kiemTraThongTin, type ThongTinSinh } from '../tuvi';
import type { MayChu } from './csdl';
import * as dv from './dich-vu';
import { luanGiaiChoKhach } from './luan-giai-may-chu';
import { ghiLoi } from './nhat-ky';
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

const nguoiDung = (req: Request, m: MayChu) => docPhien(m.db, docCookie(req));
const canDangNhap = () => loi(401, 'chua_dang_nhap', 'Cần đăng nhập.');

export const dangNhap = (req: Request, m: MayChu) => chay(req, async () => {
  if (process.env.DANG_NHAP_THU !== '1') return loi(404, 'tat', 'Đăng nhập thử đang tắt.');
  const b = await doc(req);
  if (!b || typeof b.email !== 'string') return loi(400, 'du_lieu_sai', 'Thiếu email.');
  const id = dv.dangNhapThu(m.db, b.email);
  return json({ ok: true }, 200, { 'Set-Cookie': cookieDat(taoPhien(m.db, id)) });
});

export const dangXuat = (req: Request, m: MayChu) => chay(req, () => {
  xoaPhien(m.db, docCookie(req));
  return json({ ok: true }, 200, { 'Set-Cookie': cookieXoa() });
});

export function toi(req: Request, m: MayChu) {
  const id = nguoiDung(req, m);
  if (!id) return json({ dangNhap: false });
  const nd = m.db.prepare('SELECT email FROM nguoi_dung WHERE id=?').get(id) as { email: string };
  return json({ dangNhap: true, email: nd.email, quyen: dv.dsQuyen(m.db, id), laSoIds: dv.dsLaSo(m.db, m.khoa, id).map((l) => l.id) });
}

export const laSoGhi = (req: Request, m: MayChu) => chay(req, async () => {
  const id = nguoiDung(req, m); if (!id) return canDangNhap();
  const b = await doc(req);
  const t = b?.thongTinSinh as Partial<ThongTinSinh> | undefined;
  if (!t || typeof t !== 'object') return loi(400, 'du_lieu_sai', 'Thiếu thông tin sinh.');
  const e = kiemTraThongTin(t);
  if (e) return loi(400, 'sinh_sai', e);
  // Chỉ giữ các trường đã biết, không lưu rác từ trình duyệt.
  const { lich, ngay, thang, nam, nhuan, gio, phut, mienNamTruoc1975, gioiTinh, ten, quyUoc } = t;
  const sach = Object.fromEntries(Object.entries({ lich, ngay, thang, nam, nhuan, gio, phut, mienNamTruoc1975, gioiTinh, ten: typeof ten === 'string' ? ten.slice(0, 60) : undefined, quyUoc }).filter(([, v]) => v !== undefined));
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
  return json(dv.taoDon(m.db, id, { maGoi: b.maGoi, chuDe: b.chuDe, laSoId: b.laSoId }), 201);
});

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
