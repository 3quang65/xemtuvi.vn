import { appendFile, mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { kiemTraSuKien, trangCua } from '@/lib/su-kien';

export const dynamic = 'force-dynamic';

// Chỉ ghi {t, ten, phien, trang}: không IP, không user-agent, không dữ liệu sinh.
export async function POST(req: Request) {
  const tho = await req.text();
  if (tho.length > 512) return new Response(null, { status: 413 });
  let json: unknown;
  try { json = JSON.parse(tho); } catch { return new Response(null, { status: 400 }); }
  const sk = kiemTraSuKien(json);
  if (!sk) return new Response(null, { status: 400 });

  const dir = process.env.DATA_DIR || path.join(homedir(), 'xemtuvi-data', 'su-kien');
  const ngay = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10); // ngày theo giờ Việt Nam
  const dong = JSON.stringify({ t: Date.now(), ten: sk.ten, phien: sk.phien, trang: trangCua(sk.ten) }) + '\n';
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, `${ngay}.jsonl`), dong);
  return new Response(null, { status: 204 });
}
