// Đăng nhập Google: state, PKCE, nonce, email phải được Google xác minh, chuyển hướng an toàn, gộp tài khoản thử.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const x = nap('lib/may-chu/xu-ly.ts');
const dv = nap('lib/may-chu/dich-vu.ts');
const gg = nap('lib/may-chu/google-oauth.ts');
process.env.GOOGLE_CLIENT_ID = 'cid.apps.googleusercontent.com';
process.env.GOOGLE_CLIENT_SECRET = 'bi-mat-test';
process.env.GOOGLE_REDIRECT_URI = 'https://xemtuvi.test/api/dang-nhap/google/callback';
const M = () => ({ db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') });
const H = 'xemtuvi.test';
const yc = (url, cookie) => new Request('https://' + H + url, { headers: { host: H, ...(cookie ? { cookie } : {}) } });
const cookieCua = (r) => r.headers.getSetCookie().find((c) => c.startsWith('xtv_oauth=')).split(';')[0];
const idToken = (c) => ['x', Buffer.from(JSON.stringify(c)).toString('base64url'), 'y'].join('.');
const hopLe = (nonce, them = {}) => ({ iss: 'https://accounts.google.com', aud: 'cid.apps.googleusercontent.com', azp: 'cid.apps.googleusercontent.com', exp: Math.floor(Date.now() / 1000) + 600, nonce, sub: 'g-123', email: 'Khach@Gmail.com', email_verified: true, ...them });
// Google giả: ghi lại yêu cầu đổi mã, trả id_token theo hàm tao(nonce)
function googleGia(tao, ok = true) {
  const f = async (url, init) => { f.goi.push({ url, body: new URLSearchParams(init.body) }); return ok ? new Response(JSON.stringify({ id_token: idToken(tao(f.nonce)) }), { status: 200 }) : new Response('{}', { status: 400 }); };
  f.goi = []; return f;
}
async function batDau(ve) {
  const r = x.googleBatDau(yc('/api/dang-nhap/google' + (ve ? '?ve=' + encodeURIComponent(ve) : '')));
  const u = new URL(r.headers.get('location'));
  return { r, u, cookie: cookieCua(r), p: u.searchParams };
}

test('bắt đầu: chuyển sang Google với state, nonce, PKCE S256; cookie HttpOnly', async () => {
  const { r, u, p } = await batDau('/luan-giai');
  assert.equal(r.status, 302);
  assert.equal(u.origin + u.pathname, 'https://accounts.google.com/o/oauth2/v2/auth');
  assert.equal(p.get('code_challenge_method'), 'S256');
  assert.equal(p.get('response_type'), 'code');
  assert.equal(p.get('client_id'), process.env.GOOGLE_CLIENT_ID);
  assert.equal(p.get('redirect_uri'), process.env.GOOGLE_REDIRECT_URI);
  assert.match(p.get('scope'), /openid email/);
  assert.ok(p.get('state').length >= 32 && p.get('nonce').length >= 32);
  const sc = r.headers.getSetCookie()[0];
  assert.match(sc, /HttpOnly/); assert.match(sc, /Secure/); assert.match(sc, /SameSite=Lax/); assert.match(sc, /Max-Age=600/);
  assert.ok(!sc.includes(process.env.GOOGLE_CLIENT_SECRET));
  // hai lần gọi cho state khác nhau
  assert.notEqual((await batDau()).p.get('state'), p.get('state'));
});

test('PKCE: code_challenge = SHA256(code_verifier) và verifier được gửi khi đổi mã, secret chỉ ở bước đổi mã', async () => {
  const m = M(), b = await batDau();
  const verifier = gg.docPhienOauth(decodeURIComponent(b.cookie.split('=')[1])).verifier;
  assert.equal(b.p.get('code_challenge'), createHash('sha256').update(verifier).digest('base64url'));
  const f = googleGia((n) => hopLe(n)); f.nonce = b.p.get('nonce');
  const r = await x.googleVe(yc(`/api/dang-nhap/google/callback?code=abc&state=${b.p.get('state')}`, b.cookie), m, f);
  assert.equal(r.status, 302);
  assert.equal(f.goi.length, 1);
  assert.equal(f.goi[0].url, 'https://oauth2.googleapis.com/token');
  assert.equal(f.goi[0].body.get('code_verifier'), verifier);
  assert.equal(f.goi[0].body.get('code'), 'abc');
  assert.equal(f.goi[0].body.get('grant_type'), 'authorization_code');
});

test('thành công: tạo phiên, chuyển về trang cũ, xóa cookie oauth, email chữ thường', async () => {
  const m = M(), b = await batDau('/luan-giai?x=1');
  const f = googleGia((n) => hopLe(n)); f.nonce = b.p.get('nonce');
  const r = await x.googleVe(yc(`/api/dang-nhap/google/callback?code=c&state=${b.p.get('state')}`, b.cookie), m, f);
  assert.equal(r.status, 302);
  assert.equal(r.headers.get('location'), '/luan-giai?x=1');
  const ck = r.headers.getSetCookie();
  const phien = ck.find((c) => c.startsWith('xtv_phien=')); assert.ok(phien);
  assert.ok(ck.some((c) => c.startsWith('xtv_oauth=;') && /Max-Age=0/.test(c)));
  const t = await (await x.toi(yc('/api/toi', phien.split(';')[0]), m)).json();
  assert.equal(t.dangNhap, true); assert.equal(t.email, 'khach@gmail.com');
  assert.equal(m.db.prepare('SELECT nha_cung_cap n, ma_ngoai s FROM nguoi_dung').get().n, 'google');
});

test('state sai / thiếu cookie / thiếu state: từ chối, không gọi Google, không có phiên', async () => {
  const m = M(), b = await batDau();
  const f = googleGia((n) => hopLe(n)); f.nonce = b.p.get('nonce');
  for (const [url, ck] of [
    [`/api/dang-nhap/google/callback?code=c&state=khac`, b.cookie],
    [`/api/dang-nhap/google/callback?code=c&state=${b.p.get('state')}`, undefined],
    [`/api/dang-nhap/google/callback?code=c`, b.cookie],
    [`/api/dang-nhap/google/callback?code=c&state=`, b.cookie],
  ]) {
    const r = await x.googleVe(yc(url, ck), m, f);
    assert.equal(r.status, 302); assert.match(r.headers.get('location'), /^\/dang-nhap-loi\?ma=state_sai/);
    assert.ok(!r.headers.getSetCookie().some((c) => c.startsWith('xtv_phien=') && !/Max-Age=0/.test(c)));
  }
  assert.equal(f.goi.length, 0);
  assert.equal(m.db.prepare('SELECT COUNT(*) n FROM nguoi_dung').get().n, 0);
});

test('người dùng hủy ở Google (error=access_denied): không tạo phiên', async () => {
  const m = M(), b = await batDau();
  const r = await x.googleVe(yc(`/api/dang-nhap/google/callback?error=access_denied&state=${b.p.get('state')}`, b.cookie), m, googleGia(() => ({})));
  assert.match(r.headers.get('location'), /ma=huy/);
  assert.equal(m.db.prepare('SELECT COUNT(*) n FROM phien').get().n, 0);
});

test('email chưa xác minh (false, thiếu, chuỗi "true") bị từ chối', async () => {
  for (const ev of [false, undefined, 'true']) {
    const m = M(), b = await batDau();
    const f = googleGia((n) => hopLe(n, { email_verified: ev })); f.nonce = b.p.get('nonce');
    const r = await x.googleVe(yc(`/api/dang-nhap/google/callback?code=c&state=${b.p.get('state')}`, b.cookie), m, f);
    assert.match(r.headers.get('location'), /ma=email_chua_xac_minh/, String(ev));
    assert.equal(m.db.prepare('SELECT COUNT(*) n FROM nguoi_dung').get().n, 0);
    assert.equal(m.db.prepare('SELECT COUNT(*) n FROM phien').get().n, 0);
  }
});

test('token sai bên phát hành / ứng dụng / hết hạn / nonce / thiếu email: từ chối', async () => {
  const cac = [
    ['token_sai', { iss: 'https://evil.com' }], ['token_sai', { aud: 'ung-dung-khac' }], ['token_sai', { azp: 'khac' }],
    ['token_het_han', { exp: Math.floor(Date.now() / 1000) - 5 }], ['nonce_sai', { nonce: 'khac' }], ['nonce_sai', { nonce: undefined }],
    ['thieu_email', { email: undefined }], ['thieu_email', { sub: '' }],
  ];
  for (const [ma, them] of cac) {
    const m = M(), b = await batDau();
    const f = googleGia((n) => hopLe(n, { ...them, ...('nonce' in them ? {} : {}) })); f.nonce = b.p.get('nonce');
    const r = await x.googleVe(yc(`/api/dang-nhap/google/callback?code=c&state=${b.p.get('state')}`, b.cookie), m, f);
    assert.match(r.headers.get('location'), new RegExp('ma=' + ma), JSON.stringify(them));
    assert.equal(m.db.prepare('SELECT COUNT(*) n FROM phien').get().n, 0);
  }
});

test('Google từ chối đổi mã (400) hoặc trả rác: không có phiên', async () => {
  const m = M(), b = await batDau();
  const r = await x.googleVe(yc(`/api/dang-nhap/google/callback?code=c&state=${b.p.get('state')}`, b.cookie), m, googleGia(() => ({}), false));
  assert.match(r.headers.get('location'), /ma=doi_ma_that_bai/);
  const b2 = await batDau();
  const r2 = await x.googleVe(yc(`/api/dang-nhap/google/callback?code=c&state=${b2.p.get('state')}`, b2.cookie), m, async () => new Response('khong-phai-json', { status: 200 }));
  assert.match(r2.headers.get('location'), /ma=token_sai/);
  assert.equal(m.db.prepare('SELECT COUNT(*) n FROM phien').get().n, 0);
});

test('chuyển hướng chỉ trong site: //evil, http://, \\ về "/"', () => {
  for (const v of ['//evil.com', 'https://evil.com', '/\\evil.com', 'javascript:1', '', undefined, null, '/a\r\nSet-Cookie: x=1', '/' + 'a'.repeat(400)]) assert.equal(gg.veAnToan(v), '/', String(v));
  assert.equal(gg.veAnToan('/luan-giai?x=1#a'), '/luan-giai?x=1#a');
});

test('cookie oauth giả mạo / rác không qua được', async () => {
  const m = M();
  const r = await x.googleVe(yc('/api/dang-nhap/google/callback?code=c&state=a', 'xtv_oauth=rac'), m, googleGia(() => ({})));
  assert.match(r.headers.get('location'), /state_sai/);
});

test('cookie dùng một lần: phát lại cùng cookie sau khi xong vẫn cần state; Google báo mã đã dùng thì không vào', async () => {
  const m = M(), b = await batDau();
  const f = googleGia((n) => hopLe(n)); f.nonce = b.p.get('nonce');
  await x.googleVe(yc(`/api/dang-nhap/google/callback?code=c&state=${b.p.get('state')}`, b.cookie), m, f);
  const r = await x.googleVe(yc(`/api/dang-nhap/google/callback?code=c&state=${b.p.get('state')}`, b.cookie), m, googleGia(() => ({}), false));
  assert.match(r.headers.get('location'), /doi_ma_that_bai/);
});

test('cùng sub đăng nhập lại ra cùng tài khoản; tài khoản thử cùng email được chuyển sang Google, giữ lá số', () => {
  const { db, khoa } = M();
  const thu = dv.dangNhapThu(db, 'khach@gmail.com');
  const idLaSo = dv.luuLaSo(db, khoa, thu, { lich: 'duong', ngay: 1, thang: 1, nam: 1990 });
  const a = dv.dangNhapGoogle(db, 'g-1', 'khach@gmail.com');
  assert.equal(a.id, thu); assert.equal(a.moi, false);
  assert.equal(dv.dsLaSo(db, khoa, a.id)[0].id, idLaSo);
  assert.equal(dv.dangNhapGoogle(db, 'g-1', 'doi-email@gmail.com').id, thu);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM nguoi_dung').get().n, 1);
  assert.equal(dv.coNguoiDung(db, 'khach@gmail.com'), false); // không còn đường vào bằng mã khôi phục
  assert.equal(dv.dangNhapGoogle(db, 'g-2', 'khac@gmail.com').moi, true);
});

test('chưa cấu hình Google: 404 và cấu hình báo google=false', async () => {
  const id = process.env.GOOGLE_CLIENT_ID; delete process.env.GOOGLE_CLIENT_ID; process.env.XTV_DATA_DIR = '/nonexistent';
  try {
    assert.equal(x.googleBatDau(yc('/api/dang-nhap/google')).status, 404);
    assert.equal((await x.googleVe(yc('/api/dang-nhap/google/callback?code=a&state=b'), M())).status, 404);
    assert.equal((await x.cauHinhDangNhap().json()).google, false);
  } finally { process.env.GOOGLE_CLIENT_ID = id; delete process.env.XTV_DATA_DIR; }
});
