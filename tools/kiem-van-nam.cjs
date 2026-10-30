// Kiểm tự động bộ "Vận năm 2027" (docs/luan-giai/van-nam): mã quy tắc có thật, nguồn đúng tên, từ cấm, đủ khung bài.
// Chạy: node tools/kiem-van-nam.cjs  → in lỗi, thoát mã 1 nếu có lỗi.
const fs = require('fs');
const path = require('path');
const R = path.join(__dirname, '..');
const doc = (p) => fs.readFileSync(path.join(R, p), 'utf8');
const DIR = 'docs/luan-giai/van-nam/';
const loi = [];

// 1. Danh sách mã có thật
const ma = new Set();
for (const f of ['docs/nghien-cuu/luan-giai-12-cung.md', 'docs/nghien-cuu/luan-giai/dai-van.md', DIR + 'QUY-TAC.md'])
  for (const m of doc(f).matchAll(/\*\*\[([A-Z]+(?:-[A-Z0-9]+)+)\]\*\*/g)) ma.add(m[1]);
const doan = JSON.parse(doc(DIR + 'doan-mau.json'));
for (const d of doan) ma.add(d.id);

// 2. Đoạn mẫu JSON
const NGUON = ['Tử Vi Đẩu Số Toàn Thư (Hy Di Trần Đoàn)', 'Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)', 'Tử Vi Nghiệm Lý Toàn Thư (Thiên Lương)',
  'Tử Vi Chỉ Nam (Song An Đỗ Văn Lưu)', 'Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)', 'Tử Vi Hàm Số (Nguyễn Phát Lộc)', 'Trung Châu phái (Vương Đình Chi)',
  'Phi tinh – Tứ Hóa phái', 'Đặc tả an sao xemtuvi.vn'];
const tuCam = JSON.parse(doc('src/lib/luan-giai/ai/tu-cam.json')).tuCam.concat(['tai nạn', 'chắc chắn sẽ', 'nhất định sẽ', 'năm xui', 'vận đen']);
const coTuCam = (s) => tuCam.filter((w) => s.toLowerCase().includes(w));
const ids = new Set();
for (const d of doan) {
  if (ids.has(d.id)) loi.push('JSON trùng id ' + d.id); ids.add(d.id);
  for (const m of d.maNghienCuu || []) if (!ma.has(m)) loi.push('JSON ' + d.id + ': mã không có thật ' + m);
  if (!(d.nguon || []).length) loi.push('JSON ' + d.id + ': thiếu nguồn');
  for (const n of d.nguon || []) if (!NGUON.includes(n) && !n.startsWith('Tư liệu web: ')) loi.push('JSON ' + d.id + ': nguồn sai tên "' + n + '"');
  if ((d.noiDung || '').length < 40) loi.push('JSON ' + d.id + ': noiDung < 40 ký tự');
  for (const w of coTuCam(d.noiDung || '')) loi.push('JSON ' + d.id + ': từ cấm "' + w + '"');
}

// 3. Quy tắc NAM-: mỗi dòng có nguồn
for (const dong of doc(DIR + 'QUY-TAC.md').split('\n').filter((l) => /^- \*\*\[NAM-/.test(l)))
  if (!/— \*Nguồn/.test(dong)) loi.push('QUY-TAC thiếu nguồn: ' + dong.slice(0, 40));

// 4. Bài mẫu
for (const f of ['VN01.md', 'VN02.md', 'VN03.md']) {
  const s = doc(DIR + f);
  const khach = s.replace(/<!--[\s\S]*?-->/g, '');
  for (const can of ['giả lập', 'Nội dung do hệ thống tạo', '## 1. Tổng quan năm', '### Sự nghiệp', '### Tài chính', '### Tình cảm', '### Sức khỏe', '## 3. Mười hai tháng'])
    if (!s.includes(can)) loi.push(f + ': thiếu "' + can + '"');
  for (let t = 1; t <= 12; t++) if (!new RegExp('\\| \\**T' + t + '\\** \\(từ ').test(s)) loi.push(f + ': thiếu tháng T' + t);
  for (const w of coTuCam(khach)) loi.push(f + ': từ cấm "' + w + '"');
  const binhLuan = [...s.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1]).join(' ');
  for (const m of binhLuan.matchAll(/\b([A-Z]{2,}(?:-[A-Z0-9]+)+)\b/g)) {
    const k = m[1];
    if (ma.has(k)) continue;
    const sau = binhLuan.slice(m.index + k.length, m.index + k.length + 30);
    if (/^ \(chưa có quy tắc/.test(sau)) continue; // họ quy tắc được ghi rõ là chưa có
    loi.push(f + ': mã không có thật ' + k);
  }
  // Mỗi đoạn văn cho khách phải có chú thích quy tắc ngay sau
  const khoi = s.split(/\n(?=## |### |\*\*[A-ZĐ])/);
  for (const k of khoi) if (k.trim().length > 200 && !k.includes('<!-- quy tắc')) loi.push(f + ': đoạn thiếu mã quy tắc: ' + k.trim().slice(0, 50));
}

if (loi.length) { console.log(loi.join('\n')); console.log('\n' + loi.length + ' lỗi'); process.exit(1); }
console.log('Đạt: ' + doan.length + ' đoạn JSON, ' + [...ma].filter((x) => x.startsWith('NAM-') && !ids.has(x)).length + ' quy tắc NAM, 3 bài mẫu đủ khung, không từ cấm, mọi mã có thật.');
