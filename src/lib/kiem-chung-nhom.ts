/** Chia nhóm A/B cho mục "kiểm chứng năm đã qua" theo mã phiên ẩn danh: cùng phiên luôn cùng nhóm, hai nhóm xấp xỉ 50/50. A thấy mục, B không. */
export type NhomKiemChung = 'a' | 'b';

export function nhomKiemChung(phien: string): NhomKiemChung {
  let h = 0x811c9dc5; // FNV-1a 32 bit
  for (let i = 0; i < phien.length; i++) { h ^= phien.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d) >>> 0; h ^= h >>> 12; // trộn thêm cho bit thấp đều
  return (h & 1) === 0 ? 'a' : 'b';
}
