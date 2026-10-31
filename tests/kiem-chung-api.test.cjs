// /api/luan-giai?chuDe=van-nam-2027 cho khách chưa mua: cờ tắt không có kiemChung; cờ bật có nhưng vẫn không lộ mã quy tắc / nội dung 2027.
const test = require('node:test');
process.env.NOI_DUNG_VAN_2027_DA_QUA_THU = '1';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const x = nap('lib/may-chu/xu-ly.ts');
require('./_dang-nhap.cjs')(x);
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
async function khachChuaMua(email) {
  const r = await x.dangNhap(yc('/api/dang-nhap', { method: 'POST', body: { email } }), M);
  const cookie = 'xtv_phien=' + /xtv_phien=([^;]+)/.exec(r.headers.get('set-cookie'))[1];
  const { id: laSoId } = await (await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie, body: { thongTinSinh: SINH } }), M)).json();
  return { cookie, laSoId };
}
const lay = async (k) => (await x.luanGiai(yc(`/api/luan-giai?laSo=${k.laSoId}&chuDe=van-nam-2027`, { cookie: k.cookie }), M)).json();

test('Cờ tắt (mặc định): khách chưa mua không nhận kiemChung', async () => {
  delete process.env.KIEM_CHUNG_QUA_KHU;
  const d = await lay(await khachChuaMua('kc-tat@example.vn'));
  assert.equal(d.daMua, false);
  assert.ok(!('kiemChung' in d.xemTruoc));
});

test('Cờ bật: có kiemChung 2025 và 2026, không lộ mã quy tắc, không lộ nội dung 2027 trả phí', async () => {
  process.env.KIEM_CHUNG_QUA_KHU = '1';
  try {
    const k = await khachChuaMua('kc-bat@example.vn');
    const d = await lay(k);
    assert.equal(d.daMua, false);
    assert.deepEqual(d.xemTruoc.kiemChung.map((n) => n.nam), [2025, 2026]);
    const s = JSON.stringify(d);
    assert.ok(!/NAM-[A-Z]+-|quyTacId|thamChieu|maNghienCuu/.test(s), 'lộ mã quy tắc');
    assert.ok(!('thang' in d.xemTruoc) && !('muc' in d.xemTruoc), 'lộ nội dung tháng/mục trả phí');
    assert.ok(!JSON.stringify(d.xemTruoc.kiemChung).includes('2027'));
  } finally { delete process.env.KIEM_CHUNG_QUA_KHU; }
});
