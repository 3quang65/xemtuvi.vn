'use client';

import { useEffect, useRef, useState } from 'react';
import { canhGio, kiemTraThongTin, lapLaSo, namAmHienTai, type LaSo, type QuyUoc, type ThongTinSinh } from '@/lib/tuvi';
import LaSoBan from './LaSoBan';
import TomTatMienPhi from './TomTatMienPhi';
import LienHe from './LienHe';
import { docThongTinSinh, ghiNguon, guiSuKien, luuThongTinSinh } from '@/lib/phien';


type FormState = {
  ten: string;
  gioiTinh: '' | 'nam' | 'nu';
  lich: 'duong' | 'am';
  ngay: string;
  thang: string;
  nam: string;
  gio: string; // giờ đồng hồ 0–23
  phut: string;
  giuNgayTyMuon: boolean; // sinh 23h: giữ ngày cũ thay vì sang ngày hôm sau
  mienNam: boolean; // nơi sinh miền Nam trước 1975 (đồng hồ UTC+8)
  nhuan: boolean;
};

const GIO = Array.from({ length: 24 }, (_, i) => i);

export default function LapLaSo() {
  const [f, setF] = useState<FormState>({
    ten: '', gioiTinh: '', lich: 'duong', ngay: '', thang: '', nam: '', gio: '', phut: '', giuNgayTyMuon: false, mienNam: false, nhuan: false,
  });
  const [loi, setLoi] = useState<string | null>(null);
  const [laSo, setLaSo] = useState<LaSo | null>(null);
  const [tt, setTt] = useState<ThongTinSinh | null>(null);
  const ketQuaRef = useRef<HTMLDivElement>(null);

  // Quay lại từ các bước sau: dựng lại lá số từ thông tin đã nhớ tạm trong tab này
  useEffect(() => {
    ghiNguon();
    const daLuu = docThongTinSinh();
    if (daLuu) {
      try { setLaSo(lapLaSo(daLuu)); setTt(daLuu); return; } catch { /* thông tin hỏng: coi như chưa có */ }
    }
    guiSuKien('vao_form');
  }, []);

  const namSo = Number(f.nam);
  const hienMienNam = namSo >= 1959 && namSo <= 1975;
  // Giờ chuẩn có thể rơi vào 23h khi khai sinh 0h ở miền Nam (lùi 1 giờ)
  const hienTyMuon = f.gio === '23' || (hienMienNam && f.mienNam && f.gio === '0');

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
      gio: f.gio === '' ? NaN : Number(f.gio),
      phut: f.phut === '' ? 0 : Number(f.phut),
      nhuan: f.lich === 'am' && f.nhuan,
      mienNamTruoc1975: hienMienNam && f.mienNam,
      quyUoc: hienTyMuon && f.giuNgayTyMuon ? { gioTyMuon: 'giuNgay' } : undefined,
    };
    const thongBao = kiemTraThongTin(t);
    if (thongBao) { setLoi(thongBao); return; }
    try {
      setLaSo(lapLaSo(t as ThongTinSinh));
      setTt(t as ThongTinSinh);
      luuThongTinSinh(t as ThongTinSinh);
      guiSuKien('lap_la_so');
      setLoi(null);
      requestAnimationFrame(() => ketQuaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (err) {
      setLoi(err instanceof Error ? err.message : 'Không lập được lá số với thông tin này.');
    }
  }

  function doiQuyUoc(p: Partial<QuyUoc>) {
    if (!tt) return;
    const moi: ThongTinSinh = { ...tt, quyUoc: { ...tt.quyUoc, ...p } };
    try {
      setLaSo(lapLaSo(moi));
      setTt(moi);
      luuThongTinSinh(moi);
    } catch { /* giữ lá số hiện tại */ }
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
            Thông tin sinh chỉ được tính ngay trên máy của bạn, không gửi lên máy chủ; trình duyệt chỉ nhớ tạm trong tab này và mất khi bạn đóng tab.
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

          <fieldset className="o">
            <legend>Giờ sinh <em>(theo giấy khai sinh)</em></legend>
            <div className="hai-o">
              <select aria-label="Giờ sinh" value={f.gio} onChange={(e) => doi('gio', e.target.value)}>
                <option value="">Giờ</option>
                {GIO.map((g) => <option key={g} value={g}>{g} giờ · {canhGio(g)}</option>)}
              </select>
              <input inputMode="numeric" placeholder="Phút" aria-label="Phút sinh" value={f.phut}
                onChange={(e) => doi('phut', e.target.value.replace(/\D/g, '').slice(0, 2))} />
            </div>
            {hienMienNam && (
              <label className="nhuan">
                <input type="checkbox" checked={f.mienNam} onChange={(e) => doi('mienNam', e.target.checked)} />
                Nơi sinh: miền Nam trước 1975 <em>(đồng hồ khi đó nhanh hơn 1 giờ, sẽ tự quy đổi)</em>
              </label>
            )}
            {hienTyMuon && (
              <label className="nhuan">
                <input type="checkbox" checked={f.giuNgayTyMuon} onChange={(e) => doi('giuNgayTyMuon', e.target.checked)} />
                Giữ ngày sinh cũ (mặc định giờ 23h tính sang ngày hôm sau)
              </label>
            )}
          </fieldset>

          {loi && <p className="bao-loi" role="alert">{loi}</p>}

          <button type="submit" className="nut-chinh">Lập lá số</button>
        </form>
      </section>

      <div ref={ketQuaRef}>
        {laSo && (
          <>
            <LaSoBan key={JSON.stringify(laSo.duong) + laSo.gio.dongHo + laSo.gioiTinh} laSo={laSo} namHienTai={namAmHienTai()} onDoiQuyUoc={doiQuyUoc} />
            <TomTatMienPhi laSo={laSo} />
            <LienHe />
          </>
        )}
      </div>
    </>
  );
}
