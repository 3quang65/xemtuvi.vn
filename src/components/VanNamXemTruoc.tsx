import Link from 'next/link';
import { dinhDangGia, GOI_VAN_NAM } from '@/lib/goi';
import { XEM_TRUOC } from '@/lib/van-nam-noi-dung';

/** Bản xem trước: đoạn đầu rõ, đoạn sau làm mờ (cùng mẫu khóa .doan-khoa với màn chọn gói). Không chứa nội dung trả phí. */
export function VanNamXemTruoc() {
  return (
    <div className="doan-khoa">
      <h2>{XEM_TRUOC.tieuDe}</h2>
      <p className="tt-ghi-chu">{XEM_TRUOC.ghiChu}</p>
      <p className="doan-ro">{XEM_TRUOC.ro}</p>
      <p className="doan-mo" aria-hidden="true">{XEM_TRUOC.mo}</p>
      <p className="doan-nguon">{XEM_TRUOC.nguon}</p>
      <p className="khoa-nhan">Phần còn lại, bốn mảng và 12 tháng mở khi bạn mua Vận năm 2027.</p>
    </div>
  );
}

/** Hai nút mua (lẻ, gộp) dẫn tới /thanh-toan. Có laSoId thì mua cho đúng lá số đó (xem ở máy khác cũng được). */
export function VanNamNutMua({ laSoId }: { laSoId?: number }) {
  const them = laSoId ? `&laSo=${laSoId}` : '';
  return (
    <div className="hai-nut">
      {GOI_VAN_NAM.map((g) => (
        <Link key={g.ma} href={`/thanh-toan?goi=${g.ma}${them}`} className={`${g.chinh ? 'nut-chinh' : 'nut-phu'} nut-lien-ket`}>
          {g.ten}: {dinhDangGia(g.gia)}
        </Link>
      ))}
    </div>
  );
}
