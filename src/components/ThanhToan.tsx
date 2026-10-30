'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { dinhDangGia, HOAN_TIEN, layChuDe, layGoi } from '@/lib/goi';
import { docTaiKhoanThu, guiSuKien, luuGoiDaMo, taoTaiKhoanThu, type NhaCungCap, type TaiKhoanThu } from '@/lib/phien';
import { useLaSoDaLuu } from '@/lib/useLaSoDaLuu';

const TEN_NCC: Record<NhaCungCap, string> = { google: 'Google', zalo: 'Zalo' };

export default function ThanhToan() {
  const router = useRouter();
  const tham = useSearchParams();
  const goi = layGoi(tham.get('goi'));
  const chuDe = layChuDe(tham.get('chuDe'));
  const hopLe = !!goi && (goi.ma !== 'mot-chu-de' || !!chuDe); // gói chủ đề bắt buộc có chủ đề
  const suKien = { goi: goi?.ma, chuDe: goi?.ma === 'mot-chu-de' ? chuDe?.ma : undefined };
  const laSo = useLaSoDaLuu();
  const [tk, setTk] = useState<TaiKhoanThu | null>(null);

  useEffect(() => { if (laSo && !hopLe) router.replace('/chon-goi'); }, [laSo, hopLe, router]);
  useEffect(() => { if (laSo && hopLe) { setTk(docTaiKhoanThu()); guiSuKien('vao_thanh_toan', suKien); } }, [laSo, hopLe]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!laSo || !hopLe || !goi) return <p className="dang-tai" role="status">Đang tải…</p>;

  function dangNhap(ncc: NhaCungCap) { setTk(taoTaiKhoanThu(ncc)); guiSuKien('dang_nhap'); }
  function thanhToan() { luuGoiDaMo(goi!.ma, suKien.chuDe); guiSuKien('thanh_toan_xong', suKien); router.push('/luan-giai'); }

  return (
    <section className="trang-buoc">
      <h1>Thanh toán</h1>
      <p className="ghi-chu-rieng-tu thu">Bản thử: đăng nhập và thanh toán đều là giả lập, không thu tiền, không gửi thông tin đến Google hay Zalo.</p>

      <div className="khoi-buoc">
        <h2>1. Tài khoản</h2>
        {tk ? (
          <p className="da-dang-nhap">Đã đăng nhập thử bằng {TEN_NCC[tk.nhaCungCap]} (bản thử).</p>
        ) : (
          <div className="hai-nut">
            <button type="button" className="nut-phu" onClick={() => dangNhap('google')}>Tiếp tục với Google</button>
            <button type="button" className="nut-phu" onClick={() => dangNhap('zalo')}>Tiếp tục với Zalo</button>
          </div>
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
        <button type="button" className="nut-chinh" disabled={!tk} onClick={thanhToan}>Thanh toán (giả lập)</button>
        {!tk && <p className="tt-ghi-chu">Chọn tài khoản ở trên để thanh toán.</p>}
        <p className="cam-ket">{HOAN_TIEN}</p>
      </div>
    </section>
  );
}
