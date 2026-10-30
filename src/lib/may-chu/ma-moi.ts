// Mã mời bản thử khách mời (docs/ky-thuat/ban-thu-khach-moi.md). Cấp quyền chỉ qua xacNhanDaTra (đơn 0đ, cổng 'moi').
import { randomInt } from 'node:crypto';
import { MA_VAN_NAM } from '../goi';
import { MA_CHU_DE } from '../goi-ma.js';
import type { Csdl } from './csdl';
import { laSoCuaToi, LoiNghiepVu, xacNhanDaTra } from './dich-vu';
import { CHU_DE_CO_NOI_DUNG } from './luan-giai-may-chu';

export const NGUON_HOP_LE = ['tuvivn', 'anh', 'cd-3a', 'cd-3b', 'cd-3c', 'cd-3d', 'cd-3e'];
const KY_TU = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // bỏ I, O, 0, 1 cho dễ đọc
export const vanNamThuBat = () => process.env.VAN_NAM_THU === '1';

/** Chủ đề khách mời được chọn: các chủ đề đã có nội dung, cộng Vận năm 2027 khi cờ bật. */
export const chuDeMoi = () => [...MA_CHU_DE.filter((c) => CHU_DE_CO_NOI_DUNG.includes(c)), ...(vanNamThuBat() ? [MA_VAN_NAM] : [])];

export const chuanMa = (ma: unknown) => (typeof ma === 'string' && /^[A-Za-z0-9]{8}$/.test(ma.trim()) ? ma.trim().toUpperCase() : null);

export function taoMa(db: Csdl, v: { nguon: string; soLuong: number; gioiHan?: number; hetHan?: number | null; ghiChu?: string }, bayGio = Date.now()): string[] {
  if (!NGUON_HOP_LE.includes(v.nguon)) throw new Error(`nguon phải thuộc: ${NGUON_HOP_LE.join(', ')}`);
  if (!Number.isInteger(v.soLuong) || v.soLuong < 1 || v.soLuong > 500) throw new Error('so-luong từ 1 đến 500');
  const gioiHan = v.gioiHan ?? 1;
  if (!Number.isInteger(gioiHan) || gioiHan < 1) throw new Error('gioi-han phải là số nguyên ≥ 1');
  const them = db.prepare('INSERT OR IGNORE INTO ma_moi (ma, nguon, ghi_chu, gioi_han, het_han, tao_luc) VALUES (?,?,?,?,?,?)');
  const ra: string[] = [];
  db.transaction(() => {
    while (ra.length < v.soLuong) {
      const ma = Array.from({ length: 8 }, () => KY_TU[randomInt(KY_TU.length)]).join('');
      if (them.run(ma, v.nguon, v.ghiChu ?? null, gioiHan, v.hetHan ?? null, bayGio).changes) ra.push(ma);
    }
  })();
  return ra;
}

export type KetQuaMa = { hopLe: true; nguon: string } | { hopLe: false; ly: 'sai' | 'het_han' | 'het_luot' };

export function kiemMa(db: Csdl, maTho: unknown, bayGio = Date.now()): KetQuaMa {
  const ma = chuanMa(maTho);
  const h = ma ? db.prepare('SELECT nguon, gioi_han AS gioiHan, het_han AS hetHan FROM ma_moi WHERE ma=?').get(ma) as { nguon: string; gioiHan: number; hetHan: number | null } | undefined : undefined;
  if (!h) return { hopLe: false, ly: 'sai' };
  if (h.hetHan !== null && h.hetHan <= bayGio) return { hopLe: false, ly: 'het_han' };
  const da = (db.prepare('SELECT COUNT(*) n FROM ma_moi_dung WHERE ma=?').get(ma) as { n: number }).n;
  if (da >= h.gioiHan) return { hopLe: false, ly: 'het_luot' };
  return { hopLe: true, nguon: h.nguon };
}

export const daDungMa = (db: Csdl, nguoiDungId: number) => !!db.prepare('SELECT 1 FROM ma_moi_dung WHERE nguoi_dung_id=?').get(nguoiDungId);

const LOI_MA = { sai: ['ma_sai', 'Mã mời không đúng.', 404], het_han: ['ma_het_han', 'Mã mời đã hết hạn.', 410], het_luot: ['ma_het_luot', 'Mã mời đã hết lượt dùng.', 410] } as const;

/** Mở miễn phí một chuyên đề bằng mã mời: đơn 0đ + quyền xem, một giao dịch. Mỗi tài khoản một lần. */
export function dungMa(db: Csdl, nguoiDungId: number, v: { ma: unknown; laSoId: unknown; chuDe: unknown }, bayGio = Date.now()) {
  return db.transaction(() => {
    const kq = kiemMa(db, v.ma, bayGio);
    if (!kq.hopLe) { const [m, t, s] = LOI_MA[kq.ly]; throw new LoiNghiepVu(m, t, s); }
    if (typeof v.chuDe !== 'string' || !chuDeMoi().includes(v.chuDe)) throw new LoiNghiepVu('chu_de_sai', 'Chuyên đề này chưa mở cho khách mời.');
    if (!Number.isInteger(v.laSoId) || !laSoCuaToi(db, nguoiDungId, v.laSoId as number)) throw new LoiNghiepVu('la_so_sai', 'Lá số không thuộc tài khoản này.', 403);
    if (daDungMa(db, nguoiDungId)) throw new LoiNghiepVu('da_dung_ma', 'Tài khoản này đã dùng mã mời rồi.', 409);
    const laVanNam = v.chuDe === MA_VAN_NAM;
    const donId = Number(db.prepare("INSERT INTO don_hang (nguoi_dung_id, la_so_id, ma_goi, chu_de, so_tien, cong, tao_luc) VALUES (?,?,?,?,0,'moi',?)")
      .run(nguoiDungId, v.laSoId, laVanNam ? MA_VAN_NAM : 'mot-chu-de', laVanNam ? null : v.chuDe, bayGio).lastInsertRowid);
    db.prepare('INSERT INTO ma_moi_dung (ma, nguoi_dung_id, la_so_id, chu_de, luc) VALUES (?,?,?,?,?)').run(chuanMa(v.ma), nguoiDungId, v.laSoId, v.chuDe, bayGio);
    xacNhanDaTra(db, donId, 'moi', `moi-${donId}`, bayGio);
    return { donId, nguon: kq.nguon, chuDe: v.chuDe as string };
  })();
}
