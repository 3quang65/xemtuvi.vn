#!/usr/bin/env node
// Đếm sao quan trọng bị bỏ sót và câu khuôn trong các bản luận giải mẫu (dùng cho kiểm duyệt).
// Dùng: node scripts/luan-giai/dem-sao-bo-sot.cjs <thư-mục chứa ban-*.md> [--chi-tiet] [--json]
// Đầu vào: file do scripts/luan-giai/sinh-mau.cjs sinh (mục "Sao các cung liên quan" + "Bài luận giải").
// Nhóm sao quan trọng (đúng nhóm phiếu kiem-duyet-1.md): Tứ hóa, Tuần/Triệt, Địa Không/Địa Kiếp,
// Kình Dương/Đà La, Hỏa Tinh/Linh Tinh, Thiên Không, Lộc Tồn.
// Quy tắc "đã nhắc": tên sao (hoặc tên ghép: Không Kiếp, Kình Đà, Hỏa Linh) có trong câu luận hoặc dòng ↳
// của bài. Tuần/Triệt tính theo từng cung: câu phải có cả "Tuần"/"Triệt" và tên cung đó
// (hoặc dòng ↳ ghi đúng cung đó).
const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith('--'));
const CHI_TIET = args.includes('--chi-tiet');
const JSON_OUT = args.includes('--json');
if (!dir) {
  console.error('Dùng: node scripts/luan-giai/dem-sao-bo-sot.cjs <thư-mục> [--chi-tiet] [--json]');
  process.exit(1);
}

const SAO = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ', 'Địa Không', 'Địa Kiếp', 'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Thiên Không', 'Lộc Tồn'];
const NHOM = { 'Hóa Lộc': 'Tứ hóa', 'Hóa Quyền': 'Tứ hóa', 'Hóa Khoa': 'Tứ hóa', 'Hóa Kỵ': 'Tứ hóa', 'Tuần': 'Tuần/Triệt', 'Triệt': 'Tuần/Triệt', 'Địa Không': 'Không Kiếp', 'Địa Kiếp': 'Không Kiếp', 'Kình Dương': 'Kình Đà', 'Đà La': 'Kình Đà', 'Hỏa Tinh': 'Hỏa Linh', 'Linh Tinh': 'Hỏa Linh', 'Thiên Không': 'Thiên Không', 'Lộc Tồn': 'Lộc Tồn' };
const BI_DANH = { 'Địa Không': ['Không Kiếp'], 'Địa Kiếp': ['Không Kiếp'], 'Kình Dương': ['Kình Đà'], 'Đà La': ['Kình Đà'], 'Hỏa Tinh': ['Hỏa Linh'], 'Linh Tinh': ['Hỏa Linh'] };
const KHUON = [
  ['góp thêm sắc thái', /góp thêm sắc thái/],
  ['Độ sáng tốt, nên phát huy chủ động', /Độ sáng tốt, nên phát huy chủ động/],
  ['Thái Thúc', /Thái Thúc/],
  // khuôn mới xuất hiện từ đợt 2
  ['"ảnh hưởng đến …:"', /\) ảnh hưởng đến [^:]+:/],
  ['"mỗi người cảm nhận khác nhau"', /mỗi người cảm nhận khác nhau/],
  ['"thuận lợi và điểm vướng cùng tồn tại"', /thuận lợi và điểm vướng cùng tồn tại/],
];

function phanTich(file) {
  const t = fs.readFileSync(file, 'utf8').normalize('NFC');
  const iSao = t.indexOf('## Sao các cung liên quan');
  const iBai = t.indexOf('## Bài luận giải');
  if (iSao < 0 || iBai < 0) throw new Error(`${file}: thiếu mục "Sao các cung liên quan" hoặc "Bài luận giải"`);
  const phanSao = t.slice(iSao, iBai);
  const bai = t.slice(iBai);
  // Mỗi nhận định = dòng "- câu" + dòng "_↳ ..._" ngay sau
  const nd = [];
  const dong = bai.split('\n');
  for (let i = 0; i < dong.length; i++) {
    if (/^- /.test(dong[i])) {
      const cau = dong[i].slice(2).trim();
      const ref = (dong[i + 1] || '').includes('↳') ? dong[i + 1].trim() : '';
      nd.push({ cau, ref, cungRef: (ref.split('·')[1] || '').trim() });
    }
  }
  const can = []; // sao quan trọng cần nhắc: {cung, sao}
  for (const l of phanSao.split('\n')) {
    const m = l.match(/^- \*\*(.+?)\*\*([^:]*):\s*(.*)$/);
    if (!m) continue;
    const [, cung, nhan, ds] = m;
    if (/\[Tuần\]/.test(nhan)) can.push({ cung, sao: 'Tuần' });
    if (/\[Triệt\]/.test(nhan)) can.push({ cung, sao: 'Triệt' });
    for (const s of SAO) if (ds.includes(s)) can.push({ cung, sao: s });
  }
  const toanBai = nd.map((x) => x.cau + ' ' + x.ref).join('\n');
  for (const c of can) {
    if (c.sao === 'Tuần' || c.sao === 'Triệt') {
      c.nhac = nd.some((x) => {
        const s = x.cau + ' ' + x.ref;
        if (!s.includes(c.sao)) return false;
        // câu nói "Tuần/Triệt đóng tại <cung>" / "... ở <cung>" hoặc câu không nêu cung nhưng tham chiếu đúng cung
        return x.cau.includes(c.cung) || (x.cungRef === c.cung && !/ở cung|tại cung/.test(x.cau));
      });
    } else {
      c.nhac = [c.sao, ...(BI_DANH[c.sao] || [])].some((ten) => toanBai.includes(ten));
    }
  }
  const khuon = Object.fromEntries(KHUON.map(([k, re]) => [k, nd.filter((x) => re.test(x.cau + ' ' + x.ref)).length]));
  // câu trùng nguyên văn trong cùng bài
  const dem = {};
  for (const x of nd) dem[x.cau] = (dem[x.cau] || 0) + 1;
  const trung = Object.values(dem).filter((v) => v > 1).reduce((a, v) => a + v - 1, 0);
  // đuôi trùng: phần sau dấu ":" đầu tiên giống hệt câu khác trong cùng bài (câu ghép khuôn)
  const duoi = {};
  for (const x of nd) { const d = x.cau.split(':').slice(1).join(':').trim(); if (d.length > 20) duoi[d] = (duoi[d] || 0) + 1; }
  const duoiTrung = Object.values(duoi).filter((v) => v > 1).reduce((a, v) => a + v, 0);
  const coCC = /^### Cách cục/m.test(bai);
  return { file: path.basename(file), soCau: nd.length, can, khuon, trung, duoiTrung, coCC };
}

const files = fs.readdirSync(dir).filter((f) => /^ban-\d+\.md$/.test(f)).sort();
if (!files.length) { console.error('Không thấy ban-*.md trong', dir); process.exit(1); }
const kq = files.map((f) => phanTich(path.join(dir, f)));

const tong = { can: 0, bo: 0, cau: 0, trung: 0, duoiTrung: 0, khuon: Object.fromEntries(KHUON.map(([k]) => [k, 0])), nhom: {} };
for (const r of kq) {
  tong.cau += r.soCau; tong.trung += r.trung; tong.duoiTrung += r.duoiTrung;
  for (const k in r.khuon) tong.khuon[k] += r.khuon[k];
  for (const c of r.can) {
    const g = NHOM[c.sao];
    tong.nhom[g] = tong.nhom[g] || { can: 0, bo: 0 };
    tong.nhom[g].can++; tong.can++;
    if (!c.nhac) { tong.nhom[g].bo++; tong.bo++; }
  }
}
const pct = (a, b) => (b ? ((100 * a) / b).toFixed(0) : '0') + '%';

if (JSON_OUT) { console.log(JSON.stringify({ thuMuc: dir, kq, tong }, null, 2)); process.exit(0); }

console.log(`Thư mục: ${dir}\n`);
const K = KHUON.map(([k]) => k);
console.log(`| Bản | Câu | Sao QT | Bỏ sót | % bỏ | ${K.join(' | ')} | Câu trùng | Đuôi trùng | Mục Cách cục | Sao bị bỏ |`);
console.log(`|${'---|'.repeat(9 + K.length)}`);
for (const r of kq) {
  const bo = r.can.filter((c) => !c.nhac);
  console.log(`| ${r.file.replace(/\.md$/, '')} | ${r.soCau} | ${r.can.length} | ${bo.length} | ${pct(bo.length, r.can.length)} | ${K.map((k) => r.khuon[k]).join(' | ')} | ${r.trung} | ${r.duoiTrung} | ${r.coCC ? 'có' : 'không'} | ${bo.map((c) => `${c.sao}@${c.cung}`).join(', ') || '—'} |`);
}
console.log(`| **Tổng** | ${tong.cau} | ${tong.can} | ${tong.bo} | **${pct(tong.bo, tong.can)}** | ${K.map((k) => tong.khuon[k]).join(' | ')} | ${tong.trung} | ${tong.duoiTrung} | ${kq.filter((r) => r.coCC).length}/${kq.length} | |`);
console.log(`\nTỷ lệ câu khuôn trên ${tong.cau} câu: ${K.map((k) => `${k} ${pct(tong.khuon[k], tong.cau)}`).join('; ')}`);
console.log('\nTheo nhóm sao:');
for (const [g, v] of Object.entries(tong.nhom)) console.log(`- ${g}: bỏ ${v.bo}/${v.can} (${pct(v.bo, v.can)})`);
if (CHI_TIET) {
  console.log('\nChi tiết đã nhắc:');
  for (const r of kq) console.log(`- ${r.file}: ${r.can.filter((c) => c.nhac).map((c) => `${c.sao}@${c.cung}`).join(', ') || '—'}`);
}
