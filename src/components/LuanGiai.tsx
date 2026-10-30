'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { layGoi } from '@/lib/goi';
import { docGoiDaMo } from '@/lib/phien';
import { useLaSoDaLuu } from '@/lib/useLaSoDaLuu';
import TomTatMienPhi from './TomTatMienPhi';

export default function LuanGiai() {
  const laSo = useLaSoDaLuu();
  const [goi, setGoi] = useState<ReturnType<typeof layGoi> | null | undefined>(undefined);
  useEffect(() => { setGoi(layGoi(docGoiDaMo()?.ma) ?? null); }, []);
  if (!laSo || goi === undefined) return <p className="dang-tai" role="status">Đang tải…</p>;

  if (!goi) {
    return (
      <section className="trang-buoc">
        <h1>Luận giải chuyên sâu</h1>
        <p>Bạn chưa mở gói nào.</p>
        <Link href="/chon-goi" className="nut-chinh nut-lien-ket">Chọn gói luận giải</Link>
      </section>
    );
  }
  return (
    <section className="trang-buoc">
      <h1>Luận giải chuyên sâu</h1>
      <p className="da-dang-nhap">Đã mở: {goi.ten} (bản thử, chưa thu tiền thật).</p>
      <p className="khoi-buoc">Nội dung luận giải chuyên sâu đang chuẩn bị. Khi hoàn tất, bạn sẽ đọc được ngay tại trang này.</p>
      <TomTatMienPhi laSo={laSo} choMua={false} />
    </section>
  );
}
