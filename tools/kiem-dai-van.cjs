// Nghiệm thu đoạn luận đại vận: docs/luan-giai/dai-van/DV01.md … DV10.md.
// Mỗi bản: nêu đúng cung vận + chính tinh (hoặc vô chính diệu) theo engine, có mã quy tắc VAN- tồn tại, không từ cấm.
// Chạy: node tools/kiem-dai-van.cjs [năm xem, mặc định 2026] → mã thoát 1 nếu có lỗi.
const fs = require('fs');
const path = require('path');
const E = require('../src/lib/tuvi/tuvi-raw.js');
const { MAU } = require('./du-lieu-dai-van.cjs');
const goc = path.join(__dirname, '..');
const namXem = +process.argv[2] || 2026;
const quyTac = ['docs/nghien-cuu/luan-giai/dai-van.md', 'docs/nghien-cuu/luan-giai-12-cung.md']
  .filter((f) => fs.existsSync(path.join(goc, f))).map((f) => fs.readFileSync(path.join(goc, f), 'utf8')).join('\n');
const maCo = new Set([...quyTac.matchAll(/\[([A-Z]+(?:-[A-Z0-9]+)+)\]/g)].map((m) => m[1]));
const tuCam = require('../src/lib/luan-giai/ai/tu-cam.json').tuCam;
let loi = 0;
const bao = (ma, s) => { loi++; console.log('✗ ' + ma + ': ' + s); };
for (const [ma, ngay, thang, nam, gio, phut, gioiTinh] of MAU) {
  const f = path.join(goc, 'docs/luan-giai/dai-van', ma + '.md');
  if (!fs.existsSync(f)) { bao(ma, 'thiếu file'); continue; }
  const t = fs.readFileSync(f, 'utf8');
  const truoc = loi;
  const ls = E.anLaSo({ lich: 'duong', ngay, thang, nam, gio, phut, gioiTinh });
  const v = ls.cung.find((c) => c.chi === E.anLuuNien(ls, namXem).daiVan);
  if (!t.includes(v.ten)) bao(ma, 'không nêu cung vận ' + v.ten);
  if (!t.includes(v.daiVan)) bao(ma, 'không nêu khoảng tuổi ' + v.daiVan);
  if (v.chinhTinh.length) v.chinhTinh.forEach((s) => { if (!t.includes(s.ten)) bao(ma, 'không nêu chính tinh ' + s.ten); });
  else if (!/vô chính diệu/i.test(t)) bao(ma, 'cung vận vô chính diệu nhưng không nói rõ');
  const maDung = [...t.matchAll(/<!--\s*quy tắc:([^>]*)-->/g)].flatMap((m) => m[1].split(',').map((x) => x.trim()).filter(Boolean));
  if (!maDung.some((x) => x.startsWith('VAN-'))) bao(ma, 'không có mã quy tắc VAN- trong <!-- quy tắc: … -->');
  maDung.filter((x) => !maCo.has(x)).forEach((x) => bao(ma, 'mã không tồn tại trong bộ quy tắc: ' + x));
  const khach = t.replace(/<!--[\s\S]*?-->/g, '').toLowerCase();
  tuCam.filter((w) => khach.includes(w.toLowerCase())).forEach((w) => bao(ma, 'có từ cấm "' + w + '"'));
  if (loi === truoc) console.log('✓ ' + ma + ' ' + v.ten + ' (' + v.daiVan + '), ' + maDung.length + ' mã');
}
console.log(loi ? loi + ' lỗi' : 'Đạt ' + MAU.length + '/' + MAU.length);
process.exit(loi ? 1 : 0);
