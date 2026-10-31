/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // D4: nhúng CSS vào HTML để không chặn vẽ trang (bỏ 1 request CSS 7 KiB).
  experimental: { inlineCss: true },
  poweredByHeader: false,
  // Triển khai không gián đoạn: build vào thư mục riêng (xem scripts/trien-khai.sh). Mặc định .next.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  async headers() {
    // Trang gắn với tài khoản/quyền mua: không cho đệm ở trình duyệt hay CDN.
    const rieng = [{ key: 'Cache-Control', value: 'private, no-store' }, { key: 'X-Robots-Tag', value: 'noindex, nofollow' }];
    return [
      { source: '/luan-giai', headers: rieng },
      { source: '/thanh-toan', headers: rieng },
      { source: '/api/:path*', headers: rieng },
    ];
  },
};

export default nextConfig;
