// Sinh tóm tắt miễn phí cho 11 lá số mẫu (đúng chữ khách thấy) và đo: tỉ lệ câu trùng nguyên văn
// giữa các lá số, số nhận định nêu tên sao/cung cụ thể của lá số đó.
// Dùng: node scripts/luan-giai/do-tom-tat.cjs [file-ra=docs/luan-giai/tom-tat-mien-phi/sau.md]
const fs = require('node:fs');
const path = require('node:path');
require('../../tests/_nap-ts.cjs');
const ROOT = path.join(__dirname, '../..');
const { lapLaSo } = require(path.join(ROOT, 'src/lib/tuvi/index.ts'));
const LG = require(path.join(ROOT, 'src/lib/luan-giai/index.ts'));
const TC = require(path.join(ROOT, 'docs/nghien-cuu/tuvi-test-cases.json')).cases;
const ra = path.join(ROOT, process.argv[2] || 'docs/luan-giai/tom-tat-mien-phi/sau.md');

// Phần chữ luận (không tính các dòng dữ kiện Bản mệnh/Cục/... và nút bấm), tách câu.
const cauCua = (t) => LG.vanBanTomTat(t).flatMap((p) => p.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ỹ"“(])/u)).map((c) => c.trim()).filter(Boolean);
const TEN_CUNG = ['Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'];

const ban = TC.map((tc) => {
  const ls = lapLaSo(tc.input);
  const t = LG.tomTatMienPhi(ls);
  const saoLaSo = new Set(ls.cung.flatMap((c) => [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh].map((s) => s.ten)));
  return { tc, ls, t, cau: cauCua(t), saoLaSo };
});
const dem = new Map();
for (const b of ban) for (const c of new Set(b.cau)) dem.set(c, (dem.get(c) || 0) + 1);

let tong = 0, trung = 0, datSao = 0;
const L = ['# Tóm tắt miễn phí — 11 lá số mẫu', '', `Sinh bằng \`node scripts/luan-giai/do-tom-tat.cjs\`. Câu đánh dấu ⧉ là câu trùng nguyên văn với ít nhất một lá số khác.`, ''];
for (const b of ban) {
  // Nhận định truy về sao: câu nêu tên ≥1 sao có trong lá số, kèm tên cung hoặc vị trí.
  const nd = b.cau.filter((c) => !/^(Bản chuyên sâu|Các câu trên|Đoạn trên)/.test(c) && [...b.saoLaSo].some((s) => c.includes(s)) && TEN_CUNG.some((g) => c.includes(g)));
  const tr = b.cau.filter((c) => dem.get(c) > 1);
  tong += b.cau.length; trung += tr.length; if (nd.length >= 2) datSao++;
  L.push(`## ${b.tc.id} — ${b.tc.ten}`, '', `Bản mệnh: ${b.t.banMenh} · Cục: ${b.t.cuc} · Chính tinh Mệnh: ${b.t.voChinhDieu ? 'Vô chính diệu' : b.t.chinhTinhMenh.map((s) => s.ten + (s.dacTinhTen ? ` (${s.dacTinhTen})` : '')).join(' · ')} · Thân cư: ${b.t.thanCu}`, '');
  for (const c of b.cau) L.push(`- ${dem.get(c) > 1 ? '⧉ ' : ''}${c}`);
  L.push('', `_Câu: ${b.cau.length} · trùng: ${tr.length} · nhận định nêu sao + cung: ${nd.length}_`, '');
}
const tile = tong ? (100 * trung / tong).toFixed(1) : '0';
L.splice(4, 0, `**Tổng: ${tong} câu, trùng ${trung} (${tile}%) · ${datSao}/11 bản có ≥2 nhận định nêu sao + cung.**`, '');
fs.mkdirSync(path.dirname(ra), { recursive: true });
fs.writeFileSync(ra, L.join('\n'));
console.log(`câu ${tong} · trùng ${trung} (${tile}%) · đạt ≥2 nhận định ${datSao}/11 → ${path.relative(ROOT, ra)}`);
