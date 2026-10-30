import type { Metadata } from 'next';
import BaoLoiForm from '@/components/BaoLoiForm';
import { ChanTrang, DauTrang } from '@/components/Khung';
import { DONG_AI, nhomCauHoi } from '@/lib/tro-giup';

const MO_TA = 'Mười câu hay hỏi khi lập lá số Tử Vi và xem luận giải trên xemtuvi.vn, cùng chỗ gửi báo lỗi hoặc góp ý.';
export const metadata: Metadata = {
  title: 'Trợ giúp — xemtuvi.vn',
  description: MO_TA,
  alternates: { canonical: '/tro-giup' },
  robots: { index: true, follow: true },
};

export default function TrangTroGiup() {
  const nhom = nhomCauHoi();
  return (
    <>
      <DauTrang />
      <main>
        <section className="trang-buoc tro-giup">
          <h1>Trợ giúp</h1>
          <p>Chào bạn. Dưới đây là mười câu mọi người hay hỏi nhất khi lập lá số và xem luận giải. Nếu bạn chưa thấy câu mình cần, cuối trang có chỗ gửi báo lỗi hoặc góp ý.</p>
          {nhom.map((n) => (
            <div key={n.ten} className="khoi-buoc">
              <h2>{n.ten}</h2>
              {n.cau.map((c) => (
                <div key={c.so} id={`cau-${c.so}`} className="cau-hoi">
                  <h3>{c.so}. {c.hoi}</h3>
                  <p>{c.traLoi}</p>
                  {c.lienKet && <p><a href={c.lienKet.href}>{c.lienKet.nhan}</a></p>}
                </div>
              ))}
            </div>
          ))}
          <div className="khoi-buoc" id="bao-loi">
            <h2 id="bao-loi-tieu-de">Chưa thấy câu trả lời? Gửi báo lỗi hoặc góp ý</h2>
            <p>Cho mình biết điều đã xảy ra, bạn đang dùng thiết bị và trình duyệt nào, và mã đơn nếu có.</p>
            <BaoLoiForm />
          </div>
          <p className="dong-ai">{DONG_AI}</p>
        </section>
      </main>
      <ChanTrang />
    </>
  );
}
