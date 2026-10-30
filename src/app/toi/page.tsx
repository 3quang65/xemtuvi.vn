import type { Metadata } from 'next';
import { ChanTrang, DauTrang } from '@/components/Khung';
import TaiKhoanToi from '@/components/TaiKhoanToi';

export const metadata: Metadata = { title: 'Tài khoản của tôi — xemtuvi.vn', robots: { index: false, follow: false } };

export default function TrangToi() {
  return (
    <>
      <DauTrang />
      <main><TaiKhoanToi /></main>
      <ChanTrang />
    </>
  );
}
