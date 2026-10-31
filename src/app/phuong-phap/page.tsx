import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ChanTrang, DauTrang } from '@/components/Khung';
import { Markdown } from '@/lib/bai-viet/markdown';

const MO_TA = 'xemtuvi.vn luận giải theo trường phái nào, dựa vào nguồn nào, kiểm duyệt ra sao và giới hạn của chúng tôi.';
export const metadata: Metadata = {
  title: 'Phương pháp & nguồn — xemtuvi.vn',
  description: MO_TA,
  alternates: { canonical: '/phuong-phap' },
  robots: { index: true, follow: true },
};

// Nội dung do phòng kiểm duyệt duyệt, nằm trong content/phuong-phap.md; đọc lúc build (trang tĩnh).
const NOI_DUNG = readFileSync(path.join(process.cwd(), 'content', 'phuong-phap.md'), 'utf8').replace(/^# .*\n/, '');

export default function TrangPhuongPhap() {
  return (
    <>
      <DauTrang />
      <main>
        <article className="trang-buoc bai-doc">
          <h1>Phương pháp &amp; nguồn</h1>
          <Markdown md={NOI_DUNG} />
        </article>
      </main>
      <ChanTrang />
    </>
  );
}
