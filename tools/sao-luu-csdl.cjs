#!/usr/bin/env node
// Sao lưu CSDL xemtuvi: VACUUM INTO -> nén -> giữ 14 bản trên máy -> rclone lên Drive. Chạy 23:15 bằng cron.
// KHÔNG sao lưu .env (khóa KHOA_DU_LIEU) cùng CSDL. Xem docs/ky-thuat/backend.md mục 6.
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const { spawnSync } = require('child_process');
const HOME = process.env.HOME || '/home/claude';
const DATA = path.join(HOME, 'xemtuvi-data');
const DB = process.env.CSDL_TEP || path.join(DATA, 'csdl', 'xemtuvi.db');
const DIR = process.env.SAO_LUU_DIR || path.join(DATA, 'sao-luu');
const DRIVE = process.env.SAO_LUU_DRIVE || 'drive:09 Sao lưu (backup)/Cơ sở dữ liệu/';
const GIU = 14;
const ngay = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);

function canhBao(nd) {
  console.error('[sao-luu] ' + nd);
  spawnSync('office', ['event', 'Sao lưu CSDL xemtuvi: ' + nd, '--actor', 'Sơn', '--kind', 'canh-bao'], { stdio: 'ignore' });
}
function main() {
  if (!fs.existsSync(DB)) { console.log('[sao-luu] chưa có CSDL, bỏ qua: ' + DB); return 0; }
  fs.mkdirSync(DIR, { recursive: true, mode: 0o700 });
  const tam = path.join(DIR, `tam-${ngay}.db`), dich = path.join(DIR, `xemtuvi-${ngay}.db.gz`);
  fs.rmSync(tam, { force: true });
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync(DB);
  try {
    db.exec(`VACUUM INTO '${tam.replace(/'/g, "''")}'`);
  } finally { db.close(); }
  // kiểm bản sao mở được
  const kt = new DatabaseSync(tam, { readOnly: true });
  const ok = kt.prepare('PRAGMA integrity_check').get();
  kt.close();
  if (Object.values(ok)[0] !== 'ok') { fs.rmSync(tam, { force: true }); canhBao('integrity_check lỗi'); return 1; }
  fs.writeFileSync(dich, zlib.gzipSync(fs.readFileSync(tam)), { mode: 0o600 });
  fs.rmSync(tam, { force: true });
  // giữ 14 bản gần nhất trên máy (xoay vòng bản tự sinh)
  const ds = fs.readdirSync(DIR).filter((f) => /^xemtuvi-\d{4}-\d{2}-\d{2}\.db\.gz$/.test(f)).sort();
  for (const f of ds.slice(0, Math.max(0, ds.length - GIU))) fs.rmSync(path.join(DIR, f), { force: true });
  if (process.env.BO_QUA_DRIVE) { console.log('[sao-luu] ok (chỉ máy): ' + dich); return 0; }
  const r = spawnSync('rclone', ['copy', dich, DRIVE], { encoding: 'utf8', timeout: 600_000 });
  if (r.status !== 0) { canhBao('tải lên Drive lỗi: ' + String(r.stderr).slice(-150)); return 2; }
  console.log('[sao-luu] ok: ' + dich + ' -> ' + DRIVE);
  return 0;
}
try { process.exit(main()); } catch (e) { canhBao('lỗi: ' + e.message); process.exit(1); }
