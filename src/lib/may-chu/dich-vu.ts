// Nghiệp vụ: người dùng, lá số, đơn, quyền xem. Chỉ làm việc với CSDL; không biết gì về HTTP.
import { conHanBan, layChuDe, layGoi, MA_VAN_NAM, TRAN_TRU_NANG_GOI, type BangGia, type MaGoi } from '../goi';
import type { Csdl } from './csdl';
import { bamMa, chuanHoaMa, DO_DAI_MA, kiemMaKhoiPhuc, sinhMa } from './ma-khoi-phuc';
import { giaiMaJson, khoaTim, maHoaJson, type BoKhoa } from './ma-hoa';

const NGAY = 86_400_000;
export const HAN_TRU_NGAY = 30; // chot-faq-6-8_v1.md mục 8
export const TOI_DA_LA_SO = 20;
export const LA_SO_THANH_VIEN = 3; // thành viên năm: tối đa 3 lá số (bang-gia.md)

export type Cong = 'gia_lap';
export interface Quyen { id: number; loai: 'chu_de' | 'tron_la_so' | 'thanh_vien' | 'van_nam'; laSoId: number | null; chuDe: string | null; tuLuc: number; denLuc: number | null }
export class LoiNghiepVu extends Error { constructor(public ma: string, thongDiep: string, public trangThai = 400) { super(thongDiep); } }

/** Email này đã có tài khoản chưa (để tách đăng ký lần đầu khỏi đăng nhập lại). Email sai định dạng coi như chưa có; taoTaiKhoanThu sẽ báo lỗi. */
export function coNguoiDung(db: Csdl, email: string): boolean {
  return !!db.prepare('SELECT 1 FROM nguoi_dung WHERE nha_cung_cap=? AND ma_ngoai=?').get('thu', email.trim().toLowerCase());
}

const chuanEmail = (email: string) => {
  const e = email.trim().toLowerCase();
  if (e.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new LoiNghiepVu('email_sai', 'Email chưa đúng định dạng.');
  return e;
};

/** Chỉ cho mã nội bộ và test: lấy/tạo tài khoản KHÔNG qua mã khôi phục. Tầng HTTP không được gọi hàm này. */
export function dangNhapThu(db: Csdl, email: string, bayGio = Date.now()): number {
  const e = chuanEmail(email);
  db.prepare('INSERT OR IGNORE INTO nguoi_dung (nha_cung_cap, ma_ngoai, email, tao_luc) VALUES (?,?,?,?)').run('thu', e, e, bayGio);
  return (db.prepare('SELECT id FROM nguoi_dung WHERE nha_cung_cap=? AND ma_ngoai=?').get('thu', e) as { id: number }).id;
}

/** Lấy/tạo tài khoản theo định danh Google (`sub` bất biến). Email đã được Google xác minh (kiểm ở google-oauth.ts). Tài khoản thử cùng email được chuyển sang Google (giữ lá số, đơn, quyền) và mất đường đăng nhập bằng mã khôi phục. */
export function dangNhapGoogle(db: Csdl, sub: string, email: string, bayGio = Date.now()): { id: number; moi: boolean } {
  const e = chuanEmail(email);
  return db.transaction(() => {
    const co = db.prepare('SELECT id FROM nguoi_dung WHERE nha_cung_cap=? AND ma_ngoai=?').get('google', sub) as { id: number } | undefined;
    if (co) { db.prepare('UPDATE nguoi_dung SET email=? WHERE id=?').run(e, co.id); return { id: co.id, moi: false }; }
    const thu = db.prepare('SELECT id FROM nguoi_dung WHERE nha_cung_cap=? AND ma_ngoai=?').get('thu', e) as { id: number } | undefined;
    if (thu) { db.prepare("UPDATE nguoi_dung SET nha_cung_cap='google', ma_ngoai=?, ma_khoi_phuc=NULL WHERE id=?").run(sub, thu.id); return { id: thu.id, moi: false }; }
    return { id: Number(db.prepare('INSERT INTO nguoi_dung (nha_cung_cap, ma_ngoai, email, tao_luc) VALUES (?,?,?,?)').run('google', sub, e, bayGio).lastInsertRowid), moi: true };
  })();
}

/** Tạo tài khoản thử cho email chưa có; trả mã khôi phục dạng rõ đúng một lần (CSDL chỉ giữ băm). Email đã có → LoiNghiepVu. */
export function taoTaiKhoanThu(db: Csdl, email: string, bayGio = Date.now()): { id: number; maKhoiPhuc: string } {
  const e = chuanEmail(email);
  if (coNguoiDung(db, e)) throw new LoiNghiepVu('da_co', 'Email này đã có tài khoản.', 409);
  const ma = sinhMa();
  const id = Number(db.prepare('INSERT INTO nguoi_dung (nha_cung_cap, ma_ngoai, email, tao_luc, ma_khoi_phuc) VALUES (?,?,?,?,?)').run('thu', e, e, bayGio, bamMa(ma)).lastInsertRowid);
  return { id, maKhoiPhuc: ma };
}

/** Kết quả kiểm mã của email đã có: id nếu đúng; 'chua_co_ma' nếu tài khoản cũ chưa có mã; null nếu sai. */
export function kiemDangNhapThu(db: Csdl, email: string, ma: unknown): number | 'chua_co_ma' | null {
  const e = chuanEmail(email);
  const nd = db.prepare('SELECT id, ma_khoi_phuc AS h FROM nguoi_dung WHERE nha_cung_cap=? AND ma_ngoai=?').get('thu', e) as { id: number; h: string | null } | undefined;
  if (!nd) return null;
  if (!nd.h) return 'chua_co_ma';
  const m = chuanHoaMa(ma);
  return m.length === DO_DAI_MA && kiemMaKhoiPhuc(m, nd.h) ? nd.id : null;
}

export function luuLaSo(db: Csdl, k: BoKhoa, nguoiDungId: number, sinh: unknown, tenGoi?: string, bayGio = Date.now()): number {
  const chuan = JSON.stringify(sinh); // đã qua kiểm tra ở tầng HTTP
  const kt = khoaTim(`${nguoiDungId}|${chuan}`, k);
  const co = db.prepare('SELECT id FROM la_so WHERE nguoi_dung_id=? AND khoa_tim=?').get(nguoiDungId, kt) as { id: number } | undefined;
  if (co) return co.id;
  const n = (db.prepare('SELECT COUNT(*) n FROM la_so WHERE nguoi_dung_id=?').get(nguoiDungId) as { n: number }).n;
  if (n >= TOI_DA_LA_SO) throw new LoiNghiepVu('qua_nhieu_la_so', 'Đã đủ số lá số được lưu.', 409);
  return Number(db.prepare('INSERT INTO la_so (nguoi_dung_id, sinh_ma_hoa, khoa_tim, ten_goi, tao_luc) VALUES (?,?,?,?,?)').run(nguoiDungId, maHoaJson(sinh, k), kt, tenGoi?.slice(0, 60) ?? null, bayGio).lastInsertRowid);
}

export function dsLaSo(db: Csdl, k: BoKhoa, nguoiDungId: number) {
  const hang = db.prepare('SELECT id, sinh_ma_hoa, ten_goi FROM la_so WHERE nguoi_dung_id=? ORDER BY id').all(nguoiDungId) as { id: number; sinh_ma_hoa: string; ten_goi: string | null }[];
  return hang.map((h) => ({ id: h.id, tenGoi: h.ten_goi, thongTinSinh: giaiMaJson(h.sinh_ma_hoa, k) }));
}

export function laSoCuaToi(db: Csdl, nguoiDungId: number, laSoId: number | null | undefined): boolean {
  return !!db.prepare('SELECT 1 FROM la_so WHERE id=? AND nguoi_dung_id=?').get(laSoId ?? -1, nguoiDungId);
}

export interface DonDaTra { maGoi: string; soTien: number; traLuc: number }

/** Số tiền trừ khi nâng lên Thành viên năm: tổng đơn lẻ/Trọn lá số đã trả trong 30 ngày, bỏ các đơn trả trước lần nâng gần nhất; tối đa `tran`. */
export function tinhTruNangGoi(donDaTra: DonDaTra[], bayGio = Date.now(), tran = TRAN_TRU_NANG_GOI): number {
  const lanNang = Math.max(-Infinity, ...donDaTra.filter((d) => d.maGoi === 'thanh-vien-nam').map((d) => d.traLuc));
  const tu = bayGio - HAN_TRU_NGAY * NGAY;
  const tong = donDaTra
    .filter((d) => (d.maGoi === 'mot-chu-de' || d.maGoi === 'tron-la-so') && d.traLuc >= tu && d.traLuc <= bayGio && d.traLuc > lanNang)
    .reduce((t, d) => t + d.soTien, 0);
  return Math.max(0, Math.min(tong, tran));
}

/** Số trừ cho người dùng này nếu nâng lên Thành viên năm lúc này. Máy chủ tự tính từ đơn đã trả. */
export function truNangGoiCuaToi(db: Csdl, nguoiDungId: number, bang?: BangGia, bayGio = Date.now()): number {
  const don = db.prepare("SELECT ma_goi AS maGoi, so_tien AS soTien, tra_luc AS traLuc FROM don_hang WHERE nguoi_dung_id=? AND trang_thai='da_tra' AND tra_luc IS NOT NULL").all(nguoiDungId) as DonDaTra[];
  return tinhTruNangGoi(don, bayGio, layGoi('tron-la-so', bang)?.gia ?? TRAN_TRU_NANG_GOI);
}

/** Tạo đơn chờ. Số tiền lấy từ goi.ts (theo bảng giá nhánh thử nếu có, do máy chủ truyền); mọi số tiền từ trình duyệt đã bị bỏ qua ở tầng HTTP. */
export function taoDon(db: Csdl, nguoiDungId: number, v: { maGoi: unknown; chuDe?: unknown; laSoId?: unknown; bang?: BangGia }, cong: Cong = 'gia_lap', bayGio = Date.now()) {
  const goi = layGoi(typeof v.maGoi === 'string' ? v.maGoi : null, v.bang);
  if (!goi) throw new LoiNghiepVu('goi_sai', 'Gói không tồn tại.');
  if (goi.an && process.env.MO_GOI_AN !== '1') throw new LoiNghiepVu('goi_an', 'Gói này chưa mở bán.'); // MO_GOI_AN=1 chỉ để chạy test luồng nâng gói
  if (!conHanBan(goi, bayGio)) throw new LoiNghiepVu('het_han_ban', 'Gói này đã dừng bán.');
  let chuDe: string | null = null;
  if (goi.ma === 'mot-chu-de') {
    const cd = layChuDe(typeof v.chuDe === 'string' ? v.chuDe : null);
    if (!cd) throw new LoiNghiepVu('chu_de_sai', 'Gói một chủ đề cần chọn chủ đề hợp lệ.');
    chuDe = cd.ma;
  }
  let laSoId: number | null = null;
  if (v.laSoId !== undefined && v.laSoId !== null) {
    if (!Number.isInteger(v.laSoId) || !laSoCuaToi(db, nguoiDungId, v.laSoId as number)) throw new LoiNghiepVu('la_so_sai', 'Lá số không thuộc tài khoản này.', 403);
    laSoId = v.laSoId as number;
  }
  if (goi.ma !== 'thanh-vien-nam' && laSoId === null) throw new LoiNghiepVu('thieu_la_so', 'Cần chọn lá số cho gói này.');
  const tru = goi.ma === 'thanh-vien-nam' ? Math.min(truNangGoiCuaToi(db, nguoiDungId, v.bang, bayGio), goi.gia) : 0;
  const soTien = goi.gia - tru;
  const id = Number(db.prepare('INSERT INTO don_hang (nguoi_dung_id, la_so_id, ma_goi, chu_de, so_tien, tru, cong, tao_luc) VALUES (?,?,?,?,?,?,?,?)').run(nguoiDungId, laSoId, goi.ma, chuDe, soTien, tru, cong, bayGio).lastInsertRowid);
  return { id, maGoi: goi.ma as MaGoi, chuDe, laSoId, soTien, tru, trangThai: 'cho' as const };
}

export const layDon = (db: Csdl, id: number) =>
  db.prepare('SELECT id, nguoi_dung_id AS nguoiDungId, la_so_id AS laSoId, ma_goi AS maGoi, chu_de AS chuDe, so_tien AS soTien, trang_thai AS trangThai FROM don_hang WHERE id=?').get(id) as
    { id: number; nguoiDungId: number; laSoId: number | null; maGoi: MaGoi; chuDe: string | null; soTien: number; trangThai: string } | undefined;

/**
 * Chỗ DUY NHẤT đổi đơn sang da_tra và cấp quyen_xem, trong một giao dịch.
 * Idempotent: gọi lại (cùng đơn hoặc cùng ma_giao_dich_cong) không cấp thêm quyền.
 */
export function xacNhanDaTra(db: Csdl, donId: number, cong: string, maGiaoDich: string, bayGio = Date.now()): { daCapMoi: boolean } {
  return db.transaction(() => {
    const don = layDon(db, donId);
    if (!don) throw new LoiNghiepVu('khong_co_don', 'Không có đơn này.', 404);
    if (don.trangThai === 'da_tra') return { daCapMoi: false };
    if (don.trangThai !== 'cho') throw new LoiNghiepVu('don_khong_cho', 'Đơn không ở trạng thái chờ thanh toán.', 409);
    db.prepare("UPDATE don_hang SET trang_thai='da_tra', cong=?, ma_giao_dich_cong=?, tra_luc=? WHERE id=?").run(cong, maGiaoDich, bayGio, donId);
    const them = db.prepare('INSERT INTO quyen_xem (nguoi_dung_id, la_so_id, loai, chu_de, tu_luc, den_luc, don_hang_id) VALUES (?,?,?,?,?,?,?)');
    // Gói gộp cấp hai quyền (Trọn lá số + Vận năm); các gói khác một quyền.
    const loaiCap: Quyen['loai'][] = don.maGoi === 'thanh-vien-nam' ? ['thanh_vien'] : don.maGoi === 'tron-la-so' ? ['tron_la_so']
      : don.maGoi === 'van-nam-2027' ? ['van_nam'] : don.maGoi === 'tron-la-so-kem-van-nam' ? ['tron_la_so', 'van_nam'] : ['chu_de'];
    for (const loai of loaiCap) {
      them.run(don.nguoiDungId, loai === 'thanh_vien' ? null : don.laSoId, loai, loai === 'van_nam' ? MA_VAN_NAM : don.chuDe, bayGio, loai === 'thanh_vien' ? bayGio + 365 * NGAY : null, donId);
    }
    return { daCapMoi: true };
  })();
}

/** Quyền còn hạn của người dùng. */
export function dsQuyen(db: Csdl, nguoiDungId: number, bayGio = Date.now()): Quyen[] {
  return db.prepare('SELECT id, loai, la_so_id AS laSoId, chu_de AS chuDe, tu_luc AS tuLuc, den_luc AS denLuc FROM quyen_xem WHERE nguoi_dung_id=? AND (den_luc IS NULL OR den_luc > ?) ORDER BY id').all(nguoiDungId, bayGio) as Quyen[];
}

/** Có quyền xem chuyên đề này của lá số này không? (dùng cho BE3). Thành viên: trọn 3 lá số đầu của người đó. */
export function coQuyenXem(db: Csdl, nguoiDungId: number, laSoId: number, chuDe: string | null, bayGio = Date.now()): boolean {
  if (!laSoCuaToi(db, nguoiDungId, laSoId)) return false;
  const dau = (db.prepare('SELECT id FROM la_so WHERE nguoi_dung_id=? ORDER BY id LIMIT ?').all(nguoiDungId, LA_SO_THANH_VIEN) as { id: number }[]).map((r) => r.id);
  return dsQuyen(db, nguoiDungId, bayGio).some((q) =>
    q.loai === 'thanh_vien' ? dau.includes(laSoId)
      : q.laSoId === laSoId && ((q.loai === 'tron_la_so' && chuDe !== MA_VAN_NAM) || (chuDe !== null && q.chuDe === chuDe)));
}

/** Xóa tài khoản và dữ liệu: lá số, quyền xem, lượt dùng mã mời, phiên, cờ đồng ý nhận tin (theo tài khoản và theo email).
 *  Đơn hàng giữ lại, ẩn danh: bỏ liên kết lá số, tài khoản chỉ còn dòng rỗng (không email, không mã ngoài). */
export function xoaTaiKhoan(db: Csdl, nguoiDungId: number): void {
  db.transaction(() => {
    const nd = db.prepare('SELECT email FROM nguoi_dung WHERE id=?').get(nguoiDungId) as { email: string | null } | undefined;
    if (!nd) return;
    db.prepare('UPDATE don_hang SET la_so_id=NULL WHERE nguoi_dung_id=?').run(nguoiDungId);
    db.prepare('DELETE FROM quyen_xem WHERE nguoi_dung_id=?').run(nguoiDungId);
    db.prepare('DELETE FROM ma_moi_dung WHERE nguoi_dung_id=?').run(nguoiDungId);
    db.prepare('DELETE FROM la_so WHERE nguoi_dung_id=?').run(nguoiDungId);
    db.prepare('DELETE FROM phien WHERE nguoi_dung_id=?').run(nguoiDungId);
    const e = nd.email?.toLowerCase() ?? null;
    if (e) db.prepare('DELETE FROM dang_nhap_sai WHERE khoa=?').run('e:' + e);
    db.prepare("DELETE FROM lien_he WHERE nguoi_dung_id=? OR (loai='email' AND gia_tri=?)").run(nguoiDungId, e);
    if (e) db.prepare('DELETE FROM nhan_tin_van_nam WHERE email=?').run(e);
    db.prepare("UPDATE nguoi_dung SET nha_cung_cap='da_xoa', ma_ngoai=?, email=NULL, ma_khoi_phuc=NULL WHERE id=?").run(`xoa-${nguoiDungId}-${Date.now()}`, nguoiDungId);
  })();
}
