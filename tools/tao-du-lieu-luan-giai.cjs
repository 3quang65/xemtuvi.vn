// Trích quy tắc luận Mệnh từ bộ luận giải thành JSON cho phần tóm tắt miễn phí.
// Chạy: node tools/tao-du-lieu-luan-giai.cjs  → src/lib/luan-giai/menh-chinh-tinh.json
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
fs.writeFileSync(path.join(__dirname, '../src/lib/luan-giai/menh-chinh-tinh.json'), JSON.stringify(ra, null, 1) + '\n');
console.log('Đã ghi', Object.values(ra.menh).flat().length, 'quy tắc Mệnh,', ra.voChinhDieu.length, 'quy tắc vô chính diệu');
