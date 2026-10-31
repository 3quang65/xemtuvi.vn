// Cờ khẩn đọc lúc chạy: đổi tệp/biến môi trường → hành vi đổi ngay, không build (docs/ky-thuat/co-khan.md).
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
const mm = nap('lib/may-chu/ma-moi.ts');
const ck = nap('lib/may-chu/co-khan.ts');

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'co-khan-'));
const TEP = path.join(TMP, 'co-khan.json');
process.env.CO_KHAN_FILE = TEP; process.env.DATA_DIR = TMP;
process.env.DANG_NHAP_THU = '1'; process.env.EMAIL_THU_CHO_PHEP = '@example.vn';
const datLai = () => { fs.rmSync(TEP, { force: true }); delete process.env.THU_KIN_MOI_TAT; delete process.env.THU_KIN_CAP_QUYEN_0D_TAT; };
const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
const HOST = 'xemtuvi.test', PH = 'a1b2c3d4e5f6a7b8c9';
const SINH = { lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 10, phut: 30, gioiTinh: 'nu' };
const yc = (url, { method = 'GET', body, cookie } = {}) => new Request('https://' + HOST + url, { method, headers: { host: HOST, ...(method === 'POST' ? { 'content-type': 'application/json', origin: 'https://' + HOST } : {}), ...(cookie ? { cookie } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
async function khach(email) {
  const r = await x.dangNhap(yc('/api/dang-nhap', { method: 'POST', body: { email } }), M);
  const cookie = 'xtv_phien=' + /xtv_phien=([^;]+)/.exec(r.headers.get('set-cookie'))[1];
  const ls = await (await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie, body: { thongTinSinh: SINH } }), M)).json();
  return { cookie, laSoId: ls.id };
}
const dung = (k, ma) => x.maMoiDung(yc('/api/ma-moi/dung', { method: 'POST', cookie: k.cookie, body: { ma, laSoId: k.laSoId, chuDe: 'tinh-cam', phien: PH } }), M);

test('mặc định: cờ tắt; env bật; tệp thắng env, đọc lại mỗi lần gọi', () => {
  datLai();
  assert.equal(ck.moiTat(), false);
  process.env.THU_KIN_MOI_TAT = '1';
  assert.equal(ck.moiTat(), true);
  fs.writeFileSync(TEP, JSON.stringify({ THU_KIN_MOI_TAT: false }));
  assert.equal(ck.moiTat(), false); // tệp ghi đè env
  fs.writeFileSync(TEP, JSON.stringify({ THU_KIN_MOI_TAT: true }));
  assert.equal(ck.moiTat(), true);
  fs.writeFileSync(TEP, '{hỏng'); // tệp hỏng → quay về env
  assert.equal(ck.moiTat(), true);
  datLai();
});

test('tắt cấp quyền 0đ: /api/ma-moi/dung trả 410, không tạo đơn; bỏ cờ → cấp lại được', async () => {
  datLai();
  const [ma] = mm.taoMa(M.db, { nguon: 'anh', soLuong: 1, gioiHan: 5 });
  const a = await khach('a@example.vn');
  fs.writeFileSync(TEP, JSON.stringify({ THU_KIN_CAP_QUYEN_0D_TAT: true }));
  const r = await dung(a, ma);
  assert.equal(r.status, 410);
  assert.equal((await r.json()).loi, 'cap_quyen_tat');
  assert.equal(M.db.prepare("SELECT COUNT(*) n FROM don_hang WHERE cong='moi'").get().n, 0);
  assert.equal((await x.maMoiKiem(yc('/api/ma-moi/kiem?ma=' + ma, { cookie: a.cookie }), M)).status, 200); // chỉ tắt cấp quyền, vẫn xem mã
  fs.writeFileSync(TEP, '{}');
  assert.equal((await dung(a, ma)).status, 200);
  datLai();
});

test('tắt /moi: kiem, vao, dung đều 410 (và dung không cấp quyền)', async () => {
  datLai();
  const [ma] = mm.taoMa(M.db, { nguon: 'anh', soLuong: 1, gioiHan: 5 });
  const b = await khach('b@example.vn');
  fs.writeFileSync(TEP, JSON.stringify({ THU_KIN_MOI_TAT: '1' }));
  assert.equal((await x.maMoiKiem(yc('/api/ma-moi/kiem?ma=' + ma, { cookie: b.cookie }), M)).status, 410);
  assert.equal((await x.maMoiVao(yc('/api/ma-moi/vao', { method: 'POST', cookie: b.cookie, body: { ma, phien: PH } }), M)).status, 410);
  assert.equal((await dung(b, ma)).status, 410);
  assert.equal(M.db.prepare("SELECT COUNT(*) n FROM don_hang WHERE cong='moi' AND nguoi_dung_id IN (SELECT id FROM nguoi_dung WHERE ma_ngoai='b@example.vn')").get().n, 0);
  datLai();
});
