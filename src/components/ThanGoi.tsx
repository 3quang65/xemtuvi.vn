import { CONG_BO_GIA, dongHanBan, giaHienThi, type Goi } from '@/lib/goi';

/** Thân thẻ gói (nhãn, tên, giá, so sánh, hạn bán, quyền lợi), không hook: dùng chung cho /chon-goi (máy khách) và trang đích (máy chủ). */
export function ThanGoi({ g, cong = CONG_BO_GIA }: { g: Goi; cong?: boolean }) {
  const hanBan = cong ? dongHanBan(g) : null;
  return (
    <>
      {g.nhan && <span className="nhan-chinh">{g.nhan}</span>}
      <h3>{g.ten}</h3>
      <p className="gia">{cong ? <><strong>{giaHienThi(g.gia, cong)}</strong> <span>/ {g.donVi}</span></> : <span>{giaHienThi(g.gia, cong)}</span>}</p>
      {cong && g.soSanh && (g.ma === 'tron-la-so-kem-van-nam'
        ? <p className="so-sanh">{g.soSanh.join(' · ')}</p> // một dòng chữ thường: "Mua riêng X · tiết kiệm Y" (dong-gia-van-2027 mục 1)
        : <ul className="so-sanh">{g.soSanh.map((s) => <li key={s}>{s}</li>)}</ul>)}
      {hanBan && <p className="han-ban">{hanBan}</p>}
      <ul className="quyen-loi">{g.quyenLoi.map((q) => <li key={q}>{q}</li>)}</ul>
    </>
  );
}
