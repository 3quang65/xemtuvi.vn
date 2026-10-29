import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Không có trang nào chứa dữ liệu sinh của khách; mọi lá số chỉ tính trên trình duyệt.
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/tai-khoan/'] }],
    sitemap: 'https://xemtuvi.vn/sitemap.xml',
  };
}
