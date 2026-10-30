export const K_KHAO_SAT: string;
export const BAY_NGAY_MS: number;
export const GIU_MS: number;
export interface TrangThaiKhaoSat { baiDaHoi: Record<string, number>; lanCuoi: number }
export function nenHoi(da: unknown, bai: string, bayGio: number): boolean;
export function danhDauDaHoi(da: unknown, bai: string, bayGio: number): TrangThaiKhaoSat;
