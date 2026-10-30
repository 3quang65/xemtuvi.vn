// Kiểm thử chuyên đề "Vận năm 2027" (mã van-nam-2027, việc L-9ed21b B1): đối chiếu VN01–VN03 (docs/luan-giai/van-nam),
// khung bài, bản xem trước miễn phí, cache, chỉ nhận Đinh Mùi, 25 lá số không lỗi/không đoạn rỗng.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => {
  m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText, f);
};
const { lapLaSo } = require('../src/lib/tuvi/index.ts');
const L = require('../src/lib/tuvi/lich-raw.js');
const VN = require('../src/lib/luan-giai/ai/van-nam.ts');
const TU_CAM = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/luan-giai/ai/tu-cam.json'), 'utf8'));
const DIR = path.join(__dirname, '../docs/luan-giai/van-nam/');
const chuan = (s) => s.toLowerCase().replace(/\s+/g, '');
const DU_LIEU = fs.readFileSync(DIR + 'du-lieu.md', 'utf8').split(/\n(?=## VN)/).slice(1);
assert.equal(DU_LIEU.length, 3);
const TU_CAM_THEM = TU_CAM.tuCam.concat(['giải hạn', 'phạm thái tuế', 'năm hạn']);
const khongTuCam = (bai) => {
  const het = chuan(JSON.stringify(bai));
  for (const c of TU_CAM_THEM) assert.ok(!het.includes(chuan(c)), `còn từ cấm: ${c}`);
};
const tatCaNd = (bai) => [...bai.dauBai.nhanDinh, ...bai.muc.flatMap((m) => m.nhanDinh), ...bai.thang.flatMap((t) => t.nhanDinh)];

DU_LIEU.forEach((khoi, i) => {
  const ma = 'VN0' + (i + 1);
  const input = JSON.parse(khoi.match(/Đầu vào: `(\{.*\})`/)[1]);
  const [, tieuHan, thaiTue] = khoi.match(/\*\*Tiểu hạn\*\*: ([^(]+) \(.*\*\*Lưu Thái Tuế\*\*: ([^(]+) \(/);
  const luuHoa = [...khoi.match(/Lưu tứ hóa \(Đinh\): (.*)/)[1].matchAll(/(Hóa \S+) (.+?) \([MVĐBH]\) → ([^(;]+?) \(/g)].map((m) => ({ hoa: m[1], sao: m[2], cung: m[3] }));
  assert.equal(luuHoa.length, 4);
  const mau = fs.readFileSync(DIR + ma + '.md', 'utf8');
  const cungMau = (nhan) => mau.match(new RegExp('\\*\\*' + nhan + ': cung ([^*.,(]+?)\\s*(?:[.,(]|\\*\\*)'))[1].trim();
  const cungThaiTueMau = cungMau('Trọng điểm năm'), cungTieuHanMau = cungMau('Việc riêng của năm');

  test(`${ma}: cung Thái Tuế ${thaiTue.trim()}, tiểu hạn ${tieuHan.trim()}, lưu tứ hóa Đinh khớp bài mẫu`, async () => {
    assert.equal(cungThaiTueMau, thaiTue.trim());
    assert.equal(cungTieuHanMau, tieuHan.trim());
    const ls = lapLaSo(input);
    const bai = await VN.sinhVanNam(ls, { boQuaCache: true });
    assert.equal(bai.chuyenDe, 'van-nam-2027');
    assert.equal(bai.namXem, 2027);
    assert.equal(bai.canChi, 'Đinh Mùi');
    const tq = bai.muc.find((m) => m.id === 'tong-quan').nhanDinh;
    const theoPhan = (p) => tq.filter((x) => x.phan === p);
    assert.ok(theoPhan('thai-tue').length, 'có đoạn thai-tue');
    assert.ok(theoPhan('thai-tue').every((x) => x.thamChieu.cung === thaiTue.trim()), 'mọi đoạn thai-tue ở cung Thái Tuế');
    assert.ok(theoPhan('thai-tue').some((x) => /^NAM-TT-01-/.test(x.thamChieu.quyTacId)));
    assert.ok(theoPhan('tieu-han').length, 'có đoạn tieu-han');
    assert.ok(theoPhan('tieu-han').every((x) => x.thamChieu.cung === tieuHan.trim()), 'mọi đoạn tieu-han ở cung tiểu hạn');
    assert.ok(theoPhan('tieu-han').some((x) => /^NAM-TH-01-/.test(x.thamChieu.quyTacId)));
    // lưu tứ hóa can Đinh: đoạn tu-hoa nào nêu hóa của năm đều đúng cung engine
    const tuHoa = theoPhan('tu-hoa');
    assert.ok(tuHoa.length >= 1, 'có đoạn tu-hoa');
    for (const x of tuHoa.filter((d) => d.thamChieu.sao.length === 1 && /^NAM-HOA-(LOC|QUYEN|KHOA|KY)-/.test(d.thamChieu.quyTacId))) {
      const h = luuHoa.find((y) => y.sao === x.thamChieu.sao[0]);
      assert.ok(h, `${x.thamChieu.sao[0]} phải là sao lưu hóa Đinh`);
      assert.equal(x.thamChieu.cung, h.cung);
      assert.ok(x.text.includes(h.cung), 'câu nêu đúng tên cung');
    }
    // Hóa Kỵ của năm (Cự Môn) và Hóa Khoa (Thiên Cơ) có đoạn riêng khi sao sáng/hãm đủ bộ; ít nhất mỗi lưu hóa có thể truy ra cung
    for (const h of luuHoa) {
      const co = tq.filter((x) => x.thamChieu.cung === h.cung);
      assert.ok(co.length, `cung ${h.cung} (${h.hoa}) có mặt trong tổng quan`);
    }
    // Khớp từng dữ kiện của bài mẫu: tháng đúng cung đại vận/tiểu hạn
    assert.equal(bai.thang.length, 12);
    const mocMau = [...mau.matchAll(/\| \*\*T(\d+)\*\* \(từ [^)]+\) · tháng mốc \| ([^|]+) \|/g)].map((m) => +m[1]);
    const moc = bai.thang.filter((t) => t.thangMoc).map((t) => t.thang);
    assert.deepEqual(moc, mocMau, 'tháng mốc khớp bài mẫu');
    const cungThangMau = [...mau.matchAll(/\| \**T(\d+)\** \(từ [^)]+\)[^|]*\| ([^|]+) \|/g)].map((m) => [+m[1], m[2].trim()]);
    assert.deepEqual(bai.thang.map((t) => [t.thang, t.cung]), cungThangMau);
    khongTuCam(bai);
  });
});

test('Khung bài: đầu bài, tổng quan đủ 5 phần + tóm lại, 4 mảng, 12 tháng, ghi chú trường phái, không đoạn rỗng', async () => {
  const bai = await VN.sinhVanNam(lapLaSo({ lich: 'duong', ngay: 12, thang: 3, nam: 1998, gio: 9, phut: 0, gioiTinh: 'nu' }), { boQuaCache: true });
  assert.ok(bai.dauBai.nhanDinh.some((x) => x.thamChieu.quyTacId === 'NAM-CAM-04'));
  assert.equal(bai.dauBai.tuNgay, '6/2/2027');
  assert.equal(bai.dauBai.denNgay, '25/1/2028');
  assert.deepEqual(bai.muc.map((m) => m.id), ['tong-quan', 'su-nghiep', 'tai-chinh', 'tinh-cam', 'suc-khoe']);
  const phan = bai.muc[0].nhanDinh.map((x) => x.phan);
  const thuTu = ['boi-canh', 'thai-tue', 'tieu-han', 'tu-hoa', 'sao-luu', 'tom-lai'];
  assert.deepEqual([...new Set(phan)], thuTu.filter((p) => phan.includes(p)));
  for (const p of ['boi-canh', 'thai-tue', 'tieu-han', 'tu-hoa', 'tom-lai']) assert.ok(phan.includes(p), 'thiếu phần ' + p);
  assert.equal(phan.at(-1), 'tom-lai');
  for (const m of bai.muc.slice(1)) assert.ok(m.nhanDinh.length, `mảng ${m.id} rỗng`);
  assert.ok(bai.muc.find((m) => m.id === 'su-nghiep').nhanDinh.some((x) => x.phan === 'nen'), 'Sự nghiệp có nền');
  assert.ok(bai.muc.find((m) => m.id === 'suc-khoe').nhanDinh.some((x) => x.phan === 'goi-y'), 'Sức khỏe có gợi ý');
  assert.equal(bai.thang.length, 12);
  for (const t of bai.thang) { assert.ok(t.nhanDinh.length >= 1); assert.match(t.tuNgay, /^\d+\/\d+\/\d{4}$/); }
  assert.match(bai.ghiChuTruongPhai, /phái Việt/);
  assert.match(bai.ghiChu, /do hệ thống xemtuvi\.vn tạo tự động/);
  // bộ đổi chữ: không còn từ của đại vận 10 năm
  const het = JSON.stringify(tatCaNd(bai).filter((x) => x.thamChieu.quyTacId.startsWith('VAN-CT-')).map((x) => x.text));
  assert.ok(!/10 năm|giai đoạn|cung vận|tọa vận|vận rèn/.test(het), 'còn chữ của đại vận 10 năm trong đoạn chính tinh');
  assert.ok(tatCaNd(bai).some((x) => x.thamChieu.quyTacId.startsWith('VAN-CT-')), 'có đoạn chính tinh');
  assert.ok(bai.muc[0].nhanDinh.some((x) => x.phan === 'boi-canh' && /^VAN-CUNG-05/.test(x.thamChieu.quyTacId)), 'bối cảnh đại vận Phu Thê');
  // mọi nhận định có nguồn + trường phái; mã quy tắc có thật
  const ma = new Set(JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/luan-giai/ai/quy-tac-van/van-nam-2027.json'), 'utf8')).map((q) => q.id));
  for (const x of tatCaNd(bai)) {
    assert.ok(x.thamChieu.nguon && x.thamChieu.truongPhai);
    assert.ok(ma.has(x.thamChieu.quyTacId) || /^(VAN-CT|VAN-CUNG|QL-|PT-|KHUNG-|NAM-PP-10)/.test(x.thamChieu.quyTacId), x.thamChieu.quyTacId);
  }
});

test('Bản xem trước: đầu bài + Thái Tuế + 1 điểm thuận + 12 cung tháng, không nội dung tháng, không mã quy tắc', () => {
  const ls = lapLaSo({ lich: 'duong', ngay: 12, thang: 3, nam: 1998, gio: 9, phut: 0, gioiTinh: 'nu' });
  const xt = VN.xemTruocVanNam(ls);
  assert.equal(xt.chuyenDe, 'van-nam-2027');
  assert.ok(xt.dauBai.cau.some((c) => /Nội dung do hệ thống tạo/.test(c)));
  assert.ok(xt.thaiTue.length >= 1 && /Tử Tức/.test(xt.thaiTue[0]));
  assert.ok(xt.diemThuan && xt.diemThuan.length > 40);
  assert.equal(xt.cungThang.length, 12);
  assert.deepEqual(xt.cungThang.map((t) => t.thang), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const json = JSON.stringify(xt);
  assert.ok(!/NAM-|VAN-|quyTacId|thamChieu/.test(json), 'lộ mã quy tắc');
  assert.ok(!('thang' in xt) && !xt.cungThang.some((t) => 'nhanDinh' in t || 'text' in t));
  const bai = JSON.stringify(xt.cungThang);
  assert.ok(!/chủ đề nổi lên/.test(bai));
  khongTuCam(xt);
});

test('Cache theo lá số + năm: lần hai trả đúng bản đã lưu; lá số khác không dùng chung', async () => {
  const a = lapLaSo({ lich: 'duong', ngay: 3, thang: 5, nam: 1992, gio: 7, phut: 0, gioiTinh: 'nam' });
  const b = lapLaSo({ lich: 'duong', ngay: 4, thang: 5, nam: 1992, gio: 7, phut: 0, gioiTinh: 'nam' });
  const a1 = await VN.sinhVanNam(a, { boQuaCache: true });
  const a2 = await VN.sinhVanNam(a);
  const a3 = await VN.sinhVanNam(a);
  assert.equal(a3, a2, 'cùng một đối tượng từ cache bộ nhớ');
  assert.deepEqual(a2, a1);
  const b1 = await VN.sinhVanNam(b);
  assert.notEqual(b1, a2);
});

test('Năm xem: mặc định 2027; năm khác bị từ chối rõ ràng', async () => {
  const ls = lapLaSo({ lich: 'duong', ngay: 12, thang: 3, nam: 1998, gio: 9, phut: 0, gioiTinh: 'nu' });
  assert.equal((await VN.sinhVanNam(ls)).namXem, 2027);
  assert.equal((await VN.sinhVanNam(ls, { namXem: 2027 })).namXem, 2027);
  for (const n of [2026, 2028, 2037, 1999, 2027.5]) {
    await assert.rejects(() => VN.sinhVanNam(ls, { namXem: n }), /Vận năm/, `năm ${n}`);
    assert.throws(() => VN.xemTruocVanNam(ls, { namXem: n }), /Vận năm/);
  }
});

test('Ngày dương lịch bắt đầu 12 tháng khớp engine lịch', () => {
  const bai = VN.xemTruocVanNam(lapLaSo({ lich: 'duong', ngay: 1, thang: 1, nam: 2000, gio: 9, gioiTinh: 'nam' }));
  const d = (x) => `${x.ngay}/${x.thang}/${x.nam}`;
  assert.equal(bai.dauBai.tuNgay, d(L.amSangDuong(1, 1, 2027)));
  assert.equal(bai.dauBai.denNgay, d(L.amSangDuong(1, 1, 2028)).replace(/^(\d+)\/(\d+)\/(\d+)$/, (_, a, b, c) => { const t = new Date(Date.UTC(+c, +b - 1, +a - 1)); return `${t.getUTCDate()}/${t.getUTCMonth() + 1}/${t.getUTCFullYear()}`; }));
  assert.equal(L.thangNhuan(2027), 0);
});

// 25 lá số: đủ giới tính, mọi giờ, giờ Tý muộn, tháng nhuận, trước 1968, trước 1975 miền Nam, trẻ chưa vào đại vận.
const nam = 'nam', nu = 'nu';
const D = (ngay, thang, n, gio, gioiTinh, extra = {}) => ({ lich: 'duong', ngay, thang, nam: n, gio, phut: 0, gioiTinh, ...extra });
const HAI_LAM = [
  D(12, 3, 1998, 9, nu), D(7, 10, 1990, 15, nam), D(22, 6, 1981, 5, nu), D(1, 1, 1960, 0, nam), D(31, 12, 1967, 23, nu),
  D(31, 12, 1999, 23, nam, { quyUoc: { gioTyMuon: 'giuNgay' } }), D(1, 8, 2023, 23, nu, { quyUoc: { gioTyMuon: 'giuNgay' } }), D(1, 8, 2023, 23, nam),
  D(15, 7, 1985, 1, nu), D(29, 2, 2000, 12, nam), D(2, 3, 1970, 0, nam, { mienNamTruoc1975: true }), D(14, 2, 1975, 22, nu, { mienNamTruoc1975: true }),
  { lich: 'am', ngay: 10, thang: 2, nam: 2023, nhuan: true, gio: 6, phut: 0, gioiTinh: nam }, { lich: 'am', ngay: 5, thang: 4, nam: 2020, nhuan: true, gio: 18, phut: 0, gioiTinh: nu },
  { lich: 'am', ngay: 1, thang: 8, nam: 1957, nhuan: true, gio: 3, phut: 0, gioiTinh: nu }, { lich: 'am', ngay: 30, thang: 12, nam: 1964, gio: 11, phut: 0, gioiTinh: nam },
  D(5, 5, 2004, 13, nu), D(8, 9, 2010, 17, nam), D(20, 11, 1952, 9, nam), D(3, 4, 1945, 21, nu),
  D(11, 11, 2026, 10, nu), D(1, 1, 2025, 4, nam), D(18, 8, 1988, 14, nu), D(9, 9, 1977, 19, nam), D(27, 1, 1995, 8, nu),
];
assert.equal(HAI_LAM.length, 25);
test('25 lá số (giờ Tý muộn, tháng nhuận, trước 1968, miền Nam trước 1975, trẻ nhỏ) không ném lỗi, không đoạn rỗng', async () => {
  for (const [i, inp] of HAI_LAM.entries()) {
    const ls = lapLaSo(inp);
    const ten = `#${i + 1} ${JSON.stringify(inp)}`;
    const bai = await VN.sinhVanNam(ls, { boQuaCache: true });
    const xt = VN.xemTruocVanNam(ls);
    assert.equal(bai.thang.length, 12, ten);
    assert.equal(bai.muc.length, 5, ten);
    for (const x of tatCaNd(bai)) {
      assert.ok(x.text && x.text.trim().length >= 30, `${ten}: đoạn rỗng/quá ngắn ${x.thamChieu.quyTacId}`);
      assert.ok(!/\{(sao|cung)\}|undefined|null|\[object/.test(x.text), `${ten}: còn chỗ trống chưa điền: ${x.text}`);
    }
    for (const t of bai.thang) assert.ok(t.nhanDinh.length >= 1 && t.cung, ten);
    for (const m of bai.muc) assert.ok(m.nhanDinh.length >= 1, `${ten}: mục ${m.id} rỗng`);
    assert.ok(xt.thaiTue.length >= 1 && xt.cungThang.length === 12, ten);
    khongTuCam(bai);
    khongTuCam(xt);
  }
});
