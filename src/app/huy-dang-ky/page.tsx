import type { Metadata } from 'next';
import { ChanTrang, DauTrang } from '@/components/Khung';
import HuyDangKy from '@/components/HuyDangKy';

export const metadata: Metadata = { title: 'Hủy đăng ký nhận tin — xemtuvi.vn', robots: { index: false, follow: false } };

export default async function TrangHuy({ searchParams }: { searchParams: Promise<{ ma?: string }> }) {
  const { ma } = await searchParams;
  return (
    <>
      <DauTrang />
      <main>
        <section className="lien-he">
          <h1>Hủy đăng ký nhận tin</h1>
          <HuyDangKy ma={typeof ma === 'string' ? ma : ''} />
        </section>
      </main>
      <ChanTrang />
    </>
  );
}
