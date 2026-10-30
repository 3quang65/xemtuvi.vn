import { layGoi } from '@/lib/goi';
import { ghiSuKien } from '@/lib/ghi-su-kien';
import { kiemTraSuKien, nhomNguon, trangCua } from '@/lib/su-kien';

export const dynamic = 'force-dynamic';

// Chỉ ghi {t, ten, phien, trang, goi?, chuDe?, gia?}; riêng vao_trang thêm nguồn (utm_*, ref là tên máy chủ, dich, may) và nhom do máy chủ tính; gia tra từ goi.ts tại máy chủ. Không IP, không user-agent, không dữ liệu sinh.
export async function POST(req: Request) {
  const tho = await req.text();
  if (tho.length > 1024) return new Response(null, { status: 413 });
  let json: unknown;
  try { json = JSON.parse(tho); } catch { return new Response(null, { status: 400 }); }
  const sk = kiemTraSuKien(json);
  if (!sk) return new Response(null, { status: 400 });
  if (sk.ten === 'vao_trang') {
    const { ten, phien, ...nguon } = sk;
    await ghiSuKien({ ten, phien, trang: trangCua(ten), ...nguon, nhom: nhomNguon(sk) });
    return new Response(null, { status: 204 });
  }
  await ghiSuKien({
    ten: sk.ten, phien: sk.phien, trang: trangCua(sk.ten),
    ...(sk.goi ? { goi: sk.goi, gia: layGoi(sk.goi)?.gia } : {}), ...(sk.chuDe ? { chuDe: sk.chuDe } : {}),
  });
  return new Response(null, { status: 204 });
}
