// Nội dung trợ giúp, lỗi thân thiện, tin xác nhận, phân loại lỗi form, tự điền báo lỗi (L-b19e60).
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const tg = nap('lib/tro-giup.ts');
const ln = nap('lib/loi-nhap.ts');
const { kiemTraThongTin } = nap('lib/tuvi/index.ts');

const CAM = [/\[chờ anh Cường duyệt\]/, /\[xác nhận/, /\{gia_/, /\{[a-z_]+\}/, /chờ anh Cường duyệt/];
const MA = ['E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08'];
const phang = (o) => JSON.stringify(o);

test('trang có đúng 10 câu, đánh số 1–10, bốn nhóm', () => {
  const n = tg.nhomCauHoi();
  assert.equal(n.length, 4);
  assert.deepEqual(n.flatMap((g) => g.cau.map((c) => c.so)), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test('cờ giá tắt: /tro-giup không có số tiền; gói năm không xuất hiện', () => {
  const s = phang(tg.nhomCauHoi(false));
  assert.doesNotMatch(s, /\d{1,3}(\.\d{3})+đ/);
  assert.doesNotMatch(s, /[Tt]hành viên năm/);
  assert.equal(tg.cauTraLoiGoi(false), 'Có hai bậc: mở một chủ đề và trọn lá số. Giá ghi rõ ở màn chọn gói, không giá gạch.');
});

test('cờ giá bật: giá lấy từ goi.ts, vẫn không có gói ẩn', () => {
  const goi = nap('lib/goi.ts');
  const c = tg.cauTraLoiGoi(true);
  assert.ok(c.includes(goi.dinhDangGia(goi.layGoi('mot-chu-de').gia)) && c.includes(goi.dinhDangGia(goi.layGoi('tron-la-so').gia)));
  assert.ok(!c.includes(goi.dinhDangGia(goi.layGoi('thanh-vien-nam').gia)));
});

test('không chuỗi cấm, không liên kết tới trang chưa có (/luan-giai-mau, /goi, /lap-la-so, chính sách)', () => {
  const tat = phang([tg.nhomCauHoi(), MA.map((m) => tg.thongBaoLoi(m, { tenOThieu: 'giờ sinh', maDon: 'XTV-000001', tenGoi: 'Trọn lá số' })), tg.tinXacNhanDon({ maDon: 'XTV-000001', tenGoi: 'Trọn lá số', maGoi: 'tron-la-so' }), tg.mauEmailXacNhan({ maDon: 'XTV-000001', tenGoi: 'Trọn lá số', maGoi: 'tron-la-so', linkLuanGiai: '/luan-giai' })]);
  for (const re of CAM) assert.doesNotMatch(tat, re);
  assert.doesNotMatch(tat, /luan-giai-mau|"\/goi"|\/lap-la-so|chinh-sach/);
  assert.doesNotMatch(tat, /Tài khoản thử lưu trong trình duyệt/);
});

test('tám thông báo: đủ E01–E08, không mã lỗi kỹ thuật, không hứa hoàn tiền/thời hạn', () => {
  for (const m of MA) {
    const t = tg.thongBaoLoi(m, { tenOThieu: 'giờ sinh', maDon: 'XTV-000007', tenGoi: 'Trọn lá số' });
    assert.ok(t.tieuDe && t.noiDung && t.nut.length >= 1, m);
    const s = phang(t);
    assert.doesNotMatch(s, /\b(500|404|exception|stack|undefined|null|NaN)\b|la-so-thieu|thanh-toan-gia-lap/i, m);
    assert.doesNotMatch(s, /hoàn tiền|trong vòng|\d+ (giờ|ngày) làm việc/i, m);
  }
});

test('E02 ghi năm 1900–2100 và không nhắc lại ngày khách nhập; E08 dùng câu đã sửa', () => {
  assert.match(tg.thongBaoLoi('E02').noiDung, /1900–2100/);
  assert.doesNotMatch(tg.thongBaoLoi('E02').noiDung, /\d{1,2}\/\d{1,2}/);
  assert.match(tg.thongBaoLoi('E08').noiDung, /Đơn của bạn vẫn được ghi nhận/);
  assert.doesNotMatch(tg.thongBaoLoi('E08').noiDung, /vẫn còn đó/);
});

test('E06 và E07 điền mã đơn, tên gói khi có; thiếu mã đơn vẫn đọc được', () => {
  const e6 = tg.thongBaoLoi('E06', { maDon: 'XTV-000042', tenGoi: 'Trọn lá số' }).noiDung;
  assert.match(e6, /XTV-000042/); assert.match(e6, /gói Trọn lá số/);
  assert.match(tg.thongBaoLoi('E07', { maDon: 'XTV-000042' }).noiDung, /^Đơn XTV-000042 đã được ghi nhận/);
  assert.match(tg.thongBaoLoi('E07').noiDung, /^Đơn của bạn đã được ghi nhận/);
});

test('tin xác nhận 3.1: cờ giá tắt không có giá; bật thì có đúng giá', () => {
  const o = { maDon: 'XTV-000003', tenGoi: 'Trọn lá số', maGoi: 'tron-la-so' };
  assert.equal(tg.tinXacNhanDon(o, false).giaGoi, null);
  assert.doesNotMatch(phang(tg.tinXacNhanDon(o, false)), /\d{1,3}(\.\d{3})+đ/);
  assert.match(tg.tinXacNhanDon(o, true).giaGoi, /^99\.000đ$/);
  assert.doesNotMatch(tg.mauEmailXacNhan({ ...o, linkLuanGiai: '/luan-giai' }, false).noiDung, /Giá hiển thị/);
  assert.match(tg.mauEmailXacNhan({ ...o, linkLuanGiai: '/luan-giai' }, true).noiDung, /Giá hiển thị: 99\.000đ/);
});

test('phân loại lỗi form: E01 thiếu (gộp tên ô), E02 ngày sai, E03 giờ/phút sai', () => {
  const ok = { gioiTinh: 'nu', lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 7, phut: 0 };
  assert.equal(ln.phanLoaiLoiNhap(ok), null);
  const a = ln.phanLoaiLoiNhap({ ...ok, gioiTinh: undefined, gio: NaN });
  assert.deepEqual(a, { ma: 'E01', o: 'gioiTinh', thieu: ['giới tính', 'giờ sinh'] });
  assert.deepEqual(ln.phanLoaiLoiNhap({ ...ok, ngay: 0 }), { ma: 'E01', o: 'ngay', thieu: ['ngày, tháng, năm sinh'] });
  for (const x of [{ ngay: 31, thang: 4 }, { nam: 1899 }, { nam: 2101 }, { thang: 13 }, { ngay: 32 }, { ngay: 29, thang: 2, nam: 2023 }])
    assert.equal(ln.phanLoaiLoiNhap({ ...ok, ...x }).ma, 'E02', JSON.stringify(x));
  assert.equal(ln.phanLoaiLoiNhap({ ...ok, lich: 'am', ngay: 31 }).ma, 'E02');
  for (const x of [{ gio: 24 }, { gio: -1 }, { phut: 60 }]) assert.deepEqual(ln.phanLoaiLoiNhap({ ...ok, ...x }), { ma: 'E03', o: 'gio' });
  assert.equal(ln.noiTen(['a']), 'a'); assert.equal(ln.noiTen(['a', 'b', 'c']), 'a, b và c');
});

test('phân loại khớp engine: null khi và chỉ khi kiemTraThongTin cũng null', () => {
  const gt = [undefined, 'nam', 'nu']; const lich = ['duong', 'am']; const so = [0, 1, 15, 29, 30, 31, 32, NaN];
  let n = 0;
  for (const g of gt) for (const l of lich) for (const ngay of so) for (const thang of [0, 2, 4, 12, 13]) for (const nam of [0, 1899, 1900, 2000, 2024, 2100, 2101])
    for (const gio of [NaN, -1, 0, 23, 24]) for (const phut of [0, 59, 60]) {
      const t = { gioiTinh: g, lich: l, ngay, thang, nam, gio, phut };
      assert.equal(ln.phanLoaiLoiNhap(t) === null, kiemTraThongTin(t) === null, JSON.stringify(t)); n++;
    }
  assert.ok(n > 1000);
});

test('tự điền báo lỗi: đọc tham số an toàn, bỏ giá trị lạ, không có ngày giờ sinh', () => {
  const l = tg.linkBaoLoi({ maDon: tg.maDonHienThi(12), goi: 'tron-la-so', tinhHuong: 'E07' });
  assert.equal(l, '/tro-giup?don=XTV-000012&goi=tron-la-so&th=E07#bao-loi');
  assert.deepEqual(tg.docThamSoBaoLoi('?don=XTV-000012&goi=tron-la-so&th=E07'), { maDon: 'XTV-000012', goi: 'tron-la-so', tinhHuong: 'E07' });
  assert.deepEqual(tg.docThamSoBaoLoi('?don=<script>&goi=a b&th=E99&ngaySinh=1995-08-15'), { maDon: '', goi: '', tinhHuong: '' });
  assert.equal(tg.linkBaoLoi(), '/tro-giup#bao-loi');
});

test('tóm tắt thiết bị: chỉ tên máy và trình duyệt', () => {
  assert.equal(tg.tomTatThietBi('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'), 'iPhone · Safari');
  assert.equal(tg.tomTatThietBi('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36 Edg/120.0'), 'Windows · Edge');
  assert.equal(tg.tomTatThietBi('Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36'), 'Android · Chrome');
});
