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
  // L-91613b: không hứa sao ở mọi tháng, việc nên làm ở mọi mảng (sai ở 36/96 tháng, 8/32 mảng của 8 lá thử).
  assert.ok(!/các sao của tháng|ghi rõ sao|mỗi mảng kèm/i.test(het), het);
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
        // L-91613b: Tuần/Triệt với sát tinh, Kỵ là giảm xấu, không "phát huy"; không trỏ "các điểm nêu trên".
        if (x.thamChieu.quyTacId === 'NAM-THANG-04-TUAN-TRIET') {
          assert.ok(!/phát huy|nêu trên/.test(x.text), x.text);
          if (/Kình Dương|Đà La|Tang Môn|Bạch Hổ|Thiên Khốc|Thiên Hư|Hóa Kỵ/.test(x.text)) assert.ok(/phần vướng .+ nhẹ đi/i.test(x.text), x.text);
        }
        if (!['Quan Lộc', 'Mệnh'].includes(t.cung)) assert.ok(!/chứng chỉ|tay nghề/.test(x.text), x.thamChieu.quyTacId + '@' + t.cung + ': ' + x.text);
      }
      if (ids.some((i) => /^NAM-HOA-QUYEN/.test(i)) && ids.some((i) => /^NAM-HOA-KY/.test(i))) coCaHai++;
      if (ids.includes('NAM-THANG-04-TUAN-TRIET')) coTuanTriet++;
      // L-91613b: XEM_TRUOC.ghiChuThang hứa "mỗi tháng có nhận định riêng theo cung của tháng đó".
      assert.ok(t.nhanDinh.some((x) => x.thamChieu.cung === t.cung && x.thamChieu.nguon), 'tháng ' + t.thang + ' thiếu nhận định theo cung');
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

// L-bb82af (phiếu Thư L-5f6b69, lỗi 4-6)
test('chonThangMau: coKy gồm Kỵ gốc, tránh tháng đó khi còn lựa chọn', () => {
  assert.equal(VN.chonThangMau([U(1, { coKy: true, thangMoc: true }), U(2)]).thang, 2);
});
test('lá D (nam 1975): tháng mẫu không bỏ Kỵ gốc (tránh tháng đó hoặc nêu Lộc gặp Kỵ)', () => {
  const ls = lapLaSo({ lich: 'duong', ngay: 9, thang: 11, nam: 1975, gio: 17, gioiTinh: 'nam' });
  const xt = VN.xemTruocVanNam(ls);
  const cung = ls.cung.find((c) => c.ten === xt.thangMau.cung);
  assert.ok(!VN.coKyGocTaiCung(cung) || xt.thangMau.cau.some((c) => /Lộc.*Kỵ|Kỵ/.test(c)), JSON.stringify(xt.thangMau));
});
test('cauNenCungThang: nêu chính tinh và Tứ hóa gốc; vô chính diệu nói mượn đối cung; không lộ mã', () => {
  const sao = (ten, hoa = null) => ({ key: ten, ten, hoa });
  const c = (ten, ct = [], o = {}) => ({ ten, chinhTinh: ct, catTinh: [], phuTinh: [], hungTinh: [], ...o });
  assert.match(VN.cauNenCungThang(c('Phu Thê', [sao('Thái Âm', 'Hóa Quyền')]), c('Quan Lộc')), /Phu Thê.*Thái Âm Hóa Quyền/);
  const v = VN.cauNenCungThang(c('Quan Lộc'), c('Phúc Đức', [sao('Thiên Phủ')]));
  assert.match(v, /vô chính diệu.*cung đối chiếu.*Thiên Phủ/);
  assert.ok(VN.cauNenCungThang(c('Điền Trạch', [sao('Thái Âm', 'Hóa Kỵ')]), c('x'), true).endsWith(NEN.locGapKy['Điền Trạch']));
  assert.ok(!/NAM-/.test(v));
});
test('8 lá số: tháng mẫu có câu nêu chính tinh hoặc cung vô chính diệu', () => {
  for (const inp of LA) {
    const xt = VN.xemTruocVanNam(lapLaSo(inp));
    assert.ok(xt.thangMau.cau.some((x) => /^Cung .* của tháng này (có|vô chính diệu)/.test(x)), JSON.stringify(inp));
  }
});
test('Triệt không "phát huy" (hoi-dap) và MO_TA trang Vận năm không hứa ghi rõ sao', () => {
  const hd = fs.readFileSync(__dirname + '/../src/lib/may-chu/hoi-dap.ts', 'utf8');
  assert.ok(!/Triệt: cần thời gian để phát huy/.test(hd));
  const pg = fs.readFileSync(__dirname + '/../src/app/van-nam-2027/page.tsx', 'utf8');
  assert.ok(!/ghi rõ sao/.test(pg));
});

// L-95d072: chữ nền theo cung tháng của Hạnh ghép vào cauNenCungThang.
const NEN = require('../src/lib/luan-giai/ai/quy-tac-van/nen-cung-thang.json');
const { locTuCam } = require('../src/lib/luan-giai/ai/loc.ts');
const TU_CAM = require('../src/lib/luan-giai/ai/tu-cam.json');
test('nen-cung-thang.json: đủ 12 cung khớp tên cung engine, không từ cấm', () => {
  const ten = lapLaSo(ND.LA_SO_MAU).cung.map((c) => c.ten).sort();
  for (const k of ['nen', 'locGapKy']) {
    assert.deepEqual(Object.keys(NEN[k]).sort(), ten);
    for (const [cung, chu] of Object.entries(NEN[k])) {
      assert.ok(chu.trim().length > 20, `${k}/${cung} rỗng`);
      assert.equal(locTuCam(chu, TU_CAM), chu, `${k}/${cung} dính từ cấm hoặc bị lọc đổi chữ`);
    }
  }
});
test('cauNenCungThang: câu nền đặt sau câu dữ kiện; Lộc gặp Kỵ gốc dùng locGapKy thay câu chung', () => {
  const ls = lapLaSo(ND.LA_SO_MAU);
  const cungKy = ls.cung.find((c) => VN.coKyGocTaiCung(c));
  assert.ok(cungKy, 'lá số mẫu cần có Kỵ gốc');
  const doi = ls.cung[(cungKy.chi + 6) % 12];
  const thuong = VN.cauNenCungThang(cungKy, doi, false);
  assert.ok(thuong.endsWith(NEN.nen[cungKy.ten]));
  assert.ok(thuong.indexOf('ngay từ lá số gốc') < thuong.indexOf(NEN.nen[cungKy.ten]) || thuong.indexOf('vô chính diệu') >= 0);
  const ky = VN.cauNenCungThang(cungKy, doi, true);
  assert.ok(ky.endsWith(NEN.locGapKy[cungKy.ten]));
  assert.ok(!ky.includes('điểm thuận đi kèm điểm vướng'));
  for (const c of ls.cung.filter((x) => !VN.coKyGocTaiCung(x))) {
    assert.ok(!VN.cauNenCungThang(c, ls.cung[(c.chi + 6) % 12], true).includes(NEN.locGapKy[c.ten]));
  }
});

// L-9d340e: ghép đủ khóa Hạnh (chinhTinh, cachCuc, hoaGop, locTonHoaLoc, saoPhu, thanCu) vào cauNenCungThang.
const mkSao = (ten, o = {}) => ({ key: o.key ?? ten, ten, hoa: null, dacTinhTen: null, ...o });
const mkCung = (ten, ct = [], o = {}) => ({ chi: 5, tenChi: 'Tỵ', ten, chinhTinh: ct, catTinh: [], phuTinh: [], hungTinh: [], tuan: false, triet: false, laThan: false, ...o });
const DOI = mkCung('Thiên Di', [], { chi: 11, tenChi: 'Hợi' });

test('Lộc gặp Kỵ: giữ câu dữ kiện có tên sao rồi mới thêm locGapKy ở cuối', () => {
  const c = mkCung('Điền Trạch', [mkSao('Thái Âm', { hoa: 'Hóa Kỵ', dacTinhTen: 'Đắc' })]);
  const t = VN.cauNenCungThang(c, DOI, [{ hoa: 'Hóa Lộc', sao: 'Thiên Đồng', chi: 5 }]);
  assert.match(t, /Hóa Lộc lưu \(Thiên Đồng\) gặp Thái Âm Hóa Kỵ từ lá số gốc cùng cung Điền Trạch/);
  assert.ok(t.endsWith(NEN.locGapKy['Điền Trạch']));
  assert.ok(t.indexOf('Thiên Đồng') < t.indexOf(NEN.locGapKy['Điền Trạch']));
  assert.ok(t.includes(NEN.nen['Điền Trạch']));
});
test('khử trùng Văn Khúc Hóa Kỵ nằm ở cả catTinh và phuTinh', () => {
  const vk = mkSao('Văn Khúc', { hoa: 'Hóa Kỵ' });
  const c = mkCung('Mệnh', [mkSao('Thiên Cơ', { dacTinhTen: 'Vượng' })], { catTinh: [vk], phuTinh: [{ ...vk }] });
  const t = VN.cauNenCungThang(c, DOI);
  assert.equal(t.split('Văn Khúc Hóa Kỵ').length - 1, 1, t);
});
test('Lộc Tồn + Hóa Lộc cùng cung dùng dongCung, không "song Lộc"; chiếu nhau mới dùng xungChieu', () => {
  assert.ok(!/song Lộc/.test(NEN.locTonHoaLoc.dongCung));
  const c = mkCung('Tài Bạch', [mkSao('Vũ Khúc', { dacTinhTen: 'Miếu' })], { catTinh: [mkSao('Lộc Tồn')] });
  const t = VN.cauNenCungThang(c, DOI, [{ hoa: 'Hóa Lộc', sao: 'Vũ Khúc', chi: 5 }]);
  assert.ok(t.includes('có Lộc Tồn từ lá số gốc lại đón Hóa Lộc của năm'));
  assert.ok(!/song Lộc/.test(t));
  const doi = mkCung('Thiên Di', [], { chi: 11, catTinh: [mkSao('Lộc Tồn')] });
  const x = VN.cauNenCungThang(mkCung('Tài Bạch', [mkSao('Vũ Khúc', { dacTinhTen: 'Miếu' })]), doi, [{ hoa: 'Hóa Lộc', sao: 'Vũ Khúc', chi: 5 }]);
  assert.ok(x.includes('song Lộc'));
});
test('không ghép trùng hóa (Lộc|Lộc...) và Thiên Không đứng một mình', () => {
  const c = mkCung('Mệnh', [mkSao('Thiên Cơ', { hoa: 'Hóa Lộc', dacTinhTen: 'Vượng' })], { catTinh: [mkSao('Thiên Không')] });
  const t = VN.cauNenCungThang(c, DOI, [{ hoa: 'Hóa Lộc', sao: 'Thiên Cơ', chi: 5 }]);
  assert.ok(!/vừa mang Hóa Lộc/.test(t) && !/Thiên Không/.test(t), t);
});
test('hóa gộp, cách cục, sao phụ, cung Thân, cung đối chiếu: đủ chữ, không placeholder, không mã', () => {
  const c = mkCung('Phu Thê', [mkSao('Vũ Khúc', { dacTinhTen: 'Miếu' }), mkSao('Tham Lang', { hoa: 'Hóa Quyền', dacTinhTen: 'Miếu' })],
    { laThan: true, tuan: true, catTinh: [mkSao('Văn Xương', { dacTinhTen: 'Hãm' })], phuTinh: [mkSao('Thiên Mã')] });
  const t = VN.cauNenCungThang(c, DOI, [{ hoa: 'Hóa Lộc', sao: 'Tham Lang', chi: 5 }]);
  assert.ok(t.includes('Vũ Tham đồng cung tại cung Phu Thê'));
  assert.ok(t.includes('Tham Lang vừa mang Hóa Quyền gốc'), t);
  assert.ok(t.includes('Thiên Mã tại cung Phu Thê gặp Tuần'));
  assert.ok(t.includes(NEN.thanCu['Phu Thê']));
  assert.ok(!t.includes('Văn Xương'), 'tối đa một câu sao phụ');
  const v = VN.cauNenCungThang(mkCung('Phúc Đức', [], { triet: true }), mkCung('Điền Trạch', [mkSao('Thiên Phủ', { dacTinhTen: 'Hãm' })], { chi: 11 }));
  assert.ok(v.includes('cung đối chiếu Điền Trạch') && v.includes('Cung Phúc Đức vô chính diệu có Triệt'), v);
  for (const s of [t, v]) assert.ok(!/[{}]|NAM-|CHUNG-/.test(s), s);
});
test('8 lá số x 12 tháng: bài trả phí có đúng câu nền của tháng (khớp xem trước), không placeholder, không mã, qua locTuCam', async () => {
  for (const inp of LA) {
    const ls = lapLaSo(inp);
    const xt = VN.xemTruocVanNam(ls);
    const bai = await VN.sinhVanNam(ls, { boQuaCache: true });
    for (const t of bai.thang) {
      const nen = t.nhanDinh.filter((x) => x.thamChieu.quyTacId === 'NAM-THANG-05-NEN-CUNG');
      assert.equal(nen.length, 1, 'tháng ' + t.thang + ' thiếu câu nền');
      assert.ok(!/[{}]|NAM-/.test(nen[0].text), nen[0].text);
      assert.equal(locTuCam(nen[0].text, TU_CAM), nen[0].text);
      assert.equal(t.nhanDinh.filter((x) => /^NAM-THANG-03-/.test(x.thamChieu.quyTacId)).length, 1, 'mỗi tháng chỉ 1 câu chủ đề');
      const ten = nen[0].text.match(/Văn Khúc Hóa Kỵ/g);
      assert.ok(!ten || ten.length === 1, nen[0].text);
    }
    assert.ok(xt.thangMau.cau.includes(bai.thang[xt.thangMau.thang - 1].nhanDinh.find((x) => x.thamChieu.quyTacId === 'NAM-THANG-05-NEN-CUNG').text));
  }
});

// L-9d340e vòng sửa: B1 (Lộc Tồn + hóa gộp), B2 (nhiều câu trước tháng mốc), B3 (cung đối chiếu).
test('chonThangMau: nhiều câu thắng tháng mốc ít câu; không Kỵ vẫn trên cùng', () => {
  assert.equal(VN.chonThangMau([U(1, { cau: ['a', 'b', 'c'] }), U(2, { cau: ['a', 'b'], thangMoc: true })]).thang, 1);
  assert.equal(VN.chonThangMau([U(1, { cau: ['a', 'b', 'c', 'd'], coKy: true }), U(2, { cau: ['a'] })]).thang, 2);
});
test('tháng mẫu: 8 lá đều có từ 3 câu; lá C có Lộc Tồn, không có "song Lộc"', () => {
  const ca = [
    { lich: 'duong', ngay: 1, thang: 1, nam: 2000, gio: 9, gioiTinh: 'nam' }, { lich: 'duong', ngay: 22, thang: 3, nam: 1988, gio: 3, gioiTinh: 'nu' },
    { lich: 'duong', ngay: 9, thang: 11, nam: 1975, gio: 17, gioiTinh: 'nam' }, { lich: 'duong', ngay: 30, thang: 6, nam: 2003, gio: 21, gioiTinh: 'nu' },
    { lich: 'duong', ngay: 14, thang: 2, nam: 1982, gio: 12, gioiTinh: 'nu' }, { lich: 'duong', ngay: 5, thang: 9, nam: 1968, gio: 6, gioiTinh: 'nam' },
    { lich: 'duong', ngay: 18, thang: 12, nam: 1999, gio: 23, gioiTinh: 'nu' }, ND.LA_SO_MAU,
  ];
  for (const inp of ca) assert.ok(VN.xemTruocVanNam(lapLaSo(inp)).thangMau.cau.length >= 3);
  const c = VN.xemTruocVanNam(lapLaSo(ca[1])).thangMau.cau.join(' ');
  assert.match(c, /Lộc Tồn/);
  assert.doesNotMatch(c, /song Lộc/);
});
