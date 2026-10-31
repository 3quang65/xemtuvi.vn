#!/usr/bin/env node
// Thử khôi phục CSDL xemtuvi từ bản sao lưu .db.gz sang THƯ MỤC TẠM (không đụng CSDL đang chạy). L-af0e74.
// Dùng: node tools/khoi-phuc-thu.cjs [tep.db.gz]   (mặc định: bản mới nhất trong ~/xemtuvi-data/sao-luu/)
// Kiểm: giải nén được, integrity_check = ok, số dòng từng bảng so với CSDL đang chạy (bản sao lưu có thể ít hơn do ghi sau lúc sao lưu).
// Xong tự xóa thư mục tạm (chỉ thư mục do chính script tạo). Khôi phục thật: xem docs/ky-thuat/san-sang-ra-mat.md mục 4.
const fs = require('fs'), path = require('path'), os = require('os'), zlib = require('zlib');
const { DatabaseSync } = require('node:sqlite');
const HOME = process.env.HOME || '/home/claude';
const DIR = path.join(HOME, 'xemtuvi-data', 'sao-luu');
const LIVE = process.env.CSDL_TEP || path.join(HOME, 'xemtuvi-data', 'csdl', 'xemtuvi.db');
const t0 = Date.now();
const TAM_THOI = new Set(['dang_nhap_sai', 'phien']); // bảng tự hết hạn/dọn: sao lưu nhiều dòng hơn là bình thường
let tep = process.argv[2];
if (!tep) { const ds = fs.readdirSync(DIR).filter((f) => /^xemtuvi-\d{4}-\d{2}-\d{2}\.db\.gz$/.test(f)).sort(); tep = path.join(DIR, ds[ds.length - 1]); }
const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'xtv-khoi-phuc-'));
let loi = 0;
try {
  const db = path.join(tam, 'xemtuvi.db');
  fs.writeFileSync(db, zlib.gunzipSync(fs.readFileSync(tep)), { mode: 0o600 });
  console.log(`Bản sao lưu: ${tep} (${Math.round(fs.statSync(tep).size / 1024)} KB nén)`);
  const kp = new DatabaseSync(db, { readOnly: true });
  const ic = Object.values(kp.prepare('PRAGMA integrity_check').get())[0];
  console.log(`integrity_check = ${ic}`); if (ic !== 'ok') loi++;
  const bang = kp.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all().map((r) => r.name);
  let song = null; try { song = new DatabaseSync(LIVE, { readOnly: true }); } catch {}
  console.log(`Bảng: ${bang.length}`);
  for (const b of bang) {
    const n = kp.prepare(`SELECT COUNT(*) c FROM "${b}"`).get().c;
    let s = '?'; try { s = song.prepare(`SELECT COUNT(*) c FROM "${b}"`).get().c; } catch {}
    console.log(`  ${b.padEnd(24)} sao lưu=${n}  đang chạy=${s}${s !== '?' && n > s && !TAM_THOI.has(b) ? '  <-- LỆCH: sao lưu nhiều hơn bản chạy' : ''}`);
    if (s !== '?' && n > s && !TAM_THOI.has(b)) loi++;
  }
  kp.close(); if (song) song.close();
  if (!bang.length) loi++;
} catch (e) { console.log('LỖI: ' + e.message); loi++; }
finally { if (path.basename(tam).startsWith('xtv-khoi-phuc-')) fs.rmSync(tam, { recursive: true, force: true }); }
console.log(`${loi ? 'THẤT BẠI' : 'THÀNH CÔNG'} sau ${((Date.now() - t0) / 1000).toFixed(1)} giây; đã xóa thư mục tạm.`);
process.exit(loi ? 1 : 0);
