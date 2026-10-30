// T-a4504a (Phiếu 2–3 bảng chấm): áp CHUNG-CC-08 cho phá cách, bỏ cách "Tham Đào" không có quy tắc,
// chặn đoạn trùng giữa các bài (chuyên đề khác nhau không được chép y hệt câu của nhau).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => {
  m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText, f);
};
const { lapLaSo } = require('../src/lib/tuvi/index.ts');
const AI = require('../src/lib/luan-giai/ai/index.ts');
const TC = require('../docs/nghien-cuu/tuvi-test-cases.json').cases;
const CD = ['menh', 'quan-loc', 'phu-the', 'tai-bach', 'dien-trach'];
const SAT = ['Địa Không', 'Địa Kiếp', 'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'];
const KHUNG = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/luan-giai/ai/quy-tac-khung.json'), 'utf8'));
const cungCua = { menh: 'Mệnh', 'quan-loc': 'Quan Lộc', 'phu-the': 'Phu Thê', 'tai-bach': 'Tài Bạch', 'dien-trach': 'Điền Trạch' };
const saoCua = (c) => [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh];

/** Mức 3 theo CC-08 (phần kiểm được bằng dữ liệu): sát tinh hoặc Hóa Kỵ hãm tọa thủ cung chính, hoặc tổng điểm phá >= 4 (Kỵ hóa vào sao tạo cách: chỉ báo cờ kyTamPhuong). */
function laPhaCach(ls, cd) {
  const goc = ls.cung.find((c) => c.ten === cungCua[cd]);
  const t = (d) => ls.cung.find((c) => c.chi === (goc.chi + d + 12) % 12);
  const dsx = [[goc, 2], [t(6), 1], [t(4), 1], [t(8), 1]];
  const hamToaThu = saoCua(goc).some((s) => (SAT.includes(s.ten) || s.hoa === 'Hóa Kỵ') && s.dacTinhTen === 'Hãm');
  let diem = (goc.tuan ? 2 : 0) + (goc.triet ? 2 : 0);
  for (const [c, d] of dsx) diem += d * saoCua(c).filter((s) => SAT.includes(s.ten) || s.hoa === 'Hóa Kỵ').length;
  const kyTamPhuong = dsx.some(([c]) => saoCua(c).some((s) => s.hoa === 'Hóa Kỵ'));
  return { pha: hamToaThu || diem >= 4, kyTamPhuong };
}

test('không còn cách "Tham Đào" (chưa có quy tắc nghiên cứu), không bài nào nêu cách đó', async () => {
  assert.ok(!KHUNG.some((q) => /Tham Đào|Thamdao/.test(q.id + q.noiDung + (q.cachCuc ?? ''))));
});

test('phá cách theo CC-08: không gọi "thế X ... thành cách"/"có khuyết", chỉ nói "có dáng dấp"', async () => {
  let gap = 0;
  const loi = [];
  for (const tc of TC) {
    const ls = lapLaSo(tc.input);
    for (const cd of CD) {
      const { pha, kyTamPhuong } = laPhaCach(ls, cd);
      const bai = await AI.sinhLuanGiai(ls, cd, { boQuaCache: true });
      for (const m of bai.muc.filter((x) => x.id === 'cach-cuc')) for (const d of m.nhanDinh) {
        const ten = (d.thamChieu.yeuTo ?? []).find((y) => y.startsWith('Cách '));
        if (!ten || /Không Kiếp/.test(ten) || /Hỏa Tham/.test(ten)) continue;
        const coKhuyet = /có khuyết/.test(d.text);
        const dangDap = /có dáng dấp/.test(d.text);
        if (pha) { gap++; if (coKhuyet || !dangDap) loi.push(`${tc.id}/${cd}: ${d.thamChieu.quyTacId}: ${d.text.slice(0, 90)}`); }
        else if (dangDap && !kyTamPhuong) loi.push(`${tc.id}/${cd}: ${d.thamChieu.quyTacId}: nêu "dáng dấp" khi chưa phá cách`);
      }
    }
  }
  assert.ok(gap >= 3, `bộ lá số mẫu chỉ có ${gap} cách rơi vào phá cách, test chưa đủ sức`);
  assert.deepEqual(loi, []);
});
