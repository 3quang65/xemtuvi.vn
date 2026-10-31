// Cờ khẩn đọc LÚC CHẠY (không cần build lại). Cách bật/tắt: docs/ky-thuat/co-khan.md.
// Thứ tự: tệp ~/xemtuvi-data/co-khan.json (có khóa thì thắng) → biến môi trường → mặc định (tắt cờ = chạy bình thường).
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { thuMucDuLieu } from './ma-hoa';

const CO = { moiTat: 'THU_KIN_MOI_TAT', capQuyen0dTat: 'THU_KIN_CAP_QUYEN_0D_TAT' } as const;
export type TenCo = keyof typeof CO;

const batGiaTri = (v: unknown) => v === true || v === 1 || v === '1' || v === 'true';

export function coKhan(ten: TenCo): boolean {
  const khoa = CO[ten];
  try {
    const f = process.env.CO_KHAN_FILE || path.join(thuMucDuLieu(), 'co-khan.json');
    const cfg = JSON.parse(readFileSync(f, 'utf8')) as Record<string, unknown>;
    if (cfg && typeof cfg === 'object' && khoa in cfg) return batGiaTri(cfg[khoa]);
  } catch { /* không có tệp hoặc hỏng = dùng biến môi trường */ }
  return batGiaTri(process.env[khoa]);
}

export const moiTat = () => coKhan('moiTat');
export const capQuyen0dTat = () => moiTat() || coKhan('capQuyen0dTat'); // tắt /moi thì cũng không cấp quyền 0đ qua mã mời
