import type { Bai } from './doc';
import { GOC, NHOM } from './nhom';

/** Dữ liệu có cấu trúc (JSON-LD) cho một bài: Article + BreadcrumbList, thêm FAQPage khi có mục Hỏi đáp. */
export function schemaBai(b: Bai): object[] {
  const url = GOC + b.duongDan;
  const ra: object[] = [
    {
      '@context': 'https://schema.org', '@type': 'Article', headline: b.tieuDe, description: b.moTa,
      datePublished: b.ngayDang, dateModified: b.ngayCapNhat, inLanguage: 'vi', mainEntityOfPage: url,
      publisher: { '@type': 'Organization', name: 'xemtuvi.vn', url: GOC },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: GOC + '/' },
        { '@type': 'ListItem', position: 2, name: NHOM[b.nhom].ten, item: `${GOC}/${b.nhom}` },
        { '@type': 'ListItem', position: 3, name: b.tieuDe, item: url },
      ],
    },
  ];
  if (b.hoiDap.length) {
    ra.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: b.hoiDap.map((q) => ({ '@type': 'Question', name: q.hoi, acceptedAnswer: { '@type': 'Answer', text: q.dap } })),
    });
  }
  return ra;
}

export const schemaToChuc = () => ({
  '@context': 'https://schema.org', '@type': 'Organization', name: 'xemtuvi.vn', url: GOC, inLanguage: 'vi',
  description: 'Lập và luận giải lá số Tử Vi Đẩu Số theo cách an sao Việt Nam, ghi rõ sao, cung và trường phái.',
});
