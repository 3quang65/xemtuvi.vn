/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
