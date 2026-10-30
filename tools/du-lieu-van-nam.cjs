// In dữ liệu Vận năm (lưu niên + 12 tháng lưu nguyệt) của bộ lá số mẫu, để viết và duyệt bài Vận năm.
// Chạy: node tools/du-lieu-van-nam.cjs [năm âm lịch xem, mặc định 2027] > docs/luan-giai/van-nam/du-lieu.md
// Chỉ đọc engine (anLaSo, anLuuNien), không sửa engine. Ngày sinh là dữ liệu giả lập.
const path = require('path');
const E = require(path.join(__dirname, '../src/lib/tuvi/tuvi-raw.js'));
const L = require(path.join(__dirname, '../src/lib/tuvi/lich-raw.js'));
const namXem = +process.argv[2] || 2027;
const MAU = [
  ['VN01', 12, 3, 1998, 9, 0, 'nu'],
  ['VN02', 7, 10, 1990, 15, 0, 'nam'],
  ['VN03', 22, 6, 1981, 5, 0, 'nu'],
];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const fmt = (s) => s.ten + (s.dacTinh ? ' (' + s.dacTinh + ')' : '');
const moTa = (c) => c.ten + ' — ' + c.can + ' ' + c.tenChi + (c.laThan ? ', Thân' : '') + (c.tuan ? ', Tuần' : '') + (c.triet ? ', Triệt' : '') +
  ': ' + (c.chinhTinh.length ? c.chinhTinh.map(fmt).join(', ') : 'vô chính diệu') +
  ' | Cát: ' + (c.catTinh.map(fmt).join(', ') || '—') + ' | Hung: ' + (c.hungTinh.map(fmt).join(', ') || '—');
const ngayDuong = (t) => { const d = L.amSangDuong(1, t, namXem); return d.ngay + '/' + d.thang + '/' + d.nam; };

module.exports = { MAU };
if (require.main === module) {
  const out = ['# Dữ liệu Vận năm ' + namXem + ' của 3 lá số mẫu (giả lập)', '',
    'Sinh bởi `node tools/du-lieu-van-nam.cjs ' + namXem + '`. Giờ địa phương Việt Nam. Ngày sinh **giả lập**, không phải người thật.',
    'Lưu tứ hóa, sao lưu, Lưu Thái Tuế, tiểu hạn, lưu nguyệt lấy từ `anLuuNien(ls, ' + namXem + ', { dayDu: true })` (SPEC mục 7).', '',
    'Tháng âm lịch ' + namXem + ' bắt đầu (dương lịch): ' + Array.from({ length: 12 }, (_, i) => 'T' + (i + 1) + ' ' + ngayDuong(i + 1)).join(' · ') +
    '; tháng Giêng năm sau: ' + (() => { const d = L.amSangDuong(1, 1, namXem + 1); return d.ngay + '/' + d.thang + '/' + d.nam; })() + '. Năm không có tháng nhuận: ' + (L.thangNhuan(namXem) === 0 ? 'đúng' : 'sai, nhuận tháng ' + L.thangNhuan(namXem)) + '.', ''];
  for (const [ma, ngay, thang, nam, gio, phut, gioiTinh] of MAU) {
    const ls = E.anLaSo({ lich: 'duong', ngay, thang, nam, gio, phut, gioiTinh });
    const l = E.anLuuNien(ls, namXem, { dayDu: true });
    const c = (chi) => ls.cung[((chi % 12) + 12) % 12];
    const ten = (chi) => c(chi).ten + ' (' + CHI[chi] + ')';
    const luuO = (chi) => l.saoLuu.filter((s) => s.chi === chi).map((s) => s.ten);
    const hoaO = (chi) => l.luuTuHoa.filter((h) => h.chi === chi).map((h) => 'Lưu ' + h.hoa + ' (' + h.sao + ')');
    const nhan = (chi) => { const a = luuO(chi).concat(hoaO(chi)); return a.length ? ' ⟶ lưu: ' + a.join(', ') : ''; };
    const tamPhuong = (chi, nhanCung) => [
      '  - ' + nhanCung + ': ' + moTa(c(chi)) + nhan(chi),
      '    - Xung chiếu: ' + moTa(c(chi + 6)) + nhan((chi + 6) % 12),
      '    - Tam hợp: ' + moTa(c(chi + 4)) + nhan((chi + 4) % 12),
      '    - Tam hợp: ' + moTa(c(chi + 8)) + nhan((chi + 8) % 12),
    ];
    const menh = ls.cung.find((x) => x.ten === 'Mệnh');
    const than = ls.cung.find((x) => x.laThan);
    const dv = l.daiVan == null ? null : c(l.daiVan);
    out.push('## ' + ma + ' — ' + ngay + '/' + thang + '/' + nam + ' ' + gio + ':' + String(phut).padStart(2, '0') + ' ' + (gioiTinh === 'nu' ? 'nữ' : 'nam'), '',
      'Đầu vào: `' + JSON.stringify({ lich: 'duong', ngay, thang, nam, gio, phut, gioiTinh }) + '`', '',
      '- Âm lịch: ' + ls.canChi.nam + ', ' + ls.amDuong + '. Bản mệnh ' + ls.banMenh + ', ' + ls.cuc + '. Tuổi mụ ' + namXem + ' (' + l.canChi + '): ' + l.tuoiMu + '.',
      '- Mệnh gốc: ' + moTa(menh),
      '- Thân cư: ' + than.ten + ' (' + than.tenChi + ')',
      '- Tứ hóa bản mệnh (' + ls.canChi.nam.split(' ')[0] + '): ' + ls.cung.flatMap((x) => x.chinhTinh.concat(x.phuTinh).filter((s) => s.hoa).map((s) => s.hoa + ' ' + s.ten + ' → ' + x.ten)).join('; '),
      '- Lưu tứ hóa (' + l.canChi.split(' ')[0] + '): ' + l.luuTuHoa.map((h) => { const s = c(h.chi).chinhTinh.concat(c(h.chi).phuTinh).find((x) => x.ten === h.sao); return h.hoa + ' ' + h.sao + (s && s.dacTinh ? ' (' + s.dacTinh + ')' : '') + ' → ' + ten(h.chi); }).join('; '),
      '- Sao lưu: ' + l.saoLuu.map((s) => s.ten + ' → ' + ten(s.chi)).join('; '),
      '- **Đại vận**: ' + (dv ? dv.daiVan + ' tuổi tại ' + ten(l.daiVan) : 'chưa vào đại vận'),
      '- **Tiểu hạn**: ' + ten(l.tieuHan) + ' · **Lưu Thái Tuế**: ' + ten(l.luuThaiTue) +
        (l.tieuHan === l.luuThaiTue ? ' (trùng tiểu hạn)' : '') + (l.daiVan === l.tieuHan ? ' · đại vận trùng tiểu hạn' : '') + (l.daiVan === l.luuThaiTue ? ' · đại vận trùng Lưu Thái Tuế' : ''),
      '', '### Ba cung chính của năm', '');
    if (dv) out.push(...tamPhuong(l.daiVan, 'Đại vận'));
    out.push(...tamPhuong(l.tieuHan, 'Tiểu hạn'), ...tamPhuong(l.luuThaiTue, 'Lưu Thái Tuế'));
    out.push('', '### Bốn mảng (cung gốc + sao lưu rơi vào)', '');
    for (const tc of ['Quan Lộc', 'Tài Bạch', 'Phu Thê', 'Tật Ách']) {
      const x = ls.cung.find((k) => k.ten === tc);
      const co = [l.daiVan === x.chi && 'đại vận', l.tieuHan === x.chi && 'tiểu hạn', l.luuThaiTue === x.chi && 'Lưu Thái Tuế'].filter(Boolean);
      out.push('- ' + moTa(x) + nhan(x.chi) + (co.length ? ' · trùng ' + co.join(', ') : ''),
        '  - Xung chiếu: ' + moTa(c(x.chi + 6)) + nhan((x.chi + 6) % 12));
    }
    out.push('', '### 12 tháng lưu nguyệt (Đẩu Quân, SPEC 7.5)', '', '| Tháng (bắt đầu) | Cung | Sao trong cung | Lưu tại cung |', '|---|---|---|---|');
    l.luuNguyet.forEach((chi, i) => {
      const x = c(chi);
      const sao = (x.chinhTinh.length ? x.chinhTinh.map(fmt).join(', ') : 'VCD') + (x.tuan ? ', Tuần' : '') + (x.triet ? ', Triệt' : '') +
        '; ' + x.phuTinh.filter((s) => /Kình|Đà La|Không|Kiếp|Hỏa Tinh|Linh|Tả Phù|Hữu Bật|Xương|Khúc|Khôi|Việt|Lộc Tồn|Thiên Mã|Hóa|Đào|Hồng|Hỷ/.test(s.ten) || s.hoa).map(fmt).join(', ');
      out.push('| T' + (i + 1) + ' (' + ngayDuong(i + 1) + ') | ' + x.ten + ' (' + x.tenChi + ') | ' + sao + ' | ' + (luuO(chi).concat(hoaO(chi)).join(', ') || '—') + ' |');
    });
    out.push('');
  }
  console.log(out.join('\n'));
}
