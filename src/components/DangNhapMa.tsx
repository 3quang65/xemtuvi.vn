'use client';

import { useState } from 'react';
import { guiSuKien } from '@/lib/phien';

interface KetQua { moi?: boolean; maKhoiPhuc?: string }

/** Đăng nhập thử bằng email + mã khôi phục. Email mới: nhận mã đúng một lần, phải bấm "Đã lưu mã" mới đi tiếp. */
export default function DangNhapMa({ idEmail, nhanEmail, thamSoDangKy, khiXong }: { idEmail: string; nhanEmail: string; thamSoDangKy?: Record<string, string>; khiXong: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [ma, setMa] = useState('');
  const [bao, setBao] = useState('');
  const [dang, setDang] = useState(false);
  const [moi, setMoi] = useState<string | null>(null);
  const [daChep, setDaChep] = useState(false);

  async function vao() {
    setBao(''); setDang(true);
    try {
      const r = await fetch('/api/dang-nhap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, maKhoiPhuc: ma || undefined }) });
      const d: KetQua & { thongDiep?: string } = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.thongDiep || 'Có lỗi, vui lòng thử lại.');
      guiSuKien('dang_nhap'); if (d.moi) guiSuKien('dang_ky_thanh_vien', thamSoDangKy);
      if (d.maKhoiPhuc) { setMoi(d.maKhoiPhuc); setDang(false); } else khiXong(email.trim().toLowerCase());
    } catch (e) { setBao((e as Error).message); setDang(false); }
  }
  async function chep() {
    try { await navigator.clipboard.writeText(moi!); setDaChep(true); } catch { setDaChep(false); setBao('Chưa sao chép được, bạn chép tay mã ở trên giúp mình nhé.'); }
  }

  if (moi) {
    return (
      <div role="status">
        <p><strong>Lưu mã này để đăng nhập ở máy khác</strong></p>
        <p className="ghi-chu-rieng-tu thu">Mã chỉ hiện một lần này. Mất mã thì không đăng nhập lại được vào lá số đã lưu.</p>
        <p><code aria-label="Mã khôi phục" style={{ fontSize: '1.5rem', letterSpacing: '0.12em', userSelect: 'all' }}>{moi}</code></p>
        <div className="hai-nut">
          <button type="button" className="nut-phu" onClick={chep}>{daChep ? 'Đã sao chép' : 'Sao chép mã'}</button>
          <button type="button" className="nut-chinh" onClick={() => khiXong(email.trim().toLowerCase())}>Tôi đã lưu mã, tiếp tục</button>
        </div>
        {bao && <p role="alert">{bao}</p>}
      </div>
    );
  }
  return (
    <>
      <label htmlFor={idEmail}>{nhanEmail}</label>
      <input id={idEmail} type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor={idEmail + '-ma'}>Mã khôi phục (nếu bạn đã có tài khoản)</label>
      <input id={idEmail + '-ma'} type="text" autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={14} value={ma} onChange={(e) => setMa(e.target.value)} />
      <p className="tt-ghi-chu">Email mới thì để trống ô mã, hệ thống sẽ cấp mã cho bạn.</p>
      <button type="button" className="nut-chinh" disabled={dang || !email} onClick={vao}>Tiếp tục</button>
      {bao && <p role="alert">{bao}</p>}
    </>
  );
}
