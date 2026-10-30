// Bản thử khách mời: mã mời, cấp quyền 0đ, đo theo nguồn (docs/ky-thuat/ban-thu-khach-moi.md).
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
const mm = nap('lib/may-chu/ma-moi.ts');
const { kiemTraSuKien } = require('../src/lib/su-kien.js');
const { tinhBaoCao } = require('../tools/ma-moi.cjs');
const { docThuMuc } = require('../tools/pheu.cjs');

process.env.DANG_NHAP_THU = '1'; process.env.EMAIL_THU_CHO_PHEP = '@example.vn';
process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'moi-'));
delete process.env.VAN_NAM_THU;
const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
const HOST = 'xemtuvi.test';
const SINH = { lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 10, phut: 30, gioiTinh: 'nu' };
const PH = 'a1b2c3d4e5f6a7b8c9';

function yc(url, { method = 'GET', body, cookie } = {}) {
  const h = { host: HOST };
  if (method === 'POST') { h['content-type'] = 'application/json'; h.origin = 'https://' + HOST; }
  if (cookie) h.cookie = cookie;
  return new Request('https://' + HOST + url, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
}
async function khach(email) {
  const r = await x.dangNhap(yc('/api/dang-nhap', { method: 'POST', body: { email } }), M);
  const cookie = 'xtv_phien=' + /xtv_phien=([^;]+)/.exec(r.headers.get('set-cookie'))[1];
  const ls = await (await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie, body: { thongTinSinh: SINH } }), M)).json();
  return { cookie, laSoId: ls.id };
}
const dung = (k, ma, chuDe, laSoId = k.laSoId) => x.maMoiDung(yc('/api/ma-moi/dung', { method: 'POST', cookie: k.cookie, body: { ma, laSoId, chuDe, phien: PH } }), M);
const docDong = () => docThuMuc(path.join(process.env.DATA_DIR));

test('tạo mã: 8 ký tự ngẫu nhiên, không trùng, nguồn phải hợp lệ', () => {
  const ds = mm.taoMa(M.db, { nguon: 'cd-3a', soLuong: 40, gioiHan: 1 });
  assert.equal(new Set(ds).size, 40);
  for (const m of ds) assert.match(m, /^[A-HJ-NP-Z2-9]{8}$/);
  assert.throws(() => mm.taoMa(M.db, { nguon: 'la', soLuong: 1 }));
  assert.throws(() => mm.taoMa(M.db, { nguon: 'anh', soLuong: 0 }));
});

test('kiểm mã: sai, hết hạn, hết lượt; không phân biệt hoa thường', () => {
  const [ma] = mm.taoMa(M.db, { nguon: 'anh', soLuong: 1, hetHan: 5000 });
  assert.deepEqual(mm.kiemMa(M.db, ma.toLowerCase(), 1000), { hopLe: true, nguon: 'anh' });
  assert.deepEqual(mm.kiemMa(M.db, ma, 6000), { hopLe: false, ly: 'het_han' });
  assert.deepEqual(mm.kiemMa(M.db, 'ZZZZZZZZ'), { hopLe: false, ly: 'sai' });
  assert.deepEqual(mm.kiemMa(M.db, "x' OR 1=1"), { hopLe: false, ly: 'sai' });
  assert.deepEqual(mm.kiemMa(M.db, 12345), { hopLe: false, ly: 'sai' });
});

test('dùng mã: cấp quyền chuyên đề như đơn 0đ, đọc được qua coQuyenXem; hết lượt thì từ chối', async () => {
  const [ma] = mm.taoMa(M.db, { nguon: 'tuvivn', soLuong: 1, gioiHan: 1 });
  const a = await khach('a@example.vn');
  const r = await dung(a, ma, 'tinh-cam');
  assert.equal(r.status, 200);
  assert.equal(dv.coQuyenXem(M.db, M.db.prepare('SELECT nguoi_dung_id n FROM la_so WHERE id=?').get(a.laSoId).n, a.laSoId, 'tinh-cam'), true);
  const don = M.db.prepare("SELECT so_tien, cong, trang_thai FROM don_hang WHERE cong='moi' ORDER BY id DESC").get();
  assert.deepEqual({ ...don }, { so_tien: 0, cong: 'moi', trang_thai: 'da_tra' });
  const toi = await (await x.toi(yc('/api/toi', { cookie: a.cookie }), M)).json();
  assert.equal(toi.quyen[0].chuDe, 'tinh-cam');
  const b = await khach('b@example.vn');
  const r2 = await dung(b, ma, 'ban-than');
  assert.equal(r2.status, 410);
  assert.equal((await r2.json()).loi, 'ma_het_luot');
});

test('một tài khoản chỉ dùng mã một lần; một mã nhiều người tới giới hạn', async () => {
  const [ma, ma2] = mm.taoMa(M.db, { nguon: 'cd-3b', soLuong: 2, gioiHan: 2 });
  const a = await khach('c@example.vn');
  assert.equal((await dung(a, ma, 'ban-than')).status, 200);
  const lai = await dung(a, ma, 'su-nghiep');
  assert.equal(lai.status, 409);
  assert.equal((await dung(a, ma2, 'su-nghiep')).status, 409); // mã khác cũng không được
  const b = await khach('d@example.vn'), c = await khach('e@example.vn'), d = await khach('f@example.vn');
  assert.equal((await dung(b, ma, 'ban-than')).status, 200);
  assert.equal((await dung(c, ma, 'ban-than')).status, 410);
  assert.equal((await dung(d, ma2, 'ban-than')).status, 200);
});

test('mã không cấp quyền cho lá số người khác; chủ đề sai; chưa đăng nhập; Origin sai', async () => {
  const [ma] = mm.taoMa(M.db, { nguon: 'anh', soLuong: 1, gioiHan: 5 });
  const a = await khach('g@example.vn'), b = await khach('h@example.vn');
  const r = await dung(a, ma, 'ban-than', b.laSoId);
  assert.equal(r.status, 403);
  assert.equal(M.db.prepare('SELECT COUNT(*) n FROM ma_moi_dung WHERE ma=?').get(ma).n, 0); // không đốt lượt
  assert.equal((await dung(a, ma, 'khong-co')).status, 400); // chủ đề không có: không đốt mã
  assert.equal((await dung(a, ma, 'van-nam-2027')).status, 400); // cờ VAN_NAM_THU chưa bật
  assert.equal((await dung(a, ma, 'van-10-nam')).status, 400);
  assert.equal((await dung({ cookie: '', laSoId: a.laSoId }, ma, 'ban-than')).status, 401);
  const sai = await x.maMoiDung(new Request('https://' + HOST + '/api/ma-moi/dung', { method: 'POST', headers: { host: HOST, origin: 'https://evil.test', 'content-type': 'application/json', cookie: a.cookie }, body: JSON.stringify({ ma, laSoId: a.laSoId, chuDe: 'ban-than', phien: PH }) }), M);
  assert.equal(sai.status, 403);
});

test('Vận năm 2027 chỉ chọn được khi cờ VAN_NAM_THU=1', async () => {
  const [ma] = mm.taoMa(M.db, { nguon: 'anh', soLuong: 1 });
  const a = await khach('i@example.vn');
  assert.equal((await dung(a, ma, 'van-nam-2027')).status, 400);
  process.env.VAN_NAM_THU = '1';
  try {
    const kiem = await (await x.maMoiKiem(yc('/api/ma-moi/kiem?ma=' + ma, { cookie: a.cookie }), M)).json();
    assert.ok(kiem.chuDe.includes('van-nam-2027'));
    assert.equal((await dung(a, ma, 'van-nam-2027')).status, 200);
    assert.ok(dv.dsQuyen(M.db, M.db.prepare('SELECT nguoi_dung_id n FROM la_so WHERE id=?').get(a.laSoId).n).some((q) => q.loai === 'van_nam'));
  } finally { delete process.env.VAN_NAM_THU; }
});

test('/vao: mã đúng ghi vao_moi kèm nguon từ máy chủ; mã sai trả hopLe:false và không ghi', async () => {
  const [ma] = mm.taoMa(M.db, { nguon: 'cd-3c', soLuong: 1, gioiHan: 3 });
  const truoc = docDong().length;
  const sai = await (await x.maMoiVao(yc('/api/ma-moi/vao', { method: 'POST', body: { ma: 'KHONGCO1', phien: PH } }), M)).json();
  assert.deepEqual(sai, { hopLe: false, ly: 'sai' });
  assert.equal(docDong().length, truoc);
  const ok = await x.maMoiVao(yc('/api/ma-moi/vao', { method: 'POST', body: { ma, phien: PH, nguon: 'gia-mao' } }), M);
  assert.deepEqual(await ok.json(), { hopLe: true });
  const dong = docDong().at(-1);
  assert.equal(dong.ten, 'vao_moi'); assert.equal(dong.nguon, 'cd-3c'); assert.equal(dong.phien, PH);
  assert.equal((await x.maMoiVao(yc('/api/ma-moi/vao', { method: 'POST', body: { ma, phien: 'ngan' } }), M)).status, 400);
});

test('sự kiện: vao_moi/dung_ma_moi không nhận từ máy khách; bam_gop_y nhận, không kèm nguon', () => {
  for (const ten of ['vao_moi', 'dung_ma_moi']) assert.equal(kiemTraSuKien({ ten, phien: PH, nguon: 'tuvivn' }), null);
  assert.deepEqual(kiemTraSuKien({ ten: 'bam_gop_y', phien: PH }), { ten: 'bam_gop_y', phien: PH });
  assert.equal(kiemTraSuKien({ ten: 'bam_gop_y', phien: PH, nguon: 'tuvivn' }), null);
  assert.equal(kiemTraSuKien({ ten: 'bam_gop_y', phien: PH, email: 'a@b.vn' }), null);
});

test('báo cáo theo nguồn: đếm đúng phiên khác nhau; phiên ngoài mã không tính; lọc theo ngày', () => {
  const t = Date.UTC(2026, 10, 25, 3);
  const d = (phien, ten, extra = {}) => ({ t, ten, phien, ...extra });
  const dongs = [
    d('A', 'vao_moi', { nguon: 'tuvivn' }), d('A', 'vao_moi', { nguon: 'tuvivn' }), d('A', 'lap_la_so'), d('A', 'dung_ma_moi', { nguon: 'tuvivn' }), d('A', 'bam_gop_y'),
    d('B', 'vao_moi', { nguon: 'tuvivn' }), d('B', 'lap_la_so'), d('B', 'lap_la_so'),
    d('C', 'vao_moi', { nguon: 'anh' }),
    d('Z', 'lap_la_so'), d('Z', 'bam_gop_y'), // không vào bằng mã
    { t: t + 86400_000, ten: 'lap_la_so', phien: 'C' },
  ];
  assert.deepEqual(tinhBaoCao(dongs), {
    anh: { vao: 1, lap: 1, mo: 0, gopY: 0 },
    tuvivn: { vao: 2, lap: 2, mo: 1, gopY: 1 },
  });
  assert.deepEqual(tinhBaoCao(dongs, { ngay: '2026-11-25' }).anh, { vao: 1, lap: 0, mo: 0, gopY: 0 });
});

test('/kiem: người đã dùng mã (hết lượt) vẫn thấy hopLe + nguon để hiện Góp ý; người khác thì không', async () => {
  process.env.GOP_Y_URL = 'https://forms.example/gop-y';
  try {
    const [ma] = mm.taoMa(M.db, { nguon: 'cd-3d', soLuong: 1, gioiHan: 1 });
    const a = await khach('k@example.vn'), b = await khach('l@example.vn');
    assert.equal((await dung(a, ma, 'ban-than')).status, 200);
    const ka = await (await x.maMoiKiem(yc('/api/ma-moi/kiem?ma=' + ma, { cookie: a.cookie }), M)).json();
    assert.deepEqual([ka.hopLe, ka.nguon, ka.daDung, ka.gopYUrl], [true, 'cd-3d', true, 'https://forms.example/gop-y']);
    const kb = await (await x.maMoiKiem(yc('/api/ma-moi/kiem?ma=' + ma, { cookie: b.cookie }), M)).json();
    assert.equal(kb.hopLe, false);
    assert.equal(kb.gopYUrl, undefined);
  } finally { delete process.env.GOP_Y_URL; }
});
