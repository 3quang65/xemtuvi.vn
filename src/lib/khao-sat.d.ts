export const TOI_DA: number;
export function thuMuc(): string;
export function tepPhanHoi(): string;
export function kiemPhanHoi(b: unknown): { bai: string; goi: string; diem_a: number; loi: string } | null;
export function luuPhanHoi(p: { bai: string; goi: string; diem_a: number; loi: string }, bayGio?: number): Promise<string>;
