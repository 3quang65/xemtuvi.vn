// Báo lỗi: kiểm dữ liệu, giới hạn độ dài, không lưu ngày giờ sinh, chống gửi dồn (L-b19e60).
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const x = nap('lib/may-chu/xu-ly.ts');
const bl = nap('lib/may-chu/bao-loi.ts');

const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
const HOST = 'xemtuvi.test';
const post = (body, { origin = 'https://' + HOST, ip = '1.1.1.1' } = {}) =>
  new Request('https://' + HOST + '/api/bao-loi', { method: 'POST', headers: { host: HOST, 'content-type': 'application/json', 'x-forwarded-for': ip, ...(origin ? { origin } : {}) }, body: JSON.stringify(body) });
const dem = () => M.db.prepare('SELECT COUNT(*) n FROM bao_loi').get().n;
const OK = { moTa: 'Mình đã mua nhưng không thấy nội dung', maDon: 'XTV-000012', goi: 'tron-la-so', thietBi: 'iPhone, Safari', gioKhach: '2026-10-30 14:05' };

test('migration tạo bảng bao_loi, không có cột ngày giờ sinh', () => {
  const cot = M.db.prepare('PRAGMA table_info(bao_loi)').all().map((c) => c.name);
  assert.ok(cot.includes('mo_ta') && cot.includes('ma_don'));
  assert.ok(!cot.some((c) => /sinh|ngay_sinh|gio_sinh/.test(c)));
});

test('kiemTraBaoLoi: hợp lệ giữ đúng trường, bỏ trường lạ và mã tình huống lạ', () => {
  const r = bl.kiemTraBaoLoi({ ...OK, ngaySinh: '1995-08-15', tinhHuong: 'E07' });
  assert.equal(r.ok, true);
  assert.deepEqual(Object.keys(r.v).sort(), ['gioKhach', 'goi', 'lienHe', 'maDon', 'moTa', 'thietBi', 'tinhHuong']);
  assert.equal(r.v.tinhHuong, 'E07');
  assert.equal(bl.kiemTraBaoLoi({ ...OK, tinhHuong: '<x>' }).v.tinhHuong, '');
});

test('kiemTraBaoLoi: thiếu/ngắn/quá dài/mã đơn lạ bị từ chối; trường phụ bị cắt', () => {
  for (const b of [null, [], 'x', {}, { moTa: 5 }, { moTa: 'ngắn' }, { moTa: '   \n  ' }]) assert.equal(bl.kiemTraBaoLoi(b).ok, false);
  const dai = bl.kiemTraBaoLoi({ moTa: 'a'.repeat(1001) });
  assert.equal(dai.ok, false); assert.equal(dai.truong, 'moTa');
  assert.equal(bl.kiemTraBaoLoi({ ...OK, maDon: '<script>' }).truong, 'maDon');
  const cat = bl.kiemTraBaoLoi({ ...OK, thietBi: 'x'.repeat(500), goi: 'g'.repeat(500), gioKhach: 'h'.repeat(500) }).v;
  assert.equal(cat.thietBi.length, 120); assert.equal(cat.goi.length, 40); assert.equal(cat.gioKhach.length, 40);
  assert.equal(bl.kiemTraBaoLoi({ ...OK, moTa: 'Lỗi\u0000 ở \u0007bước hai nè' }).v.moTa, 'Lỗi ở bước hai nè');
});

test('HTTP: lưu đúng; sai nguồn 403; dữ liệu sai 400, không lưu', async () => {
  bl.xoaBoDemNguon(M.db);
  const r = await x.baoLoiGhi(post(OK), M);
  assert.equal(r.status, 201);
  const d = M.db.prepare('SELECT * FROM bao_loi').get();
  assert.equal(d.ma_don, 'XTV-000012'); assert.equal(d.trang_thai, 'moi'); assert.equal(d.nguoi_dung_id, null);
  assert.equal((await x.baoLoiGhi(post(OK, { origin: 'https://evil.test' }), M)).status, 403);
  const sai = await x.baoLoiGhi(post({ moTa: 'ngắn' }), M);
  assert.equal(sai.status, 400); assert.equal((await sai.json()).truong, 'moTa');
  assert.equal(dem(), 1);
});

test('chống gửi dồn: nguồn thứ 6 trong 10 phút bị 429; nguồn khác vẫn gửi được; hết cửa sổ gửi lại được', async () => {
  bl.xoaBoDemNguon(M.db);
  const truoc = dem();
  for (let i = 0; i < 5; i++) assert.equal((await x.baoLoiGhi(post(OK, { ip: '9.9.9.9' }), M)).status, 201);
  const r = await x.baoLoiGhi(post(OK, { ip: '9.9.9.9' }), M);
  assert.equal(r.status, 429);
  assert.equal(dem(), truoc + 5);
  assert.equal((await x.baoLoiGhi(post(OK, { ip: '8.8.8.8' }), M)).status, 201);
  const db = M.db;
  assert.equal(bl.choPhepTheoNguon(db, '7.7.7.7', 0), true);
  for (let i = 0; i < 4; i++) bl.choPhepTheoNguon(db, '7.7.7.7', 1000 + i);
  assert.equal(bl.choPhepTheoNguon(db, '7.7.7.7', 5000), false);
  assert.equal(bl.choPhepTheoNguon(db, '7.7.7.7', 11 * 60_000), true);
});

test('bộ đếm chống gửi dồn bền qua restart: mở lại cùng tệp DB vẫn đếm; không lưu địa chỉ gốc', () => {
  const os = require('node:os'); const fs = require('node:fs'); const path = require('node:path');
  const tep = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'nguon-')), 'a.db');
  const db1 = moCsdl(tep);
  for (let i = 0; i < 5; i++) assert.equal(bl.choPhepTheoNguon(db1, '5.5.5.5', 1000 + i), true);
  db1.close();
  const db2 = moCsdl(tep); // như khởi động lại tiến trình
  assert.equal(bl.choPhepTheoNguon(db2, '5.5.5.5', 2000), false);
  assert.equal(bl.choPhepTheoNguon(db2, '6.6.6.6', 2000), true);
  assert.ok(!JSON.stringify(db2.prepare('SELECT * FROM nguon_gui').all()).includes('5.5.5.5'));
  assert.equal(bl.choPhepTheoNguon(db2, '5.5.5.5', 11 * 60_000), true);
  db2.close();
});

test('trần toàn site: đủ 200 báo lỗi trong giờ thì từ chối', () => {
  const db = moCsdl(':memory:');
  for (let i = 0; i < 200; i++) bl.luuBaoLoi(db, bl.kiemTraBaoLoi(OK).v, null, 1_000_000 + i);
  assert.equal(bl.choPhepToanSite(db, 1_000_500), false);
  assert.equal(bl.choPhepToanSite(db, 1_000_000 + 61 * 60_000), true);
});
