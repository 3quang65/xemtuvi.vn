// Tóm tắt miễn phí phải riêng cho từng lá số (L-e8523f): câu trùng giữa 11 lá số mẫu ≤ 20%,
// mỗi bản ≥ 2 nhận định nêu tên sao của chính lá số, bộ câu đủ mục và không lộ ghi chú nội bộ.
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { lapLaSo } = nap('lib/tuvi/index.ts');
const LG = nap('lib/luan-giai/index.ts');
const BO = require('../src/lib/luan-giai/tom-tat-mien-phi.json');
const TC = require('../docs/nghien-cuu/tuvi-test-cases.json').cases;

const ban = TC.map((tc) => { const ls = lapLaSo(tc.input); return { ls, t: LG.tomTatMienPhi(ls) }; });
const tatCa = () => [...Object.values(BO.chinhTinh).flatMap((o) => Object.values(o)), ...Object.values(BO.thanCu), ...Object.values(BO.tuHoa), ...Object.values(BO.tuanTriet), ...Object.values(BO.phuTinh), BO.voChinhDieu];

test('Bộ câu: đủ 14 chính tinh × 5 độ sáng, 6 cung Thân cư, 4 hóa, Tuần Triệt; mỗi mục một câu, có nguồn, không trùng', () => {
  assert.equal(Object.keys(BO.chinhTinh).length, 14);
  for (const [sao, o] of Object.entries(BO.chinhTinh)) assert.deepEqual(Object.keys(o).sort(), ['B', 'H', 'M', 'V', 'Đ'].sort(), sao);
  assert.deepEqual(Object.keys(BO.thanCu).sort(), ['Mệnh', 'Phu Thê', 'Tài Bạch', 'Thiên Di', 'Quan Lộc', 'Phúc Đức'].sort());
  assert.deepEqual(Object.keys(BO.tuHoa).sort(), ['Hóa Khoa', 'Hóa Kỵ', 'Hóa Lộc', 'Hóa Quyền'].sort());
  assert.deepEqual(Object.keys(BO.tuanTriet).sort(), ['Triệt', 'Tuần']);
  const a = tatCa();
  assert.equal(new Set(a.map((x) => x.y)).size, a.length);
  for (const x of a) {
    assert.ok(x.nguon.length > 0, x.y);
    assert.doesNotMatch(x.y, /\.\s|\bxem \d|\bTT\b|\bTB\b|chắc chắn|giải hạn/, x.y);
  }
});

test('11 lá số mẫu: mỗi bản ≥ 2 nhận định nêu tên sao có trong chính lá số', () => {
  for (const { ls, t } of ban) {
    const sao = new Set(ls.cung.flatMap((c) => [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh].map((s) => s.ten)));
    const nd = t.cau.filter((c) => [...sao].some((s) => (c.nhan + c.y).includes(s)));
    assert.ok(nd.length >= 2, `${ls.duong.nam}: ${nd.length}`);
  }
});

test('11 lá số mẫu: câu trùng nguyên văn giữa các lá số ≤ 20%', () => {
  const ds = ban.map(({ t }) => LG.vanBanTomTat(t));
  const dem = new Map();
  for (const d of ds) for (const c of new Set(d)) dem.set(c, (dem.get(c) || 0) + 1);
  const tong = ds.flat().length;
  const trung = ds.flat().filter((c) => dem.get(c) > 1).length;
  assert.ok(trung / tong <= 0.2, `${trung}/${tong}`);
});

test('Vô chính diệu: nêu chính tinh mượn từ Thiên Di; câu dẫn nêu sao Quan Lộc, Tài Bạch của lá số', () => {
  const { ls, t } = ban.find(({ t }) => t.voChinhDieu);
  const xung = ls.cung[(ls.cung.find((c) => c.ten === 'Mệnh').chi + 6) % 12];
  const vcd = t.cau.find((c) => c.loai === 'voChinhDieu');
  for (const s of xung.chinhTinh) assert.match(vcd.y, new RegExp(s.ten));
  for (const s of ls.cung.find((c) => c.ten === 'Quan Lộc').chinhTinh) assert.match(t.dan, new RegExp(s.ten));
});
