import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ChanTrang, DauTrang } from '@/components/Khung';
import { Markdown } from '@/lib/bai-viet/markdown';

const MO_TA = 'xemtuvi.vn thu thông tin gì, dùng làm gì và bạn xóa thông tin của mình thế nào.';
export const metadata: Metadata = {
  title: 'Quyền riêng tư — xemtuvi.vn',
  description: MO_TA,
  alternates: { canonical: '/quyen-rieng-tu' },
  robots: { index: true, follow: true },
};

// Nội dung do phòng kiểm duyệt duyệt, nằm trong content/quyen-rieng-tu.md; đọc lúc build (trang tĩnh).
const NOI_DUNG = readFileSync(path.join(process.cwd(), 'content', 'quyen-rieng-tu.md'), 'utf8').replace(/^# .*\n/, '');

export default function TrangQuyenRiengTu() {
  return (
    <>
      <DauTrang />
      <main>
        <article className="trang-buoc bai-doc">
          <h1>Chính sách quyền riêng tư</h1>
          <Markdown md={NOI_DUNG} />
        </article>
      </main>
      <ChanTrang />
    </>
  );
}
