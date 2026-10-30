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
  /**
   * Phá cách mức 3 theo CHUNG-CC-08: khớp khi (a) sát tinh hoặc Hóa Kỵ hãm tọa thủ cung chính, hoặc (b) Hóa Kỵ hóa vào
   * một trong các sao tạo cách (mảng này), hoặc (c) tổng điểm phá tam phương >= 4. Chỉ cần đặt mảng (rỗng nếu không xét b).
   */
  phaCachMuc3?: string[];
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

const SAT_TINH = ['Địa Không', 'Địa Kiếp', 'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'];

const laPha = (s: Sao) => SAT_TINH.includes(s.ten) || s.hoa === 'Hóa Kỵ';

/**
 * Điểm phá cách theo CC-08: yếu tố phá (sát tinh, Không Kiếp, Hóa Kỵ) tọa thủ cung chính tính 2, ở xung chiếu / tam hợp tính 1;
 * Tuần, Triệt chỉ tính khi đóng ở chính cung (không chiếu, CHUNG-TP-04), 2 điểm mỗi yếu tố.
 */
export function phaCachMuc3(ls: LaSo, goc: Cung, saoCach: string[]): string[] | null {
  const ten = new Set<string>();
  let diem = (goc.tuan ? 2 : 0) + (goc.triet ? 2 : 0);
  for (const c of cungTheoViTri(ls, goc, 'tam-phuong')) {
    const pha = saoCua(c).filter(laPha);
    pha.forEach((s) => ten.add(s.ten));
    diem += (c === goc ? 2 : 1) * pha.length;
  }
  const hamToaThu = saoCua(goc).some((s) => laPha(s) && s.dacTinhTen === 'Hãm');
  const kyVaoCach = cungTheoViTri(ls, goc, 'tam-phuong').some((c) => saoCua(c).some((s) => saoCach.includes(s.ten) && s.hoa === 'Hóa Kỵ'));
  return hamToaThu || kyVaoCach || diem >= 4 ? [...ten] : null;
}

/** Một điều kiện → tên các sao khớp (mảng rỗng nếu điều kiện không đòi sao); null nếu không khớp. */
export function khopDieuKien(ls: LaSo, goc: Cung, k: DieuKien): string[] | null {
  if (k.gioiTinh && ls.gioiTinh !== k.gioiTinh) return null;
  if (k.canNam && !k.canNam.includes(ls.canChi.nam.split(' ')[0])) return null;
  if (k.phaCachMuc3) return phaCachMuc3(ls, goc, k.phaCachMuc3);
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

/** Các cung (trong vị trí của điều kiện) thực sự chứa yếu tố khớp: dùng điền tên cung vào câu luận. Chỉ gọi khi điều kiện đã khớp. */
export function cungKhopDieuKien(ls: LaSo, goc: Cung, k: DieuKien): Cung[] {
  if (k.phaCachMuc3) return cungTheoViTri(ls, goc, 'tam-phuong').filter((c) => saoCua(c).some(laPha));
  const ds = cungTheoViTri(ls, goc, k.viTri);
  const sao = k.sao ?? [];
  if (k.rai || k.toiThieu !== undefined) return ds.filter((c) => saoCua(c).some((s) => sao.includes(s.ten)));
  return ds.filter((c) => {
    const tat = saoCua(c);
    if (!sao.every((t) => tat.some((s) => s.ten === t))) return false;
    return cungDat(c, k, sao[0] ? tat.find((s) => s.ten === sao[0]) : undefined);
  });
}
