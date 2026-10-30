import type { Metadata } from 'next';
import ChonGoi from '@/components/ChonGoi';
import { ChanTrang, DauTrang } from '@/components/Khung';

export const metadata: Metadata = { title: 'Chọn gói luận giải — xemtuvi.vn', robots: { index: false, follow: false } };

export default function TrangChonGoi() {
  return (
    <>
      <DauTrang />
      <main><ChonGoi /></main>
      <ChanTrang />
    </>
  );
}
