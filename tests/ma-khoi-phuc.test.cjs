// Đăng nhập thử có mã khôi phục (L-b2adeb): email có sẵn phải có mã đúng; sai quá 5 lần/15 phút bị chặn; xóa dữ liệu thật sự xóa.
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const x = nap('lib/may-chu/xu-ly.ts');
const mk = nap('lib/may-chu/ma-khoi-phuc.ts');
process.env.DANG_NHAP_THU = '1'; process.env.EMAIL_THU_CHO_PHEP = '@example.vn';
const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
const H = 'xemtuvi.test';
const SINH = { lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 10, phut: 30, gioiTinh: 'nu' };
const yc = (url, body, cookie, ip = '1.1.1.1') => new Request('https://' + H + url, { method: body ? 'POST' : 'GET', headers: { host: H, origin: 'https://' + H, 'content-type': 'application/json', 'cf-connecting-ip': ip, ...(cookie ? { cookie } : {}) }, body: body ? JSON.stringify(body) : undefined });
const vao = (email, maKhoiPhuc, ip) => x.dangNhap(yc('/api/dang-nhap', { email, maKhoiPhuc }, undefined, ip), M);
const ck = (r) => 'xtv_phien=' + /xtv_phien=([^;]+)/.exec(r.headers.get('set-cookie'))[1];

test('email mới: nhận mã 10 ký tự đúng bảng chữ, CSDL không chứa mã dạng rõ (e)', async () => {
  const r = await vao('a@example.vn'); assert.equal(r.status, 200);
  const d = await r.json();
  assert.equal(d.moi, true);
  assert.match(d.maKhoiPhuc, /^[A-HJKMNP-Z2-9]{10}$/);
  const h = M.db.prepare("SELECT ma_khoi_phuc h FROM nguoi_dung WHERE email='a@example.vn'").get().h;
  assert.match(h, /^[0-9a-f]{32}\$[0-9a-f]{64}$/);
  for (const bang of M.db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all())
    for (const hang of M.db.prepare(`SELECT * FROM ${bang.name}`).all()) assert.ok(!JSON.stringify(hang).includes(d.maKhoiPhuc), 'mã rõ nằm trong ' + bang.name);
  assert.equal(mk.sinhMa().length, 10);
});

test('email đã có: không mã/sai mã → 401 không Set-Cookie (a); mã đúng (gõ thường, có gạch) → vào được, thấy lá số (b)', async () => {
  const ma = (await (await vao('b@example.vn')).json()).maKhoiPhuc;
  const c0 = ck(await vao('b@example.vn', ma));
  assert.equal((await x.laSoGhi(yc('/api/la-so', { thongTinSinh: SINH }, c0), M)).status, 200);
  for (const sai of [undefined, '', 'AAAAAAAAAA', 123]) {
    const r = await vao('b@example.vn', sai, '2.2.2.' + String(sai).length);
    assert.equal(r.status, 401); assert.equal(r.headers.get('set-cookie'), null);
  }
  const r = await vao('B@Example.vn', (ma.slice(0, 5) + '-' + ma.slice(5)).toLowerCase(), '3.3.3.3');
  assert.equal(r.status, 200);
  const ds = await (await x.laSoDoc(yc('/api/la-so', null, ck(r)), M)).json();
  assert.equal(ds.length ?? ds.laSo?.length, 1);
});

test('lần sai thứ 6 bị chặn theo email, kể cả mã đúng; đổi IP vẫn chặn theo email (c)', async () => {
  const ma = (await (await vao('c@example.vn')).json()).maKhoiPhuc;
  for (let i = 0; i < 5; i++) assert.equal((await vao('c@example.vn', 'BBBBBBBBBB', '4.4.4.' + i)).status, 401);
  const r = await vao('c@example.vn', ma, '4.4.4.99');
  assert.equal(r.status, 429); assert.equal(r.headers.get('set-cookie'), null);
});

test('giới hạn theo IP: 5 sai trên các email khác nhau rồi bị chặn; hết 15 phút thì mở lại', async () => {
  for (let i = 0; i < 5; i++) { await vao(`ip${i}@example.vn`); }
  const ma = (await (await vao('ip9@example.vn', undefined, '9.9.9.9')).json()).maKhoiPhuc;
  for (let i = 0; i < 5; i++) assert.equal((await vao(`ip${i}@example.vn`, 'BBBBBBBBBB', '5.5.5.5')).status, 401);
  assert.equal((await vao('ip9@example.vn', ma, '5.5.5.5')).status, 429);
  assert.equal(mk.biChan(M.db, 'ip9@example.vn', '5.5.5.5', Date.now() + mk.CUA_SO_SAI + 1000), false);
  assert.equal((await vao('ip9@example.vn', ma, '6.6.6.6')).status, 200);
});

test('tài khoản cũ chưa có mã: 401 với thông điệp liên hệ hỗ trợ, không cookie', async () => {
  M.db.prepare("INSERT INTO nguoi_dung (nha_cung_cap, ma_ngoai, email, tao_luc) VALUES ('thu','cu@example.vn','cu@example.vn',1)").run();
  const r = await vao('cu@example.vn', 'ABCDEFGHJK', '7.7.7.7');
  assert.equal(r.status, 401); assert.equal(r.headers.get('set-cookie'), null);
  assert.match((await r.json()).thongDiep, /liên hệ hỗ trợ/);
});

test('xóa dữ liệu: phải gõ XOA; sau xóa đăng nhập lại là tài khoản trắng, bảng liên hệ không còn email (d)', async () => {
  const email = 'd@example.vn';
  const ma = (await (await vao(email)).json()).maKhoiPhuc;
  const c = ck(await vao(email, ma));
  const ls = await (await x.laSoGhi(yc('/api/la-so', { thongTinSinh: SINH }, c), M)).json();
  const don = await (await x.donHangTao(yc('/api/don-hang', { maGoi: 'tron-la-so', laSoId: ls.id }, c), M)).json();
  await x.thanhToanGiaLap(yc('/api/thanh-toan/gia-lap', { donHangId: don.id }, c), M);
  await x.lienHeGhi(yc('/api/lien-he', { loai: 'email', giaTri: email, dongY: true }, c), M);
  assert.equal((await x.toiXoa(yc('/api/toi/xoa', { xacNhan: true }, c), M)).status, 400);
  assert.equal((await x.toiXoa(yc('/api/toi/xoa', { xacNhan: 'xoa nhe' }, c), M)).status, 400);
  const r = await x.toiXoa(yc('/api/toi/xoa', { xacNhan: 'XOA' }, c), M);
  assert.equal(r.status, 200); assert.match(r.headers.get('set-cookie'), /Max-Age=0/);
  assert.equal(M.db.prepare("SELECT COUNT(*) n FROM lien_he WHERE gia_tri=?").get(email).n, 0);
  assert.equal((await x.toi(yc('/api/toi', null, c), M).json()).dangNhap, false);
  const r2 = await vao(email); // mã cũ không dùng lại được; email tự do → tài khoản mới
  const d2 = await r2.json();
  assert.equal(d2.moi, true); assert.notEqual(d2.maKhoiPhuc, ma);
  const c2 = ck(r2);
  const t = await (await x.toi(yc('/api/toi', null, c2), M)).json();
  assert.deepEqual(t.laSoIds, []); assert.equal(t.donGanNhat, null); assert.deepEqual(t.quyen, []);
});
