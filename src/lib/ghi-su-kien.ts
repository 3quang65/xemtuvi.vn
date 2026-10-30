import { appendFile, mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';

/** Ghi một dòng sự kiện vào tệp JSONL của ngày (giờ Việt Nam). Chỗ ghi duy nhất; người gọi tự bảo đảm không có dữ liệu cá nhân. */
export async function ghiSuKien(dong: Record<string, unknown>) {
  const dir = process.env.DATA_DIR || path.join(homedir(), 'xemtuvi-data', 'su-kien');
  const ngay = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, `${ngay}.jsonl`), JSON.stringify({ t: Date.now(), ...dong }) + '\n');
}
