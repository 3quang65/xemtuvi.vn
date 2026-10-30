// Trích quy tắc luận Mệnh từ bộ luận giải thành JSON cho phần tóm tắt miễn phí.
// Chạy: node tools/tao-du-lieu-luan-giai.cjs  → src/lib/luan-giai/menh-chinh-tinh.json
//                                            và src/lib/luan-giai/doan-mau.json (Phu Thê, Quan Lộc cho đoạn mẫu màn chọn gói)
// Chép nguyên văn câu luận; chỉ bỏ ghi chú nội bộ "(sách gốc diễn đạt nặng, đã trung tính hóa)".
const fs = require('fs');
const path = require('path');
const goc = path.join(__dirname, '../docs/nghien-cuu/luan-giai-12-cung.md');
const dong = fs.readFileSync(goc, 'utf8').split('\n');

const SAO = ['Tử Vi', 'Liêm Trinh', 'Thiên Đồng', 'Vũ Khúc', 'Thái Dương', 'Thiên Cơ', 'Thiên Phủ', 'Thái Âm',
  'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương', 'Thất Sát', 'Phá Quân'];
const NGUON = { TT: 'Toàn Thư', TB: 'Tân Biên', NL: 'Nghiệm Lý', KL: 'Khảo Luận', CN: 'Chỉ Nam', HS: 'Hàm Số' };

function tachDong(l) {
  const m = l.match(/^- \*\*\[([A-Z0-9-]+)\]\*\* (.*?) — \*Nguồn: (.*)\*$/);
  if (!m) return null;
  const [, ma, thanh, nguonTho] = m;
  const cau = thanh.replace(/\s*\*\(sách gốc diễn đạt nặng, đã trung tính hóa\)\*/, '').trim();
  const truocHaiCham = cau.split(':')[0];
  const dacTinh = [...new Set([...truocHaiCham.matchAll(/\((M|V|Đ|B|H)(?![\p{L}])/gu)].map((x) => x[1]))];
  const ma2 = [...new Set(nguonTho.split(/;\s+(?=[A-Z]{2}\b)/).map((s) => (s.match(/^([A-Z]{2})\b/) || [])[1]).filter(Boolean))];
  return { ma, cau, dacTinh, nguon: ma2.map((c) => NGUON[c] || c) };
}

const ra = { menh: {}, voChinhDieu: [] };
let sao = null; let vung = '';
for (const l of dong) {
  if (/^### 1\.2\./.test(l)) { vung = 'menh'; continue; }
  if (/^### 1\.3\./.test(l)) vung = '';
  if (/^### 0\.6\./.test(l)) { vung = 'vcd'; continue; }
  if (/^### 0\.7\./.test(l)) vung = '';
  if (vung === 'menh') {
    const h = l.match(/^#### (.+)$/); if (h) { sao = h[1].trim(); continue; }
    const r = tachDong(l);
    if (r && SAO.includes(sao)) (ra.menh[sao] ||= []).push(r);
  } else if (vung === 'vcd') {
    const r = tachDong(l); if (r) ra.voChinhDieu.push(r);
  }
}
for (const s of SAO) if (!ra.menh[s] || !ra.menh[s].some((r) => r.dacTinh.length)) throw new Error('Thiếu quy tắc cho ' + s);
// --- Đoạn mẫu màn chọn gói: quy tắc chính tinh tại Phu Thê (3.2) và Quan Lộc (9.2), kèm điều kiện máy đọc được.
// Chỉ nhận điều kiện viết đúng một trong các dạng sau; dạng khác (gặp sát tinh, Tuần Triệt, "sáng"…) bỏ qua để không áp sai.
//   "<Sao> [đơn thủ] ở|tại <chi, …> [(độ sáng)]"  → cung chỉ có đúng sao đó, ở một trong các chi
//   "<Tên tắt> <Tên tắt> [đồng cung] [(<chi …>)]"  → cung có đúng hai sao đó (Tử Phá, Cự Nhật…)
//   "Thiên hướng và phong cách"                    → cung có sao đó (luận chung, đồng cung vẫn đúng)
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const TAT = { Tử: 'Tử Vi', Liêm: 'Liêm Trinh', Đồng: 'Thiên Đồng', Vũ: 'Vũ Khúc', Nhật: 'Thái Dương', Cơ: 'Thiên Cơ',
  Phủ: 'Thiên Phủ', Nguyệt: 'Thái Âm', Âm: 'Thái Âm', Tham: 'Tham Lang', Cự: 'Cự Môn', Tướng: 'Thiên Tướng',
  Lương: 'Thiên Lương', Sát: 'Thất Sát', Phá: 'Phá Quân' };
const DO_SANG = /^(M|V|Đ|B|H|miếu|vượng|đắc|bình|hãm)$/;

function docChi(s) { // "Dần, Thân (H), Thìn" → [2, 8, 4]; có chữ lạ → null
  const tu = s.replace(/\(([^)]*)\)/g, ' $1 ').split(/[\s,/]+/).filter(Boolean);
  if (!tu.length || tu.some((t) => !CHI.includes(t) && !DO_SANG.test(t))) return null;
  const chi = tu.filter((t) => CHI.includes(t)).map((t) => CHI.indexOf(t));
  return chi.length ? chi : null;
}
function docVe(v) {
  let m = v.match(new RegExp(`^(${SAO.join('|')})(?: đơn thủ)? (?:ở|tại) (.+)$`));
  if (m) { const chi = docChi(m[2]); return chi ? [{ sao: [m[1]], chi }] : []; }
  const ten = Object.keys(TAT).join('|');
  m = v.match(new RegExp(`^(${ten}) (${ten})(?: đồng cung)?(?: \\(([^)]*)\\))?$`));
  if (m) {
    const chi = m[3] ? docChi(m[3]) : null;
    if (m[3] && !chi) return [];
    return [{ sao: [TAT[m[1]], TAT[m[2]]].sort(), chi }];
  }
  const cac = v.split(', '); // "Liêm Tham, Liêm Sát, Liêm Phá"
  if (cac.length > 1) { const r = cac.map(docVe); if (r.every((x) => x.length)) return r.flat(); }
  return [];
}
function dieuKien(r, sao) {
  const dau = r.cau.split(': ')[0].replace(/^\([ab]\) /, '');
  if (dau === 'Thiên hướng và phong cách') return [{ sao: [sao], chi: null, chung: true }];
  return dau.split(/,? hoặc |(?<=\)), /).flatMap(docVe).filter((d) => d.sao.includes(sao));
}
const dm = {};
for (const [muc, khoa] of [['3', 'Phu Thê'], ['9', 'Quan Lộc']]) {
  dm[khoa] = []; let vao = false; let sao = null;
  for (const l of dong) {
    if (l.startsWith(`### ${muc}.2.`)) { vao = true; continue; }
    if (vao && /^##+ /.test(l) && !l.startsWith('#### ')) break;
    if (!vao) continue;
    const h = l.match(/^#### ([^(]+)/); if (h) { sao = h[1].trim(); continue; }
    const r = tachDong(l);
    if (!r || !SAO.includes(sao)) continue;
    const dk = dieuKien(r, sao);
    if (dk.length) dm[khoa].push({ ma: r.ma, cau: r.cau.replace(/^\([ab]\) /, ''), nguon: r.nguon, dieuKien: dk });
  }
}
fs.writeFileSync(path.join(__dirname, '../src/lib/luan-giai/doan-mau.json'), JSON.stringify(dm, null, 1) + '\n');
console.log('Đoạn mẫu:', Object.entries(dm).map(([k, v]) => `${k} ${v.length}`).join(', '), 'quy tắc có điều kiện máy đọc được');

fs.writeFileSync(path.join(__dirname, '../src/lib/luan-giai/menh-chinh-tinh.json'), JSON.stringify(ra, null, 1) + '\n');
console.log('Đã ghi', Object.values(ra.menh).flat().length, 'quy tắc Mệnh,', ra.voChinhDieu.length, 'quy tắc vô chính diệu');
