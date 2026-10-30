import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ChanTrang, DauTrang } from '@/components/Khung';
import ThanhToan from '@/components/ThanhToan';

export const metadata: Metadata = { title: 'Thanh toán — xemtuvi.vn', robots: { index: false, follow: false } };

export default function TrangThanhToan() {
  return (
    <>
      <DauTrang />
      <main>
        <Suspense fallback={<p className="dang-tai" role="status">Đang tải…</p>}><ThanhToan /></Suspense>
      </main>
      <ChanTrang />
    </>
  );
}
