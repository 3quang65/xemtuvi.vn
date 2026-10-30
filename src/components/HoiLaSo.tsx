'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface NhanDinh { text: string; canCu: string; quyTacId: string }
interface TraLoi { doan_dan: string; nhanDinh: NhanDinh[]; ghiChu?: string }
interface MucLichSu { id: number; luc: number; cau: string; tra_loi: TraLoi }
interface Luot { con_lai: number; lam_moi: string }

const TONG = 5;
const GOI_Y = ['Điểm mạnh và điều cần lưu ý trong tính cách của tôi là gì?', 'Tôi có xu hướng gắn bó thế nào trong tình cảm?', 'Năm nay tôi nên tập trung vào điều gì?'];

/** Khối chờ cho khách chưa có Thành viên năm: thấy ô hỏi bị khóa và đường sang trang chọn gói. */
function HoiKhoa() {
  return (
    <section className="hoi-la-so" aria-labelledby="hoi-tieu-de">
      <h2 id="hoi-tieu-de">Hỏi về lá số của bạn</h2>
      <p className="hoi-phu">Thành viên năm được hỏi thêm {TONG} câu mỗi tháng về chính lá số của mình.</p>
      <textarea disabled rows={2} placeholder="Ô hỏi sẽ mở khi bạn là Thành viên năm" aria-label="Câu hỏi về lá số (đang khóa)" />
      <Link href="/chon-goi" className="nut-phu nut-lien-ket">Xem gói Thành viên năm</Link>
    </section>
  );
}

function KhungTraLoi({ t }: { t: TraLoi }) {
  return (
    <div className="hoi-tra-loi">
      <p>{t.doan_dan}</p>
      {t.nhanDinh.length > 0 && (
        <ul>
          {t.nhanDinh.map((n) => <li key={n.quyTacId}>{n.text}{n.canCu && <small className="can-cu">{n.canCu}</small>}</li>)}
        </ul>
      )}
      {t.ghiChu && <p><small>{t.ghiChu}</small></p>}
    </div>
  );
}

/** Hỏi đáp về lá số (Thành viên năm). Câu trả lời do máy chủ ghép từ nhận định có mã quy tắc; giao diện chỉ hiển thị. */
export default function HoiLaSo({ laSoId, thanhVien }: { laSoId: number; thanhVien: boolean }) {
  const [luot, setLuot] = useState<Luot | null>(null);
  const [lichSu, setLichSu] = useState<MucLichSu[]>([]);
  const [cau, setCau] = useState('');
  const [dang, setDang] = useState(false);
  const [moi, setMoi] = useState<{ cau: string; tra: TraLoi } | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const khungRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!thanhVien) return;
    let huy = false;
    setLuot(null); setLichSu([]); setMoi(null); setLoi(null); setCau('');
    fetch(`/api/hoi-dap?laSoId=${laSoId}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((b: { lich_su: MucLichSu[] } & Luot) => { if (!huy) { setLichSu(b.lich_su); setLuot({ con_lai: b.con_lai, lam_moi: b.lam_moi }); } })
      .catch(() => { if (!huy) setLoi('Chưa tải được lịch sử hỏi đáp. Bạn thử lại sau ít phút nhé.'); });
    return () => { huy = true; };
  }, [laSoId, thanhVien]);

  if (!thanhVien) return <HoiKhoa />;

  const hetLuot = luot !== null && luot.con_lai === 0;
  async function gui(noiDung: string) {
    const c = noiDung.trim();
    if (!c || dang || hetLuot) return;
    setDang(true); setLoi(null); setMoi(null);
    try {
      const r = await fetch('/api/hoi-dap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ laSoId, cau: c }) });
      const b = await r.json().catch(() => ({}));
      if (!r.ok) {
        setLoi((b as { thongDiep?: string }).thongDiep || 'Có lỗi, vui lòng thử lại.');
        if ((b as { loi?: string }).loi === 'het_luot') setLuot((l) => ({ con_lai: 0, lam_moi: l?.lam_moi ?? '' }));
        return;
      }
      const kq = b as { ket_qua: string; tra_loi: TraLoi } & Luot;
      setLuot({ con_lai: kq.con_lai, lam_moi: kq.lam_moi });
      setMoi({ cau: c, tra: kq.tra_loi });
      if (kq.ket_qua === 'tra_loi') {
        setCau('');
        setLichSu((ds) => [{ id: Date.now(), luc: Date.now(), cau: c, tra_loi: kq.tra_loi }, ...ds]);
      }
      setTimeout(() => khungRef.current?.focus(), 0);
    } catch { setLoi('Chưa gửi được câu hỏi. Lượt hỏi của bạn không bị trừ, bạn thử lại nhé.'); } finally { setDang(false); }
  }

  return (
    <section className="hoi-la-so" aria-labelledby="hoi-tieu-de">
      <h2 id="hoi-tieu-de">Hỏi về lá số của bạn</h2>
      <p className="hoi-luot" role="status">
        {luot ? <>Còn {luot.con_lai}/{TONG} câu tháng này{luot.lam_moi ? `, làm mới ngày ${luot.lam_moi}` : ''}.</> : 'Đang tải…'}
      </p>
      <form onSubmit={(e) => { e.preventDefault(); void gui(cau); }}>
        <label htmlFor="hoi-cau" className="hoi-phu">Câu hỏi về chính lá số này (tối đa 200 ký tự)</label>
        <textarea id="hoi-cau" rows={3} maxLength={200} value={cau} disabled={dang || hetLuot} onChange={(e) => setCau(e.target.value)}
          placeholder={hetLuot ? 'Bạn đã dùng hết lượt tháng này' : 'Ví dụ: Tôi hợp làm công việc nào?'} />
        <div className="hoi-goi-y" aria-label="Câu gợi ý">
          {GOI_Y.map((g) => <button key={g} type="button" className="nut-phu" disabled={dang || hetLuot} onClick={() => setCau(g)}>{g}</button>)}
        </div>
        <button type="submit" className="nut-chinh" disabled={dang || hetLuot || !cau.trim()}>{dang ? 'Đang soạn câu trả lời…' : 'Gửi câu hỏi'}</button>
      </form>
      {loi && <p role="alert" className="hoi-loi">{loi}</p>}
      <div ref={khungRef} tabIndex={-1} aria-live="polite">
        {moi && <div className="hoi-muc"><p className="hoi-cau">Bạn hỏi: {moi.cau}</p><KhungTraLoi t={moi.tra} /></div>}
      </div>
      {lichSu.length > 0 && (
        <div className="hoi-lich-su">
          <h3>Các câu đã hỏi</h3>
          {lichSu.filter((m) => !moi || m.tra_loi !== moi.tra).map((m) => (
            <details key={m.id}><summary>{m.cau}</summary><KhungTraLoi t={m.tra_loi} /></details>
          ))}
          <p className="hoi-phu">Xem lại câu đã hỏi không tốn lượt.</p>
        </div>
      )}
    </section>
  );
}
