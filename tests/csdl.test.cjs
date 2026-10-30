const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const mh = nap('lib/may-chu/ma-hoa.ts');

const KHOA = 'khoa-tam-chi-dung-cho-test-0123456789';
const k = mh.taoBoKhoa(KHOA);
const sinh = { ngay: 1, thang: 2, nam: 1990, gio: 5, gioiTinh: 'nu' };

test('mã hóa: giải ngược đúng; sai khóa → lỗi; bị sửa → lỗi', () => {
  const c = mh.maHoaJson(sinh, k);
  assert.ok(!c.includes('1990'));
  assert.deepEqual(mh.giaiMaJson(c, k), sinh);
  assert.notEqual(mh.maHoaJson(sinh, k), c, 'IV ngẫu nhiên');
  assert.throws(() => mh.giaiMa(c, mh.taoBoKhoa('mot-khoa-khac-hoan-toan-0123456789')));
  const hong = Buffer.from(c, 'base64'); hong[hong.length - 1] ^= 1;
  assert.throws(() => mh.giaiMa(hong.toString('base64'), k));
});

test('khoa_tim ổn định theo khóa, khác khi khác dữ liệu/khóa', () => {
  const a = mh.khoaTim(JSON.stringify(sinh), k);
  assert.equal(a, mh.khoaTim(JSON.stringify(sinh), k));
  assert.notEqual(a, mh.khoaTim(JSON.stringify({ ...sinh, nam: 1991 }), k));
  assert.notEqual(a, mh.khoaTim(JSON.stringify(sinh), mh.taoBoKhoa('mot-khoa-khac-hoan-toan-0123456789')));
});

test('thiếu khóa → báo lỗi rõ; khóa quá ngắn → lỗi', () => {
  const cu = { k: process.env.KHOA_DU_LIEU, d: process.env.XTV_DATA_DIR };
  delete process.env.KHOA_DU_LIEU;
  process.env.XTV_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'xtv-'));
  assert.throws(() => mh.taoBoKhoa(), /Thiếu KHOA_DU_LIEU/);
  fs.writeFileSync(path.join(process.env.XTV_DATA_DIR, '.env'), `KHOA_DU_LIEU=${KHOA}\n`);
  assert.doesNotThrow(() => mh.taoBoKhoa());
  assert.throws(() => mh.taoBoKhoa('ngan'), /quá ngắn/);
  if (cu.k) process.env.KHOA_DU_LIEU = cu.k;
  if (cu.d) process.env.XTV_DATA_DIR = cu.d; else delete process.env.XTV_DATA_DIR;
});

test('CSDL: migrations idempotent, tạo người dùng, lá số mã hóa, đơn, quyền', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xtv-db-'));
  const tep = path.join(dir, 'csdl', 'x.db');
  let db = moCsdl(tep);
  assert.equal(db.pragma('journal_mode', { simple: true }), 'wal');
  db.close();
  db = moCsdl(tep); // mở lại: không chạy lại migration
  assert.equal(db.prepare('SELECT COUNT(*) n FROM migrations').get().n, 12);

  const now = Date.now();
  const nd = db.prepare('INSERT INTO nguoi_dung (nha_cung_cap, ma_ngoai, email, tao_luc) VALUES (?,?,?,?)').run('thu', 'a@x.vn', 'a@x.vn', now).lastInsertRowid;
  assert.throws(() => db.prepare('INSERT INTO nguoi_dung (nha_cung_cap, ma_ngoai, email, tao_luc) VALUES (?,?,?,?)').run('thu', 'a@x.vn', 'a@x.vn', now), /UNIQUE/);

  const chuoi = JSON.stringify(sinh);
  const ls = db.prepare('INSERT INTO la_so (nguoi_dung_id, sinh_ma_hoa, khoa_tim, ten_goi, tao_luc) VALUES (?,?,?,?,?)').run(nd, mh.maHoa(chuoi, k), mh.khoaTim(chuoi, k), 'Của tôi', now).lastInsertRowid;
  const dong = db.prepare('SELECT * FROM la_so WHERE khoa_tim = ?').get(mh.khoaTim(chuoi, k));
  assert.equal(dong.id, ls);
  assert.deepEqual(JSON.parse(mh.giaiMa(dong.sinh_ma_hoa, k)), sinh);

  const don = db.prepare("INSERT INTO don_hang (nguoi_dung_id, la_so_id, ma_goi, so_tien, tao_luc) VALUES (?,?,?,?,?)").run(nd, ls, 'tron-la-so', 99000, now).lastInsertRowid;
  assert.equal(db.prepare('SELECT trang_thai FROM don_hang WHERE id=?').get(don).trang_thai, 'cho');
  assert.throws(() => db.prepare("UPDATE don_hang SET trang_thai='la' WHERE id=?").run(don));

  db.prepare("INSERT INTO quyen_xem (nguoi_dung_id, la_so_id, loai, tu_luc, don_hang_id) VALUES (?,?,?,?,?)").run(nd, ls, 'tron_la_so', now, don);
  assert.throws(() => db.prepare("INSERT INTO quyen_xem (nguoi_dung_id, loai, tu_luc, don_hang_id) VALUES (?,?,?,?)").run(nd, 'tron_la_so', now, don), /UNIQUE/, 'một đơn chỉ một quyền');
  db.close();
});

test('repo không chứa khóa thật', () => {
  const env = fs.readFileSync(path.join(os.homedir(), 'xemtuvi-data', '.env'), 'utf8');
  const m = /KHOA_DU_LIEU\s*=\s*(\S+)/.exec(env);
  if (!m) return;
  const { execFileSync } = require('node:child_process');
  let ra = '';
  try { ra = execFileSync('grep', ['-rlF', '--exclude-dir=node_modules', '--exclude-dir=.next', '--exclude-dir=.git', m[1].replace(/^["']|["']$/g, ''), path.join(__dirname, '..')], { encoding: 'utf8' }); } catch { /* grep thoát 1 = không thấy */ }
  assert.equal(ra.trim(), '');
});
