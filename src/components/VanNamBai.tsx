import type { BaiVanNam, NhanDinhNam } from '@/lib/luan-giai/ai/van-nam';

// Bài đã mua: mã quy tắc (quyTacId) không hiển thị; chỉ hiện nguồn và trường phái.
function Doan({ n }: { n: NhanDinhNam }) {
  return <p>{n.text} <small>({n.thamChieu.nguon}; {n.thamChieu.truongPhai})</small></p>;
}

export function VanNamBai({ bai }: { bai: BaiVanNam }) {
  return (
    <div className="bai-luan bai-van-nam">
      <h2>Vận năm {bai.namXem} ({bai.canChi})</h2>
      <p className="tt-ghi-chu">Từ {bai.dauBai.tuNgay} đến {bai.dauBai.denNgay} (dương lịch)</p>
      {bai.dauBai.nhanDinh.map((n, i) => <Doan key={i} n={n} />)}
      {bai.muc.map((m) => (
        <section key={m.id} id={`van-nam-${m.id}`}>
          <h3>{m.tieuDe}</h3>
          {m.nhanDinh.map((n, i) => <Doan key={i} n={n} />)}
        </section>
      ))}
      <section id="van-nam-12-thang">
        <h3>12 tháng trong năm</h3>
        <ol className="van-nam-thang">
          {bai.thang.map((t) => (
            <li key={t.thang}>
              <strong>Tháng {t.thang}</strong> <small>(từ {t.tuNgay}, cung {t.cung}{t.thangMoc ? ', tháng đáng chú ý' : ''})</small>
              {t.nhanDinh.map((n, i) => <Doan key={i} n={n} />)}
            </li>
          ))}
        </ol>
      </section>
      <p><small>{bai.ghiChuTruongPhai}</small></p>
      <p><small>{bai.ghiChu}</small></p>
    </div>
  );
}
