// Nhật ký lỗi: một dòng JSON mỗi lỗi vào ~/xemtuvi-data/nhat-ky/loi-YYYY-MM-DD.jsonl.
// Không ghi email, thông tin sinh, cookie: người gọi chỉ truyền mã lỗi và thông điệp chung.
import { appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { thuMucDuLieu } from './ma-hoa';

export function ghiLoi(muc: string, route: string, maLoi: string, thongDiep: string, bayGio = new Date()): void {
  try {
    const dir = process.env.NHAT_KY_DIR || path.join(thuMucDuLieu(), 'nhat-ky');
    mkdirSync(dir, { recursive: true });
    const ngay = new Date(bayGio.getTime() + 7 * 3600_000).toISOString().slice(0, 10); // giờ Việt Nam, khớp tools/loi-hom-nay.cjs
    const dong = JSON.stringify({ t: bayGio.toISOString(), muc, route, ma_loi: maLoi, thong_diep: thongDiep.slice(0, 300) });
    appendFileSync(path.join(dir, `loi-${ngay}.jsonl`), dong + '\n');
  } catch {
    // Không ghi được nhật ký thì thôi, không làm hỏng yêu cầu của khách.
  }
}
