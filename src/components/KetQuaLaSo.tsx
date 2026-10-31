'use client';

import type { LaSo, QuyUoc } from '@/lib/tuvi';
import { namAmHienTai } from '@/lib/tuvi';
import LaSoBan from './LaSoBan';
import TomTatMienPhi from './TomTatMienPhi';
import LienHe from './LienHe';

/** Khối sau khi lập lá số. Tách riêng để nạp trễ (cần engine, luận giải mẫu, bảng lá số). */
export default function KetQuaLaSo({ laSo, onDoiQuyUoc, coMienNam, onDoiMienNam }: {
  laSo: LaSo; onDoiQuyUoc: (p: Partial<QuyUoc>) => void; coMienNam: boolean; onDoiMienNam: (b: boolean) => void;
}) {
  return (
    <>
      <LaSoBan key={JSON.stringify(laSo.duong) + laSo.gio.dongHo + laSo.gioChuan.gio + laSo.gioiTinh} laSo={laSo} namHienTai={namAmHienTai()} onDoiQuyUoc={onDoiQuyUoc} coMienNam={coMienNam} onDoiMienNam={onDoiMienNam} />
      <TomTatMienPhi laSo={laSo} />
      <LienHe />
    </>
  );
}
