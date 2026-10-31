export const TEN_SU_KIEN: string[];
export const KHAO_SAT: string[];
export const MA_BAI: string[];
export const NHANH: string[];
export const NHOM_NGUON: string[];
export function trangCua(ten: string): string;
export function nhomNguon(n: Record<string, unknown>): string;
export function kiemTraSuKien(b: unknown): ({ ten: string; phien: string; goi?: string; chuDe?: string; nhanh?: string; bai?: string; cach?: string; diem_a?: number; diem_c?: number; co_loi_b?: boolean; muc?: string; co?: boolean } & Record<string, string | number | boolean>) | null;
