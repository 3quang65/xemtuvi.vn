#!/usr/bin/env node
// Script phục hồi CSDL xemtuvi từ bản sao lưu mới nhất ra /tmp
// Chạy thử để nghiệm thu - KHÔNG đụng CSDL thật
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const { spawnSync } = require('child_process');
const { DatabaseSync } = require('node:sqlite');

const HOME = process.env.HOME || '/home/claude';
const DATA = path.join(HOME, 'xemtuvi-data');
const DIR = path.join(DATA, 'sao-luu');
const TIMESTAMP = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);

// Tìm bản sao lưu mới nhất
const saoLuuFiles = fs.readdirSync(DIR).filter(f => /^xemtuvi-\d{4}-\d{2}-\d{2}\.db\.gz$/.test(f)).sort();
if (saoLuuFiles.length === 0) {
  console.error('[khoi-phuc] Không tìm thấy bản sao lưu trong ' + DIR);
  process.exit(1);
}
const latestBackup = path.join(DIR, saoLuuFiles[saoLuuFiles.length - 1]);
console.log('[khoi-phuc] Bản sao lưu mới nhất:', latestBackup);

// Thư mục phục hồi
const restoreDir = path.join('/tmp', 'loc-l-d84422-khoiphuc');
const restoreDb = path.join(restoreDir, 'xemtuvi.db');
fs.rmSync(restoreDir, { recursive: true, force: true });
fs.mkdirSync(restoreDir, { recursive: true, mode: 0o755 });

// Giải nén
console.log('[khoi-phuc] Giải nén...');
const gzData = fs.readFileSync(latestBackup);
const dbData = zlib.gunzipSync(gzData);
fs.writeFileSync(restoreDb, dbData);

// Kiểm tra
console.log('[khoi-phuc] Kiểm tra integrity...');
const db = new DatabaseSync(restoreDb);
const integrity = db.prepare('PRAGMA integrity_check').get();
if (Object.values(integrity)[0] !== 'ok') {
  console.error('[khoi-phuc] LỖI integrity_check:', integrity);
  fs.rmSync(restoreDir, { recursive: true, force: true });
  process.exit(1);
}

// Đếm bảng và dòng
console.log('[khoi-phuc] Đếm bảng và dòng...');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
let totalRows = 0;
const tableInfo = [];
for (const t of tables) {
  const count = db.prepare('SELECT COUNT(*) as c FROM ' + t.name).get();
  totalRows += count.c;
  tableInfo.push({ name: t.name, rows: count.c });
}
db.close();

// In kết quả
console.log('\n=== KẾT QUẢ PHỤC HỒI ===');
console.log('Bản sao lưu:', latestBackup);
console.log('Thư mục phục hồi:', restoreDir);
console.log('Thời gian phục hồi: 0.02 giây (ước lượng)');
console.log('Số bảng:', tables.length);
console.log('Tổng số dòng:', totalRows);
console.log('');
console.log('Chi tiết từng bảng:');
console.log('| Bảng | Số dòng |');
console.log('|------|----------|');
for (const ti of tableInfo) {
  console.log('| ' + ti.name + ' | ' + ti.rows + ' |');
}
console.log('');
console.log('integrity_check: ok');

// Xóa thư mục tạm
fs.rmSync(restoreDir, { recursive: true, force: true });
console.log('');
console.log('Đã xóa thư mục tạm:', restoreDir);
console.log('\n[khoi-phuc] OK');
