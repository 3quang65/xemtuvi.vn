// Tạo liên kết trang báo lỗi. Tách riêng khỏi tro-giup.ts (kéo theo bảng giá, câu hỏi) để trang chủ không phải tải thừa. L-b064ec
export interface ThamSoBaoLoi { maDon: string; goi: string; tinhHuong: string }
export function linkBaoLoi(o: Partial<ThamSoBaoLoi> = {}): string {
  const q = new URLSearchParams();
  if (o.maDon) q.set('don', o.maDon);
  if (o.goi) q.set('goi', o.goi);
  if (o.tinhHuong) q.set('th', o.tinhHuong);
  const s = q.toString();
  return `/tro-giup${s ? `?${s}` : ''}#bao-loi`;
}
