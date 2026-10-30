'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { dinhDangGia, HOAN_TIEN, layChuDe, layGoi } from '@/lib/goi';
import { docThongTinSinh, guiSuKien, type NhaCungCap } from '@/lib/phien';
import { useLaSoDaLuu } from '@/lib/useLaSoDaLuu';

async function goiApi<T>(duong: string, body?: unknown): Promise<T> {
  const r = await fetch(duong, body === undefined ? { cache: 'no-store' } : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((d as { thongDiep?: string }).thongDiep || 'Có lỗi, vui lòng thử lại.');
  return d as T;
}

export default function ThanhToan() {
  const router = useRouter();
  const tham = useSearchParams();
  const goi = layGoi(tham.get('goi'));
  const chuDe = layChuDe(tham.get('chuDe'));
  const hopLe = !!goi && (goi.ma !== 'mot-chu-de' || !!chuDe); // gói chủ đề bắt buộc có chủ đề
  const suKien = { goi: goi?.ma, chuDe: goi?.ma === 'mot-chu-de' ? chuDe?.ma : undefined };
  const laSo = useLaSoDaLuu();
  const [email, setEmail] = useState<string | null>(null); // tài khoản đang đăng nhập (từ máy chủ)
  const [nhap, setNhap] = useState('');
  const [bao, setBao] = useState('');
  const [dangXuLy, setDangXuLy] = useState(false);

  useEffect(() => { if (laSo && !hopLe) router.replace('/chon-goi'); }, [laSo, hopLe, router]);
  useEffect(() => { if (laSo && hopLe) { guiSuKien('vao_thanh_toan', suKien); goiApi<{ dangNhap: boolean; email?: string }>('/api/toi').then((t) => setEmail(t.dangNhap ? t.email ?? null : null)).catch(() => {}); } }, [laSo, hopLe]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!laSo || !hopLe || !goi) return <p className="dang-tai" role="status">Đang tải…</p>;

  async function dangNhap(ncc: NhaCungCap) {
    setBao(''); setDangXuLy(true);
    try {
      await goiApi('/api/dang-nhap', { nhaCungCap: ncc, email: nhap });
      setEmail(nhap.trim().toLowerCase()); guiSuKien('dang_nhap');
    } catch (e) { setBao((e as Error).message); } finally { setDangXuLy(false); }
  }
  async function thanhToan() {
    setBao(''); setDangXuLy(true);
    try {
      const sinh = docThongTinSinh();
      const { id: laSoId } = await goiApi<{ id: number }>('/api/la-so', { thongTinSinh: sinh });
      const don = await goiApi<{ id: number }>('/api/don-hang', { maGoi: goi!.ma, chuDe: suKien.chuDe, laSoId });
      await goiApi('/api/thanh-toan/gia-lap', { donHangId: don.id });
      guiSuKien('thanh_toan_xong', suKien); router.push('/luan-giai');
    } catch (e) { setBao((e as Error).message); setDangXuLy(false); }
  }

  return (
    <section className="trang-buoc">
      <h1>Thanh toán</h1>
      <p className="ghi-chu-rieng-tu thu">Bản thử: đăng nhập và thanh toán đều là giả lập, không thu tiền, không gửi thông tin đến Google hay Zalo.</p>

      <div className="khoi-buoc">
        <h2>1. Tài khoản</h2>
        {email ? (
          <p className="da-dang-nhap">Đã đăng nhập thử bằng {email} (bản thử).</p>
        ) : (
          <>
            <label htmlFor="email-thu">Email của bạn (để xem lại gói trên máy khác)</label>
            <input id="email-thu" type="email" inputMode="email" autoComplete="email" value={nhap} onChange={(e) => setNhap(e.target.value)} />
            <div className="hai-nut">
              <button type="button" className="nut-phu" disabled={dangXuLy || !nhap} onClick={() => dangNhap('google')}>Tiếp tục với Google</button>
              <button type="button" className="nut-phu" disabled={dangXuLy || !nhap} onClick={() => dangNhap('zalo')}>Tiếp tục với Zalo</button>
            </div>
          </>
        )}
      </div>

      <div className="khoi-buoc">
        <h2>2. Đơn hàng</h2>
        <dl className="tt-dong don">
          <div><dt>Gói</dt><dd>{goi.ten}</dd></div>
          {chuDe && goi.ma === 'mot-chu-de' && <div><dt>Chủ đề</dt><dd>{chuDe.ten}</dd></div>}
          <div><dt>Thời hạn</dt><dd>{goi.donVi}</dd></div>
          <div><dt>Tổng</dt><dd><strong>{dinhDangGia(goi.gia)}</strong></dd></div>
        </dl>
        <button type="button" className="nut-chinh" disabled={!email || dangXuLy} onClick={thanhToan}>Thanh toán (giả lập)</button>
        {bao && <p className="bao-loi-nhap" role="alert">{bao}</p>}
        {!email && <p className="tt-ghi-chu">Chọn tài khoản ở trên để thanh toán.</p>}
        <p className="ghi-chu-rieng-tu">Khi thanh toán, thông tin sinh của lá số này được lưu (mã hóa) trên máy chủ để bạn xem lại ở máy khác. Trước đó, thông tin chỉ nằm trên trình duyệt của bạn.</p>
        <p className="cam-ket">{HOAN_TIEN}</p>
      </div>
    </section>
  );
}
