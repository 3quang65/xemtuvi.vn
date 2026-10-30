// Nghiệm thu bộ ghép luận giải bản 2 (việc T-66d481, bước 3 của docs/luan-giai/kiem-duyet-1.md):
// 10 lá số mẫu (cùng cách chọn với scripts/luan-giai/sinh-mau.cjs) bỏ sót sao quan trọng ≤ 10%, nhận ra 7 cách cục, không còn câu đuôi khuôn.
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
const { locTuCam } = require('../src/lib/luan-giai/ai/loc.ts');
const DIR = path.join(__dirname, '../src/lib/luan-giai/ai');
const TC = require('../docs/nghien-cuu/tuvi-test-cases.json').cases;
const TU_CAM = JSON.parse(fs.readFileSync(path.join(DIR, 'tu-cam.json'), 'utf8'));
const KHUNG = JSON.parse(fs.readFileSync(path.join(DIR, 'quy-tac-khung.json'), 'utf8'));
const NC = fs.readFileSync(path.join(__dirname, '../docs/nghien-cuu/luan-giai-12-cung.md'), 'utf8');
const MA_NC = new Set([...NC.matchAll(/^- \*\*\[([A-Z]+(?:-[A-Z0-9]+)+)\]\*\*/gm)].map((m) => m[1]));

const CD = ['menh', 'quan-loc', 'phu-the'];
// Cung liên quan của từng chuyên đề: chính cung + tam phương (như phiếu kiểm duyệt đếm).
const CUNG = { menh: ['Mệnh', 'Thiên Di', 'Quan Lộc', 'Tài Bạch'], 'quan-loc': ['Quan Lộc', 'Phu Thê', 'Mệnh', 'Tài Bạch'], 'phu-the': ['Phu Thê', 'Quan Lộc', 'Thiên Di', 'Phúc Đức'] };
const QUAN_TRONG = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp', 'Thiên Không', 'Lộc Tồn'];

async function mauBai(i) {
  const tc = TC[i % TC.length]; const cd = CD[i % 3];
  const ls = lapLaSo(tc.input);
  return { ls, cd, bai: await AI.sinhLuanGiai(ls, cd, { boQuaCache: true }) };
}
const nhanDinh = (bai) => bai.muc.flatMap((m) => m.nhanDinh);

test('10 lá số mẫu: bỏ sót sao quan trọng ≤ 10% (Tứ hóa, Tuần/Triệt, Không Kiếp, Kình Đà, Hỏa Linh, Thiên Không, Lộc Tồn)', async () => {
  let can = 0; const thieu = [];
  for (let i = 0; i < 10; i++) {
    const { ls, cd, bai } = await mauBai(i);
    const nhac = new Set(nhanDinh(bai).flatMap((d) => [...d.thamChieu.sao, ...(d.thamChieu.yeuTo ?? [])]));
    const dau = new Set();
    for (const ten of CUNG[cd]) {
      const c = ls.cung.find((x) => x.ten === ten);
      for (const s of [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh]) if (s.hoa || QUAN_TRONG.includes(s.ten)) dau.add(s.ten);
      if (c.tuan) dau.add('Tuần');
      if (c.triet) dau.add('Triệt');
    }
    can += dau.size;
    for (const x of dau) if (!nhac.has(x)) thieu.push(`bản ${i + 1} ${cd}: ${x}`);
  }
  assert.ok(can >= 60, `bộ mẫu phải có ≥ 60 sao quan trọng, có ${can}`);
  assert.ok(thieu.length <= can * 0.1, `bỏ sót ${thieu.length}/${can}: ${thieu.join('; ')}`);
});

test('10 lá số mẫu: nhận ra 7 cách cục ghi ở phiếu kiểm duyệt, cách cục đứng đầu bài', async () => {
  const mong = { 0: ['Sát Phá Tham', 'Hỏa Tham / Linh Tham'], 2: ['Tham Đào'], 3: ['Tử Phủ Vũ Tướng'], 4: ['Cơ Lương'], 6: ['Tử Phá'], 8: ['Cơ Nguyệt Đồng Lương'] };
  const thay = new Set();
  for (const [i, ds] of Object.entries(mong)) {
    const { bai } = await mauBai(Number(i));
    const co = nhanDinh(bai).flatMap((d) => d.thamChieu.yeuTo ?? []).filter((y) => y.startsWith('Cách ')).map((y) => y.slice(5));
    for (const c of ds) { assert.ok(co.includes(c), `bản ${Number(i) + 1} thiếu cách ${c} (có: ${co.join(', ')})`); thay.add(c); }
    assert.equal(bai.muc[0].id, 'cach-cuc', `bản ${Number(i) + 1}: cách cục phải ở mục đầu`);
  }
  assert.ok(thay.size >= 7, `chỉ nhận ${thay.size} cách`);
});

test('0 câu "góp thêm sắc thái" và "Độ sáng tốt, nên phát huy chủ động" trên mọi lá số mẫu × 3 chuyên đề', async () => {
  const xau = [];
  for (const tc of TC.slice(0, 20)) {
    const ls = lapLaSo(tc.input);
    for (const cd of CD) {
      for (const d of nhanDinh(await AI.sinhLuanGiai(ls, cd, { boQuaCache: true }))) {
        if (/góp thêm sắc thái|Độ sáng tốt, nên phát huy chủ động/.test(d.text)) xau.push(`${tc.id}/${cd}: ${d.thamChieu.quyTacId}`);
      }
    }
  }
  assert.deepEqual(xau, []);
});

test('lamSachCau bỏ đuôi khuôn nhưng giữ câu trọn vẹn', () => {
  assert.equal(AI.lamSachCau('Tử Vi ở cung Thiên Di (xung chiếu với Mệnh): bổ sung xu hướng thích dẫn dắt, góp thêm sắc thái cho chuyên đề Mệnh.'),
    'Tử Vi ở cung Thiên Di (xung chiếu với Mệnh): bổ sung xu hướng thích dẫn dắt.');
  assert.equal(AI.lamSachCau('Tử Vi tại Mệnh: thích giữ vai trò dẫn dắt. Độ sáng tốt, nên phát huy chủ động.'), 'Tử Vi tại Mệnh: thích giữ vai trò dẫn dắt.');
});

test('quy tắc khung: mã nghiên cứu có thật, nguồn đúng tên, sạch từ cấm, Tuần và Triệt không trùng câu', () => {
  const loi = [];
  for (const q of KHUNG) {
    for (const m of q.maNghienCuu) if (!MA_NC.has(m)) loi.push(`${q.id}: mã ${m}`);
    if (!q.nguon.length || q.nguon.some((n) => /Thái Thúc/.test(n))) loi.push(`${q.id}: nguồn`);
    if (locTuCam(q.noiDung, TU_CAM) === null) loi.push(`${q.id}: từ cấm`);
  }
  for (const cd of CD) {
    const t = KHUNG.filter((q) => q.chuyenDe === cd && q.loai === 'TUAN').map((q) => q.noiDung);
    for (const q of KHUNG.filter((q) => q.chuyenDe === cd && q.loai === 'TRIET')) if (t.includes(q.noiDung)) loi.push(`${q.id}: trùng câu Tuần`);
  }
  assert.deepEqual(loi, []);
  assert.equal(new Set(KHUNG.map((q) => q.id)).size, KHUNG.length);
});

test('Tuần ở cung hợp chiếu: câu nêu đúng cung và nói rõ Tuần không chiếu sang chính cung', async () => {
  for (let i = 0; i < 10; i++) {
    const { ls, cd, bai } = await mauBai(i);
    const tuan = nhanDinh(bai).filter((d) => d.thamChieu.quyTacId.includes('-TUAN-'));
    for (const d of tuan) {
      const cung = d.thamChieu.cungLienQuan[0];
      assert.ok(ls.cung.find((c) => c.ten === cung).tuan, `${cung} phải có Tuần`);
      assert.ok(d.text.includes(cung) && d.text.includes('không chiếu sang'), d.text);
    }
  }
});
