import { kiemPhanHoi, luuPhanHoi } from '@/lib/khao-sat';

export const dynamic = 'force-dynamic';

// Lời góp ý (b) của khảo sát 'đáng tiền': chỉ {bai, goi, diem_a, loi}; loi cắt cứng 300 ký tự; lưu riêng (KHAO_SAT_DIR/phan-hoi.jsonl) mã PH-xxx. Không IP, không cookie, không dữ liệu sinh.
export async function POST(req: Request) {
  const tho = await req.text();
  if (tho.length > 4096) return new Response(null, { status: 413 });
  let json: unknown;
  try { json = JSON.parse(tho); } catch { return new Response(null, { status: 400 }); }
  const p = kiemPhanHoi(json);
  if (!p) return new Response(null, { status: 400 });
  await luuPhanHoi(p);
  return new Response(null, { status: 204 });
}
