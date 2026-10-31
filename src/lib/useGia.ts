'use client';
// Giá khách thấy: hỏi /api/gia một lần mỗi lần tải trang (máy chủ quyết định nhánh thử, cookie giữ nhánh theo thiết bị).
// Lỗi mạng -> giá hiện hành. Khi chưa tải xong, san=false để màn hình chờ, tránh nháy giá cũ rồi đổi.
import { useEffect, useState } from 'react';
import { goiHienThi, type BangGia, type Goi } from './goi';
import { datNhanh } from './phien';

interface TraLoi { nhanh: string | null; gia: BangGia; vanNamMo?: boolean; xemTruoc?: boolean }
let dangTai: Promise<TraLoi | null> | null = null;
const tai = () => (dangTai ??= fetch('/api/gia', { cache: 'no-store' }).then((r) => (r.ok ? (r.json() as Promise<TraLoi>) : null)).catch(() => null));

/** choXemTruoc: chỉ /chon-goi truyền true để hiện thẻ xem thử khi cờ XEM_TRUOC_GIA bật; mọi nơi khác (nút mua, thanh toán) luôn chỉ thấy gói đang bán. */
export function useGia(choXemTruoc = false): { san: boolean; goi: Goi[]; vanNam: Goi[] } {
  const [kq, setKq] = useState<{ bang?: BangGia; vanNamMo: boolean; xemTruoc: boolean } | null>(null);
  useEffect(() => {
    let huy = false;
    tai().then((t) => { datNhanh(t?.nhanh === 'goc' || t?.nhanh === 'thu' ? t.nhanh : null); if (!huy) setKq({ bang: t?.gia, vanNamMo: t?.vanNamMo === true, xemTruoc: t?.xemTruoc === true }); });
    return () => { huy = true; };
  }, []);
  return { san: kq !== null, ...goiHienThi({ bang: kq?.bang, vanNamMo: kq?.vanNamMo === true, xemTruoc: choXemTruoc && kq?.xemTruoc === true }) };
}
