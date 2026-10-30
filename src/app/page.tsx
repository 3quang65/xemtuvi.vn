import LapLaSo from '@/components/LapLaSo';
import type { Metadata } from 'next';
import { ChanTrang, DauTrang } from '@/components/Khung';
import { schemaToChuc } from '@/lib/bai-viet/schema';

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default function TrangChu() {
  return (
    <>
      <DauTrang />

      <main>
        <LapLaSo />

        <section className="gioi-thieu">
          <h2>Lá số được an như thế nào</h2>
          <p>
            Lá số được an theo cách của các sách Tử Vi Việt Nam: đổi ngày sinh sang âm lịch theo múi giờ Việt Nam,
            an cung Mệnh – Thân theo tháng và giờ sinh, định Cục theo nạp âm cung Mệnh, rồi an 14 chính tinh,
            các phụ tinh, tứ hóa theo can năm, Tuần – Triệt, vòng Tràng Sinh và đại vận 10 năm.
          </p>
          <p>
            Mỗi sao kèm độ sáng tại cung: Miếu, Vượng, Đắc, Bình hòa, Hãm. Các điểm mà những trường phái an khác nhau
            sẽ được ghi chú rõ trong phần luận giải.
          </p>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaToChuc()) }} />
      <ChanTrang />
    </>
  );
}
