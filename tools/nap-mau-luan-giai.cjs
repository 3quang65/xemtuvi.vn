#!/usr/bin/env node
// Quét lời giải đã được Thư chấm trong docs/luan-giai/ và nạp vào kho mẫu (L-c8e74f). Chạy lại bao nhiêu lần cũng được (trùng id thì bỏ qua).
// Dùng: node tools/nap-mau-luan-giai.cjs [--thu] [--tu-ngay 2026-10-01]   (cron 23:10 hằng đêm, trước sao lưu 23:15)
// Nguồn đã hiểu: mau-1, mau-2 (ban-NN.md + bảng điểm kiem-duyet-1/2), dai-van (DVnn + kiem-duyet-dai-van), tom-tat-mien-phi/sau.md (TCnn + kiem-duyet-tom-tat-mien-phi).
// Không nạp (và lý do) được in cuối: mau-tb (phiếu không có điểm từng bản), van-nam (đầu vào ghi bằng chữ, không có JSON).
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const L = require('./lib/mau-luan-giai.cjs');

const thu = process.argv.includes('--thu');
const iTu = process.argv.indexOf('--tu-ngay');
const TU_NGAY = iTu > 0 ? process.argv[iTu + 1] : '2026-10-01';
const DOC = path.join(L.ROOT, 'docs/luan-giai');
const doc = (f) => fs.readFileSync(path.join(DOC, f), 'utf8');
const ngayTep = (f) => {
  try { return execFileSync('git', ['-C', L.ROOT, 'log', '-1', '--format=%ad', '--date=short', '--', path.join('docs/luan-giai', f)], { encoding: 'utf8' }).trim() || L.hom(); } catch { return L.hom(); }
};
const so = (s) => Number(String(s).replace(/[*\s]/g, '').replace(',', '.'));

/** Bảng điểm: trả { khoá: {dung,sau,giong,anToan} }, dòng sau đè dòng trước (duyệt lại). `cot` = chỉ số cột của "Đúng". */
function bangDiem(text, kieuKhoa) {
  const ra = {};
  let cot = -1; // cột "Đúng" của bảng đang đọc (theo dòng tiêu đề); bảng không có cột Đúng thì bỏ qua
  for (const l of text.split('\n')) {
    if (!l.startsWith('|')) { cot = -1; continue; }
    const c = l.split('|').slice(1, -1).map((x) => x.trim().replace(/\*/g, ''));
    const h = c.indexOf('Đúng');
    if (h >= 0) { cot = h; if (c[h + 1] !== 'Sâu' || c[h + 2] !== 'Giọng' || c[h + 3] !== 'An toàn') cot = -1; continue; }
    const k = kieuKhoa(c[0]);
    if (!k || cot < 0) continue;
    const n = c.slice(cot, cot + 4).map(so);
    if (n.length === 4 && n.every((x) => Number.isFinite(x) && x >= 0 && x <= 10)) ra[k] = { dung: n[0], sau: n[1], giong: n[2], anToan: n[3] };
  }
  return ra;
}
const tcInput = (id) => require(path.join(L.ROOT, 'docs/nghien-cuu/tuvi-test-cases.json')).cases.find((c) => c.id === id)?.input;

const ds = []; // { o: tham số taoMau, nguon: nhãn }
const bo = []; // mục không nạp được { nguon, ly }
function themTungBan(thuMuc, tepDiem) {
  const diem = bangDiem(doc(tepDiem), (k) => (/^\d\d$/.test(k) ? k : null));
  for (const f of fs.readdirSync(path.join(DOC, thuMuc)).filter((x) => /^ban-\d\d\.md$/.test(x)).sort()) {
    const nn = f.slice(4, 6), t = doc(`${thuMuc}/${f}`);
    const dv = (t.match(/^Đầu vào: `(\{.*\})`/m) || [])[1];
    const cd = (t.match(/^# Bản \d+ — \S+ × (\S+)/m) || [])[1];
    const i = t.indexOf('## Bài luận giải');
    if (!dv || i < 0 || !diem[nn]) { bo.push({ nguon: `${thuMuc}/${f}`, ly: 'thiếu đầu vào, bài hoặc điểm' }); continue; }
    const dau = JSON.parse(dv); delete dau.muiGio; // muiGio là chuỗi hiển thị cũ, engine dùng mặc định
    ds.push({ nguon: `${thuMuc}/${f}`, o: { dauVao: dau, loiGiai: t.slice(i).replace(/^## Bài luận giải[^\n]*\n+/, ''), diemThu: diem[nn], ngay: ngayTep(`${thuMuc}/${f}`), chuyenDe: cd, nguoiViet: 'hanh', nguoiCham: 'thu', nguon: 'mau', nguonGoc: 'claude', ghiChu: `nạp từ docs/luan-giai/${thuMuc}/${f}; điểm ${tepDiem}` } });
  }
}
themTungBan('mau-1', 'kiem-duyet-1.md');
themTungBan('mau-2', 'kiem-duyet-2.md');
bo.push({ nguon: 'mau-tb', ly: 'kiem-duyet-tai-bach-chinh-tinh.md không có điểm từng bản (chỉ kết luận CHƯA ĐẠT, P0 2/P1 7)' });
bo.push({ nguon: 'van-nam VN01–03', ly: 'đầu vào ghi bằng chữ ("nữ 12/3/1998 9:00"), cần Hạnh/Thư xác nhận giờ sinh trước khi nạp' });

// Đại vận
{
  const dl = doc('dai-van/du-lieu.md'), diem = bangDiem(doc('kiem-duyet-dai-van.md'), (k) => (/^DV\d\d$/.test(k) ? k : null));
  for (const id of Object.keys(diem).sort()) {
    const khoi = dl.split(/^## /m).find((b) => b.startsWith(id + ' '));
    const dv = khoi && (khoi.match(/Đầu vào: `(\{.*\})`/) || [])[1];
    if (!dv) { bo.push({ nguon: id, ly: 'không thấy đầu vào trong du-lieu.md' }); continue; }
    ds.push({ nguon: `dai-van/${id}`, o: { dauVao: JSON.parse(dv), loiGiai: doc(`dai-van/${id}.md`), diemThu: diem[id], ngay: ngayTep(`dai-van/${id}.md`), chuyenDe: 'dai-van', nguoiViet: 'hanh', nguoiCham: 'thu', nguon: 'hanh', nguonGoc: 'claude', ghiChu: 'điểm lần duyệt cuối trong kiem-duyet-dai-van.md' } });
  }
}
// Tóm tắt miễn phí
{
  const diem = bangDiem(doc('kiem-duyet-tom-tat-mien-phi.md'), (k) => (/^TC\d\d$/.test(k) ? k : null));
  const khoi = doc('tom-tat-mien-phi/sau.md').split(/^## /m);
  for (const id of Object.keys(diem).sort()) {
    const b = khoi.find((x) => x.startsWith(id + ' '));
    const dau = tcInput(id);
    if (!b || !dau) { bo.push({ nguon: id, ly: 'thiếu khối chữ hoặc đầu vào TC' }); continue; }
    ds.push({ nguon: `tom-tat-mien-phi/${id}`, o: { dauVao: dau, loiGiai: b.split('\n').slice(1).join('\n').trim(), diemThu: diem[id], ngay: ngayTep('tom-tat-mien-phi/sau.md'), chuyenDe: 'tom-tat-mien-phi', nguoiViet: 'hanh', nguoiCham: 'thu', nguon: 'mau', nguonGoc: 'claude', ghiChu: 'nạp từ tom-tat-mien-phi/sau.md' } });
  }
}

const daCo = new Set(L.docTatCa().map((x) => x.id));
const dem = { moi: 0, trung: 0, loi: 0, duong: 0, am: 0 };
for (const { nguon, o } of ds) {
  if (o.ngay < TU_NGAY) continue;
  try {
    const m = L.taoMau(o);
    if (thu) { L.kiemTra(m); dem.moi++; dem[m.loai]++; continue; }
    const kq = L.luu(m, { tuyChon: { daCo } });
    dem[kq]++; if (kq === 'moi') dem[m.loai]++;
  } catch (e) { dem.loi++; bo.push({ nguon, ly: e.message }); }
}
console.log(`[nap-mau] ${thu ? '(thử) ' : ''}mới ${dem.moi} (dương ${dem.duong}, âm ${dem.am}) · đã có ${dem.trung} · lỗi ${dem.loi} · kho ${L.KHO}`);
for (const b of bo) console.log(`  - không nạp ${b.nguon}: ${b.ly}`);
