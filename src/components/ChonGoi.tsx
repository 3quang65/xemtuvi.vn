'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useState } from 'react';
import type { LaSo } from '@/lib/tuvi';
import { DOAN_MAU, doanMauCuaLaSo, tachDoanMau } from '@/lib/luan-giai';
import { CHU_DE, chuDanVanNam, CONG_BO_GIA, DIEU_KIEN_XEM_LAI, GHI_CHU_AI, HOAN_TIEN, PHUONG_PHAP, type Goi, type MaChuDe } from '@/lib/goi';
import { docYDinh, guiSuKien } from '@/lib/phien';
import { useGia } from '@/lib/useGia';
import { useLaSoDaLuu } from '@/lib/useLaSoDaLuu';
import { KhungMoiMo } from './KhungMoi';
import { ThanGoi } from './ThanGoi';

/** Đoạn mẫu lấy từ chính lá số của khách: câu đầu đọc được, phần sau làm mờ. Không có quy tắc khớp thì dùng ví dụ minh họa. */
function DoanKhoa({ laSo }: { laSo: LaSo }) {
  const mau = useMemo(() => doanMauCuaLaSo(laSo), [laSo]);
  const { ro, mo } = tachDoanMau(mau ? mau.cau : DOAN_MAU.cau);
  return (
    <div className="doan-khoa">
      <h2>Một đoạn trong luận giải {mau ? 'lá số của bạn' : 'chuyên sâu'}</h2>
      {mau ? (
        <p className="tt-ghi-chu">Cung {mau.cung} của bạn ở {mau.tenChi}, có {mau.chinhTinh.join(', ')}.</p>
      ) : (
        <p className="tt-ghi-chu">Ví dụ minh họa với sao Thái Âm tại Mệnh, không phải lá số của bạn.</p>
      )}
      <p className="doan-ro">{mau ? ro : `Thái Âm sáng tại Mệnh: ${ro}`}</p>
      <p className="doan-mo" aria-hidden="true">{mo}</p>
      <p className="doan-nguon">Quy tắc {mau ? mau.ma : DOAN_MAU.ma} · Nguồn: {(mau ? mau.nguon : DOAN_MAU.nguon).join(', ')}</p>
      <p className="khoa-nhan">Phần còn lại và 11 cung khác mở khi bạn chọn một gói bên dưới.</p>
    </div>
  );
}

/** Nhãn phương pháp và nguồn: khách biết bản luận theo trường phái nào trước khi trả tiền. */
function PhuongPhap() {
  return (
    <details className="phuong-phap" open>
      <summary>Luận theo trường phái nào, dựa vào sách gì</summary>
      <ul>{PHUONG_PHAP.map((p) => <li key={p}>{p}</li>)}</ul>
    </details>
  );
}

function TheGoi({ g, onChon }: { g: Goi; onChon: (g: Goi, chuDe?: MaChuDe) => void }) {
  const [chuDe, setChuDe] = useState<MaChuDe | null>(null);
  const ten = useId();
  const canChuDe = g.ma === 'mot-chu-de';
  return (
    <li className={`the-goi ${g.chinh ? 'noi-bat' : ''}`}>
      <ThanGoi g={g} />
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
  const gia = useGia();
  const [uuTienVanNam, setUuTien] = useState(false);
  useEffect(() => { setUuTien(docYDinh() === 'van-nam-2027'); }, []);
  if (!laSo || !gia.san) return <p className="dang-tai" role="status">Đang tải…</p>;

  const chonGoi = (x: Goi, chuDe?: MaChuDe) => {
    guiSuKien('chon_goi', { goi: x.ma, chuDe });
    router.push(`/thanh-toan?goi=${x.ma}${chuDe ? `&chuDe=${chuDe}` : ''}`);
  };
  return (
    <section className="trang-buoc">
      <h1>Chọn gói luận giải</h1>
      <p className="tt-ghi-chu">Luận giải chuyên sâu cho lá số bạn vừa lập. Bản thử: chưa thu tiền thật.</p>
      <KhungMoiMo />
      <DoanKhoa laSo={laSo} />
      <PhuongPhap />
      <div className="khu-chon-goi">
        {gia.vanNam.length > 0 && (
          <section className="khu-van-nam" id="van-nam-2027" aria-labelledby="tieu-de-van-nam" style={uuTienVanNam ? { order: -1 } : undefined}>
            <h2 id="tieu-de-van-nam">Vận năm 2027 (Đinh Mùi)</h2>
            <p className="tt-ghi-chu">{chuDanVanNam(gia.vanNam)}</p>
            <ul className="luoi-goi">{gia.vanNam.map((g) => <TheGoi key={g.ma} g={g} onChon={chonGoi} />)}</ul>
          </section>
        )}
        <ul className="luoi-goi">{gia.goi.map((g) => <TheGoi key={g.ma} g={g} onChon={chonGoi} />)}</ul>
      </div>
      <p className="tt-ghi-chu">{DIEU_KIEN_XEM_LAI}</p>
      <p className="tt-ghi-chu">{GHI_CHU_AI}</p>
      {CONG_BO_GIA && <p className="cam-ket">{HOAN_TIEN}</p>}
      <p className="tt-ghi-chu"><a href="/tro-giup">Trợ giúp</a></p>
    </section>
  );
}
