// Mã hóa dữ liệu sinh của khách: AES-256-GCM; khoa_tim = HMAC-SHA256 để tìm trùng mà không giải mã.
// Khóa KHOA_DU_LIEU lấy từ biến môi trường hoặc ~/xemtuvi-data/.env (ngoài repo). Không bao giờ ghi/in khóa.
import { createCipheriv, createDecipheriv, createHmac, hkdfSync, randomBytes } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';

export const thuMucDuLieu = () => process.env.XTV_DATA_DIR || path.join(homedir(), 'xemtuvi-data');

export class LoiKhoa extends Error {}

function docKhoaTho(): string {
  const env = process.env.KHOA_DU_LIEU?.trim();
  if (env) return env;
  const tep = path.join(thuMucDuLieu(), '.env');
  if (existsSync(tep)) {
    for (const dong of readFileSync(tep, 'utf8').split(/\r?\n/)) {
      const m = /^\s*KHOA_DU_LIEU\s*=\s*(.*?)\s*$/.exec(dong);
      if (m) return m[1].replace(/^["']|["']$/g, '');
    }
  }
  throw new LoiKhoa('Thiếu KHOA_DU_LIEU (biến môi trường hoặc ~/xemtuvi-data/.env): không thể mở dữ liệu khách.');
}

export interface BoKhoa { mahoa: Buffer; bam: Buffer }

/** Tách một khóa gốc thành hai khóa độc lập (mã hóa, HMAC). Khóa gốc phải ≥ 16 ký tự. */
export function taoBoKhoa(khoaTho: string = docKhoaTho()): BoKhoa {
  if (khoaTho.length < 16) throw new LoiKhoa('KHOA_DU_LIEU quá ngắn (cần ≥ 16 ký tự).');
  const dk = (nhan: string) => Buffer.from(hkdfSync('sha256', khoaTho, 'xemtuvi.vn', nhan, 32));
  return { mahoa: dk('ma-hoa'), bam: dk('khoa-tim') };
}

export function maHoa(chu: string, k: BoKhoa): string {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', k.mahoa, iv);
  const ct = Buffer.concat([c.update(chu, 'utf8'), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), ct]).toString('base64');
}

/** Sai khóa hoặc dữ liệu bị sửa → ném lỗi (GCM xác thực). */
export function giaiMa(b64: string, k: BoKhoa): string {
  const b = Buffer.from(b64, 'base64');
  if (b.length < 28) throw new Error('Dữ liệu mã hóa không hợp lệ.');
  const d = createDecipheriv('aes-256-gcm', k.mahoa, b.subarray(0, 12));
  d.setAuthTag(b.subarray(12, 28));
  return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString('utf8');
}

export const khoaTim = (chu: string, k: BoKhoa) => createHmac('sha256', k.bam).update(chu).digest('hex');

export const maHoaJson = (v: unknown, k: BoKhoa) => maHoa(JSON.stringify(v), k);
export const giaiMaJson = <T = unknown>(b64: string, k: BoKhoa) => JSON.parse(giaiMa(b64, k)) as T;
