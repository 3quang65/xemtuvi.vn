'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DIEU_KIEN_XEM_LAI } from '@/lib/goi';

type Buoc = 'tai' | 'chua-dang-nhap' | 'loi' | 'xem' | 'hoi' | 'dang-xoa' | 'xong';

/** Trang /toi: xem tài khoản và xóa dữ liệu của tôi (gõ XOA để xác nhận). */
export default function TaiKhoanToi() {
  const [buoc, setBuoc] = useState<Buoc>('tai');
  const [email, setEmail] = useState('');
  const [loi, setLoi] = useState<string | null>(null);
  const [go, setGo] = useState('');

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
      const r = await fetch('/api/toi/xoa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ xacNhan: go.trim() }) });
      if (!r.ok) throw new Error();
      setBuoc('xong');
    } catch {
      setLoi('Chưa xóa được, vui lòng thử lại.'); setBuoc('hoi');
    }
  }

  if (buoc === 'tai') return <p className="dang-tai" role="status">Đang tải…</p>;
  if (buoc === 'loi') return <section className="lien-he"><h1>Tài khoản của tôi</h1><p role="alert">Chưa tải được. Bạn thử lại sau ít phút nhé.</p></section>;
  if (buoc === 'chua-dang-nhap') return <section className="lien-he"><h1>Tài khoản của tôi</h1><p>Bạn chưa đăng nhập. <Link href="/luan-giai">Đăng nhập</Link></p></section>;
  if (buoc === 'xong') return <section className="lien-he" role="status"><h1>Đã xóa dữ liệu của bạn</h1><p>Lá số, luận giải và lựa chọn nhận tin của bạn đã được xóa. <Link href="/">Về trang chủ</Link></p></section>;

  return (
    <section className="lien-he" aria-labelledby="toi-tieu-de">
      <h1 id="toi-tieu-de">Tài khoản của tôi</h1>
      <p>Đang đăng nhập: <strong>{email}</strong></p>
      <p><Link href="/luan-giai">Xem lá số và luận giải của tôi</Link></p>
      <h2>Xóa dữ liệu của tôi</h2>
      {buoc === 'xem' ? (
        <>
          <p>Xóa toàn bộ lá số, luận giải và lựa chọn nhận tin của bạn. Lịch sử đơn hàng được giữ lại nhưng không còn gắn với bạn.</p>
          <button type="button" className="nut-phu" onClick={() => setBuoc('hoi')}>Xóa dữ liệu của tôi</button>
        </>
      ) : (
        <div role="alertdialog" aria-labelledby="toi-hoi" className="toi-xac-nhan">
          <p id="toi-hoi"><strong>Bạn chắc chắn muốn xóa?</strong> Việc này không hoàn tác được và các luận giải đã mua sẽ không xem lại được. Bản sao lưu của hệ thống cũng tự xóa sau tối đa 30 ngày.</p>
          <p className="tt-ghi-chu">{DIEU_KIEN_XEM_LAI}</p>
          <label htmlFor="toi-go">Gõ XOA để xác nhận</label>
          <input id="toi-go" type="text" autoComplete="off" autoCapitalize="characters" spellCheck={false} value={go} onChange={(e) => setGo(e.target.value)} />
          {loi && <p className="bao-loi" role="alert">{loi}</p>}
          <div className="hai-nut">
            <button type="button" className="nut-phu" disabled={buoc === 'dang-xoa'} onClick={() => { setGo(''); setBuoc('xem'); }}>Giữ lại tài khoản</button>
            <button type="button" className="nut-chinh" disabled={buoc === 'dang-xoa' || go.trim().toUpperCase() !== 'XOA'} onClick={xoa}>Xóa vĩnh viễn</button>
          </div>
        </div>
      )}
    </section>
  );
}
