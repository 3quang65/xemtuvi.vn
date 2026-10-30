'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import type { LaSo } from '@/lib/tuvi';
import { tomTatMienPhi } from '@/lib/luan-giai';
import { guiSuKien } from '@/lib/phien';

/** Tóm tắt miễn phí: nạp âm + cục, chính tinh thủ Mệnh, Thân cư, 1–2 đoạn luận lấy nguyên văn từ bộ quy tắc. */
export default function TomTatMienPhi({ laSo, choMua = true }: { laSo: LaSo; choMua?: boolean }) {
  const t = useMemo(() => tomTatMienPhi(laSo), [laSo]);
  useEffect(() => { if (choMua) guiSuKien('xem_tom_tat'); }, [choMua]);

  return (
    <section className="tom-tat" aria-labelledby="tt-tieu-de">
      <h2 id="tt-tieu-de">Tóm tắt lá số của bạn</h2>
      <dl className="tt-dong">
        <div><dt>Bản mệnh</dt><dd>{t.banMenh}</dd></div>
        <div><dt>Cục</dt><dd>{t.cuc}</dd></div>
        <div>
          <dt>Chính tinh thủ Mệnh</dt>
          <dd>
            {t.voChinhDieu
              ? <>Vô chính diệu{t.chinhTinhXungChieu.length > 0 && <> · mượn {t.chinhTinhXungChieu.join(', ')} ở cung đối</>}</>
              : t.chinhTinhMenh.map((s) => (s.dacTinhTen ? `${s.ten} (${s.dacTinhTen})` : s.ten)).join(' · ')}
          </dd>
        </div>
        <div><dt>Thân cư</dt><dd>cung {t.thanCu}</dd></div>
      </dl>

      {t.doan.length > 0 ? (
        t.doan.map((d) => (
          <blockquote key={d.ma} className="tt-doan">
            <p>{d.cau}</p>
            <footer>Quy tắc {d.ma}{d.nguon.length > 0 && <> · Nguồn: {d.nguon.join(', ')}</>}</footer>
          </blockquote>
        ))
      ) : (
        <p className="tt-ghi-chu">Phần luận chi tiết cho chính tinh và độ sáng này nằm trong bản luận giải chuyên sâu.</p>
      )}
      <p className="tt-ghi-chu">Đoạn trên do hệ thống chọn từ bộ quy tắc luận giải theo sao và độ sáng, chưa xét các sao khác trong lá số.</p>

      {choMua && (
        <Link href="/chon-goi" className="nut-chinh nut-lien-ket" onClick={() => guiSuKien('bam_xem_sau')}>
          Xem luận giải chuyên sâu
        </Link>
      )}
    </section>
  );
}
