'use client';

import { useState } from 'react';
import type { Cung, LaSo, Sao } from '@/lib/tuvi';

// Vị trí 12 cung trên bàn 4×4 truyền thống (hàng, cột), theo chỉ số chi: 0 = Tý … 11 = Hợi
const VI_TRI: Record<number, [number, number]> = {
  5: [1, 1], 6: [1, 2], 7: [1, 3], 8: [1, 4],
  4: [2, 1], 9: [2, 4],
  3: [3, 1], 10: [3, 4],
  2: [4, 1], 1: [4, 2], 0: [4, 3], 11: [4, 4],
};

const HOA_NGAN: Record<string, string> = { 'Hóa Lộc': 'Lộc', 'Hóa Quyền': 'Quyền', 'Hóa Khoa': 'Khoa', 'Hóa Kỵ': 'Kỵ' };

function TenSao({ s }: { s: Sao }) {
  return (
    <span className={`sao hanh-${s.hanh} ${s.dacTinh === 'H' ? 'ham' : ''}`}>
      {s.ten}
      {s.dacTinh && <sup title={s.dacTinhTen ?? undefined}>{s.dacTinh}</sup>}
      {s.hoa && <b className="hoa">{HOA_NGAN[s.hoa] ?? s.hoa}</b>}
    </span>
  );
}

function ONhoCung({ c, chon, dangVan, onChon }: { c: Cung; chon: boolean; dangVan: boolean; onChon: () => void }) {
  const [hang, cot] = VI_TRI[c.chi];
  return (
    <button
      type="button"
      className={`o-cung ${c.ten === 'Mệnh' ? 'la-menh' : ''} ${chon ? 'dang-chon' : ''}`}
      style={{ gridRow: hang, gridColumn: cot }}
      onClick={onChon}
      aria-pressed={chon}
      aria-label={`Cung ${c.ten} tại ${c.tenChi}`}
    >
      <span className="cung-dau">
        <strong>{c.ten}{c.laThan && <i className="than"> · Thân</i>}</strong>
        <span className="can-chi">{c.can} {c.tenChi}</span>
      </span>
      <span className="chinh-tinh">
        {c.chinhTinh.length ? c.chinhTinh.map((s) => <TenSao key={s.key} s={s} />) : <span className="vo-chinh">Vô chính diệu</span>}
      </span>
      <span className="phu-tinh">
        {c.phuTinh.map((s) => <TenSao key={s.key} s={s} />)}
      </span>
      <span className="cung-chan">
        <span className={dangVan ? 'van-nay' : ''}>{c.daiVan}</span>
        <span>{c.trangSinh}</span>
        {(c.tuan || c.triet) && <span className="tuan-triet">{[c.tuan && 'Tuần', c.triet && 'Triệt'].filter(Boolean).join(' ')}</span>}
      </span>
    </button>
  );
}

function ChiTietCung({ c }: { c: Cung }) {
  const nhom = (tieuDe: string, ds: Sao[]) =>
    ds.length > 0 && (
      <div className="nhom-sao">
        <h4>{tieuDe}</h4>
        <p>{ds.map((s) => <TenSao key={s.key} s={s} />)}</p>
      </div>
    );
  return (
    <div className="chi-tiet" aria-live="polite">
      <h3>
        Cung {c.ten} <span>{c.can} {c.tenChi} · hành {c.hanhCung}{c.laThan ? ' · có Thân' : ''}</span>
      </h3>
      {c.chinhTinh.length ? nhom('Chính tinh', c.chinhTinh) : <p className="vo-chinh">Cung vô chính diệu: khi luận sẽ mượn chính tinh cung đối diện.</p>}
      {nhom('Cát tinh', c.catTinh)}
      {nhom('Sát tinh, hung tinh', c.hungTinh)}
      <p className="phu-chu">
        Đại vận {c.daiVan} tuổi · vòng Tràng Sinh: {c.trangSinh} · tiểu hạn năm {c.tieuHan}
        {c.tuan && ' · bị Tuần'}{c.triet && ' · bị Triệt'}
      </p>
    </div>
  );
}

export default function LaSoBan({ laSo, namXem }: { laSo: LaSo; namXem: number }) {
  const cungMenh = laSo.cung.find((c) => c.ten === 'Mệnh')!;
  const [chon, setChon] = useState<number>(cungMenh.chi);
  const tuoiMu = namXem - laSo.am.nam + 1;
  const vanNay = laSo.cung.find((c) => tuoiMu >= c.daiVanTu && tuoiMu <= c.daiVanTu + 9);

  const d = laSo.duong, a = laSo.am;
  return (
    <section className="ket-qua" aria-label="Lá số tử vi">
      <div className="ban">
        {laSo.cung.map((c) => (
          <ONhoCung key={c.chi} c={c} chon={chon === c.chi} dangVan={vanNay?.chi === c.chi} onChon={() => setChon(c.chi)} />
        ))}
        <div className="thien-ban">
          {laSo.ten && <p className="ten-duong-so">{laSo.ten}</p>}
          <dl>
            <dt>Dương lịch</dt><dd>{d.ngay}/{d.thang}/{d.nam}, giờ {laSo.gio.chi}</dd>
            <dt>Âm lịch</dt><dd>{a.ngay}/{a.thang}{a.nhuan ? ' nhuận' : ''} năm {laSo.canChi.nam}</dd>
            <dt>Tứ trụ</dt><dd>{laSo.canChi.nam}, {laSo.canChi.thang}, {laSo.canChi.ngay}, {laSo.canChi.gio}</dd>
            <dt>Âm dương</dt><dd>{laSo.amDuong} · {laSo.amDuongLy}</dd>
            <dt>Bản mệnh</dt><dd>{laSo.banMenh}</dd>
            <dt>Cục</dt><dd>{laSo.cuc} · {laSo.sinhKhac}</dd>
            <dt>Mệnh chủ</dt><dd>{laSo.menhChu}</dd>
            <dt>Thân chủ</dt><dd>{laSo.thanChu}</dd>
          </dl>
        </div>
      </div>

      <ChiTietCung c={laSo.cung[chon]} />

      <p className="chu-giai">
        Độ sáng: M Miếu · V Vượng · Đ Đắc · B Bình hòa · H Hãm. Lộc, Quyền, Khoa, Kỵ là tứ hóa theo can năm sinh.
        {vanNay && ` Đại vận đang đi (${namXem}, ${tuoiMu} tuổi mụ) được tô đậm.`}
      </p>
    </section>
  );
}
