import type { Metadata } from 'next';
import { ThanGoi } from '@/components/ThanGoi';
import { ChanTrang, DauTrang } from '@/components/Khung';
import LpVanNamNut from '@/components/LpVanNamNut';
import { VanNamXemTruoc } from '@/components/VanNamXemTruoc';
import { CONG_BO_GIA, GOI_VAN_NAM, khuVanNam } from '@/lib/goi';
import { lapLaSo } from '@/lib/tuvi';
import { xemTruocCoKiemChung } from '@/lib/luan-giai/ai/kiem-chung';
import { buocLp, LA_SO_MAU, LP, TEN_NAM } from '@/lib/van-nam-noi-dung';

// Trang bán hàng, cho phép lập chỉ mục. Không có dữ liệu khách: lá số tính trên trình duyệt, nội dung trả phí ở /luan-giai (noindex).
export const metadata: Metadata = {
  title: `Vận năm 2027 (${TEN_NAM}) — xemtuvi.vn`,
  description: LP.moTa,
  alternates: { canonical: '/lp/van-nam-2027' },
  openGraph: { title: LP.tieuDe, description: LP.moTa, type: 'website' },
};

// Khối Giá phụ thuộc cổng mở bán (ngày, cờ môi trường) nên trang dựng theo từng yêu cầu.
export const dynamic = 'force-dynamic';

export default function TrangVanNam2027() {
  const xt = xemTruocCoKiemChung(lapLaSo({ ...LA_SO_MAU })); // lá số mẫu thật, tính ở máy chủ
  const goiBan = CONG_BO_GIA ? khuVanNam(GOI_VAN_NAM) : [];
  return (
    <>
      <DauTrang />
      <main>
        <section className="trang-buoc">
          <div className="hero-lp">
            <svg className="hero-hoa" viewBox="0 0 300 300" fill="none" stroke="#6a3d73" aria-hidden="true"><rect x="20" y="20" width="260" height="260" rx="6" strokeWidth="1.5" opacity=".5"/><rect x="80" y="80" width="140" height="140" strokeWidth="1.5" opacity=".5"/><path d="M20 20L80 80M280 20L220 80M20 280L80 220M280 280L220 220M80 20v60M150 20v60M220 20v60M80 220v60M150 220v60M220 220v60M20 80h60M20 150h60M20 220h60M220 80h60M220 150h60M220 220h60" strokeWidth="1.2" opacity=".45"/><circle cx="150" cy="150" r="46" strokeWidth="1.5" opacity=".55"/><g fill="#a8344f" stroke="none"><circle cx="150" cy="20" r="5"/><circle cx="220" cy="80" r="4"/><circle cx="80" cy="220" r="4"/></g><g fill="#7f5a0f" stroke="none" opacity=".8"><circle cx="150" cy="150" r="5"/></g></svg>
            <div className="hero-nam" aria-hidden="true"><small>Năm Đinh Mùi</small>2027</div>
            <h1>{LP.tieuDe}</h1>
            <p>{LP.dan}</p>
            <LpVanNamNut nhan={LP.nutLap} />
          </div>
          <h2>Bạn nhận được gì</h2>
          <ul className="loi-ich">
            {LP.loiIch.map((l) => <li key={l.ten}><strong>{l.ten}</strong><span>{l.moTa}</span></li>)}
          </ul>
          <h2>Xem trước một đoạn</h2>
          <VanNamXemTruoc xt={xt} mau moBan={goiBan.length > 0} />
          {goiBan.length > 0 && (
            <>
              <h2>Giá</h2>
              <p className="tt-ghi-chu">Lập lá số miễn phí trước, chọn gói sau khi xem bản xem trước của chính bạn.</p>
              <ul className="luoi-goi khu-van-nam">
                {goiBan.map((g) => <li key={g.ma} className={`the-goi ${g.chinh ? 'noi-bat' : ''}`}><ThanGoi g={g} /></li>)}
              </ul>
              <LpVanNamNut nhan={LP.nutLap} />
            </>
          )}
          <h2>Ba bước</h2>
          <ol className="ba-buoc">{buocLp(goiBan.length > 0).map((b) => <li key={b}>{b}</li>)}</ol>
          <LpVanNamNut nhan={LP.nutLap} />
          <p className="tt-ghi-chu">{LP.luuY}</p>
        </section>
      </main>
      <ChanTrang />
    </>
  );
}
