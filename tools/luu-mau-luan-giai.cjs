#!/usr/bin/env node
// Lưu một mẫu luận giải vào kho huấn luyện (L-c8e74f). Từ chối mẫu sai (thiếu trường, sai ngưỡng, có SĐT/email, từ cấm).
// Dùng:
//   node tools/luu-mau-luan-giai.cjs --tu <tệp lời giải> --la-so <TC01|tệp.json|'{"lich":"duong",...}'> \
//     --dung 8 --sau 7 --giong 8 --an-toan 10 --nguoi-cham thu --nguoi-viet hanh --nguon hanh --nguon-goc claude \
//     [--chuyen-de menh] [--cau-hoi "…"] [--tang bai|doan] [--ma-quy-tac A,B] [--ty-le-chu-mau 70] [--ly-do-am "…"] [--ngay YYYY-MM-DD] [--thu]
//   --diem N (không bắt buộc): phải bằng trung bình 4 tiêu chí. Dưới ngưỡng → tự lưu thành mẫu âm (kèm lý do). --thu: chỉ kiểm, không ghi.
const fs = require('node:fs');
const path = require('node:path');
const L = require('./lib/mau-luan-giai.cjs');

const a = {};
for (let i = 2; i < process.argv.length; i++) {
  const k = process.argv[i];
  if (!k.startsWith('--')) continue;
  const n = process.argv[i + 1];
  if (n === undefined || n.startsWith('--')) a[k.slice(2)] = true; else { a[k.slice(2)] = n; i++; }
}
const loi = (t) => { console.error('[luu-mau] TỪ CHỐI: ' + t); process.exit(1); };
function dauVao(v) {
  if (!v || v === true) loi('thiếu --la-so');
  if (v.trim().startsWith('{')) return JSON.parse(v);
  if (fs.existsSync(v)) return JSON.parse(fs.readFileSync(v, 'utf8'));
  const tc = require(path.join(L.ROOT, 'docs/nghien-cuu/tuvi-test-cases.json')).cases.find((c) => c.id === v);
  if (!tc) loi('--la-so không phải mã TCxx, tệp JSON hay JSON đầu vào: ' + v);
  return tc.input;
}
try {
  if (!a.tu || a.tu === true) loi('thiếu --tu <tệp lời giải>');
  const num = (k) => (a[k] === undefined ? undefined : Number(a[k]));
  const d = { dung: num('dung'), sau: num('sau'), giong: num('giong'), anToan: num('an-toan') };
  if (Object.values(d).some((x) => x === undefined || Number.isNaN(x))) loi('cần đủ --dung --sau --giong --an-toan (điểm Thư 4 tiêu chí, 0–10)');
  if (a.diem !== undefined && Math.abs(Number(a.diem) - L.diemTB(d)) > 0.011) loi(`--diem ${a.diem} ≠ trung bình 4 tiêu chí (${L.diemTB(d)})`);
  const m = L.taoMau({
    dauVao: dauVao(a['la-so']), loiGiai: fs.readFileSync(a.tu, 'utf8'), diemThu: d, ngay: a.ngay, tang: a.tang, chuyenDe: a['chuyen-de'],
    cauHoi: a['cau-hoi'], maQuyTac: a['ma-quy-tac'] && a['ma-quy-tac'].split(','), tyLeChuMau: a['ty-le-chu-mau'] === undefined ? null : Number(a['ty-le-chu-mau']),
    nguoiViet: a['nguoi-viet'], nguoiBienTap: a['nguoi-bien-tap'], nguoiCham: a['nguoi-cham'], nguon: a.nguon, nguonGoc: a['nguon-goc'] || 'claude',
    lyDoAm: a['ly-do-am'], ghiChu: a['ghi-chu'],
  });
  if (a.thu) { L.kiemTra(m); console.log(`[luu-mau] hợp lệ (${m.loai}, diem ${m.diem}), không ghi (--thu)`); process.exit(0); }
  const kq = L.luu(m);
  console.log(`[luu-mau] ${kq === 'moi' ? 'đã lưu' : 'đã có (bỏ qua)'}: ${m.id} · ${m.loai} · diem ${m.diem} · ${m.chuyenDe || '-'} · ${m.laSoId}`);
} catch (e) { loi(e.message); }
