import { layGoi } from '@/lib/goi';
import { ghiSuKien } from '@/lib/ghi-su-kien';
import { bangGiaCuaYeuCau, nhanhDaGan } from '@/lib/may-chu/thu-gia';
import { KHAO_SAT, kiemTraSuKien, nhomNguon, trangCua } from '@/lib/su-kien';

export const dynamic = 'force-dynamic';

// Chỉ ghi {t, ten, phien, trang, thietBi?, goi?, chuDe?, nhanh?, thu?, gia?}; thietBi/nhanh/thu và gia do máy chủ tính từ cookie nhánh (không tin trình duyệt); riêng vao_trang thêm nguồn (utm_*, ref là tên máy chủ, dich, may) và nhom do máy chủ tính; gia tra từ goi.ts tại máy chủ. Không IP, không user-agent, không dữ liệu sinh.
export async function POST(req: Request) {
  const tho = await req.text();
  if (tho.length > 1024) return new Response(null, { status: 413 });
  let json: unknown;
  try { json = JSON.parse(tho); } catch { return new Response(null, { status: 400 }); }
  const sk = kiemTraSuKien(json);
  if (!sk) return new Response(null, { status: 400 });
  const n = nhanhDaGan(req);
  const thietBi = n?.thietBi ? { thietBi: n.thietBi } : {}; // mã từ cookie, thay mã trình duyệt khai (nếu có)
  if (KHAO_SAT.includes(sk.ten)) { // khảo sát 'đáng tiền': giữ nguyên trường đã kiểm (bai, goi, cach, diem_a, diem_c, co_loi_b); không gia/nhanh
    const { ten, phien, thietBi: _tb, ...truong } = sk;
    await ghiSuKien({ ten, phien, trang: trangCua(ten), ...thietBi, ...truong });
    return new Response(null, { status: 204 });
  }
  if (sk.ten === 'vao_trang') {
    const { ten, phien, thietBi: _bo, ...nguon } = sk;
    await ghiSuKien({ ten, phien, trang: trangCua(ten), ...thietBi, ...nguon, nhom: nhomNguon(sk) });
    return new Response(null, { status: 204 });
  }
  await ghiSuKien({
    ten: sk.ten, phien: sk.phien, trang: trangCua(sk.ten), ...thietBi,
    ...(sk.goi ? { goi: sk.goi, gia: layGoi(sk.goi, bangGiaCuaYeuCau(req))?.gia } : {}), ...(sk.chuDe ? { chuDe: sk.chuDe } : {}),
    ...(n && (sk.goi || sk.ten === 'bao_loi') ? { nhanh: n.nhanh, thu: n.thu } : {}), // bao_loi không mang gói nhưng vẫn mang nhánh đã lưu theo thiết bị
  });
  return new Response(null, { status: 204 });
}
