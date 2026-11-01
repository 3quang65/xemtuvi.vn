// Giới hạn tốc độ theo IP, bộ đếm trong bộ nhớ (mỗi tiến trình một bộ), cửa sổ cố định.
// Biến môi trường: RATE_LIMIT_MAX (mặc định 60 yêu cầu/IP/cửa sổ), RATE_LIMIT_WINDOW_S (mặc định 60 giây).
export type CauHinhToc = { toiDa: number; cuaSoMs: number };
export type KetQuaToc = { choPhep: boolean; retryAfter: number };

const so = (v: string | undefined, md: number) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? Math.floor(n) : md; };

export function docCauHinh(env: Record<string, string | undefined> = process.env): CauHinhToc {
  return { toiDa: so(env.RATE_LIMIT_MAX, 60), cuaSoMs: so(env.RATE_LIMIT_WINDOW_S, 60) * 1000 };
}

export function taoBoDem(cfg: CauHinhToc) {
  const dem = new Map<string, { batDau: number; n: number }>();
  let donLanCuoi = 0;
  return {
    kiemTra(khoa: string, bay = Date.now()): KetQuaToc {
      if (bay - donLanCuoi > cfg.cuaSoMs) { // dọn mục hết hạn để Map không phình
        donLanCuoi = bay;
        for (const [k, v] of dem) if (bay - v.batDau >= cfg.cuaSoMs) dem.delete(k);
      }
      let m = dem.get(khoa);
      if (!m || bay - m.batDau >= cfg.cuaSoMs) { m = { batDau: bay, n: 0 }; dem.set(khoa, m); }
      m.n++;
      if (m.n <= cfg.toiDa) return { choPhep: true, retryAfter: 0 };
      return { choPhep: false, retryAfter: Math.max(1, Math.ceil((m.batDau + cfg.cuaSoMs - bay) / 1000)) };
    },
  };
}

const DUONG_DAN = ['/api/la-so', '/api/luan-giai'];
export const canGioiHan = (pathname: string) => DUONG_DAN.some((p) => pathname === p || pathname.startsWith(p + '/'));

let bo: ReturnType<typeof taoBoDem> | null = null;
export const datLai = () => { bo = null; };

export function kiemTraYeuCau(req: { headers: { get(k: string): string | null } }, bay = Date.now()): KetQuaToc {
  bo ??= taoBoDem(docCauHinh());
  const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'khong-ro';
  return bo.kiemTra(ip, bay);
}
