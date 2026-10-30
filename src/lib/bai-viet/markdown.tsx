// Bộ chuyển markdown tối giản → React (máy chủ). Hỗ trợ: ## ### tiêu đề, đoạn, danh sách - và 1., **đậm**, *nghiêng*, [chữ](liên kết).
// Cố ý không hỗ trợ HTML thô, ảnh, bảng: bài chỉ gồm chữ để an toàn và để HTML có chữ thật.
import type { ReactNode } from 'react';

const LINK_AN_TOAN = /^(\/(?!\/)[\w\-/#?=&.%]*|https:\/\/[\w.\-]+(\/[\w\-/#?=&.%~+]*)?)$/;

function trongDong(s: string, khoa: string): ReactNode[] {
  const ra: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let cuoi = 0, i = 0, m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > cuoi) ra.push(s.slice(cuoi, m.index));
    const k = `${khoa}-${i++}`;
    if (m[1]) ra.push(<strong key={k}>{m[1]}</strong>);
    else if (m[2]) ra.push(<em key={k}>{m[2]}</em>);
    else if (LINK_AN_TOAN.test(m[4])) ra.push(<a key={k} href={m[4]}>{m[3]}</a>);
    else ra.push(m[3]);
    cuoi = m.index + m[0].length;
  }
  if (cuoi < s.length) ra.push(s.slice(cuoi));
  return ra;
}

export function Markdown({ md }: { md: string }) {
  const khoi: ReactNode[] = [];
  const dong = md.split(/\r?\n/);
  let i = 0, n = 0;
  while (i < dong.length) {
    const d = dong[i];
    if (!d.trim()) { i++; continue; }
    const h = /^(#{2,3})\s+(.+)$/.exec(d);
    if (h) { const T = h[1].length === 2 ? 'h2' : 'h3'; khoi.push(<T key={n++}>{trongDong(h[2], `h${n}`)}</T>); i++; continue; }
    const ds = /^(-|\d+\.)\s+/.exec(d);
    if (ds) {
      const co = ds[1] !== '-';
      const muc: ReactNode[] = [];
      while (i < dong.length && (co ? /^\d+\.\s+/ : /^-\s+/).test(dong[i])) { muc.push(<li key={i}>{trongDong(dong[i].replace(/^(-|\d+\.)\s+/, ''), `l${i}`)}</li>); i++; }
      khoi.push(co ? <ol key={n++}>{muc}</ol> : <ul key={n++}>{muc}</ul>);
      continue;
    }
    const doan: string[] = [];
    while (i < dong.length && dong[i].trim() && !/^(#{2,3}\s|-\s|\d+\.\s)/.test(dong[i])) doan.push(dong[i++].trim());
    khoi.push(<p key={n++}>{trongDong(doan.join(' '), `p${n}`)}</p>);
  }
  return <>{khoi}</>;
}
