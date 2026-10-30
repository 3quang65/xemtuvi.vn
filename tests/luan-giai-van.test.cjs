// Kiểm thử chuyên đề "Vận 10 năm" (T-6eb009): đại vận đang đi của lá số mẫu khớp 10 bản Hạnh viết (DV01–DV10),
// mỗi nhận định truy về quy tắc VAN- có thật, sao nằm đúng cung vận / hợp chiếu, sạch từ cấm, có đệm cache theo năm xem.
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
// Đầu vào 10 lá số mẫu lấy từ dữ liệu đại vận do engine sinh (docs/luan-giai/dai-van/du-lieu.md).
const CASES = [...fs.readFileSync(path.join(__dirname, '../docs/luan-giai/dai-van/du-lieu.md'), 'utf8').matchAll(/Đầu vào: `(\{.*\})`/g)].map((m) => ({ input: JSON.parse(m[1]) }));
assert.equal(CASES.length, 10);
const TU_CAM = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/luan-giai/ai/tu-cam.json'), 'utf8'));
const docQV = (t) => JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/luan-giai/ai/quy-tac-van/', t), 'utf8'));
const QV = [...docQV('van-10-nam.json'), ...docQV('van-10-nam-sp.json'), ...docQV('van-10-nam-pp.json')];
const chuan = (s) => s.toLowerCase().replace(/\s+/g, '');
const tatCa = (ls, ten) => { const c = ls.cung.find((x) => x.ten === ten); return [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh]; };
// Năm âm lịch xem cố định = 2026 (dữ liệu mẫu DV sinh với năm xem 2026).
const NAM_XEM = 2026;

CASES.forEach((tc, i) => {
  const ma = 'DV' + String(i + 1).padStart(2, '0');
  const md = fs.readFileSync(path.join(__dirname, `../docs/luan-giai/dai-van/${ma}.md`), 'utf8');
  const [, tu, den, cungMau] = md.match(/— (\d+)–(\d+) tuổi, cung ([^(]+?) \(/);
  test(`${ma}: đại vận ${tu}–${den} cung ${cungMau} khớp bản mẫu, nhận định truy được`, async () => {
    const ls = lapLaSo(tc.input);
    const bai = await AI.sinhLuanGiai(ls, 'van-10-nam', { boQuaCache: true, namXem: NAM_XEM });
    assert.equal(bai.chuyenDe, 'van-10-nam');
    assert.ok(bai.van, 'phải có thông tin vận');
    assert.equal(bai.van.cung, cungMau);
    assert.equal(bai.van.tuoiTu, +tu);
    assert.equal(bai.van.tuoiDen, +den);
    assert.equal(bai.van.namTu, ls.am.nam + +tu - 1);
    assert.equal(bai.van.namDen, ls.am.nam + +den - 1);
    assert.match(bai.ghiChu, /do hệ thống xemtuvi\.vn tạo tự động/);
    const nd = bai.muc.flatMap((m) => m.nhanDinh);
    assert.ok(nd.length >= 3, `${ma} chỉ có ${nd.length} nhận định`);
    assert.ok(bai.muc[0].nhanDinh.some((d) => d.thamChieu.quyTacId.startsWith('VAN-CUNG-')), 'mục đầu nêu chủ đề cung vận');
    for (const d of nd) {
      const q = QV.find((x) => x.id === d.thamChieu.quyTacId);
      assert.ok(q, `quy tắc ${d.thamChieu.quyTacId} không tồn tại`);
      assert.match(q.id, /^VAN-/);
      assert.ok(d.thamChieu.nguon && d.thamChieu.truongPhai);
      assert.equal(d.thamChieu.cung, cungMau, 'cung gốc là cung vận');
      const cungs = d.thamChieu.cungLienQuan ?? [d.thamChieu.cung];
      const sao = cungs.flatMap((c) => tatCa(ls, c));
      for (const s of d.thamChieu.sao) assert.ok(sao.some((x) => x.ten === s), `${s} không ở ${cungs.join(', ')}`);
    }
    const het = chuan(JSON.stringify(bai));
    for (const c of TU_CAM.tuCam) assert.ok(!het.includes(chuan(c)), `còn từ cấm: ${c}`);
  });
});

test('Quy tắc VAN-: id duy nhất, nội dung ≥ 40 ký tự, có nguồn và trường phái', () => {
  assert.ok(QV.length >= 40);
  assert.equal(new Set(QV.map((q) => q.id)).size, QV.length);
  for (const q of QV) {
    assert.equal(q.chuyenDe, 'van-10-nam');
    assert.ok(q.noiDung.length >= 40, q.id);
    assert.ok(q.nguon.length && q.truongPhai && q.maNghienCuu.length, q.id);
  }
});

test('Chưa tới tuổi vào đại vận: không có vận, không có nhận định, không lỗi', async () => {
  const ls = lapLaSo(CASES[0].input);
  const bai = await AI.sinhLuanGiai(ls, 'van-10-nam', { boQuaCache: true, namXem: ls.am.nam });
  assert.equal(bai.van, null);
  assert.deepEqual(bai.muc, []);
});

test('Cache tách theo đại vận: xem năm khác cùng đại vận trùng khóa, khác đại vận khác khóa', async () => {
  const ls = lapLaSo(CASES[0].input);
  const a = await AI.sinhLuanGiai(ls, 'van-10-nam', { boQuaCache: true, namXem: 2026 });
  const b = await AI.sinhLuanGiai(ls, 'van-10-nam', { boQuaCache: true, namXem: 2029 });
  const c = await AI.sinhLuanGiai(ls, 'van-10-nam', { boQuaCache: true, namXem: 2036 });
  assert.deepEqual(a, b);
  assert.notEqual(a.van.cung, c.van.cung);
  assert.notEqual(AI.khoaVan(ls, a.van.cung), AI.khoaVan(ls, c.van.cung));
});

test('Ba chuyên đề cũ không đổi: Mệnh vẫn có nhận định', async () => {
  const ls = lapLaSo(CASES[0].input);
  const bai = await AI.sinhLuanGiai(ls, 'menh', { boQuaCache: true });
  assert.ok(bai.muc.flatMap((m) => m.nhanDinh).length >= 5);
  assert.equal(bai.van, undefined);
});

// Nhóm VAN-SP (sao phụ ở vận, T-3d77b2): điều kiện máy đọc từ docs/nghien-cuu/luan-giai/dai-van.md mục 3.
test('VAN-SP: có ≥ 20 quy tắc, id VAN-SP-, mục hợp lệ, mã nghiên cứu có thật trong tài liệu', () => {
  const sp = QV.filter((q) => q.id.startsWith('VAN-SP-'));
  assert.ok(sp.length >= 20, `chỉ có ${sp.length}`);
  const md = fs.readFileSync(path.join(__dirname, '../docs/nghien-cuu/luan-giai/dai-van.md'), 'utf8');
  const hopLe = new Set(['thuan-loi', 'chu-y', 'xung-quanh', 'goi-y']);
  for (const q of sp) {
    assert.ok(hopLe.has(q.muc), `${q.id} mục ${q.muc}`);
    assert.ok(q.dieuKien.length, `${q.id} phải có điều kiện`);
    for (const m of q.maNghienCuu) assert.ok(md.includes(`[${m}]`), `${q.id}: ${m} không có trong tài liệu`);
  }
});

test('Mục chuyên đề van-10-nam theo cấu trúc DV: chu-de, thuan-loi, chu-y, xung-quanh, goi-y', () => {
  const cd = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/luan-giai/ai/chuyen-de.json'), 'utf8'))['van-10-nam'];
  assert.deepEqual(cd.muc.map((m) => m.id), ['chu-de', 'thuan-loi', 'chu-y', 'xung-quanh', 'goi-y']);
  for (const q of QV) assert.ok(cd.muc.some((m) => m.id === q.muc), `${q.id} mục ${q.muc} không tồn tại`);
});

test('10 mẫu: mỗi bài có ≥ 1 nhận định ở mục thuan-loi; sao VAN-SP nằm đúng cung tam phương của vận', async () => {
  for (const [i, tc] of CASES.entries()) {
    const ls = lapLaSo(tc.input);
    const bai = await AI.sinhLuanGiai(ls, 'van-10-nam', { boQuaCache: true, namXem: NAM_XEM });
    const tl = bai.muc.find((m) => m.id === 'thuan-loi');
    assert.ok(tl && tl.nhanDinh.length >= 1, `DV${i + 1} thiếu mục thuận lợi`);
    const goc = ls.cung.find((c) => c.ten === bai.van.cung);
    const tp = [0, 6, 4, 8].map((d) => ls.cung.find((c) => c.chi === (goc.chi + d) % 12));
    for (const d of bai.muc.flatMap((m) => m.nhanDinh).filter((x) => x.thamChieu.quyTacId.startsWith('VAN-SP-'))) {
      const co = tp.flatMap((c) => [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh]);
      for (const s of d.thamChieu.sao) assert.ok(co.some((x) => x.ten === s), `DV${i + 1} ${d.thamChieu.quyTacId}: ${s} không ở tam phương vận`);
    }
  }
});

test('Độ dài bài sinh ≥ 80% bản Hạnh (DV01–DV10), trung bình ≥ 85%', async () => {
  const tl = [];
  for (const [i, tc] of CASES.entries()) {
    const ma = 'DV' + String(i + 1).padStart(2, '0');
    const md = fs.readFileSync(path.join(__dirname, `../docs/luan-giai/dai-van/${ma}.md`), 'utf8').replace(/<!--.*?-->/g, '');
    const bai = await AI.sinhLuanGiai(lapLaSo(tc.input), 'van-10-nam', { boQuaCache: true, namXem: NAM_XEM });
    const len = bai.muc.flatMap((m) => m.nhanDinh).map((n) => n.text).join(' ').length;
    tl.push(len / md.length);
    assert.ok(len / md.length >= 0.8, `${ma}: ${(len / md.length * 100).toFixed(0)}%`);
  }
  assert.ok(tl.reduce((a, b) => a + b, 0) / tl.length >= 0.85, 'trung bình < 85%');
});

// Nhân hòa (VAN-PP-12/14/15): chính tinh vận cùng nhóm hay khác nhóm chính tinh Mệnh (tính độc lập trong test).
const NHOM = {
  A: ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng'],
  B: ['Thất Sát', 'Phá Quân', 'Liêm Trinh', 'Tham Lang'],
  C: ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương', 'Cự Môn', 'Thái Dương'],
};
// Sao chủ của cung = chính tinh sáng nhất (bằng nhau thì sao đứng trước); Mệnh/vận vô chính diệu mượn chính tinh cung xung (L-eabb8d).
const THU_TU = ['Miếu', 'Vượng', 'Đắc', 'Bình', 'Hãm'];
const nhomChu = (ls, c) => {
  const nguon = c.chinhTinh.length ? c : ls.cung.find((x) => x.chi === (c.chi + 6) % 12);
  const chu = [...nguon.chinhTinh].sort((a, b) => THU_TU.indexOf(a.dacTinhTen) - THU_TU.indexOf(b.dacTinhTen))[0];
  return chu ? { nhom: Object.keys(NHOM).find((k) => NHOM[k].includes(chu.ten)), sang: chu.dacTinhTen } : null;
};
test('Nhân hòa VAN-PP: khớp theo nhóm của sao chủ Mệnh và sao chủ vận (mượn cung xung nếu vô chính diệu); cùng nhóm mà sao vận hãm thì không khen', async () => {
  let dem = 0;
  for (const [i, tc] of CASES.entries()) {
    const ls = lapLaSo(tc.input);
    const bai = await AI.sinhLuanGiai(ls, 'van-10-nam', { boQuaCache: true, namXem: NAM_XEM });
    const van = ls.cung.find((c) => c.ten === bai.van.cung);
    const nm = nhomChu(ls, ls.cung.find((c) => c.ten === 'Mệnh'));
    const nv = nhomChu(ls, van);
    const co = bai.muc.flatMap((m) => m.nhanDinh).filter((x) => /^VAN-PP-1[245]-/.test(x.thamChieu.quyTacId));
    const mong = nm && nv && !(nm.nhom === nv.nhom && nv.sang === 'Hãm') ? 1 : 0;
    assert.equal(co.length, mong, `DV${i + 1}: Mệnh ${nm?.nhom} vận ${nv?.nhom} (${nv?.sang})`);
    if (co.length) { dem++; assert.ok(co[0].thamChieu.cungLienQuan.includes('Mệnh')); }
  }
  assert.ok(dem >= 4, `chỉ ${dem}/10 mẫu có nhân hòa`);
});
