// Gộp quyền xem của một lá số để giao diện /luan-giai hiện đủ mọi thứ khách đã mua.
// Quy tắc khớp với coQuyenXem (may-chu/dich-vu.ts): thành viên phủ 3 lá số đầu; trọn lá số và chủ đề theo laSoId.
import type { MaChuDe, MaGoi } from './goi';

export interface QuyenGiaoDien { loai: string; chuDe: string | null; laSoId: number | null }
export const CHU_DE_TRON: MaChuDe[] = ['ban-than', 'tinh-cam', 'su-nghiep', 'van-10-nam' as MaChuDe];
const SO_LA_SO_THANH_VIEN = 3;

export function tongHopQuyen(quyen: QuyenGiaoDien[], laSoId: number, laSoIds: number[]): { goi: MaGoi; dsChuDe: string[] } | null {
  const duocThanhVien = laSoIds.slice(0, SO_LA_SO_THANH_VIEN).includes(laSoId);
  const cua = quyen.filter((x) => x.loai === 'thanh_vien' ? duocThanhVien : x.laSoId === laSoId);
  if (cua.some((x) => x.loai === 'thanh_vien')) return { goi: 'thanh-vien-nam', dsChuDe: [...CHU_DE_TRON] };
  if (cua.some((x) => x.loai === 'tron_la_so')) return { goi: 'tron-la-so', dsChuDe: [...CHU_DE_TRON] };
  const chuDe = new Set(cua.filter((x) => x.loai === 'chu_de' && x.chuDe).map((x) => x.chuDe as string));
  if (!chuDe.size) return null;
  return { goi: 'mot-chu-de', dsChuDe: [...CHU_DE_TRON.filter((c) => chuDe.has(c)), ...[...chuDe].filter((c) => !(CHU_DE_TRON as string[]).includes(c))] };
}

/** Lá số mở sẵn: lá số đầu tiên có quyền; không có thì lá số đầu tiên. */
export function laSoMacDinh(quyen: QuyenGiaoDien[], laSoIds: number[]): number | null {
  return laSoIds.find((id) => tongHopQuyen(quyen, id, laSoIds)) ?? laSoIds[0] ?? null;
}
