import type { Metadata } from 'next';
import { ChanTrang, DauTrang } from '@/components/Khung';
import NhanTinVanNam from '@/components/NhanTinVanNam';
import { docBai, dsMa } from '@/lib/bai-viet/doc';
import { NHOM } from '@/lib/bai-viet/nhom';

const TIEU_DE = 'Vận năm 2027 theo Tử Vi: đọc theo tuổi và mệnh';
const MO_TA = 'Tổng hợp vận năm 2027 (Đinh Mùi) theo tuổi và mệnh, mỗi nhận định ghi rõ sao, cung và trường phái. Đăng ký để nhận tin khi có bài mới.';

export const metadata: Metadata = {
  title: `${TIEU_DE} — xemtuvi.vn`,
  description: MO_TA,
  alternates: { canonical: '/van-nam-2027' },
  openGraph: { title: TIEU_DE, description: MO_TA, type: 'website', url: '/van-nam-2027' },
};

export default function TrangTru() {
  const bai = dsMa('van-nam-2027').map((ma) => docBai('van-nam-2027', ma)!);
  return (
    <>
      <DauTrang />
      <main>
        <section className="trang-buoc">
          <h1>{TIEU_DE}</h1>
          <p>
            Năm 2027 là năm Đinh Mùi. Mỗi người có một lá số riêng, nên cách đọc vận năm cũng khác nhau.
            Trang này gom các bài đọc theo tuổi và theo mệnh, mỗi bài ghi rõ căn cứ để bạn đối chiếu với thực tế của mình.
          </p>
          {bai.length > 0 && (
            <>
              <h2>Các bài đã có</h2>
              <ul>{bai.map((b) => <li key={b.ma}><a href={b.duongDan}>{b.tieuDe}</a></li>)}</ul>
            </>
          )}
          <p>Muốn xem vận năm theo chính lá số của bạn, <a href="/lp/van-nam-2027">xem chi tiết Vận năm 2027</a>.</p>
          <NhanTinVanNam />
          <p className="tt-ghi-chu">Nội dung do AI tạo, mang tính tham khảo. Tử Vi là một góc nhìn để bạn hiểu mình hơn, quyết định luôn là của bạn.</p>
        </section>
      </main>
      <ChanTrang />
    </>
  );
}
