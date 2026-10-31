'use client';

import { useRef, useState } from 'react';
import { guiSuKien, luuNamGoiY } from '@/lib/phien';
import {
  CAU_TRUONG_PHAI, CTA_LA_SO, CTA_VAN_2027, GHI_CHU_BE, GHI_CHU_BO_QUA_NGAY, GHI_CHU_RIENG_TU, LOI_MUC, NAM_MAX, NAM_MIN,
  canChiDaDung, danhGia, dongNguoi, kiemNhap, type MotNguoi, type Muc, type NhapNguoi,
} from '@/lib/sinh-con-2027';

type Vai = 'bố' | 'mẹ';
interface LoiO { msg: string; truong: 'nam' | 'ngay' }
interface Nhap { nam: string; coNgay: boolean; thang: string; ngay: string }
const TRONG: Nhap = { nam: '', coNgay: false, thang: '1', ngay: '' };

/** Lỗi của một người: `truong` là ô cần đưa khách tới (năm, hoặc ngày khi năm đã đúng). */
function loiO(n: Nhap, nhap: NhapNguoi, vai: Vai): LoiO | undefined {
  if (n.nam.trim() === '') return { msg: `Hãy nhập năm sinh của ${vai}.`, truong: 'nam' };
  const m = kiemNhap(nhap);
  if (!m) return undefined;
  const namDung = kiemNhap({ nam: nhap.nam }) === null;
  return { msg: m, truong: namDung && n.coNgay ? 'ngay' : 'nam' };
}

/** Đổi ô nhập thành số liệu; null nếu năm trống/sai. `boQua` = khách bật hỏi ngày tháng nhưng để trống. */
function doc(n: Nhap): { nhap: NhapNguoi; boQua: boolean; coNgay: boolean } {
  const nam = Number(n.nam.trim());
  const coNgay = n.coNgay && n.ngay.trim() !== '';
  return { nhap: coNgay ? { nam, thang: Number(n.thang), ngay: Number(n.ngay.trim()) } : { nam }, boQua: n.coNgay && !coNgay, coNgay };
}

function OTuoi({ vai, id, v, doi, loi }: { vai: Vai; id: string; v: Nhap; doi: (x: Nhap) => void; loi?: LoiO }) {
  const ten = vai === 'bố' ? 'Bố' : 'Mẹ';
  return (
    <fieldset className="o">
      <legend>{ten}</legend>
      <label htmlFor={`${id}-nam`}>Năm sinh dương lịch</label>
      <input id={`${id}-nam`} inputMode="numeric" maxLength={4} autoComplete="off" placeholder={`${NAM_MIN}–${NAM_MAX}`}
        value={v.nam} onChange={(e) => doi({ ...v, nam: e.target.value.replace(/\D/g, '') })}
        aria-invalid={loi?.truong === 'nam' ? true : undefined} aria-describedby={loi?.truong === 'nam' ? `${id}-loi` : undefined} />
      {loi?.truong === 'nam' && <p className="bao-loi" id={`${id}-loi`} role="alert">{loi.msg}</p>}
      <label className="nhuan">
        <input type="checkbox" checked={v.coNgay} onChange={(e) => doi({ ...v, coNgay: e.target.checked })} />
        <span>{ten} sinh vào tháng 1 hoặc tháng 2 dương lịch</span>
      </label>
      {v.coNgay && (
        <div className="hai-o">
          <div className="o">
            <label htmlFor={`${id}-thang`}>Tháng</label>
            <select id={`${id}-thang`} value={v.thang} onChange={(e) => doi({ ...v, thang: e.target.value })}>
              <option value="1">Tháng 1</option>
              <option value="2">Tháng 2</option>
            </select>
          </div>
          <div className="o">
            <label htmlFor={`${id}-ngay`}>Ngày</label>
            <input id={`${id}-ngay`} inputMode="numeric" maxLength={2} autoComplete="off" value={v.ngay}
              aria-invalid={loi?.truong === 'ngay' ? true : undefined} aria-describedby={loi?.truong === 'ngay' ? `${id}-loi` : undefined}
              onChange={(e) => doi({ ...v, ngay: e.target.value.replace(/\D/g, '') })} />
          </div>
        </div>
      )}
      {loi?.truong === 'ngay' && <p className="bao-loi" id={`${id}-loi`} role="alert">{loi.msg}</p>}
    </fieldset>
  );
}

function DongNguoi({ vai, n }: { vai: Vai; n: MotNguoi }) {
  return (
    <li>
      <strong>{vai === 'bố' ? 'Bố' : 'Mẹ'}</strong> · {canChiDaDung(n)} · {dongNguoi(n, vai)}
    </li>
  );
}

/** Công cụ miễn phí "Sinh con 2027 hợp bố mẹ". Tính hoàn toàn trên trình duyệt; sự kiện chỉ mang mức và có/không nhập ngày tháng, không có năm sinh. */
export default function SinhCon2027() {
  const [bo, setBo] = useState<Nhap>(TRONG);
  const [me, setMe] = useState<Nhap>(TRONG);
  const [loi, setLoi] = useState<{ bo?: LoiO; me?: LoiO }>({});
  const [kq, setKq] = useState<{ muc: Muc; bo: MotNguoi; me: MotNguoi; boQua: boolean; namBo: number; namMe: number } | null>(null);
  const ketQuaRef = useRef<HTMLElement>(null);
  const daGhi = useRef(new Set<string>()); // bộ dữ liệu đã ghi sự kiện: bấm lại không ghi thêm

  function tinh(e: React.FormEvent) {
    e.preventDefault();
    const b = doc(bo), m = doc(me);
    const lb = loiO(bo, b.nhap, 'bố'), lm = loiO(me, m.nhap, 'mẹ');
    setLoi({ bo: lb, me: lm });
    const sai = lb ? { id: 'sc-bo', l: lb } : lm ? { id: 'sc-me', l: lm } : null;
    if (sai) { // đưa khách tới đúng ô sai (focus tự cuộn tới ô)
      setKq(null);
      setTimeout(() => document.getElementById(`${sai.id}-${sai.l.truong}`)?.focus(), 0);
      return;
    }
    const r = danhGia(b.nhap, m.nhap);
    setKq({ muc: r.muc, bo: r.bo, me: r.me, boQua: b.boQua || m.boQua, namBo: b.nhap.nam, namMe: m.nhap.nam });
    const khoa = JSON.stringify([b.nhap, m.nhap]);
    if (!daGhi.current.has(khoa)) {
      daGhi.current.add(khoa);
      guiSuKien('xem_ket_qua', { truong: { muc: r.muc } });
      guiSuKien('co_nhap_ngay_thang', { truong: { co: b.coNgay || m.coNgay } });
    }
    setTimeout(() => ketQuaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  }

  return (
    <>
      <p className="sc-luu-y">{GHI_CHU_BE}</p>
      <form className="phieu" onSubmit={tinh} noValidate>
        <OTuoi vai="bố" id="sc-bo" v={bo} doi={setBo} loi={loi.bo} />
        <OTuoi vai="mẹ" id="sc-me" v={me} doi={setMe} loi={loi.me} />
        <p className="ghi-chu-rieng-tu">{GHI_CHU_RIENG_TU}</p>
        <button type="submit" className="nut-chinh">Xem kết quả</button>
      </form>
      {kq && (
        <section ref={ketQuaRef} className="phieu sc-ket-qua" aria-live="polite" aria-labelledby="sc-muc">
          <h2 id="sc-muc" className={`sc-huy-hieu sc-${kq.muc}`}><span aria-hidden="true" className="sc-bieu-tuong" />{LOI_MUC[kq.muc].tieuDe}</h2>
          <p>{LOI_MUC[kq.muc].loi}</p>
          <ul className="sc-dong">
            <DongNguoi vai="bố" n={kq.bo} />
            <DongNguoi vai="mẹ" n={kq.me} />
          </ul>
          {kq.boQua && <p className="tt-ghi-chu">{GHI_CHU_BO_QUA_NGAY}</p>}
          <p className="tt-ghi-chu">{CAU_TRUONG_PHAI}</p>
          <div className="sc-cta">
            <p>{CTA_LA_SO.dan}</p>
            <div className="sc-cta-nut">
              <a href="/" className="nut-chinh nut-lien-ket" onClick={() => { luuNamGoiY(kq.namBo); guiSuKien('bam_sang_la_so'); }}>{CTA_LA_SO.nut} cho bố</a>
              <a href="/" className="nut-chinh nut-lien-ket" onClick={() => { luuNamGoiY(kq.namMe); guiSuKien('bam_sang_la_so'); }}>{CTA_LA_SO.nut} cho mẹ</a>
            </div>
            <p>{CTA_VAN_2027.dan}</p>
            <a href="/van-nam-2027" className="nut-phu nut-lien-ket">{CTA_VAN_2027.nut}</a>
          </div>
        </section>
      )}
    </>
  );
}
