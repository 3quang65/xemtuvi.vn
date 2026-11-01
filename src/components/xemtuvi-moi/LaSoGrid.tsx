'use client';
import { useState } from 'react';
import type { LaSoView } from '@/lib/xemtuvi-moi/view';
import { CungO } from './CungO';

/** Lưới 12 cung + thiên bàn giữa. Chọn một cung → gọi onChon (để bảng chi tiết/luận giải hiển thị bên cạnh). */
export function LaSoGrid({ laSo, onChon }: { laSo: LaSoView; onChon?: (chi: number | null) => void }) {
  const [chon, setChon] = useState<number | null>(null);
  const doi = (chi: number) => { const moi = chon === chi ? null : chi; setChon(moi); onChon?.(moi); };
  return (
    <div className="xtv xtv-laso" role="group" aria-label={`Lá số ${laSo.ten}`}>
      {laSo.cung.map((c) => <CungO key={c.chi} cung={c} chon={chon === c.chi} onChon={doi} />)}
      <div className="xtv-trung-tam">
        <h2 style={{ margin: 0, fontFamily: 'var(--xtv-f-tieu-de)', fontSize: '1.1rem' }}>{laSo.ten || 'Lá số'}</h2>
        <dl>
          <dt>Giới tính</dt><dd>{laSo.gioiTinh}</dd>
          <dt>Bản mệnh</dt><dd>{laSo.banMenh}</dd>
          <dt>Cục</dt><dd>{laSo.cuc}</dd>
          <dt>Can chi</dt><dd>{laSo.canChi}</dd>
        </dl>
      </div>
    </div>
  );
}
