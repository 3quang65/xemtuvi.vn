'use client';

import type { QuyUoc } from '@/lib/tuvi';

type Nhom = { khoa: keyof QuyUoc; tieuDe: string; chon: [string, string][] };

// Mục 6–10 của docs/nghien-cuu/VIEC-CAN-LAM.md. Giá trị đầu tiên của mỗi nhóm là mặc định theo đặc tả.
const NHOM: Nhom[] = [
  { khoa: 'hoaLinh', tieuDe: 'Hỏa Tinh, Linh Tinh (tuổi Tỵ, Dậu, Sửu)', chon: [
    ['cauPhu', 'Theo câu phú: Hỏa khởi Mão, Linh khởi Tuất'], ['ansaotuvi', 'Cách thường thấy trên các trang khác: Hỏa Tuất, Linh Mão']] },
  { khoa: 'khoiViet', tieuDe: 'Thiên Khôi, Thiên Việt (can Đinh, Mậu, Canh, Nhâm)', chon: [
    ['toanThu', 'Theo Toàn Thư'], ['canhTanMaHo', 'Biến thể “Canh Tân phùng Mã Hổ”'], ['ansaotuvi', 'Cách thường thấy trên các trang khác']] },
  { khoa: 'phaToai', tieuDe: 'Phá Toái', chon: [
    ['iztro', 'Theo sách Trung Quốc'], ['ansaotuvi', 'Cách thường thấy trên các trang khác (đổi Tỵ và Dậu)']] },
  { khoa: 'luuHa', tieuDe: 'Lưu Hà', chon: [
    ['trungQuoc', 'Đinh Thân, Canh Thìn (sách Trung Quốc)'], ['ansaotuvi', 'Đinh Thìn, Canh Thân (cách thường thấy)']] },
  { khoa: 'thienTruQuy', tieuDe: 'Thiên Trù (can Quý)', chon: [
    ['tuat', 'Tại Tuất (sách Việt)'], ['hoi', 'Tại Hợi (theo iztro)']] },
  { khoa: 'thienGiai', tieuDe: 'Thiên Giải', chon: [
    ['thienLuong', 'Thân cộng 2 cung mỗi tháng'], ['capThang', 'Theo cặp tháng'], ['thanThuan', 'Thân cộng 1 cung mỗi tháng']] },
  { khoa: 'menhChu', tieuDe: 'Mệnh chủ', chon: [
    ['chiNam', 'Theo chi năm sinh (phái Việt)'], ['cungMenh', 'Theo chi cung Mệnh']] },
  { khoa: 'tuViTyNgo', tieuDe: 'Độ sáng Tử Vi ở Tý, Ngọ', chon: [
    ['ansaotuvi', 'Tý Bình, Ngọ Miếu'], ['cungMieu', 'Cả hai Miếu'], ['cungBinh', 'Cả hai Bình']] },
  { khoa: 'dacTinhHoa', tieuDe: 'Độ sáng Hóa Lộc, Quyền, Kỵ', chon: [
    ['ansaotuvi', 'Có ghi (đắc ở tứ mộ, hãm nơi khác)'], ['an', 'Không ghi']] },
];

/** Dòng ghi chú trường phái + công tắc đổi tùy chọn, đặt dưới bàn lá số. */
export default function TuyChonTruongPhai({ quyUoc, onDoi }: { quyUoc: QuyUoc; onDoi: (p: Partial<QuyUoc>) => void }) {
  const khac = NHOM.filter((n) => quyUoc[n.khoa] !== n.chon[0][0]);
  return (
    <div className="truong-phai">
      <p className="chu-giai">
        <strong>Trường phái:</strong> Tử Vi Đẩu Số phái Việt.{' '}
        {khac.length === 0
          ? 'Các điểm sách vở còn khác nhau đang dùng cách mặc định của xemtuvi.vn.'
          : `Bạn đã đổi ${khac.length} điểm so với mặc định: ${khac.map((n) => `${n.tieuDe} → ${n.chon.find(([v]) => v === quyUoc[n.khoa])?.[1]}`).join('; ')}.`}
      </p>
      <details className="phuong-phap tuy-chon">
        <summary>Đổi cách an sao ở những điểm các sách khác nhau</summary>
        <div className="tuy-chon-luoi">
          {NHOM.map((n) => (
            <label key={n.khoa} className="tuy-chon-o">
              <span>{n.tieuDe}</span>
              <select value={quyUoc[n.khoa]} onChange={(e) => onDoi({ [n.khoa]: e.target.value } as Partial<QuyUoc>)}>
                {n.chon.map(([v, t], i) => <option key={v} value={v}>{t}{i === 0 ? ' (mặc định)' : ''}</option>)}
              </select>
            </label>
          ))}
        </div>
      </details>
    </div>
  );
}
