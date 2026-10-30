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
/** Sao của cung, loại trùng theo tên (sát tinh nằm cả hungTinh lẫn phuTinh: đếm một lần). */
const saoCua = (c) => [...new Map([...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh].map((s) => [s.ten, s])).values()];
const DAC = ['Miếu', 'Vượng', 'Đắc'];

/** Mức 1/2/3 theo CC-08 (+ ngoại lệ Sát Phá Tham: sát tinh đắc địa = 0). Viết độc lập với bộ ghép. */
function mucCC08(ls, cd, saoCach, spt) {
  const goc = ls.cung.find((c) => c.ten === cungCua[cd]);
  const t = (d) => ls.cung.find((c) => c.chi === (goc.chi + d + 12) % 12);
  const tp = [[goc, 2], [t(6), 1], [t(4), 1], [t(8), 1]];
  const pha = (s) => SAT.includes(s.ten) || s.hoa === 'Hóa Kỵ';
  const tinhDiem = (s) => pha(s) && !(spt && SAT.includes(s.ten) && DAC.includes(s.dacTinhTen));
  let diem = (goc.tuan ? 2 : 0) + (goc.triet ? 2 : 0);
  for (const [c, d] of tp) diem += d * saoCua(c).filter(tinhDiem).length;
  const ham = saoCua(goc).some((s) => pha(s) && s.dacTinhTen === 'Hãm');
  const ky = tp.some(([c]) => saoCua(c).some((s) => saoCach.includes(s.ten) && s.hoa === 'Hóa Kỵ'));
  return { muc: ham || ky || diem >= 4 ? 3 : diem > 0 ? 2 : 1, diem };
}

test('không còn cách "Tham Đào" (chưa có quy tắc nghiên cứu), không bài nào nêu cách đó', async () => {
  assert.ok(!KHUNG.some((q) => /Tham Đào|Thamdao/.test(q.id + q.noiDung + (q.cachCuc ?? ''))));
});

test('mức theo CC-08: 3 = "có dáng dấp", 2 = "có khuyết", 1 = thành cách; sát tinh không bị đếm hai lần', async () => {
  const dem = { 1: 0, 2: 0, 3: 0 };
  const loi = [];
  for (const tc of TC) {
    const ls = lapLaSo(tc.input);
    for (const cd of CD) {
      const bai = await AI.sinhLuanGiai(ls, cd, { boQuaCache: true });
      for (const m of bai.muc.filter((x) => x.id === 'cach-cuc')) for (const d of m.nhanDinh) {
        const ten = (d.thamChieu.yeuTo ?? []).find((y) => y.startsWith('Cách '));
        if (!ten || /Không Kiếp/.test(ten) || /Hỏa Tham/.test(ten) || /TRANH13|DeuHam/.test(d.thamChieu.quyTacId)) continue;
        const q = KHUNG.find((k) => k.id === d.thamChieu.quyTacId);
        const { muc } = mucCC08(ls, cd, q.dieuKien[0].sao ?? [], ten === 'Cách Sát Phá Tham');
        dem[muc]++;
        const khuyet = /có khuyết/i.test(d.text), dang = /có dáng dấp/i.test(d.text);
        const ok = muc === 3 ? dang && !khuyet : muc === 2 ? khuyet && !dang : !khuyet && !dang;
        if (!ok) loi.push(`${tc.id}/${cd} (mức ${muc}): ${d.thamChieu.quyTacId}: ${d.text.slice(0, 90)}`);
      }
    }
  }
  assert.ok(dem[2] >= 3 && dem[3] >= 3, `mẫu chưa đủ sức: ${JSON.stringify(dem)}`);
  assert.deepEqual(loi, []);
});

test('ngoại lệ Sát Phá Tham: sát tinh đắc địa = 0 điểm, chỉ cho cách Sát Phá Tham; cách khác vẫn tính', () => {
  const { mucCachCuc } = require('../src/lib/luan-giai/ai/khop-v2.ts');
  const ls = lapLaSo(TC[2].input); // TC03: Phu Thê có Hỏa Tinh hãm tọa thủ, Kình (Thìn) và Kiếp (Thân) đắc địa
  const goc = ls.cung.find((c) => c.ten === 'Phu Thê');
  const spt = mucCachCuc(ls, goc, [], true), khac = mucCachCuc(ls, goc, [], false);
  assert.equal(spt.muc, 3);
  assert.deepEqual(spt.ten, ['Hỏa Tinh']);
  assert.ok(khac.ten.length > spt.ten.length);
});

test('phá cách mức 2 xét cả Tuần/Triệt ở chính cung (TC10 Phu Thê Tuần ở chính cung ra "có khuyết")', async () => {
  const tc = TC.find((x) => x.id === 'TC10');
  const ls = lapLaSo(tc.input);
  assert.ok(ls.cung.find((c) => c.ten === 'Phu Thê').tuan);
  const bai = await AI.sinhLuanGiai(ls, 'phu-the', { boQuaCache: true });
  const cc = bai.muc.filter((m) => m.id === 'cach-cuc').flatMap((m) => m.nhanDinh).filter((d) => (d.thamChieu.yeuTo ?? []).some((y) => y.startsWith('Cách ') && !/Không Kiếp/.test(y)));
  assert.ok(cc.length > 0 && cc.every((d) => /có khuyết/.test(d.text)), cc.map((d) => d.text.slice(0, 60)).join('|'));
});

test('TRANH-13: từ ba sát tinh đắc địa ở tứ chính mà không Lộc Tồn/Hóa Lộc thì thêm câu "nhịp nghỉ và tích lũy", không hạ mức', () => {
  const { khopQuyTac } = require('../src/lib/luan-giai/ai/khop-v2.ts');
  const q = KHUNG.find((k) => k.id === 'KHUNG-menh-CC-SatPhaTham-TRANH13');
  assert.ok(q);
  // Lá giả lập: gỡ hết sao ở 4 cung tứ chính của Mệnh rồi đặt Sát Phá Tham + số sát tinh đắc địa cần thử.
  const dung = (nSat, loc) => {
    const ls = JSON.parse(JSON.stringify(lapLaSo(TC[0].input)));
    const goc = ls.cung.find((c) => c.ten === 'Mệnh');
    const o = (d) => ls.cung.find((c) => c.chi === (goc.chi + d + 12) % 12);
    for (const c of ls.cung) { c.chinhTinh = []; c.catTinh = []; c.hungTinh = []; c.phuTinh = []; c.tuan = false; c.triet = false; }
    const sao = (ten, extra = {}) => ({ ten, dacTinhTen: 'Đắc', hoa: null, ...extra });
    o(0).chinhTinh = [sao('Thất Sát', { dacTinhTen: 'Miếu' })]; o(4).chinhTinh = [sao('Phá Quân')]; o(8).chinhTinh = [sao('Tham Lang')];
    const bo = ['Kình Dương', 'Địa Kiếp', 'Hỏa Tinh'].slice(0, nSat);
    bo.forEach((t, i) => { o([0, 4, 8][i]).hungTinh.push(sao(t)); });
    if (loc === 'ton') o(6).catTinh.push(sao('Lộc Tồn'));
    if (loc === 'hoa') o(6).chinhTinh = [sao('Liêm Trinh', { hoa: 'Hóa Lộc' })];
    return ls;
  };
  assert.ok(khopQuyTac(dung(3), q), '3 sát tinh đắc, không Lộc: phải kích hoạt');
  assert.equal(khopQuyTac(dung(2), q), null, 'chỉ 2 sát tinh: không kích hoạt');
  assert.equal(khopQuyTac(dung(3, 'ton'), q), null, 'có Lộc Tồn: không kích hoạt');
  assert.equal(khopQuyTac(dung(3, 'hoa'), q), null, 'có Hóa Lộc: không kích hoạt');
  assert.match(q.noiDung, /nhịp nghỉ và tích lũy/);
});

test('đoạn trùng giữa các bài = 0: câu >= 30 ký tự không xuất hiện ở hai chuyên đề khác nhau', async () => {
  const gap = [];
  for (const tc of TC) {
    const ls = lapLaSo(tc.input);
    const chu = new Map(); // câu → chuyên đề đầu tiên
    for (const cd of CD) {
      const bai = await AI.sinhLuanGiai(ls, cd, { boQuaCache: true });
      for (const m of bai.muc) for (const d of m.nhanDinh) {
        for (const c of d.text.split(/(?<=[.!?])\s+/).filter((x) => x.length >= 30)) {
          if (chu.has(c) && chu.get(c) !== cd) gap.push(`${tc.id}: ${chu.get(c)}/${cd}: ${c.slice(0, 80)}`);
          else chu.set(c, cd);
        }
      }
    }
  }
  assert.equal(gap.length, 0, `${gap.length} câu trùng:\n${gap.slice(0, 8).join('\n')}`);
});
