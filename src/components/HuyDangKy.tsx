'use client';

import { useState } from 'react';

export default function HuyDangKy({ ma }: { ma: string }) {
  const [tt, setTt] = useState<'cho' | 'dang' | 'xong' | 'loi'>('cho');
  async function huy() {
    setTt('dang');
    try {
      const r = await fetch('/api/lien-he/huy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ma }) });
      setTt(r.ok ? 'xong' : 'loi');
    } catch { setTt('loi'); }
  }
  if (tt === 'xong') return <p role="status">Đã hủy. Chúng tôi sẽ không gửi tin cho liên hệ này nữa.</p>;
  return (
    <>
      <p>Bạn muốn ngừng nhận bản lá số và tin nhắc vận từ xemtuvi.vn?</p>
      <button type="button" className="nut-chinh" disabled={tt === 'dang' || !ma} onClick={huy}>Hủy đăng ký nhận tin</button>
      {tt === 'loi' && <p className="bao-loi" role="alert">Liên kết hủy không đúng hoặc đã hết hiệu lực. Bạn có thể thử lại từ liên kết trong tin gần nhất.</p>}
    </>
  );
}
