'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { layChuDe, layGoi } from '@/lib/goi';
import { guiSuKien } from '@/lib/phien';
import { useLaSoDaLuu } from '@/lib/useLaSoDaLuu';
import type { LuanGiai as BaiLuanGiai } from '@/lib/luan-giai/ai';
import TomTatMienPhi from './TomTatMienPhi';

const TEN_CHU_DE: Record<string, string> = { 'ban-than': 'Bản thân', 'tinh-cam': 'Tình cảm', 'su-nghiep': 'Sự nghiệp', 'van-10-nam': 'Vận 10 năm' };
const CHU_DE_TRON = ['ban-than', 'tinh-cam', 'su-nghiep', 'van-10-nam'];

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

export default function LuanGiai() {
  const laSo = useLaSoDaLuu();
  const [goi, setGoi] = useState<ReturnType<typeof layGoi> | null | undefined>(undefined);
  const [chuDe, setChuDe] = useState<ReturnType<typeof layChuDe>>(undefined);
  const [laSoId, setLaSoId] = useState<number | null>(null);
  const [dsChuDe, setDsChuDe] = useState<string[]>([]);
  const [chon, setChon] = useState<string | null>(null);
  const [daBao, setDaBao] = useState(false);
  useEffect(() => {
    // Quyền xem lấy từ máy chủ (đăng nhập ở máy nào cũng thấy).
    fetch('/api/toi', { cache: 'no-store' }).then((r) => r.json()).then((t: { quyen?: { loai: string; chuDe: string | null; laSoId: number | null }[]; laSoIds?: number[] }) => {
      const moi = (t.quyen ?? []).at(-1); // quyền mua gần nhất
      const ma = moi?.loai === 'thanh_vien' ? 'thanh-vien-nam' : moi?.loai === 'tron_la_so' ? 'tron-la-so' : moi?.loai === 'chu_de' ? 'mot-chu-de' : null;
      setGoi(layGoi(ma) ?? null);
      setChuDe(moi?.loai === 'chu_de' ? layChuDe(moi.chuDe) : undefined);
      const ds = moi?.loai === 'chu_de' && moi.chuDe ? [moi.chuDe] : moi ? CHU_DE_TRON : [];
      setDsChuDe(ds); setChon(ds[0] ?? null);
      setLaSoId(moi?.laSoId ?? t.laSoIds?.[0] ?? null);
    }).catch(() => setGoi(null));
  }, []);
  if (!laSo || goi === undefined) return <p className="dang-tai" role="status">Đang tải…</p>;

  if (!goi) {
    return (
      <section className="trang-buoc">
        <h1>Luận giải chuyên sâu</h1>
        <p>Bạn chưa mở gói nào.</p>
        <Link href="/chon-goi" className="nut-chinh nut-lien-ket">Chọn gói luận giải</Link>
      </section>
    );
  }
  return (
    <section className="trang-buoc">
      <h1>Luận giải chuyên sâu</h1>
      <p className="da-dang-nhap">Đã mở: {goi.ten}{chuDe ? ` — ${chuDe.ten}` : ''} (bản thử, chưa thu tiền thật).</p>
      {laSoId !== null && chon ? (
        <>
          {dsChuDe.length > 1 && (
            <div role="tablist" aria-label="Chuyên đề">
              {dsChuDe.map((c) => (
                <button key={c} type="button" role="tab" aria-selected={c === chon} className={c === chon ? 'nut-chinh' : 'nut-phu'} onClick={() => setChon(c)}>{TEN_CHU_DE[c] ?? c}</button>
              ))}
            </div>
          )}
          <BaiLuan laSoId={laSoId} chuDe={chon} />
        </>
      ) : (
        <p className="khoi-buoc">Chưa tìm thấy lá số đã lưu cho gói này.</p>
      )}
      <TomTatMienPhi laSo={laSo} choMua={false} />
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
