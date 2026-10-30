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
  soSanh?: string[]; // so sánh có thật, hiện dưới giá
  quyenLoi: string[];
}

export const dinhDangGia = (d: number) => d.toLocaleString('vi-VN') + 'đ';

const GIA_TRON_LA_SO = 99000;

// Chuyên đề "Vận năm 2027" (mã chuyên đề van-nam-2027). Giá nháp, CHỜ An/anh chốt. Không giá gạch, không đếm ngược.
export const MA_VAN_NAM = 'van-nam-2027';
export const GIA_VAN_NAM_2027 = 39000; // mua lẻ cho một lá số
export const GIA_TRON_LA_SO_KEM_VAN_NAM = 129000; // gộp Trọn lá số + Vận năm 2027 cho cùng một lá số

export const GOI: Goi[] = [
  {
    ma: 'mot-chu-de', ten: 'Mở một chủ đề', gia: 29000, donVi: 'một lần', chinh: false,
    quyenLoi: ['Luận sâu một chủ đề bạn chọn', 'Ghi rõ sao, cung và nguồn sách'],
  },
  {
    ma: 'tron-la-so', ten: 'Trọn lá số', gia: GIA_TRON_LA_SO, donVi: 'một lần', chinh: true, nhan: 'Khuyên dùng',
    quyenLoi: ['Luận đủ 12 cung và vận 10 năm hiện tại (đại vận)', 'Mỗi nhận định ghi sao, cung và trường phái', 'Xem lại bất cứ lúc nào'],
  },
  {
    ma: 'thanh-vien-nam', ten: 'Thành viên năm', gia: 299000, donVi: 'một năm', chinh: false,
    soSanh: ['≈ 25.000đ/tháng', `Mua lẻ 3 lá số đã là ${dinhDangGia(3 * GIA_TRON_LA_SO)}`],
    quyenLoi: [
      'Trọn lá số của bạn',
      'Luận vận năm và lưu nguyệt từng tháng',
      'Hỏi đáp về lá số: 5 câu mỗi tháng',
      'Trọn lá số cho 2 người thân',
    ],
  },
];

/** Hai gói vận năm: bán ở khu "Vận năm 2027", không nằm trong ba thẻ gói chính (GOI). */
export const GOI_VAN_NAM: Goi[] = [
  {
    ma: 'van-nam-2027', ten: 'Vận năm 2027 (Đinh Mùi)', gia: GIA_VAN_NAM_2027, donVi: 'một lần', chinh: false,
    quyenLoi: ['Luận năm Đinh Mùi cho lá số của bạn: tổng quan, bốn mảng, 12 tháng', 'Ghi rõ sao, cung và nguồn sách', 'Xem lại bất cứ lúc nào'],
  },
  {
    ma: 'tron-la-so-kem-van-nam', ten: 'Trọn lá số + Vận năm 2027', gia: GIA_TRON_LA_SO_KEM_VAN_NAM, donVi: 'một lần', chinh: true, nhan: 'Gộp tiết kiệm hơn',
    quyenLoi: ['Toàn bộ Trọn lá số: 12 cung và vận 10 năm', 'Cộng luận Vận năm 2027', 'Mỗi nhận định ghi sao, cung và trường phái'],
  },
];

export const CHU_DE: { ma: MaChuDe; ten: string }[] = [
  { ma: 'ban-than', ten: 'Bản thân' },
  { ma: 'tinh-cam', ten: 'Tình cảm' },
  { ma: 'su-nghiep', ten: 'Sự nghiệp' },
  { ma: 'tai-chinh', ten: 'Tài chính' },
  { ma: 'gia-dao', ten: 'Gia đạo' },
];

/** Cam kết hiện ở màn chọn gói và thanh toán. Một chỗ duy nhất, mọi trang đọc từ đây. */
export const HOAN_TIEN = 'Hoàn 100% nếu lỗi kỹ thuật khiến bạn không xem được đủ phần đã mua. Không hoàn vì nội dung không hợp ý.';
export const PHUONG_PHAP = [
  'An sao và độ sáng theo cách Việt Nam (phái Việt): Tuần, Triệt và Tứ hóa năm Canh, Nhâm khác một số sách Trung Quốc.',
  'Luận theo phương pháp tam hợp, dựa trên Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang), đối chiếu sách gốc Tử Vi Đẩu Số Toàn Thư. Sách nói khác nhau thì ghi rõ theo sách nào.',
  'Mỗi nhận định ghi mã quy tắc, sao, cung và sách nguồn. Nội dung do hệ thống tạo từ bộ quy tắc, không phải lời phán của thầy.',
];

export const layGoi = (ma: string | null | undefined) => GOI.find((g) => g.ma === ma) ?? GOI_VAN_NAM.find((g) => g.ma === ma);
export const layChuDe = (ma: string | null | undefined) => CHU_DE.find((c) => c.ma === ma);
