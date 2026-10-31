// /chon-goi (client) không được kéo bộ dữ liệu luận giải nặng (menh-chinh-tinh.json, tom-tat-mien-phi.json) vào gói JS của khách.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const nap = require('./_nap-ts.cjs');

test('ChonGoi không import chỉ mục luan-giai (chunk nặng)', () => {
  const src = fs.readFileSync(path.join(__dirname, '../src/components/ChonGoi.tsx'), 'utf8');
  assert.doesNotMatch(src, /from '@\/lib\/luan-giai'/);
});

test('đoạn mẫu dự phòng trùng đúng quy tắc MENH-TA-01 trong dữ liệu luận giải', () => {
  const dp = nap('lib/luan-giai/doan-du-phong.ts').DOAN_MAU;
  const goc = require('../src/lib/luan-giai/menh-chinh-tinh.json').menh['Thái Âm'].find((r) => r.ma === 'MENH-TA-01');
  assert.equal(dp.ma, goc.ma);
  assert.equal(dp.cau, goc.cau);
  assert.deepEqual(dp.nguon, goc.nguon);
});

test('ChonGoi không import engine lập lá số trực tiếp (đoạn mẫu nạp trễ qua DoanKhoa)', () => {
  const src = fs.readFileSync(path.join(__dirname, '../src/components/ChonGoi.tsx'), 'utf8');
  assert.doesNotMatch(src, /useLaSoDaLuu|@\/lib\/tuvi/);
  assert.match(src, /dynamic\(\(\) => import\('\.\/DoanKhoa'\)/);
});

test('khung chờ /chon-goi giữ chỗ (min-height) cho cả 375px và 1366px để chân trang không nhảy (CLS)', () => {
  const src = fs.readFileSync(path.join(__dirname, '../src/components/ChonGoi.tsx'), 'utf8');
  assert.match(src, /className="khu-cho-chon-goi"/);
  const css = fs.readFileSync(path.join(__dirname, '../src/app/globals.css'), 'utf8');
  assert.match(css, /\.khu-cho-chon-goi \{ min-height: \d+px; \}/);
  assert.match(css, /@media \(min-width: 641px\) \{ \.khu-cho-chon-goi \{ min-height: \d+px; \} \}/);
});
