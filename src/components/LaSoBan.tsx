'use client';

import { useMemo, useState } from 'react';
import { luuNien, moTaQuyUoc, type Cung, type LaSo, type LuuNien, type QuyUoc, type Sao } from '@/lib/tuvi';
import TuyChonTruongPhai from './TuyChonTruongPhai';

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

/** Sao lưu và lưu tứ hóa rơi vào cung chi */
function saoLuuTai(ln: LuuNien, chi: number): string[] {
  return ln.saoLuu.filter((s) => s.chi === chi).map((s) => s.ten)
    .concat(ln.luuTuHoa.filter((h) => h.chi === chi).map((h) => `L. ${h.hoa} (${h.sao})`));
}

function ONhoCung({ c, chon, dangVan, ln, onChon }: { c: Cung; chon: boolean; dangVan: boolean; ln: LuuNien; onChon: () => void }) {
  const luu = saoLuuTai(ln, c.chi);
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
      {luu.length > 0 && <span className="sao-luu">{luu.map((t) => <span key={t}>{t}</span>)}</span>}
      <span className="cung-chan">
        <span className={dangVan ? 'van-nay' : ''}>{c.daiVan}</span>
        <span>{c.trangSinh}</span>
        {ln.tieuHan === c.chi && <span className="tieu-han">Tiểu hạn {ln.namXem}</span>}
        {(c.tuan || c.triet) && <span className="tuan-triet">{[c.tuan && 'Tuần', c.triet && 'Triệt'].filter(Boolean).join(' ')}</span>}
      </span>
    </button>
  );
}

function ChiTietCung({ c, ln }: { c: Cung; ln: LuuNien }) {
  const luu = saoLuuTai(ln, c.chi);
  const thang = ln.luuNguyet.map((chi, i) => (chi === c.chi ? i + 1 : 0)).filter(Boolean);
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
      {luu.length > 0 && (
        <div className="nhom-sao">
          <h4>Sao lưu năm {ln.canChi} ({ln.namXem})</h4>
          <p className="sao-luu-chi-tiet">{luu.join(' · ')}</p>
        </div>
      )}
      <p className="phu-chu">
        Lưu nguyệt năm {ln.namXem}: tháng {thang.join(', ')} âm lịch ·{' '}
        Đại vận {c.daiVan} tuổi · vòng Tràng Sinh: {c.trangSinh} · tiểu hạn năm {c.tieuHan}
        {c.tuan && ' · bị Tuần'}{c.triet && ' · bị Triệt'}
      </p>
    </div>
  );
}

/** Nút "xem theo cách khác" cho 3 trường hợp hay lệch với trang khác: giờ Tý muộn, trước 1968, miền Nam trước 1975. Giữ ngày giờ khách nhập. */
function CachKhac({ laSo, coMienNam, onDoiQuyUoc, onDoiMienNam }: { laSo: LaSo; coMienNam: boolean; onDoiQuyUoc: (p: Partial<QuyUoc>) => void; onDoiMienNam: (b: boolean) => void }) {
  const q = laSo.quyUoc;
  const nut: { id: string; chu: string; bam: () => void }[] = [];
  if (laSo.gioChuan.gio.startsWith('23:')) {
    nut.push(q.gioTyMuon === 'ngaySau'
      ? { id: 'ty-muon', chu: 'Xem theo cách giữ nguyên ngày sinh (không tính sang ngày hôm sau)', bam: () => onDoiQuyUoc({ gioTyMuon: 'giuNgay' }) }
      : { id: 'ty-muon', chu: 'Quay lại cách mặc định: tính sang ngày hôm sau', bam: () => onDoiQuyUoc({ gioTyMuon: 'ngaySau' }) });
  }
  if (laSo.duong.nam < 1968) {
    nut.push(q.muiGioLich === 'lichSu'
      ? { id: 'truoc-1968', chu: 'Xem theo lịch UTC+7 như hiện nay (cách nhiều trang khác dùng)', bam: () => onDoiQuyUoc({ muiGioLich: 'utc7' }) }
      : { id: 'truoc-1968', chu: 'Quay lại cách mặc định: lịch thời đó (UTC+8)', bam: () => onDoiQuyUoc({ muiGioLich: 'lichSu' }) });
  }
  if (coMienNam) {
    nut.push(laSo.gioChuan.daQuyDoi
      ? { id: 'mien-nam', chu: 'Xem theo giờ đồng hồ như đã nhập (không quy đổi về giờ chuẩn)', bam: () => onDoiMienNam(false) }
      : { id: 'mien-nam', chu: 'Quay lại cách mặc định: quy giờ miền Nam về giờ chuẩn', bam: () => onDoiMienNam(true) });
  }
  if (nut.length === 0) return null;
  return (
    <div className="cach-khac">
      {nut.map((n) => <button key={n.id} type="button" className="nut-phu" data-cach-khac={n.id} onClick={n.bam}>{n.chu}</button>)}
    </div>
  );
}

export default function LaSoBan({ laSo, namHienTai, onDoiQuyUoc, onDoiMienNam }: { laSo: LaSo; namHienTai: number; onDoiQuyUoc: (p: Partial<QuyUoc>) => void; onDoiMienNam: (b: boolean) => void }) {
  const [coMienNam] = useState(laSo.gioChuan.daQuyDoi);
  const cungMenh = laSo.cung.find((c) => c.ten === 'Mệnh')!;
  const [chon, setChon] = useState<number>(cungMenh.chi);
  const [namXem, setNamXem] = useState(Math.max(namHienTai, laSo.am.nam));
  const ln = useMemo(() => luuNien(laSo, namXem), [laSo, namXem]);
  const tuoiMu = ln.tuoiMu;
  const vanNay = ln.daiVan == null ? undefined : laSo.cung[ln.daiVan];

  const d = laSo.duong, a = laSo.am;
  const quyUoc = moTaQuyUoc(laSo);
  if (coMienNam && !laSo.gioChuan.daQuyDoi) quyUoc.push('Giờ khai sinh miền Nam giữ nguyên theo đồng hồ đã nhập, không quy về giờ chuẩn (theo lựa chọn của bạn).');
  return (
    <section className="ket-qua" aria-label="Lá số tử vi">
      <div className="ban">
        {laSo.cung.map((c) => (
          <ONhoCung key={c.chi} c={c} chon={chon === c.chi} dangVan={vanNay?.chi === c.chi} ln={ln} onChon={() => setChon(c.chi)} />
        ))}
        <div className="thien-ban">
          {laSo.ten && <p className="ten-duong-so">{laSo.ten}</p>}
          <dl>
            <dt>Dương lịch</dt><dd>{d.ngay}/{d.thang}/{d.nam}, {laSo.gio.dongHo} (giờ {laSo.gio.chi})</dd>
            <dt>Âm lịch</dt><dd>{a.ngay}/{a.thang}{a.nhuan ? ' nhuận' : ''} năm {laSo.canChi.nam}</dd>
            <dt>Tứ trụ</dt><dd>{laSo.canChi.nam}, {laSo.canChi.thang}, {laSo.canChi.ngay}, {laSo.canChi.gio}</dd>
            <dt>Âm dương</dt><dd>{laSo.amDuong} · {laSo.amDuongLy}</dd>
            <dt>Bản mệnh</dt><dd>{laSo.banMenh}</dd>
            <dt>Cục</dt><dd>{laSo.cuc} · {laSo.sinhKhac}</dd>
            <dt>Mệnh chủ</dt><dd>{laSo.menhChu}</dd>
            <dt>Thân chủ</dt><dd>{laSo.thanChu}</dd>
          </dl>
          <div className="nam-xem" aria-label="Năm xem vận hạn">
            <button type="button" onClick={() => setNamXem((n) => n - 1)} disabled={namXem <= laSo.am.nam} aria-label="Năm trước">‹</button>
            <span>Vận năm {ln.canChi} {namXem} · {tuoiMu} tuổi</span>
            <button type="button" onClick={() => setNamXem((n) => n + 1)} disabled={namXem >= laSo.am.nam + 119} aria-label="Năm sau">›</button>
          </div>
        </div>
      </div>

      <ChiTietCung c={laSo.cung[chon]} ln={ln} />

      <p className="chu-giai">
        Độ sáng: M Miếu · V Vượng · Đ Đắc · B Bình hòa · H Hãm, theo bảng của phái Việt (dòng sách cụ Thiên Lương); vài ô có thể khác bảng của sách hoặc trang khác. Lộc, Quyền, Khoa, Kỵ là tứ hóa theo can năm sinh.
        Sao ghi &quot;L.&quot; là sao lưu và lưu tứ hóa của năm {ln.canChi} ({namXem}), an theo can chi năm xem.
        {vanNay && ` Đại vận đang đi (${namXem}, ${tuoiMu} tuổi mụ) được tô đậm.`}
      </p>
      {quyUoc.length > 0 && <p className="chu-giai">Lá số lập theo: {quyUoc.join(' ')}</p>}
      <CachKhac laSo={laSo} coMienNam={coMienNam} onDoiQuyUoc={onDoiQuyUoc} onDoiMienNam={onDoiMienNam} />
      <TuyChonTruongPhai quyUoc={laSo.quyUoc} onDoi={onDoiQuyUoc} />
    </section>
  );
}
