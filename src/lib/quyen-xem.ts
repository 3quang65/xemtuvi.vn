// Gộp quyền xem của một lá số để giao diện /luan-giai hiện đủ mọi thứ khách đã mua.
// Quy tắc khớp với coQuyenXem (may-chu/dich-vu.ts): thành viên phủ 3 lá số đầu; trọn lá số và chủ đề theo laSoId.
import { MA_VAN_NAM, type MaChuDe, type MaGoi } from './goi';

export interface QuyenGiaoDien { loai: string; chuDe: string | null; laSoId: number | null }
export const CHU_DE_TRON: MaChuDe[] = ['ban-than', 'tinh-cam', 'su-nghiep', 'tai-chinh', 'gia-dao', 'van-10-nam' as MaChuDe];
const SO_LA_SO_THANH_VIEN = 3;

/** Vận năm 2027 của lá số này: mua lẻ/gộp (van_nam) hoặc thành viên năm. Trọn lá số một mình thì không. */
export function coVanNam(quyen: QuyenGiaoDien[], laSoId: number, laSoIds: number[]): boolean {
  const duocThanhVien = laSoIds.slice(0, SO_LA_SO_THANH_VIEN).includes(laSoId);
  return quyen.some((x) => x.loai === 'thanh_vien' ? duocThanhVien : x.loai === 'van_nam' && x.laSoId === laSoId);
}

/** Đã có Trọn lá số cho lá số này (mua Trọn lá số/gộp, hoặc thành viên năm phủ lá số này): khi đó không bán gói gộp nữa. */
export function coTronLaSo(quyen: QuyenGiaoDien[], laSoId: number, laSoIds: number[]): boolean {
  const duocThanhVien = laSoIds.slice(0, SO_LA_SO_THANH_VIEN).includes(laSoId);
  return quyen.some((x) => x.loai === 'thanh_vien' ? duocThanhVien : x.loai === 'tron_la_so' && x.laSoId === laSoId);
}

export function tongHopQuyen(quyen: QuyenGiaoDien[], laSoId: number, laSoIds: number[]): { goi: MaGoi; dsChuDe: string[] } | null {
  const duocThanhVien = laSoIds.slice(0, SO_LA_SO_THANH_VIEN).includes(laSoId);
  const cua = quyen.filter((x) => x.loai === 'thanh_vien' ? duocThanhVien : x.laSoId === laSoId);
  const vanNam = coVanNam(quyen, laSoId, laSoIds) ? [MA_VAN_NAM] : [];
  if (cua.some((x) => x.loai === 'thanh_vien')) return { goi: 'thanh-vien-nam', dsChuDe: [...CHU_DE_TRON, ...vanNam] };
  if (cua.some((x) => x.loai === 'tron_la_so')) return { goi: 'tron-la-so', dsChuDe: [...CHU_DE_TRON, ...vanNam] };
  const chuDe = new Set(cua.filter((x) => x.loai === 'chu_de' && x.chuDe).map((x) => x.chuDe as string));
  if (!chuDe.size) return vanNam.length ? { goi: 'van-nam-2027', dsChuDe: vanNam } : null;
  return { goi: 'mot-chu-de', dsChuDe: [...CHU_DE_TRON.filter((c) => chuDe.has(c)), ...[...chuDe].filter((c) => !(CHU_DE_TRON as string[]).includes(c)), ...vanNam] };
}

/** Lá số mở sẵn: lá số đầu tiên có quyền; không có thì lá số đầu tiên. */
export function laSoMacDinh(quyen: QuyenGiaoDien[], laSoIds: number[]): number | null {
  return laSoIds.find((id) => tongHopQuyen(quyen, id, laSoIds)) ?? laSoIds[0] ?? null;
}
