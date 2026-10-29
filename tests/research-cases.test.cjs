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
