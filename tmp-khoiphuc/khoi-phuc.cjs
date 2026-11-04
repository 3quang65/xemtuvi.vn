#!/usr/bin/env node
// Phục hồi CSDL xemtuvi từ bản sao lưu mới nhất vào /tmp/loc-l-d84422-khoiphuc
// Không đụng CSDL đang chạy, chỉ ĐỌC/đo, không sửa cấu hình.
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const { DatabaseSync } = require('node:sqlite');

const HOME = process.env.HOME || '/home/claude';
const DIR = path.join(HOME, 'xemtuvi-data', 'sao-luu');
const LIVE = process.env.CSDL_TEP || path.join(HOME, 'xemtuvi-data', 'csdl', 'xemtuvi.db');
const DICH = '/tmp/loc-l-d84422-khoiphuc';
const t0 = Date.now();

// Xóa thư mục cũ nếu tồn tại
if (fs.existsSync(DICH)) {
  fs.rmSync(DICH, { recursive: true, force: true });
}
fs.mkdirSync(DICH, { recursive: true, mode: 0o700 });

// Tìm bản mới nhất
const ds = fs.readdirSync(DIR).filter((f) => /^xemtuvi-\d{4}-\d{2}-\d{2}\.db\.gz$/.test(f)).sort();
const tep = path.join(DIR, ds[ds.length - 1]);

// Giải nén vào thư mục đích
const db = path.join(DICH, 'xemtuvi.db');
fs.writeFileSync(db, zlib.gunzipSync(fs.readFileSync(tep)), { mode: 0o600 });

console.log(`=== KHOI PHUC THU ===`);
console.log(`Bản sao lưu: ${tep}`);
console.log(`Thư mục phục hồi: ${DICH}`);
console.log(`Kích thước nén: ${Math.round(fs.statSync(tep).size / 1024)} KB`);

// Kiểm integrity
const kp = new DatabaseSync(db, { readOnly: true });
const ic = Object.values(kp.prepare('PRAGMA integrity_check').get())[0];
console.log(`integrity_check: ${ic}`);

// Đếm số bảng và dòng
const bang = kp.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all().map((r) => r.name);
const TAM_THOI = new Set(['dang_nhap_sai', 'phien']);
let lech = 0;

console.log(`Số bảng: ${bang.length}`);
for (const b of bang) {
  const n = kp.prepare(`SELECT COUNT(*) c FROM "${b}"`).get().c;
  let s = null;
  try { s = new DatabaseSync(LIVE, { readOnly: true }).prepare(`SELECT COUNT(*) c FROM "${b}"`).get().c; }
  catch (e) { s = null; }
  const m = s !== null ? ` đang_chay=${s}` : '';
  const kv = s !== null && n > s && !TAM_THOI.has(b) ? ' <-- LECH' : '';
  console.log(`  ${b.padEnd(24)} sao_luu=${n}${m}${kv}`);
  if (s !== null && n > s && !TAM_THOI.has(b)) lech++;
}

kp.close();

// Đếm tổng số dòng
const tongBang = bang.length;
let tongDong = 0;
const kp2 = new DatabaseSync(db, { readOnly: true });
for (const b of bang) {
  tongDong += kp2.prepare(`SELECT COUNT(*) c FROM "${b}"`).get().c;
}
kp2.close();

const tg = ((Date.now() - t0) / 1000).toFixed(2);
console.log(`\nTổng: ${tongBang} bảng, ${tongDong} dòng`);
console.log(`Thời gian phục hồi: ${tg} giây`);

// Xác nhận xóa thư mục cũ (nếu có từ lần trước)
if (fs.existsSync(DICH) && path.basename(DICH).startsWith('loc-l-d84422-khoiphuc')) {
  console.log(`Đã sẵn sàng xóa thư mục tạm.`);
}

console.log(`\nKHOI PHUC XONG sau ${tg} giây.`);
console.log(`Duong dan tuyet doi: ${DICH}`);
