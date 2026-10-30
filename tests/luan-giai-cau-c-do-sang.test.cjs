// L-28bc46 phần 1: câu hợp chiếu (C) chọn theo độ sáng sao tọa thủ cung chiếu; sao Hãm chưa có C-HAM thì không phát câu C.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
require('./_nap-ts.cjs');
const { lapLaSo } = require('../src/lib/tuvi/index.ts');
const AI = require('../src/lib/luan-giai/ai/index.ts');
const { thieu } = require('../scripts/luan-giai/tao-cho-hanh.cjs');
const QT = require('../src/lib/luan-giai/ai/quy-tac.json');
const TC = require('../docs/nghien-cuu/tuvi-test-cases.json').cases;
const TOT = ['Miếu', 'Vượng', 'Đắc', 'Bình'];
const cauC = (bai) => bai.muc.flatMap((m) => m.nhanDinh).filter((d) => AI.LA_CAU_C.test(d.thamChieu.quyTacId));

test('mọi câu C cũ có điều kiện độ sáng: bản thường chỉ sao sáng/bình, bản -HAM chỉ Hãm', () => {
  const c = QT.filter((q) => AI.LA_CAU_C.test(q.id));
  assert.ok(c.length >= 126);
  for (const q of c) {
    const ds = q.dieuKien?.doSang;
    assert.ok(Array.isArray(ds) && ds.length, `${q.id} thiếu doSang`);
    assert.deepEqual(ds, q.id.endsWith('-HAM') ? ['Hãm'] : TOT, q.id);
  }
});

test('sao ở cung hợp chiếu đang Hãm: không phát câu C nào cho sao đó; sao sáng/bình thì có', async () => {
  let ham = 0, tot = 0;
  for (const tc of TC) {
    const ls = lapLaSo(tc.input);
    for (const cd of ['menh', 'quan-loc', 'phu-the']) {
      const bai = await AI.sinhLuanGiai(ls, cd, { boQuaCache: true });
      for (const d of cauC(bai)) {
        const cung = ls.cung.find((c) => c.ten === d.thamChieu.cung);
        const sao = [...cung.chinhTinh].find((s) => s.ten === d.thamChieu.sao[0]);
        const laHam = d.thamChieu.quyTacId.endsWith('-HAM');
        assert.equal(sao.dacTinhTen === 'Hãm', laHam, `${d.thamChieu.quyTacId}: ${sao.ten} (${sao.dacTinhTen}) ở ${cung.ten}`);
        tot++;
      }
      // mọi chính tinh Hãm ở cung hợp chiếu (có câu C cũ) phải vắng câu C
      for (const q of QT.filter((x) => AI.LA_CAU_C.test(x.id) && x.chuyenDe === cd)) {
        const s = ls.cung.find((c) => c.ten === q.cung).chinhTinh.find((x) => x.ten === q.sao[0]);
        if (s?.dacTinhTen === 'Hãm') { ham++; assert.ok(!cauC(bai).some((d) => d.thamChieu.quyTacId === q.id), `${q.id} phát cho sao Hãm`); }
      }
    }
  }
  assert.ok(ham > 0 && tot > 0, 'bộ mẫu phải có cả hai trường hợp');
});

test('danh sách chờ Hạnh khớp đúng các mã C-HAM còn thiếu', () => {
  const md = fs.readFileSync(path.join(__dirname, '../docs/luan-giai/cho-hanh-C-HAM.md'), 'utf8');
  const ds = thieu();
  assert.ok(ds.length > 0);
  for (const q of ds) assert.ok(md.includes(`| ${q.id}-HAM |`), `${q.id}-HAM thiếu trong cho-hanh-C-HAM.md`);
  assert.ok(md.includes(`**${ds.length}** mã`));
  assert.ok(!md.includes('| ML-S01-C1-HAM |'), 'Tử Vi không bao giờ Hãm');
});
