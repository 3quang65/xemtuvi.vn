// Nội dung trợ giúp tự phục vụ (cskh/noi-dung-tro-giup_v1.md, chữ đã sửa ở mục 5). Một chỗ duy nhất cho chữ, trang chỉ hiển thị.
// Giá chỉ chèn qua giaCongBo() (goi.ts): cờ công bố giá tắt thì không có số nào. Không chứa mã lỗi kỹ thuật.
import { CONG_BO_GIA, GOI, LUU_NGUYET_SAN_SANG, giaCongBo, goiDangBan, laGoiVan2027, chuDeTronLaSo } from './goi';

export const DONG_AI = 'Nội dung luận giải trên xemtuvi.vn do AI tạo, mang tính tham khảo. Tử Vi là một góc nhìn để bạn hiểu mình hơn, quyết định luôn là của bạn.';
export const DONG_AI_NGAN = 'Nội dung do AI tạo, mang tính tham khảo. Tử Vi là một góc nhìn để bạn hiểu mình hơn, quyết định luôn là của bạn.';
export const LINK_BAO_LOI = '/tro-giup#bao-loi';

export interface LienKet { nhan: string; href: string }
export interface CauHoi { so: number; hoi: string; traLoi: string; lienKet?: LienKet }
export interface Nhom { ten: string; cau: CauHoi[] }

/** Câu 7: chỉ nêu các gói đang bán (gói ẩn không xuất hiện). Có giá chỉ khi cờ công bố giá bật. */
export function cauTraLoiGoi(cong: boolean = CONG_BO_GIA): string {
  const ds = goiDangBan(GOI);
  const ten = (g: (typeof ds)[number]) => {
    const gia = giaCongBo(g.ma, cong);
    return gia ? `${g.ten.toLowerCase()} (${gia})` : g.ten.toLowerCase();
  };
  const bac = `Có ${ds.length === 2 ? 'hai' : ds.length} bậc: ${ds.slice(0, -1).map(ten).join(', ')} và ${ten(ds[ds.length - 1])}.`;
  return `${bac} Giá ghi rõ ở màn chọn gói, không giá gạch.`;
}

export function nhomCauHoi(cong: boolean = CONG_BO_GIA): Nhom[] {
  return [
    { ten: 'Lập lá số và giờ sinh', cau: [
      { so: 1, hoi: 'Mình cần nhập những gì để lập lá số?', traLoi: 'Ngày, tháng, năm sinh (dương lịch), giờ sinh và giới tính. Lá số cùng phần tóm tắt miễn phí hiện ngay, không cần tài khoản. Bạn chỉ đăng nhập khi muốn xem luận giải chuyên sâu.', lienKet: { nhan: 'Lập lá số miễn phí', href: '/' } },
      { so: 2, hoi: 'Mình không nhớ chính xác giờ sinh thì sao?', traLoi: 'Giờ sinh quyết định cung Mệnh nên khá quan trọng. Bạn thử hỏi người nhà hoặc xem giấy khai sinh. Nếu vẫn chưa rõ, bạn có thể lập thử vài khung giờ gần nhau để so sánh; mỗi khung cho một lá số khác nhau.', lienKet: { nhan: 'Xem cách đọc giờ Tý và quy ước giờ sinh', href: '#cau-3' } },
      { so: 3, hoi: 'Giờ Tý là gì, sao mình sinh lúc 23:30 mà ngày âm lịch lớn hơn một ngày?', traLoi: 'Theo cách tính Tử Vi, giờ Tý kéo dài từ 23:00 đến 01:00, và phần 23:00 đến 23:59 được tính sang ngày hôm sau khi đổi sang âm lịch. Quy ước này được ghi ở đầu lá số để bạn đối chiếu.', lienKet: { nhan: 'Xem lá số và quy ước ghi ở đầu trang', href: '/' } },
    ] },
    { ten: 'Luận giải và độ tin cậy', cau: [
      { so: 4, hoi: 'Luận giải do ai viết, có phải thầy xem không?', traLoi: 'Do hệ thống AI tạo từ bộ quy tắc Tử Vi phái Việt, không phải lời của thầy hay chuyên gia nào. Mỗi nhận định ghi sách nguồn và trường phái để bạn tự kiểm tra.', lienKet: { nhan: 'Xem đoạn mẫu ở màn chọn gói', href: '/chon-goi' } },
      { so: 5, hoi: 'Luận giải có làm mình lo không?', traLoi: 'Không theo thiết kế. Nội dung theo hướng "hiểu mình, định hướng": nói về xu hướng, điểm mạnh, điểm cần lưu tâm và gợi ý lựa chọn. Nếu có câu nào khiến bạn thấy nặng nề, hãy gửi cho mình để rà lại.', lienKet: { nhan: 'Gửi góp ý về một câu luận giải', href: LINK_BAO_LOI } },
      { so: 6, hoi: 'Có xem thử trước khi mua không?', traLoi: 'Có. Lá số và tóm tắt miễn phí hiện ngay. Ở màn chọn gói có đoạn mẫu rút từ lá số của bạn (khóa một phần); nếu chưa có đoạn phù hợp thì hiện ví dụ minh họa và ghi rõ. Bạn đọc rồi hãy quyết định.', lienKet: { nhan: 'Xem lá số và phần mẫu', href: '/' } },
    ] },
    { ten: 'Gói và thanh toán thử', cau: [
      { so: 7, hoi: 'Xemtuvi.vn có những gói nào?', traLoi: cauTraLoiGoi(cong), lienKet: { nhan: 'So sánh các gói', href: '/chon-goi' } },
      { so: 8, hoi: 'Mình bấm mua rồi, có bị trừ tiền thật không?', traLoi: 'Chưa. Ở giai đoạn thử nghiệm, bước thanh toán là giả lập: không trừ tiền thật và bạn không cần nhập thông tin thẻ hay ngân hàng. Nếu thấy yêu cầu nào đòi chuyển tiền, hãy báo cho mình ngay.', lienKet: { nhan: 'Báo cho mình', href: LINK_BAO_LOI } },
    ] },
    { ten: 'Tài khoản và riêng tư', cau: [
      { so: 9, hoi: 'Ngày giờ sinh của mình có được lưu không?', traLoi: 'Khi bạn lập lá số miễn phí, thông tin sinh chỉ giữ trong trình duyệt, không đưa lên địa chỉ trang. Khi bạn mua luận giải, lá số được lưu mã hóa gắn với tài khoản để bạn xem lại. Chúng mình không chia sẻ cho bên thứ ba và không để công cụ tìm kiếm lập chỉ mục.' },
      { so: 10, hoi: 'Mình đã mua nhưng không thấy nội dung đã mở.', traLoi: 'Bạn tải lại trang, đăng nhập đúng tài khoản đã dùng lúc mua, rồi thử trình duyệt khác. Nếu vẫn chưa thấy, gửi mình mã đơn, tên gói, thiết bị và trình duyệt (không cần ngày sinh). Mình ghi nhận và chuyển đội xử lý.', lienKet: { nhan: 'Báo lỗi không thấy nội dung', href: LINK_BAO_LOI } },
    ] },
  ];
}

// ---------- Tám thông báo lỗi ----------
export type MaLoi = 'E01' | 'E02' | 'E03' | 'E04' | 'E05' | 'E06' | 'E07' | 'E08';
export type HanhDong = 'dien-tiep' | 'sua-ngay' | 'sua-gio' | 'cach-tim-gio' | 'tai-lai' | 'gui-bao-loi' | 'thu-lai' | 'xem-luan-giai' | 'xem-don';
export interface Bien { tenOThieu?: string; maDon?: string; tenGoi?: string; lich?: 'duong' | 'am'; nhuan?: boolean }
export interface ThongBaoLoi { tieuDe: string; noiDung: string; nut: { nhan: string; hanhDong: HanhDong }[] }

const nut = (nhan: string, hanhDong: HanhDong) => ({ nhan, hanhDong });
const donCuaToi = (b: Bien) => (b.maDon ? `Đơn ${b.maDon}` : 'Đơn của bạn');

/** E02 nói đúng loại lịch khách đang nhập: tháng nhuận âm lịch, âm lịch thường, hoặc dương lịch (mặc định). */
function noiDungE02(b: Bien): string {
  if (b.lich === 'am' && b.nhuan) return 'Năm này không có tháng nhuận như bạn đã chọn (âm lịch chỉ nhuận một số năm). Bạn bỏ chọn "Tháng nhuận" hoặc kiểm tra lại tháng, năm giúp mình nhé.';
  if (b.lich === 'am') return 'Ngày âm lịch bạn vừa nhập chưa khớp (mỗi tháng âm lịch chỉ có 29 hoặc 30 ngày, năm cần trong khoảng 1900–2100). Bạn kiểm tra lại ngày, tháng, năm giúp mình nhé.';
  return 'Ngày bạn vừa nhập chưa khớp lịch dương (ví dụ ngày 31 của tháng 4, hoặc năm ngoài khoảng 1900–2100). Bạn kiểm tra lại ngày, tháng, năm giúp mình nhé.';
}

export function thongBaoLoi(ma: MaLoi, b: Bien = {}): ThongBaoLoi {
  switch (ma) {
    case 'E01': return { tieuDe: 'Còn một chút thông tin nữa', noiDung: `Mình cần thêm ${b.tenOThieu || 'thông tin còn thiếu'} để lập lá số cho bạn. Các ô khác bạn đã nhập vẫn được giữ nguyên.`, nut: [nut('Điền tiếp', 'dien-tiep')] };
    case 'E02': return { tieuDe: 'Mình chưa đọc được ngày này', noiDung: noiDungE02(b), nut: [nut('Sửa ngày sinh', 'sua-ngay')] };
    case 'E03': return { tieuDe: 'Giờ sinh chưa đúng khung', noiDung: 'Giờ sinh cần nằm trong khoảng từ 00:00 đến 23:59. Nếu bạn không nhớ chính xác, thử hỏi người nhà hoặc xem giấy khai sinh. Giờ sinh quyết định cung Mệnh nên mình muốn bạn có số liệu đúng nhất.', nut: [nut('Sửa giờ sinh', 'sua-gio'), nut('Cách tìm giờ sinh', 'cach-tim-gio')] };
    case 'E04': return { tieuDe: 'Lá số chưa hiện ra được', noiDung: 'Có trục trặc khi lập lá số, lỗi nằm ở phía chúng mình chứ không phải thông tin của bạn. Bạn thử tải lại một lần; dữ liệu đã nhập vẫn được giữ khi bạn tải lại trong cùng thẻ. Nếu vẫn chưa hiện, gửi báo lỗi để mình ghi nhận và chuyển đội xử lý.', nut: [nut('Tải lại', 'tai-lai'), nut('Gửi báo lỗi', 'gui-bao-loi')] };
    case 'E05': return { tieuDe: 'Bước mua thử chưa hoàn tất', noiDung: 'Bước thanh toán thử bị gián đoạn. Chưa có khoản tiền thật nào bị trừ, vì đây là bước giả lập. Bạn đợi vài giây rồi thử lại một lần; nếu vẫn lỗi, gửi báo lỗi kèm ảnh chụp màn hình.', nut: [nut('Thử lại', 'thu-lai'), nut('Gửi báo lỗi', 'gui-bao-loi')] };
    case 'E06': return { tieuDe: 'Mình đã nhận lần bấm đầu của bạn', noiDung: `Mình thấy bạn bấm mua nhiều lần liên tiếp và chỉ ghi nhận một đơn${b.maDon ? ` ${b.maDon}` : ''}${b.tenGoi ? ` cho gói ${b.tenGoi}` : ''}. Bạn không cần bấm thêm, chỉ cần chờ trang chuyển.`, nut: [nut('Xem luận giải', 'xem-luan-giai'), nut('Xem đơn của tôi', 'xem-don')] };
    case 'E07': return { tieuDe: 'Nội dung của bạn đang được mở', noiDung: `${donCuaToi(b)} đã được ghi nhận nhưng nội dung chưa hiện đủ. Bạn thử tải lại trang và đăng nhập đúng tài khoản đã dùng lúc mua. Nếu vẫn chưa thấy, báo lỗi giúp mình${b.maDon ? ' (mã đơn đã được điền sẵn)' : ' kèm mã đơn'}; mình ghi nhận và chuyển đội xử lý.`, nut: [nut('Tải lại', 'tai-lai'), nut('Báo lỗi', 'gui-bao-loi')] };
    case 'E08': return { tieuDe: 'Luận giải đang tải lâu hơn dự kiến', noiDung: 'Việc tải nội dung đang chậm hoặc bị ngắt giữa chừng. Đơn của bạn vẫn được ghi nhận. Bạn thử tải lại, hoặc đổi sang Chrome/Safari, đóng bớt tab đang mở. Nếu vẫn chậm, báo lỗi kèm tên thiết bị.', nut: [nut('Tải lại', 'tai-lai'), nut('Gửi báo lỗi', 'gui-bao-loi')] };
  }
}

// ---------- Tin xác nhận đơn giả lập (3.1) ----------
export interface TinXacNhan { tieuDe: string; dong: string[]; maDon: string; tenGoi: string; giaGoi: string | null; ghiChu: string }
/** Giá chỉ có khi cờ công bố giá bật; tắt thì không có dòng giá trong tin. */
export function tinXacNhanDon(o: { maDon: string; tenGoi: string; maGoi: string }, cong: boolean = CONG_BO_GIA): TinXacNhan {
  const giaGoi = giaCongBo(o.maGoi, cong);
  return {
    tieuDe: 'Đã ghi nhận đơn thử của bạn',
    maDon: o.maDon, tenGoi: o.tenGoi, giaGoi,
    dong: [
      'Đây là bước thử nghiệm: chưa có khoản tiền thật nào bị trừ.',
      'Xem luận giải: bấm nút bên dưới, hoặc lần sau đăng nhập cùng tài khoản đã dùng khi mua rồi vào mục "Luận giải của tôi".',
      'Gặp trục trặc: bấm "Báo lỗi", mã đơn đã được điền sẵn. Mình ghi nhận và chuyển đội xử lý.',
    ],
    ghiChu: DONG_AI_NGAN,
  };
}

/**
 * Nhắc sau khi mua gói Vận 2027 (P19). Chỉ thông tin có thật: không giá, không hạn chót, không câu ép mua.
 * - Mua lẻ: gợi ý mở Trọn lá số (gói gộp chỉ áp khi mua cùng lúc, nên không hứa tiết kiệm ở đây).
 * - Mua gói gộp: báo gói đã gồm cả hai, không nhắc mua thêm.
 * - Nhắc lưu nguyệt chỉ có khi cờ LUU_NGUYET_SAN_SANG bật (P18 xong).
 */
export interface NhacVanNam { combo: LienKet | null; dongCombo: string; luuNguyet: string | null }
export function nhacSauMuaVanNam(maGoi: string, luuNguyetSanSang: boolean = LUU_NGUYET_SAN_SANG): NhacVanNam | null {
  if (!laGoiVan2027(maGoi)) return null;
  const gop = maGoi === 'tron-la-so-kem-van-nam';
  return {
    combo: gop ? null : { nhan: 'Xem các gói', href: '/chon-goi' },
    dongCombo: gop
      ? `Gói của bạn đã gồm cả Trọn lá số (${chuDeTronLaSo()} và đại vận 10 năm) lẫn Vận năm 2027.`
      : `Muốn xem thêm ${chuDeTronLaSo()} và đại vận 10 năm của lá số này? Bạn có thể mở Trọn lá số ở màn chọn gói, không bắt buộc.`,
    luuNguyet: luuNguyetSanSang
      ? 'Vận từng tháng âm lịch: nếu bạn đồng ý nhận tin ở trang Vận năm 2027, mình gửi nội dung vận tháng theo email. Bạn hủy được bất cứ lúc nào.'
      : null,
  };
}

/** Mẫu email giao dịch 3.2. CHỈ LƯU MẪU, chưa có dịch vụ gửi thư nên không nơi nào gọi hàm này để gửi. */
export function mauEmailXacNhan(o: { ten?: string; maDon: string; tenGoi: string; maGoi: string; linkLuanGiai: string }, cong: boolean = CONG_BO_GIA) {
  const gia = giaCongBo(o.maGoi, cong);
  return {
    tieuDe: `Đã ghi nhận đơn thử ${o.maDon} của bạn`,
    noiDung: [
      `Chào ${o.ten?.trim() || 'bạn'},`,
      '',
      'Mình đã ghi nhận đơn thử của bạn. Đây là bước thử nghiệm, chưa có khoản tiền thật nào bị trừ.',
      '',
      `Mã đơn: ${o.maDon}`,
      `Gói: ${o.tenGoi}`,
      ...(gia ? [`Giá hiển thị: ${gia}`] : []),
      '',
      'Cách xem luận giải: bấm liên kết bên dưới, hoặc đăng nhập cùng tài khoản đã dùng khi mua rồi vào mục "Luận giải của tôi".',
      '',
      'Nếu có trục trặc, bạn trả lời thư này hoặc bấm "Báo lỗi" và cho mình biết mã đơn, thiết bị, trình duyệt. Bạn không cần gửi ngày giờ sinh. Mình ghi nhận và chuyển đội xử lý.',
      '',
      `Xem luận giải của tôi: ${o.linkLuanGiai}`,
      '',
      DONG_AI_NGAN,
      'xemtuvi.vn',
    ].join('\n'),
  };
}

// ---------- Mã đơn, liên kết và tự điền biểu mẫu báo lỗi ----------
export const maDonHienThi = (id: number) => `XTV-${String(id).padStart(6, '0')}`;

export interface ThamSoBaoLoi { maDon: string; goi: string; tinhHuong: string }
export function linkBaoLoi(o: Partial<ThamSoBaoLoi> = {}): string {
  const q = new URLSearchParams();
  if (o.maDon) q.set('don', o.maDon);
  if (o.goi) q.set('goi', o.goi);
  if (o.tinhHuong) q.set('th', o.tinhHuong);
  const s = q.toString();
  return `/tro-giup${s ? `?${s}` : ''}#bao-loi`;
}

/** Đọc tham số điền sẵn từ địa chỉ; giá trị lạ bị bỏ (không điền ngày giờ sinh dù ai đó gắn vào địa chỉ). */
export function docThamSoBaoLoi(search: string): ThamSoBaoLoi {
  const q = new URLSearchParams(search);
  const maDon = (q.get('don') ?? '').trim();
  const goi = (q.get('goi') ?? '').trim();
  const th = q.get('th') ?? '';
  return {
    maDon: /^[A-Za-z0-9\-_]{1,40}$/.test(maDon) ? maDon : '',
    goi: /^[A-Za-z0-9\-_]{1,40}$/.test(goi) ? goi : '',
    tinhHuong: ['E04', 'E05', 'E07', 'E08'].includes(th) ? th : '',
  };
}

/** "iPhone · Safari": chỉ tên thiết bị và trình duyệt, không giữ chuỗi nhận dạng đầy đủ. */
export function tomTatThietBi(ua: string): string {
  const may = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Mac OS X|Macintosh/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : 'Thiết bị khác';
  const tt = /Edg\//.test(ua) ? 'Edge' : /OPR\/|Opera/.test(ua) ? 'Opera' : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /FxiOS|Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'trình duyệt khác';
  return `${may} · ${tt}`;
}
