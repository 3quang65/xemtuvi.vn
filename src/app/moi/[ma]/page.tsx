import type { Metadata } from 'next';
import { ChanTrang, DauTrang } from '@/components/Khung';
import MoiVao from '@/components/MoiVao';
import { moiTat } from '@/lib/may-chu/co-khan';

export const dynamic = 'force-dynamic'; // cờ đọc lúc chạy, không đóng băng lúc build

export const metadata: Metadata = { title: 'Lời mời dùng thử — xemtuvi.vn', robots: { index: false, follow: false } };

/** Thử kín 16/11: cờ KHẨN tắt hoàn toàn luồng nhận khách mới qua mã mời.
 * Bật cờ `THU_KIN_MOI_TAT` (tệp co-khan.json hoặc biến môi trường, xem docs/ky-thuat/co-khan.md) → /moi/* trả 410 "Tạm dừng nhận khách mới"; giữ nguyên
 * luồng miễn phí: lập lá số + xem tóm tắt, không cần tài khoản.
 */

export default async function TrangMoi({ params }: { params: Promise<{ ma: string }> }) {
  const { ma } = await params;
  if (moiTat()) {
    return (
      <>
        <DauTrang />
        <main className="trang-buoc">
          <h1>Tạm dừng nhận khách mới</h1>
          <p>Chúng mình đang tạm dừng nhận khách mới để chuẩn bị cho bản ra mắt (16/11).</p>
          <p>Bạn vẫn có thể <a href="/">lập lá số và xem tóm tắt miễn phí</a>, không cần tài khoản.</p>
        </main>
        <ChanTrang />
      </>
    );
  }
  return (
    <>
      <DauTrang />
      <main><MoiVao ma={ma} /></main>
      <ChanTrang />
    </>
  );
}
