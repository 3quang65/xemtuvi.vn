import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_CO_SINH, canChuyenVeTrangChu } from '@/lib/co-phien';
import { TEN_COOKIE_NGUON, NGAY_NGUON, moHoaNguon, nguonTuYeuCau } from '@/lib/nguon-khach';

// Trang kết quả (lá số của khách) không bao giờ được index.
// SITE_NOINDEX=1: bản thử, cấm index toàn site.
const TRANG_KET_QUA = ['/la-so', '/ket-qua', '/tai-khoan', '/luan-giai', '/chon-goi', '/thanh-toan', '/huy-dang-ky', '/moi', '/toi'];

export function middleware(req: NextRequest) {
  if (req.method === 'GET' && canChuyenVeTrangChu(req.nextUrl.pathname, req.cookies.has(COOKIE_CO_SINH))) {
    // Location tương đối: Next sau nginx thấy host là localhost:3000 nên không dựng URL tuyệt đối từ nextUrl.
    const r = new NextResponse(null, { status: 302, headers: { Location: '/' } });
    r.headers.set('Cache-Control', 'private, no-store');
    return r;
  }
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;
  const ketQua = TRANG_KET_QUA.some((p) => pathname === p || pathname.startsWith(p + '/'));
  if (process.env.SITE_NOINDEX === '1' || ketQua) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }
  // Ghi nguồn khách lần vào đầu có nguồn (UTM hoặc trang giới thiệu ngoài); đã có cookie thì giữ nguyên.
  if (req.method === 'GET' && !pathname.startsWith('/api/') && !req.cookies.has(TEN_COOKIE_NGUON)) {
    const n = nguonTuYeuCau(req.nextUrl.searchParams, req.headers.get('referer'), req.headers.get('host') ?? req.nextUrl.host);
    if (Object.keys(n).length) res.cookies.set(TEN_COOKIE_NGUON, moHoaNguon(n), { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: NGAY_NGUON * 86400 });
  }
  return res;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
