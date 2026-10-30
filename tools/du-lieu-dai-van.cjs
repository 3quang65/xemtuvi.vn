// In dữ liệu đại vận đang đi (năm xem) của bộ lá số mẫu, để viết và duyệt đoạn luận đại vận.
// Chạy: node tools/du-lieu-dai-van.cjs [năm xem, mặc định 2026] > docs/luan-giai/dai-van/du-lieu.md
const path = require('path');
const E = require(path.join(__dirname, '../src/lib/tuvi/tuvi-raw.js'));
const namXem = +process.argv[2] || 2026;
const MAU = [
  ['DV01', 30, 12, 1973, 22, 30, 'nu'], ['DV02', 20, 12, 1995, 18, 0, 'nam'], ['DV03', 15, 2, 1985, 9, 0, 'nam'],
  ['DV04', 1, 2, 1965, 12, 0, 'nu'], ['DV05', 15, 8, 1990, 7, 30, 'nam'], ['DV06', 9, 9, 1983, 16, 0, 'nu'],
  ['DV07', 18, 4, 1994, 2, 0, 'nam'], ['DV08', 14, 2, 1999, 20, 0, 'nu'], ['DV09', 12, 5, 1992, 10, 0, 'nu'],
  ['DV10', 25, 11, 1979, 13, 0, 'nam'],
];
const fmt = (s) => s.ten + (s.dacTinh ? ' (' + s.dacTinh + ')' : '');
const moTa = (c) => c.ten + ' — ' + c.can + ' ' + c.tenChi + (c.tuan ? ', Tuần' : '') + (c.triet ? ', Triệt' : '') +
  ': ' + (c.chinhTinh.length ? c.chinhTinh.map(fmt).join(', ') : 'vô chính diệu') +
  ' | Cát: ' + (c.catTinh.map(fmt).join(', ') || '—') + ' | Hung: ' + (c.hungTinh.map(fmt).join(', ') || '—');
// Tứ hóa theo can cung vận: mượn anLuuNien của một năm cùng can (chỉ lấy luuTuHoa)
function hoaTheoCan(ls, can) {
  for (let n = 2020; n < 2030; n++) { const l = E.anLuuNien(ls, n); if (l.canChi.split(' ')[0] === can) return l.luuTuHoa; }
  return [];
}
module.exports = { MAU };
if (require.main === module) {
const out = ['# Dữ liệu đại vận 10 lá số mẫu (năm xem ' + namXem + ')', '',
  'Sinh bởi `node tools/du-lieu-dai-van.cjs ' + namXem + '`. Giờ địa phương Việt Nam. Cung vận = cung có tuổi mụ nằm trong khoảng đại vận.', ''];
for (const [ma, ngay, thang, nam, gio, phut, gioiTinh] of MAU) {
  const ls = E.anLaSo({ lich: 'duong', ngay, thang, nam, gio, phut, gioiTinh });
  const l = E.anLuuNien(ls, namXem);
  const v = ls.cung.find((c) => c.chi === l.daiVan);
  const theoChi = (k) => ls.cung.find((c) => c.chi === (v.chi + k) % 12);
  const menh = ls.cung.find((c) => c.ten === 'Mệnh');
  const ten = (chi) => { const c = ls.cung.find((x) => x.chi === chi); return c ? c.ten + ' (' + c.tenChi + ')' : '?'; };
  out.push('## ' + ma + ' — ' + ngay + '/' + thang + '/' + nam + ' ' + gio + ':' + String(phut).padStart(2, '0') + ' ' + (gioiTinh === 'nu' ? 'nữ' : 'nam'),
    '', 'Đầu vào: `' + JSON.stringify({ lich: 'duong', ngay, thang, nam, gio, phut, gioiTinh }) + '`', '',
    '- Âm lịch: ' + ls.canChi.nam + ', ' + ls.amDuong + '. Bản mệnh ' + ls.banMenh + ', ' + ls.cuc + '. Tuổi mụ ' + namXem + ': ' + l.tuoiMu + '.',
    '- Mệnh gốc: ' + moTa(menh));
  if (!v) { out.push('- Chưa vào đại vận đầu (tuổi mụ nhỏ hơn số cục).', ''); continue; }
  out.push('- **Đại vận ' + v.daiVan + ' tuổi tại cung ' + v.ten + '** (' + v.can + ' ' + v.tenChi + ')' + (v.laThan ? ', có Thân' : '') + ', Tràng Sinh: ' + v.trangSinh,
    '  - Cung vận: ' + moTa(v),
    '  - Xung chiếu: ' + moTa(theoChi(6)),
    '  - Tam hợp: ' + moTa(theoChi(4)),
    '  - Tam hợp: ' + moTa(theoChi(8)),
    '  - Giáp: ' + moTa(theoChi(11)) + ' ‖ ' + moTa(theoChi(1)),
    '  - Tứ hóa bản mệnh (' + ls.canChi.nam.split(' ')[0] + ') nằm ở: ' + ls.cung.flatMap((c) => c.chinhTinh.concat(c.phuTinh).filter((s) => /^Hóa /.test(s.ten)).map((s) => s.ten + ' → ' + c.ten)).join('; '),
    '  - Tứ hóa theo can cung vận (' + v.can + '): ' + hoaTheoCan(ls, v.can).map((h) => h.hoa + ' ' + h.sao + ' → ' + ten(h.chi)).join('; '),
    '');
}
console.log(out.join('\n'));
}
