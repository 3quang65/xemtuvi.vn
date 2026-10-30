// Nghiệp vụ: người dùng, lá số, đơn, quyền xem. Chỉ làm việc với CSDL; không biết gì về HTTP.
import { layChuDe, layGoi, MA_VAN_NAM, type MaGoi } from '../goi';
import type { Csdl } from './csdl';
import { giaiMaJson, khoaTim, maHoaJson, type BoKhoa } from './ma-hoa';

const NGAY = 86_400_000;
export const TOI_DA_LA_SO = 20;
export const LA_SO_THANH_VIEN = 3; // thành viên năm: tối đa 3 lá số (bang-gia.md)

export type Cong = 'gia_lap';
export interface Quyen { id: number; loai: 'chu_de' | 'tron_la_so' | 'thanh_vien' | 'van_nam'; laSoId: number | null; chuDe: string | null; tuLuc: number; denLuc: number | null }
export class LoiNghiepVu extends Error { constructor(public ma: string, thongDiep: string, public trangThai = 400) { super(thongDiep); } }

export function dangNhapThu(db: Csdl, email: string, bayGio = Date.now()): number {
  const e = email.trim().toLowerCase();
  if (e.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new LoiNghiepVu('email_sai', 'Email chưa đúng định dạng.');
  db.prepare('INSERT OR IGNORE INTO nguoi_dung (nha_cung_cap, ma_ngoai, email, tao_luc) VALUES (?,?,?,?)').run('thu', e, e, bayGio);
  return (db.prepare('SELECT id FROM nguoi_dung WHERE nha_cung_cap=? AND ma_ngoai=?').get('thu', e) as { id: number }).id;
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

/** Tạo đơn chờ. Số tiền lấy từ goi.ts; mọi số tiền từ trình duyệt đã bị bỏ qua ở tầng HTTP. */
export function taoDon(db: Csdl, nguoiDungId: number, v: { maGoi: unknown; chuDe?: unknown; laSoId?: unknown }, cong: Cong = 'gia_lap', bayGio = Date.now()) {
  const goi = layGoi(typeof v.maGoi === 'string' ? v.maGoi : null);
  if (!goi) throw new LoiNghiepVu('goi_sai', 'Gói không tồn tại.');
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
  const id = Number(db.prepare('INSERT INTO don_hang (nguoi_dung_id, la_so_id, ma_goi, chu_de, so_tien, cong, tao_luc) VALUES (?,?,?,?,?,?,?)').run(nguoiDungId, laSoId, goi.ma, chuDe, goi.gia, cong, bayGio).lastInsertRowid);
  return { id, maGoi: goi.ma as MaGoi, chuDe, laSoId, soTien: goi.gia, trangThai: 'cho' as const };
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
