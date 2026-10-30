'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { LaSo } from '@/lib/tuvi';
import { laSoDaLuu } from '@/lib/phien';

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
