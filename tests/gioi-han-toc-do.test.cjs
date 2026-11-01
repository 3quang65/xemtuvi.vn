// Giới hạn tốc độ theo IP cho /api/la-so và /api/luan-giai (L-4c6c58).
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { NextRequest } = require('next/server');
const g = nap('lib/gioi-han-toc-do.ts');
const { middleware } = nap('middleware.ts');

const yc = (path, ip, method = 'POST') => new NextRequest('https://xemtuvi.test' + path, { method, headers: { 'x-forwarded-for': ip } });

test('kiemTra: dưới ngưỡng cho qua, vượt ngưỡng chặn kèm retryAfter', () => {
  const b = g.taoBoDem({ toiDa: 3, cuaSoMs: 60000 });
  for (let i = 0; i < 3; i++) assert.equal(b.kiemTra('1.1.1.1', 1000 + i).choPhep, true);
  const r = b.kiemTra('1.1.1.1', 2000);
  assert.equal(r.choPhep, false);
  assert.equal(r.retryAfter, 59);
  assert.equal(b.kiemTra('2.2.2.2', 2000).choPhep, true, 'IP khác độc lập');
});

test('kiemTra: sang cửa sổ mới thì đếm lại', () => {
  const b = g.taoBoDem({ toiDa: 1, cuaSoMs: 60000 });
  assert.equal(b.kiemTra('a', 0).choPhep, true);
  assert.equal(b.kiemTra('a', 59999).choPhep, false);
  assert.equal(b.kiemTra('a', 60000).choPhep, true);
});

test('cấu hình từ biến môi trường', () => {
  assert.equal(g.docCauHinh({}).toiDa, 60);
  assert.deepEqual(g.docCauHinh({ RATE_LIMIT_MAX: '5', RATE_LIMIT_WINDOW_S: '10' }), { toiDa: 5, cuaSoMs: 10000 });
  assert.equal(g.docCauHinh({ RATE_LIMIT_MAX: 'abc' }).toiDa, 60);
});

test('middleware: vượt ngưỡng /api/la-so và /api/luan-giai trả 429 + Retry-After; dưới ngưỡng 200', () => {
  process.env.RATE_LIMIT_MAX = '3'; process.env.RATE_LIMIT_WINDOW_S = '60';
  g.datLai();
  for (const p of ['/api/la-so', '/api/luan-giai?id=1']) {
    const ip = p.length + '.9.9.9';
    for (let i = 0; i < 3; i++) assert.equal(middleware(yc(p, ip)).status, 200, p + ' lần ' + i);
    const r = middleware(yc(p, ip));
    assert.equal(r.status, 429);
    assert.ok(Number(r.headers.get('retry-after')) >= 1);
  }
});

test('middleware: route khác không bị giới hạn', () => {
  process.env.RATE_LIMIT_MAX = '1'; g.datLai();
  for (let i = 0; i < 5; i++) assert.equal(middleware(yc('/api/gia', '7.7.7.7', 'GET')).status, 200);
  delete process.env.RATE_LIMIT_MAX; delete process.env.RATE_LIMIT_WINDOW_S; g.datLai();
});
