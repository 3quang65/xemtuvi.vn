// B2: mua lẻ / mua gộp "Vận năm 2027", quyền xem, sự kiện đo phễu.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const x = nap('lib/may-chu/xu-ly.ts');
const dv = nap('lib/may-chu/dich-vu.ts');
const goi = nap('lib/goi.ts');
const { tongHopQuyen, coVanNam } = nap('lib/quyen-xem.ts');
const { kiemTraSuKien, trangCua } = require('../src/lib/su-kien.js');

process.env.DANG_NHAP_THU = '1';
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
  assert.match(src, /CHỜ An\/anh chốt/);
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

test('GET /api/luan-giai van-nam-2027: chưa mua 403 không kèm nội dung; đã mua 200', async () => {
  const chua = await khach('chua@example.vn', 'tron-la-so');
  const r1 = await x.luanGiai(yc(`/api/luan-giai?laSo=${chua.laSoId}&chuDe=van-nam-2027`, { cookie: chua.cookie }), M);
  assert.equal(r1.status, 403);
  assert.ok(!/muc/.test(await r1.text()));
  const da = await khach('da@example.vn', 'van-nam-2027');
  const r2 = await x.luanGiai(yc(`/api/luan-giai?laSo=${da.laSoId}&chuDe=van-nam-2027`, { cookie: da.cookie }), M);
  assert.equal(r2.status, 200);
  assert.ok((await r2.json()).muc.length > 0);
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
