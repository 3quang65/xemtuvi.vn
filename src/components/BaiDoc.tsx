import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChanTrang, DauTrang } from '@/components/Khung';
import { docBai, dsMa, type Bai } from '@/lib/bai-viet/doc';
import { Markdown } from '@/lib/bai-viet/markdown';
import { NHOM } from '@/lib/bai-viet/nhom';
import { schemaBai } from '@/lib/bai-viet/schema';

/** Dùng chung cho mọi route bài: generateStaticParams, generateMetadata và trang. HTML có chữ thật (render ở máy chủ khi build). */
export const thamSo = (nhom: string, khoa: string) => () => dsMa(nhom).map((ma) => ({ [khoa]: ma }));

export function metaBai(nhom: string, ma: string): Metadata {
  const b = docBai(nhom, ma);
  if (!b) return {};
  return {
    title: `${b.tieuDe} — xemtuvi.vn`,
    description: b.moTa,
    alternates: { canonical: b.duongDan },
    openGraph: { title: b.tieuDe, description: b.moTa, type: 'article', url: b.duongDan, publishedTime: b.ngayDang, modifiedTime: b.ngayCapNhat },
  };
}

export function BaiDoc({ nhom, ma }: { nhom: string; ma: string }) {
  const b: Bai | null = docBai(nhom, ma);
  if (!b) notFound();
  const goc = nhom === 'van-nam-2027' ? { href: '/van-nam-2027', ten: 'Vận năm 2027' } : null;
  return (
    <>
      <DauTrang />
      <main>
        <article className="trang-buoc bai-doc">
          <nav aria-label="Đường dẫn" className="tt-ghi-chu">
            <a href="/">Trang chủ</a> › {goc ? <a href={goc.href}>{goc.ten}</a> : NHOM[nhom].ten} › {b.tieuDe}
          </nav>
          <h1>{b.tieuDe}</h1>
          <p className="tt-ghi-chu">Cập nhật {b.ngayCapNhat.split('-').reverse().join('/')}</p>
          <Markdown md={b.noiDung} />
          {b.nguon && <p className="tt-ghi-chu">Nguồn và trường phái: {b.nguon}</p>}
          <p className="tt-ghi-chu">Nội dung mang tính tham khảo, giúp bạn hiểu mình hơn; quyết định luôn là của bạn.</p>
        </article>
        {schemaBai(b).map((s, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />
        ))}
      </main>
      <ChanTrang />
    </>
  );
}
