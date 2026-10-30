// Cấu hình gói và giá (tạm, sửa tại đây). Không giá gạch.
export interface Goi {
  ma: 'mot-chu-de' | 'tron-la-so' | 'thanh-vien-nam';
  ten: string;
  gia: number; // đồng
  donVi: string;
  chinh: boolean;
  quyenLoi: string[];
}

export const GOI: Goi[] = [
  {
    ma: 'mot-chu-de', ten: 'Mở một chủ đề', gia: 39000, donVi: 'một lần', chinh: false,
    quyenLoi: ['Luận sâu một chủ đề bạn chọn (sự nghiệp, tình cảm, tài chính…)', 'Ghi rõ sao, cung và nguồn sách'],
  },
  {
    ma: 'tron-la-so', ten: 'Trọn lá số', gia: 129000, donVi: 'một lần', chinh: true,
    quyenLoi: ['Luận đủ 12 cung của lá số này', 'Mỗi nhận định ghi sao, cung và trường phái', 'Xem lại bất cứ lúc nào'],
  },
  {
    ma: 'thanh-vien-nam', ten: 'Thành viên năm', gia: 299000, donVi: 'một năm', chinh: false,
    quyenLoi: ['Luận giải chuyên sâu nhiều lá số trong 12 tháng', 'Xem vận từng năm của người thân và bạn bè'],
  },
];

export const layGoi = (ma: string | null | undefined) => GOI.find((g) => g.ma === ma);

export const dinhDangGia = (d: number) => d.toLocaleString('vi-VN') + 'đ';
