'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { guiSuKien } from '@/lib/phien';
import { GIU_MS, K_KHAO_SAT, cachHien, danhDauDaHoi, nenHoi } from '@/lib/khao-sat-hien';

const TOI_DA = 300;
type Cach = 'cuoi_bai' | 'doc_xong';

function docTrangThai(): unknown { try { return JSON.parse(localStorage.getItem(K_KHAO_SAT) || 'null'); } catch { return null; } }
function luuTrangThai(bai: string) { try { localStorage.setItem(K_KHAO_SAT, JSON.stringify(danhDauDaHoi(docTrangThai(), bai, Date.now()))); } catch { /* trình duyệt chặn lưu: bỏ qua */ } }

function HangDiem({ ten, nhan, nhanThap, nhanCao, giaTri, chon }: { ten: string; nhan: string; nhanThap: string; nhanCao: string; giaTri: number | null; chon: (n: number) => void }) {
  return (
    <div className="ks-hang" role="group" aria-label={nhan}>
      <p className="ks-cau" id={`ks-${ten}`}>{nhan}</p>
      <div className="ks-diem">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" className="ks-nut-diem" aria-pressed={giaTri === n} aria-label={`${n} trên 5`} aria-describedby={`ks-${ten}`} onClick={() => chon(n)}>{n}</button>
        ))}
      </div>
      <p className="ks-nhan-dau" aria-hidden="true"><span>1 = {nhanThap}</span><span>5 = {nhanCao}</span></p>
    </div>
  );
}

/**
 * Khảo sát 'đáng tiền' dưới bài trả phí (khao-sat-dang-tien_v1.md). Không chặn nội dung: thẻ nằm dưới bài, hiện khi cuối bài ở trong khung nhìn ≥ 2 giây,
 * hoặc ngay khi mốc cuối bài đã nằm phía trên khung nhìn (khách cuộn qua / nhảy xuống chân trang), hoặc khi khách bấm "Đọc xong". Chỉ hỏi 1 lần/bài; khách đã thấy thì 7 ngày sau mới hỏi bài khác. Sự kiện không mang dữ liệu sinh.
 */
export default function KhaoSatDangTien({ bai, goi }: { bai: string; goi: string }) {
  const [buoc, setBuoc] = useState<'cho' | 'hien' | 'cam-on' | 'dong'>('cho');
  const [duocHoi, setDuocHoi] = useState(false);
  const [a, setA] = useState<number | null>(null);
  const [c, setC] = useState<number | null>(null);
  const [loi, setLoi] = useState('');
  const [cao, setCao] = useState(0);
  const dauBai = useRef<HTMLDivElement>(null);
  const the = useRef<HTMLElement>(null);
  const daGui = useRef(false);

  useEffect(() => { setDuocHoi(nenHoi(docTrangThai(), bai, Date.now())); }, [bai]);

  const hien = useCallback((cach: Cach) => {
    if (!nenHoi(docTrangThai(), bai, Date.now())) return;
    luuTrangThai(bai);
    guiSuKien('hien_khao_sat', { truong: { bai, goi, cach } });
    setBuoc('hien');
  }, [bai, goi]);

  useEffect(() => {
    const el = dauBai.current;
    if (!duocHoi || buoc !== 'cho' || !el || typeof IntersectionObserver === 'undefined') return;
    let hen: ReturnType<typeof setTimeout> | null = null;
    const quanSat = new IntersectionObserver(([e]) => {
      const kieu = cachHien({ giaoNhau: e.isIntersecting, canhDuoi: e.boundingClientRect.bottom });
      if (kieu === 'ngay') { if (hen) { clearTimeout(hen); hen = null; } hien('cuoi_bai'); }
      else if (kieu === 'doi') { if (!hen) hen = setTimeout(() => hien('cuoi_bai'), GIU_MS); }
      else if (hen) { clearTimeout(hen); hen = null; }
    });
    quanSat.observe(el);
    return () => { quanSat.disconnect(); if (hen) clearTimeout(hen); };
  }, [duocHoi, buoc, hien]);

  // Giữ chỗ đúng chiều cao khi đóng để trang bên dưới không nhảy.
  function dong(boQua: boolean) {
    if (boQua && !daGui.current) guiSuKien('bo_qua_khao_sat', { truong: { bai, goi } });
    setCao(the.current?.offsetHeight ?? 0);
    setBuoc('dong');
  }

  async function gui() {
    if (a === null || daGui.current) return;
    daGui.current = true;
    const chu = loi.trim().slice(0, TOI_DA);
    guiSuKien('tra_loi_khao_sat', { truong: { bai, goi, diem_a: a, ...(c !== null ? { diem_c: c } : {}), co_loi_b: chu.length > 0 } });
    if (chu) void fetch('/api/khao-sat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bai, goi, diem_a: a, loi: chu }), keepalive: true }).catch(() => {});
    setBuoc('cam-on');
  }

  if (!duocHoi || buoc === 'dong' && cao === 0) return null;
  return (
    <div className="khao-sat">
      <div ref={dauBai} aria-hidden="true" />
      {buoc === 'cho' && <button type="button" className="nut-phu ks-doc-xong" onClick={() => hien('doc_xong')}>Đọc xong</button>}
      {buoc === 'dong' && <div style={{ height: cao }} aria-hidden="true" />}
      {buoc === 'cam-on' && (
        <section ref={the} className="ks-the" aria-label="Khảo sát sau khi đọc">
          <p role="status">Cảm ơn bạn đã chia sẻ. Góp ý của bạn giúp bọn mình cải thiện bài luận giải.</p>
          <button type="button" className="nut-phu ks-dong" onClick={() => dong(false)}>Đóng</button>
        </section>
      )}
      {buoc === 'hien' && (
        <section ref={the} className="ks-the" aria-label="Khảo sát sau khi đọc">
          <div className="ks-dau">
            <p className="ks-mo">Cảm ơn bạn đã đọc. Nếu tiện, cho mình xin 20 giây góp ý để bài luận giải tốt hơn nhé.</p>
            <button type="button" className="ks-nut-x" aria-label="Đóng khảo sát" onClick={() => dong(true)}>×</button>
          </div>
          <HangDiem ten="a" nhan="Bài luận giải này có đáng với những gì bạn bỏ ra không?" nhanThap="hoàn toàn không đáng" nhanCao="rất đáng" giaTri={a} chon={setA} />
          <div className="ks-hang">
            <label className="ks-cau" htmlFor="ks-b">Bạn thích nhất điều gì, hoặc điều gì làm bạn chưa vừa ý? (không bắt buộc)</label>
            <textarea id="ks-b" className="ks-chu" rows={3} maxLength={TOI_DA} value={loi} onChange={(e) => setLoi(e.target.value.slice(0, TOI_DA))} aria-describedby="ks-b-gy ks-b-dem" />
            <p className="ks-nho" id="ks-b-gy">Bạn không cần ghi ngày giờ sinh hay thông tin cá nhân.</p>
            <p className="ks-nho" id="ks-b-dem" aria-live="off">{loi.length}/{TOI_DA}</p>
          </div>
          <HangDiem ten="c" nhan="Bạn có muốn giới thiệu xemtuvi.vn cho bạn bè không? (không bắt buộc)" nhanThap="chắc là không" nhanCao="chắc chắn có" giaTri={c} chon={setC} />
          <p className="ks-nho">Bài luận giải do AI tạo, được kiểm duyệt theo bộ quy tắc của xemtuvi.vn.</p>
          <div className="ks-nut">
            <button type="button" className="nut-chinh" disabled={a === null} onClick={gui}>Gửi</button>
            <button type="button" className="nut-phu" onClick={() => dong(true)}>Để sau</button>
          </div>
        </section>
      )}
    </div>
  );
}
