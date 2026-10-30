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

export const CHU_DE: { ma: MaChuDe; ten: string }[] = [
  { ma: 'ban-than', ten: 'Bản thân' },
  { ma: 'tinh-cam', ten: 'Tình cảm' },
  { ma: 'su-nghiep', ten: 'Sự nghiệp' },
  { ma: 'tai-chinh', ten: 'Tài chính' },
  { ma: 'gia-dao', ten: 'Gia đạo' },
];

export const layGoi = (ma: string | null | undefined) => GOI.find((g) => g.ma === ma);
export const layChuDe = (ma: string | null | undefined) => CHU_DE.find((c) => c.ma === ma);
