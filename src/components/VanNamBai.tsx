import type { BaiVanNam, NhanDinhNam } from '@/lib/luan-giai/ai/van-nam';

// Bài đã mua: mã quy tắc, mã mẫu việc và điều kiện (thamChieu) không hiển thị; chỉ hiện nguồn ngắn và trường phái.

/** Mục 12 tháng và đầu bài: câu ngắn kèm nguồn. */
function Doan({ n }: { n: NhanDinhNam }) {
  return <p>{n.text} <small>({n.thamChieu.nguon}; {n.thamChieu.truongPhai})</small></p>;
}

/** Đoạn đủ 4 phần theo khung-doan-tra-phi.md mục 1.1; câu dẫn (trọng điểm năm, bối cảnh) chỉ in câu. */
function DoanDay({ n }: { n: NhanDinhNam }) {
  const v = n.viecNenLam;
  if (n.cauDan || !v || !n.canCu) return <p>{n.text}{n.ghiChuTruongPhai ? <> <small>Ghi chú trường phái: {n.ghiChuTruongPhai}</small></> : null}</p>;
  return (
    <article className="doan-4-phan">
      <p className="doan-can-cu"><strong>Căn cứ trên lá số của bạn:</strong> {n.canCu}</p>
      <p>{n.text}</p>
      <p className="doan-nguon"><strong>Nguồn:</strong> {n.nguon}</p>
      {n.ghiChuTruongPhai ? <p className="doan-nguon"><strong>Ghi chú trường phái:</strong> {n.ghiChuTruongPhai}</p> : null}
      <p className="doan-viec"><strong>Việc nên làm ({v.thoiHanThang} tháng):</strong> {v.cau} <strong>Cách đo:</strong> {v.thuocDo}</p>
    </article>
  );
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
          {m.nhanDinh.map((n, i) => <DoanDay key={i} n={n} />)}
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
