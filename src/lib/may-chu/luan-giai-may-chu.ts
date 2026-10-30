// Luận giải trả phí sinh và khóa phía máy chủ. Chỉ gọi qua src/lib/luan-giai/ai/index.ts, nhà cung cấp `stub`.
import { lapLaSo, namAmHienTai, type ThongTinSinh } from '@/lib/tuvi';
import { khoaCache, PHIEN_BAN_QUY_TAC, sinhLuanGiai, timDaiVan, type ChuyenDeMa, type LuanGiai } from '@/lib/luan-giai/ai';
import { MA_VAN_NAM } from '@/lib/goi';
import { PHIEN_BAN_VAN_NAM, sinhVanNam, xemTruocVanNam, type BaiVanNam, type XemTruocVanNam } from '@/lib/luan-giai/ai/van-nam';
import type { Csdl } from './csdl';
import { coQuyenXem, laSoCuaToi, LoiNghiepVu } from './dich-vu';
import { giaiMaJson, khoaTim, maHoaJson, type BoKhoa } from './ma-hoa';

/** Chủ đề khách mua → chuyên đề luận giải. Tài chính, Gia đạo chưa có bộ quy tắc: hỏi thì 404. */
const CHUYEN_DE_CUA_CHU_DE: Record<string, ChuyenDeMa | null> = {
  'ban-than': 'menh', 'tinh-cam': 'phu-the', 'su-nghiep': 'quan-loc', 'tai-chinh': null, 'gia-dao': null,
  'van-10-nam': 'van-10-nam', // chỉ gói trọn lá số / thành viên
};
/** Chủ đề đã có nội dung luận (Tài chính, Gia đạo chưa có). */
export const CHU_DE_CO_NOI_DUNG = Object.keys(CHUYEN_DE_CUA_CHU_DE).filter((c) => c !== 'van-10-nam' && CHUYEN_DE_CUA_CHU_DE[c]);
export const CHU_DE_HOP_LE = [...Object.keys(CHUYEN_DE_CUA_CHU_DE), MA_VAN_NAM];

/** Trả lời cho chủ đề Vận năm: đã mua → bài đầy đủ; chưa mua → chỉ bản xem trước (không nội dung tháng, không mã quy tắc). */
export type VanNamTraVe = { daMua: true; bai: BaiVanNam } | { daMua: false; xemTruoc: XemTruocVanNam };

async function vanNamChoKhach(db: Csdl, k: BoKhoa, nguoiDungId: number, laSoId: number, bayGio: number): Promise<VanNamTraVe> {
  // Lá số không phải của người này: 403 như mọi chủ đề, không lộ gì.
  if (!laSoCuaToi(db, nguoiDungId, laSoId)) throw new LoiNghiepVu('chua_mua', 'Bạn chưa mở phần này.', 403);
  const hang = db.prepare('SELECT sinh_ma_hoa FROM la_so WHERE id=?').get(laSoId) as { sinh_ma_hoa: string };
  const ls = lapLaSo(giaiMaJson<ThongTinSinh>(hang.sinh_ma_hoa, k));
  if (!coQuyenXem(db, nguoiDungId, laSoId, MA_VAN_NAM, bayGio)) return { daMua: false, xemTruoc: xemTruocVanNam(ls) };
  const khoa = khoaTim(`${khoaCache(ls, MA_VAN_NAM, PHIEN_BAN_VAN_NAM)}`, k);
  const co = db.prepare('SELECT noi_dung_ma_hoa FROM luan_giai_luu WHERE khoa_cache=?').get(khoa) as { noi_dung_ma_hoa: string } | undefined;
  if (co) return { daMua: true, bai: giaiMaJson<BaiVanNam>(co.noi_dung_ma_hoa, k) };
  // boQuaCache: không ghi tệp đệm bản rõ trong .cache; bộ nhớ đệm duy nhất là bảng mã hóa.
  const bai = await sinhVanNam(ls, { boQuaCache: true });
  db.prepare('INSERT OR REPLACE INTO luan_giai_luu (khoa_cache, chuyen_de, phien_ban, noi_dung_ma_hoa) VALUES (?,?,?,?)').run(khoa, MA_VAN_NAM, PHIEN_BAN_VAN_NAM, maHoaJson(bai, k));
  return { daMua: true, bai };
}

export async function luanGiaiChoKhach(db: Csdl, k: BoKhoa, nguoiDungId: number, laSoId: number, chuDe: string, bayGio = Date.now()): Promise<LuanGiai | VanNamTraVe> {
  if (chuDe === MA_VAN_NAM) return vanNamChoKhach(db, k, nguoiDungId, laSoId, bayGio);
  if (!(chuDe in CHUYEN_DE_CUA_CHU_DE)) throw new LoiNghiepVu('chu_de_sai', 'Chủ đề không hợp lệ.');
  // Kiểm quyền TRƯỚC mọi việc khác; sai quyền không được biết chủ đề có nội dung hay không.
  if (!coQuyenXem(db, nguoiDungId, laSoId, chuDe === 'van-10-nam' ? null : chuDe, bayGio)) throw new LoiNghiepVu('chua_mua', 'Bạn chưa mở phần này.', 403);
  const chuyenDe = CHUYEN_DE_CUA_CHU_DE[chuDe];
  if (!chuyenDe) throw new LoiNghiepVu('chua_co_noi_dung', 'Chủ đề này đang được biên soạn.', 404);

  const hang = db.prepare('SELECT sinh_ma_hoa FROM la_so WHERE id=?').get(laSoId) as { sinh_ma_hoa: string };
  const ls = lapLaSo(giaiMaJson<ThongTinSinh>(hang.sinh_ma_hoa, k));
  const nam = namAmHienTai();
  const dv = chuyenDe === 'van-10-nam' ? timDaiVan(ls, nam) : null;
  // Khóa đệm: HMAC (không đảo ngược ra thông tin sinh); đại vận đổi theo cung vận đang đi.
  const khoa = khoaTim(`${khoaCache(ls, chuyenDe, PHIEN_BAN_QUY_TAC)}|${dv ? dv.thongTin.cung : ''}`, k);
  const co = db.prepare('SELECT noi_dung_ma_hoa FROM luan_giai_luu WHERE khoa_cache=?').get(khoa) as { noi_dung_ma_hoa: string } | undefined;
  if (co) return giaiMaJson<LuanGiai>(co.noi_dung_ma_hoa, k);

  // boQuaCache: không dùng/ghi tệp đệm bản rõ trong .cache; bộ nhớ đệm duy nhất là bảng mã hóa.
  const kq = await sinhLuanGiai(ls, chuyenDe, { nhaCungCap: 'stub', boQuaCache: true, namXem: nam });
  db.prepare('INSERT OR REPLACE INTO luan_giai_luu (khoa_cache, chuyen_de, phien_ban, noi_dung_ma_hoa) VALUES (?,?,?,?)').run(khoa, chuyenDe, PHIEN_BAN_QUY_TAC, maHoaJson(kq, k));
  return kq;
}
