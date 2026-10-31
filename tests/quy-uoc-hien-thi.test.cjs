// Dòng "Lá số lập theo…" cho 3 trường hợp hay lệch với trang khác (L-bbe0d1; đối chiếu docs: nghien-cuu/doi-chieu-la-so-trang-khac_v1 mục 4.3–4.4).
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { lapLaSo, moTaQuyUoc } = nap('lib/tuvi/index.ts');

const nen = { lich: 'duong', gioiTinh: 'nam' };
const cung = (ls) => ls.cung.map((c) => c.chinhTinh.map((s) => s.ten).join('+')).join('|');

test('giờ Tý muộn: có dòng quy ước, đổi giữ ngày thì lá số khác và dòng đổi theo', () => {
  const a = lapLaSo({ ...nen, ngay: 11, thang: 3, nam: 1994, gio: 23, phut: 30 });
  assert.match(moTaQuyUoc(a).join(' '), /tính sang ngày hôm sau/);
  const b = lapLaSo({ ...nen, ngay: 11, thang: 3, nam: 1994, gio: 23, phut: 30, quyUoc: { gioTyMuon: 'giuNgay' } });
  assert.match(moTaQuyUoc(b).join(' '), /giữ ngày sinh cũ/);
  assert.notEqual(a.am.ngay, b.am.ngay);
});

test('trước 1968: lịch UTC+8 mặc định, chọn UTC+7 có dòng riêng, không đổi giờ đồng hồ', () => {
  const a = lapLaSo({ ...nen, ngay: 16, thang: 5, nam: 1961, gio: 14 });
  assert.match(moTaQuyUoc(a).join(' '), /UTC\+8/);
  const b = lapLaSo({ ...nen, ngay: 16, thang: 5, nam: 1961, gio: 14, quyUoc: { muiGioLich: 'utc7' } });
  assert.match(moTaQuyUoc(b).join(' '), /UTC\+7/);
  assert.equal(b.gio.dongHo, a.gio.dongHo);
  assert.notEqual(a.am.ngay, b.am.ngay); // ngày này UTC+8 và UTC+7 lệch 1 ngày
});

test('miền Nam trước 1975: quy về giờ chuẩn mặc định; tắt thì giữ giờ đồng hồ', () => {
  const t = { lich: 'duong', gioiTinh: 'nu', ngay: 5, thang: 8, nam: 1971, gio: 11, phut: 30 };
  const a = lapLaSo({ ...t, mienNamTruoc1975: true });
  assert.ok(a.gioChuan.daQuyDoi);
  assert.match(moTaQuyUoc(a).join(' '), /miền Nam.*giờ chuẩn/);
  const b = lapLaSo({ ...t, mienNamTruoc1975: false });
  assert.ok(!b.gioChuan.daQuyDoi);
  assert.notEqual(cung(a), cung(b));
});

test('lá số thường không có dòng quy ước', () => {
  assert.deepEqual(moTaQuyUoc(lapLaSo({ lich: 'duong', gioiTinh: 'nu', ngay: 8, thang: 3, nam: 1996, gio: 14 })), []);
});

test('L-529450 (Phúc): nút quay lại miền Nam không mất khi lá số dựng lại (coMienNam giữ ở LapLaSo, không ở state của LaSoBan)', () => {
  const fs = require('node:fs'), path = require('node:path');
  const lap = fs.readFileSync(path.join(__dirname, '../src/components/LapLaSo.tsx'), 'utf8');
  const ban = fs.readFileSync(path.join(__dirname, '../src/components/LaSoBan.tsx'), 'utf8');
  assert.match(lap, /coMienNam=\{coMienNam\}/);
  assert.doesNotMatch(ban, /useState\(laSo\.gioChuan\.daQuyDoi\)/);
});
