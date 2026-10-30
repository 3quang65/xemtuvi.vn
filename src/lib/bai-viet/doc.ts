// Đọc bài từ content/<nhóm>/<mã>.md. Chạy ở máy chủ (build/render), không dùng ở trình duyệt.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { hopLeMa, NHOM } from './nhom';

export interface Bai {
  nhom: string;
  ma: string;
  duongDan: string; // /cung/phu-the
  tieuDe: string;
  moTa: string;
  ngayDang: string; // YYYY-MM-DD
  ngayCapNhat: string;
  nguon: string; // chuỗi nguồn/trường phái, hiện cuối bài nếu có
  noiDung: string; // markdown (đã bỏ frontmatter)
  hoiDap: { hoi: string; dap: string }[];
}

const THU_MUC = () => path.join(process.cwd(), 'content');
const NGAY = /^\d{4}-\d{2}-\d{2}$/;

/** Tách frontmatter dạng `khóa: giá trị` (một dòng mỗi khóa) giữa hai dòng `---`. */
export function tachFrontmatter(raw: string): { meta: Record<string, string>; thanBai: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!m) return { meta: {}, thanBai: raw };
  const meta: Record<string, string> = {};
  for (const dong of m[1].split(/\r?\n/)) {
    const i = dong.indexOf(':');
    if (i > 0 && !dong.trimStart().startsWith('#')) meta[dong.slice(0, i).trim()] = dong.slice(i + 1).trim().replace(/^"(.*)"$/, '$1');
  }
  return { meta, thanBai: m[2] };
}

/** Mục hỏi đáp: dưới tiêu đề `## Hỏi đáp`, mỗi `### Câu hỏi` + đoạn văn theo sau là một cặp. */
export function tachHoiDap(md: string): { hoi: string; dap: string }[] {
  const mucHoiDap = /^##\s+Hỏi đáp\s*$/m.exec(md);
  if (!mucHoiDap) return [];
  const sau = md.slice(mucHoiDap.index + mucHoiDap[0].length).split(/^##\s+/m)[0];
  const ra: { hoi: string; dap: string }[] = [];
  for (const khoi of sau.split(/^###\s+/m).slice(1)) {
    const [dong1, ...con] = khoi.split(/\r?\n/);
    const dap = con.join('\n').trim().replace(/\s*\n\s*/g, ' ');
    if (dong1.trim() && dap) ra.push({ hoi: dong1.trim(), dap });
  }
  return ra;
}

export function docBai(nhom: string, ma: string): Bai | null {
  if (!hopLeMa(nhom, ma)) return null;
  const tep = path.join(THU_MUC(), NHOM[nhom].thuMuc, `${ma}.md`);
  if (!existsSync(tep)) return null;
  const { meta, thanBai } = tachFrontmatter(readFileSync(tep, 'utf8'));
  if (!meta.tieuDe || !meta.moTa || !NGAY.test(meta.ngayDang ?? '')) {
    throw new Error(`content/${nhom}/${ma}.md: thiếu tieuDe, moTa hoặc ngayDang (YYYY-MM-DD)`);
  }
  return {
    nhom, ma, duongDan: `/${nhom}/${ma}`, tieuDe: meta.tieuDe, moTa: meta.moTa, ngayDang: meta.ngayDang,
    ngayCapNhat: NGAY.test(meta.ngayCapNhat ?? '') ? meta.ngayCapNhat : meta.ngayDang,
    nguon: meta.nguon ?? '', noiDung: thanBai.trim(), hoiDap: tachHoiDap(thanBai),
  };
}

/** Mọi mã có tệp trong một nhóm (và hợp lệ theo danh mục), đã sắp xếp. */
export function dsMa(nhom: string): string[] {
  const dir = path.join(THU_MUC(), NHOM[nhom]?.thuMuc ?? '');
  if (!NHOM[nhom] || !existsSync(dir) || !statSync(dir).isDirectory()) return [];
  return readdirSync(dir).filter((t) => t.endsWith('.md')).map((t) => t.slice(0, -3)).filter((ma) => hopLeMa(nhom, ma)).sort();
}

export function tatCaBai(): Bai[] {
  return Object.keys(NHOM).flatMap((n) => dsMa(n).map((ma) => docBai(n, ma)!));
}

