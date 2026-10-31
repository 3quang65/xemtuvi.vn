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
    { ten: 'Đủ bốn mảng và 12 tháng', moTa: 'Sự nghiệp, tài chính, tình cảm, sức khỏe, kèm nhận định cho từng tháng để bạn chủ động sắp xếp.' },
    { ten: 'Ghi rõ nguồn và trường phái', moTa: 'Bài ghi sách nguồn và trường phái. Sách nói khác nhau thì ghi rõ theo sách nào.' },
    { ten: 'Xem lại bất cứ lúc nào', moTa: 'Đăng nhập ở máy nào cũng xem lại được phần đã mua.' },
  ],
  buoc: ['Lập lá số miễn phí (ngày, giờ sinh), không cần tài khoản.', 'Chọn Vận năm 2027, mua lẻ hoặc gộp với Trọn lá số.', 'Đăng nhập, thanh toán rồi đọc bài đầy đủ.'], // khi cổng mở bán; cổng đóng dùng buocLp(false)
  nutLap: 'Lập lá số để xem Vận năm 2027',
  luuY: 'Nội dung mang tính tham khảo văn hóa và tự tìm hiểu bản thân, không thay thế ý kiến chuyên môn khi bạn quyết định việc lớn.',
};

/** Lá số mẫu cho trang /lp (không phải của khách): bản xem trước được tính thật từ lá số này ở máy chủ. */
export const LA_SO_MAU = { lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 10, phut: 30, gioiTinh: 'nu' } as const;

/** Chữ cố định của bản xem trước (không phải nội dung luận): nhãn, phần khóa mờ giữ chỗ. */
export const XEM_TRUOC = {
  ghiChuMau: 'Đây là bản xem trước tính từ một lá số mẫu, không phải lá số của bạn.',
  tieuDe: 'Tổng quan năm',
  // L-91613b (phiếu Thư L-5f6b69 lỗi 3): chỉ hứa điều đúng ở 96/96 tháng của 8 lá thử. 36/96 tháng không nhắc sao nào,
  // 8/32 mảng chỉ có câu dẫn (không việc nên làm), câu dẫn không in nguồn: nên bỏ "các sao của tháng đó", "mỗi mảng", "mỗi nhận định ghi rõ sao".
  ghiChuThang: 'Đây là một trong 12 tháng. Mười một tháng còn lại, mỗi tháng có nhận định riêng theo cung của tháng đó, nằm trong bài đầy đủ.',
  khoa: 'Bốn mảng sự nghiệp, tài chính, tình cảm, sức khỏe, kèm việc nên làm ở những mảng lá số có đủ căn cứ, cùng nhận định cho 12 tháng; bài có ghi sách nguồn và trường phái, được trình bày ở đây khi bạn mở Vận năm 2027.',
  moKhoa: 'Phần còn lại, bốn mảng và 12 tháng mở khi bạn mua Vận năm 2027.', // khi cổng mở bán
  moKhoaChuaBan: 'Phần còn lại, bốn mảng và 12 tháng, sẽ mở khi Vận năm 2027 mở bán.', // cổng đóng: không nói "mua"
};

/** L-2d61c5 B12: chữ phụ thuộc cổng mở bán. Cổng đóng (chưa tới 15/12 hoặc nội dung chưa qua Thư) thì không hứa mua được. */
export const BUOC_CHUA_BAN = ['Lập lá số miễn phí (ngày, giờ sinh), không cần tài khoản.', 'Xem trước tổng quan năm Đinh Mùi tính từ lá số của chính bạn.', 'Khi Vận năm 2027 mở bán: đăng nhập, chọn mua lẻ hoặc gộp với Trọn lá số, rồi đọc bài đầy đủ.'];
export const buocLp = (moBan: boolean) => (moBan ? LP.buoc : BUOC_CHUA_BAN);
export const moKhoaTheoCong = (moBan: boolean) => (moBan ? XEM_TRUOC.moKhoa : XEM_TRUOC.moKhoaChuaBan);
