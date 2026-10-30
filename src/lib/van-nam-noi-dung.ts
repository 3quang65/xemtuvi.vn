// Chữ của chuyên đề "Vận năm 2027" ở MỘT chỗ: trang đích /lp/van-nam-2027, khu bán ở /chon-goi, bản xem trước ở /luan-giai.
// Bản nháp, Giang/Mai duyệt sau: chỉ cần sửa file này. Giọng: nghiêm túc, gần gũi, "hiểu mình, định hướng"; không gây sợ.
export const NAM = 2027;
export const TEN_NAM = 'Đinh Mùi';

export const LP = {
  tieuDe: 'Vận năm 2027 (Đinh Mùi): hiểu năm sắp tới để chủ động định hướng',
  moTa: 'Luận lá số cho năm Đinh Mùi 2027: tổng quan năm, bốn mảng sự nghiệp, tài chính, tình cảm, sức khỏe và 12 tháng. Ghi rõ sao, cung và sách nguồn. Lập lá số miễn phí.',
  dan: 'Một năm mới là dịp để nhìn lại mình và sắp xếp kế hoạch. Bản luận này đọc lá số của riêng bạn, gắn với năm Đinh Mùi, để bạn thấy năm nay nên dồn sức vào đâu.',
  loiIch: [
    { ten: 'Dành riêng cho lá số của bạn', moTa: 'Không phải bài chung cho mọi người cùng tuổi: luận từ vị trí các sao trong lá số của chính bạn.' },
    { ten: 'Đủ bốn mảng và 12 tháng', moTa: 'Sự nghiệp, tài chính, tình cảm, sức khỏe, kèm gợi ý theo từng tháng để bạn chủ động sắp xếp.' },
    { ten: 'Ghi rõ nguồn và trường phái', moTa: 'Mỗi nhận định nêu sao, cung và sách nguồn. Sách nói khác nhau thì ghi rõ theo sách nào.' },
    { ten: 'Xem lại bất cứ lúc nào', moTa: 'Đăng nhập ở máy nào cũng xem lại được phần đã mua.' },
  ],
  buoc: ['Lập lá số miễn phí (ngày, giờ sinh), không cần tài khoản.', 'Chọn Vận năm 2027, mua lẻ hoặc gộp với Trọn lá số.', 'Đăng nhập, thanh toán rồi đọc bài đầy đủ.'],
  nutLap: 'Lập lá số để xem Vận năm 2027',
  luuY: 'Nội dung mang tính tham khảo văn hóa và tự tìm hiểu bản thân, không thay thế ý kiến chuyên môn khi bạn quyết định việc lớn.',
};

/** Lá số mẫu cho trang /lp (không phải của khách): bản xem trước được tính thật từ lá số này ở máy chủ. */
export const LA_SO_MAU = { lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 10, phut: 30, gioiTinh: 'nu' } as const;

/** Chữ cố định của bản xem trước (không phải nội dung luận): nhãn, phần khóa mờ giữ chỗ. */
export const XEM_TRUOC = {
  ghiChuMau: 'Đây là bản xem trước tính từ một lá số mẫu, không phải lá số của bạn.',
  tieuDe: 'Tổng quan năm',
  khoa: 'Bốn mảng sự nghiệp, tài chính, tình cảm, sức khỏe và gợi ý cho từng tháng trong năm, mỗi nhận định ghi rõ sao, cung và sách nguồn, được trình bày ở đây khi bạn mở Vận năm 2027.',
  moKhoa: 'Phần còn lại, bốn mảng và 12 tháng mở khi bạn mua Vận năm 2027.',
};
