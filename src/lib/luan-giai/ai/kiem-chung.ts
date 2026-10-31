// Kiểm chứng năm đã qua (2025, 2026): vài nhận định miễn phí về chính lá số để khách tự đối chiếu với năm mình đã sống, trước phần khóa của Vận 2027.
// Chỉ đọc vị trí lưu niên từ engine (qua src/lib/tuvi/index.ts), không dùng bộ quy tắc / nội dung 2027, không có mã quy tắc trong kết quả.
// Câu chữ do Hạnh duyệt (docs/san-pham/kiem-chung-mau.md); KIEM_CHUNG_CAU_TAM = true khi còn dùng câu tạm chờ Hạnh/Thư.
import { luuNien, type LaSo } from '../../tuvi';
import { kiemTraNamXem, NAM_KIEM_CHUNG, xemTruocVanNam, type XemTruocVanNam } from './van-nam';

/** TẠM – chờ Hạnh/Thư: mọi câu dưới đây là khung tạm. Đổi sang false khi câu của Hạnh đã được Thư duyệt và thay vào CHU_DE_CUNG / MAU_CAU. */
export const KIEM_CHUNG_CAU_TAM = true;

export interface NhanDinhKiemChung { text: string; canCu: string }
export interface KiemChungNam { nam: number; canChi: string; nhanDinh: NhanDinhKiemChung[] }
export type XemTruocCoKiemChung = XemTruocVanNam & { kiemChung?: KiemChungNam[] };

/** Cờ môi trường, mặc định TẮT. Chỉ '1' mới bật. Đọc mỗi lần gọi (không cố định lúc nạp module). */
export const kiemChungBat = (): boolean => process.env.KIEM_CHUNG_QUA_KHU === '1';

/** TẠM – chờ Hạnh/Thư: chủ đề của từng cung, viết ở mức xu hướng. */
const CHU_DE_CUNG: Record<string, string> = {
  'Mệnh': 'cách bạn nhìn nhận và đặt mình trong cuộc sống',
  'Phụ Mẫu': 'quan hệ với cha mẹ, thầy cô, người bề trên',
  'Phúc Đức': 'đời sống nội tâm và cảm giác an yên',
  'Điền Trạch': 'nhà cửa, chỗ ở và tài sản tích lũy',
  'Quan Lộc': 'công việc và hướng đi sự nghiệp',
  'Nô Bộc': 'bạn bè, đồng nghiệp và người cùng làm việc',
  'Thiên Di': 'việc đi lại, môi trường mới và các mối quan hệ bên ngoài',
  'Tật Ách': 'sức khỏe và nhịp sinh hoạt',
  'Tài Bạch': 'thu nhập và cách bạn quản lý tiền',
  'Tử Tức': 'con cái, dự án riêng và những gì bạn vun trồng',
  'Phu Thê': 'tình cảm và quan hệ gần gũi',
  'Huynh Đệ': 'anh chị em và những người đồng hành thân thiết',
};

const NGUON = 'Căn cứ: Lưu Thái Tuế an theo năm âm lịch, tam hợp phái Việt (đặc tả an sao xemtuvi.vn).';

/** Cung (tên) ứng với chi của lưu niên. */
const tenCung = (ls: LaSo, chi: number | null) => (chi == null ? '' : ls.cung[chi].ten);

/**
 * Nhận định năm đã qua của một lá số. Mỗi năm một câu về trọng điểm (cung Lưu Thái Tuế); năm 2026 thêm một câu về cung hóa lộc của lưu niên.
 * Tổng 3 câu. Nói về xu hướng truy về cung/sao, không khẳng định sự kiện, không đe dọa, không kêu gọi mua.
 */
export function kiemChungQuaKhu(ls: LaSo): KiemChungNam[] {
  return NAM_KIEM_CHUNG.map((nam, i) => {
    kiemTraNamXem(nam, ls, { kiemChung: true });
    const ln = luuNien(ls, nam, true);
    const tt = tenCung(ls, ln.luuThaiTue);
    const nhanDinh: NhanDinhKiemChung[] = [{
      text: `Năm ${nam} (${ln.canChi}): lá số của bạn đặt trọng điểm của năm ở cung ${tt}, liên quan đến ${CHU_DE_CUNG[tt] ?? tt}. Đây là xu hướng theo cách an sao, bạn tự đối chiếu với năm mình đã sống.`,
      canCu: `${NGUON} Lưu Thái Tuế năm ${nam} nằm ở cung ${tt}.`,
    }];
    const loc = ln.luuTuHoa.find((h) => h.hoa === 'Hóa Lộc');
    if (i === NAM_KIEM_CHUNG.length - 1 && loc) {
      const cl = tenCung(ls, loc.chi);
      nhanDinh.push({
        text: `Cũng trong năm ${nam}, nguồn thuận của năm dễ đến qua lĩnh vực của cung ${cl} (${CHU_DE_CUNG[cl] ?? cl}). Đây là khả năng nghiêng về, không phải điều chắc xảy ra.`,
        canCu: `Căn cứ: Hóa Lộc lưu niên (${loc.sao}) rơi vào cung ${cl}, tam hợp phái Việt (đặc tả an sao xemtuvi.vn).`,
      });
    }
    return { nam, canChi: ln.canChi, nhanDinh };
  });
}

/** Bản xem trước Vận 2027 (đã cắt như cũ) kèm phần kiểm chứng khi cờ bật. Cờ tắt: không có khóa kiemChung. */
export function xemTruocCoKiemChung(ls: LaSo, tuyChon: { namXem?: number } = {}): XemTruocCoKiemChung {
  const xt = xemTruocVanNam(ls, tuyChon);
  return kiemChungBat() ? { ...xt, kiemChung: kiemChungQuaKhu(ls) } : xt;
}
