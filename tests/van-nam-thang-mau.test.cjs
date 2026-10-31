// L-e1df92 (phiếu Thư): chọn tháng mẫu xem trước, chữ cố định khớp bài trả phí, Quyền+Kỵ, Tuần/Triệt, chữ quy tắc theo tháng.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => {
  m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText, f);
};
const { lapLaSo } = require('../src/lib/tuvi/index.ts');
const VN = require('../src/lib/luan-giai/ai/van-nam.ts');
const ND = require('../src/lib/van-nam-noi-dung.ts');

const U = (thang, o = {}) => ({ thang, thangMoc: false, coKy: false, cau: ['a', 'b'], coTenSao: true, ...o });

test('chonThangMau: đạt chuẩn (>=2 câu, có tên sao, không Kỵ) thắng; ưu tiên tháng mốc; rồi tháng sớm', () => {
  assert.equal(VN.chonThangMau([U(1, { cau: ['a'] }), U(2, { coTenSao: false }), U(3), U(4, { thangMoc: true })]).thang, 4);
  assert.equal(VN.chonThangMau([U(1, { cau: ['a'] }), U(2), U(3)]).thang, 2);
});
test('chonThangMau: không chọn tháng có Hóa Kỵ khi còn lựa chọn khác', () => {
  assert.equal(VN.chonThangMau([U(1, { coKy: true, thangMoc: true }), U(2, { cau: ['a'] })]).thang, 2);
});
test('chonThangMau: không tháng nào đạt thì lấy tháng tốt nhất còn lại; hết cách mới null', () => {
  assert.equal(VN.chonThangMau([U(1, { cau: ['a'], coTenSao: false }), U(2, { cau: ['a', 'b'], coTenSao: false })]).thang, 2);
  assert.equal(VN.chonThangMau([U(1, { coKy: true }), U(2, { cau: [] })]).thang, 1);
  assert.equal(VN.chonThangMau([U(1, { cau: [] })]), null);
  assert.equal(VN.chonThangMau([]), null);
});

test('XEM_TRUOC: không hứa việc nên làm theo tháng / gợi ý cho tháng còn lại', () => {
  const het = ND.XEM_TRUOC.ghiChuThang + ' ' + ND.XEM_TRUOC.khoa;
  assert.ok(!/việc nên làm theo từng tháng|gợi ý cho các tháng/i.test(het));
  assert.ok(/nhận định/i.test(ND.XEM_TRUOC.ghiChuThang));
  assert.ok(/việc nên làm/i.test(ND.XEM_TRUOC.khoa) || !/việc nên làm/i.test(het));
});

const LA = [
  ND.LA_SO_MAU,
  { lich: 'duong', ngay: 1, thang: 1, nam: 2000, gio: 9, gioiTinh: 'nam' },
  { lich: 'duong', ngay: 22, thang: 3, nam: 1988, gio: 3, gioiTinh: 'nu' },
  { lich: 'duong', ngay: 9, thang: 11, nam: 1975, gio: 17, gioiTinh: 'nam' },
  { lich: 'duong', ngay: 30, thang: 6, nam: 2003, gio: 21, gioiTinh: 'nu' },
  { lich: 'duong', ngay: 14, thang: 2, nam: 1982, gio: 12, gioiTinh: 'nu' },
  { lich: 'duong', ngay: 5, thang: 9, nam: 1968, gio: 6, gioiTinh: 'nam' },
  { lich: 'duong', ngay: 18, thang: 12, nam: 1999, gio: 23, gioiTinh: 'nu' },
];

test('8 lá số: tháng mẫu >=2 câu, có tên sao, không mã quy tắc, không tháng Hóa Kỵ', async () => {
  for (const inp of LA) {
    const ls = lapLaSo(inp);
    const xt = VN.xemTruocVanNam(ls);
    const bai = await VN.sinhVanNam(ls, { boQuaCache: true });
    const t = xt.thangMau;
    assert.ok(t && t.cau.length >= 2, JSON.stringify(inp));
    const nd = bai.thang[t.thang - 1].nhanDinh;
    const ten = nd.flatMap((x) => x.thamChieu.sao).map((s) => s.replace(/^L\. /, ''));
    assert.ok(t.cau.some((c) => ten.some((s) => c.includes(s))), 'không câu nào nêu tên sao: ' + JSON.stringify(inp));
    assert.ok(!/NAM-|quyTacId/.test(JSON.stringify(t)));
    assert.ok(!nd.some((x) => /^NAM-HOA-KY/.test(x.thamChieu.quyTacId)), 'tháng mẫu chứa Hóa Kỵ');
  }
});

test('bản trả phí: không còn "năm nay", "A/B", "nhà cửa, chi tiêu" trong mục tháng; Quyền+Kỵ nêu đủ; Tuần/Triệt có câu', async () => {
  let coCaHai = 0, coTuanTriet = 0;
  for (const inp of LA) {
    const ls = lapLaSo(inp);
    const bai = await VN.sinhVanNam(ls, { boQuaCache: true });
    for (const t of bai.thang) {
      const ids = t.nhanDinh.map((x) => x.thamChieu.quyTacId);
      for (const x of t.nhanDinh) {
        assert.ok(!/Khôi\/Thiên Việt|Không\/Địa Kiếp|nhà cửa, chi tiêu|\{sao/.test(x.text), x.thamChieu.quyTacId + ': ' + x.text);
        // L-5f6b69: mục tháng nói theo tháng, không câu nào còn "năm nay"/"năm thuận".
        assert.ok(!/năm nay|năm thuận/i.test(x.text), x.thamChieu.quyTacId + ': ' + x.text);
        // L-91613b: nghĩa học hành/tay nghề chỉ ở Quan Lộc, Mệnh.
        if (!['Quan Lộc', 'Mệnh'].includes(t.cung)) assert.ok(!/chứng chỉ|tay nghề/.test(x.text), x.thamChieu.quyTacId + '@' + t.cung + ': ' + x.text);
      }
      if (ids.some((i) => /^NAM-HOA-QUYEN/.test(i)) && ids.some((i) => /^NAM-HOA-KY/.test(i))) coCaHai++;
      if (ids.includes('NAM-THANG-04-TUAN-TRIET')) coTuanTriet++;
    }
    // Tháng nào cung có lưu hóa/sao lưu + Tuần/Triệt thì phải có câu.
    for (const t of bai.thang) {
      const c = ls.cung.find((x) => x.ten === t.cung);
      const co = t.nhanDinh.some((x) => x.thamChieu.quyTacId === 'NAM-THANG-04-TUAN-TRIET');
      if (co) assert.ok(c.tuan || c.triet);
    }
  }
  assert.ok(coCaHai >= 1, 'chưa gặp tháng có cả Quyền và Kỵ trong 8 lá');
  assert.ok(coTuanTriet >= 1, 'chưa gặp câu Tuần/Triệt trong 8 lá');
});

test('L-5f6b69: quy tắc có thể vào mục tháng mà chữ còn "năm nay" thì phải có noiDungThang sạch; chữ theo cung đủ 12 cung', () => {
  const Q = JSON.parse(fs.readFileSync(require('node:path').join(__dirname, '../src/lib/luan-giai/ai/quy-tac-van/van-nam-2027.json'), 'utf8'));
  const CUNG = ['Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'];
  for (const q of Q.filter((x) => x.lop === 'cung-goc' && x.id !== 'NAM-TT-06' && x.muc !== 'su-nghiep' && !/-NHIP$|-NEN$/.test(x.id))) {
    const thang = q.noiDungThang ?? [q.noiDung, ...Object.values(q.noiDungTheoCung ?? {})].join(' ');
    assert.ok(!/năm nay|năm thuận/i.test(thang), q.id);
  }
  // L-91613b: Khoa/Quyền/Kỵ của năm cũng viết riêng theo 12 cung.
  for (const id of ['NAM-HOA-LOC-SANG', 'NAM-LUU-03', 'NAM-HOA-KHOA-SANG', 'NAM-HOA-KHOA-HAM', 'NAM-HOA-QUYEN-SANG', 'NAM-HOA-QUYEN-HAM', 'NAM-HOA-KY-SANG', 'NAM-HOA-KY-HAM']) {
    const q = Q.find((x) => x.id === id);
    assert.deepEqual(Object.keys(q.noiDungTheoCung).sort(), [...CUNG].sort(), id);
    assert.equal(new Set(Object.values(q.noiDungTheoCung)).size, 12, id + ': chữ trùng giữa các cung');
    for (const c of CUNG) assert.ok(q.maTheoCung[c]?.length, id + ' thiếu mã căn cứ ' + c);
  }
  const tu = Q.find((x) => x.id === 'NAM-LUU-03').noiDungTheoCung['Tử Tức'];
  assert.match(tu, /con cái|học trò/);
});
