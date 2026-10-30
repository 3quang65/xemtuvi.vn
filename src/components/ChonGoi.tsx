'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DOAN_MAU } from '@/lib/luan-giai';
import { dinhDangGia, GOI, type Goi } from '@/lib/goi';
import { guiSuKien } from '@/lib/phien';
import { useLaSoDaLuu } from '@/lib/useLaSoDaLuu';

/** Đoạn mẫu: câu đầu đọc được, phần sau bị làm mờ (trạng thái khóa). */
function DoanKhoa() {
  const cau = DOAN_MAU.cau;
  const cat = cau.indexOf(': ') + 2; // hiện phần mô tả độ sáng, mờ phần luận
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

function TheGoi({ g, onChon }: { g: Goi; onChon: (g: Goi) => void }) {
  return (
    <li className={`the-goi ${g.chinh ? 'noi-bat' : ''}`}>
      {g.chinh && <span className="nhan-chinh">Gói chính</span>}
      <h3>{g.ten}</h3>
      <p className="gia"><strong>{dinhDangGia(g.gia)}</strong> <span>/ {g.donVi}</span></p>
      <ul className="quyen-loi">{g.quyenLoi.map((q) => <li key={q}>{q}</li>)}</ul>
      <button type="button" className={g.chinh ? 'nut-chinh' : 'nut-phu'} onClick={() => onChon(g)}>
        Chọn gói này
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
          <TheGoi key={g.ma} g={g} onChon={(x) => { guiSuKien('chon_goi'); router.push(`/thanh-toan?goi=${x.ma}`); }} />
        ))}
      </ul>
    </section>
  );
}
