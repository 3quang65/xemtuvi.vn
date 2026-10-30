// Danh mục nhóm bài SEO và mã URL hợp lệ (Minh chốt 30/10/2026). Bài chỉ lên site khi mã nằm trong danh mục VÀ có tệp markdown trong content/.
export const GOC = 'https://xemtuvi.vn';

export const TUOI = ['ty', 'suu', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi'] as const; // Tý=ty, Tỵ=ti
export const CUNG = ['menh', 'phu-mau', 'phuc-duc', 'dien-trach', 'quan-loc', 'no-boc', 'thien-di', 'tat-ach', 'tai-bach', 'tu-tuc', 'phu-the', 'huynh-de'] as const;
export const SAO = ['tu-vi', 'thien-co', 'thai-duong', 'vu-khuc', 'thien-dong', 'liem-trinh', 'thien-phu', 'thai-am', 'tham-lang', 'cu-mon', 'thien-tuong', 'thien-luong', 'that-sat', 'pha-quan'] as const;
export const CHU_DE = ['tinh-duyen', 'su-nghiep'] as const;

export interface Nhom {
  /** Thư mục con của content/ và đoạn đầu của URL */
  thuMuc: string;
  ten: string;
  /** Mã hợp lệ; null = tự do (kiến thức: Giang đặt tên bài, chỉ cần dạng chữ thường-gạch-ngang) */
  hopLe: readonly string[] | RegExp;
}

export const NHOM: Record<string, Nhom> = {
  'van-nam-2027': { thuMuc: 'van-nam-2027', ten: 'Vận năm 2027', hopLe: [...TUOI.map((t) => `tuoi-${t}`), 'theo-menh'] },
  cung: { thuMuc: 'cung', ten: 'Mười hai cung', hopLe: CUNG },
  sao: { thuMuc: 'sao', ten: 'Mười bốn chính tinh', hopLe: SAO },
  'chu-de': { thuMuc: 'chu-de', ten: 'Chủ đề', hopLe: CHU_DE },
  'kien-thuc': { thuMuc: 'kien-thuc', ten: 'Kiến thức Tử Vi', hopLe: /^[a-z0-9]+(-[a-z0-9]+){0,9}$/ },
};

export const hopLeMa = (nhom: string, ma: string): boolean => {
  const n = NHOM[nhom];
  if (!n) return false;
  return Array.isArray(n.hopLe) ? n.hopLe.includes(ma) : (n.hopLe as RegExp).test(ma);
};
