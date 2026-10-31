'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useEffect, useId, useState } from 'react';
import { CHU_DE, chuDanVanNam, CONG_BO_GIA, CONG_BO_HOAN_TIEN, DIEU_KIEN_XEM_LAI, GHI_CHU_AI, HOAN_TIEN, PHUONG_PHAP, type Goi, type MaChuDe } from '@/lib/goi';
import { docThongTinSinh, docYDinh, guiSuKien } from '@/lib/phien';
import { useGia } from '@/lib/useGia';
import { KhungMoiMo } from './KhungMoi';
import { ThanGoi } from './ThanGoi';

/** Đoạn mẫu cần engine lập lá số (~60 KB JS): nạp riêng sau khi bảng gói đã hiện, giữ chỗ để không nhảy bố cục. */
const DoanKhoa = dynamic(() => import('./DoanKhoa'), { ssr: false, loading: () => <div className="doan-khoa doan-khoa-cho" aria-hidden="true" /> });

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
        disabled={g.xemThu || (canChuDe && !chuDe)}
        onClick={() => onChon(g, canChuDe ? chuDe ?? undefined : undefined)}
      >
        {g.xemThu ? 'Chưa mở bán' : canChuDe && !chuDe ? 'Chọn một chủ đề trước' : 'Chọn gói này'}
      </button>
    </li>
  );
}

export default function ChonGoi() {
  const router = useRouter();
  const [coSinh, setCoSinh] = useState(false);
  useEffect(() => {
    if (docThongTinSinh()) { setCoSinh(true); guiSuKien('vao_chon_goi'); } else router.replace('/');
  }, [router]);
  const gia = useGia(true);
  const [uuTienVanNam, setUuTien] = useState(false);
  useEffect(() => { setUuTien(docYDinh() === 'van-nam-2027'); }, []);
  if (!coSinh || !gia.san) return <p className="dang-tai" role="status">Đang tải…</p>;

  const chonGoi = (x: Goi, chuDe?: MaChuDe) => {
    guiSuKien('chon_goi', { goi: x.ma, chuDe });
    router.push(`/thanh-toan?goi=${x.ma}${chuDe ? `&chuDe=${chuDe}` : ''}`);
  };
  return (
    <>
      <KhungMoiMo />
      <DoanKhoa />
      <PhuongPhap />
      <p className="tt-ghi-chu">Luận giải dựa trên 948 quy tắc có ghi nguồn — xem <a href="/phuong-phap">Phương pháp &amp; nguồn</a>.</p>
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
      {CONG_BO_HOAN_TIEN && <p className="cam-ket">{HOAN_TIEN}</p>}
      <p className="tt-ghi-chu"><a href="/tro-giup">Trợ giúp</a></p>
    </>
  );
}
