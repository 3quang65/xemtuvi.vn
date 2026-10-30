// Nhận tin Vận 2027 (đồng ý/hủy/không ghi email vào sự kiện) và nền SEO (khung bài, schema, danh mục URL).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const x = nap('lib/may-chu/xu-ly.ts');
const { hopLeMa } = nap('lib/bai-viet/nhom.ts');
const { tachFrontmatter, tachHoiDap, docBai, dsMa } = nap('lib/bai-viet/doc.ts');
const { schemaBai } = nap('lib/bai-viet/schema.ts');
const { kiemTraSuKien } = require('../src/lib/su-kien.js');

const DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'nt-'));
process.env.DATA_DIR = DIR;
const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
const HOST = 'xemtuvi.test';
const post = (url, body) => new Request('https://' + HOST + url, { method: 'POST', headers: { host: HOST, 'content-type': 'application/json', origin: 'https://' + HOST }, body: JSON.stringify(body) });
const dem = () => M.db.prepare('SELECT COUNT(*) n FROM nhan_tin_van_nam').get().n;
const PHIEN = 'abcdefghijklmnopqrstuvwx';

test('nhận tin: chưa tích đồng ý thì không lưu', async () => {
  for (const dongY of [undefined, false, 'true', 1, null]) {
    const r = await x.nhanTinGhi(post('/api/nhan-tin', { email: 'a@b.vn', ...(dongY === undefined ? {} : { dongY }) }), M);
    assert.equal(r.status, 400);
    assert.equal((await r.json()).loi, 'chua_dong_y');
  }
  assert.equal((await x.nhanTinGhi(post('/api/nhan-tin', { email: 'abc', dongY: true }), M)).status, 400);
  assert.equal(dem(), 0);
});

test('nhận tin: tích đồng ý thì lưu; hủy thì có cờ; đăng ký lại xóa cờ', async () => {
  const r = await x.nhanTinGhi(post('/api/nhan-tin', { email: ' Lan@Gmail.com ', dongY: true, nguon: { utm_source: 'fb', bay: 'x' }, phien: PHIEN }), M);
  assert.equal(r.status, 200);
  const { duongHuy } = await r.json();
  const ma = new URL('https://x' + duongHuy).searchParams.get('ma');
  const dong = M.db.prepare('SELECT * FROM nhan_tin_van_nam').get();
  assert.equal(dong.email, 'lan@gmail.com');
  assert.ok(dong.dong_y_luc > 0 && dong.huy_luc === null);
  assert.equal(dong.ban_chu, 'van-nam-2027-v1');
  assert.deepEqual(JSON.parse(dong.nguon), { utm_source: 'fb' });
  assert.equal((await x.lienHeHuy(post('/api/lien-he/huy', { ma: 'sai-ma-khong-ton-tai-123456' }), M)).status, 404);
  assert.equal((await x.lienHeHuy(post('/api/lien-he/huy', { ma }), M)).status, 200);
  assert.ok(M.db.prepare('SELECT huy_luc FROM nhan_tin_van_nam').get().huy_luc > 0);
  await x.nhanTinGhi(post('/api/nhan-tin', { email: 'lan@gmail.com', dongY: true }), M);
  assert.equal(M.db.prepare('SELECT huy_luc FROM nhan_tin_van_nam').get().huy_luc, null);
  assert.equal(dem(), 1);
});

test('sự kiện dang_ky_nhan_tin: ghi ở máy chủ, không chứa email; máy khách không giả được', async () => {
  const tep = fs.readdirSync(path.join(DIR)).flatMap((t) => (t.endsWith('.jsonl') ? [path.join(DIR, t)] : []));
  const dong = fs.readFileSync(tep[0], 'utf8');
  assert.match(dong, /dang_ky_nhan_tin/);
  assert.doesNotMatch(dong, /gmail|@/);
  assert.equal(kiemTraSuKien({ ten: 'dang_ky_nhan_tin', phien: PHIEN }), null);
});

test('danh mục URL: tuổi, cung, sao, chủ đề, kiến thức', () => {
  for (const [n, m] of [['van-nam-2027', 'tuoi-ti'], ['van-nam-2027', 'tuoi-ty'], ['van-nam-2027', 'theo-menh'], ['cung', 'phu-the'], ['sao', 'tu-vi'], ['chu-de', 'su-nghiep'], ['kien-thuc', 'an-sao-la-gi']]) assert.ok(hopLeMa(n, m), `${n}/${m}`);
  for (const [n, m] of [['van-nam-2027', 'tuoi-tỵ'], ['van-nam-2027', 'tuoi-xyz'], ['cung', '../x'], ['sao', 'Tu-Vi'], ['chu-de', 'tai-chinh'], ['kien-thuc', 'A b'], ['khac', 'x']]) assert.ok(!hopLeMa(n, m), `${n}/${m}`);
  assert.equal(docBai('cung', '../../etc/passwd'), null);
});

test('khung bài: frontmatter, hỏi đáp, schema Article + Breadcrumb + FAQPage', () => {
  const { meta, thanBai } = tachFrontmatter('---\ntieuDe: "A: B"\nmoTa: m\n---\nxin chào\n## Hỏi đáp\n### Hỏi 1?\nĐáp 1.\n### Hỏi 2?\nĐáp\nhai.\n## Khác\nx');
  assert.equal(meta.tieuDe, 'A: B');
  assert.deepEqual(tachHoiDap(thanBai), [{ hoi: 'Hỏi 1?', dap: 'Đáp 1.' }, { hoi: 'Hỏi 2?', dap: 'Đáp hai.' }]);
  const b = docBai('cung', 'phu-the');
  assert.ok(b && b.hoiDap.length === 2 && dsMa('cung').includes('phu-the'));
  assert.deepEqual(schemaBai(b).map((s) => s['@type']), ['Article', 'BreadcrumbList', 'FAQPage']);
  assert.deepEqual(schemaBai({ ...b, hoiDap: [] }).map((s) => s['@type']), ['Article', 'BreadcrumbList']);
});
