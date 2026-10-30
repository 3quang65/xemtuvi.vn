// B2: mua lẻ / mua gộp "Vận năm 2027", quyền xem, sự kiện đo phễu.
const test = require('node:test');
process.env.NOI_DUNG_VAN_2027_DA_QUA_THU = '1'; // cổng mở bán Vận 2027 (L-f65975)
const ThucDateNow = Date.now; Date.now = () => Date.parse('2026-12-20T09:00:00+07:00'); // sau ngày mở bán 15/12
process.env.MO_GOI_AN = '1'; // gói Thành viên năm đang ẩn; test này kiểm luồng gói năm nên mở lại
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
const goi = nap('lib/goi.ts');
const { tongHopQuyen, coVanNam } = nap('lib/quyen-xem.ts');
const { kiemTraSuKien, trangCua } = require('../src/lib/su-kien.js');

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
async function khach(email, maGoi) {
  const r = await x.dangNhap(yc('/api/dang-nhap', { method: 'POST', body: { email } }), M);
  const cookie = 'xtv_phien=' + /xtv_phien=([^;]+)/.exec(r.headers.get('set-cookie'))[1];
  const { id: laSoId } = await (await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie, body: { thongTinSinh: SINH } }), M)).json();
  const nd = await (await x.toi(yc('/api/toi', { cookie }), M)).json();
  const nguoiDungId = M.db.prepare('SELECT id FROM nguoi_dung WHERE email=?').get(nd.email).id;
  if (maGoi) {
    const don = await (await x.donHangTao(yc('/api/don-hang', { method: 'POST', cookie, body: { maGoi, laSoId } }), M)).json();
    assert.equal((await x.thanhToanGiaLap(yc('/api/thanh-toan/gia-lap', { method: 'POST', cookie, body: { donHangId: don.id } }), M)).status, 200);
  }
  return { cookie, laSoId, nguoiDungId };
}
const co = (k, chuDe) => dv.coQuyenXem(M.db, k.nguoiDungId, k.laSoId, chuDe);

test('giá cấu hình một chỗ, có ghi chú chờ chốt, không giá gạch', () => {
  assert.ok(Number.isInteger(goi.GIA_VAN_NAM_2027) && goi.GIA_VAN_NAM_2027 > 0);
  assert.ok(goi.GIA_TRON_LA_SO_KEM_VAN_NAM > 0);
  assert.equal(goi.layGoi('van-nam-2027').gia, goi.GIA_VAN_NAM_2027);
  assert.equal(goi.layGoi('tron-la-so-kem-van-nam').gia, goi.GIA_TRON_LA_SO_KEM_VAN_NAM);
  assert.equal(goi.GOI.length, 3, 'không đổi ba gói hiện có');
  assert.equal(goi.layGoi('tron-la-so').gia, 99000);
  const src = fs.readFileSync(path.join(__dirname, '../src/lib/goi.ts'), 'utf8');
  assert.match(src, /đã duyệt L-5ff005/);
  assert.equal(goi.GIA_VAN_NAM_2027, 49000);
  assert.equal(goi.layGoi('tron-la-so-kem-van-nam').gia, 129000);
});

test('mua lẻ vận năm: chỉ có vận năm, không có chủ đề khác', async () => {
  const k = await khach('le@example.vn', 'van-nam-2027');
  assert.ok(co(k, 'van-nam-2027'));
  assert.ok(!co(k, 'ban-than'));
  assert.ok(!co(k, null));
  const t = await (await x.toi(yc('/api/toi', { cookie: k.cookie }), M)).json();
  assert.equal(t.quyen[0].loai, 'van_nam');
  const r = tongHopQuyen(t.quyen, k.laSoId, t.laSoIds);
  assert.deepEqual(r.dsChuDe, ['van-nam-2027']);
  assert.ok(coVanNam(t.quyen, k.laSoId, t.laSoIds));
});

test('Trọn lá số KHÔNG tự có vận năm', async () => {
  const k = await khach('tron@example.vn', 'tron-la-so');
  assert.ok(co(k, 'ban-than') && co(k, null));
  assert.ok(!co(k, 'van-nam-2027'));
  const t = await (await x.toi(yc('/api/toi', { cookie: k.cookie }), M)).json();
  assert.ok(!coVanNam(t.quyen, k.laSoId, t.laSoIds));
  assert.ok(!tongHopQuyen(t.quyen, k.laSoId, t.laSoIds).dsChuDe.includes('van-nam-2027'));
});

test('gói gộp: trọn lá số và vận năm, giá tính ở máy chủ', async () => {
  const k = await khach('gop@example.vn', 'tron-la-so-kem-van-nam');
  assert.ok(co(k, 'ban-than') && co(k, 'van-nam-2027'));
  const don = M.db.prepare('SELECT so_tien, ma_goi FROM don_hang WHERE nguoi_dung_id=?').get(k.nguoiDungId);
  assert.equal(don.so_tien, goi.GIA_TRON_LA_SO_KEM_VAN_NAM);
  const t = await (await x.toi(yc('/api/toi', { cookie: k.cookie }), M)).json();
  const r = tongHopQuyen(t.quyen, k.laSoId, t.laSoIds);
  assert.equal(r.goi, 'tron-la-so');
  assert.ok(r.dsChuDe.includes('van-nam-2027'));
});

test('thành viên năm có vận năm (khớp quyenLoi)', async () => {
  const k = await khach('tv@example.vn', 'thanh-vien-nam');
  assert.ok(co(k, 'van-nam-2027'));
  const t = await (await x.toi(yc('/api/toi', { cookie: k.cookie }), M)).json();
  assert.ok(tongHopQuyen(t.quyen, k.laSoId, t.laSoIds).dsChuDe.includes('van-nam-2027'));
});

test('mua lẻ vận năm phải kèm lá số; quyền theo đúng lá số', async () => {
  const r = await x.donHangTao(yc('/api/don-hang', { method: 'POST', cookie: (await khach('thieu@example.vn')).cookie, body: { maGoi: 'van-nam-2027' } }), M);
  assert.equal(r.status, 400);
  const k = await khach('hai@example.vn', 'van-nam-2027');
  const khac = Number(M.db.prepare('INSERT INTO la_so (nguoi_dung_id, sinh_ma_hoa, khoa_tim, tao_luc) VALUES (?,?,?,?)').run(k.nguoiDungId, 'x', 'khac', 1).lastInsertRowid);
  assert.ok(!dv.coQuyenXem(M.db, k.nguoiDungId, khac, 'van-nam-2027'));
});

test('GET /api/luan-giai van-nam-2027: chưa mua trả bản xem trước (không nội dung tháng, không mã quy tắc); đã mua trả bài thật', async () => {
  const { sinhVanNam } = nap('lib/luan-giai/ai/van-nam.ts');
  const { lapLaSo } = nap('lib/tuvi/index.ts');
  const that = await sinhVanNam(lapLaSo(SINH), { boQuaCache: true });
  const chuoiThang = that.thang.flatMap((t) => t.nhanDinh.map((n) => n.text));
  assert.ok(chuoiThang.length >= 12);
  const chua = await khach('chua@example.vn', 'tron-la-so');
  const r1 = await x.luanGiai(yc(`/api/luan-giai?laSo=${chua.laSoId}&chuDe=van-nam-2027`, { cookie: chua.cookie }), M);
  assert.equal(r1.status, 200);
  const t1 = await r1.text();
  const j1 = JSON.parse(t1);
  assert.equal(j1.daMua, false);
  assert.ok(j1.xemTruoc && !('bai' in j1));
  // Câu trùng với bản xem trước miễn phí (điểm thuận) là chủ ý của B1; chỉ kiểm câu CHỈ có ở tháng.
  const congKhai = JSON.stringify(j1.xemTruoc);
  const rieng = chuoiThang.filter((c) => !congKhai.includes(JSON.stringify(c).slice(1, -1)));
  assert.ok(rieng.length >= 12);
  for (const c of rieng) assert.ok(!t1.includes(JSON.stringify(c).slice(1, -1)), 'lộ nội dung tháng: ' + c.slice(0, 40));
  assert.doesNotMatch(t1, /NAM-[A-Z]|quyTacId|thamChieu|"thang":\[\{[^}]*nhanDinh/);
  assert.ok(!('muc' in j1.xemTruoc) && !('thang' in j1.xemTruoc));
  const da = await khach('da@example.vn', 'van-nam-2027');
  const r2 = await x.luanGiai(yc(`/api/luan-giai?laSo=${da.laSoId}&chuDe=van-nam-2027`, { cookie: da.cookie }), M);
  assert.equal(r2.status, 200);
  const j2 = await r2.json();
  assert.equal(j2.daMua, true);
  assert.equal(j2.bai.thang.length, 12);
  assert.ok(j2.bai.muc.length >= 5 && j2.bai.ghiChuTruongPhai && /hệ thống/.test(j2.bai.ghiChu));
  // lá số của người khác: 403, không biết có bài hay không
  const r3 = await x.luanGiai(yc(`/api/luan-giai?laSo=${da.laSoId}&chuDe=van-nam-2027`, { cookie: chua.cookie }), M);
  assert.equal(r3.status, 403);
  assert.ok(!/xemTruoc|bai/.test(await r3.text()));
});

test('sự kiện đo phễu cho trang đích và gói mới', () => {
  const p = 'a1b2c3d4e5f6a7b8';
  assert.ok(kiemTraSuKien({ ten: 'xem_lp_van_nam', phien: p }));
  assert.ok(kiemTraSuKien({ ten: 'bam_lap_la_so_lp', phien: p }));
  assert.equal(trangCua('xem_lp_van_nam'), 'lp');
  assert.ok(kiemTraSuKien({ ten: 'chon_goi', phien: p, goi: 'van-nam-2027' }));
  assert.ok(kiemTraSuKien({ ten: 'thanh_toan_xong', phien: p, goi: 'tron-la-so-kem-van-nam' }));
});

test('trang đích: nội dung ở một file, meta mô tả, không từ cấm', () => {
  const nd = fs.readFileSync(path.join(__dirname, '../src/lib/van-nam-noi-dung.ts'), 'utf8');
  assert.ok(fs.existsSync(path.join(__dirname, '../src/app/lp/van-nam-2027/page.tsx')));
  assert.doesNotMatch(nd, /giải hạn|bùa|hạn nặng|tai họa|đại họa/i);
  const page = fs.readFileSync(path.join(__dirname, '../src/app/lp/van-nam-2027/page.tsx'), 'utf8');
  assert.match(page, /description/);
});

test('L-f91bef: lời hứa khớp sản phẩm thật, chủ đề lẻ chỉ 3, gói gộp dừng bán sau 6/2/2027', () => {
  const chu = [...goi.GOI, ...goi.GOI_VAN_NAM].flatMap((g) => g.quyenLoi).join(' | ');
  assert.ok(!/12 cung|bất cứ lúc nào/.test(chu), chu);
  assert.match(goi.layGoi('tron-la-so').quyenLoi[0], /^Luận năm chủ đề: Bản thân, Tình cảm, Sự nghiệp, Tài chính, Gia đạo, và đại vận 10 năm$/);
  assert.deepEqual(goi.layGoi('tron-la-so').soSanh, ['Mua lẻ năm chủ đề: 145.000đ. Trọn lá số có thêm phần đại vận.']);
  assert.match(goi.layGoi('tron-la-so', { 'mot-chu-de': 39000 }).soSanh[0], /195\.000đ/);
  assert.deepEqual(goi.CHU_DE.map((c) => c.ma), ['ban-than', 'tinh-cam', 'su-nghiep']);
  assert.equal(goi.CHU_DE_TAT_CA.length, 3); // L-1786cd: tên hai chủ đề chưa bán nằm ở KhungMoi, không ở goi.ts
  assert.equal(goi.layChuDe('tai-chinh'), undefined);
  const gop = goi.layGoi('tron-la-so-kem-van-nam');
  assert.equal(gop.banDen, '2027-02-06');
  assert.ok(goi.conHanBan(gop, Date.parse('2027-02-06T23:59:00+07:00')));
  assert.ok(!goi.conHanBan(gop, Date.parse('2027-02-07T00:00:00+07:00')));
  assert.equal(goi.goiDangBan(goi.GOI_VAN_NAM, Date.parse('2027-02-07T08:00:00+07:00')).length, 1);
  // v4 L3: gói năm đang ẩn thì điều kiện không nhắc Thành viên năm; mở lại thì ghép câu 365 ngày
  assert.doesNotMatch(goi.DIEU_KIEN_XEM_LAI, /365 ngày|Thành viên năm/);
  assert.match(goi.dieuKienXemLai(true), /365 ngày kể từ ngày thanh toán, áp dụng cho 3 lá số bạn lập đầu tiên/);
  assert.match(goi.DIEU_KIEN_XEM_LAI, /không giới hạn thời gian/);
  // v4 L7: một cụm XEM_LAI cho thẻ 1, 2, Vận năm và gói gộp
  for (const ma of ['mot-chu-de', 'tron-la-so', 'van-nam-2027', 'tron-la-so-kem-van-nam']) {
    assert.ok(goi.layGoi(ma).quyenLoi.includes('Xem lại không giới hạn thời gian khi đăng nhập tài khoản'), ma);
  }
  assert.match(goi.layGoi('thanh-vien-nam').quyenLoi[0], /365 ngày kể từ ngày thanh toán/);
});

test('máy chủ từ chối gói gộp sau ngày dừng, từ chối chủ đề lẻ chưa bán', () => {
  const nd = M.db.prepare("INSERT INTO nguoi_dung (nha_cung_cap, ma_ngoai, email, tao_luc) VALUES ('thu','hh','hh@example.vn',0)").run().lastInsertRowid;
  assert.throws(() => dv.taoDon(M.db, Number(nd), { maGoi: 'tron-la-so-kem-van-nam', laSoId: 1 }, 'gia_lap', Date.parse('2027-02-07T00:00:01+07:00')), /dừng bán/);
  assert.throws(() => dv.taoDon(M.db, Number(nd), { maGoi: 'mot-chu-de', chuDe: 'gia-dao', laSoId: 1 }), /chủ đề hợp lệ/);
});

test('L-f65975: mua riêng 148k, tiết kiệm 19k, tính từ biến và từ bảng giá nhánh thử', () => {
  assert.deepEqual(goi.giaMuaRiengVaTietKiem(), { tongMuaRieng: 148000, tietKiem: 19000 });
  assert.deepEqual(goi.giaMuaRiengVaTietKiem({ 'tron-la-so': 109000 }), { tongMuaRieng: 158000, tietKiem: 29000 });
});

test('L-f65975: cổng mở bán Vận 2027 cần cờ Thư và ngày 15/12/2026; gói gộp ẩn sau 6/2/2027', () => {
  const T = (s) => Date.parse(s + '+07:00');
  assert.ok(!goi.cuaBanVan2027Mo(T('2026-12-20T09:00:00'), false), 'cờ tắt thì chưa bán');
    // L-ad41bc: lẻ và gộp cùng mở từ 15/12, không còn mốc 10/12
  assert.ok(!goi.cuaBanVan2027Mo(T('2026-12-14T23:59:59'), true), '14/12 chưa bán');
  assert.ok(goi.cuaBanVan2027Mo(T('2026-12-15T00:00:00'), true), '15/12 bán');
  assert.ok(!goi.cuaBanVan2027Mo(T('2026-12-20T09:00:00'), false), 'cờ tắt thì chưa bán');
  const nd = M.db.prepare("INSERT INTO nguoi_dung (nha_cung_cap, ma_ngoai, email, tao_luc) VALUES ('thu','cong','cong@example.vn',0)").run().lastInsertRowid;
  const laSo = (ma) => ({ maGoi: ma, laSoId: undefined });
  const cu = process.env.NOI_DUNG_VAN_2027_DA_QUA_THU;
  delete process.env.NOI_DUNG_VAN_2027_DA_QUA_THU;
  for (const ma of ['van-nam-2027', 'tron-la-so-kem-van-nam']) assert.throws(() => dv.taoDon(M.db, Number(nd), laSo(ma), 'gia_lap', T('2026-12-20T09:00:00')), /chưa mở bán/);
  process.env.NOI_DUNG_VAN_2027_DA_QUA_THU = '1';
  assert.throws(() => dv.taoDon(M.db, Number(nd), laSo('tron-la-so-kem-van-nam'), 'gia_lap', T('2026-12-14T09:00:00')), /chưa mở bán/);
  assert.throws(() => dv.taoDon(M.db, Number(nd), laSo('van-nam-2027'), 'gia_lap', T('2026-12-14T09:00:00')), /chưa mở bán/);
  process.env.NOI_DUNG_VAN_2027_DA_QUA_THU = cu;
  assert.throws(() => dv.taoDon(M.db, Number(nd), laSo('van-nam-2027'), 'gia_lap', T('2026-12-01T09:00:00')), /chưa mở bán/);
  assert.equal(goi.goiDangBan(goi.GOI_VAN_NAM, T('2027-02-07T08:00:00')).some((g) => g.ma === 'tron-la-so-kem-van-nam'), false);
});

test('L-eb6204 B1: đã có Trọn lá số của lá số đó thì không mua gộp được; người chưa mua vẫn mua gộp', () => {
  const { coTronLaSo } = nap('lib/quyen-xem.ts');
  const T = Date.parse('2026-12-20T09:00:00+07:00');
  const them = (email) => Number(M.db.prepare("INSERT INTO nguoi_dung (nha_cung_cap, ma_ngoai, email, tao_luc) VALUES ('thu',?,?,0)").run(email, email).lastInsertRowid);
  const themLaSo = (nd) => Number(M.db.prepare('INSERT INTO la_so (nguoi_dung_id, sinh_ma_hoa, khoa_tim, tao_luc) VALUES (?,?,?,0)').run(nd, 'x', 'k' + Math.random()).lastInsertRowid);
  const mua = (nd, ls, ma) => dv.xacNhanDaTra(M.db, dv.taoDon(M.db, nd, { maGoi: ma, laSoId: ls }, 'gia_lap', T).id, 'gia_lap', 'gd' + Math.random(), T);
  const a = them('b1a@example.vn'); const lsA = themLaSo(a); const lsA2 = themLaSo(a);
  const gop = (nd, ls) => dv.taoDon(M.db, nd, { maGoi: 'tron-la-so-kem-van-nam', laSoId: ls }, 'gia_lap', T);
  assert.equal(gop(a, lsA).soTien, 129000, 'chưa mua vẫn mua gộp được');
  mua(a, lsA, 'tron-la-so');
  assert.throws(() => gop(a, lsA), (e) => e.ma === 'da_co_tron_la_so' && e.trangThai === 409 && /Vận năm 2027/.test(e.message));
  assert.equal(gop(a, lsA2).soTien, 129000, 'lá số khác chưa mua vẫn mua gộp được');
  assert.equal(dv.taoDon(M.db, a, { maGoi: 'van-nam-2027', laSoId: lsA }, 'gia_lap', T).soTien, 49000, 'vẫn mua lẻ được');
  const b = them('b1b@example.vn'); const lsB = themLaSo(b); mua(b, lsB, 'thanh-vien-nam');
  assert.throws(() => gop(b, lsB), (e) => e.ma === 'da_co_tron_la_so');
  // giao diện: cùng quy tắc
  assert.equal(coTronLaSo([{ loai: 'tron_la_so', chuDe: null, laSoId: 5 }], 5, [5]), true);
  assert.equal(coTronLaSo([{ loai: 'tron_la_so', chuDe: null, laSoId: 5 }], 6, [5, 6]), false);
  assert.equal(coTronLaSo([{ loai: 'chu_de', chuDe: 'ban-than', laSoId: 5 }], 5, [5]), false);
  assert.equal(coTronLaSo([{ loai: 'thanh_vien', chuDe: null, laSoId: null }], 5, [5]), true);
  assert.equal(coTronLaSo([], 5, [5]), false);
});
