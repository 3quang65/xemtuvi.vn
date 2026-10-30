'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Buoc = 'tai' | 'chua-dang-nhap' | 'loi' | 'xem' | 'hoi' | 'dang-xoa' | 'xong';

/** Trang /toi: xem tài khoản và xóa tài khoản kèm dữ liệu (xác nhận hai lần). */
export default function TaiKhoanToi() {
  const [buoc, setBuoc] = useState<Buoc>('tai');
  const [email, setEmail] = useState('');
  const [loi, setLoi] = useState<string | null>(null);

  useEffect(() => {
    let huy = false;
    fetch('/api/toi', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: { dangNhap?: boolean; email?: string }) => { if (!huy) { setEmail(d.email ?? ''); setBuoc(d.dangNhap ? 'xem' : 'chua-dang-nhap'); } })
      .catch(() => { if (!huy) setBuoc('loi'); });
    return () => { huy = true; };
  }, []);

  async function xoa() {
    setBuoc('dang-xoa'); setLoi(null);
    try {
      const r = await fetch('/api/toi/xoa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ xacNhan: true }) });
      if (!r.ok) throw new Error();
      setBuoc('xong');
    } catch {
      setLoi('Chưa xóa được, vui lòng thử lại.'); setBuoc('hoi');
    }
  }

  if (buoc === 'tai') return <p className="dang-tai" role="status">Đang tải…</p>;
  if (buoc === 'loi') return <section className="lien-he"><h1>Tài khoản của tôi</h1><p role="alert">Chưa tải được. Bạn thử lại sau ít phút nhé.</p></section>;
  if (buoc === 'chua-dang-nhap') return <section className="lien-he"><h1>Tài khoản của tôi</h1><p>Bạn chưa đăng nhập. <Link href="/luan-giai">Đăng nhập</Link></p></section>;
  if (buoc === 'xong') return <section className="lien-he" role="status"><h1>Đã xóa tài khoản</h1><p>Lá số, luận giải và lựa chọn nhận tin của bạn đã được xóa. <Link href="/">Về trang chủ</Link></p></section>;

  return (
    <section className="lien-he" aria-labelledby="toi-tieu-de">
      <h1 id="toi-tieu-de">Tài khoản của tôi</h1>
      <p>Đang đăng nhập: <strong>{email}</strong></p>
      <p><Link href="/luan-giai">Xem lá số và luận giải của tôi</Link></p>
      <h2>Xóa tài khoản và dữ liệu</h2>
      {buoc === 'xem' ? (
        <>
          <p>Xóa toàn bộ lá số, luận giải và lựa chọn nhận tin của bạn. Lịch sử đơn hàng được giữ lại nhưng không còn gắn với bạn.</p>
          <button type="button" className="nut-phu" onClick={() => setBuoc('hoi')}>Xóa tài khoản và dữ liệu</button>
        </>
      ) : (
        <div role="alertdialog" aria-labelledby="toi-hoi" className="toi-xac-nhan">
          <p id="toi-hoi"><strong>Bạn chắc chắn muốn xóa?</strong> Việc này không hoàn tác được và các luận giải đã mua sẽ không xem lại được.</p>
          {loi && <p className="bao-loi" role="alert">{loi}</p>}
          <div className="hai-nut">
            <button type="button" className="nut-phu" disabled={buoc === 'dang-xoa'} onClick={() => setBuoc('xem')}>Giữ lại tài khoản</button>
            <button type="button" className="nut-chinh" disabled={buoc === 'dang-xoa'} onClick={xoa}>Xóa vĩnh viễn</button>
          </div>
        </div>
      )}
    </section>
  );
}
