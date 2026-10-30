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
const QV = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/luan-giai/ai/quy-tac-van/van-10-nam.json'), 'utf8'));
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
