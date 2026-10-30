// Nâng lên Thành viên năm: trừ đơn lẻ đã trả trong 30 ngày, trần = giá Trọn lá số (chot-faq-6-8_v1.md mục 8).
const test = require('node:test');
process.env.MO_GOI_AN = '1'; // gói Thành viên năm đang ẩn; test này kiểm luồng gói năm nên mở lại
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

process.env.DANG_NHAP_THU = '1'; process.env.EMAIL_THU_CHO_PHEP = '@example.vn,@example.com';
process.env.CONG_THANH_TOAN = 'gia_lap';
process.env.NHAT_KY_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'nhat-ky-'));
const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
const NGAY = 86_400_000;
const T0 = Date.UTC(2026, 9, 30);
const SINH = { lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 10, phut: 30, gioiTinh: 'nu' };
let dem = 0;
function khach() {
  const nd = dv.dangNhapThu(M.db, `tru${++dem}@example.com`, T0);
  return { nd, laSo: dv.luuLaSo(M.db, M.khoa, nd, SINH, undefined, T0) };
}
const mua = (k, maGoi, luc) => {
  const d = dv.taoDon(M.db, k.nd, { maGoi, chuDe: maGoi === 'mot-chu-de' ? 'ban-than' : undefined, laSoId: k.laSo }, 'gia_lap', luc);
  dv.xacNhanDaTra(M.db, d.id, 'gia_lap', `gl-${d.id}`, luc);
  return d;
};
const GIA_NAM = goi.layGoi('thanh-vien-nam').gia;
const GIA_TRON = goi.layGoi('tron-la-so').gia;
const GIA_LE = goi.layGoi('mot-chu-de').gia;

test('trần lấy từ goi.ts', () => assert.equal(goi.TRAN_TRU_NANG_GOI, GIA_TRON));

test('hàm thuần: đơn lẻ trừ nguyên giá; cộng lẻ + trọn bị chặn ở trần', () => {
  const t = Date.now();
  assert.equal(dv.tinhTruNangGoi([{ maGoi: 'mot-chu-de', soTien: GIA_LE, traLuc: t - NGAY }], t), GIA_LE);
  assert.equal(dv.tinhTruNangGoi([{ maGoi: 'mot-chu-de', soTien: GIA_LE, traLuc: t - NGAY }, { maGoi: 'tron-la-so', soTien: GIA_TRON, traLuc: t - NGAY }], t), GIA_TRON);
  assert.equal(dv.tinhTruNangGoi([], t), 0);
  assert.equal(dv.tinhTruNangGoi([{ maGoi: 'van-nam-2027', soTien: 39000, traLuc: t - NGAY }], t), 0, 'chỉ tính mot-chu-de / tron-la-so');
});

test('đơn trả 31 ngày trước → không trừ; 29 ngày → có trừ', () => {
  const a = khach(); mua(a, 'mot-chu-de', T0 - 31 * NGAY);
  assert.equal(dv.taoDon(M.db, a.nd, { maGoi: 'thanh-vien-nam' }, 'gia_lap', T0).tru, 0);
  const b = khach(); mua(b, 'mot-chu-de', T0 - 29 * NGAY);
  assert.equal(dv.taoDon(M.db, b.nd, { maGoi: 'thanh-vien-nam' }, 'gia_lap', T0).tru, GIA_LE);
});

test('taoDon nâng lên năm: soTien = giá − trừ; lưu cột tru', () => {
  const k = khach(); mua(k, 'tron-la-so', T0 - NGAY);
  const d = dv.taoDon(M.db, k.nd, { maGoi: 'thanh-vien-nam' }, 'gia_lap', T0);
  assert.equal(d.tru, GIA_TRON);
  assert.equal(d.soTien, GIA_NAM - GIA_TRON);
  const h = M.db.prepare('SELECT so_tien, tru FROM don_hang WHERE id=?').get(d.id);
  assert.deepEqual({ ...h }, { so_tien: GIA_NAM - GIA_TRON, tru: GIA_TRON });
});

test('lẻ + trọn → trần; gói khác không có trừ', () => {
  const k = khach(); mua(k, 'mot-chu-de', T0 - 2 * NGAY); mua(k, 'tron-la-so', T0 - NGAY);
  assert.equal(dv.taoDon(M.db, k.nd, { maGoi: 'thanh-vien-nam' }, 'gia_lap', T0).tru, GIA_TRON);
  const d = dv.taoDon(M.db, k.nd, { maGoi: 'tron-la-so', laSoId: k.laSo }, 'gia_lap', T0);
  assert.equal(d.tru, 0); assert.equal(d.soTien, GIA_TRON);
});

test('đơn trả trước lần nâng cũ → không trừ lại; đơn sau lần nâng thì trừ', () => {
  const k = khach(); mua(k, 'mot-chu-de', T0 - 10 * NGAY); mua(k, 'thanh-vien-nam', T0 - 5 * NGAY);
  assert.equal(dv.taoDon(M.db, k.nd, { maGoi: 'thanh-vien-nam' }, 'gia_lap', T0).tru, 0);
  mua(k, 'mot-chu-de', T0 - 2 * NGAY);
  assert.equal(dv.taoDon(M.db, k.nd, { maGoi: 'thanh-vien-nam' }, 'gia_lap', T0).tru, GIA_LE);
});

test('đơn chờ chưa trả không được trừ', () => {
  const k = khach(); dv.taoDon(M.db, k.nd, { maGoi: 'mot-chu-de', chuDe: 'ban-than', laSoId: k.laSo }, 'gia_lap', T0 - NGAY);
  assert.equal(dv.taoDon(M.db, k.nd, { maGoi: 'thanh-vien-nam' }, 'gia_lap', T0).tru, 0);
});

test('HTTP: client gửi soTien/tru giả bị bỏ; GET báo đúng số trừ', async () => {
  const HOST = 'xemtuvi.test';
  const yc = (url, { method = 'GET', body, cookie } = {}) => {
    const h = { host: HOST }; if (method === 'POST') { h['content-type'] = 'application/json'; h.origin = 'https://' + HOST; }
    if (cookie) h.cookie = cookie;
    return new Request('https://' + HOST + url, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
  };
  const r = await x.dangNhap(yc('/api/dang-nhap', { method: 'POST', body: { email: 'http-tru@example.com' } }), M);
  const cookie = 'xtv_phien=' + /xtv_phien=([^;]+)/.exec(r.headers.get('set-cookie'))[1];
  const { id: laSoId } = await (await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie, body: { thongTinSinh: SINH } }), M)).json();
  const mo = await (await x.donHangTao(yc('/api/don-hang', { method: 'POST', cookie, body: { maGoi: 'tron-la-so', laSoId } }), M)).json();
  await x.thanhToanGiaLap(yc('/api/thanh-toan/gia-lap', { method: 'POST', cookie, body: { donHangId: mo.id } }), M);
  assert.deepEqual(await (await x.donHangTru(yc('/api/don-hang?maGoi=thanh-vien-nam', { cookie }), M)).json(), { tru: GIA_TRON });
  assert.deepEqual(await (await x.donHangTru(yc('/api/don-hang?maGoi=tron-la-so', { cookie }), M)).json(), { tru: 0 });
  const d = await (await x.donHangTao(yc('/api/don-hang', { method: 'POST', cookie, body: { maGoi: 'thanh-vien-nam', soTien: 1, tru: 999999 } }), M)).json();
  assert.equal(d.tru, GIA_TRON); assert.equal(d.soTien, GIA_NAM - GIA_TRON);
});

test('migration an toàn với DB cũ: đơn cũ có tru = 0', () => {
  const thuMuc = fs.mkdtempSync(path.join(os.tmpdir(), 'mig-'));
  const goc = path.join(process.cwd(), 'src/lib/may-chu/migrations');
  for (const f of fs.readdirSync(goc).filter((f) => !f.startsWith('007'))) fs.copyFileSync(path.join(goc, f), path.join(thuMuc, f));
  const db = moCsdl(':memory:', thuMuc);
  db.prepare("INSERT INTO nguoi_dung (nha_cung_cap, ma_ngoai, email, tao_luc) VALUES ('thu','a','a',1)").run();
  db.prepare("INSERT INTO don_hang (nguoi_dung_id, ma_goi, so_tien, tao_luc) VALUES (1,'mot-chu-de',29000,1)").run();
  fs.copyFileSync(path.join(goc, '007-tru-nang-goi.sql'), path.join(thuMuc, '007-tru-nang-goi.sql'));
  nap('lib/may-chu/csdl.ts').chayMigrations(db, thuMuc);
  assert.equal(db.prepare('SELECT tru FROM don_hang').get().tru, 0);
});
