// Bộ khớp quy tắc luận giải bản 2 (việc L-90ad99): điều kiện máy đọc theo tam phương tứ chính.
// Đặc tả định dạng: docs/luan-giai/quy-tac-v2/DINH-DANG.md. Chưa nối vào sinhLuanGiai (bước 3, Bảo).
import type { Cung, LaSo, Sao } from '@/lib/tuvi';

export type ViTri = 'chinh' | 'xung' | 'tam-hop' | 'tam-phuong' | 'hop-chieu' | 'giap';
export type DoSang = 'Miếu' | 'Vượng' | 'Đắc' | 'Bình' | 'Hãm';
export type LoaiQuyTac = 'YN' | 'CT' | 'C' | 'SP' | 'CC' | 'HOA' | 'TUAN' | 'TRIET' | 'VCD';

export interface DieuKien {
  sao?: string[];
  /** Các sao rải trong cả vị trí (không cần cùng một cung). */
  rai?: boolean;
  /** Chỉ cần ít nhất n sao trong `sao` có mặt (rải trong vị trí). */
  toiThieu?: number;
  viTri?: ViTri;
  doSang?: DoSang[];
  hoa?: 'Hóa Lộc' | 'Hóa Quyền' | 'Hóa Khoa' | 'Hóa Kỵ';
  chi?: string[];
  tuan?: boolean;
  triet?: boolean;
  voChinhDieu?: boolean;
  gioiTinh?: 'Nam' | 'Nữ';
  /** Can năm sinh, vd ["Đinh"]. */
  canNam?: string[];
}

export interface QuyTacV2 {
  id: string;
  chuyenDe: string;
  /** Cung gốc để tính vị trí (thường là cung chính của chuyên đề). */
  cung: string;
  loai: LoaiQuyTac;
  maNghienCuu: string[];
  dieuKien: DieuKien[];
  khong?: DieuKien[];
  cachCuc?: string;
  phaCach?: boolean;
  uuTien?: number;
  muc: string;
  noiDung: string;
  nguon: string[];
  nguonChiTiet?: string;
  truongPhai: string;
  ghiChu?: string;
}

const saoCua = (c: Cung): Sao[] => [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh];

export function cungTheoViTri(ls: LaSo, goc: Cung, viTri: ViTri = 'chinh'): Cung[] {
  const theoChi = (d: number) => ls.cung.find((c) => c.chi === (goc.chi + d + 12) % 12)!;
  switch (viTri) {
    case 'chinh': return [goc];
    case 'xung': return [theoChi(6)];
    case 'tam-hop': return [theoChi(4), theoChi(8)];
    case 'hop-chieu': return [theoChi(6), theoChi(4), theoChi(8)];
    case 'tam-phuong': return [goc, theoChi(6), theoChi(4), theoChi(8)];
    case 'giap': return [theoChi(-1), theoChi(1)];
  }
}

function cungDat(c: Cung, k: DieuKien, dau?: Sao): boolean {
  if (k.chi && !k.chi.includes(c.tenChi)) return false;
  if (k.tuan !== undefined && c.tuan !== k.tuan) return false;
  if (k.triet !== undefined && c.triet !== k.triet) return false;
  if (k.voChinhDieu !== undefined && (c.chinhTinh.length === 0) !== k.voChinhDieu) return false;
  if (k.doSang && !(dau?.dacTinhTen && k.doSang.includes(dau.dacTinhTen))) return false;
  if (k.hoa) {
    if (dau) { if (dau.hoa !== k.hoa) return false; }
    else if (!saoCua(c).some((s) => s.hoa === k.hoa)) return false;
  }
  return true;
}

/** Một điều kiện → tên các sao khớp (mảng rỗng nếu điều kiện không đòi sao); null nếu không khớp. */
export function khopDieuKien(ls: LaSo, goc: Cung, k: DieuKien): string[] | null {
  if (k.gioiTinh && ls.gioiTinh !== k.gioiTinh) return null;
  if (k.canNam && !k.canNam.includes(ls.canChi.nam.split(' ')[0])) return null;
  const ds = cungTheoViTri(ls, goc, k.viTri);
  const sao = k.sao ?? [];
  if (k.rai || k.toiThieu !== undefined) {
    const co = sao.filter((t) => ds.some((c) => saoCua(c).some((s) => s.ten === t)));
    if (co.length < (k.toiThieu ?? sao.length)) return null;
    return ds.some((c) => cungDat(c, { ...k, doSang: undefined, hoa: undefined })) ? co : null;
  }
  for (const c of ds) {
    const tat = saoCua(c);
    if (!sao.every((t) => tat.some((s) => s.ten === t))) continue;
    const dau = sao[0] ? tat.find((s) => s.ten === sao[0]) : undefined;
    if (!cungDat(c, k, dau)) continue;
    if (!sao.length && k.hoa) return tat.filter((s) => s.hoa === k.hoa).map((s) => s.ten);
    return [...sao];
  }
  return null;
}

/** Quy tắc khớp lá số → sao khớp (gộp, không trùng); null nếu không khớp. */
export function khopQuyTac(ls: LaSo, q: QuyTacV2): string[] | null {
  const goc = ls.cung.find((c) => c.ten === q.cung);
  if (!goc) return null;
  const sao = new Set<string>();
  for (const k of q.dieuKien) {
    const r = khopDieuKien(ls, goc, k);
    if (r === null) return null;
    r.forEach((s) => sao.add(s));
  }
  for (const k of q.khong ?? []) if (khopDieuKien(ls, goc, k) !== null) return null;
  return [...sao];
}
