// L-14d05a: tools/xoa-la-so.cjs xóa đúng, đủ dữ liệu sinh của lá số; đơn hàng và gói thành viên còn.
const test = require('node:test');
process.env.MO_GOI_AN = '1';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const x = nap('lib/may-chu/xu-ly.ts');
require('./_dang-nhap.cjs')(x);
const { xoaLaSo } = require('../tools/xoa-la-so.cjs');

process.env.DANG_NHAP_THU = '1'; process.env.EMAIL_THU_CHO_PHEP = '@example.vn';
process.env.CONG_THANH_TOAN = 'gia_lap';
process.env.NHAT_KY_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'nhat-ky-'));
const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
const HOST = 'xemtuvi.test';
const SINH = { lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 10, phut: 30, gioiTinh: 'nu' };
const SINH2 = { lich: 'duong', ngay: 3, thang: 2, nam: 1988, gio: 6, phut: 0, gioiTinh: 'nam' };
const yc = (url, { method = 'GET', body, cookie } = {}) => {
  const h = { host: HOST };
  if (method === 'POST') { h['content-type'] = 'application/json'; h.origin = 'https://' + HOST; }
  if (cookie) h.cookie = cookie;
  return new Request('https://' + HOST + url, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
};
const j = (r) => r.json();
const dem = (b, w = '1=1', ...a) => M.db.prepare(`SELECT COUNT(*) n FROM ${b} WHERE ${w}`).get(...a).n;
async function mua(cookie, goi, laSoId) {
  const don = await j(await x.donHangTao(yc('/api/don-hang', { method: 'POST', cookie, body: { maGoi: goi, laSoId } }), M));
  assert.equal((await x.thanhToanGiaLap(yc('/api/thanh-toan/gia-lap', { method: 'POST', cookie, body: { donHangId: don.id } }), M)).status, 200);
}
const xem = async (cookie, laSo, cd) => assert.equal((await x.luanGiai(yc(`/api/luan-giai?laSo=${laSo}&chuDe=${cd}`, { cookie }), M)).status, 200);

test('xóa lá số: chạy thử không đổi gì; --that xóa sạch lá số, đệm luận giải, quyền; đơn và gói thành viên còn', async () => {
  const email = 'xoa-ls@example.vn';
  const r = await x.dangNhap(yc('/api/dang-nhap', { method: 'POST', body: { email } }), M);
  const cookie = 'xtv_phien=' + /xtv_phien=([^;]+)/.exec(r.headers.get('set-cookie'))[1];
  const a = (await j(await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie, body: { thongTinSinh: SINH } }), M))).id;
  const b = (await j(await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie, body: { thongTinSinh: SINH2 } }), M))).id;
  await mua(cookie, 'tron-la-so', a);
  await mua(cookie, 'tron-la-so', b);
  await mua(cookie, 'thanh-vien-nam', a);
  for (const cd of ['ban-than', 'tinh-cam', 'su-nghiep', 'tai-chinh', 'gia-dao', 'van-10-nam']) { await xem(cookie, a, cd); await xem(cookie, b, cd); }
  const nDon = dem('don_hang'), nCache = dem('luan_giai_luu');
  assert.ok(nCache >= 12);

  // chạy thử
  const thu = xoaLaSo(M.db, M.khoa, { email, laSoId: a });
  assert.equal(thu.that, false);
  assert.equal(thu.so.la_so, 1);
  assert.ok(thu.so.luan_giai_luu >= 6 && thu.so.quyen_xem >= 1);
  assert.equal(dem('la_so'), 2); assert.equal(dem('luan_giai_luu'), nCache);

  // xóa thật lá số a
  const that = xoaLaSo(M.db, M.khoa, { email, laSoId: a, that: true });
  assert.deepEqual(that.so, thu.so);
  assert.equal(dem('la_so', 'id=?', a), 0);
  assert.equal(dem('luan_giai_luu'), nCache - thu.so.luan_giai_luu);
  assert.equal(dem('don_hang'), nDon);
  assert.equal(dem('don_hang', 'la_so_id=?', a), 0);
  assert.equal(dem('quyen_xem', 'la_so_id=?', a), 0);
  assert.equal(dem('quyen_xem', "loai='thanh_vien' AND den_luc>?", Date.now()), 1); // gói thành viên còn hạn
  // lá số b còn nguyên, xem lại được
  assert.equal(dem('la_so', 'id=?', b), 1);
  assert.equal((await x.luanGiai(yc(`/api/luan-giai?laSo=${b}&chuDe=ban-than`, { cookie }), M)).status, 200);

  // xóa nốt b: không còn khoa_tim / sinh_ma_hoa / đệm của tài khoản này
  xoaLaSo(M.db, M.khoa, { email, that: true });
  assert.equal(dem('la_so'), 0);
  assert.equal(dem('luan_giai_luu'), 0);
  assert.equal(dem('don_hang'), nDon);
  assert.equal(dem('quyen_xem', "loai='thanh_vien' AND den_luc>?", Date.now()), 1);

  // email lạ / sai khóa: báo lỗi, không xóa gì
  assert.throws(() => xoaLaSo(M.db, M.khoa, { email: 'khong-co@example.vn' }), /Không có tài khoản/);
});
