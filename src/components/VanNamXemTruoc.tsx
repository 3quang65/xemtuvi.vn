import Link from 'next/link';
import { CONG_BO_GIA, dinhDangGia, dongGoiGop, type Goi } from '@/lib/goi';
import { useGia } from '@/lib/useGia';
import type { XemTruocVanNam } from '@/lib/luan-giai/ai/van-nam';
import { XEM_TRUOC } from '@/lib/van-nam-noi-dung';

/**
 * Bản xem trước từ lá số thật (máy chủ đã cắt: không nội dung tháng, không mã quy tắc).
 * Phần khóa mờ chỉ là chữ giữ chỗ cố định, không chứa nội dung trả phí.
 */
export function VanNamXemTruoc({ xt, mau = false }: { xt: XemTruocVanNam; mau?: boolean }) {
  return (
    <div className="doan-khoa">
      <h2>{XEM_TRUOC.tieuDe} {xt.canChi}</h2>
      {mau && <p className="tt-ghi-chu">{XEM_TRUOC.ghiChuMau}</p>}
      <p className="tt-ghi-chu">Từ {xt.dauBai.tuNgay} đến {xt.dauBai.denNgay} (dương lịch)</p>
      {xt.dauBai.cau.map((c, i) => <p key={`d${i}`} className="doan-ro">{c}</p>)}
      {xt.thaiTue.map((c, i) => <p key={`t${i}`} className="doan-ro">{c}</p>)}
      {xt.diemThuan && <p className="doan-ro">{xt.diemThuan}</p>}
      <p className="doan-mo" aria-hidden="true">{XEM_TRUOC.khoa}</p>
      <p className="khoa-nhan">{XEM_TRUOC.moKhoa}</p>
      <p className="doan-nguon">{xt.ghiChu}</p>
    </div>
  );
}

/** Hai nút mua (lẻ, gộp) dẫn tới /thanh-toan. Có laSoId thì mua cho đúng lá số đó (xem ở máy khác cũng được). */
export function VanNamNutMua({ laSoId }: { laSoId?: number }) {
  const them = laSoId ? `&laSo=${laSoId}` : '';
  const { vanNam } = useGia();
  if (vanNam.length === 0) return null; // cổng mở bán đóng: không bán Vận 2027
  const dong = CONG_BO_GIA ? dongGoiGop(vanNam.find((g) => g.ma === 'tron-la-so-kem-van-nam') ?? ({} as Goi)) : null;
  return (
    <>
    <div className="hai-nut">
      {vanNam.map((g) => (
        <Link key={g.ma} href={`/thanh-toan?goi=${g.ma}${them}`} className={`${g.chinh ? 'nut-chinh' : 'nut-phu'} nut-lien-ket`}>
          {CONG_BO_GIA ? `${g.ten}: ${dinhDangGia(g.gia)}` : g.ten}
        </Link>
      ))}
    </div>
    {dong && <p className="tt-ghi-chu">{dong}</p>}
    </>
  );
}
