// Bài giả lập "Vận năm 2027" cho đến khi hàm sinh thật của B1 (src/lib/luan-giai) sẵn sàng. Chỉ chạy phía máy chủ sau khi kiểm quyền.
import type { LuanGiai } from '@/lib/luan-giai/ai';
import { XEM_TRUOC } from './van-nam-noi-dung';

const tc = (quyTacId: string) => ({ quyTacId, sao: [], cung: 'Lưu Thái Tuế', nguon: 'Tử Vi Đẩu Số Tân Biên', truongPhai: 'Tam hợp phái Việt' });

export function baiVanNamGiaLap(): LuanGiai {
  return {
    chuyenDe: 'van-nam' as unknown as LuanGiai['chuyenDe'],
    muc: [
      { id: 'tong-quan', tieuDe: XEM_TRUOC.tieuDe, nhanDinh: [{ text: XEM_TRUOC.ro, thamChieu: tc('NAM-TT-01') }, { text: XEM_TRUOC.mo, thamChieu: tc('NAM-HOA-01') }] },
      { id: 'su-nghiep', tieuDe: 'Sự nghiệp', nhanDinh: [{ text: 'Bản đầy đủ đang được biên soạn; đây là đoạn giữ chỗ để kiểm tra luồng mua.', thamChieu: tc('NAM-MANG-01') }] },
    ],
    ghiChu: 'Bản thử: nội dung giả lập, chưa phải bài luận thật.',
    phienBan: 'gia-lap',
  };
}
