'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { luuMaMoi, maPhien } from '@/lib/phien';

const LY: Record<string, string> = {
  sai: 'Mã mời này chưa đúng. Bạn kiểm tra lại giúp mình nhé.',
  het_han: 'Mã mời này đã hết hạn.',
  het_luot: 'Mã mời này đã được dùng hết lượt.',
};

/** Trang /moi/<ma>: mã hợp lệ → ghi nhận lượt vào (nguồn do máy chủ tra từ mã), nhớ mã, đưa về form lập lá số. */
export default function MoiVao({ ma }: { ma: string }) {
  const router = useRouter();
  const [ly, setLy] = useState<string | null>(null);
  useEffect(() => {
    let huy = false;
    fetch('/api/ma-moi/vao', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ma, phien: maPhien() }) })
      .then((r) => r.json())
      .then((d: { hopLe?: boolean; ly?: string }) => {
        if (huy) return;
        if (d.hopLe) { luuMaMoi(ma.toUpperCase()); router.replace('/'); } else setLy(d.ly ?? 'sai');
      })
      .catch(() => { if (!huy) setLy('loi'); });
    return () => { huy = true; };
  }, [ma, router]);
  if (!ly) return <p className="dang-tai" role="status">Đang mở lời mời…</p>;
  return (
    <section className="trang-buoc">
      <h1>Lời mời dùng thử</h1>
      <p role="status">{LY[ly] ?? 'Chưa kiểm tra được mã lúc này. Bạn thử lại sau ít phút nhé.'}</p>
      <p className="tt-ghi-chu">Bạn vẫn lập lá số miễn phí bình thường.</p>
      <Link href="/" className="nut-chinh nut-lien-ket">Lập lá số miễn phí</Link>
    </section>
  );
}
