// Sinh ở nước ngoài: giờ đồng hồ nơi sinh (UTC±N) quy về giờ chuẩn UTC+7 rồi mới đổi âm lịch, an sao.
// Đối chiếu: lá số phải trùng hệt lá số nhập thẳng giờ Việt Nam tương ứng. Kế hoạch L-9c91de, quy tắc docs/nghien-cuu/quy-tac-sinh-nuoc-ngoai.md.
const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../src/lib/tuvi/tuvi-raw.js');
const nap = require('./_nap-ts.cjs');
const ln = nap('lib/loi-nhap.ts');
const tv = nap('lib/tuvi/index.ts');

const nn = (ngay, thang, nam, gio, phut, muiGioUTC, them = {}) =>
  T.anLaSo({ lich: 'duong', ngay, thang, nam, gio, phut, gioiTinh: 'nu', sinhNuocNgoai: true, muiGioUTC, ...them });
const vn = (ngay, thang, nam, gio, phut, them = {}) =>
  T.anLaSo({ lich: 'duong', ngay, thang, nam, gio, phut, gioiTinh: 'nu', ...them });
const giongLaSo = (a, b) => {
  assert.deepEqual(a.cung, b.cung);
  assert.deepEqual(a.am, b.am);
  assert.deepEqual(a.canChi, b.canChi);
  assert.equal(a.gio.chi, b.gio.chi);
};

test('TC09: Mỹ −5, 03:30 ngày 2/9/1987 = 15:30 UTC+7, âm 10/7 nhuận Đinh Mão, giờ Thân', () => {
  const ls = nn(2, 9, 1987, 3, 30, -5);
  assert.deepEqual(ls.gioChuan, { ngay: 2, thang: 9, nam: 1987, gio: '15:30', daQuyDoi: true, nguon: 'nuocNgoai' });
  assert.deepEqual(ls.am, { ngay: 10, thang: 7, nam: 1987, nhuan: true });
  assert.equal(ls.canChi.nam, 'Đinh Mão');
  assert.equal(ls.gio.chi, 'Thân');
  assert.equal(ls.gio.dongHo, '03:30');
  giongLaSo(ls, vn(2, 9, 1987, 15, 30));
});

test('Mỹ −5, 21:00 ngày 25/11/1981 = 09:00 ngày 26/11 UTC+7, giờ Tỵ', () => {
  const ls = nn(25, 11, 1981, 21, 0, -5);
  assert.deepEqual(ls.gioChuan, { ngay: 26, thang: 11, nam: 1981, gio: '09:00', daQuyDoi: true, nguon: 'nuocNgoai' });
  assert.equal(ls.gio.chi, 'Tỵ');
  giongLaSo(ls, vn(26, 11, 1981, 9, 0));
});

test('Úc +11, 00:30: ngày dương lùi 1, đúng 20:30 hôm trước', () => {
  const ls = nn(15, 6, 1990, 0, 30, 11);
  assert.deepEqual(ls.gioChuan, { ngay: 14, thang: 6, nam: 1990, gio: '20:30', daQuyDoi: true, nguon: 'nuocNgoai' });
  assert.equal(ls.gio.chi, 'Tuất');
  giongLaSo(ls, vn(14, 6, 1990, 20, 30));
  // qua ranh tháng và năm
  assert.deepEqual(nn(1, 1, 1995, 1, 0, 11).gioChuan, { ngay: 31, thang: 12, nam: 1994, gio: '21:00', daQuyDoi: true, nguon: 'nuocNgoai' });
});

test('Ấn Độ +5.5: lệch đúng 1 giờ 30 phút (04:10 → 05:40)', () => {
  const ls = nn(10, 3, 1992, 4, 10, 5.5);
  assert.equal(ls.gioChuan.gio, '05:40');
  assert.equal(ls.gioChuan.ngay, 10);
  giongLaSo(ls, vn(10, 3, 1992, 5, 40));
  // Nepal +5.75 lệch 1 giờ 15
  assert.equal(nn(10, 3, 1992, 4, 10, 5.75).gioChuan.gio, '05:25');
});

test('Giờ Tý muộn áp dụng SAU quy đổi: Nhật +9, 01:30 = 23:30 hôm trước → tính sang ngày giờ Việt kế tiếp', () => {
  const ls = nn(2, 3, 1985, 1, 30, 9);
  assert.deepEqual(ls.gioChuan, { ngay: 1, thang: 3, nam: 1985, gio: '23:30', daQuyDoi: true, nguon: 'nuocNgoai' });
  assert.equal(ls.gio.chi, 'Tý');
  giongLaSo(ls, vn(1, 3, 1985, 23, 30));
  // Ngược lại: Mỹ −5 lúc 11:30 = 23:30 UTC+7 cùng ngày, cũng Tý muộn
  const my = nn(10, 8, 2000, 11, 30, -5);
  assert.equal(my.gioChuan.gio, '23:30');
  giongLaSo(my, vn(10, 8, 2000, 23, 30));
  // Chọn giữ ngày cũ cũng áp dụng sau quy đổi
  giongLaSo(nn(2, 3, 1985, 1, 30, 9, { quyUoc: { gioTyMuon: 'giuNgay' } }), vn(1, 3, 1985, 23, 30, { quyUoc: { gioTyMuon: 'giuNgay' } }));
});

test('Âm lịch sau quy đổi theo khung giờ Việt: trước 1968 dùng UTC+8', () => {
  const ls = nn(10, 2, 1960, 20, 0, -5);   // = 08:00 ngày 11/2/1960 UTC+7
  assert.equal(ls.gioChuan.ngay, 11);
  giongLaSo(ls, vn(11, 2, 1960, 8, 0));
});

test('Múi UTC+7 (ví dụ Thái Lan): không đổi giờ', () => {
  const ls = nn(5, 5, 1999, 14, 20, 7);
  assert.equal(ls.gioChuan.gio, '14:20');
  giongLaSo(ls, vn(5, 5, 1999, 14, 20));
});

test('Hai cờ nước ngoài và miền Nam loại trừ nhau; nhập âm lịch thì bỏ qua cờ nước ngoài', () => {
  assert.throws(() => nn(1, 5, 1970, 11, 30, -5, { mienNamTruoc1975: true }), /loại trừ|không thể/i);
  const am = T.anLaSo({ lich: 'am', ngay: 10, thang: 7, nam: 1987, nhuan: true, gio: 15, phut: 30, gioiTinh: 'nu', sinhNuocNgoai: true, muiGioUTC: -5 });
  assert.equal(am.gioChuan.daQuyDoi, false);
  assert.equal(am.gioChuan.gio, '15:30');
});

test('Hồi quy: không bật cờ thì lá số y như cũ; miền Nam vẫn quy đổi UTC+8', () => {
  const a = vn(1, 5, 1970, 11, 30, { mienNamTruoc1975: true });
  assert.deepEqual(a.gioChuan, { ngay: 1, thang: 5, nam: 1970, gio: '10:30', daQuyDoi: true });
  assert.deepEqual(vn(1, 5, 1970, 11, 30).gioChuan, { ngay: 1, thang: 5, nam: 1970, gio: '11:30', daQuyDoi: false });
});

test('kiemTraThongTin / phanLoaiLoiNhap: múi giờ bắt buộc, −12…+14, hai cờ loại trừ', () => {
  const ok = { lich: 'duong', ngay: 2, thang: 9, nam: 1987, gio: 3, phut: 30, gioiTinh: 'nu' };
  assert.equal(tv.kiemTraThongTin({ ...ok, sinhNuocNgoai: true, muiGioUTC: -5 }), null);
  assert.equal(tv.kiemTraThongTin({ ...ok, sinhNuocNgoai: true, muiGioUTC: 5.5 }), null);
  for (const m of [undefined, NaN, Infinity, -12.5, 15, '3']) {
    assert.ok(tv.kiemTraThongTin({ ...ok, sinhNuocNgoai: true, muiGioUTC: m }), String(m));
  }
  assert.ok(tv.kiemTraThongTin({ ...ok, sinhNuocNgoai: true, muiGioUTC: -5, mienNamTruoc1975: true }));
  assert.equal(tv.kiemTraThongTin({ ...ok, muiGioUTC: 99 }), null, 'không bật cờ thì bỏ qua');
  // phân loại
  assert.equal(ln.phanLoaiLoiNhap({ ...ok, sinhNuocNgoai: true, muiGioUTC: -5 }), null);
  assert.deepEqual(ln.phanLoaiLoiNhap({ ...ok, sinhNuocNgoai: true }), { ma: 'E01', o: 'muiGio', thieu: ['múi giờ nơi sinh'] });
  assert.deepEqual(ln.phanLoaiLoiNhap({ ...ok, sinhNuocNgoai: true, muiGioUTC: 15 }), { ma: 'E03', o: 'muiGio' });
  assert.deepEqual(ln.phanLoaiLoiNhap({ ...ok, sinhNuocNgoai: true, muiGioUTC: -5, mienNamTruoc1975: true }), { ma: 'E03', o: 'muiGio' });
  assert.equal(ln.phanLoaiLoiNhap({ ...ok, muiGioUTC: 99 }), null);
});

test('moTaQuyUoc: câu quy đổi nước ngoài, miền Nam giữ nguyên', () => {
  const ds = tv.moTaQuyUoc(tv.lapLaSo({ lich: 'duong', ngay: 25, thang: 11, nam: 1981, gio: 21, phut: 0, gioiTinh: 'nu', sinhNuocNgoai: true, muiGioUTC: -5, nuoc: 'Hoa Kỳ' }));
  assert.ok(ds.some((s) => s.includes('21:00') && s.includes('UTC-5') && s.includes('09:00') && s.includes('26/11/1981') && s.includes('UTC+7')), ds.join('|'));
  assert.ok(!ds.some((s) => s.includes('miền Nam')));
  const mn = tv.moTaQuyUoc(tv.lapLaSo({ lich: 'duong', ngay: 1, thang: 5, nam: 1970, gio: 11, phut: 30, gioiTinh: 'nam', mienNamTruoc1975: true }));
  assert.ok(mn.some((s) => s.includes('miền Nam')));
  const in5 = tv.moTaQuyUoc(tv.lapLaSo({ lich: 'duong', ngay: 10, thang: 3, nam: 1992, gio: 4, phut: 10, gioiTinh: 'nu', sinhNuocNgoai: true, muiGioUTC: 5.5 }));
  assert.ok(in5.some((s) => s.includes('UTC+5:30')), in5.join('|'));
});

test('Khóa cache luận giải: tách theo ngày chuẩn khi sinh nước ngoài, khóa cũ không đổi', () => {
  const AI = nap('lib/luan-giai/ai/index.ts');
  const k = (t) => AI.khoaCache(tv.lapLaSo(t), 'menh', 'v');
  const goc = { lich: 'duong', ngay: 10, thang: 5, nam: 1990, gio: 12, phut: 0, gioiTinh: 'nu' };
  // −10 và +14 lệch đúng 24 giờ: cùng giờ chuẩn, khác ngày chuẩn
  assert.notEqual(k({ ...goc, sinhNuocNgoai: true, muiGioUTC: -10 }), k({ ...goc, sinhNuocNgoai: true, muiGioUTC: 14 }));
  assert.notEqual(k({ ...goc, sinhNuocNgoai: true, muiGioUTC: -5 }), k({ ...goc, sinhNuocNgoai: true, muiGioUTC: -4 }));
  // khách trong nước: cùng cấu trúc khóa như trước (không thêm thành phần)
  assert.equal(k(goc), AI.khoaCache(tv.lapLaSo({ ...goc }), 'menh', 'v'));
});

test('Máy chủ giữ sinhNuocNgoai, muiGioUTC, nuoc khi lưu lá số', async () => {
  const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
  process.env.DANG_NHAP_THU = '1'; process.env.EMAIL_THU_CHO_PHEP = '@example.vn';
  process.env.NHAT_KY_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'nhat-ky-'));
  const { moCsdl } = nap('lib/may-chu/csdl.ts');
  const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
  const x = nap('lib/may-chu/xu-ly.ts');
  require('./_dang-nhap.cjs')(x);
  const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
  const H = 'xemtuvi.test';
  const yc = (url, body, cookie) => new Request('https://' + H + url, { method: 'POST', headers: { host: H, 'content-type': 'application/json', origin: 'https://' + H, ...(cookie ? { cookie } : {}) }, body: JSON.stringify(body) });
  const r = await x.dangNhap(yc('/api/dang-nhap', { email: 'nn@example.vn' }), M);
  const cookie = 'xtv_phien=' + /xtv_phien=([^;]+)/.exec(r.headers.get('set-cookie'))[1];
  const sinh = { lich: 'duong', ngay: 2, thang: 9, nam: 1987, gio: 3, phut: 30, gioiTinh: 'nu', sinhNuocNgoai: true, muiGioUTC: -5, nuoc: 'Hoa Kỳ', rac: 'x' };
  assert.equal((await x.laSoGhi(yc('/api/la-so', { thongTinSinh: sinh }, cookie), M)).status, 200);
  const ds = await (await x.laSoDoc(new Request('https://' + H + '/api/la-so', { headers: { host: H, cookie } }), M)).json();
  assert.deepEqual(ds.laSo[0].thongTinSinh, { lich: 'duong', ngay: 2, thang: 9, nam: 1987, gio: 3, phut: 30, sinhNuocNgoai: true, muiGioUTC: -5, nuoc: 'Hoa Kỳ', gioiTinh: 'nu' });
  // hai cờ cùng bật: bị từ chối
  assert.equal((await x.laSoGhi(yc('/api/la-so', { thongTinSinh: { ...sinh, mienNamTruoc1975: true } }, cookie), M)).status, 400);
});
