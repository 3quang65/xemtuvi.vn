import { NextResponse, type NextRequest } from 'next/server';

// Trang kết quả (lá số của khách) không bao giờ được index.
// SITE_NOINDEX=1: bản thử, cấm index toàn site.
const TRANG_KET_QUA = ['/la-so', '/ket-qua', '/tai-khoan', '/luan-giai', '/chon-goi', '/thanh-toan', '/huy-dang-ky', '/moi', '/toi'];

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;
  const ketQua = TRANG_KET_QUA.some((p) => pathname === p || pathname.startsWith(p + '/'));
  if (process.env.SITE_NOINDEX === '1' || ketQua) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }
  return res;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
