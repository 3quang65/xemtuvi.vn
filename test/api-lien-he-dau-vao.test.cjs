// /api/lien-he: đầu vào xấu (rỗng, quá dài, sai kiểu, honeypot) → từ chối, không lưu.
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('../tests/_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const x = nap('lib/may-chu/xu-ly.ts');

const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
const HOST = 'xemtuvi.test';
const post = (body, raw) => new Request('https://' + HOST + '/api/lien-he', {
  method: 'POST',
  headers: { host: HOST, origin: 'https://' + HOST, 'content-type': 'application/json' },
  body: raw !== undefined ? raw : JSON.stringify(body),
});
const dem = () => M.db.prepare('SELECT COUNT(*) n FROM lien_he').get().n;
const guiXau = async (cac) => { for (const [ten, r] of cac) assert.equal((await x.lienHeGhi(r, M)).status, 400, ten); };

test('rỗng: thân rỗng, {}, giá trị rỗng/chỉ khoảng trắng → 400, không lưu', async () => {
  await guiXau([
    ['thân rỗng', post(null, '')], ['{}', post({})],
    ['email rỗng', post({ loai: 'email', giaTri: '', dongY: true })],
    ['zalo trắng', post({ loai: 'zalo', giaTri: '   ', dongY: true })],
  ]);
  assert.equal(dem(), 0);
});

test('quá dài: email > 120 ký tự, số Zalo quá dài, thân > 4096 byte → 400, không lưu', async () => {
  await guiXau([
    ['email dài', post({ loai: 'email', giaTri: 'a'.repeat(200) + '@gmail.com', dongY: true })],
    ['zalo dài', post({ loai: 'zalo', giaTri: '0912345678'.repeat(10), dongY: true })],
    ['thân to', post({ loai: 'email', giaTri: 'a@b.vn', dongY: true, nguon: { ref: 'x'.repeat(5000) } })],
  ]);
  assert.equal(dem(), 0);
});

test('sai kiểu: giá trị là số/mảng/object, loại lạ, thân là mảng/JSON hỏng → 400, không lưu', async () => {
  await guiXau([
    ['số', post({ loai: 'email', giaTri: 123, dongY: true })],
    ['mảng', post({ loai: 'email', giaTri: ['a@b.vn'], dongY: true })],
    ['object', post({ loai: 'zalo', giaTri: { a: 1 }, dongY: true })],
    ['loại lạ', post({ loai: 'sms', giaTri: '0912345678', dongY: true })],
    ['loại mảng', post({ loai: ['email'], giaTri: 'a@b.vn', dongY: true })],
    ['thân mảng', post(['x'])], ['JSON hỏng', post(null, '{hỏng')],
  ]);
  assert.equal(dem(), 0);
});

test('honeypot: trường bẫy "website" có nội dung (chuỗi, số, true) → từ chối, không lưu; để trống thì vẫn lưu', async () => {
  await guiXau([
    ['chuỗi', post({ loai: 'email', giaTri: 'bot@gmail.com', dongY: true, website: 'http://spam.vn' })],
    ['số', post({ loai: 'email', giaTri: 'bot@gmail.com', dongY: true, website: 1 })],
    ['true', post({ loai: 'email', giaTri: 'bot@gmail.com', dongY: true, website: true })],
  ]);
  assert.equal(dem(), 0);
  assert.equal((await x.lienHeGhi(post({ loai: 'email', giaTri: 'that@gmail.com', dongY: true, website: '' }), M)).status, 200);
  assert.equal(dem(), 1);
});

test('thiếu phiên: không cần phiên/đăng nhập vẫn lưu được liên hệ hợp lệ', async () => {
  const r = await x.lienHeGhi(post({ loai: 'zalo', giaTri: '0912345678', dongY: true }), M);
  assert.equal(r.status, 200);
  assert.equal(dem(), 2);
});
