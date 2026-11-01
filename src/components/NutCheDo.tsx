'use client';
import { useEffect, useState } from 'react';

/** Khóa localStorage lưu lựa chọn: 'dark' | 'light'. Chưa chọn thì theo hệ thống (script trong layout.tsx). */
export const KHOA = 'xtv-che-do';

export default function NutCheDo() {
  const [toi, setToi] = useState(false);
  useEffect(() => { setToi(document.documentElement.dataset.theme === 'dark'); }, []);

  function chuyen() {
    const moi = toi ? 'light' : 'dark';
    document.documentElement.dataset.theme = moi;
    try { localStorage.setItem(KHOA, moi); } catch { /* chế độ riêng tư: vẫn đổi được trong phiên */ }
    setToi(!toi);
  }

  return (
    <button type="button" className="nut-che-do" onClick={chuyen} aria-pressed={toi} aria-label="Chế độ tối">
      <span aria-hidden="true">{toi ? '☀' : '☾'}</span> {toi ? 'Sáng' : 'Tối'}
    </button>
  );
}
