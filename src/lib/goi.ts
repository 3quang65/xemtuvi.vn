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
}

export const dinhDangGia = (d: number) => d.toLocaleString('vi-VN') + 'đ';

const GIA_TRON_LA_SO = 99000;

/**
 * Cờ công bố giá: /tro-giup, tin xác nhận đơn, /chon-goi, /thanh-toan. TẮT cho đến khi anh Cường duyệt giá (L-1964d2):
 * chỗ giá hiện CHU_CHUA_CONG_BO, ẩn so sánh giá và câu hoàn tiền. Luồng mua giả lập vẫn chạy (máy chủ vẫn tính giá thật).
 */
export const CONG_BO_GIA = false;
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

// Chuyên đề "Vận năm 2027" (mã chuyên đề van-nam-2027). Giá nháp, CHỜ An/anh chốt. Không giá gạch, không đếm ngược.
export const MA_VAN_NAM = 'van-nam-2027';
export const GIA_VAN_NAM_2027 = 39000; // mua lẻ cho một lá số
export const GIA_TRON_LA_SO_KEM_VAN_NAM = 129000; // gộp Trọn lá số + Vận năm 2027 cho cùng một lá số
export const BAN_DEN_GOI_GOP = '2027-02-06'; // gói gộp bán 15/12/2026–6/2/2027 (gia-van-nam-2027_v2)

/** Bảng giá nhánh thử: mã gói -> giá (đồng). Gói không có trong bảng giữ giá hiện hành. */
export type BangGia = Partial<Record<MaGoi, number>>;

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
      quyenLoi: ['Luận ba cung trọng yếu (Mệnh, Quan Lộc, Phu Thê) và vận 10 năm hiện tại (đại vận)', 'Mỗi nhận định ghi sao, cung và trường phái', XEM_LAI],
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

/** Hai gói vận năm: bán ở khu "Vận năm 2027", không nằm trong ba thẻ gói chính (GOI). */
function dungGoiVanNam(bang?: BangGia): Goi[] {
  return [
    {
      ma: 'van-nam-2027', ten: 'Vận năm 2027 (Đinh Mùi)', gia: bang?.['van-nam-2027'] ?? GIA_VAN_NAM_2027, donVi: 'một lần', chinh: false,
      quyenLoi: ['Luận năm Đinh Mùi cho lá số của bạn: tổng quan, bốn mảng, 12 tháng', 'Ghi rõ sao, cung và nguồn sách', XEM_LAI],
    },
    {
      ma: 'tron-la-so-kem-van-nam', ten: 'Trọn lá số + Vận năm 2027', gia: bang?.['tron-la-so-kem-van-nam'] ?? GIA_TRON_LA_SO_KEM_VAN_NAM, donVi: 'một lần', chinh: true, nhan: 'Gộp tiết kiệm hơn',
      banDen: BAN_DEN_GOI_GOP,
      quyenLoi: ['Toàn bộ Trọn lá số: ba cung trọng yếu và vận 10 năm', 'Cộng luận Vận năm 2027', 'Mỗi nhận định ghi sao, cung và trường phái', XEM_LAI],
    },
  ];
}

/** Giá hiện hành (chính thức). Thử nghiệm giá không đổi các hằng này mà dùng goiTheoBang(). */
export const GOI: Goi[] = dungGoi();
export const GOI_VAN_NAM: Goi[] = dungGoiVanNam();
export const DIEU_KIEN_XEM_LAI = dieuKienXemLai(!GOI.find((g) => g.ma === 'thanh-vien-nam')?.an);

/** Gói và giá theo nhánh thử; bảng rỗng/không có = giá hiện hành (xem src/lib/may-chu/thu-gia.ts). */
export const goiTheoBang = (bang?: BangGia) => ({ goi: dungGoi(bang), vanNam: dungGoiVanNam(bang) });

/** Tên mọi chủ đề có mã (kể cả chủ đề chưa bán), để hiện tên ở khung mã mời, lịch sử. */
export const CHU_DE_TAT_CA: { ma: MaChuDe; ten: string }[] = [
  { ma: 'ban-than', ten: 'Bản thân' },
  { ma: 'tinh-cam', ten: 'Tình cảm' },
  { ma: 'su-nghiep', ten: 'Sự nghiệp' },
];
/** Chủ đề đang bán lẻ (khớp ba cung của Trọn lá số). Hai chủ đề còn lại mở bán khi nội dung qua Thư duyệt. */
const CHU_DE_DANG_BAN: MaChuDe[] = ['ban-than', 'tinh-cam', 'su-nghiep'];
export const CHU_DE = CHU_DE_TAT_CA.filter((c) => CHU_DE_DANG_BAN.includes(c.ma));

/** Cam kết hiện ở màn chọn gói và thanh toán. Một chỗ duy nhất, mọi trang đọc từ đây. */
export const GHI_CHU_AI = 'Nội dung luận giải do AI tạo từ bộ quy tắc Tử Vi phái Việt, có ghi nguồn.';
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
