'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { DOAN_MAU, nhanDinh } from '@/lib/luan-giai';
import { CHU_DE, dinhDangGia, GOI, type Goi, type MaChuDe } from '@/lib/goi';
import { guiSuKien } from '@/lib/phien';
import { useLaSoDaLuu } from '@/lib/useLaSoDaLuu';

/** Đoạn mẫu: câu đầu đọc được, phần sau bị làm mờ (trạng thái khóa). */
function DoanKhoa() {
  const cau = 'Thái Âm sáng tại Mệnh: ' + nhanDinh(DOAN_MAU.cau);
  const cat = cau.indexOf(',', cau.indexOf(': ')) + 1; // hiện vài chữ đầu của nhận định, mờ phần còn lại
  return (
    <div className="doan-khoa">
      <h2>Một đoạn trong luận giải chuyên sâu</h2>
      <p className="tt-ghi-chu">Ví dụ minh họa với sao Thái Âm tại Mệnh, không phải lá số của bạn.</p>
      <p className="doan-ro">{cau.slice(0, cat)}</p>
      <p className="doan-mo" aria-hidden="true">{cau.slice(cat)}</p>
      <p className="khoa-nhan">Phần còn lại mở khi bạn chọn một gói bên dưới.</p>
    </div>
  );
}

function TheGoi({ g, onChon }: { g: Goi; onChon: (g: Goi, chuDe?: MaChuDe) => void }) {
  const [chuDe, setChuDe] = useState<MaChuDe | null>(null);
  const ten = useId();
  const canChuDe = g.ma === 'mot-chu-de';
  return (
    <li className={`the-goi ${g.chinh ? 'noi-bat' : ''}`}>
      {g.nhan && <span className="nhan-chinh">{g.nhan}</span>}
      <h3>{g.ten}</h3>
      <p className="gia"><strong>{dinhDangGia(g.gia)}</strong> <span>/ {g.donVi}</span></p>
      {g.soSanh && <p className="so-sanh">{g.soSanh.join(' · ')}</p>}
      <ul className="quyen-loi">{g.quyenLoi.map((q) => <li key={q}>{q}</li>)}</ul>
      {canChuDe && (
        <fieldset className="chon-chu-de">
          <legend>Chọn chủ đề</legend>
          {CHU_DE.map((c) => (
            <label key={c.ma}>
              <input type="radio" name={ten} value={c.ma} checked={chuDe === c.ma} onChange={() => setChuDe(c.ma)} />
              <span>{c.ten}</span>
            </label>
          ))}
        </fieldset>
      )}
      <button
        type="button" className={g.chinh ? 'nut-chinh' : 'nut-phu'}
        disabled={canChuDe && !chuDe}
        onClick={() => onChon(g, canChuDe ? chuDe ?? undefined : undefined)}
      >
        {canChuDe && !chuDe ? 'Chọn một chủ đề trước' : 'Chọn gói này'}
      </button>
    </li>
  );
}

export default function ChonGoi() {
  const router = useRouter();
  const laSo = useLaSoDaLuu();
  useEffect(() => { if (laSo) guiSuKien('vao_chon_goi'); }, [laSo]);
  if (!laSo) return <p className="dang-tai" role="status">Đang tải…</p>;

  return (
    <section className="trang-buoc">
      <h1>Chọn gói luận giải</h1>
      <p className="tt-ghi-chu">Luận giải chuyên sâu cho lá số bạn vừa lập. Bản thử: chưa thu tiền thật.</p>
      <DoanKhoa />
      <ul className="luoi-goi">
        {GOI.map((g) => (
          <TheGoi key={g.ma} g={g} onChon={(x, chuDe) => {
            guiSuKien('chon_goi', { goi: x.ma, chuDe });
            router.push(`/thanh-toan?goi=${x.ma}${chuDe ? `&chuDe=${chuDe}` : ''}`);
          }} />
        ))}
      </ul>
    </section>
  );
}
