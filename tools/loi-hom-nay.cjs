#!/usr/bin/env node
// Đếm lỗi hôm nay theo route từ ~/xemtuvi-data/nhat-ky/loi-YYYY-MM-DD.jsonl. > 20 lỗi/giờ -> cảnh báo lên dashboard.
// Dùng: node tools/loi-hom-nay.cjs [--canh-bao]   (tuần tra/cron chạy kèm --canh-bao)
const fs = require('fs'), path = require('path');
const { spawnSync } = require('child_process');
const DIR = process.env.NHAT_KY_DIR || path.join(process.env.HOME || '/home/claude', 'xemtuvi-data', 'nhat-ky');
const NGUONG = 20;
const ngay = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
const tep = path.join(DIR, `loi-${ngay}.jsonl`);
if (!fs.existsSync(tep)) { console.log(`Hôm nay (${ngay}): 0 lỗi`); process.exit(0); }
const theoRoute = {}, theoGio = {}; let tong = 0;
for (const dong of fs.readFileSync(tep, 'utf8').split('\n')) {
  if (!dong.trim()) continue;
  let o; try { o = JSON.parse(dong); } catch { continue; }
  tong++;
  theoRoute[o.route || '?'] = (theoRoute[o.route || '?'] || 0) + 1;
  const g = String(o.t || '').slice(0, 13); theoGio[g] = (theoGio[g] || 0) + 1;
}
console.log(`Hôm nay (${ngay}): ${tong} lỗi`);
for (const [r, n] of Object.entries(theoRoute).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${r}`);
const nong = Object.entries(theoGio).filter(([, n]) => n > NGUONG);
for (const [g, n] of nong) console.log(`CẢNH BÁO: ${n} lỗi trong giờ ${g}`);
if (nong.length && process.argv.includes('--canh-bao')) {
  const nd = `Lỗi xemtuvi.vn vượt ngưỡng: ${nong.map(([g, n]) => `${n} lỗi/giờ ${g}`).join('; ')}`;
  spawnSync('office', ['event', nd, '--actor', 'Sơn', '--kind', 'canh-bao'], { stdio: 'ignore' });
}
