import type { Metadata } from 'next';
import ChonGoi from '@/components/ChonGoi';
import { ChanTrang, DauTrang } from '@/components/Khung';

export const metadata: Metadata = { title: 'Chọn gói luận giải — xemtuvi.vn', robots: { index: false, follow: false } };

export default function TrangChonGoi() {
  return (
    <>
      <DauTrang />
      <main>
        <section className="trang-buoc">
          <h1>Chọn gói luận giải</h1>
          <p className="tt-ghi-chu">Luận giải chuyên sâu cho lá số bạn vừa lập. Bản thử: chưa thu tiền thật.</p>
          <ChonGoi />
        </section>
      </main>
      <ChanTrang />
    </>
  );
}
