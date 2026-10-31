import Link from 'next/link';
import { giaCongBo, layGoi } from '@/lib/goi';
import { tongHopQuyen, type QuyenGiaoDien } from '@/lib/quyen-xem';
import { VanNamNutMua } from './VanNamXemTruoc';

/** Có thành viên năm còn hạn, nhưng lá số này nằm sau `soNam` lá số đầu và chưa mở gói nào khác. */
export function laNgoaiGoiNam(quyen: QuyenGiaoDien[], laSoId: number, laSoIds: number[], soNam: number): boolean {
  if (!(soNam > 0) || !quyen.some((x) => x.loai === 'thanh_vien')) return false;
  return laSoIds.indexOf(laSoId) >= soNam && !tongHopQuyen(quyen, laSoId, laSoIds);
}

/**
 * Thành viên năm chỉ phủ vài lá số đầu (số do /api/toi trả, không nhúng mã máy chủ vào trình duyệt).
 * Lá số nằm ngoài vẫn lưu được; ở đây chỉ dẫn sang mua lẻ. Không gọi API nội dung nên không có lỗi 403 ghi vào nhật ký.
 */
export function NgoaiGoiNam({ laSoId, soLaSo }: { laSoId: number; soLaSo: number }) {
  const tron = layGoi('tron-la-so');
  const gia = giaCongBo('tron-la-so');
  return (
    <div className="ngoai-goi-nam">
      <p>Lá số này nằm ngoài {soLaSo} lá số của gói năm.</p>
      <p className="tt-ghi-chu">Bạn vẫn lưu và xem phần lập lá số như thường. Nếu muốn đọc luận giải cho lá số này, bạn có thể mở riêng nhé.</p>
      <div className="hai-nut">
        <Link href={`/thanh-toan?goi=tron-la-so&laSo=${laSoId}`} className="nut-chinh nut-lien-ket">{tron?.ten ?? 'Trọn lá số'}{gia ? `: ${gia}` : ''}</Link>
      </div>
      <VanNamNutMua laSoId={laSoId} daCoTron />
    </div>
  );
}
