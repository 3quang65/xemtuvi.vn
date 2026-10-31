// L-563f82: gói đôi 179k cùng cổng với 49k/129k; cờ XEM_TRUOC_GIA chỉ đổi hiển thị, không mở bán.
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const dv = nap('lib/may-chu/dich-vu.ts');
const goi = nap('lib/goi.ts');
const gia = nap('app/api/gia/route.ts');
const { MA_GOI } = require('../src/lib/goi-ma.js');
const T = (s) => Date.parse(s + '+07:00');
const MA = 'goi-doi-valentine';

test('gói đôi: mã hợp lệ, giá 179.000đ, hai Trọn lá số, hạn bán đến hết 14/2/2027', () => {
  assert.ok(MA_GOI.includes(MA));
  const g = goi.layGoi(MA);
  assert.equal(g.gia, 179000);
  assert.equal(g.banDen, '2027-02-14');
  assert.ok(goi.laGoiVan2027(MA));
  assert.deepEqual(g.soSanh, ['Mua riêng 198.000đ', 'tiết kiệm 19.000đ']);
  assert.match(g.quyenLoi.join(' '), /hai bản luận giải riêng, không so hợp tuổi/);
  assert.doesNotMatch(g.quyenLoi.join(' '), /hợp nhau|tương hợp|duyên/);
});

test('gói đôi bị cổng như 49k/129k: khu Vận ẩn khi cổng đóng, hiện khi mở', () => {
  const ds = goi.goiTheoBang().vanNam;
  assert.deepEqual(goi.khuVanNam(ds, T('2026-12-14T23:00:00'), true), []);
  assert.deepEqual(goi.khuVanNam(ds, T('2026-12-20T09:00:00'), false), []);
  assert.deepEqual(goi.khuVanNam(ds, T('2026-12-20T09:00:00'), true).map((g) => g.ma), ['van-nam-2027', 'tron-la-so-kem-van-nam']); // gói đôi chưa cấp quyền: ẩn khỏi khu bán
});

test('taoDon chặn gói đôi khi cổng đóng', () => {
  const db = moCsdl(':memory:');
  const nd = db.prepare("INSERT INTO nguoi_dung (nha_cung_cap, ma_ngoai, email, tao_luc) VALUES ('thu','dd','dd@example.vn',0)").run().lastInsertRowid;
  const cu = process.env.NOI_DUNG_VAN_2027_DA_QUA_THU;
  delete process.env.NOI_DUNG_VAN_2027_DA_QUA_THU;
  assert.throws(() => dv.taoDon(db, Number(nd), { maGoi: MA }, 'gia_lap', T('2026-12-20T09:00:00')), /chưa mở bán/);
  process.env.NOI_DUNG_VAN_2027_DA_QUA_THU = '1';
  assert.throws(() => dv.taoDon(db, Number(nd), { maGoi: MA }, 'gia_lap', T('2026-12-14T09:00:00')), /chưa mở bán/);
  process.env.NOI_DUNG_VAN_2027_DA_QUA_THU = cu;
  if (cu === undefined) delete process.env.NOI_DUNG_VAN_2027_DA_QUA_THU;
});

const CO = ['van-nam-2027', 'tron-la-so-kem-van-nam', MA, 'thanh-vien-nam'];
const hienThi = (xemTruoc, now, vanNamMo = false) => goi.goiHienThi({ bayGio: T(now), vanNamMo, xemTruoc });
const tatCa = (r) => [...r.goi, ...r.vanNam];

test('cờ tắt: như cũ (cổng đóng chỉ còn 2 gói, không nhãn)', () => {
  const r = hienThi(false, '2026-11-20T09:00:00');
  assert.deepEqual(r.goi.map((g) => g.ma), ['mot-chu-de', 'tron-la-so']);
  assert.deepEqual(r.vanNam, []);
  assert.ok(tatCa(r).every((g) => !g.xemThu));
  assert.deepEqual(hienThi(false, '2026-12-20T09:00:00', true).vanNam.map((g) => g.ma), ['van-nam-2027', 'tron-la-so-kem-van-nam']);
});

test('cờ bật: đủ 49k/129k/179k/299k, mỗi thẻ gated có nhãn Xem thử, 29k/99k không nhãn', () => {
  assert.equal(goi.NHAN_XEM_THU, 'Xem thử – chưa mở bán');
  const r = hienThi(true, '2026-11-20T09:00:00');
  const ds = tatCa(r);
  assert.deepEqual(ds.filter((g) => g.xemThu).map((g) => g.gia).sort((a, b) => a - b), [49000, 129000, 179000, 299000]);
  assert.deepEqual(ds.filter((g) => CO.includes(g.ma)).map((g) => g.ma).sort(), [...CO].sort());
  assert.ok(ds.filter((g) => !CO.includes(g.ma)).every((g) => !g.xemThu));
  assert.equal(ds.length, 6);
});

test('cờ bật khi cổng đã mở: gói đang bán thật không bị gắn nhãn xem thử', () => {
  const r = hienThi(true, '2026-12-20T09:00:00', true);
  assert.deepEqual(tatCa(r).filter((g) => g.xemThu).map((g) => g.ma).sort(), [MA, 'thanh-vien-nam'].sort());
});

test('cờ bật không gỡ cổng/an trong mã chính: GOI giữ an, taoDon vẫn chặn', () => {
  process.env.XEM_TRUOC_GIA = '1';
  try {
    assert.equal(goi.XEM_TRUOC_GIA(), true);
    assert.equal(goi.GOI.find((g) => g.ma === 'thanh-vien-nam').an, true);
    assert.ok(!goi.cuaBanVan2027Mo(T('2026-11-20T09:00:00'), false));
    const db = moCsdl(':memory:');
    const nd = db.prepare("INSERT INTO nguoi_dung (nha_cung_cap, ma_ngoai, email, tao_luc) VALUES ('thu','xt','xt@example.vn',0)").run().lastInsertRowid;
    const cu = process.env.NOI_DUNG_VAN_2027_DA_QUA_THU; delete process.env.NOI_DUNG_VAN_2027_DA_QUA_THU;
    const cuAn = process.env.MO_GOI_AN; delete process.env.MO_GOI_AN;
    for (const ma of ['van-nam-2027', 'tron-la-so-kem-van-nam', MA]) assert.throws(() => dv.taoDon(db, Number(nd), { maGoi: ma }, 'gia_lap', T('2026-12-20T09:00:00')), /chưa mở bán/);
    assert.throws(() => dv.taoDon(db, Number(nd), { maGoi: 'thanh-vien-nam' }), /chưa mở bán/);
    if (cu !== undefined) process.env.NOI_DUNG_VAN_2027_DA_QUA_THU = cu;
    if (cuAn !== undefined) process.env.MO_GOI_AN = cuAn;
  } finally { delete process.env.XEM_TRUOC_GIA; }
  assert.equal(goi.XEM_TRUOC_GIA(), false);
});

test('/api/gia báo xemTruoc theo cờ đọc lúc chạy; mặc định false; có giá 179k', async () => {
  const lay = async () => (await gia.GET(new Request('https://xemtuvi.test/api/gia', { headers: { host: 'xemtuvi.test' } }))).json();
  let b = await lay();
  assert.equal(b.xemTruoc, false);
  assert.equal(b.gia[MA], 179000);
  process.env.XEM_TRUOC_GIA = '1';
  try { b = await lay(); assert.equal(b.xemTruoc, true); } finally { delete process.env.XEM_TRUOC_GIA; }
});

test('giao diện: thẻ xem thử có nhãn và nút vô hiệu', () => {
  const fs = require('node:fs');
  const cg = fs.readFileSync(__dirname + '/../src/components/ChonGoi.tsx', 'utf8');
  const tg = fs.readFileSync(__dirname + '/../src/components/ThanGoi.tsx', 'utf8');
  assert.match(tg, /NHAN_XEM_THU/);
  assert.match(cg, /useGia\(true\)/);
  assert.match(fs.readFileSync(__dirname + '/../src/lib/useGia.ts', 'utf8'), /choXemTruoc && kq\?\.xemTruoc/);
  assert.match(cg, /disabled=\{[^}]*g\.xemThu/);
});

test('cổng đã mở (sau 15/12, cờ Thư bật): taoDon vẫn chặn gói đôi; 49k/129k mua bình thường', () => {
  assert.equal(goi.GOI_DOI_CHUA_CAP_QUYEN, true);
  const db = moCsdl(':memory:');
  const nd = db.prepare("INSERT INTO nguoi_dung (nha_cung_cap, ma_ngoai, email, tao_luc) VALUES ('thu','mo','mo@example.vn',0)").run().lastInsertRowid;
  const ls = Number(db.prepare("INSERT INTO la_so (nguoi_dung_id, sinh_ma_hoa, khoa_tim, tao_luc) VALUES (?, 'x', 'k', 1)").run(nd).lastInsertRowid);
  const cu = process.env.NOI_DUNG_VAN_2027_DA_QUA_THU; process.env.NOI_DUNG_VAN_2027_DA_QUA_THU = '1';
  try {
    const t = T('2026-12-20T09:00:00');
    assert.throws(() => dv.taoDon(db, Number(nd), { maGoi: MA, laSoId: ls }, 'gia_lap', t), /chưa mở bán/);
    for (const [ma, tien] of [['van-nam-2027', 49000], ['tron-la-so-kem-van-nam', 129000]]) assert.equal(dv.taoDon(db, Number(nd), { maGoi: ma, laSoId: ls }, 'gia_lap', t).soTien, tien);
    assert.throws(() => dv.taoDon(db, Number(nd), { maGoi: MA }, 'gia_lap', T('2027-02-08T09:00:00')), /chưa mở bán/);
  } finally { if (cu === undefined) delete process.env.NOI_DUNG_VAN_2027_DA_QUA_THU; else process.env.NOI_DUNG_VAN_2027_DA_QUA_THU = cu; }
});
