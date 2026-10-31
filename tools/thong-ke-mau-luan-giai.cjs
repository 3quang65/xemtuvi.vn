#!/usr/bin/env node
// Thống kê kho mẫu luận giải (L-c8e74f): số mẫu, điểm TB, phân bố theo chuyên đề / cung / cách cục / tuổi / giới / Tuần-Triệt, tiến độ so mục tiêu 30/11.
// Dùng: node tools/thong-ke-mau-luan-giai.cjs [--json]
const L = require('./lib/mau-luan-giai.cjs');
const ds = L.docTatCa();
const tb = (a) => (a.length ? Math.round((a.reduce((s, x) => s + x, 0) / a.length) * 100) / 100 : 0);
const dem = (a, f) => { const r = {}; for (const m of a) { const k = f(m); if (k == null) continue; r[k] = (r[k] || 0) + 1; } return r; };
const nhomTuoi = (m) => { const t = m.laSo.tuoiMu; return t < 15 ? '<15' : t < 18 ? '15–17 (ngoài nhóm mục tiêu)' : t <= 45 ? '18–45' : '>45'; };
const cachCuc = (m) => {
  const me = m.laSo.cung.find((c) => c.ten === 'Mệnh');
  const ten = me.chinhTinh.map((s) => s.replace(/\(.*$/, '').replace(/\[.*$/, ''));
  return (ten.length ? ten.join(' + ') : 'Vô chính diệu') + (me.tuan ? ' · Tuần' : '') + (me.triet ? ' · Triệt' : '');
};
const chinhTinhMenh = (m) => { const me = m.laSo.cung.find((c) => c.ten === 'Mệnh'); return me.chinhTinh.length ? me.chinhTinh.map((s) => s.replace(/[(\[].*$/, '')).join(' + ') : 'Vô chính diệu'; };
const duong = ds.filter((m) => m.loai === 'duong'), am = ds.filter((m) => m.loai === 'am');
const kq = {
  tong: ds.length, duong: duong.length, am: am.length, tyLeAmPhanTram: ds.length ? Math.round((am.length / ds.length) * 1000) / 10 : 0,
  tang: dem(ds, (m) => m.tang + '/' + m.loai),
  diemTB: { tatCa: tb(ds.map((m) => m.diem)), duong: tb(duong.map((m) => m.diem)), am: tb(am.map((m) => m.diem)),
    dung: tb(ds.map((m) => m.diemThu.dung)), sau: tb(ds.map((m) => m.diemThu.sau)), giong: tb(ds.map((m) => m.diemThu.giong)), anToan: tb(ds.map((m) => m.diemThu.anToan)) },
  chuyenDe: dem(ds, (m) => m.chuyenDe), nguonGoc: dem(ds, (m) => m.nguonGoc), tangDuong: dem(duong, (m) => m.tang), tangAm: dem(am, (m) => m.tang), soSinh: ds.filter((m) => m.sinh).length, nguon: dem(ds, (m) => m.nguon + '/' + m.nguonGoc), nguoiCham: dem(ds, (m) => m.nguoiCham),
  cungMenhChinhTinh: dem(ds, chinhTinhMenh), cachCuc: dem(ds, cachCuc), cungDaiVanHienTai: dem(ds, (m) => m.laSo.daiVanHienTai && m.laSo.daiVanHienTai.cung),
  nhomTuoi: dem(ds, nhomTuoi), gioiTinh: dem(ds, (m) => m.laSo.gioiTinh),
  tuanTriet: dem(ds, (m) => (m.laSo.tuan || m.laSo.triet ? 'có Tuần/Triệt' : 'không')),
  soLaSoKhacNhau: new Set(ds.map((m) => m.laSoId)).size,
  tyLeChuMauDaDo: ds.filter((m) => m.tyLeChuMau != null).length,
  phienBan: dem(ds, (m) => m.phienBanQuyTac + '/' + m.phienBanKho),
  tienDo: { 'bai duong': [duong.filter((m) => m.tang === 'bai').length, 600], 'doan duong': [duong.filter((m) => m.tang === 'doan').length, 1500], 'mau am': [am.length, 150] },
};
if (process.argv.includes('--json')) { console.log(JSON.stringify(kq, null, 1)); process.exit(0); }
const in_ = (t, o) => { console.log('\n' + t); for (const [k, v] of Object.entries(o).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`); };
console.log(`KHO MẪU LUẬN GIẢI: ${L.KHO}`);
console.log(`Tổng ${kq.tong} mẫu · dương ${kq.duong} · âm ${kq.am} (${kq.tyLeAmPhanTram}%; mục tiêu ≥ 20%) · ${kq.soLaSoKhacNhau} lá số khác nhau`);
console.log(`Điểm TB: tất cả ${kq.diemTB.tatCa} · dương ${kq.diemTB.duong} · âm ${kq.diemTB.am} | Đúng ${kq.diemTB.dung} · Sâu ${kq.diemTB.sau} · Giọng ${kq.diemTB.giong} · An toàn ${kq.diemTB.anToan}`);
console.log(`tyLeChuMau đã đo: ${kq.tyLeChuMauDaDo}/${kq.tong} (B1 chưa chạy thì để trống)`);
console.log('Tiến độ mục tiêu 30/11: ' + Object.entries(kq.tienDo).map(([k, [a, b]]) => `${k} ${a}/${b}`).join(' · '));
in_('Theo tầng/loại', kq.tang); in_('Theo nguonGoc', kq.nguonGoc); in_('Theo chuyên đề', kq.chuyenDe); in_('Theo nguồn/nguồn gốc', kq.nguon); in_('Người chấm', kq.nguoiCham);
in_('Theo chính tinh cung Mệnh', kq.cungMenhChinhTinh); in_('Theo cách cục Mệnh (chính tinh + Tuần/Triệt)', kq.cachCuc);
in_('Theo cung đại vận hiện tại', kq.cungDaiVanHienTai); in_('Theo nhóm tuổi', kq.nhomTuoi); in_('Theo giới', kq.gioiTinh); in_('Tuần/Triệt trên lá số', kq.tuanTriet);
in_('Phiên bản an sao/kho quy tắc', kq.phienBan);
