// Sinh luận giải theo chuyên đề (Mệnh, Quan Lộc, Phu Thê): mỗi nhận định truy về một quy tắc có nguồn.
// Nhận định chỉ sinh từ quy tắc KHỚP với lá số. Nhà cung cấp mặc định "stub" (không mạng);
// "claude" chỉ bật khi LUANGIAI_AI=claude VÀ có hàm gọi được truyền vào (khung, chưa nối API thật).
import fs from 'node:fs';
import path from 'node:path';
import type { LaSo, Sao } from '@/lib/tuvi';
import chuyenDeJson from './chuyen-de.json';
import quyTacJson from './quy-tac.json';
import tuCamJson from './tu-cam.json';
import { bam, doc, ghi, thongKe, xoaBoNho } from './cache';
import { kiemTraMaSauViet, locTuCam, type TuCamCauHinh } from './loc';
import { cungKhopDieuKien, khopQuyTac, type QuyTacV2 } from './khop-v2';
import khungJson from './quy-tac-khung.json';

export { xoaBoNho };
export const thongKeCache = thongKe;

export type ChuyenDeMa = 'menh' | 'quan-loc' | 'phu-the';

export interface QuyTac {
  id: string;
  chuyenDe: string;
  cung: string;
  sao: string[];
  dieuKien: { doSang?: string[]; hoa?: string; cungCo?: string };
  noiDung: string;
  nguon: string;
  truongPhai: string;
  muc?: string;
}

interface ChuyenDeCauHinh {
  ten: string;
  cungChinh: string;
  muc: { id: string; tieuDe: string; huongDan: string }[];
}

export interface NhanDinh {
  text: string;
  thamChieu: {
    quyTacId: string;
    sao: string[];
    cung: string;
    nguon: string;
    truongPhai: string;
    /** Cung thực sự chứa yếu tố khớp (chỉ quy tắc bản 2: sao ở cung hợp chiếu). Thiếu thì sao nằm ở `cung`. */
    cungLienQuan?: string[];
    /** Yếu tố không phải sao: Tuần, Triệt, Vô Chính Diệu, "Cách <tên>". */
    yeuTo?: string[];
  };
}
export interface LuanGiai {
  chuyenDe: ChuyenDeMa;
  muc: { id: string; tieuDe: string; nhanDinh: NhanDinh[] }[];
  ghiChu: string;
  phienBan: string;
}

export interface CauCap {
  id: string;
  noiDung: string;
}
/** Nhà cung cấp viết lại: nhận các câu được cấp, trả văn bản mỗi dòng một câu có đuôi [MÃ]. */
export interface NhaCungCapAI {
  ten: string;
  vietLai(cau: CauCap[], promptHeThong: string): Promise<string>;
}
export interface TuyChon {
  nhaCungCap?: 'stub' | 'claude' | NhaCungCapAI;
  /** Hàm gọi mô hình thật, chỉ dùng khi bật "claude". Chưa truyền thì tự về stub. */
  goiClaude?: (promptHeThong: string, duLieu: string) => Promise<string>;
  boQuaCache?: boolean;
}

export const GHI_CHU =
  'Luận giải do hệ thống xemtuvi.vn tạo tự động từ các quy tắc Tử Vi có ghi nguồn; nội dung mang tính tham khảo, giúp hiểu mình và định hướng, không phải lời đoán chắc về tương lai.';

/** Quy tắc bản 2 (định dạng máy đọc, docs/luan-giai/quy-tac-v2/DINH-DANG.md) kèm vài trường của bộ ghép. */
type QuyTacBan2 = QuyTacV2 & { yeuTo?: string[] };

const CHUYEN_DE = chuyenDeJson as unknown as Record<string, ChuyenDeCauHinh>;

/** Bỏ đuôi khuôn của bộ quy tắc cũ (kiem-duyet-1.md, mục 5.7): "góp thêm sắc thái…", "Độ sáng tốt, nên phát huy chủ động". */
export function lamSachCau(cau: string): string {
  let kq = cau
    .replace(/,?\s*góp thêm sắc thái cho chuyên đề [^.]*\.?/g, '.')
    .replace(/\s*Độ sáng tốt, nên phát huy chủ động\.?/g, '')
    .replace(/\.\.+/g, '.')
    .trim();
  if (kq && !/[.!?]$/.test(kq)) kq += '.';
  return kq;
}
const QUY_TAC = (quyTacJson as unknown as QuyTac[]).map((q) => ({ ...q, noiDung: lamSachCau(q.noiDung) }));

/** Quy tắc bản 2: thư mục quy-tac-v2/ (Hạnh soạn) cộng bộ khung sinh bằng scripts/luan-giai/tao-khung.cjs. */
function napBan2(): QuyTacBan2[] {
  const dir = path.join(process.cwd(), 'src/lib/luan-giai/ai/quy-tac-v2');
  const tep = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : [];
  const tuThuMuc = tep.flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as QuyTacBan2[]);
  return [...(khungJson as unknown as QuyTacBan2[]), ...tuThuMuc];
}
const QUY_TAC_2 = napBan2();
const TU_CAM = tuCamJson as unknown as TuCamCauHinh;
const PROMPT = fs.readFileSync(path.join(process.cwd(), 'src/lib/luan-giai/ai/prompt-he-thong.md'), 'utf8');
export const PHIEN_BAN_QUY_TAC = bam(JSON.stringify([QUY_TAC, QUY_TAC_2, CHUYEN_DE, TU_CAM, PROMPT])).slice(0, 12);

export function nhaCungCapDangDung(yeuCau: TuyChon['nhaCungCap']): 'stub' | 'claude' | string {
  if (typeof yeuCau === 'object' && yeuCau) return yeuCau.ten;
  return yeuCau === 'claude' && process.env.LUANGIAI_AI === 'claude' ? 'claude' : 'stub';
}

export function khoaCache(ls: LaSo, chuyenDe: string, phienBan: string): string {
  const sinh = [ls.duong.nam, ls.duong.thang, ls.duong.ngay, ls.gio.dongHo, ls.gioChuan.gio, ls.gioiTinh, JSON.stringify(ls.quyUoc)];
  return bam([...sinh, chuyenDe, phienBan].join('|'));
}

function tatCaSao(ls: LaSo, tenCung: string): { sao: Sao[]; tuan: boolean; triet: boolean } | null {
  const c = ls.cung.find((x) => x.ten === tenCung);
  return c ? { sao: [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh], tuan: c.tuan, triet: c.triet } : null;
}

interface KetQuaKhop {
  sao: string[];
  yeuTo: string[];
  cungLienQuan?: string[];
  cau: string;
  uuTien: number;
  cungGoc: string;
  q: { id: string; chuyenDe: string; muc?: string; nguon: string; truongPhai: string };
}

/** Quy tắc cũ khớp lá số → danh sách sao thực sự khớp (rỗng nếu quy tắc không đòi sao) và yếu tố Tuần/Triệt/Vô chính diệu; null nếu không khớp. */
function khop(ls: LaSo, q: QuyTac): { sao: string[]; yeuTo: string[] } | null {
  const c = ls.cung.find((x) => x.ten === q.cung);
  const t = tatCaSao(ls, q.cung);
  if (!c || !t) return null;
  const co = (ten: string) => t.sao.find((s) => s.ten === ten);
  for (const s of q.sao) if (!co(s)) return null;
  const k = q.dieuKien ?? {};
  const dau = q.sao[0] ? co(q.sao[0]) : undefined;
  if (k.doSang && !(dau?.dacTinhTen && k.doSang.includes(dau.dacTinhTen))) return null;
  let saoKhop = [...q.sao];
  const yeuTo: string[] = [];
  if (k.hoa) {
    if (dau) { if (dau.hoa !== k.hoa) return null; }
    else {
      saoKhop = t.sao.filter((s) => s.hoa === k.hoa).map((s) => s.ten);
      if (!saoKhop.length) return null;
    }
  }
  if (k.cungCo) {
    if (k.cungCo === 'Tuần') { if (!t.tuan) return null; }
    else if (k.cungCo === 'Triệt') { if (!t.triet) return null; }
    else if (k.cungCo === 'Vô Chính Diệu') { if (c.chinhTinh.length) return null; }
    else if (!co(k.cungCo)) return null;
    if (['Tuần', 'Triệt', 'Vô Chính Diệu'].includes(k.cungCo)) yeuTo.push(k.cungCo);
  }
  return { sao: saoKhop, yeuTo };
}

/** Quy tắc bản 2 khớp lá số → câu đã điền tên sao, tên cung; null nếu không khớp. */
function khopBan2(ls: LaSo, q: QuyTacBan2): KetQuaKhop | null {
  const sao = khopQuyTac(ls, q);
  if (sao === null) return null;
  const goc = ls.cung.find((c) => c.ten === q.cung)!;
  const cung = [...new Set(q.dieuKien.flatMap((k) => cungKhopDieuKien(ls, goc, k).map((c) => c.ten)))];
  const cau = q.noiDung.replaceAll('{sao}', sao.join(', ')).replaceAll('{cung}', cung.join(' và '));
  return {
    sao, yeuTo: q.yeuTo ?? [], cungLienQuan: cung, cau, uuTien: q.uuTien ?? 0, cungGoc: q.cung,
    q: { id: q.id, chuyenDe: q.chuyenDe, muc: q.muc, nguon: q.nguon.join('; '), truongPhai: q.truongPhai },
  };
}

export async function sinhLuanGiai(ls: LaSo, chuyenDe: ChuyenDeMa, tuyChon: TuyChon = {}): Promise<LuanGiai> {
  const cfg = CHUYEN_DE[chuyenDe];
  if (!cfg) throw new Error(`Chuyên đề không hợp lệ: ${chuyenDe}`);
  const khoa = khoaCache(ls, chuyenDe, PHIEN_BAN_QUY_TAC);
  if (!tuyChon.boQuaCache) {
    const co = doc<LuanGiai>(khoa);
    if (co) return co;
  }

  const khopDs: KetQuaKhop[] = [
    ...QUY_TAC.filter((q) => q.chuyenDe === chuyenDe).flatMap((q) => {
      const r = khop(ls, q);
      return r ? [{ ...r, cau: q.noiDung, uuTien: 0, cungGoc: q.cung, q }] : [];
    }),
    ...QUY_TAC_2.filter((q) => q.chuyenDe === chuyenDe).flatMap((q) => {
      const r = khopBan2(ls, q);
      return r ? [r] : [];
    }),
  ];
  const theoId = new Map(khopDs.map((x) => [x.q.id, x]));

  // Câu cấp cho nhà cung cấp; mặc định "stub" ghép thẳng từ quy tắc.
  const cap: CauCap[] = khopDs.map((x) => ({ id: x.q.id, noiDung: x.cau }));
  let cau: { text: string; id: string }[] = cap.map((c) => ({ text: c.noiDung, id: c.id }));
  const ncc = tuyChon.nhaCungCap;
  const dung = nhaCungCapDangDung(ncc);
  if (dung !== 'stub') {
    try {
      const van = typeof ncc === 'object' && ncc ? await ncc.vietLai(cap, PROMPT)
        : tuyChon.goiClaude ? await tuyChon.goiClaude(PROMPT, cap.map((c) => `${c.noiDung} [${c.id}]`).join('\n'))
        : null;
      if (van !== null) cau = kiemTraMaSauViet(van, new Set(theoId.keys()));
    } catch {
      // Lỗi nhà cung cấp: giữ bản stub, không để khách thấy lỗi.
    }
  }

  const muc = cfg.muc.map((m) => ({ id: m.id, tieuDe: m.tieuDe, nhanDinh: [] as { n: NhanDinh; u: number }[] }));
  const mucDau = muc.find((m) => m.id !== 'cach-cuc') ?? muc[0];
  const daCo = new Set<string>();
  for (const c of cau) {
    const x = theoId.get(c.id);
    if (!x || daCo.has(c.id)) continue;
    const text = locTuCam(c.text, TU_CAM);
    if (text === null) continue;
    daCo.add(c.id);
    const dich = muc.find((m) => m.id === x.q.muc) ?? mucDau;
    dich.nhanDinh.push({
      u: x.uuTien,
      n: {
        text,
        thamChieu: {
          quyTacId: x.q.id, sao: x.sao, cung: x.cungGoc, nguon: x.q.nguon, truongPhai: x.q.truongPhai,
          ...(x.cungLienQuan ? { cungLienQuan: x.cungLienQuan } : {}),
          ...(x.yeuTo.length ? { yeuTo: x.yeuTo } : {}),
        },
      },
    });
  }

  // Cách cục (mục đầu) xếp theo mức ưu tiên giảm dần; thứ tự ghép còn lại giữ nguyên.
  const mucRa = muc.map((m) => ({ id: m.id, tieuDe: m.tieuDe, nhanDinh: [...m.nhanDinh].sort((a, b) => b.u - a.u).map((x) => x.n) }));

  const kq: LuanGiai = { chuyenDe, muc: mucRa.filter((m) => m.nhanDinh.length), ghiChu: GHI_CHU, phienBan: PHIEN_BAN_QUY_TAC };
  if (!tuyChon.boQuaCache && dung === 'stub') ghi(khoa, kq);
  return kq;
}
