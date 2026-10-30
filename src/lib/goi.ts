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
      quyenLoi: ['Luận sâu một chủ đề bạn chọn', 'Ghi rõ sao, cung và nguồn sách'],
    },
    {
      ma: 'tron-la-so', ten: 'Trọn lá số', gia: giaTron, donVi: 'một lần', chinh: true, nhan: 'Khuyên dùng',
      quyenLoi: ['Luận đủ 12 cung và vận 10 năm hiện tại (đại vận)', 'Mỗi nhận định ghi sao, cung và trường phái', 'Xem lại bất cứ lúc nào'],
    },
    {
      ma: 'thanh-vien-nam', ten: 'Thành viên năm', gia: giaNam, donVi: 'một năm', chinh: false,
      soSanh: [`≈ ${dinhDangGia(Math.round(giaNam / 12 / 1000) * 1000)}/tháng`, `Mua lẻ 3 lá số đã là ${dinhDangGia(3 * giaTron)}`],
      quyenLoi: [
        'Trọn lá số của bạn',
        'Luận vận năm và lưu nguyệt từng tháng',
        'Hỏi đáp về lá số: 5 câu mỗi tháng',
        'Trọn lá số cho 2 người thân',
      ],
    },
  ];
}

/** Hai gói vận năm: bán ở khu "Vận năm 2027", không nằm trong ba thẻ gói chính (GOI). */
function dungGoiVanNam(bang?: BangGia): Goi[] {
  return [
    {
      ma: 'van-nam-2027', ten: 'Vận năm 2027 (Đinh Mùi)', gia: bang?.['van-nam-2027'] ?? GIA_VAN_NAM_2027, donVi: 'một lần', chinh: false,
      quyenLoi: ['Luận năm Đinh Mùi cho lá số của bạn: tổng quan, bốn mảng, 12 tháng', 'Ghi rõ sao, cung và nguồn sách', 'Xem lại bất cứ lúc nào'],
    },
    {
      ma: 'tron-la-so-kem-van-nam', ten: 'Trọn lá số + Vận năm 2027', gia: bang?.['tron-la-so-kem-van-nam'] ?? GIA_TRON_LA_SO_KEM_VAN_NAM, donVi: 'một lần', chinh: true, nhan: 'Gộp tiết kiệm hơn',
      quyenLoi: ['Toàn bộ Trọn lá số: 12 cung và vận 10 năm', 'Cộng luận Vận năm 2027', 'Mỗi nhận định ghi sao, cung và trường phái'],
    },
  ];
}

/** Giá hiện hành (chính thức). Thử nghiệm giá không đổi các hằng này mà dùng goiTheoBang(). */
export const GOI: Goi[] = dungGoi();
export const GOI_VAN_NAM: Goi[] = dungGoiVanNam();

/** Gói và giá theo nhánh thử; bảng rỗng/không có = giá hiện hành (xem src/lib/may-chu/thu-gia.ts). */
export const goiTheoBang = (bang?: BangGia) => ({ goi: dungGoi(bang), vanNam: dungGoiVanNam(bang) });

export const CHU_DE: { ma: MaChuDe; ten: string }[] = [
  { ma: 'ban-than', ten: 'Bản thân' },
  { ma: 'tinh-cam', ten: 'Tình cảm' },
  { ma: 'su-nghiep', ten: 'Sự nghiệp' },
  { ma: 'tai-chinh', ten: 'Tài chính' },
  { ma: 'gia-dao', ten: 'Gia đạo' },
];

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
