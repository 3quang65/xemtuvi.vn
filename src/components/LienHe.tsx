'use client';

import { useState } from 'react';
import { docNguon, guiSuKien } from '@/lib/phien';

type Loai = 'email' | 'zalo';

/** Ô tùy chọn sau khi lập lá số: để lại email hoặc số Zalo. Ô đồng ý không tích sẵn; chưa tích thì không gửi được. */
export default function LienHe() {
  const [loai, setLoai] = useState<Loai>('email');
  const [giaTri, setGiaTri] = useState('');
  const [dongY, setDongY] = useState(false);
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [duongHuy, setDuongHuy] = useState<string | null>(null);

  async function gui(e: React.FormEvent) {
    e.preventDefault();
    if (!dongY || dangGui) return;
    setDangGui(true); setLoi(null);
    try {
      const r = await fetch('/api/lien-he', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loai, giaTri, dongY: true, nguon: docNguon() }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setLoi(d.thongDiep ?? 'Chưa gửi được, vui lòng thử lại.'); return; }
      setDuongHuy(d.duongHuy);
      guiSuKien('de_lai_lien_he');
    } catch {
      setLoi('Chưa gửi được, vui lòng thử lại.');
    } finally {
      setDangGui(false);
    }
  }

  if (duongHuy) {
    return (
      <section className="lien-he" aria-labelledby="lh-tieu-de" role="status">
        <h2 id="lh-tieu-de">Đã ghi nhận</h2>
        <p>Cảm ơn bạn. Khi có tính năng gửi bản lá số và nhắc vận tháng, chúng tôi sẽ gửi tới {loai === 'email' ? 'email' : 'số Zalo'} bạn vừa để lại.</p>
        <p className="tt-ghi-chu">Đổi ý lúc nào cũng được: <a href={duongHuy}>hủy đăng ký nhận tin</a>.</p>
      </section>
    );
  }

  return (
    <section className="lien-he" aria-labelledby="lh-tieu-de">
      <h2 id="lh-tieu-de">Gửi bản lá số và nhắc vận tháng cho bạn <em>(không bắt buộc)</em></h2>
      <form onSubmit={gui} noValidate>
        <div className="chon-doi nho">
          <label><input type="radio" name="lh-loai" checked={loai === 'email'} onChange={() => { setLoai('email'); setGiaTri(''); setLoi(null); }} /> Email</label>
          <label><input type="radio" name="lh-loai" checked={loai === 'zalo'} onChange={() => { setLoai('zalo'); setGiaTri(''); setLoi(null); }} /> Zalo</label>
        </div>
        <label className="lh-o" htmlFor="lh-gia-tri">{loai === 'email' ? 'Email của bạn' : 'Số điện thoại Zalo'}</label>
        <input
          id="lh-gia-tri" value={giaTri} onChange={(e) => setGiaTri(e.target.value)} maxLength={120}
          type={loai === 'email' ? 'email' : 'tel'} inputMode={loai === 'email' ? 'email' : 'tel'}
          autoComplete={loai === 'email' ? 'email' : 'tel'} placeholder={loai === 'email' ? 'ten@example.com' : '09xx xxx xxx'}
        />
        <label className="lh-dong-y">
          <input type="checkbox" checked={dongY} onChange={(e) => setDongY(e.target.checked)} />
          <span>Tôi đồng ý nhận bản lá số và tin nhắc vận hằng tháng từ xemtuvi.vn (tối đa 2 tin mỗi tháng). Tôi có thể hủy bất cứ lúc nào.</span>
        </label>
        {loi && <p className="bao-loi" role="alert">{loi}</p>}
        <button type="submit" className="nut-phu" disabled={!dongY || !giaTri.trim() || dangGui}>Gửi cho tôi</button>
        <p className="tt-ghi-chu">Chúng tôi chỉ lưu email hoặc số bạn nhập, không lưu thông tin ngày giờ sinh. Bỏ qua ô này vẫn xem lá số bình thường.</p>
      </form>
    </section>
  );
}
