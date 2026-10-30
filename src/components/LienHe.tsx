'use client';

import { useState } from 'react';
import { docNguon, guiSuKien } from '@/lib/phien';

type Loai = 'email' | 'zalo';
type Dong = { tich: boolean; giaTri: string };
const RONG: Dong = { tich: false, giaTri: '' };

/** Khối đồng ý sau khi lập lá số: hai ô tích riêng (email, Zalo), không tích sẵn, không bắt buộc. Câu chữ: kinh-doanh/chuoi-email_v1.md mục 4.1. */
export default function LienHe() {
  const [o, setO] = useState<Record<Loai, Dong>>({ email: RONG, zalo: RONG });
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [xong, setXong] = useState<{ loai: Loai; duongHuy: string }[] | null>(null);

  const dat = (l: Loai, v: Partial<Dong>) => { setLoi(null); setO((c) => ({ ...c, [l]: { ...c[l], ...v } })); };
  const dsChon = (['email', 'zalo'] as Loai[]).filter((l) => o[l].tich);
  const duDieuKien = dsChon.length > 0 && dsChon.every((l) => o[l].giaTri.trim());

  async function gui(e: React.FormEvent) {
    e.preventDefault();
    if (!duDieuKien || dangGui) return;
    setDangGui(true); setLoi(null);
    const ra: { loai: Loai; duongHuy: string }[] = [];
    try {
      for (const l of dsChon) {
        const r = await fetch('/api/lien-he', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ loai: l, giaTri: o[l].giaTri, dongY: true, nguon: docNguon() }),
        });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) { setLoi(d.thongDiep ?? 'Chưa gửi được, vui lòng thử lại.'); return; }
        ra.push({ loai: l, duongHuy: d.duongHuy });
      }
      setXong(ra);
      guiSuKien('de_lai_lien_he');
    } catch {
      setLoi('Chưa gửi được, vui lòng thử lại.');
    } finally {
      setDangGui(false);
    }
  }

  if (xong) {
    return (
      <section className="lien-he" aria-labelledby="lh-tieu-de" role="status">
        <h2 id="lh-tieu-de">Đã ghi nhận</h2>
        <p>Mình đã ghi nhận lựa chọn của bạn. Khi có bản lá số, mình sẽ gửi qua {xong.map((x) => (x.loai === 'email' ? 'email' : 'Zalo')).join(' và ')} bạn vừa để lại.</p>
        <p className="tt-ghi-chu">Đổi ý lúc nào cũng được: {xong.map((x, i) => <span key={x.loai}>{i > 0 && ' · '}<a href={x.duongHuy}>hủy nhận tin qua {x.loai === 'email' ? 'email' : 'Zalo'}</a></span>)}.</p>
      </section>
    );
  }

  return (
    <section className="lien-he" aria-labelledby="lh-tieu-de">
      <h2 id="lh-tieu-de">Nhận lá số và gợi ý/ưu đãi <em>(không bắt buộc)</em></h2>
      <form onSubmit={gui} noValidate>
        <div className="lh-khoi">
          <label className="lh-dong-y">
            <input type="checkbox" name="dong-y-email" checked={o.email.tich} onChange={(e) => dat('email', { tich: e.target.checked })} />
            <span>Gửi bản lá số và gợi ý chủ đề/ưu đãi cho mình qua <strong>email</strong></span>
          </label>
          {o.email.tich && (
            <input aria-label="Email của bạn" value={o.email.giaTri} onChange={(e) => dat('email', { giaTri: e.target.value })} maxLength={120}
              type="email" inputMode="email" autoComplete="email" placeholder="ten@example.com" />
          )}
        </div>
        <div className="lh-khoi">
          <label className="lh-dong-y">
            <input type="checkbox" name="dong-y-zalo" checked={o.zalo.tich} onChange={(e) => dat('zalo', { tich: e.target.checked })} />
            <span>Gửi lá số và gợi ý chủ đề/ưu đãi qua <strong>Zalo</strong> (số điện thoại)</span>
          </label>
          {o.zalo.tich && (
            <input aria-label="Số điện thoại Zalo" value={o.zalo.giaTri} onChange={(e) => dat('zalo', { giaTri: e.target.value })} maxLength={20}
              type="tel" inputMode="tel" autoComplete="tel" placeholder="09xx xxx xxx" />
          )}
        </div>
        {loi && <p className="bao-loi" role="alert">{loi}</p>}
        <button type="submit" className="nut-phu" disabled={!duDieuKien || dangGui}>Gửi cho tôi</button>
        <p className="tt-ghi-chu">Vài email trong tuần đầu, sau đó khoảng 1 email mỗi tháng, thỉnh thoảng có gợi ý chủ đề hoặc ưu đãi từ xemtuvi.vn. Nội dung do AI tạo, mang tính tham khảo. Bạn không tích cũng vẫn xem lá số bình thường. Bạn hủy bất cứ lúc nào qua liên kết hủy trong mỗi email, hoặc nhắn &quot;HỦY&quot; qua Zalo; mình xử lý trong 24 giờ. Mình chỉ lưu email hoặc số bạn nhập, không lưu ngày giờ sinh, không bán và không chia sẻ cho bên khác.</p>
      </form>
    </section>
  );
}
