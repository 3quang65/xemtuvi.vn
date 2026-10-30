'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CHU_DE_TAT_CA } from '@/lib/goi';
import DangNhapMa from './DangNhapMa';
import { docMaMoi, docThongTinSinh, guiSuKien, maPhien } from '@/lib/phien';

interface Kiem { hopLe: boolean; nguon?: string; gopYUrl?: string; chuDe: string[]; dangNhap: boolean; daDung: boolean }
const TEN: Record<string, string> = { ...Object.fromEntries(CHU_DE_TAT_CA.map((c) => [c.ma, c.ten])), 'tai-chinh': 'Tài chính', 'gia-dao': 'Gia đạo', 'van-nam-2027': 'Vận năm 2027 (Bản thử)' };

async function api<T>(duong: string, body?: unknown): Promise<T> {
  const r = await fetch(duong, body === undefined ? { cache: 'no-store' } : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((d as { thongDiep?: string }).thongDiep || 'Có lỗi, vui lòng thử lại.');
  return d as T;
}

/** Mã mời đang giữ trong tab + trạng thái do máy chủ kiểm; null khi khách không có mã hợp lệ. */
export function useMaMoi(lanTai = 0) {
  const [kq, setKq] = useState<{ ma: string; kiem: Kiem } | null>(null);
  useEffect(() => {
    const ma = docMaMoi();
    if (!ma) return;
    let huy = false;
    api<Kiem>(`/api/ma-moi/kiem?ma=${encodeURIComponent(ma)}`).then((kiem) => { if (!huy && kiem.hopLe) setKq({ ma, kiem }); }).catch(() => {});
    return () => { huy = true; };
  }, [lanTai]);
  return kq;
}

/** Khung "Bạn được mời mở miễn phí 1 chuyên đề" ở /chon-goi và /luan-giai. laSoId có sẵn (đã lưu trên máy chủ) thì dùng, không thì lưu lá số trong tab. */
export function KhungMoiMo({ laSoId }: { laSoId?: number | null }) {
  const router = useRouter();
  const [lan, setLan] = useState(0);
  const moi = useMaMoi(lan);
  const [chon, setChon] = useState<string | null>(null);
  const [bao, setBao] = useState('');
  const [dang, setDang] = useState(false);
  if (!moi || moi.kiem.daDung) return null;
  const { ma, kiem } = moi;

  async function mo() {
    setBao(''); setDang(true);
    try {
      const id = laSoId ?? (await api<{ id: number }>('/api/la-so', { thongTinSinh: docThongTinSinh() })).id;
      await api('/api/ma-moi/dung', { ma, laSoId: id, chuDe: chon, phien: maPhien() });
      router.push('/luan-giai');
    } catch (e) { setBao((e as Error).message); setDang(false); }
  }
  return (
    <div className="khoi-buoc khung-moi">
      <h2>Bạn được mời mở miễn phí 1 chuyên đề</h2>
      <p className="tt-ghi-chu">Chọn một chuyên đề bạn quan tâm nhất. Bản thử, không thu tiền.</p>
      {!kiem.dangNhap && (
        <>
          <DangNhapMa idEmail="email-moi" nhanEmail="Email của bạn (để xem lại trên máy khác)" khiXong={() => setLan((n) => n + 1)} />
        </>
      )}
      {kiem.dangNhap && (
        <>
          <fieldset className="chon-chu-de">
            <legend>Chọn chuyên đề</legend>
            {kiem.chuDe.map((c) => (
              <label key={c}><input type="radio" name="chu-de-moi" value={c} checked={chon === c} onChange={() => setChon(c)} /><span>{TEN[c] ?? c}</span></label>
            ))}
          </fieldset>
          <button type="button" className="nut-chinh" disabled={dang || !chon} onClick={mo}>{chon ? 'Mở chuyên đề miễn phí' : 'Chọn một chuyên đề trước'}</button>
        </>
      )}
      {bao && <p className="bao-loi-nhap" role="alert">{bao}</p>}
    </div>
  );
}

/** Nút Góp ý ở /luan-giai: chỉ hiện khi khách có mã hợp lệ và đã cấu hình GOP_Y_URL. Link chỉ gắn nguon, không dữ liệu cá nhân. */
export function NutGopY() {
  const moi = useMaMoi();
  const url = moi?.kiem.gopYUrl;
  if (!moi || !url) return null;
  let dich = '';
  try { const u = new URL(url); u.searchParams.set('nguon', moi.kiem.nguon ?? ''); dich = u.toString(); } catch { return null; }
  return (
    <div className="gop-y">
      <p className="tt-ghi-chu">Bạn thấy bản luận thế nào? Góp ý 6 câu ngắn giúp chúng mình hoàn thiện sản phẩm.</p>
      <a className="nut-phu nut-lien-ket" href={dich} target="_blank" rel="noopener noreferrer" onClick={() => guiSuKien('bam_gop_y')}>Góp ý</a>
    </div>
  );
}
