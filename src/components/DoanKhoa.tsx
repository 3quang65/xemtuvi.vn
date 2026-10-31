'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { lapLaSo, type LaSo } from '@/lib/tuvi';
import { chonDoanMau, tachDoanMau } from '@/lib/luan-giai/doan-mau';
import { DOAN_MAU } from '@/lib/luan-giai/doan-du-phong';
import { docThongTinSinh } from '@/lib/phien';

/** Đoạn mẫu lấy từ chính lá số của khách: câu đầu đọc được, phần sau làm mờ. Không có quy tắc khớp thì dùng ví dụ minh họa. */
export default function DoanKhoa() {
  const router = useRouter();
  const [laSo, setLaSo] = useState<LaSo | null>(null);
  useEffect(() => {
    const t = docThongTinSinh();
    try { if (t) { setLaSo(lapLaSo(t)); return; } } catch { /* rơi xuống chuyển trang */ }
    router.replace('/');
  }, [router]);
  const mau = useMemo(() => laSo && chonDoanMau(laSo.cung.map((c) => ({ ten: c.ten, chi: c.chi, tenChi: c.tenChi, chinhTinh: c.chinhTinh.map((s) => s.ten) }))), [laSo]);
  if (!laSo) return <div className="doan-khoa doan-khoa-cho" aria-hidden="true" />;
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
