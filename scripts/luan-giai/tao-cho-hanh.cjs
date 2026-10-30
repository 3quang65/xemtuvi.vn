#!/usr/bin/env node
// Sinh docs/luan-giai/cho-hanh-C-HAM.md: các mã câu hợp chiếu biến thể Hãm (id *-C<n>-HAM) còn thiếu để Hạnh viết.
// Sao nào không bao giờ Hãm (Tử Vi, Thiên Phủ) thì không cần. Dùng: node scripts/luan-giai/tao-cho-hanh.cjs
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.join(__dirname, '../..');
const AI = path.join(ROOT, 'src/lib/luan-giai/ai');
const KHONG_HAM = new Set(['Tử Vi', 'Thiên Phủ']);
const LA_C = /^(ML|QL|PT)-S\d+-C\d+(-HAM)?$/;
const CD = { ML: 'Mệnh', QL: 'Quan Lộc', PT: 'Phu Thê' };

function tapMa() {
  const ma = new Set();
  const dung = (ds) => ds.forEach((q) => ma.add(q.id));
  dung(JSON.parse(fs.readFileSync(path.join(AI, 'quy-tac.json'), 'utf8')));
  const v2 = path.join(AI, 'quy-tac-v2');
  if (fs.existsSync(v2)) for (const f of fs.readdirSync(v2).filter((x) => x.endsWith('.json'))) dung(JSON.parse(fs.readFileSync(path.join(v2, f), 'utf8')));
  return ma;
}
/** Danh sách câu C-TOT chưa có biến thể -HAM. */
function thieu() {
  const ma = tapMa();
  const q = JSON.parse(fs.readFileSync(path.join(AI, 'quy-tac.json'), 'utf8'));
  return q.filter((x) => LA_C.test(x.id) && !x.id.endsWith('-HAM') && !KHONG_HAM.has(x.sao[0]) && !ma.has(`${x.id}-HAM`));
}
module.exports = { thieu };

if (require.main === module) {
  const ds = thieu();
  const L = [
    '# Câu hợp chiếu cho sao Hãm còn thiếu (chờ Hạnh viết)', '',
    'Sinh bằng `node scripts/luan-giai/tao-cho-hanh.cjs`. Chưa có câu `-HAM` thì bộ ghép KHÔNG phát câu hợp chiếu nào cho sao đó khi sao Hãm (không được tả sao hãm bằng nét tích cực).',
    'Thêm câu vào `src/lib/luan-giai/ai/quy-tac.json` (hoặc `quy-tac-v2/`): id = mã bên dưới, `dieuKien: {"doSang": ["Hãm"]}`, cùng `cung`, `sao`, `muc` với câu sáng; câu mở bằng mặt cần chú ý, giọng "hiểu mình, định hướng". Bộ ghép tự dùng, không cần sửa code.',
    'Tử Vi và Thiên Phủ không bao giờ Hãm nên không có trong danh sách.', '',
    `Còn thiếu: **${ds.length}** mã.`, '', '| Mã cần viết | Chuyên đề | Sao | Cung hợp chiếu | Câu sáng tương ứng (để giữ cùng ý) |', '|---|---|---|---|---|',
  ];
  for (const x of ds) L.push(`| ${x.id}-HAM | ${CD[x.id.slice(0, 2)]} | ${x.sao[0]} | ${x.cung} | ${x.id} |`);
  fs.writeFileSync(path.join(ROOT, 'docs/luan-giai/cho-hanh-C-HAM.md'), L.join('\n') + '\n');
  console.log('còn thiếu', ds.length, 'mã');
}
