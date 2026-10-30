// Luận giải trả phí sinh và khóa phía máy chủ. Chỉ gọi qua src/lib/luan-giai/ai/index.ts, nhà cung cấp `stub`.
import { lapLaSo, namAmHienTai, type ThongTinSinh } from '@/lib/tuvi';
import { khoaCache, PHIEN_BAN_QUY_TAC, sinhLuanGiai, timDaiVan, type ChuyenDeMa, type LuanGiai } from '@/lib/luan-giai/ai';
import { MA_VAN_NAM } from '@/lib/goi';
import { baiVanNamGiaLap } from '@/lib/van-nam-mau';
import type { Csdl } from './csdl';
import { coQuyenXem, LoiNghiepVu } from './dich-vu';
import { giaiMaJson, khoaTim, maHoaJson, type BoKhoa } from './ma-hoa';

/** Chủ đề khách mua → chuyên đề luận giải. Tài chính, Gia đạo chưa có bộ quy tắc: hỏi thì 404. */
const CHUYEN_DE_CUA_CHU_DE: Record<string, ChuyenDeMa | null> = {
  'ban-than': 'menh', 'tinh-cam': 'phu-the', 'su-nghiep': 'quan-loc', 'tai-chinh': null, 'gia-dao': null,
  'van-10-nam': 'van-10-nam', // chỉ gói trọn lá số / thành viên
};
export const CHU_DE_HOP_LE = [...Object.keys(CHUYEN_DE_CUA_CHU_DE), MA_VAN_NAM];

export async function luanGiaiChoKhach(db: Csdl, k: BoKhoa, nguoiDungId: number, laSoId: number, chuDe: string, bayGio = Date.now()): Promise<LuanGiai> {
  if (chuDe === MA_VAN_NAM) {
    if (!coQuyenXem(db, nguoiDungId, laSoId, MA_VAN_NAM, bayGio)) throw new LoiNghiepVu('chua_mua', 'Bạn chưa mở phần này.', 403);
    return baiVanNamGiaLap(); // TODO: thay bằng hàm sinh thật của B1 (src/lib/luan-giai) khi có
  }
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
