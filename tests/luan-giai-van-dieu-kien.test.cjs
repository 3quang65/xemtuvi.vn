// Điều kiện khớp quy tắc Vận 10 năm theo phiếu kiểm duyệt của Thư (việc L-eabb8d): không nêu sao không có, không mâu thuẫn
// sáng/hãm, không khen khi sao hãm, nhân hòa phủ ≥ 85% bài. Đo trên 200 lá số (DV01–DV10 + 190 ngẫu nhiên 1965–2009).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const nap = require('./_nap-ts.cjs');
const { lapLaSo } = nap('lib/tuvi/index.ts');
const AI = nap('lib/luan-giai/ai/index.ts');
const { khopDieuKien } = nap('lib/luan-giai/ai/khop-v2.ts');

const CASES = [...fs.readFileSync(path.join(__dirname, '../docs/luan-giai/dai-van/du-lieu.md'), 'utf8').matchAll(/Đầu vào: `(\{.*\})`/g)].map((m) => JSON.parse(m[1]));
let seed = 7;
const rnd = (n) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };
for (let i = 0; i < 190; i++) CASES.push({ ...CASES[0], nam: 1965 + rnd(45), thang: 1 + rnd(12), ngay: 1 + rnd(28), gio: rnd(24), gioiTinh: rnd(2) ? 'nam' : 'nu', phut: 0 });

const DAC = ['Miếu', 'Vượng', 'Đắc'];
const tatCa = (c) => [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh];
const CAP = [
  [/SP-06-/, ['Văn Xương', 'Văn Khúc']],
  [/SP-10[AC]/, ['Hỏa Tinh', 'Linh Tinh']],
  [/SP-11(-kho|-kie)?$/, ['Địa Không', 'Địa Kiếp']],
  [/SP-15-(SANG|HAM)/, ['Đại Hao', 'Tiểu Hao']],
  [/SP-19-(CY|DAC)/, ['Thiên Khốc', 'Thiên Hư']],
];
const SANG = /SP-06-.*SANG|SP-10A|SP-15-SANG|SP-19-DAC/;
const HAM = /SP-06-.*HAM|SP-10C|SP-15-HAM|SP-19-CY/;
const hoVan = (id) => (id.match(/SP-(06|10|15|19)/) || [])[1];

let ketQua;
async function chay() {
  if (ketQua) return ketQua;
  const st = { n: 0, xaoSao: 0, mauThuan: 0, pqHam: 0, nhanHoaHam: 0, nhanHoa: 0, locmaTT: 0, dongLuc: 0, tuoiNho: 0, vanDuoi16: 0 };
  for (const inp of CASES) {
    const ls = lapLaSo(inp);
    const bai = await AI.sinhLuanGiai(ls, 'van-10-nam', { boQuaCache: true, namXem: 2026 });
    if (!bai.van) continue;
    st.n++;
    const nd = bai.muc.flatMap((m) => m.nhanDinh);
    const ids = nd.map((d) => d.thamChieu.quyTacId);
    const van = ls.cung.find((c) => c.ten === bai.van.cung);
    const tp = [0, 4, 6, 8].map((o) => ls.cung.find((c) => c.chi === (van.chi + o) % 12));
    const ten = new Set(tp.flatMap(tatCa).map((s) => s.ten));
    if (nd.some((d) => CAP.some(([re, p]) => re.test(d.thamChieu.quyTacId) && p.some((s) => d.text.includes(s) && !ten.has(s))))) st.xaoSao++;
    const fs_ = new Set(ids.filter((x) => SANG.test(x)).map(hoVan));
    if (ids.filter((x) => HAM.test(x)).some((x) => fs_.has(hoVan(x)))) st.mauThuan++;
    if (ids.some((x) => /SP-11-PQ/.test(x)) && tp.flatMap(tatCa).some((s) => s.ten === 'Phá Quân' && !DAC.includes(s.dacTinhTen))) st.pqHam++;
    if (ids.some((x) => /^VAN-PP-1[2456]/.test(x))) st.nhanHoa++;
    if (ids.some((x) => /^VAN-PP-12-(AA|BB|CC)(-VCD)?$/.test(x))) {
      const nguon = van.chinhTinh.length ? van : tp[2];
      const tot = ['Miếu', 'Vượng', 'Đắc', 'Bình', 'Hãm'];
      const chu = [...nguon.chinhTinh].sort((a, b) => tot.indexOf(a.dacTinhTen) - tot.indexOf(b.dacTinhTen))[0];
      if (chu.dacTinhTen === 'Hãm') st.nhanHoaHam++;
    }
    if (ids.includes('VAN-SP-03-LOCMA') && ids.some((x) => /SP-04-(TT|TR|KK)$/.test(x))) st.locmaTT++;
    if (ids.includes('VAN-SP-08-DONGLUC') && ids.includes('VAN-SP-08-DAC')) st.dongLuc++;
    if (bai.van.tuoiTu < 16 && ids.some((x) => /SP-(01-TOT|07-TOT|14-VUI|11-GY)/.test(x))) st.tuoiNho++;
  }
  return (ketQua = st);
}

test('Vận 10 năm: không bài nào nêu tên sao không có trong tam phương (cặp Xương Khúc, Hỏa Linh, Không Kiếp, Hao, Khốc Hư)', async () => {
  assert.equal((await chay()).xaoSao, 0);
});
test('Vận 10 năm: không bài nào có hai câu cùng cặp sao vừa sáng vừa hãm', async () => {
  assert.equal((await chay()).mauThuan, 0);
});
test('Vận 10 năm: Không Kiếp gặp Phá Quân chỉ khi Phá Quân miếu/vượng/đắc', async () => {
  assert.equal((await chay()).pqHam, 0);
});
test('Vận 10 năm: nhân hòa cùng nhóm không khen khi sao chủ của vận hãm', async () => {
  assert.equal((await chay()).nhanHoaHam, 0);
});
test('Vận 10 năm: ≥ 85% bài có câu nhân hòa (PP-12/14/15)', async () => {
  const s = await chay();
  assert.ok(s.nhanHoa / s.n >= 0.85, `${s.nhanHoa}/${s.n}`);
});
test('Vận 10 năm: Lộc Mã không đi cùng Mã bị Tuần/Triệt/Không Kiếp; Kình đắc không in hai câu trùng ý; vận dưới 16 tuổi không có câu đi làm/tình cảm/vay mượn', async () => {
  const s = await chay();
  assert.equal(s.locmaTT, 0);
  assert.equal(s.dongLuc, 0);
  assert.equal(s.tuoiNho, 0);
});
test('Quy tắc Vận 10 năm không còn mã chết PP-07-HAM-TửVi / ThiênPhủ', () => {
  const pp = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/luan-giai/ai/quy-tac-van/van-10-nam-pp.json'), 'utf8'));
  assert.ok(!pp.some((q) => /PP-07-HAM-(TửVi|ThiênPhủ)$/.test(q.id)));
});

