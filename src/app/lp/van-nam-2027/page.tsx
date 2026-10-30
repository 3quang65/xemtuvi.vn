import type { Metadata } from 'next';
import { ThanGoi } from '@/components/ThanGoi';
import { ChanTrang, DauTrang } from '@/components/Khung';
import LpVanNamNut from '@/components/LpVanNamNut';
import { VanNamXemTruoc } from '@/components/VanNamXemTruoc';
import { CONG_BO_GIA, GOI_VAN_NAM, khuVanNam } from '@/lib/goi';
import { lapLaSo } from '@/lib/tuvi';
import { xemTruocVanNam } from '@/lib/luan-giai/ai/van-nam';
import { LA_SO_MAU, LP, TEN_NAM } from '@/lib/van-nam-noi-dung';

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
  const xt = xemTruocVanNam(lapLaSo({ ...LA_SO_MAU })); // lá số mẫu thật, tính ở máy chủ
  const goiBan = CONG_BO_GIA ? khuVanNam(GOI_VAN_NAM) : [];
  return (
    <>
      <DauTrang />
      <main>
        <section className="trang-buoc">
          <h1>{LP.tieuDe}</h1>
          <p>{LP.dan}</p>
          <LpVanNamNut nhan={LP.nutLap} />
          <h2>Bạn nhận được gì</h2>
          <ul className="loi-ich">
            {LP.loiIch.map((l) => <li key={l.ten}><strong>{l.ten}</strong><span>{l.moTa}</span></li>)}
          </ul>
          <h2>Xem trước một đoạn</h2>
          <VanNamXemTruoc xt={xt} mau />
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
          <ol className="ba-buoc">{LP.buoc.map((b) => <li key={b}>{b}</li>)}</ol>
          <LpVanNamNut nhan={LP.nutLap} />
          <p className="tt-ghi-chu">{LP.luuY}</p>
        </section>
      </main>
      <ChanTrang />
    </>
  );
}
