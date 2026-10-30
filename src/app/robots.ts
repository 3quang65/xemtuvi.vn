import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  // Bản thử (SITE_NOINDEX=1): cấm toàn bộ.
  if (process.env.SITE_NOINDEX === '1') {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  // Không có trang nào chứa dữ liệu sinh của khách; mọi lá số chỉ tính trên trình duyệt.
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/tai-khoan/', '/la-so/', '/ket-qua/'] },
    ],
    sitemap: 'https://xemtuvi.vn/sitemap.xml',
  };
}
