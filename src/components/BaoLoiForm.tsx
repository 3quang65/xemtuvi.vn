'use client';

import { useEffect, useState } from 'react';
import { docThamSoBaoLoi, tomTatThietBi } from '@/lib/tro-giup';

const GIOI_HAN = { moTa: 1000, maDon: 40, goi: 40, thietBi: 120 };
const gioHienTai = () => { const d = new Date(), p = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; };

/** Biểu mẫu báo lỗi / góp ý. Cố ý KHÔNG có ô ngày giờ sinh. Từ E04/E05/E07/E08 vào thì mã đơn, gói, tình huống được điền sẵn qua địa chỉ. */
export default function BaoLoiForm() {
  const [moTa, setMoTa] = useState('');
  const [maDon, setMaDon] = useState('');
  const [goi, setGoi] = useState('');
  const [thietBi, setThietBi] = useState('');
  const [gioKhach, setGio] = useState('');
  const [tinhHuong, setTinhHuong] = useState('');
  const [bao, setBao] = useState<{ ok: boolean; chu: string } | null>(null);
  const [dang, setDang] = useState(false);

  useEffect(() => {
    const t = docThamSoBaoLoi(window.location.search);
    setMaDon(t.maDon); setGoi(t.goi); setTinhHuong(t.tinhHuong);
    setThietBi(tomTatThietBi(navigator.userAgent)); setGio(gioHienTai());
  }, []);

  async function gui(e: React.FormEvent) {
    e.preventDefault();
    if (dang) return;
    setBao(null); setDang(true);
    try {
      const r = await fetch('/api/bao-loi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ moTa, maDon, goi, thietBi, gioKhach, tinhHuong }) });
      const d = await r.json().catch(() => ({}));
      if (r.ok) { setBao({ ok: true, chu: 'Mình đã ghi nhận và chuyển đội xử lý. Cảm ơn bạn.' }); setMoTa(''); }
      else setBao({ ok: false, chu: (d as { thongDiep?: string }).thongDiep || 'Chưa gửi được. Bạn thử lại sau ít phút giúp mình nhé.' });
    } catch { setBao({ ok: false, chu: 'Chưa gửi được. Bạn thử lại sau ít phút giúp mình nhé.' }); }
    finally { setDang(false); }
  }

  return (
    <form className="phieu bao-loi-form" onSubmit={gui} aria-labelledby="bao-loi-tieu-de">
      <p className="ghi-chu-rieng-tu">Bạn có thể đính kèm ảnh chụp màn hình khi mình liên hệ lại; nhớ che thông tin cá nhân. Mình không cần ngày giờ sinh của bạn để hỗ trợ, nên xin đừng ghi vào đây.</p>
      <label className="o">
        <span>Điều đã xảy ra</span>
        <textarea required minLength={10} maxLength={GIOI_HAN.moTa} rows={5} value={moTa} onChange={(e) => setMoTa(e.target.value)} aria-describedby="bao-loi-dem" />
        <small id="bao-loi-dem" className="tt-ghi-chu">{moTa.length}/{GIOI_HAN.moTa}</small>
      </label>
      <label className="o"><span>Mã đơn <em>(nếu có)</em></span><input maxLength={GIOI_HAN.maDon} value={maDon} onChange={(e) => setMaDon(e.target.value)} autoComplete="off" /></label>
      <label className="o"><span>Gói <em>(nếu có)</em></span><input maxLength={GIOI_HAN.goi} value={goi} onChange={(e) => setGoi(e.target.value)} autoComplete="off" /></label>
      <label className="o"><span>Thiết bị và trình duyệt</span><input maxLength={GIOI_HAN.thietBi} value={thietBi} onChange={(e) => setThietBi(e.target.value)} autoComplete="off" /></label>
      <label className="o"><span>Giờ xảy ra</span><input maxLength={40} value={gioKhach} onChange={(e) => setGio(e.target.value)} autoComplete="off" /></label>
      {bao && <p className={bao.ok ? 'bao-loi-ok' : 'bao-loi'} role={bao.ok ? 'status' : 'alert'}>{bao.chu}</p>}
      <button type="submit" className="nut-chinh" disabled={dang}>{dang ? 'Đang gửi…' : 'Gửi báo lỗi / góp ý'}</button>
    </form>
  );
}
