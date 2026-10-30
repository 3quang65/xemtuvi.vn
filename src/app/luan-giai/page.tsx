import type { Metadata } from 'next';
import { ChanTrang, DauTrang } from '@/components/Khung';
import LuanGiai from '@/components/LuanGiai';

export const metadata: Metadata = { title: 'Luận giải chuyên sâu — xemtuvi.vn', robots: { index: false, follow: false } };

export default function TrangLuanGiai() {
  return (
    <>
      <DauTrang />
      <main><LuanGiai /></main>
      <ChanTrang />
    </>
  );
}
