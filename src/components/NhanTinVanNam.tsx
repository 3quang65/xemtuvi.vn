'use client';

import { useState } from 'react';
import { docNguon, ghiNguon, maPhien } from '@/lib/phien';
import { useEffect } from 'react';

/** Ô nhận tin Vận 2027. Ô đồng ý KHÔNG tích sẵn; chưa tích thì không gửi được. Câu chữ theo kinh-doanh/chuoi-email_v1.md mục 4 (phiên bản 'van-nam-2027-v1'). */
export default function NhanTinVanNam() {
  const [email, setEmail] = useState('');
  const [dongY, setDongY] = useState(false);
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [duongHuy, setDuongHuy] = useState<string | null>(null);
  useEffect(() => { ghiNguon(); }, []);

  async function gui(e: React.FormEvent) {
    e.preventDefault();
    if (!dongY || dangGui) return;
    setDangGui(true); setLoi(null);
    try {
      const r = await fetch('/api/nhan-tin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, dongY: true, nguon: docNguon(), phien: maPhien() }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setLoi(d.thongDiep ?? 'Chưa gửi được, vui lòng thử lại.'); return; }
      setDuongHuy(d.duongHuy);
    } catch {
      setLoi('Chưa gửi được, vui lòng thử lại.');
    } finally {
      setDangGui(false);
    }
  }

  if (duongHuy) {
    return (
      <section className="lien-he" aria-labelledby="nt-tieu-de" role="status">
        <h2 id="nt-tieu-de">Mình đã ghi nhận</h2>
        <p>Bạn sẽ nhận tin về Vận năm 2027 tại {email.trim().toLowerCase()}. Nếu muốn dừng, bấm “Hủy nhận tin” ở cuối mỗi email.</p>
        <p className="tt-ghi-chu">Đổi ý lúc nào cũng được: <a href={duongHuy}>hủy nhận tin</a>.</p>
      </section>
    );
  }

  return (
    <section className="lien-he" aria-labelledby="nt-tieu-de">
      <h2 id="nt-tieu-de">Nhận tin Vận năm 2027 <em>(không bắt buộc)</em></h2>
      <form onSubmit={gui} noValidate>
        <label className="lh-o" htmlFor="nt-email">Email của bạn</label>
        <input id="nt-email" type="email" inputMode="email" autoComplete="email" maxLength={120} placeholder="ten@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="lh-dong-y">
          <input type="checkbox" checked={dongY} onChange={(e) => setDongY(e.target.checked)} />
          <span>Tôi đồng ý nhận email về Vận năm 2027 và gợi ý chủ đề từ xemtuvi.vn. Tôi có thể hủy bất cứ lúc nào qua liên kết hủy trong mỗi email.</span>
        </label>
        {loi && <p className="bao-loi" role="alert">{loi}</p>}
        <button type="submit" className="nut-chinh" disabled={!dongY || !email.trim() || dangGui}>Nhận tin Vận 2027</button>
        <p className="tt-ghi-chu">Vài email trong thời gian đầu, sau đó khoảng một email mỗi tháng. Nội dung do AI tạo, mang tính tham khảo. Chúng tôi chỉ dùng email để gửi đúng nội dung này, không bán, không chia sẻ. Không đăng ký vẫn đọc bình thường.</p>
      </form>
    </section>
  );
}
