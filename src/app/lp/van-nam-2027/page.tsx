import type { Metadata } from 'next';
import { ChanTrang, DauTrang } from '@/components/Khung';
import LpVanNamNut from '@/components/LpVanNamNut';
import { VanNamXemTruoc } from '@/components/VanNamXemTruoc';
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

export default function TrangVanNam2027() {
  const xt = xemTruocVanNam(lapLaSo({ ...LA_SO_MAU })); // lá số mẫu thật, tính ở máy chủ
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
