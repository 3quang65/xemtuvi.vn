// Hồi quy chuyên đề "Vận năm 2027" sau khi nạp 88 đoạn bản 1.1 (việc L-c24d69, Phúc kiểm thử độc lập).
// Phủ: (1) 41 lá số đủ can/giờ/trường hợp biên, (2) VN01–VN03 khớp bài mẫu, (3) quyền xem như mốc 1, (4) từ cấm,
// (5) bộ khớp canNamSinh/motTrong chọn đúng đoạn. Danh sách lá số: docs/luan-giai/van-nam/hoi-quy-la-so.md
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const x = nap('lib/may-chu/xu-ly.ts');
require('./_dang-nhap.cjs')(x);
const dv = nap('lib/may-chu/dich-vu.ts');
const VN = nap('lib/luan-giai/ai/van-nam.ts');
const { lapLaSo, luuNien } = nap('lib/tuvi/index.ts');

const TU_CAM = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/luan-giai/ai/tu-cam.json'), 'utf8')).tuCam.concat(['giải hạn', 'phạm thái tuế', 'năm hạn']);
const DIR = path.join(__dirname, '../docs/luan-giai/van-nam/');
const chuan = (s) => s.toLowerCase().replace(/\s+/g, '');
const khongTuCam = (v, ten = '') => {
  const het = chuan(JSON.stringify(v));
  for (const c of TU_CAM) assert.ok(!het.includes(chuan(c)), `${ten} còn từ cấm: ${c}`);
};
const tatCaNd = (b) => [...b.dauBai.nhanDinh, ...b.muc.flatMap((m) => m.nhanDinh), ...b.thang.flatMap((t) => t.nhanDinh)];
const tuHoaIds = (b) => b.muc[0].nhanDinh.filter((n) => n.phan === 'tu-hoa').map((n) => n.thamChieu.quyTacId);

// ---------------------------------------------------------------- 41 lá số
const D = (ngay, thang, nam, gio, gioiTinh, extra = {}) => ({ lich: 'duong', ngay, thang, nam, gio, phut: 0, gioiTinh, ...extra });
const A = (ngay, thang, nam, gio, gioiTinh, extra = {}) => ({ lich: 'am', ngay, thang, nam, gio, phut: 0, gioiTinh, ...extra });
// [can năm sinh (âm lịch), thông tin sinh]
const LA_SO = [
  // Đinh (bắt buộc 1987, 1997)
  ['Đinh', D(15, 6, 1987, 10, 'nu')], ['Đinh', D(3, 9, 1987, 20, 'nam')], ['Đinh', D(15, 6, 1997, 10, 'nam')], ['Đinh', D(20, 11, 1997, 5, 'nu')],
  ['Đinh', D(10, 7, 1977, 13, 'nu')], ['Đinh', D(12, 5, 2007, 8, 'nam')], ['Đinh', D(9, 9, 1957, 23, 'nu', { quyUoc: { gioTyMuon: 'giuNgay' } })],
  // Kỷ
  ['Kỷ', D(15, 6, 1989, 10, 'nu')], ['Kỷ', D(3, 9, 1989, 20, 'nam')], ['Kỷ', D(20, 11, 1999, 5, 'nu')], ['Kỷ', D(8, 8, 1979, 15, 'nam')],
  ['Kỷ', D(14, 4, 2009, 1, 'nu')], ['Kỷ', D(2, 10, 1969, 22, 'nam', { mienNamTruoc1975: true })],
  // Canh
  ['Canh', D(15, 6, 1990, 10, 'nam')], ['Canh', D(20, 11, 1990, 5, 'nu')], ['Canh', D(15, 6, 2000, 10, 'nu')], ['Canh', D(3, 9, 2000, 20, 'nam')],
  ['Canh', D(15, 6, 1980, 10, 'nu')], ['Canh', D(20, 11, 2010, 5, 'nam')], ['Canh', D(5, 8, 1970, 0, 'nu', { mienNamTruoc1975: true })],
  // Ất
  ['Ất', D(15, 6, 1985, 10, 'nu')], ['Ất', D(3, 9, 1985, 20, 'nam')], ['Ất', D(15, 6, 1995, 10, 'nam')], ['Ất', D(20, 11, 1995, 5, 'nu')],
  ['Ất', D(15, 6, 1975, 10, 'nam')], ['Ất', D(3, 9, 2005, 20, 'nu')], ['Ất', D(7, 7, 1965, 9, 'nu')],
  // Tân
  ['Tân', D(15, 6, 1991, 10, 'nu')], ['Tân', D(3, 9, 2001, 20, 'nam')], ['Tân', D(15, 6, 1981, 10, 'nam')], ['Tân', D(20, 11, 2011, 5, 'nu')], ['Tân', D(1, 7, 1971, 16, 'nam')],
  // Các can còn lại + biên
  ['Giáp', D(11, 5, 1984, 12, 'nu')], ['Bính', D(18, 8, 1986, 7, 'nam')], ['Mậu', D(21, 3, 1988, 3, 'nu')], ['Nhâm', D(30, 10, 1992, 19, 'nam')], ['Quý', D(6, 6, 1993, 21, 'nu')],
  ['Quý', D(11, 11, 2023, 10, 'nu')], ['Nhâm', A(10, 2, 2022, 6, 'nam')], ['Quý', A(10, 2, 2023, 6, 'nam', { nhuan: true })], ['Giáp', A(1, 8, 1984, 3, 'nu')],
];
test('chuẩn bị: ≥ 25 lá số, đủ các can bắt buộc và tuổi Đinh 1987/1997', () => {
  assert.ok(LA_SO.length >= 25);
  const dem = (c) => LA_SO.filter(([can]) => can === c).length;
  for (const c of ['Đinh', 'Kỷ', 'Canh', 'Ất', 'Tân']) assert.ok(dem(c) >= 4, c);
  for (const nam of [1987, 1997]) assert.ok(LA_SO.some(([, s]) => s.lich === 'duong' && s.nam === nam), 'thiếu ' + nam);
});

test('lá số: can năm sinh đúng nhãn, không ném lỗi, không đoạn rỗng/còn chỗ trống, không từ cấm', async () => {
  for (const [i, [can, sinh]] of LA_SO.entries()) {
    const ten = `#${i + 1} ${can} ${JSON.stringify(sinh)}`;
    const ls = lapLaSo(sinh);
    assert.equal(ls.canChi.nam.split(' ')[0], can, ten + ': nhãn can sai');
    const bai = await VN.sinhVanNam(ls, { boQuaCache: true });
    const xt = VN.xemTruocVanNam(ls);
    assert.equal(bai.thang.length, 12, ten);
    assert.equal(bai.muc.length, 5, ten);
    assert.ok(tuHoaIds(bai).length >= 1, ten + ': thiếu đoạn tu-hoa');
    for (const n of tatCaNd(bai)) {
      assert.ok(n.text && n.text.trim().length >= 30, `${ten}: đoạn rỗng/ngắn ${n.thamChieu.quyTacId}`);
      assert.ok(!/\{(sao|cung)\}|undefined|null|\[object/.test(n.text), `${ten}: còn chỗ trống ${n.thamChieu.quyTacId}`);
    }
    for (const m of bai.muc) assert.ok(m.nhanDinh.length >= 1, `${ten}: mục ${m.id} rỗng`);
    for (const t of bai.thang) assert.ok(t.nhanDinh.length >= 1 && t.cung, ten);
    khongTuCam(bai, ten);
    khongTuCam(xt, ten);
  }
});

// ---------------------------------------------------------------- (2) VN01–VN03 khớp bài mẫu
const DU_LIEU = fs.readFileSync(DIR + 'du-lieu.md', 'utf8').split(/\n(?=## VN)/).slice(1);
DU_LIEU.forEach((khoi, i) => {
  const ma = 'VN0' + (i + 1);
  test(`${ma}: cung Thái Tuế, tiểu hạn, 12 cung tháng, tháng mốc khớp bài mẫu ${ma}.md`, async () => {
    const input = JSON.parse(khoi.match(/Đầu vào: `(\{.*\})`/)[1]);
    const [, tieuHan, thaiTue] = khoi.match(/\*\*Tiểu hạn\*\*: ([^(]+) \(.*\*\*Lưu Thái Tuế\*\*: ([^(]+) \(/);
    const mau = fs.readFileSync(DIR + ma + '.md', 'utf8');
    const cungMau = (nhan) => mau.match(new RegExp('\\*\\*' + nhan + ': cung ([^*.,(]+?)\\s*(?:[.,(]|\\*\\*)'))[1].trim();
    assert.equal(cungMau('Trọng điểm năm'), thaiTue.trim());
    assert.equal(cungMau('Việc riêng của năm'), tieuHan.trim());
    const bai = await VN.sinhVanNam(lapLaSo(input), { boQuaCache: true });
    const tq = bai.muc.find((m) => m.id === 'tong-quan').nhanDinh;
    assert.ok(tq.filter((n) => n.phan === 'thai-tue').every((n) => n.thamChieu.cung === thaiTue.trim()));
    assert.ok(tq.filter((n) => n.phan === 'tieu-han').every((n) => n.thamChieu.cung === tieuHan.trim()));
    assert.ok(tq.some((n) => n.phan === 'thai-tue') && tq.some((n) => n.phan === 'tieu-han'));
    const mocMau = [...mau.matchAll(/\| \*\*T(\d+)\*\* \(từ [^)]+\) · tháng mốc \| ([^|]+) \|/g)].map((m) => +m[1]);
    assert.deepEqual(bai.thang.filter((t) => t.thangMoc).map((t) => t.thang), mocMau, 'tháng mốc');
    const cungThangMau = [...mau.matchAll(/\| \**T(\d+)\** \(từ [^)]+\)[^|]*\| ([^|]+) \|/g)].map((m) => [+m[1], m[2].trim()]);
    assert.equal(cungThangMau.length, 12);
    assert.deepEqual(bai.thang.map((t) => [t.thang, t.cung]), cungThangMau, 'cung 12 tháng');
    // lưu tứ hóa của lá số đúng cung ghi trong du-lieu.md
    const luuHoa = [...khoi.match(/Lưu tứ hóa \(Đinh\): (.*)/)[1].matchAll(/(Hóa \S+) (.+?) \([MVĐBH]\) → ([^(;]+?) \(/g)].map((m) => ({ sao: m[2], cung: m[3] }));
    assert.equal(luuHoa.length, 4);
    for (const h of luuHoa) assert.ok(tq.some((n) => n.thamChieu.cung === h.cung), `cung ${h.cung} có mặt`);
    khongTuCam(bai, ma);
  });
});

// ---------------------------------------------------------------- (3) quyền xem như mốc 1
process.env.MO_GOI_AN = '1';
process.env.DANG_NHAP_THU = '1'; process.env.EMAIL_THU_CHO_PHEP = '@example.vn';
process.env.CONG_THANH_TOAN = 'gia_lap';
process.env.NHAT_KY_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'nhat-ky-'));
const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
const HOST = 'xemtuvi.test';
const SINH = { lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 10, phut: 30, gioiTinh: 'nu' };
const yc = (url, { method = 'GET', body, cookie } = {}) => {
  const h = { host: HOST };
  if (method === 'POST') { h['content-type'] = 'application/json'; h.origin = 'https://' + HOST; }
  if (cookie) h.cookie = cookie;
  return new Request('https://' + HOST + url, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
};
async function khach(email, mua) {
  const r = await x.dangNhap(yc('/api/dang-nhap', { method: 'POST', body: { email } }), M);
  const cookie = 'xtv_phien=' + /xtv_phien=([^;]+)/.exec(r.headers.get('set-cookie'))[1];
  const { id: laSoId } = await (await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie, body: { thongTinSinh: SINH } }), M)).json();
  if (mua) {
    const don = await (await x.donHangTao(yc('/api/don-hang', { method: 'POST', cookie, body: { ...mua, laSoId } }), M)).json();
    assert.equal((await x.thanhToanGiaLap(yc('/api/thanh-toan/gia-lap', { method: 'POST', cookie, body: { donHangId: don.id } }), M)).status, 200);
  }
  return { cookie, laSoId };
}
test('quyền xem: chưa mua Vận năm (không mua gì / một chủ đề / trọn lá số) chỉ nhận xemTruoc, không mã quy tắc, không nội dung tháng', async () => {
  const that = await VN.sinhVanNam(lapLaSo(SINH), { boQuaCache: true });
  const rieng = that.thang.flatMap((t) => t.nhanDinh.map((n) => n.text));
  const caNhom = [['khong-mua', null], ['mot-chu-de', { maGoi: 'mot-chu-de', chuDe: 'ban-than' }], ['tron-la-so', { maGoi: 'tron-la-so' }]];
  for (const [ten, mua] of caNhom) {
    const k = await khach(`${ten}@example.vn`, mua);
    const r = await x.luanGiai(yc(`/api/luan-giai?laSo=${k.laSoId}&chuDe=van-nam-2027`, { cookie: k.cookie }), M);
    assert.equal(r.status, 200, ten);
    const t = await r.text(), j = JSON.parse(t);
    assert.equal(j.daMua, false, ten);
    assert.ok(j.xemTruoc && !('bai' in j), ten);
    assert.ok(!('muc' in j.xemTruoc) && !('thang' in j.xemTruoc), ten);
    assert.doesNotMatch(t, /NAM-[A-Z]|VAN-[A-Z]|quyTacId|thamChieu|"nhanDinh"/, ten + ': lộ mã quy tắc');
    assert.equal(j.xemTruoc.cungThang.length, 12);
    assert.ok(j.xemTruoc.cungThang.every((m) => !('nhanDinh' in m) && !('text' in m)), ten);
    // câu chỉ có ở mục tháng không được xuất hiện trong phản hồi (câu trùng điểm thuận là chủ ý của B1)
    const congKhai = JSON.stringify(j.xemTruoc);
    for (const c of rieng.filter((c) => !congKhai.includes(JSON.stringify(c).slice(1, -1)))) assert.ok(!t.includes(JSON.stringify(c).slice(1, -1)), ten + ': lộ tháng: ' + c.slice(0, 40));
    khongTuCam(j.xemTruoc, ten);
  }
  const da = await khach('da-mua@example.vn', { maGoi: 'van-nam-2027' });
  assert.equal((await (await x.luanGiai(yc(`/api/luan-giai?laSo=${da.laSoId}&chuDe=van-nam-2027`, { cookie: da.cookie }), M)).json()).daMua, true);
  // người khác / chưa đăng nhập: không lộ gì
  const kh = await khach('nguoi-khac@example.vn');
  const r403 = await x.luanGiai(yc(`/api/luan-giai?laSo=${da.laSoId}&chuDe=van-nam-2027`, { cookie: kh.cookie }), M);
  assert.equal(r403.status, 403);
  assert.doesNotMatch(await r403.text(), /xemTruoc|"bai"|NAM-/);
  const rKhong = await x.luanGiai(yc(`/api/luan-giai?laSo=${da.laSoId}&chuDe=van-nam-2027`), M);
  assert.ok([401, 403].includes(rKhong.status), 'chưa đăng nhập: ' + rKhong.status);
  assert.doesNotMatch(await rKhong.text(), /xemTruoc|"bai"|NAM-/);
});

// ---------------------------------------------------------------- (4) từ cấm trên toàn bộ nội dung nguồn
test('từ cấm: 88 đoạn nguồn và bài mẫu VN01–VN03 không chứa từ cấm', () => {
  const doan = JSON.parse(fs.readFileSync(DIR + 'doan-mau.json', 'utf8'));
  assert.equal(doan.length, 88);
  assert.deepEqual(fs.readFileSync(DIR + 'doan-mau.json'), fs.readFileSync(path.join(__dirname, '../src/lib/luan-giai/ai/quy-tac-van/van-nam-2027.json')), 'bộ nạp khác doan-mau.json');
  for (const d of doan) khongTuCam(d.noiDung, d.id);
  for (const f of ['VN01.md', 'VN02.md', 'VN03.md']) khongTuCam(fs.readFileSync(DIR + f, 'utf8'), f);
});

// ---------------------------------------------------------------- (5) canNamSinh / motTrong chọn đúng đoạn
const HOA08 = { Ất: 'NAM-HOA-08-KY-LOC', Canh: 'NAM-HOA-08-KY-LOC-CANH', Tân: 'NAM-HOA-08-LOC-KY' };
const TAT_CA_HOA08 = ['NAM-HOA-08-KY-LOC', 'NAM-HOA-08-KY-LOC-CANH', 'NAM-HOA-08-LOC-KY', 'NAM-HOA-08-KY-KY', 'NAM-HOA-08-LOC-LOC', 'NAM-HOA-08-QUYEN-QUYEN', 'NAM-HOA-08-KHOA-KHOA'];
const HOA08_DINH = ['NAM-HOA-08-KY-KY', 'NAM-HOA-08-LOC-LOC', 'NAM-HOA-08-QUYEN-QUYEN', 'NAM-HOA-08-KHOA-KHOA'];

test('canNamSinh: không lá số nào nhận đoạn NAM-HOA-08 của can khác; Ất và Canh không nhận cả hai đoạn Thái Âm Kỵ', async () => {
  for (const [i, [can, sinh]] of LA_SO.entries()) {
    const ids = tuHoaIds(await VN.sinhVanNam(lapLaSo(sinh), { boQuaCache: true })).filter((id) => /^NAM-HOA-08/.test(id));
    const duoc = can === 'Đinh' ? HOA08_DINH : HOA08[can] ? [HOA08[can]] : [];
    for (const id of ids) assert.ok(duoc.includes(id), `#${i + 1} tuổi ${can} nhận nhầm ${id}`);
    assert.ok(!(ids.includes('NAM-HOA-08-KY-LOC') && ids.includes('NAM-HOA-08-KY-LOC-CANH')), `#${i + 1}: nhận cả hai đoạn Ất và Canh`);
  }
});

// LỖI THẬT (L-c24d69, xem báo cáo): bộ khớp có khớp NAM-HOA-08-* (đã kiểm bằng bản sao tăng giới hạn), nhưng giới hạn
// TOI_DA['tu-hoa'] = 4 trong van-nam.ts cắt mất: bốn đoạn NAM-HOA-<hóa>-SANG/HAM luôn đủ 4 và xếp trước. Đánh dấu todo
// để không chặn commit; bỏ `todo` khi Bảo/Hạnh chốt cách xếp ưu tiên.
test('tuổi Ất/Canh/Tân/Đinh nhận đúng đoạn NAM-HOA-08 riêng trong bài', async () => {
  for (const [i, [can, sinh]] of LA_SO.entries()) {
    if (!['Ất', 'Canh', 'Tân', 'Đinh'].includes(can)) continue;
    const ids = tuHoaIds(await VN.sinhVanNam(lapLaSo(sinh), { boQuaCache: true })).filter((id) => /^NAM-HOA-08/.test(id));
    const can2 = can === 'Đinh' ? HOA08_DINH : [HOA08[can]];
    assert.deepEqual(ids.sort(), [...can2].sort(), `#${i + 1} tuổi ${can}`);
  }
});

test('canNamSinh: NAM-LUU-07 (Kình/Đà tuổi Đinh–Kỷ) chỉ xuất hiện ở tuổi Đinh và Kỷ, và xuất hiện ở cả hai', async () => {
  const thay = new Set();
  for (const [i, [can, sinh]] of LA_SO.entries()) {
    const ids = (await VN.sinhVanNam(lapLaSo(sinh), { boQuaCache: true })).muc[0].nhanDinh.map((n) => n.thamChieu.quyTacId);
    const co = ids.some((id) => /^NAM-LUU-07/.test(id));
    if (co) thay.add(can);
    if (!['Đinh', 'Kỷ'].includes(can)) assert.ok(!co, `#${i + 1} tuổi ${can} nhận NAM-LUU-07`);
  }
  assert.ok(thay.has('Đinh') && thay.has('Kỷ'), 'NAM-LUU-07 phải xuất hiện cho Đinh và Kỷ: ' + [...thay]);
});

// Kiểm vế khong+motTrong bằng oracle độc lập: "sát" = Kình/Đà gốc hoặc lưu, Hóa Kỵ gốc hoặc lưu, tại chính cung.
test('motTrong: NAM-TH-04 chỉ khi cung tiểu hạn KHÔNG có Kình/Đà/Kỵ, NAM-TH-04-SAT chỉ khi CÓ; cả hai dạng đều có mặt', async () => {
  const SAT = ['Kình Dương', 'Đà La', 'L. Kình Dương', 'L. Đà La'];
  const dem = { thuong: 0, sat: 0, thuongTT: 0, satTT: 0 };
  for (const [i, [can, sinh]] of LA_SO.entries()) {
    const ls = lapLaSo(sinh), ln = luuNien(ls, 2027, true);
    const bai = await VN.sinhVanNam(ls, { boQuaCache: true });
    const co = (cungIdx) => {
      const c = ls.cung[cungIdx];
      const sao = [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh];
      return sao.some((s) => SAT.includes(s.ten) || s.hoa === 'Hóa Kỵ')
        || ln.saoLuu.some((s) => s.chi === c.chi && SAT.includes(s.ten))
        || ln.luuTuHoa.some((h) => h.hoa === 'Hóa Kỵ' && h.chi === c.chi);
    };
    for (const n of bai.muc[0].nhanDinh) {
      const id = n.thamChieu.quyTacId;
      const idx = n.phan === 'tieu-han' ? ln.tieuHan : n.phan === 'thai-tue' ? ln.luuThaiTue : null;
      if (idx == null) continue;
      const ten = `#${i + 1} ${can} ${id}`;
      if (n.phan === 'tieu-han' && id === 'NAM-TH-04') { assert.ok(!co(idx), ten + ': có sát mà vẫn nhận bản thường'); dem.thuong++; }
      if (n.phan === 'tieu-han' && id === 'NAM-TH-04-SAT') { assert.ok(co(idx), ten + ': không có sát mà nhận bản SAT'); dem.sat++; }
      if (n.phan === 'thai-tue' && id === 'NAM-TH-04-TT') { assert.ok(!co(idx), ten + ': có sát mà vẫn nhận bản thường'); dem.thuongTT++; }
      if (n.phan === 'thai-tue' && id === 'NAM-TH-04-TT-SAT') { assert.ok(co(idx), ten + ': không có sát mà nhận bản SAT'); dem.satTT++; }
    }
  }
  // vế khong+motTrong không chặn oan: lá số không sát vẫn nhận được bản thường; có sát nhận bản SAT
  assert.ok(dem.thuong >= 1, 'không lá số nào nhận NAM-TH-04 (khong+motTrong chặn oan?) ' + JSON.stringify(dem));
  assert.ok(dem.sat >= 1, 'không lá số nào nhận NAM-TH-04-SAT ' + JSON.stringify(dem));
});
