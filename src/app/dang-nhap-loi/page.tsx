import type { Metadata } from 'next';
import Link from 'next/link';
import { ChanTrang, DauTrang } from '@/components/Khung';

export const metadata: Metadata = { title: 'Đăng nhập chưa thành công — xemtuvi.vn', robots: { index: false, follow: false } };

const LY_DO: Record<string, string> = {
  huy: 'Bạn đã hủy đăng nhập Google.',
  state_sai: 'Phiên đăng nhập đã hết hạn hoặc không khớp.',
  email_chua_xac_minh: 'Email Google này chưa được xác minh nên mình chưa thể cho đăng nhập.',
  thieu_email: 'Tài khoản Google không cung cấp email.',
};

export default async function TrangDangNhapLoi({ searchParams }: { searchParams: Promise<{ ma?: string }> }) {
  const { ma } = await searchParams;
  return (
    <>
      <DauTrang />
      <main>
        <h1>Đăng nhập chưa thành công</h1>
        <p role="alert">{(ma && LY_DO[ma]) || 'Có lỗi khi đăng nhập bằng Google.'} Bạn thử lại giúp mình nhé.</p>
        <p><Link href="/">Về trang chủ</Link></p>
      </main>
      <ChanTrang />
    </>
  );
}
