// Công cụ CSKH: tools/bao-loi.cjs (moi/tat-ca/danh-dau/lien-he), ô liên hệ trả lời, tools/ma-moi.cjs ds (L-2efc00).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const x = nap('lib/may-chu/xu-ly.ts');
const bl = nap('lib/may-chu/bao-loi.ts');
const dv = nap('lib/may-chu/dich-vu.ts');
const lh = nap('lib/may-chu/lien-he.ts');
const mm = nap('lib/may-chu/ma-moi.ts');
const cu = require('../tools/bao-loi.cjs');
const { dsMa } = require('../tools/ma-moi.cjs');

const OK = { moTa: 'Mình đã mua nhưng không thấy nội dung', maDon: 'XTV-000012', goi: 'tron-la-so', thietBi: 'iPhone, Safari', gioKhach: '2026-10-30 14:05' };
const v = (o = {}) => bl.kiemTraBaoLoi({ ...OK, ...o }).v;
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'cskh-'));
const taoND = (db, email) => Number(db.prepare("INSERT INTO nguoi_dung (nha_cung_cap, ma_ngoai, email, tao_luc) VALUES ('thu', ?, ?, 1)").run('m-' + email, email).lastInsertRowid);

test('ô liên hệ: kiểm định dạng, chuẩn hóa, lưu; sai thì từ chối', async () => {
  assert.equal(v().lienHe, '');
  assert.equal(v({ lienHe: ' Khach@Example.VN ' }).lienHe, 'khach@example.vn');
  assert.equal(v({ lienHe: '0912 345 678' }).lienHe, '0912345678');
  for (const sai of ['khach@', '12345', 'abc', 'a@b']) { const r = bl.kiemTraBaoLoi({ ...OK, lienHe: sai }); assert.equal(r.ok, false); assert.equal(r.truong, 'lienHe'); }
  const db = moCsdl(':memory:');
  const id = bl.luuBaoLoi(db, v({ lienHe: '0912345678' }), null);
  assert.equal(db.prepare('SELECT lien_he_tra_loi l FROM bao_loi WHERE id=?').get(id).l, '0912345678');
});

test('xóa tài khoản xóa liên hệ trả lời (theo tài khoản và theo email), giữ nội dung báo lỗi', () => {
  const db = moCsdl(':memory:');
  const nd = taoND(db, 'a@example.vn');
  const b1 = bl.luuBaoLoi(db, v({ lienHe: '0912345678' }), nd);
  const b2 = bl.luuBaoLoi(db, v({ lienHe: 'a@example.vn' }), null);
  const b3 = bl.luuBaoLoi(db, v({ lienHe: 'khac@example.vn' }), null);
  dv.xoaTaiKhoan(db, nd);
  const l = (i) => db.prepare('SELECT lien_he_tra_loi l, mo_ta FROM bao_loi WHERE id=?').get(i);
  assert.equal(l(b1).l, ''); assert.equal(l(b2).l, ''); assert.equal(l(b3).l, 'khac@example.vn');
  assert.ok(l(b1).mo_ta.length > 0);
});

test('bao-loi moi / tat-ca / --tu / danh-dau; không in dữ liệu sinh; có/không liên hệ', () => {
  const db = moCsdl(':memory:');
  const t0 = Date.parse('2026-11-16T10:00:00+07:00');
  const a = bl.luuBaoLoi(db, v({ lienHe: 'a@example.vn', moTa: 'Dòng một\nDòng hai của lỗi' }), null, t0);
  const nd = taoND(db, 'b@example.vn');
  const b = bl.luuBaoLoi(db, v({ tinhHuong: 'E04' }), nd, t0 + 86_400_000);
  const c = bl.luuBaoLoi(db, v(), null, t0 + 2 * 86_400_000);
  let ds = cu.dsBaoLoi(db);
  assert.deepEqual(ds.map((d) => [d.ma, d.coLienHe]), [[a, true], [b, false], [c, false]]);
  assert.equal(ds[0].gio, '2026-11-16 10:00'); assert.equal(ds[0].moTa, 'Dòng một Dòng hai của lỗi');
  assert.ok(!JSON.stringify(ds).match(/sinh|ngay_sinh/i));
  lh.luuLienHe(db, { loai: 'email', giaTri: 'b@example.vn', nguon: {}, nguoiDungId: nd });
  assert.equal(cu.dsBaoLoi(db).find((d) => d.ma === b).coLienHe, true);
  cu.danhDau(db, a, 'da-xu-ly');
  assert.deepEqual(cu.dsBaoLoi(db).map((d) => d.ma), [b, c]);
  assert.deepEqual(cu.dsBaoLoi(db, { tatCa: true }).map((d) => d.ma), [a, b, c]);
  assert.deepEqual(cu.dsBaoLoi(db, { tatCa: true, tu: '2026-11-17' }).map((d) => d.ma), [b, c]);
  assert.throws(() => cu.danhDau(db, 999, 'da-xu-ly')); assert.throws(() => cu.danhDau(db, a, 'xoa'));
});

test('bao-loi lien-he: ô khách điền > liên hệ đã đồng ý; đã hủy/không có thì null; mỗi lần tra ghi nhật ký không chứa liên hệ', () => {
  const db = moCsdl(':memory:'); const thuMuc = tmp();
  const nd = taoND(db, 'b@example.vn');
  const { maHuy } = lh.luuLienHe(db, { loai: 'zalo', giaTri: '0912345678', nguon: {}, nguoiDungId: nd });
  const a = bl.luuBaoLoi(db, v({ lienHe: 'a@example.vn' }), nd);
  const b = bl.luuBaoLoi(db, v(), nd);
  const c = bl.luuBaoLoi(db, v(), null);
  assert.equal(cu.traLienHe(db, a, 'Ngân', { thuMuc, bayGio: 1000 }).giaTri, 'a@example.vn');
  assert.deepEqual(cu.traLienHe(db, b, 'Ngân', { thuMuc, bayGio: 2000 }), { nguon: 'liên hệ đã đồng ý của tài khoản', loai: 'zalo', giaTri: '0912345678' });
  lh.huyLienHe(db, maHuy);
  assert.equal(cu.traLienHe(db, b, 'Ngân', { thuMuc }), null);
  assert.equal(cu.traLienHe(db, c, 'Ngân', { thuMuc }), null);
  const dong = fs.readFileSync(path.join(thuMuc, 'tra-lien-he.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  assert.equal(dong.length, 4);
  assert.deepEqual([dong[0].bao_loi, dong[0].nguoi, dong[0].co_lien_he, dong[3].co_lien_he], [a, 'Ngân', true, false]);
  assert.ok(!fs.readFileSync(path.join(thuMuc, 'tra-lien-he.jsonl'), 'utf8').match(/example|0912/));
  assert.throws(() => cu.traLienHe(db, a, undefined, { thuMuc }), /--nguoi/);
  assert.throws(() => cu.traLienHe(db, 999, 'Ngân', { thuMuc }), /Không có/);
  assert.equal(fs.readFileSync(path.join(thuMuc, 'tra-lien-he.jsonl'), 'utf8').trim().split('\n').length, 4);
});

test('HTTP: gửi có/không liên hệ rồi đọc được bằng lệnh', async () => {
  const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
  const post = (b) => new Request('https://t.test/api/bao-loi', { method: 'POST', headers: { host: 't.test', origin: 'https://t.test', 'content-type': 'application/json', 'x-forwarded-for': '2.2.2.2' }, body: JSON.stringify(b) });
  assert.equal((await x.baoLoiGhi(post({ ...OK, lienHe: '0912345678' }), M)).status, 201);
  assert.equal((await x.baoLoiGhi(post(OK), M)).status, 201);
  const sai = await x.baoLoiGhi(post({ ...OK, lienHe: 'sai' }), M);
  assert.equal(sai.status, 400); assert.equal((await sai.json()).truong, 'lienHe');
  assert.deepEqual(cu.dsBaoLoi(M.db).map((d) => d.coLienHe), [true, false]);
});

test('ma-moi ds: mã, nguồn, giới hạn, đã dùng, hết hạn, tình trạng; không có tên khách/ghi chú', () => {
  const db = moCsdl(':memory:');
  const [m1] = mm.taoMa(db, { nguon: 'tuvivn', soLuong: 1, gioiHan: 1, ghiChu: 'Chị Lan' }, 1000);
  const [m2] = mm.taoMa(db, { nguon: 'anh', soLuong: 1, gioiHan: 2, hetHan: 5000 }, 1000);
  const [m3] = mm.taoMa(db, { nguon: 'anh', soLuong: 1, gioiHan: 3 }, 2000);
  const nd = taoND(db, 'c@example.vn');
  const ls = Number(db.prepare("INSERT INTO la_so (nguoi_dung_id, sinh_ma_hoa, khoa_tim, tao_luc) VALUES (?, 'x', 'k', 1)").run(nd).lastInsertRowid);
  db.prepare('INSERT INTO ma_moi_dung (ma, nguoi_dung_id, la_so_id, chu_de, luc) VALUES (?,?,?,?,1)').run(m1, nd, ls, 'x');
  const ds = dsMa(db, 9000);
  const tt = Object.fromEntries(ds.map((d) => [d.ma, d]));
  assert.equal(tt[m1].tinhTrang, 'hết lượt'); assert.equal(tt[m1].daDung, 1);
  assert.equal(tt[m2].tinhTrang, 'hết hạn'); assert.equal(tt[m3].tinhTrang, 'dùng được'); assert.equal(tt[m3].hetHan, '-');
  assert.ok(!JSON.stringify(ds).match(/Lan|example|ghi/i));
});
