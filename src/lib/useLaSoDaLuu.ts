'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { lapLaSo, type LaSo } from '@/lib/tuvi';
import { docThongTinSinh } from '@/lib/phien';

/** Lập lại lá số từ thông tin đã lưu; null nếu chưa có hoặc không lập được. Đặt ở đây (không ở phien.ts) để engine không vào gói JS của layout. */
function laSoDaLuu(): LaSo | null {
  const t = docThongTinSinh();
  if (!t) return null;
  try { return lapLaSo(t); } catch { return null; }
}

/** Lá số lập lại từ sessionStorage. Chưa có thì dẫn về trang chủ để lập lá số. */
export function useLaSoDaLuu(batBuoc = true): LaSo | null {
  const router = useRouter();
  const [laSo, setLaSo] = useState<LaSo | null>(null);
  useEffect(() => {
    const ls = laSoDaLuu();
    if (ls) setLaSo(ls);
    else if (batBuoc) router.replace('/');
  }, [router, batBuoc]);
  return laSo;
}
