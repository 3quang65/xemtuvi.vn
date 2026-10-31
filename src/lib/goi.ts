// Cấu hình gói và giá: nguồn duy nhất (docs/san-pham/bang-gia.md). Không giá gạch, không đếm ngược.
import { MA_CHU_DE, MA_GOI } from './goi-ma.js';

export type MaGoi = (typeof MA_GOI)[number];
export type MaChuDe = (typeof MA_CHU_DE)[number];

export interface Goi {
  ma: MaGoi;
  ten: string;
  gia: number; // đồng
  donVi: string;
  chinh: boolean;
  nhan?: string; // nhãn trên thẻ gói
  an?: boolean; // gói ẩn: không hiện ở /chon-goi, /tro-giup; máy chủ không nhận đơn (dữ liệu giữ nguyên)
  soSanh?: string[]; // so sánh có thật, hiện dưới giá
  banDen?: string; // ngày dừng bán 'YYYY-MM-DD' (hết ngày đó, giờ Việt Nam): sau đó ẩn và máy chủ không nhận đơn
  quyenLoi: string[];
  xemThu?: boolean; // chỉ gắn ở chế độ xem trước giá (XEM_TRUOC_GIA): thẻ hiện để xem, chưa mở bán, nút mua vô hiệu
}

export const dinhDangGia = (d: number) => d.toLocaleString('vi-VN') + 'đ';

const GIA_TRON_LA_SO = 99000;

/**
 * Cờ công bố giá: /tro-giup, tin xác nhận đơn, /chon-goi, /thanh-toan. BẬT từ L-d7cd2b (khách đọc thử không thấy giá thì bỏ đi trước nút mua; giá đã duyệt 30/10).
 * Tắt lại = chỗ giá hiện CHU_CHUA_CONG_BO và ẩn so sánh giá. Luồng mua vẫn giả lập.
 */
export const CONG_BO_GIA = true;
/** Câu cam kết hoàn tiền gắn với thanh toán thật: TẮT cho đến giai đoạn thu tiền thật (M5). */
export const CONG_BO_HOAN_TIEN = false;
export const CHU_CHUA_CONG_BO = 'Sẽ công bố khi ra mắt';

/** Số tiền để hiện trên màn chọn gói/thanh toán: cờ tắt thì chữ trung tính. */
export const giaHienThi = (d: number, cong: boolean = CONG_BO_GIA) => (cong ? dinhDangGia(d) : CHU_CHUA_CONG_BO);

/** Trần số tiền trừ khi nâng lên Thành viên năm (bằng giá Trọn lá số, vì gói năm đã gồm Trọn lá số). */
export const TRAN_TRU_NANG_GOI = GIA_TRON_LA_SO;

/** Điều kiện xem lại phần đã mua (trang-gia-va-thu-gia_v4 L3): trang giá, bước xóa tài khoản, email. Câu Thành viên năm chỉ ghép khi gói năm mở. */
const CAU_XEM_LAI_GOI_NAM =
  'Thành viên năm: xem trong 365 ngày kể từ ngày thanh toán, áp dụng cho 3 lá số bạn lập đầu tiên trong tài khoản (tính theo thứ tự lập, không đổi được). ' +
  'Phần bạn đã mua lẻ trước đó vẫn xem lại không giới hạn thời gian, kể cả khi gói năm hết hạn. ';
export const dieuKienXemLai = (goiNamMo: boolean) =>
  'Phần đã mua gắn với tài khoản và lá số của bạn. Mở một chủ đề, Trọn lá số, Vận năm 2027: xem lại không giới hạn thời gian mỗi khi đăng nhập. ' +
  (goiNamMo ? CAU_XEM_LAI_GOI_NAM : '') +
  'Nếu bạn xóa tài khoản, lá số và quyền xem bị xóa theo, không khôi phục được.';
const XEM_LAI = 'Xem lại không giới hạn thời gian khi đăng nhập tài khoản';

// Chuyên đề "Vận năm 2027" (mã chuyên đề van-nam-2027). Giá đã duyệt L-5ff005 (gia-van-nam-2027_v2). Không giá gạch, không đếm ngược.
export const MA_VAN_NAM = 'van-nam-2027';
export const GIA_VAN_NAM_2027 = 49000; // mua lẻ cho một lá số
export const GIA_TRON_LA_SO_KEM_VAN_NAM = 129000; // gộp Trọn lá số + Vận năm 2027 cho cùng một lá số
export const BAN_DEN_GOI_GOP = '2027-02-06'; // gói gộp bán 15/12/2026–6/2/2027 (gia-van-nam-2027_v2)
export const GIA_GOI_DOI = 179000; // gói đôi (dịp Valentine): hai Trọn lá số cho hai lá số riêng, cùng một đơn
export const BAN_DEN_GOI_DOI = '2027-02-14'; // theo lịch ưu đãi mùa vụ v1 (U2: 7/2–14/2/2027); chưa có ngày bắt đầu bán riêng, hiện chỉ theo cổng chung
export const MO_BAN_VAN_TU = '2026-12-15'; // Vận 2027 lẻ và gói gộp cùng mở từ ngày này (giờ Việt Nam), chốt L-ad41bc

/**
 * Cổng mở bán gói Vận 2027: cả lẻ và gói gộp từ MO_BAN_VAN_TU, VÀ cờ nội dung Vận 2027 đã qua Thư (env NOI_DUNG_VAN_2027_DA_QUA_THU=1, mặc định TẮT).
 * Máy chủ (taoDon) chặn đơn khi cổng đóng. Bật cờ chỉ sau khi Thư duyệt xong nội dung Vận 2027.
 */
export const CO_VAN_2027_DA_QUA_THU = () => process.env.NOI_DUNG_VAN_2027_DA_QUA_THU === '1';
export const cuaBanVan2027Mo = (bayGio: number = Date.now(), coThu: boolean = CO_VAN_2027_DA_QUA_THU()) =>
  coThu && bayGio >= Date.parse(`${MO_BAN_VAN_TU}T00:00:00+07:00`);
/**
 * Cờ nhắc lưu nguyệt ở trang thành công Vận 2027. TẮT cho đến khi P18 xong (nội dung Vận tháng 1–2/2027 theo tháng âm đã được Hạnh viết và Minh xác nhận).
 * Bật = đổi thành true sau khi Minh báo P18 xong.
 */
export const LUU_NGUYET_SAN_SANG = false;
export const laGoiVan2027 = (ma: string) => ma === 'van-nam-2027' || ma === 'tron-la-so-kem-van-nam' || ma === 'goi-doi-valentine'; // cùng một cổng mở bán

/** Bảng giá nhánh thử: mã gói -> giá (đồng). Gói không có trong bảng giữ giá hiện hành. */
export type BangGia = Partial<Record<MaGoi, number>>;

/** Chủ đề đang bán lẻ (3 trong 5 chủ đề của Trọn lá số). Tài chính, Gia đạo chỉ có trong Trọn lá số; mở bán lẻ khi nội dung qua Thư duyệt. */
const CHU_DE_DANG_BAN: MaChuDe[] = ['ban-than', 'tinh-cam', 'su-nghiep'];

/** Ba thẻ gói chính. Không truyền bảng = giá hiện hành. So sánh dưới giá tự tính từ giá đang dùng. */
function dungGoi(bang?: BangGia): Goi[] {
  const gia = (ma: MaGoi, mac: number) => bang?.[ma] ?? mac;
  const giaTron = gia('tron-la-so', GIA_TRON_LA_SO);
  const giaNam = gia('thanh-vien-nam', 299000);
  return [
    {
      ma: 'mot-chu-de', ten: 'Mở một chủ đề', gia: gia('mot-chu-de', 29000), donVi: 'một lần', chinh: false,
      quyenLoi: ['Luận sâu một chủ đề bạn chọn: Bản thân, Tình cảm hoặc Sự nghiệp', 'Ghi rõ sao, cung và nguồn sách', XEM_LAI],
    },
    {
      ma: 'tron-la-so', ten: 'Trọn lá số', gia: giaTron, donVi: 'một lần', chinh: true, nhan: 'Khuyên dùng',
      soSanh: [`Mua lẻ ${CHU_DE_DANG_BAN.length} chủ đề: ${dinhDangGia(CHU_DE_DANG_BAN.length * gia('mot-chu-de', 29000))}. Trọn lá số có thêm Tài chính, Gia đạo và đại vận 10 năm.`], // L-2d61c5 B11: lẻ chỉ bán 3 chủ đề, không so với 5
      quyenLoi: ['Luận năm chủ đề: Bản thân, Tình cảm, Sự nghiệp, Tài chính, Gia đạo, và đại vận 10 năm', 'Mỗi nhận định ghi sao, cung và nguồn sách', XEM_LAI],
    },
    {
      ma: 'thanh-vien-nam', ten: 'Thành viên năm', gia: giaNam, donVi: 'một năm', chinh: false,
      an: true, // ẩn đến khi các quyền lợi bổ sung của gói năm hoàn tất (Minh, 30/10). Bỏ dòng này để mở bán lại.
      soSanh: [`≈ ${dinhDangGia(Math.round(giaNam / 12 / 1000) * 1000)}/tháng`, `Mua lẻ 3 lá số đã là ${dinhDangGia(3 * giaTron)}`],
      quyenLoi: [
        'Trọn lá số của bạn, xem trong 365 ngày kể từ ngày thanh toán',
        'Trọn lá số cho 2 người thân',
        'Áp dụng cho 3 lá số bạn lập đầu tiên trong tài khoản (tính theo thứ tự lập, không đổi được)',
      ],
    },
  ];
}

/** Ba gói bán ở khu "Vận năm 2027" (Vận lẻ, gói gộp, gói đôi), không nằm trong ba thẻ gói chính (GOI). Cùng một cổng mở bán. */
function dungGoiVanNam(bang?: BangGia): Goi[] {
  const giaVan = bang?.['van-nam-2027'] ?? GIA_VAN_NAM_2027;
  const giaTron = bang?.['tron-la-so'] ?? GIA_TRON_LA_SO;
  const giaGop = bang?.['tron-la-so-kem-van-nam'] ?? GIA_TRON_LA_SO_KEM_VAN_NAM;
  const tong = giaTron + giaVan;
  const tiet = tong - giaGop;
  const giaDoi = bang?.['goi-doi-valentine'] ?? GIA_GOI_DOI;
  const tietDoi = 2 * giaTron - giaDoi;
  return [
    {
      ma: 'van-nam-2027', ten: 'Vận năm 2027 (Đinh Mùi)', gia: giaVan, donVi: 'một lần', chinh: false,
      quyenLoi: ['Luận năm Đinh Mùi cho lá số của bạn: tổng quan (tiểu hạn, Lưu Thái Tuế, Tứ hóa năm), bốn mảng, 12 tháng', 'Ghi rõ sao, cung và nguồn sách', XEM_LAI],
    },
    {
      ma: 'tron-la-so-kem-van-nam', ten: 'Trọn lá số + Vận năm 2027', gia: giaGop, donVi: 'một lần', chinh: true, nhan: 'Gộp tiết kiệm hơn',
      soSanh: tiet > 0 ? [`Mua riêng ${dinhDangGia(tong)}`, `tiết kiệm ${dinhDangGia(tiet)}`] : undefined, // tiết kiệm <= 0 thì không hiện, tránh câu sai
      banDen: BAN_DEN_GOI_GOP,
      quyenLoi: ['Toàn bộ Trọn lá số (năm chủ đề và đại vận 10 năm), cộng luận Vận năm 2027', 'Mỗi nhận định ghi sao, cung và nguồn sách', XEM_LAI],
    },
    {
      ma: 'goi-doi-valentine', ten: 'Gói đôi: hai lá số, một đơn', gia: giaDoi, donVi: 'một lần', chinh: false,
      soSanh: tietDoi > 0 ? [`Mua riêng ${dinhDangGia(2 * giaTron)}`, `tiết kiệm ${dinhDangGia(tietDoi)}`] : undefined,
      banDen: BAN_DEN_GOI_DOI,
      quyenLoi: ['Trọn lá số cho hai lá số: của bạn và của một người thân (cần ngày giờ sinh của người thứ hai)', 'Là hai bản luận giải riêng, không so hợp tuổi', 'Mỗi nhận định ghi sao, cung và nguồn sách', XEM_LAI],
    },
  ];
}

/** '2027-02-06' -> '6/2/2027' (ngày/tháng/năm, không số 0 đầu). */
export const ngayVN = (iso: string) => { const [n, t, d] = iso.split('-').map(Number); return `${d}/${t}/${n}`; };
/** Dòng hạn bán dưới thẻ gói; null khi gói không có hạn. */
export const dongHanBan = (g: Goi) => (g.banDen ? `Bán đến hết ${ngayVN(g.banDen)}` : null);
/** Dòng dưới nút ở trang luận giải: 'Gói gộp: mua riêng … · tiết kiệm … · bán đến hết …'; null nếu thiếu số hoặc hạn. */
export const dongGoiGop = (g: Goi) =>
  g.soSanh && g.banDen ? `Gói gộp: ${g.soSanh[0].charAt(0).toLowerCase()}${g.soSanh[0].slice(1)} · ${g.soSanh[1]} · bán đến hết ${ngayVN(g.banDen)}` : null;
/** Khu bán Vận 2027: cùng một cổng (từ MO_BAN_VAN_TU; cờ nội dung chưa qua Thư thì rỗng), và còn hạn bán. */
export const khuVanNam = (ds: Goi[], bayGio: number = Date.now(), coThu: boolean = CO_VAN_2027_DA_QUA_THU()) =>
  cuaBanVan2027Mo(bayGio, coThu) ? goiDangBan(ds, bayGio) : [];
/** Chữ dẫn dưới h2 khu Vận: còn thẻ gộp thì nhắc mua lẻ hoặc gộp. */
export const chuDanVanNam = (ds: Goi[]) =>
  'Luận riêng năm 2027 cho lá số này.' + (ds.some((g) => g.ma === 'tron-la-so-kem-van-nam') ? ' Mua lẻ hoặc gộp với Trọn lá số.' : '');

/** Giá hiện hành (chính thức). Thử nghiệm giá không đổi các hằng này mà dùng goiTheoBang(). */
export const GOI: Goi[] = dungGoi();
export const GOI_VAN_NAM: Goi[] = dungGoiVanNam();
export const DIEU_KIEN_XEM_LAI = dieuKienXemLai(!GOI.find((g) => g.ma === 'thanh-vien-nam')?.an);

/** Gói và giá theo nhánh thử; bảng rỗng/không có = giá hiện hành (xem src/lib/may-chu/thu-gia.ts). */
export const goiTheoBang = (bang?: BangGia) => ({ goi: dungGoi(bang), vanNam: dungGoiVanNam(bang) });

/** Mua riêng Trọn lá số + Vận lẻ, và số tiết kiệm khi mua gói gộp; tính từ giá đang dùng (kể cả bảng giá nhánh thử). */
export function giaMuaRiengVaTietKiem(bang?: BangGia) {
  const { goi, vanNam } = goiTheoBang(bang);
  const gia = (ds: Goi[], ma: MaGoi) => ds.find((g) => g.ma === ma)!.gia;
  const tongMuaRieng = gia(goi, 'tron-la-so') + gia(vanNam, 'van-nam-2027');
  return { tongMuaRieng, tietKiem: tongMuaRieng - gia(vanNam, 'tron-la-so-kem-van-nam') };
}

/** Tên mọi chủ đề có mã (kể cả chủ đề chưa bán), để hiện tên ở khung mã mời, lịch sử. */
export const CHU_DE_TAT_CA: { ma: MaChuDe; ten: string }[] = [
  { ma: 'ban-than', ten: 'Bản thân' },
  { ma: 'tinh-cam', ten: 'Tình cảm' },
  { ma: 'su-nghiep', ten: 'Sự nghiệp' },
];
export const CHU_DE = CHU_DE_TAT_CA.filter((c) => CHU_DE_DANG_BAN.includes(c.ma));

/** Cam kết hiện ở màn chọn gói và thanh toán. Một chỗ duy nhất, mọi trang đọc từ đây. */
export const GHI_CHU_AI = 'Nội dung luận giải do AI tạo từ lá số an theo phái Việt và bộ quy tắc có ghi nguồn sách; mẫu luận giải được kiểm duyệt trước khi đưa vào sử dụng.';
export const HOAN_TIEN = 'Hoàn đủ số tiền nếu lỗi kỹ thuật khiến bạn không xem được đủ phần đã mua. Không hoàn vì nội dung không hợp ý.';
export const PHUONG_PHAP = [
  'An sao và độ sáng theo cách Việt Nam (phái Việt): Tuần, Triệt và Tứ hóa năm Canh, Nhâm khác một số sách Trung Quốc.',
  'Luận theo phương pháp tam hợp, dựa trên Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang), đối chiếu sách gốc Tử Vi Đẩu Số Toàn Thư. Sách nói khác nhau thì ghi rõ theo sách nào.',
  'Mỗi nhận định ghi mã quy tắc, sao, cung và sách nguồn. Nội dung do hệ thống tạo từ bộ quy tắc, không phải lời phán của thầy.',
];

export const layGoi = (ma: string | null | undefined, bang?: BangGia) => {
  const { goi, vanNam } = bang ? goiTheoBang(bang) : { goi: GOI, vanNam: GOI_VAN_NAM };
  return goi.find((g) => g.ma === ma) ?? vanNam.find((g) => g.ma === ma);
};
export const layChuDe = (ma: string | null | undefined) => CHU_DE.find((c) => c.ma === ma);

/** Gói còn trong hạn bán: không có banDen, hoặc chưa qua hết ngày banDen theo giờ Việt Nam (UTC+7). */
export const conHanBan = (g: Goi, bayGio: number = Date.now()) => !g.banDen || bayGio < Date.parse(`${g.banDen}T23:59:59.999+07:00`);

/** Chỉ giữ gói đang bán (bỏ gói ẩn, gói đã qua ngày dừng). */
export const goiDangBan = (ds: Goi[], bayGio: number = Date.now()) => ds.filter((g) => !g.an && conHanBan(g, bayGio));

/** Giá của gói để chèn vào câu chữ: chỉ trả chuỗi khi cờ công bố giá bật, ngược lại null (người gọi bỏ cả cụm có giá). */
export function giaCongBo(ma: string | null | undefined, cong: boolean = CONG_BO_GIA, bang?: BangGia): string | null {
  if (!cong) return null;
  const g = layGoi(ma, bang);
  return g ? dinhDangGia(g.gia) : null;
}

/**
 * Cờ xem trước giá (env XEM_TRUOC_GIA=1, mặc định TẮT, đọc lúc chạy): chỉ đổi HIỂN THỊ ở /chon-goi. Hiện đủ mọi mức, thẻ chưa mở bán gắn nhãn NHAN_XEM_THU.
 * Không gỡ cổng cuaBanVan2027Mo hay cờ an: taoDon vẫn chặn đơn gói chưa mở.
 */
export const XEM_TRUOC_GIA = () => process.env.XEM_TRUOC_GIA === '1';
export const NHAN_XEM_THU = 'Xem thử – chưa mở bán';

/** Danh sách thẻ để hiện. Cờ tắt = như cũ (gói đang bán). Cờ bật = đủ mọi gói; gói mà bình thường không hiện thì gắn xemThu. */
export function goiHienThi(o: { bang?: BangGia; bayGio?: number; vanNamMo: boolean; xemTruoc: boolean }): { goi: Goi[]; vanNam: Goi[] } {
  const bayGio = o.bayGio ?? Date.now();
  const { goi, vanNam } = goiTheoBang(o.bang);
  const goiBan = goiDangBan(goi, bayGio);
  const vanBan = o.vanNamMo ? khuVanNam(vanNam, bayGio, true) : [];
  if (!o.xemTruoc) return { goi: goiBan, vanNam: vanBan };
  const dan = (ds: Goi[], ban: Goi[]) => ds.map((g) => (ban.some((b) => b.ma === g.ma) ? g : { ...g, xemThu: true }));
  return { goi: dan(goi, goiBan), vanNam: dan(vanNam, vanBan) };
}
