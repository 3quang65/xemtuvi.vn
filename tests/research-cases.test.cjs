// Đối chiếu engine với 11 lá số mẫu của đặc tả (docs/nghien-cuu/tuvi-test-cases.json).
// Phần lõi (cung Mệnh, Cục, 14 chính tinh) phải khớp. TC06 (giờ Tý muộn) và TC07 (trước 1968)
// đang để "todo" cho tới khi engine áp dụng quy ước mới của đặc tả.
const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../src/lib/tuvi/tuvi-raw.js');
const { cases } = require('../docs/nghien-cuu/tuvi-test-cases.json');

const CHO_SUA = { TC06: 'Giờ 23h–24h chưa tính sang ngày hôm sau', TC07: 'Âm lịch trước 1968 chưa dùng múi giờ +8' };

for (const c of cases) {
  const i = c.input;
  test(`${c.id} ${c.ten}`, { todo: CHO_SUA[c.id] }, () => {
    const ls = T.anLaSo({ lich: i.lich, ngay: i.ngay, thang: i.thang, nam: i.nam, nhuan: i.nhuan, gio: i.gio, gioiTinh: i.gioiTinh });
    const viTri = {};
    for (const cg of ls.cung) for (const s of cg.chinhTinh) viTri[s.ten] = cg.tenChi;
    assert.equal(ls.menhTai, c.kyVong.menh, 'cung Mệnh');
    assert.equal(ls.cuc, c.kyVong.cuc, 'Cục');
    for (const [sao, chi] of Object.entries(c.kyVong.chinhTinh)) assert.equal(viTri[sao], chi, sao);
  });
}
