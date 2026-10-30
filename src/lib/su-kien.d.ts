export const TEN_SU_KIEN: string[];
export const NHOM_NGUON: string[];
export function trangCua(ten: string): string;
export function nhomNguon(n: Record<string, string | undefined>): string;
export function kiemTraSuKien(b: unknown): ({ ten: string; phien: string; goi?: string; chuDe?: string } & Record<string, string>) | null;
