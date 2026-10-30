'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CONG_BO_GIA, dongHanBan, giaHienThi, HOAN_TIEN, layChuDe, type Goi } from '@/lib/goi';
import { useGia } from '@/lib/useGia';
import { docThongTinSinh, guiSuKien } from '@/lib/phien';
import { useLaSoDaLuu } from '@/lib/useLaSoDaLuu';
import { coTronLaSo, type QuyenGiaoDien } from '@/lib/quyen-xem';
import { linkBaoLoi, maDonHienThi, nhacSauMuaVanNam, tinXacNhanDon } from '@/lib/tro-giup';
import ThongBaoLoi from './ThongBaoLoi';
import DangNhapMa from './DangNhapMa';

async function goiApi<T>(duong: string, body?: unknown): Promise<T> {
  const r = await fetch(duong, body === undefined ? { cache: 'no-store' } : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((d as { thongDiep?: string }).thongDiep || 'Có lỗi, vui lòng thử lại.');
  return d as T;
}

export default function ThanhToan() {
  const router = useRouter();
  const tham = useSearchParams();
  const bangGia = useGia();
  const ma = tham.get('goi');
  const goi: Goi | undefined = [...bangGia.goi, ...bangGia.vanNam].find((g) => g.ma === ma);
  const chuDe = layChuDe(tham.get('chuDe'));
  const hopLe = !!goi && (goi.ma !== 'mot-chu-de' || !!chuDe); // gói chủ đề bắt buộc có chủ đề
  const suKien = { goi: goi?.ma, chuDe: goi?.ma === 'mot-chu-de' ? chuDe?.ma : undefined };
  const laSoMay = Number(tham.get('laSo')) || null; // mua cho lá số đã lưu trên máy chủ (từ /luan-giai), không cần sessionStorage
  const laSoTam = useLaSoDaLuu(!laSoMay);
  const laSo = laSoMay ? true : laSoTam;
  const [email, setEmail] = useState<string | null>(null); // tài khoản đang đăng nhập (từ máy chủ)
  const [tru, setTru] = useState(0); // số được trừ khi nâng lên Thành viên năm (máy chủ tính)
  const [bao, setBao] = useState('');
  const [dangXuLy, setDangXuLy] = useState(false);
  const dangBam = useRef(false); // chặn bấm trùng ngay tại lần bấm, trước cả khi nút kịp bị khóa
  const donRef = useRef<number | null>(null); // đơn đã tạo: thử lại dùng lại đơn này, không tạo đơn mới
  const laSoRef = useRef<number | null>(null);
  const [donId, setDonId] = useState<number | null>(null);
  const [loiTT, setLoiTT] = useState(false); // E05
  const [bamTrung, setBamTrung] = useState(false); // E06
  const [xong, setXong] = useState<{ id: number; tenGoi: string; maGoi: string } | null>(null); // tin xác nhận 3.1

  useEffect(() => { if (laSo && bangGia.san && !hopLe) router.replace(laSoMay ? '/luan-giai' : '/chon-goi'); }, [laSo, hopLe, router, laSoMay, bangGia.san]); // chờ bảng giá tải xong, tránh đẩy nhầm khi gói Vận 2027 chưa có trong danh sách
  useEffect(() => { if (laSo && hopLe) { guiSuKien('vao_thanh_toan', suKien); goiApi<{ dangNhap: boolean; email?: string; quyen?: QuyenGiaoDien[]; laSoIds?: number[] }>('/api/toi').then((t) => {
      setEmail(t.dangNhap ? t.email ?? null : null);
      // Đã có Trọn lá số của lá số này: không bán gói gộp, chuyển sang gói Vận năm 2027 lẻ.
      if (ma === 'tron-la-so-kem-van-nam' && laSoMay && coTronLaSo(t.quyen ?? [], laSoMay, t.laSoIds ?? [])) router.replace(`/thanh-toan?goi=van-nam-2027&laSo=${laSoMay}`);
    }).catch(() => {}); } }, [laSo, hopLe]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!email || goi?.ma !== 'thanh-vien-nam') { setTru(0); return; }
    goiApi<{ tru: number }>('/api/don-hang?maGoi=thanh-vien-nam').then((r) => setTru(r.tru || 0)).catch(() => setTru(0));
  }, [email, goi?.ma]);
  if (!laSo || !bangGia.san || !hopLe || !goi) return <p className="dang-tai" role="status">Đang tải…</p>;

  async function thanhToan() {
    if (dangBam.current) { setBamTrung(true); return; } // lần bấm thứ hai trở đi: chỉ báo E06, không tạo thêm đơn
    dangBam.current = true; setBao(''); setLoiTT(false); setBamTrung(false); setDangXuLy(true);
    try {
      laSoRef.current ??= laSoMay ?? (await goiApi<{ id: number }>('/api/la-so', { thongTinSinh: docThongTinSinh() })).id;
      if (donRef.current === null) {
        donRef.current = (await goiApi<{ id: number }>('/api/don-hang', { maGoi: goi!.ma, chuDe: suKien.chuDe, laSoId: laSoRef.current })).id;
        setDonId(donRef.current);
      }
      await goiApi('/api/thanh-toan/gia-lap', { donHangId: donRef.current });
      guiSuKien('thanh_toan_xong', suKien);
      setXong({ id: donRef.current, tenGoi: goi!.ten, maGoi: goi!.ma });
    } catch { setLoiTT(true); dangBam.current = false; setDangXuLy(false); }
  }

  if (xong) {
    const tin = tinXacNhanDon({ maDon: maDonHienThi(xong.id), tenGoi: xong.tenGoi, maGoi: xong.maGoi });
    const nhac = nhacSauMuaVanNam(xong.maGoi);
    return (
      <section className="trang-buoc" aria-labelledby="tin-xac-nhan">
        <h1 id="tin-xac-nhan">{tin.tieuDe}</h1>
        <div className="khoi-buoc" role="status">
          <p>{tin.dong[0]}</p>
          <ul className="tin-don">
            <li>Mã đơn: <strong>{tin.maDon}</strong></li>
            <li>Gói: <strong>{tin.tenGoi}</strong>{tin.giaGoi && <> · Giá hiển thị: {tin.giaGoi}</>}</li>
            <li>{tin.dong[1]}</li>
            <li>{tin.dong[2]}</li>
          </ul>
          <div className="hai-nut">
            <a href="/luan-giai" className="nut-chinh nut-lien-ket">Xem luận giải của tôi</a>
            <a href={linkBaoLoi({ maDon: tin.maDon, goi: xong.maGoi })} className="nut-phu nut-lien-ket">Báo lỗi / góp ý</a>
          </div>
          {nhac && (
            <div className="nhac-van-nam" data-testid="nhac-van-nam">
              <p>{nhac.dongCombo}{nhac.combo && <> <a href={nhac.combo.href}>{nhac.combo.nhan}</a></>}</p>
              {nhac.luuNguyet && <p data-testid="nhac-luu-nguyet">{nhac.luuNguyet} <a href="/van-nam-2027">Trang Vận năm 2027</a></p>}
            </div>
          )}
          <p className="tt-ghi-chu">{tin.ghiChu}</p>
        </div>
      </section>
    );
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
            <DangNhapMa idEmail="email-thu" nhanEmail="Email của bạn (để xem lại gói trên máy khác)" thamSoDangKy={suKien.goi ? { goi: suKien.goi } : undefined} khiXong={setEmail} />
          </>
        )}
      </div>

      <div className="khoi-buoc">
        <h2>2. Đơn hàng</h2>
        <dl className="tt-dong don">
          <div><dt>Gói</dt><dd>{goi.ten}{CONG_BO_GIA && dongHanBan(goi) && <span className="tt-ghi-chu" style={{ display: 'block' }}>{dongHanBan(goi)}</span>}</dd></div>
          {chuDe && goi.ma === 'mot-chu-de' && <div><dt>Chủ đề</dt><dd>{chuDe.ten}</dd></div>}
          <div><dt>Thời hạn</dt><dd>{goi.donVi}</dd></div>
          {CONG_BO_GIA && tru > 0 && <div><dt>Đã trừ</dt><dd>{giaHienThi(tru)}</dd></div>}
          <div><dt>Tổng</dt><dd><strong>{giaHienThi(goi.gia - tru)}</strong></dd></div>
        </dl>
        {loiTT ? (
          <ThongBaoLoi ma="E05" nut={{ 'thu-lai': thanhToan, 'gui-bao-loi': linkBaoLoi({ goi: goi.ma, maDon: donId ? maDonHienThi(donId) : undefined, tinhHuong: 'E05' }) }} />
        ) : (
          <button type="button" className="nut-chinh" disabled={!email || dangXuLy} onClick={thanhToan}>Thanh toán (giả lập)</button>
        )}
        {bamTrung && donId !== null && (
          <ThongBaoLoi ma="E06" bien={{ maDon: maDonHienThi(donId), tenGoi: goi.ten }} nut={{ 'xem-luan-giai': '/luan-giai', 'xem-don': '/toi' }} />
        )}
        {bao && <p className="bao-loi-nhap" role="alert">{bao}</p>}
        {!email && <p className="tt-ghi-chu">Chọn tài khoản ở trên để thanh toán.</p>}
        {!laSoMay && <p className="ghi-chu-rieng-tu">Khi thanh toán, thông tin sinh của lá số này được lưu (mã hóa) trên máy chủ để bạn xem lại ở máy khác. Trước đó, thông tin chỉ nằm trên trình duyệt của bạn.</p>}
        {CONG_BO_GIA && <p className="cam-ket">{HOAN_TIEN}</p>}
      </div>
    </section>
  );
}
