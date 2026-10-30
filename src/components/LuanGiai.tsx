'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { layGoi } from '@/lib/goi';
import { guiSuKien } from '@/lib/phien';
import { lapLaSo, type LaSo, type ThongTinSinh } from '@/lib/tuvi';
import { coVanNam, laSoMacDinh, tongHopQuyen, type QuyenGiaoDien } from '@/lib/quyen-xem';
import type { LuanGiai as BaiLuanGiai } from '@/lib/luan-giai/ai';
import TomTatMienPhi from './TomTatMienPhi';
import { VanNamNutMua, VanNamXemTruoc } from './VanNamXemTruoc';

const TEN_CHU_DE: Record<string, string> = { 'ban-than': 'Bản thân', 'tinh-cam': 'Tình cảm', 'su-nghiep': 'Sự nghiệp', 'tai-chinh': 'Tài chính', 'gia-dao': 'Gia đạo', 'van-10-nam': 'Vận 10 năm', 'van-nam-2027': 'Vận năm 2027' };

/** Nội dung trả phí chỉ đến từ GET /api/luan-giai (máy chủ kiểm quyền); không nằm trong mã gửi xuống trình duyệt. */
function BaiLuan({ laSoId, chuDe }: { laSoId: number; chuDe: string }) {
  const [bai, setBai] = useState<BaiLuanGiai | 'loi' | null>(null);
  useEffect(() => {
    let huy = false;
    setBai(null);
    fetch(`/api/luan-giai?laSo=${laSoId}&chuDe=${chuDe}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((b: BaiLuanGiai) => { if (!huy) setBai(b); })
      .catch(() => { if (!huy) setBai('loi'); });
    return () => { huy = true; };
  }, [laSoId, chuDe]);
  if (!bai) return <p className="dang-tai" role="status">Đang tải…</p>;
  if (bai === 'loi') return <p role="alert">Chưa tải được phần này. Bạn thử lại sau ít phút nhé.</p>;
  if (!bai.muc.length) return <p className="khoi-buoc">Phần này chưa có nội dung cho lá số của bạn.</p>;
  return (
    <div className="bai-luan">
      {bai.muc.map((m) => (
        <section key={m.id}>
          <h3>{m.tieuDe}</h3>
          {m.nhanDinh.map((n) => (
            <p key={n.thamChieu.quyTacId}>{n.text} <small>({n.thamChieu.nguon}; {n.thamChieu.truongPhai})</small></p>
          ))}
        </section>
      ))}
      <p><small>{bai.ghiChu}</small></p>
    </div>
  );
}

/** Chuyên đề chưa mua: bản xem trước + phần khóa mờ + nút mua (không tải nội dung trả phí). */
function VanNamKhoa({ laSoId }: { laSoId: number }) {
  return (
    <div className="khu-van-nam">
      <VanNamXemTruoc />
      <VanNamNutMua laSoId={laSoId} />
    </div>
  );
}

interface LaSoMay { id: number; tenGoi: string | null; thongTinSinh: ThongTinSinh }
interface Toi { dangNhap: boolean; quyen?: QuyenGiaoDien[]; laSoIds?: number[] }

async function layJson<T>(duong: string, body?: unknown): Promise<T> {
  const r = await fetch(duong, body === undefined ? { cache: 'no-store' } : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((d as { thongDiep?: string }).thongDiep || 'Có lỗi, vui lòng thử lại.');
  return d as T;
}

const tenLaSo = (l: LaSoMay, i: number) => l.tenGoi || l.thongTinSinh.ten || `Lá số ${i + 1}`;

/** Đăng nhập thử (bản thử, giống bước 1 ở trang thanh toán) để xem lại gói đã mua trên máy khác. */
function DangNhap({ khiXong }: { khiXong: () => void }) {
  const [nhap, setNhap] = useState('');
  const [bao, setBao] = useState('');
  const [dang, setDang] = useState(false);
  async function vao(ncc: 'google' | 'zalo') {
    setBao(''); setDang(true);
    try { await layJson('/api/dang-nhap', { nhaCungCap: ncc, email: nhap }); guiSuKien('dang_nhap'); khiXong(); } catch (e) { setBao((e as Error).message); setDang(false); }
  }
  return (
    <section className="trang-buoc">
      <h1>Luận giải chuyên sâu</h1>
      <div className="khoi-buoc">
        <h2>Đăng nhập để xem gói đã mua</h2>
        <p className="ghi-chu-rieng-tu thu">Bản thử: đăng nhập giả lập, không gửi thông tin đến Google hay Zalo.</p>
        <label htmlFor="email-xem">Email bạn đã dùng khi mua</label>
        <input id="email-xem" type="email" inputMode="email" autoComplete="email" value={nhap} onChange={(e) => setNhap(e.target.value)} />
        <div className="hai-nut">
          <button type="button" className="nut-phu" disabled={dang || !nhap} onClick={() => vao('google')}>Tiếp tục với Google</button>
          <button type="button" className="nut-phu" disabled={dang || !nhap} onClick={() => vao('zalo')}>Tiếp tục với Zalo</button>
        </div>
        {bao && <p role="alert">{bao}</p>}
      </div>
      <p><Link href="/">Chưa mua? Lập lá số miễn phí</Link></p>
    </section>
  );
}

export default function LuanGiai() {
  // Mọi thứ lấy từ máy chủ (đăng nhập ở máy nào cũng thấy), không cần lá số trong sessionStorage.
  const [toi, setToi] = useState<Toi | null | 'loi'>(null);
  const [dsLaSo, setDsLaSo] = useState<LaSoMay[]>([]);
  const [laSoId, setLaSoId] = useState<number | null>(null);
  const [chon, setChon] = useState<string | null>(null);
  const [daBao, setDaBao] = useState(false);
  const [lanTai, setLanTai] = useState(0);
  useEffect(() => {
    let huy = false;
    (async () => {
      try {
        const t = await layJson<Toi>('/api/toi');
        if (!t.dangNhap) { if (!huy) setToi(t); return; }
        const { laSo } = await layJson<{ laSo: LaSoMay[] }>('/api/la-so');
        if (huy) return;
        setDsLaSo(laSo);
        setLaSoId(laSoMacDinh(t.quyen ?? [], laSo.map((l) => l.id)));
        setToi(t);
      } catch { if (!huy) setToi('loi'); }
    })();
    return () => { huy = true; };
  }, [lanTai]);

  const laSoChon = dsLaSo.find((l) => l.id === laSoId) ?? null;
  const quyen = toi && toi !== 'loi' && laSoId !== null ? tongHopQuyen(toi.quyen ?? [], laSoId, dsLaSo.map((l) => l.id)) : null;
  const dsChuDe = quyen?.dsChuDe ?? [];
  const daMuaVanNam = !!toi && toi !== 'loi' && laSoId !== null && coVanNam(toi.quyen ?? [], laSoId, dsLaSo.map((l) => l.id));
  const dsTab = daMuaVanNam || laSoId === null ? dsChuDe : [...dsChuDe, 'van-nam-2027']; // chưa mua vẫn hiện tab, bên trong là bản khóa
  const chonHopLe = chon && dsTab.includes(chon) ? chon : dsTab[0] ?? null;
  const laSoVe = useMemo<LaSo | null>(() => { try { return laSoChon ? lapLaSo(laSoChon.thongTinSinh) : null; } catch { return null; } }, [laSoChon]);

  if (toi === null) return <p className="dang-tai" role="status">Đang tải…</p>;
  if (toi === 'loi') return <section className="trang-buoc"><h1>Luận giải chuyên sâu</h1><p role="alert">Chưa tải được. Bạn thử lại sau ít phút nhé.</p></section>;
  if (!toi.dangNhap) return <DangNhap khiXong={() => { setToi(null); setLanTai((n) => n + 1); }} />;

  const goi = quyen ? layGoi(quyen.goi) : null;
  if (!goi || laSoId === null) {
    return (
      <section className="trang-buoc">
        <h1>Luận giải chuyên sâu</h1>
        <p>{dsLaSo.length ? 'Lá số này chưa mở gói nào.' : 'Tài khoản này chưa có lá số hay gói nào.'}</p>
        {dsLaSo.length > 1 && <ChonLaSo ds={dsLaSo} id={laSoId} doi={(id) => { setLaSoId(id); setChon(null); }} />}
        {laSoId !== null && <VanNamKhoa laSoId={laSoId} />}
        <Link href={dsLaSo.length ? '/chon-goi' : '/'} className="nut-chinh nut-lien-ket">{dsLaSo.length ? 'Chọn gói luận giải' : 'Lập lá số miễn phí'}</Link>
      </section>
    );
  }
  return (
    <section className="trang-buoc">
      <h1>Luận giải chuyên sâu</h1>
      <p className="da-dang-nhap">Đã mở: {goi.ten}{quyen!.goi === 'mot-chu-de' ? ` — ${dsChuDe.map((c) => TEN_CHU_DE[c] ?? c).join(', ')}` : ''} (bản thử, chưa thu tiền thật).</p>
      {dsLaSo.length > 1 && <ChonLaSo ds={dsLaSo} id={laSoId} doi={(id) => { setLaSoId(id); setChon(null); }} />}
      {chonHopLe ? (
        <>
          {dsTab.length > 1 && (
            <div role="tablist" aria-label="Chuyên đề">
              {dsTab.map((c) => (
                <button key={c} type="button" role="tab" aria-selected={c === chonHopLe} className={c === chonHopLe ? 'nut-chinh' : 'nut-phu'} onClick={() => setChon(c)}>{TEN_CHU_DE[c] ?? c}</button>
              ))}
            </div>
          )}
          {chonHopLe === 'van-nam-2027' && !daMuaVanNam ? <VanNamKhoa laSoId={laSoId} /> : <BaiLuan laSoId={laSoId} chuDe={chonHopLe} />}
        </>
      ) : (
        <p className="khoi-buoc">Chưa tìm thấy lá số đã lưu cho gói này.</p>
      )}
      {laSoVe && <TomTatMienPhi laSo={laSoVe} choMua={false} />}
      <div className="bao-loi">
        {daBao ? (
          <p role="status">Đã ghi nhận. Bản thử chưa thu tiền nên chưa có bước hoàn tiền; khi bán chính thức, lỗi kỹ thuật sẽ được hoàn 100%.</p>
        ) : (
          <button type="button" className="nut-phu" onClick={() => { guiSuKien('bao_loi', { goi: goi.ma }); setDaBao(true); }}>
            Không xem được đủ phần đã mua? Báo lỗi
          </button>
        )}
      </div>
    </section>
  );
}

function ChonLaSo({ ds, id, doi }: { ds: LaSoMay[]; id: number | null; doi: (id: number) => void }) {
  return (
    <div className="tuy-chon-o">
      <label htmlFor="chon-la-so">Lá số</label>
      <select id="chon-la-so" value={id ?? ''} onChange={(e) => doi(Number(e.target.value))}>
        {ds.map((l, i) => <option key={l.id} value={l.id}>{tenLaSo(l, i)}</option>)}
      </select>
    </div>
  );
}
