import type { MetadataRoute } from 'next';
import { tatCaBai } from '@/lib/bai-viet/doc';
import { GOC } from '@/lib/bai-viet/nhom';

// Trang cố định + mọi bài trong content/ (tự sinh khi thêm tệp .md). Trang riêng tư (/luan-giai, /thanh-toan, /chon-goi) không có ở đây.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${GOC}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${GOC}/lp/van-nam-2027`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${GOC}/van-nam-2027`, changeFrequency: 'weekly', priority: 0.8 },
    ...tatCaBai().map((b) => ({ url: GOC + b.duongDan, lastModified: b.ngayCapNhat, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
