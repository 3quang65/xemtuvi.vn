'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { layGoi } from '@/lib/goi';
import { guiSuKien } from '@/lib/phien';
import { lapLaSo, type LaSo, type ThongTinSinh } from '@/lib/tuvi';
import { coVanNam, laSoMacDinh, tongHopQuyen, type QuyenGiaoDien } from '@/lib/quyen-xem';
import type { LuanGiai as BaiLuanGiai } from '@/lib/luan-giai/ai';
import { dongCanCu } from '@/lib/luan-giai/can-cu';
import TomTatMienPhi from './TomTatMienPhi';
import { KhungMoiMo, NutGopY } from './KhungMoi';
import type { BaiVanNam, XemTruocVanNam } from '@/lib/luan-giai/ai/van-nam';
import { VanNamBai } from './VanNamBai';
import { VanNamNutMua, VanNamXemTruoc } from './VanNamXemTruoc';
import ThongBaoLoi from './ThongBaoLoi';
import KhaoSatDangTien from './KhaoSatDangTien';
import DangNhapMa from './DangNhapMa';
import { linkBaoLoi, maDonHienThi } from '@/lib/tro-giup';

const HAN_TAI_MS = 20_000; // quá hạn này coi như tải chậm/đứt (E08)

/** Tải nội dung trả phí có thời gian chờ. 'loi' = lỗi mạng/máy chủ hoặc quá hạn; 'chua-mo' = máy chủ từ chối (403) dù khách có gói. */
function useTai<T>(url: string): { kq: T | 'loi' | 'chua-mo' | null; taiLai: () => void } {
  const [kq, setKq] = useState<T | 'loi' | 'chua-mo' | null>(null);
  const [lan, setLan] = useState(0);
  useEffect(() => {
    let huy = false;
    const dk = new AbortController();
    const hen = setTimeout(() => dk.abort(), HAN_TAI_MS);
    setKq(null);
    fetch(url, { cache: 'no-store', signal: dk.signal })
      .then((r) => (r.ok ? r.json() : r.status === 403 ? 'chua-mo' : Promise.reject(new Error(String(r.status)))))
      .then((b) => { if (!huy) setKq(b as T | 'chua-mo'); })
      .catch(() => { if (!huy) setKq('loi'); })
      .finally(() => clearTimeout(hen));
    return () => { huy = true; clearTimeout(hen); dk.abort(); };
  }, [url, lan]);
  return { kq, taiLai: () => setLan((n) => n + 1) };
}

/** E07 (có đơn nhưng nội dung chưa mở) và E08 (tải chậm/đứt), thay vùng nội dung. */
function LoiNoiDung({ ma, maDon, goi, taiLai }: { ma: 'E07' | 'E08'; maDon: number | null; goi?: string; taiLai: () => void }) {
  const md = maDon ? maDonHienThi(maDon) : undefined;
  return <ThongBaoLoi ma={ma} bien={{ maDon: md }} nut={{ 'tai-lai': taiLai, 'gui-bao-loi': linkBaoLoi({ maDon: md, goi, tinhHuong: ma }) }} />;
}

const TEN_CHU_DE: Record<string, string> = { 'ban-than': 'Bản thân', 'tinh-cam': 'Tình cảm', 'su-nghiep': 'Sự nghiệp', 'tai-chinh': 'Tài chính', 'gia-dao': 'Gia đạo', 'van-10-nam': 'Vận 10 năm', 'van-nam-2027': 'Vận năm 2027' };

/** Nội dung trả phí chỉ đến từ GET /api/luan-giai (máy chủ kiểm quyền); không nằm trong mã gửi xuống trình duyệt. */
function BaiLuan({ laSoId, chuDe, maDon, goi }: { laSoId: number; chuDe: string; maDon: number | null; goi?: string }) {
  const { kq: bai, taiLai } = useTai<BaiLuanGiai>(`/api/luan-giai?laSo=${laSoId}&chuDe=${chuDe}`);
  if (!bai) return <p className="dang-tai" role="status">Đang tải…</p>;
  if (bai === 'loi') return <LoiNoiDung ma="E08" maDon={maDon} goi={goi} taiLai={taiLai} />;
  if (bai === 'chua-mo') return <LoiNoiDung ma="E07" maDon={maDon} goi={goi} taiLai={taiLai} />;
  if (!bai.muc.length) return <LoiNoiDung ma="E07" maDon={maDon} goi={goi} taiLai={taiLai} />;
  return (
    <div className="bai-luan">
      {bai.muc.map((m) => (
        <section key={m.id}>
          <h3>{m.tieuDe}</h3>
          {m.nhanDinh.map((n) => (
            <p key={n.thamChieu.quyTacId}>{n.text} <small className="can-cu">{dongCanCu(n.thamChieu)}</small></p>
          ))}
        </section>
      ))}
      <p><small>{bai.ghiChu}</small></p>
      {goi && <KhaoSatDangTien key={`${laSoId}-${chuDe}`} bai={chuDe} goi={goi} />}
    </div>
  );
}

/** Vận năm: máy chủ quyết định đã mua hay chưa (bài đầy đủ hoặc bản xem trước), giao diện chỉ hiển thị. */
function VanNam({ laSoId, maDon }: { laSoId: number; maDon: number | null }) {
  const { kq, taiLai } = useTai<{ daMua: true; bai: BaiVanNam } | { daMua: false; xemTruoc: XemTruocVanNam }>(`/api/luan-giai?laSo=${laSoId}&chuDe=van-nam-2027`);
  if (!kq) return <p className="dang-tai" role="status">Đang tải…</p>;
  if (kq === 'loi' || kq === 'chua-mo') return <LoiNoiDung ma="E08" maDon={maDon} goi="van-nam-2027" taiLai={taiLai} />;
  if (kq.daMua) return <><VanNamBai bai={kq.bai} /><KhaoSatDangTien key={`${laSoId}-van-nam`} bai="van-nam-2027" goi="van-nam-2027" /></>;
  return (
    <div className="khu-van-nam">
      <VanNamXemTruoc xt={kq.xemTruoc} />
      <VanNamNutMua laSoId={laSoId} />
    </div>
  );
}

interface LaSoMay { id: number; tenGoi: string | null; thongTinSinh: ThongTinSinh }
interface Toi { dangNhap: boolean; quyen?: QuyenGiaoDien[]; laSoIds?: number[]; donGanNhat?: number | null }

async function layJson<T>(duong: string, body?: unknown): Promise<T> {
  const r = await fetch(duong, body === undefined ? { cache: 'no-store' } : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((d as { thongDiep?: string }).thongDiep || 'Có lỗi, vui lòng thử lại.');
  return d as T;
}

const tenLaSo = (l: LaSoMay, i: number) => l.tenGoi || l.thongTinSinh.ten || `Lá số ${i + 1}`;

/** Đăng nhập thử (bản thử, giống bước 1 ở trang thanh toán) để xem lại gói đã mua trên máy khác. */
function DangNhap({ khiXong }: { khiXong: () => void }) {
  return (
    <section className="trang-buoc">
      <h1>Luận giải chuyên sâu</h1>
      <div className="khoi-buoc">
        <h2>Đăng nhập để xem gói đã mua</h2>
        <p className="ghi-chu-rieng-tu thu">Bản thử: đăng nhập bằng email và mã khôi phục, không gửi thông tin đến Google hay Zalo.</p>
        <DangNhapMa idEmail="email-xem" nhanEmail="Email bạn đã dùng khi mua" khiXong={khiXong} />
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

  const maDonGanNhat = toi && toi !== 'loi' ? toi.donGanNhat ?? null : null;
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
        {laSoId !== null && <KhungMoiMo laSoId={laSoId} />}
        <NutGopY />
        {laSoId !== null && <VanNam laSoId={laSoId} maDon={maDonGanNhat} />}
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
          {chonHopLe === 'van-nam-2027' ? <VanNam laSoId={laSoId} maDon={maDonGanNhat} /> : <BaiLuan laSoId={laSoId} chuDe={chonHopLe} maDon={maDonGanNhat} goi={goi.ma} />}
        </>
      ) : (
        <p className="khoi-buoc">Chưa tìm thấy lá số đã lưu cho gói này.</p>
      )}
      {laSoVe && <TomTatMienPhi laSo={laSoVe} choMua={false} />}
      <NutGopY />
      <div className="bao-loi">
        <a className="nut-phu nut-lien-ket" href={linkBaoLoi({ maDon: maDonGanNhat ? maDonHienThi(maDonGanNhat) : undefined, goi: goi.ma })} onClick={() => guiSuKien('bao_loi', { goi: goi.ma })}>
          Không xem được đủ phần đã mua? Báo lỗi
        </a>
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
