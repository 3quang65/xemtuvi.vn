import type { Metadata } from 'next';
import { ChanTrang, DauTrang } from '@/components/Khung';
import SinhCon2027 from '@/components/SinhCon2027';

// Công cụ miễn phí, chưa công bố: noindex, không có trong menu và sitemap.
export const metadata: Metadata = {
  title: 'Sinh con 2027 hợp bố mẹ — xemtuvi.vn',
  description: 'Xem năm Đinh Mùi 2027 và tuổi của bố mẹ theo can chi, tham khảo văn hóa.',
  robots: { index: false, follow: false },
};

export default function TrangSinhCon2027() {
  return (
    <>
      <DauTrang />
      <main>
        <section className="trang-buoc">
          <h1>Sinh con 2027 hợp bố mẹ</h1>
          <p>Nhập năm sinh của bố và mẹ để xem tuổi hai người và năm Đinh Mùi 2027 gặp nhau thế nào theo can chi.</p>
          <SinhCon2027 />
        </section>
      </main>
      <ChanTrang />
    </>
  );
}
