import type { Metadata } from 'next';
import { ChanTrang, DauTrang } from '@/components/Khung';
import MoiVao from '@/components/MoiVao';

export const metadata: Metadata = { title: 'Lời mời dùng thử — xemtuvi.vn', robots: { index: false, follow: false } };

export default async function TrangMoi({ params }: { params: Promise<{ ma: string }> }) {
  const { ma } = await params;
  return (
    <>
      <DauTrang />
      <main><MoiVao ma={ma} /></main>
      <ChanTrang />
    </>
  );
}
