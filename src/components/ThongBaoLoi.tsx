'use client';

import { thongBaoLoi, type Bien, type HanhDong, type MaLoi } from '@/lib/tro-giup';

/** Cách thực hiện từng nút: chuỗi = liên kết, hàm = bấm chạy. Nút nào không khai thì không hiện. */
export type CachNut = Partial<Record<HanhDong, string | (() => void)>>;

/**
 * Thông báo lỗi thân thiện (E01–E08). role="alert" để trình đọc màn hình đọc ngay;
 * ô nhập liên quan trỏ tới `id` bằng aria-describedby. Không bao giờ hiện mã lỗi kỹ thuật.
 */
export default function ThongBaoLoi({ ma, id, bien, nut }: { ma: MaLoi; id?: string; bien?: Bien; nut: CachNut }) {
  const t = thongBaoLoi(ma, bien);
  return (
    <div className="thong-bao-loi" role="alert" id={id}>
      <p className="tbl-tieu-de">{t.tieuDe}</p>
      <p>{t.noiDung}</p>
      <div className="tbl-nut">
        {t.nut.map((n, i) => {
          const cach = nut[n.hanhDong];
          if (cach === undefined) return null;
          const lop = i === 0 ? 'nut-chinh' : 'nut-phu';
          return typeof cach === 'string'
            ? <a key={n.hanhDong} href={cach} className={`${lop} nut-lien-ket`} {...(cach.startsWith('/tro-giup') ? { target: '_blank', rel: 'noopener' } : {})}>{n.nhan}</a>
            : <button key={n.hanhDong} type="button" className={lop} onClick={cach}>{n.nhan}</button>;
        })}
      </div>
    </div>
  );
}
