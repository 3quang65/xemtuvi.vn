// Lời hiển thị đã Thư duyệt ĐẠT: docs/san-pham/sinh-con-2027-loi.md (dùng nguyên văn, không tự viết lại).
import type { Muc, MotNguoi } from './tinh';

/** SC27-M1..M3 */
export const LOI_MUC: Record<Muc, { tieuDe: string; loi: string }> = {
  'thuan': {
    tieuDe: 'Thuận',
    loi: 'Theo can chi năm sinh, tuổi bố mẹ và năm Đinh Mùi 2027 có nhiều điểm tương hợp. Đây là một góc tham khảo văn hóa, chỉ dựa trên năm sinh. Điều làm nên một năm đón bé trọn vẹn vẫn là sự sẵn sàng và gắn bó của cả nhà.',
  },
  'can-bang': {
    tieuDe: 'Cân bằng',
    loi: 'Tuổi bố mẹ và năm Đinh Mùi 2027 có điểm hợp, có điểm khác nhịp, cân bằng như phần lớn các gia đình. Đây là tham khảo văn hóa theo năm sinh, không nói lên điều gì về bé. Năm nào đón con cũng có những điều đáng mong chờ riêng.',
  },
  'can-luu-y': {
    tieuDe: 'Khác nhịp',
    loi: 'Theo can chi, tuổi bố mẹ và năm Đinh Mùi 2027 khác nhịp ở vài điểm. Đây chỉ là một lớp tham khảo văn hóa theo năm sinh; rất nhiều gia đình như vậy vẫn gắn bó, vui vầy. Muốn hiểu mình rõ hơn, bố mẹ có thể xem lá số theo ngày giờ sinh của từng người.',
  },
};

/** SC27-A1..A5 */
export function cauA(n: MotNguoi): string {
  switch (n.loaiA) {
    case 'tam-hop': return `tuổi ${n.chi} cùng nhóm tam hợp Hợi – Mão – Mùi với bé`;
    case 'luc-hop': return 'tuổi Ngọ lục hợp với tuổi Mùi của bé';
    case 'luc-xung': return 'tuổi Sửu và tuổi Mùi là cặp lục xung, hai chi đối diện nhau trên vòng 12 con giáp';
    case 'cung-chi': return 'cùng tuổi Mùi với bé, theo can chi không tính hợp hay xung';
    default: return `tuổi ${n.chi} không thuộc nhóm hợp hay xung với tuổi Mùi`;
  }
}

/** SC27-B1..B5 */
export function cauB(n: MotNguoi, vai: 'bố' | 'mẹ'): string {
  switch (n.loaiB) {
    case 'sinh-thuy': return `Kim sinh Thủy, mệnh ${vai} sinh ra mệnh Thiên Hà Thủy của bé theo vòng tương sinh`;
    case 'thuy-sinh': return `Thủy sinh Mộc, mệnh Thiên Hà Thủy của bé và mệnh ${vai} có quan hệ tương sinh`;
    case 'binh-hoa': return 'cùng hành Thủy với bé, quan hệ bình hòa';
    case 'khac-thuy': return 'Thổ khắc Thủy, một điểm khác nhịp theo vòng ngũ hành';
    default: return 'Thủy khắc Hỏa, một điểm khác nhịp theo vòng ngũ hành';
  }
}

/** Dòng quan hệ cho từng người (mục 2), không gắn mức. */
export function dongNguoi(n: MotNguoi, vai: 'bố' | 'mẹ'): string {
  return `mệnh ${n.napAm}: ${cauA(n)}; ${cauB(n, vai)}.`;
}

/** Ghi can chi đã dùng (mục 5): "1991 – Canh Ngọ (sinh trước Tết)". */
export const canChiDaDung = (n: MotNguoi) => `${n.namDuong} – ${n.can} ${n.chi}${n.truocTet ? ' (sinh trước Tết)' : ''}`;

export const CAU_TRUONG_PHAI = 'Kết quả được tính tự động theo năm sinh, dựa trên lý thuyết can chi – ngũ hành chung, không phải phép an sao Tử Vi Đẩu Số; muốn hiểu sâu từng người, cần lá số lập theo ngày giờ sinh.';
export const GHI_CHU_BE = 'Bé chào đời từ 01/01 đến 05/02/2027 thuộc năm Bính Ngọ, vì Tết Đinh Mùi rơi vào ngày 06/02/2027. Công cụ này dành cho bé sinh từ 06/02/2027 đến 25/01/2028.';
export const GHI_CHU_BO_QUA_NGAY = 'Kết quả đang tính theo năm dương lịch bạn nhập. Nếu sinh trước Tết năm đó, tuổi âm lịch của bạn thuộc năm trước và kết quả có thể khác: hãy nhập ngày tháng sinh để công cụ tính đúng.';

/** SC27-C1 (mặc định) */
export const CTA_LA_SO = {
  dan: 'Năm sinh chỉ là lớp ngoài cùng. Lá số Tử Vi theo ngày giờ sinh giúp bạn hiểu mình rõ hơn: điểm mạnh, cách mình yêu thương và chăm lo cho gia đình.',
  nut: 'Lập lá số miễn phí',
};
/** SC27-C2 */
export const CTA_VAN_2027 = {
  dan: 'Năm Đinh Mùi 2027 mở ra những gì cho riêng bố, riêng mẹ? Xem Vận 2027 lập theo lá số ngày giờ sinh của từng người.',
  nut: 'Xem Vận 2027 của bố mẹ',
};
