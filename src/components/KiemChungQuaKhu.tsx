'use client';
import { useEffect, useState } from 'react';
import { guiSuKien, maPhien } from '@/lib/phien';
import { nhomKiemChung, type NhomKiemChung } from '@/lib/kiem-chung-nhom';
import { KIEM_CHUNG_NHAN } from '@/lib/kiem-chung-noi-dung';
import type { KiemChungNam } from '@/lib/luan-giai/ai/kiem-chung';

export const KHOA_NHOM_KIEM_CHUNG = 'xtv.kc-nhom';

/** Nhóm A/B đã chốt của phiên (đặt khi mục kiểm chứng được dựng), để nút mua gắn vào sự kiện bam_mua. null: thử nghiệm không chạy. */
export function nhomKiemChungDaChot(): NhomKiemChung | null {
  try { const g = window.sessionStorage.getItem(KHOA_NHOM_KIEM_CHUNG); return g === 'a' || g === 'b' ? g : null; } catch { return null; }
}

/**
 * Mục "đối chiếu với năm đã qua", đặt trước phần khóa. Chỉ được dựng khi máy chủ gửi dữ liệu (cờ KIEM_CHUNG_QUA_KHU bật).
 * Nhóm A/B theo mã phiên: A thấy mục, B không. Sự kiện chỉ mang nhóm, không dữ liệu sinh.
 */
export function KiemChungQuaKhu({ kiemChung }: { kiemChung: KiemChungNam[] }) {
  const [nhom, datNhom] = useState<NhomKiemChung | null>(null);
  useEffect(() => {
    const g = nhomKiemChung(maPhien());
    try { window.sessionStorage.setItem(KHOA_NHOM_KIEM_CHUNG, g); } catch { /* bỏ qua */ }
    guiSuKien('xem_truoc_mo', { truong: { nhom_ab: g } });
    if (g === 'a') guiSuKien('kiem_chung_xem', { truong: { nhom_ab: g } });
    datNhom(g);
  }, []);
  if (nhom !== 'a') return null;
  return (
    <section className="kiem-chung" aria-labelledby="kc-tieu-de" data-nhom="a">
      <h3 id="kc-tieu-de">{KIEM_CHUNG_NHAN.tieuDe}</h3>
      <p className="tt-ghi-chu">{KIEM_CHUNG_NHAN.minhBach}</p>
      {kiemChung.map((n) => (
        <div key={n.nam} className="kc-nam">
          {n.nhanDinh.map((c) => (
            <p key={c.text} className="doan-ro">{c.text} <small className="can-cu">{c.canCu}</small></p>
          ))}
        </div>
      ))}
      <p className="doan-nguon">{KIEM_CHUNG_NHAN.truongPhai}</p>
    </section>
  );
}
