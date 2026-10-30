import { cuaBanVan2027Mo, goiTheoBang } from '@/lib/goi';
import { cauHinhThuGia, nhanhCuaYeuCau } from '@/lib/may-chu/thu-gia';

export const dynamic = 'force-dynamic';

// Giá khách thấy: tắt thử nghiệm -> giá hiện hành, không đặt cookie. Bật -> theo nhánh của thiết bị (đặt cookie lần đầu).
export async function GET(req: Request) {
  const cfg = cauHinhThuGia();
  const n = nhanhCuaYeuCau(req, cfg);
  const bang = n && n.nhanh === 'thu' && cfg ? cfg.bang : undefined;
  const { goi, vanNam } = goiTheoBang(bang);
  const gia = Object.fromEntries([...goi, ...vanNam].map((g) => [g.ma, g.gia]));
  return new Response(JSON.stringify({ nhanh: n?.nhanh ?? null, thu: n?.thu ?? null, thuDangBat: !!cfg, vanNamMo: cuaBanVan2027Mo(), gia }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, no-store', ...(n?.setCookie ? { 'Set-Cookie': n.setCookie } : {}) },
  });
}
