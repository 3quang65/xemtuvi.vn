// Hỏi đáp về lá số (docs/san-pham/hoi-dap-la-so.md). Không gọi AI/dịch vụ ngoài: câu trả lời ghép từ nhận định có mã quy tắc
// của bài luận giải đã sinh cho lá số. Hạn mức đếm phía máy chủ, trừ lượt cùng giao dịch với việc ghi câu trả lời.
import { GHI_CHU, lamSachCau, type NhanDinh } from '@/lib/luan-giai/ai';
import tuCamJson from '@/lib/luan-giai/ai/tu-cam.json';
import { locTuCam, type TuCamCauHinh } from '@/lib/luan-giai/ai/loc';
import { dongCanCu } from '@/lib/luan-giai/can-cu';
import { MA_VAN_NAM } from '@/lib/goi';
import type { BaiVanNam } from '@/lib/luan-giai/ai/van-nam';
import type { Csdl } from './csdl';
import { dsQuyen, laSoCuaToi, LA_SO_THANH_VIEN, LoiNghiepVu } from './dich-vu';
import { CHU_DE_CO_NOI_DUNG, luanGiaiChoKhach } from './luan-giai-may-chu';
import { giaiMaJson, maHoaJson, type BoKhoa } from './ma-hoa';

export const HAN_MUC_THANG = 5;
export const DO_DAI_CAU_TOI_DA = 200;
const TU_CAM = tuCamJson as unknown as TuCamCauHinh;
const GIO_VN_MS = 7 * 3_600_000;

export type ChuDeHoi = 'ban-than' | 'tinh-cam' | 'su-nghiep' | 'tai-chinh' | 'gia-dao' | 'van-10-nam' | typeof MA_VAN_NAM;
const TEN_CHU_DE: Record<ChuDeHoi, string> = { 'ban-than': 'bản thân', 'tinh-cam': 'tình cảm', 'su-nghiep': 'sự nghiệp', 'tai-chinh': 'tài chính', 'gia-dao': 'gia đạo', 'van-10-nam': 'vận 10 năm', [MA_VAN_NAM]: 'vận năm 2027' };

/** Bỏ dấu, hạ chữ thường, chỉ còn chữ-số-khoảng trắng; viền khoảng trắng để khớp theo từ nguyên. */
const chuanHoa = (s: string) => ` ${s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;
const coCum = (t: string, ds: string[]) => ds.filter((c) => t.includes(` ${c} `));

// Bộ từ chối (mục 3): câu thuộc nhóm này không trả lời, không trừ lượt, hướng sang góc "hiểu mình, định hướng".
const TU_CHOI: { ma: string; tu: string[]; loiNhe: string }[] = [
  { ma: 'HD-TC-SUCKHOE', tu: ['suc khoe', 'benh', 'ung thu', 'tuoi tho', 'song bao lau', 'bao gio chet', 'khi nao chet', 'gio chet', 'chet', 'qua doi', 'mat som', 'tai nan', 'phau thuat', 'bi benh', 'tuoi mat', 'yeu menh', 'duong sinh'],
    loiNhe: 'Hệ thống xemtuvi.vn không luận về sức khỏe, bệnh tật hay tuổi thọ; chuyện này cần bác sĩ, không phải lá số. Bạn có thể hỏi về cách mình làm việc, nghỉ ngơi và giữ nhịp sống, ví dụ: “Tôi có tính cách thế nào?”.' },
  { ma: 'HD-TC-LYHON', tu: ['ly hon', 'ly di', 'chia tay', 'bo nhau', 'ngoai tinh', 'phan boi', 'co ly hon', 'do vo', 'tan vo'],
    loiNhe: 'Hệ thống xemtuvi.vn không dự đoán chuyện ly hôn hay chia tay. Bạn có thể hỏi về cách mình yêu và gắn bó để hiểu mình hơn trong quan hệ, ví dụ: “Tôi có xu hướng gắn bó thế nào trong tình cảm?”.' },
  { ma: 'HD-TC-NGAYGIO', tu: ['ngay tot', 'gio tot', 'ngay dep', 'gio dep', 'ngay gio', 'chon ngay', 'xem ngay', 'gio hoang dao', 'ngay hoang dao', 'khai truong', 'dong tho', 'nhap trach', 'ngay cuoi', 'ngay cuoi hoi', 'xuat hanh', 'ngay sinh con'],
    loiNhe: 'Hệ thống xemtuvi.vn không chọn ngày giờ tốt xấu. Bạn có thể hỏi về nhịp phát triển của mình trong năm, ví dụ: “Năm nay tôi nên tập trung vào điều gì?”.' },
  { ma: 'HD-TC-GIAIHAN', tu: ['giai han', 'cung sao', 'cung giai', 'bua', 'yem', ['hoa', 'giai'].join(' '), 'cau sieu', 'giai sao', 'tru ta', 'cai van', 'doi van', 'le chua', 'xin xam', 'tam linh', 'giai nghiep', 'bi hai'],
    loiNhe: 'Hệ thống xemtuvi.vn không hướng dẫn cúng bái, bùa chú hay cải vận. Lá số ở đây giúp bạn hiểu mình và định hướng; bạn có thể hỏi về điểm mạnh, điều cần chú ý của mình trong các chuyên đề.' },
  { ma: 'HD-TC-NGUOIKHAC', tu: ['chong toi', 'vo toi', 'chong minh', 'vo minh', 'nguoi yeu toi', 'nguoi yeu minh', 'con toi', 'con minh', 'sep toi', 'sep minh', 'ban toi', 'ban minh', 'dong nghiep toi', 'me toi', 'bo toi', 'ba toi', 'anh ay', 'chi ay', 'co ay', 'ong ay', 'ba ay', 'anh ta', 'co ta', 'nguoi ay', 'nguoi kia', 'nguoi do', 'doi phuong', 'hop tuoi', 'co hop voi', 'hop voi', 'la so cua ban', 'la so cua nguoi', 'la so cua anh', 'la so cua chi', 'chong cua', 'vo cua', 'nguoi yeu cua', 'con cua'],
    loiNhe: 'Hệ thống xemtuvi.vn chỉ trả lời về lá số của chính bạn, không luận giải về người khác hay xem hợp tuổi. Bạn có thể hỏi về cách mình ứng xử trong quan hệ, ví dụ: “Trong tình cảm, điểm mạnh và điều cần lưu ý của tôi là gì?”.' },
  { ma: 'HD-TC-DIENDOAN', tu: ['xo so', 'trung so', 'lo de', 'co bac', 'danh de', 'chung khoan', 'bitcoin', 'coin', 'co phieu', 'dao ngu', 'bao gio', 'tu vong'],
    loiNhe: 'Hệ thống xemtuvi.vn không đoán số may rủi, mốc thời gian chắc chắn hay chuyện được mất cụ thể. Bạn có thể hỏi về cách mình kiếm và giữ tiền, ví dụ: “Tôi có thế mạnh và điều cần lưu ý gì về tài chính?”.' },
];

// Bộ hiểu câu hỏi (mục 2): từ khóa → chuyên đề. Vận 10 năm, rồi Vận năm, rồi chuyên đề có nhiều từ khớp nhất (hòa thì theo thứ tự dưới).
const TU_KHOA: { cd: ChuDeHoi; tu: string[] }[] = [
  { cd: 'van-10-nam', tu: ['10 nam', 'muoi nam', 'dai van', 'van 10 nam', 'thap nien', 'giai doan 10 nam', 'nhung nam toi', 'nhung nam sap toi', 'trong 10 nam'] },
  { cd: MA_VAN_NAM, tu: ['nam nay', '2027', 'nam toi', 'dinh mui', 'van nam', 'trong nam nay', 'nam sau', 'nam 2027', 'thang nay', 'cuoi nam'] },
  { cd: 'tinh-cam', tu: ['tinh cam', 'tinh yeu', 'dang yeu', 'yeu nhau', 'hon nhan', 'ket hon', 'lay chong', 'lay vo', 'vo chong', 'chong', 'vo', 'nguoi yeu', 'ban doi', 'gan bo', 'phu the', 'doc than', 'hen ho', 'cach yeu', 'quan he tinh cam'] },
  { cd: 'su-nghiep', tu: ['su nghiep', 'cong viec', 'nghe nghiep', 'quan loc', 'lam viec', 'thang tien', 'khoi nghiep', 'kinh doanh', 'doi viec', 'nhay viec', 'cong danh', 'nganh', 'viec lam', 'lam ngan', 'quan ly', 'lanh dao'] },
  { cd: 'tai-chinh', tu: ['tien', 'tai chinh', 'tai loc', 'tai bach', 'giau', 'kiem tien', 'giu tien', 'thu nhap', 'dau tu', 'tiet kiem', 'luong', 'lam giau', 'chi tieu', 'tai san', 'no nan'] },
  { cd: 'gia-dao', tu: ['gia dao', 'nha cua', 'nha', 'gia dinh', 'cha me', 'bo me', 'anh chi em', 'con cai', 'tu tuc', 'dien trach', 'bat dong san', 'mua nha', 'nep nha', 'phu mau', 'huynh de', 'nguoi than'] },
  { cd: 'ban-than', tu: ['ban than', 'tinh cach', 'diem manh', 'diem yeu', 'ban menh', 'menh', 'tong quan', 'dinh huong', 'nang luc', 'so truong', 'la so cua toi', 'toi la nguoi', 'minh la nguoi', 'tinh cach cua toi', 'khac biet', 'phat trien'] },
];

export type Hieu =
  | { loai: 'tu_choi'; ma: string; loiNhe: string }
  | { loai: 'chu_de'; chuDe: ChuDeHoi }
  | { loai: 'khong_khop' };

/** Câu hỏi → từ chối, chuyên đề, hoặc không hiểu. Từ chối được xét trước mọi từ khóa chuyên đề. */
export function hieuCauHoi(cau: string): Hieu {
  const t = chuanHoa(cau);
  for (const r of TU_CHOI) if (coCum(t, r.tu).length) return { loai: 'tu_choi', ma: r.ma, loiNhe: r.loiNhe };
  for (const k of TU_KHOA.slice(0, 2)) if (coCum(t, k.tu).length) return { loai: 'chu_de', chuDe: k.cd };
  let tot: { cd: ChuDeHoi; n: number } | null = null;
  for (const k of TU_KHOA.slice(2)) {
    const n = coCum(t, k.tu).length;
    if (n && (!tot || n > tot.n)) tot = { cd: k.cd, n };
  }
  return tot ? { loai: 'chu_de', chuDe: tot.cd } : { loai: 'khong_khop' };
}

export interface NhanDinhTraLoi { text: string; canCu: string; quyTacId: string; sao: string[]; cung: string; nguon: string; truongPhai: string }
export interface TraLoi { chuDe: ChuDeHoi; doan_dan: string; nhanDinh: NhanDinhTraLoi[]; ghiChu: string }
export interface LuotHoi { con_lai: number; lam_moi: string }
export type KetQuaHoi =
  | ({ ket_qua: 'tra_loi'; tra_loi: TraLoi } & LuotHoi)
  | ({ ket_qua: 'tu_choi'; tra_loi: { ma: string; doan_dan: string; nhanDinh: [] } } & LuotHoi)
  | ({ ket_qua: 'khong_khop'; tra_loi: { ma: string; doan_dan: string; nhanDinh: [] } } & LuotHoi);

const thangCua = (bayGio: number) => new Date(bayGio + GIO_VN_MS).toISOString().slice(0, 7);
/** Ngày đầu tháng sau (giờ VN), dạng d/m/yyyy. */
function ngayLamMoi(bayGio: number): string {
  const d = new Date(bayGio + GIO_VN_MS);
  const [n, th] = d.getUTCMonth() === 11 ? [d.getUTCFullYear() + 1, 1] : [d.getUTCFullYear(), d.getUTCMonth() + 2];
  return `1/${th}/${n}`;
}
export function conLai(db: Csdl, nguoiDungId: number, bayGio = Date.now()): LuotHoi {
  const n = (db.prepare('SELECT COUNT(*) n FROM hoi_dap WHERE nguoi_dung_id=? AND thang=?').get(nguoiDungId, thangCua(bayGio)) as { n: number }).n;
  return { con_lai: Math.max(0, HAN_MUC_THANG - n), lam_moi: ngayLamMoi(bayGio) };
}

/** Quyền hỏi: thành viên năm còn hạn và lá số nằm trong 3 lá số đầu của người này. Lá số người khác cũng 403 như chưa mua (không lộ gì). */
export function kiemQuyenHoi(db: Csdl, nguoiDungId: number, laSoId: number, bayGio = Date.now()): void {
  const chua = () => new LoiNghiepVu('chua_mua', 'Tính năng hỏi đáp dành cho Thành viên năm.', 403);
  if (!laSoCuaToi(db, nguoiDungId, laSoId)) throw chua();
  const dau = (db.prepare('SELECT id FROM la_so WHERE nguoi_dung_id=? ORDER BY id LIMIT ?').all(nguoiDungId, LA_SO_THANH_VIEN) as { id: number }[]).map((r) => r.id);
  if (!dsQuyen(db, nguoiDungId, bayGio).some((q) => q.loai === 'thanh_vien') || !dau.includes(laSoId)) throw chua();
}

interface UngVien { text: string; ref: NhanDinh['thamChieu']; muc: number }

/** Chọn tối đa 3 nhận định, mỗi mục tối đa 2, ưu tiên câu có nhiều từ trùng với câu hỏi; hòa thì theo thứ tự bài luận (ổn định). */
function chonNhanDinh(uv: UngVien[], cau: string): NhanDinhTraLoi[] {
  const tu = new Set(chuanHoa(cau).trim().split(' ').filter((w) => w.length >= 3));
  const diem = (u: UngVien) => chuanHoa(u.text).trim().split(' ').filter((w) => tu.has(w)).length;
  const xep = uv.map((u, i) => ({ u, i, d: diem(u) })).sort((a, b) => b.d - a.d || a.i - b.i);
  const dem = new Map<number, number>(); const chon: typeof xep = [];
  for (const x of xep) {
    if (chon.length === 3) break;
    if ((dem.get(x.u.muc) ?? 0) >= 2) continue;
    dem.set(x.u.muc, (dem.get(x.u.muc) ?? 0) + 1); chon.push(x);
  }
  return chon.sort((a, b) => a.i - b.i).map(({ u }) => ({
    text: u.text, canCu: dongCanCu(u.ref), quyTacId: u.ref.quyTacId, sao: u.ref.sao, cung: u.ref.cung, nguon: u.ref.nguon, truongPhai: u.ref.truongPhai,
  }));
}

/** Gom nhận định có mã từ bài luận; lọc lamSachCau + từ cấm; bỏ câu không mã. */
function ungVien(bai: { muc: { nhanDinh: { text: string; thamChieu: NhanDinh['thamChieu'] }[] }[] }): UngVien[] {
  const kq: UngVien[] = [];
  bai.muc.forEach((m, muc) => m.nhanDinh.forEach((n) => {
    if (!n.thamChieu?.quyTacId) return;
    const text = locTuCam(lamSachCau(n.text), TU_CAM);
    if (text) kq.push({ text, ref: n.thamChieu, muc });
  }));
  return kq;
}

async function soanTraLoi(db: Csdl, k: BoKhoa, nguoiDungId: number, laSoId: number, chuDe: ChuDeHoi, cau: string, bayGio: number): Promise<TraLoi | null> {
  if (chuDe !== MA_VAN_NAM && chuDe !== 'van-10-nam' && !CHU_DE_CO_NOI_DUNG.includes(chuDe)) return null;
  const bai = await luanGiaiChoKhach(db, k, nguoiDungId, laSoId, chuDe, bayGio);
  if ('daMua' in bai) {
    if (!bai.daMua) return null;
    const b: BaiVanNam = bai.bai;
    const nd = chonNhanDinh(ungVien({ muc: [{ nhanDinh: b.dauBai.nhanDinh }, ...b.muc] }), cau);
    return nd.length ? { chuDe, doan_dan: `Về vận năm ${b.namXem} (${b.canChi}) trong lá số của bạn, hệ thống xemtuvi.vn thấy những điểm sau:`, nhanDinh: nd, ghiChu: b.ghiChu || GHI_CHU } : null;
  }
  const nd = chonNhanDinh(ungVien(bai), cau);
  if (!nd.length) return null;
  const dan = chuDe === 'van-10-nam' && bai.van
    ? `Về vận 10 năm (đại vận cung ${bai.van.cung}, khoảng năm ${bai.van.namTu}–${bai.van.namDen}) trong lá số của bạn, hệ thống xemtuvi.vn thấy những điểm sau:`
    : `Về chuyên đề ${TEN_CHU_DE[chuDe]} trong lá số của bạn, hệ thống xemtuvi.vn thấy những điểm sau:`;
  return { chuDe, doan_dan: dan, nhanDinh: nd, ghiChu: bai.ghiChu || GHI_CHU };
}

const KHONG_KHOP = { ma: 'HD-KHONG-KHOP', doan_dan: 'Hệ thống xemtuvi.vn chưa trả lời được câu này. Bạn thử hỏi theo một chuyên đề như bản thân, tình cảm, sự nghiệp, tài chính, gia đạo, vận 10 năm hoặc vận năm 2027. Câu này không bị trừ lượt.', nhanDinh: [] as [] };

/** Hỏi một câu. Chỉ trừ lượt khi đã trả lời được; việc đếm và ghi nằm trong một giao dịch chiếm khóa ghi, nên gửi song song không vượt hạn mức. */
export async function hoiLaSo(db: Csdl, k: BoKhoa, nguoiDungId: number, laSoId: number, cauTho: unknown, bayGio = Date.now()): Promise<KetQuaHoi> {
  kiemQuyenHoi(db, nguoiDungId, laSoId, bayGio);
  if (typeof cauTho !== 'string') throw new LoiNghiepVu('cau_sai', 'Bạn hãy nhập câu hỏi.');
  const cau = cauTho.normalize('NFC').replace(/\s+/g, ' ').trim();
  if (!cau) throw new LoiNghiepVu('cau_sai', 'Bạn hãy nhập câu hỏi.');
  if (cau.length > DO_DAI_CAU_TOI_DA) throw new LoiNghiepVu('cau_dai', `Câu hỏi tối đa ${DO_DAI_CAU_TOI_DA} ký tự.`);
  const luot = () => conLai(db, nguoiDungId, bayGio);
  const h = hieuCauHoi(cau);
  if (h.loai === 'tu_choi') return { ket_qua: 'tu_choi', tra_loi: { ma: h.ma, doan_dan: h.loiNhe, nhanDinh: [] }, ...luot() };
  if (h.loai === 'khong_khop') return { ket_qua: 'khong_khop', tra_loi: KHONG_KHOP, ...luot() };
  if (luot().con_lai === 0) throw new LoiNghiepVu('het_luot', `Bạn đã dùng hết ${HAN_MUC_THANG} câu của tháng này. Lượt mới mở từ ngày ${ngayLamMoi(bayGio)}.`, 429);
  const tl = await soanTraLoi(db, k, nguoiDungId, laSoId, h.chuDe, cau, bayGio);
  if (!tl) return { ket_qua: 'khong_khop', tra_loi: KHONG_KHOP, ...luot() };
  const thang = thangCua(bayGio);
  const ghi = db.transaction(() => {
    const n = (db.prepare('SELECT COUNT(*) n FROM hoi_dap WHERE nguoi_dung_id=? AND thang=?').get(nguoiDungId, thang) as { n: number }).n;
    if (n >= HAN_MUC_THANG) throw new LoiNghiepVu('het_luot', `Bạn đã dùng hết ${HAN_MUC_THANG} câu của tháng này. Lượt mới mở từ ngày ${ngayLamMoi(bayGio)}.`, 429);
    db.prepare('INSERT INTO hoi_dap (nguoi_dung_id, la_so_id, luc, thang, noi_dung_ma_hoa) VALUES (?,?,?,?,?)').run(nguoiDungId, laSoId, bayGio, thang, maHoaJson({ cau, tra_loi: tl }, k));
  });
  ghi.immediate(); // chiếm khóa ghi ngay từ đầu: hai tiến trình pm2 cùng ở câu 5 chỉ một bên ghi được
  return { ket_qua: 'tra_loi', tra_loi: tl, ...luot() };
}

export interface MucLichSu { id: number; luc: number; cau: string; tra_loi: TraLoi }
/** Lịch sử hỏi đáp của lá số (mới nhất trước); xem lại không tốn lượt. */
export function lichSuHoi(db: Csdl, k: BoKhoa, nguoiDungId: number, laSoId: number, bayGio = Date.now()) {
  kiemQuyenHoi(db, nguoiDungId, laSoId, bayGio);
  const hang = db.prepare('SELECT id, luc, noi_dung_ma_hoa AS nd FROM hoi_dap WHERE nguoi_dung_id=? AND la_so_id=? ORDER BY id DESC LIMIT 100').all(nguoiDungId, laSoId) as { id: number; luc: number; nd: string }[];
  const lich_su: MucLichSu[] = hang.map((h) => ({ id: h.id, luc: h.luc, ...giaiMaJson<{ cau: string; tra_loi: TraLoi }>(h.nd, k) }));
  return { lich_su, ...conLai(db, nguoiDungId, bayGio) };
}
