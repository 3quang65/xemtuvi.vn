import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Noto_Serif } from 'next/font/google';
import DoLuong from '@/components/DoLuong';
import './globals.css';

const sans = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
  preload: false,
});

const serif = Noto_Serif({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600'],
  variable: '--font-serif',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://xemtuvi.vn'),
  title: 'Lập lá số tử vi online — xemtuvi.vn',
  description:
    'Lập lá số Tử Vi Đẩu Số theo cách an sao Việt Nam: 12 cung, chính tinh, phụ tinh, tứ hóa, đại vận. Miễn phí, không cần đăng ký.',
  openGraph: { siteName: 'xemtuvi.vn', locale: 'vi_VN', type: 'website' },
};

/** Đặt data-theme trước khi vẽ để không nháy trắng: lựa chọn đã lưu, nếu chưa có thì theo hệ thống. */
const DAT_CHE_DO = `try{var c=localStorage.getItem('xtv-che-do');if(c!=='dark'&&c!=='light')c=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=c}catch(e){}`;

export const viewport: Viewport = { themeColor: '#2B2540' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: DAT_CHE_DO }} /></head>
      <body>
        <DoLuong />
        {children}
      </body>
    </html>
  );
}
