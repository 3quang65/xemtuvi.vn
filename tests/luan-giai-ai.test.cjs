// Kiểm thử module sinh luận giải theo chuyên đề (src/lib/luan-giai/ai). Nạp TS qua typescript, không mạng.
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
const { locTuCam, kiemTraMaSauViet } = require('../src/lib/luan-giai/ai/loc.ts');
const TC = require('../docs/nghien-cuu/tuvi-test-cases.json').cases.slice(0, 5);
const DIR = path.join(__dirname, '../src/lib/luan-giai/ai');
const QT = JSON.parse(fs.readFileSync(path.join(DIR, 'quy-tac.json'), 'utf8'));
const TU_CAM = JSON.parse(fs.readFileSync(path.join(DIR, 'tu-cam.json'), 'utf8'));
const CHUYEN_DE = ['menh', 'quan-loc', 'phu-the'];
const chuan = (s) => s.toLowerCase().replace(/\s+/g, '');
const tatCa = (ls, cung) => { const c = ls.cung.find((x) => x.ten === cung); return c && [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh]; };
const tong = { n: 0, bai: 0 };

for (const tc of TC) {
  for (const cd of CHUYEN_DE) {
    test(`${tc.id} × ${cd}: ≥5 nhận định, tham chiếu thật, sạch từ cấm, có ghi chú`, async () => {
      const ls = lapLaSo(tc.input);
      const bai = await AI.sinhLuanGiai(ls, cd, { boQuaCache: true });
      assert.equal(bai.chuyenDe, cd);
      assert.match(bai.ghiChu, /do hệ thống xemtuvi\.vn tạo tự động/);
      assert.ok(bai.phienBan);
      const nd = bai.muc.flatMap((m) => m.nhanDinh);
      assert.ok(nd.length >= 5, `${tc.id}/${cd} chỉ có ${nd.length}`);
      tong.n += nd.length; tong.bai++;
      for (const m of bai.muc) assert.ok(m.nhanDinh.length > 0 && m.id && m.tieuDe);
      for (const d of nd) {
        const q = QT.find((x) => x.id === d.thamChieu.quyTacId);
        assert.ok(q, `quy tắc ${d.thamChieu.quyTacId} không tồn tại`);
        assert.equal(d.thamChieu.cung, q.cung);
        assert.ok(d.thamChieu.nguon && d.thamChieu.truongPhai);
        const sao = tatCa(ls, d.thamChieu.cung);
        assert.ok(sao, `cung ${d.thamChieu.cung} không có trong lá số`);
        for (const s of d.thamChieu.sao) assert.ok(sao.some((x) => x.ten === s), `${s} không ở cung ${d.thamChieu.cung}`);
      }
      const het = chuan(JSON.stringify(bai));
      for (const c of TU_CAM.tuCam) assert.ok(!het.includes(chuan(c)), `còn từ cấm: ${c}`);
    });
  }
}

test('Lần gọi thứ 2 trúng cache (bộ nhớ, rồi file sau khi xóa bộ nhớ)', async () => {
  const ls = lapLaSo(TC[0].input);
  AI.xoaBoNho();
  const a = await AI.sinhLuanGiai(ls, 'menh');
  const t0 = AI.thongKeCache();
  const b = await AI.sinhLuanGiai(ls, 'menh');
  assert.deepEqual(b, a);
  assert.equal(AI.thongKeCache().trung, t0.trung + 1);
  AI.xoaBoNho();
  const t1 = AI.thongKeCache();
  const c = await AI.sinhLuanGiai(ls, 'menh');
  assert.deepEqual(c, a);
  assert.equal(AI.thongKeCache().trung, t1.trung + 1);
  const khac = await AI.sinhLuanGiai(ls, 'quan-loc');
  assert.notDeepEqual(khac.muc, a.muc);
});

test('Khóa cache khác nhau theo giới tính / giờ sinh / chuyên đề', () => {
  const l1 = lapLaSo(TC[0].input);
  const l2 = lapLaSo({ ...TC[0].input, gioiTinh: 'nam' });
  const k = (l, c) => AI.khoaCache(l, c, 'v');
  assert.notEqual(k(l1, 'menh'), k(l2, 'menh'));
  assert.notEqual(k(l1, 'menh'), k(l1, 'phu-the'));
  assert.equal(k(l1, 'menh'), k(lapLaSo(TC[0].input), 'menh'));
});

test('Bộ lọc từ cấm: thay được thì thay, không thay được thì bỏ câu; bỏ qua hoa thường/dấu cách', () => {
  const tc = { tuCam: ['giải hạn', 'tai họa'], thayThe: { 'tai họa': 'điều bất lợi' } };
  assert.equal(locTuCam('Nên tránh TAI  HỌA nhé', tc), 'Nên tránh điều bất lợi nhé');
  assert.equal(locTuCam('Cần Giải   Hạn gấp', tc), null);
  assert.equal(locTuCam('Câu bình thường', tc), 'Câu bình thường');
  assert.equal(locTuCam('taihọa và giải hạn', tc), null);
});

test('Câu thử chứa từ cấm bị chặn trong toàn pipeline (nhà cung cấp giả viết lại)', async () => {
  const ls = lapLaSo(TC[1].input);
  const bai = await AI.sinhLuanGiai(ls, 'menh', {
    boQuaCache: true,
    nhaCungCap: {
      ten: 'thu',
      async vietLai(cau) {
        return cau.map((c, i) => (i === 0 ? `Cần cúng sao giải hạn gấp [${c.id}]` : i === 1 ? `Sẽ gặp tai họa [${c.id}]` : i === 2 ? `Câu thêm không mã` : `${c.noiDung} [${c.id}]`)).join('\n');
      },
    },
  });
  const hs = chuan(JSON.stringify(bai));
  assert.ok(!hs.includes(chuan('giải hạn')) && !hs.includes(chuan('cúng sao')) && !hs.includes(chuan('tai họa')));
  assert.ok(!hs.includes('câuthêmkhôngmã'));
  assert.ok(bai.muc.flatMap((m) => m.nhanDinh).length >= 3);
});

test('Sau khi AI viết lại: câu không mã hoặc mã lạ bị bỏ; mã hợp lệ được giữ và gắn tham chiếu', () => {
  const hopLe = new Set(['A-1', 'A-2']);
  const r = kiemTraMaSauViet('Câu một [A-1]\nCâu không mã\nCâu mã lạ [Z-9]\nCâu hai [A-2]', hopLe);
  assert.deepEqual(r, [{ text: 'Câu một', id: 'A-1' }, { text: 'Câu hai', id: 'A-2' }]);
});

test('Nhà cung cấp "claude" mặc định TẮT: không biến môi trường thì dùng stub, không gọi mạng', async () => {
  const goi = process.env.LUANGIAI_AI;
  delete process.env.LUANGIAI_AI;
  const ls = lapLaSo(TC[2].input);
  const bai = await AI.sinhLuanGiai(ls, 'phu-the', { boQuaCache: true, nhaCungCap: 'claude' });
  assert.ok(bai.muc.flatMap((m) => m.nhanDinh).length >= 5);
  assert.equal(AI.nhaCungCapDangDung('claude'), 'stub');
  process.env.LUANGIAI_AI = 'claude';
  assert.equal(AI.nhaCungCapDangDung('claude'), 'claude');
  assert.equal(AI.nhaCungCapDangDung(undefined), 'stub');
  if (goi === undefined) delete process.env.LUANGIAI_AI; else process.env.LUANGIAI_AI = goi;
});

test.after(() => console.log(`# trung bình ${(tong.n / tong.bai).toFixed(1)} nhận định/bài (${tong.bai} bài)`));
