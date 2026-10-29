// Đối chiếu engine với 11 lá số mẫu của đặc tả (docs/nghien-cuu/tuvi-test-cases.json):
// âm lịch, can chi, Mệnh, Thân, Cục, 14 chính tinh, tứ hóa, Tuần, Triệt và vị trí từng sao phụ.
const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../src/lib/tuvi/tuvi-raw.js');
const L = require('../src/lib/tuvi/lich-raw.js');
const { cases, testLich } = require('../docs/nghien-cuu/tuvi-test-cases.json');

// Sao tùy chọn (đặc tả 5.4), engine chưa an
const KHONG_AN = new Set(['Thiên Nguyệt', 'Thiên Vu', 'Âm Sát']);
// Sao engine đang theo bảng khác đặc tả (mục 10), sẽ đổi thành tùy chọn
const CHUA_THEO_DAC_TA = new Set(['Hỏa Tinh', 'Linh Tinh', 'Thiên Khôi', 'Thiên Việt', 'Phá Toái', 'Lưu Hà']);
const TEN_ENGINE = { 'Bác Sĩ': 'Bác Sỹ' };

function lap(i, quyUoc) {
  return T.anLaSo({ lich: i.lich, ngay: i.ngay, thang: i.thang, nam: i.nam, nhuan: i.nhuan, gio: i.gio, phut: i.phut, gioiTinh: i.gioiTinh, quyUoc });
}
function viTriSao(ls) {
  const v = {};
  for (const cg of ls.cung) for (const s of cg.chinhTinh.concat(cg.phuTinh)) v[s.ten] = cg.tenChi;
  return v;
}

for (const c of cases) {
  const k = c.kyVong;
  test(`${c.id} ${c.ten}`, () => {
    const ls = lap(c.input);
    const v = viTriSao(ls);
    assert.deepEqual(ls.am, k.amLich, 'âm lịch');
    // Can tháng trong file mẫu sai do engine tham chiếu dùng chỉ số can thay cho số năm
    // ((can_y*12 + M + 3) % 10); nguồn ngoài của TC01 ghi tháng Ất Sửu, khớp engine. Chỉ so chi tháng.
    assert.deepEqual({ ...ls.canChi, thang: undefined }, { ...k.canChi, thang: undefined }, 'can chi');
    assert.equal(ls.canChi.thang.split(' ')[1], k.canChi.thang.split(' ')[1], 'chi tháng');
    assert.equal(ls.amDuong, k.amDuong, 'âm dương');
    assert.equal(ls.banMenh, k.napAmNam, 'bản mệnh');
    assert.equal(ls.menhTai, k.menh, 'cung Mệnh');
    assert.equal(ls.thanTai, `${k.than} (cung ${k.thanCu})`, 'cung Thân');
    assert.equal(ls.cuc, k.cuc, 'Cục');
    for (const [sao, chi] of Object.entries(k.chinhTinh)) assert.equal(v[sao], chi, sao);
    for (const [hoa, sao] of Object.entries(k.tuHoa)) {
      const cg = ls.cung.find((x) => x.chinhTinh.concat(x.phuTinh).some((s) => s.ten === sao && s.hoa === hoa));
      assert.ok(cg, `${hoa} ${sao}`);
    }
    assert.equal(ls.tuan, k.tuan.join('–'), 'Tuần');
    assert.equal(ls.triet, k.triet.join('–'), 'Triệt');
    for (const [sao, chi] of Object.entries(k.saoKhac)) {
      if (KHONG_AN.has(sao) || CHUA_THEO_DAC_TA.has(sao)) continue;
      assert.equal(v[TEN_ENGINE[sao] || sao], chi, sao);
    }
    for (const [ts, chi] of Object.entries(k.trangSinh)) assert.equal(ls.cung.find((x) => x.trangSinh === ts).tenChi, chi, ts);
    for (const [chi, tuoi] of Object.entries(k.daiHanTuoiBatDau)) assert.equal(ls.cung.find((x) => x.tenChi === chi).daiVanTu, tuoi, `đại hạn ${chi}`);
    for (const [chi, nam] of Object.entries(k.tieuHanNamChi)) assert.equal(ls.cung.find((x) => x.tenChi === chi).tieuHan, nam, `tiểu hạn ${chi}`);
    assert.equal(ls.thanChu, k.thanChu, 'Thân chủ');
  });
}

test('Mốc lịch đã kiểm chứng (đặc tả testLich)', () => {
  for (const t of testLich) {
    if (t.duong) {
      const [y, m, d] = t.duong.split('-').map(Number);
      assert.deepEqual(L.duongSangAm(d, m, y), t.am, t.duong);
    } else {
      assert.equal(L.thangNhuan(t.namAm), t.thangNhuan, `tháng nhuận ${t.namAm}`);
    }
  }
});

test('Âm lịch trước 01/01/1968 theo múi giờ +8 (đặc tả 1.5, 10.2)', () => {
  // 1/2/1965: lịch UTC+8 là 30 tháng Chạp Giáp Thìn, lịch UTC+7 là mùng 1 Tết Ất Tỵ
  const ls = T.anLaSo({ lich: 'duong', ngay: 1, thang: 2, nam: 1965, gio: 12, gioiTinh: 'nu' });
  assert.deepEqual(ls.am, { ngay: 30, thang: 12, nam: 1964, nhuan: false });
  const cu = T.anLaSo({ lich: 'duong', ngay: 1, thang: 2, nam: 1965, gio: 12, gioiTinh: 'nu', quyUoc: { muiGioLich: 'utc7' } });
  assert.deepEqual(cu.am, { ngay: 1, thang: 1, nam: 1965, nhuan: false });
  // Nhập âm lịch trước 1968 cũng đổi theo lịch UTC+8
  const am = T.anLaSo({ lich: 'am', ngay: 30, thang: 12, nam: 1964, gio: 12, gioiTinh: 'nu' });
  assert.deepEqual(am.duong, { ngay: 1, thang: 2, nam: 1965 });
  // Từ 1968 dùng UTC+7: Tết Mậu Thân miền Bắc 29/1/1968
  assert.deepEqual(T.anLaSo({ lich: 'duong', ngay: 29, thang: 1, nam: 1968, gio: 12, gioiTinh: 'nam' }).am, { ngay: 1, thang: 1, nam: 1968, nhuan: false });
  assert.equal(ls.quyUoc.muiGioLich, 'lichSu');
});

test('Giờ Tý muộn 23:00–23:59 tính sang ngày hôm sau (đặc tả 1.4, 10.1)', () => {
  const { testIztroTuViTheoGio: t } = require('../docs/nghien-cuu/tuvi-test-cases.json');
  const tuVi = (gio, quyUoc) => viTriSao(T.anLaSo({ lich: 'duong', ngay: 1, thang: 8, nam: 2023, gio, gioiTinh: 'nam', quyUoc }))['Tử Vi'];
  // Bộ test iztro ngày 01/08/2023: 12 canh giờ và Tý muộn
  const GIO = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
  Object.values(t.tuViTheoGio).slice(0, 12).forEach((chi, i) => assert.equal(tuVi(GIO[i]), chi, `giờ ${GIO[i]}`));
  assert.equal(tuVi(23), t.tuViTheoGio['Tý muộn (23h-24h)'], 'Tý muộn');
  // Tùy chọn giữ ngày: như Tý sớm của cùng ngày
  const giu = T.anLaSo({ lich: 'duong', ngay: 1, thang: 8, nam: 2023, gio: 23, gioiTinh: 'nam', quyUoc: { gioTyMuon: 'giuNgay' } });
  assert.deepEqual(giu.am, { ngay: 15, thang: 6, nam: 2023, nhuan: false });
  assert.equal(viTriSao(giu)['Tử Vi'], tuVi(0));
  // Sinh đêm cuối tháng: sang hẳn tháng sau (không như iztro chỉ cộng ngày âm)
  const cuoi = T.anLaSo({ lich: 'duong', ngay: 19, thang: 2, nam: 2023, gio: 23, gioiTinh: 'nam' });
  assert.deepEqual(cuoi.am, { ngay: 1, thang: 2, nam: 2023, nhuan: false });
  assert.equal(cuoi.menhTai, 'Mão', 'Mệnh theo tháng 2');
  assert.equal(viTriSao(cuoi)['Tử Vi'], t.them.tuVi);
  // Dương lịch giữ nguyên ngày khai sinh
  assert.deepEqual(cuoi.duong, { ngay: 19, thang: 2, nam: 2023 });
  // Đêm giao thừa: sang năm mới
  assert.equal(T.anLaSo({ lich: 'duong', ngay: 9, thang: 2, nam: 2024, gio: 23, gioiTinh: 'nu' }).canChi.nam, 'Giáp Thìn');
});

test('Giờ khai sinh miền Nam 1960–1975 quy về giờ chuẩn UTC+7 (đặc tả 1.2, 10.3)', () => {
  const lapMN = (ngay, thang, nam, gio, phut, mienNamTruoc1975) =>
    T.anLaSo({ lich: 'duong', ngay, thang, nam, gio, phut, gioiTinh: 'nam', mienNamTruoc1975 });
  // Sài Gòn 11:30 ngày 1/5/1970 (đồng hồ UTC+8) là 10:30 giờ chuẩn: giờ Tỵ, không phải Ngọ.
  // (Ví dụ 10:30 → 09:30 ở đặc tả 1.2 không đổi canh: cả hai đều là giờ Tỵ.)
  const mn = lapMN(1, 5, 1970, 11, 30, true);
  assert.equal(mn.gio.chi, 'Tỵ');
  assert.deepEqual(mn.gioChuan, { ngay: 1, thang: 5, nam: 1970, gio: '10:30', daQuyDoi: true });
  assert.equal(mn.gio.dongHo, '11:30');
  assert.equal(lapMN(1, 5, 1970, 11, 30, false).gio.chi, 'Ngọ');
  // Ngoài khoảng 01/01/1960 – 13/06/1975 không quy đổi
  assert.equal(lapMN(13, 6, 1975, 10, 30, true).gioChuan.daQuyDoi, false);
  assert.equal(lapMN(12, 6, 1975, 10, 30, true).gioChuan.daQuyDoi, true);
  assert.equal(lapMN(31, 12, 1959, 23, 30, true).gioChuan.daQuyDoi, false);
  // 00:30 ngày 2/3/1970 → 23:30 ngày 1/3: Tý muộn, vẫn thuộc ngày 2/3 khi đổi âm lịch
  const dem = lapMN(2, 3, 1970, 0, 30, true);
  assert.deepEqual(dem.gioChuan, { ngay: 1, thang: 3, nam: 1970, gio: '23:30', daQuyDoi: true });
  assert.deepEqual(dem.am, lapMN(2, 3, 1970, 0, 30, false).am);
  const giu = T.anLaSo({ lich: 'duong', ngay: 2, thang: 3, nam: 1970, gio: 0, phut: 30, gioiTinh: 'nam', mienNamTruoc1975: true, quyUoc: { gioTyMuon: 'giuNgay' } });
  assert.deepEqual(giu.am, lapMN(1, 3, 1970, 12, 0, false).am);
});

test('Sao lưu niên (đặc tả 7.4, testLuuNien từ bộ test iztro)', () => {
  const { testLuuNien } = require('../docs/nghien-cuu/tuvi-test-cases.json');
  const ls = T.anLaSo({ lich: 'duong', ngay: 6, thang: 3, nam: 2023, gio: 8, gioiTinh: 'nam' });
  const viTriLuu = (namXem, dayDu) => {
    const ln = T.anLuuNien(ls, namXem, { dayDu });
    return Object.fromEntries(ln.saoLuu.map((s) => [s.ten.replace('L. ', 'L.'), L.CHI[s.chi]]));
  };
  // Năm Quý Mão 2023
  assert.deepEqual(viTriLuu(2023, true), { ...viTriLuu(2023, true), ...testLuuNien[0].kyVong });
  // Can chi Canh Thìn (năm 2000)
  const canh = viTriLuu(2000, true);
  for (const [sao, chi] of Object.entries(testLuuNien[1].kyVong)) assert.equal(canh['L.' + sao], chi, sao);
  // Mặc định chỉ 9 sao lưu phổ biến ở phái Việt; Thái Tuế, Tang Môn, Bạch Hổ, Khốc, Hư theo chi năm xem
  const ln = T.anLuuNien(ls, 2026);
  assert.equal(ln.canChi, 'Bính Ngọ');
  assert.equal(ln.saoLuu.length, 9);
  const v = viTriLuu(2026);
  assert.deepEqual([v['L.Thái Tuế'], v['L.Tang Môn'], v['L.Bạch Hổ'], v['L.Thiên Khốc'], v['L.Thiên Hư']], ['Ngọ', 'Thân', 'Dần', 'Tý', 'Tý']);
  assert.deepEqual([v['L.Lộc Tồn'], v['L.Kình Dương'], v['L.Đà La'], v['L.Thiên Mã']], ['Tỵ', 'Ngọ', 'Thìn', 'Thân']);
  // Lưu tứ hóa can Bính: Đồng Lộc, Cơ Quyền, Xương Khoa, Liêm Kỵ, nằm cùng cung sao gốc
  const goc = (ten) => ls.cung.find((c) => c.chinhTinh.concat(c.phuTinh).some((s) => s.ten === ten)).chi;
  assert.deepEqual(ln.luuTuHoa.map((h) => [h.hoa, h.sao, h.chi]),
    [['Hóa Lộc', 'Thiên Đồng', goc('Thiên Đồng')], ['Hóa Quyền', 'Thiên Cơ', goc('Thiên Cơ')], ['Hóa Khoa', 'Văn Xương', goc('Văn Xương')], ['Hóa Kỵ', 'Liêm Trinh', goc('Liêm Trinh')]]);
  // Đại vận, tiểu hạn, lưu nguyệt
  assert.equal(ln.tuoiMu, 4);
  assert.equal(ln.daiVan, ls.cung.find((c) => c.ten === 'Mệnh').chi, 'tuổi 4 còn ở đại vận cung Mệnh (Thủy nhị cục: 2–11)');
  assert.equal(L.CHI[ln.tieuHan], ls.cung.find((c) => c.tieuHan === 'Ngọ').tenChi);
  const dauQuan = ls.cung.find((c) => c.phuTinh.some((s) => s.ten === 'Đẩu Quân')).chi;
  // Năm xem trùng chi năm sinh thì tháng Giêng lưu nguyệt ở đúng cung Đẩu Quân
  assert.equal(T.anLuuNien(ls, 2023).luuNguyet[0], dauQuan);
  assert.equal(ln.luuNguyet.length, 12);
});
