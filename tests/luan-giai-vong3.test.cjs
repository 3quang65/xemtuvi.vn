// T-a4504a vòng 3 (Phiếu 2c, 3c): lý do phá cách nêu đúng yếu tố, Nhật Nguyệt đúng nhánh sáng, Kỵ gộp Tuần, bỏ cụm chèn, tắt câu lạc đề.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => {
  m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText, f);
};
const { lapLaSo } = require('../src/lib/tuvi/index.ts');
const AI = require('../src/lib/luan-giai/ai/index.ts');
const TC = require('../docs/nghien-cuu/tuvi-test-cases.json').cases;
const CD = ['menh', 'quan-loc', 'phu-the', 'tai-bach', 'dien-trach'];
const sinh = (i, cd) => AI.sinhLuanGiai(lapLaSo(TC[i].input), cd, { boQuaCache: true });
const cau = (bai) => bai.muc.flatMap((m) => m.nhanDinh);

test('phá cách do Hỏa Tinh hãm tọa thủ (TC03 Phu Thê): câu nêu Hỏa Tinh hãm, không ghi "yếu tố hung nặng"', async () => {
  const d = cau(await sinh(2, 'phu-the')).find((x) => x.thamChieu.quyTacId.includes('SatPhaTham-PHA3'));
  assert.ok(d);
  assert.match(d.text, /Hỏa Tinh hãm ngay tại cung này/);
  assert.ok(!/bốn cung chiếu vào|yếu tố hung ở tứ chính nặng/.test(d.text));
  assert.match(d.text, /nói rõ điều mỗi người cần/);
});

test('phá cách do Tham Lang hóa Kỵ (TC01 Mệnh): câu nêu Tham Lang hóa Kỵ', async () => {
  const d = cau(await sinh(0, 'menh')).find((x) => x.thamChieu.quyTacId.includes('SatPhaTham-PHA3'));
  assert.ok(d);
  assert.match(d.text, /Tham Lang hóa Kỵ/);
});

test('Hỏa Tham: Tham Lang và Hỏa Tinh cùng hãm thì nói "đều hãm" (TC03 Phu Thê)', async () => {
  const t = cau(await sinh(2, 'phu-the')).map((x) => x.text).join('\n');
  assert.match(t, /Tham Lang và Hỏa Tinh đều hãm/);
});

test('Nhật Nguyệt chỉ nói một nhánh: cả hai sao sáng hoặc có sao kém sáng, đúng theo lá số', async () => {
  let sang = 0, kem = 0;
  for (let i = 0; i < TC.length; i++) for (const cd of CD) {
    const ls = lapLaSo(TC[i].input);
    const d = cau(await sinh(i, cd)).find((x) => (x.thamChieu.yeuTo ?? []).includes('Cách Nhật Nguyệt'));
    if (!d) continue;
    const goc = ls.cung.find((c) => c.ten === { menh: 'Mệnh', 'quan-loc': 'Quan Lộc', 'phu-the': 'Phu Thê', 'tai-bach': 'Tài Bạch', 'dien-trach': 'Điền Trạch' }[cd]);
    const tp = [0, 6, 4, 8].map((k) => ls.cung.find((c) => c.chi === (goc.chi + k) % 12));
    const dacTinh = (ten) => tp.flatMap((c) => [...c.chinhTinh]).find((s) => s.ten === ten)?.dacTinhTen;
    const bothBright = ['Thái Dương', 'Thái Âm'].every((t) => ['Miếu', 'Vượng', 'Đắc'].includes(dacTinh(t)));
    assert.ok(!(/cả hai sao đều sáng/.test(d.text) && /kém sáng/.test(d.text)), `${TC[i].id}/${cd}: nêu cả hai nhánh`);
    if (bothBright) { assert.match(d.text, /cả hai sao đều sáng/); sang++; } else { assert.match(d.text, /có sao kém sáng/); kem++; }
  }
  assert.ok(sang >= 1 && kem >= 1, `sáng ${sang}, kém ${kem}`);
});

test('câu Hóa Lộc dễ hao tán và giáp Khoa Quyền không chèn "về tính cách và hướng đi của bạn"; câu Lộc–Kỵ ngắn', async () => {
  for (let i = 0; i < TC.length; i++) {
    const bai = await sinh(i, 'menh');
    for (const d of cau(bai)) {
      if (/HOA-Lộc-HT|GIAP-KhoaQuyen/.test(d.thamChieu.quyTacId)) assert.ok(!/về tính cách và hướng đi của bạn/.test(d.text), d.text);
      if (/DH-Lộc-Ky/.test(d.thamChieu.quyTacId)) assert.ok(d.text.split(/\s+/).length <= 35, d.text);
    }
  }
});

test('Kỵ cùng cung với Tuần/Triệt (CHUNG-TUAN-06): câu Kỵ nói mặt vướng nhẹ hơn, không còn câu Kỵ trần', async () => {
  let gap = 0;
  for (let i = 0; i < TC.length; i++) for (const cd of CD) {
    const ls = lapLaSo(TC[i].input);
    const goc = ls.cung.find((c) => c.ten === { menh: 'Mệnh', 'quan-loc': 'Quan Lộc', 'phu-the': 'Phu Thê', 'tai-bach': 'Tài Bạch', 'dien-trach': 'Điền Trạch' }[cd]);
    const coKy = [...goc.chinhTinh].some((s) => s.hoa === 'Hóa Kỵ');
    if (!coKy || !(goc.tuan || goc.triet)) continue;
    const ky = cau(await sinh(i, cd)).filter((x) => /-KY-/.test(x.thamChieu.quyTacId));
    if (!ky.length) continue;
    gap++;
    assert.ok(ky.every((x) => /(Tuần|Triệt) đóng cùng .* nhẹ hơn/.test(x.text)), `${TC[i].id}/${cd}`);
  }
  assert.ok(gap >= 1, 'bộ mẫu không có Kỵ cùng Tuần/Triệt');
});

test('bài Phu Thê tắt 9 câu lạc đề (danh sách ở TAT_O_BAI)', async () => {
  const tat = AI.TAT_O_BAI['phu-the'];
  assert.equal(tat.size, 9);
  for (let i = 0; i < TC.length; i++) for (const d of cau(await sinh(i, 'phu-the'))) assert.ok(!tat.has(d.thamChieu.quyTacId), d.thamChieu.quyTacId);
});
