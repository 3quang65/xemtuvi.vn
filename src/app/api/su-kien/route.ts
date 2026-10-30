import { layGoi } from '@/lib/goi';
import { ghiSuKien } from '@/lib/ghi-su-kien';
import { kiemTraSuKien, trangCua } from '@/lib/su-kien';

export const dynamic = 'force-dynamic';

// Chỉ ghi {t, ten, phien, trang, goi?, chuDe?, gia?}; gia tra từ goi.ts tại máy chủ. Không IP, không user-agent, không dữ liệu sinh.
export async function POST(req: Request) {
  const tho = await req.text();
  if (tho.length > 512) return new Response(null, { status: 413 });
  let json: unknown;
  try { json = JSON.parse(tho); } catch { return new Response(null, { status: 400 }); }
  const sk = kiemTraSuKien(json);
  if (!sk) return new Response(null, { status: 400 });
  await ghiSuKien({
    ten: sk.ten, phien: sk.phien, trang: trangCua(sk.ten),
    ...(sk.goi ? { goi: sk.goi, gia: layGoi(sk.goi)?.gia } : {}), ...(sk.chuDe ? { chuDe: sk.chuDe } : {}),
  });
  return new Response(null, { status: 204 });
}
