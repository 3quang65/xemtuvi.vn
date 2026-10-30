'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { guiSuKien, luuYDinh } from '@/lib/phien';

/** Nút trên trang đích: nhớ ý định "vận năm" rồi sang trang lập lá số; gửi sự kiện đo phễu. */
export default function LpVanNamNut({ nhan }: { nhan: string }) {
  const router = useRouter();
  useEffect(() => { guiSuKien('xem_lp_van_nam'); }, []);
  return (
    <button type="button" className="nut-chinh" onClick={() => { guiSuKien('bam_lap_la_so_lp'); luuYDinh('van-nam-2027'); router.push('/'); }}>
      {nhan}
    </button>
  );
}
