'use client';

import { useRef, useState } from 'react';
import { GIO_SINH, kiemTraThongTin, lapLaSo, type LaSo, type ThongTinSinh } from '@/lib/tuvi';
import LaSoBan from './LaSoBan';

const NAM_HIEN_TAI = new Date().getFullYear();

type FormState = {
  ten: string;
  gioiTinh: '' | 'nam' | 'nu';
  lich: 'duong' | 'am';
  ngay: string;
  thang: string;
  nam: string;
  gioChi: string; // chỉ số canh giờ 0–11
  nhuan: boolean;
};

const GIO_DAI_DIEN = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]; // giờ đại diện cho mỗi canh

export default function LapLaSo() {
  const [f, setF] = useState<FormState>({
    ten: '', gioiTinh: '', lich: 'duong', ngay: '', thang: '', nam: '', gioChi: '', nhuan: false,
  });
  const [loi, setLoi] = useState<string | null>(null);
  const [laSo, setLaSo] = useState<LaSo | null>(null);
  const ketQuaRef = useRef<HTMLDivElement>(null);

  const doi = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((s) => ({ ...s, [k]: v }));

  function lap(e: React.FormEvent) {
    e.preventDefault();
    const t: Partial<ThongTinSinh> = {
      ten: f.ten.trim(),
      gioiTinh: f.gioiTinh || undefined,
      lich: f.lich,
      ngay: Number(f.ngay),
      thang: Number(f.thang),
      nam: Number(f.nam),
      gio: f.gioChi === '' ? NaN : GIO_DAI_DIEN[Number(f.gioChi)],
      nhuan: f.lich === 'am' && f.nhuan,
    };
    const thongBao = kiemTraThongTin(t);
    if (thongBao) { setLoi(thongBao); return; }
    try {
      setLaSo(lapLaSo(t as ThongTinSinh));
      setLoi(null);
      requestAnimationFrame(() => ketQuaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (err) {
      setLoi(err instanceof Error ? err.message : 'Không lập được lá số với thông tin này.');
    }
  }

  return (
    <>
      <section className="mo-dau">
        <div className="mo-dau-chu">
          <h1>Lập lá số tử vi</h1>
          <p>
            Nhập ngày giờ sinh để xem lá số đủ 12 cung theo cách an sao Việt Nam. Miễn phí, không cần tài khoản.
          </p>
          <p className="ghi-chu-rieng-tu">
            Thông tin sinh chỉ được tính ngay trên máy của bạn, không gửi đi và không lưu lại.
          </p>
        </div>

        <form className="phieu" onSubmit={lap} noValidate>
          <label className="o">
            <span>Họ tên <em>(không bắt buộc)</em></span>
            <input value={f.ten} onChange={(e) => doi('ten', e.target.value)} maxLength={60} autoComplete="off" />
          </label>

          <fieldset className="o">
            <legend>Giới tính</legend>
            <div className="chon-doi">
              <label><input type="radio" name="gt" checked={f.gioiTinh === 'nu'} onChange={() => doi('gioiTinh', 'nu')} /> Nữ</label>
              <label><input type="radio" name="gt" checked={f.gioiTinh === 'nam'} onChange={() => doi('gioiTinh', 'nam')} /> Nam</label>
            </div>
          </fieldset>

          <fieldset className="o">
            <legend>Ngày sinh</legend>
            <div className="chon-doi nho">
              <label><input type="radio" name="lich" checked={f.lich === 'duong'} onChange={() => doi('lich', 'duong')} /> Dương lịch</label>
              <label><input type="radio" name="lich" checked={f.lich === 'am'} onChange={() => doi('lich', 'am')} /> Âm lịch</label>
            </div>
            <div className="ba-o">
              <input inputMode="numeric" placeholder="Ngày" aria-label="Ngày sinh" value={f.ngay}
                onChange={(e) => doi('ngay', e.target.value.replace(/\D/g, '').slice(0, 2))} />
              <input inputMode="numeric" placeholder="Tháng" aria-label="Tháng sinh" value={f.thang}
                onChange={(e) => doi('thang', e.target.value.replace(/\D/g, '').slice(0, 2))} />
              <input inputMode="numeric" placeholder="Năm" aria-label="Năm sinh" value={f.nam}
                onChange={(e) => doi('nam', e.target.value.replace(/\D/g, '').slice(0, 4))} />
            </div>
            {f.lich === 'am' && (
              <label className="nhuan">
                <input type="checkbox" checked={f.nhuan} onChange={(e) => doi('nhuan', e.target.checked)} /> Tháng nhuận
              </label>
            )}
          </fieldset>

          <label className="o">
            <span>Giờ sinh</span>
            <select value={f.gioChi} onChange={(e) => doi('gioChi', e.target.value)}>
              <option value="">Chọn giờ sinh</option>
              {GIO_SINH.map((g, i) => <option key={g} value={i}>{g}</option>)}
            </select>
          </label>

          {loi && <p className="bao-loi" role="alert">{loi}</p>}

          <button type="submit" className="nut-chinh">Lập lá số</button>
        </form>
      </section>

      <div ref={ketQuaRef}>{laSo && <LaSoBan laSo={laSo} namXem={NAM_HIEN_TAI} />}</div>
    </>
  );
}
