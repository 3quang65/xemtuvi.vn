'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { layChuDe, layGoi } from '@/lib/goi';
import { guiSuKien } from '@/lib/phien';
import { useLaSoDaLuu } from '@/lib/useLaSoDaLuu';
import TomTatMienPhi from './TomTatMienPhi';

export default function LuanGiai() {
  const laSo = useLaSoDaLuu();
  const [goi, setGoi] = useState<ReturnType<typeof layGoi> | null | undefined>(undefined);
  const [chuDe, setChuDe] = useState<ReturnType<typeof layChuDe>>(undefined);
  const [daBao, setDaBao] = useState(false);
  useEffect(() => {
    // Quyền xem lấy từ máy chủ (đăng nhập ở máy nào cũng thấy).
    fetch('/api/toi', { cache: 'no-store' }).then((r) => r.json()).then((t: { quyen?: { loai: string; chuDe: string | null }[] }) => {
      const moi = (t.quyen ?? []).at(-1); // quyền mua gần nhất
      const ma = moi?.loai === 'thanh_vien' ? 'thanh-vien-nam' : moi?.loai === 'tron_la_so' ? 'tron-la-so' : moi?.loai === 'chu_de' ? 'mot-chu-de' : null;
      setGoi(layGoi(ma) ?? null);
      setChuDe(moi?.loai === 'chu_de' ? layChuDe(moi.chuDe) : undefined);
    }).catch(() => setGoi(null));
  }, []);
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
      <p className="da-dang-nhap">Đã mở: {goi.ten}{chuDe ? ` — ${chuDe.ten}` : ''} (bản thử, chưa thu tiền thật).</p>
      <p className="khoi-buoc">Nội dung luận giải chuyên sâu đang chuẩn bị. Khi hoàn tất, bạn sẽ đọc được ngay tại trang này.</p>
      <TomTatMienPhi laSo={laSo} choMua={false} />
      <div className="bao-loi">
        {daBao ? (
          <p role="status">Đã ghi nhận. Bản thử chưa thu tiền nên chưa có bước hoàn tiền; khi bán chính thức, lỗi kỹ thuật sẽ được hoàn 100%.</p>
        ) : (
          <button type="button" className="nut-phu" onClick={() => { guiSuKien('bao_loi', { goi: goi.ma }); setDaBao(true); }}>
            Không xem được đủ phần đã mua? Báo lỗi
          </button>
        )}
      </div>
    </section>
  );
}
