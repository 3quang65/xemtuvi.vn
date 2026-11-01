#!/usr/bin/env node
// L-9279a8 (B1): đo tyLeChuMau cho mỗi bài luận giải trong cache; ghi <tên>.do.json cạnh file cache (không đổi cache).
// Dùng: node tools/do-ty-le-chu-mau.cjs [--cache <thư mục>] [--json]
const fs = require('node:fs');
const path = require('node:path');
const { NGUONG, taoChiMuc, tyLeVoiChiMuc, baiThanhVanBan } = require('./lib/chu-mau.cjs');

const goc = path.join(__dirname, '..');
const i = process.argv.indexOf('--cache');
const thuMuc = path.resolve(i > 0 ? process.argv[i + 1] : path.join(goc, '.cache/luan-giai'));
const KHO = ['quy-tac.json', 'quy-tac-khung.json'].map((f) => path.join(goc, 'src/lib/luan-giai/ai', f));
const noiDung = KHO.flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')).map((q) => q.noiDung).filter(Boolean));
const chiMuc = taoChiMuc(noiDung);

const ds = fs.readdirSync(thuMuc).filter((f) => f.endsWith('.json') && !f.endsWith('.do.json')).sort();
const kq = ds.map((f) => {
  const bai = JSON.parse(fs.readFileSync(path.join(thuMuc, f), 'utf8'));
  const tyLe = tyLeVoiChiMuc(baiThanhVanBan(bai), chiMuc);
  fs.writeFileSync(path.join(thuMuc, f.replace(/\.json$/, '.do.json')), JSON.stringify({ tyLeChuMau: tyLe, nguongTu: NGUONG, soQuyTac: noiDung.length }) + '\n');
  return { file: f, chuyenDe: bai.chuyenDe, tyLeChuMau: tyLe };
});
const so = kq.map((x) => x.tyLeChuMau);
const tom = { soBai: so.length, tb: so.length ? Math.round((so.reduce((a, b) => a + b, 0) / so.length) * 10) / 10 : 0, min: Math.min(...so), max: Math.max(...so) };
if (process.argv.includes('--json')) { console.log(JSON.stringify({ tom, bai: kq }, null, 1)); process.exit(0); }
for (const x of kq) console.log(x.file.slice(0, 10) + '…', x.chuyenDe.padEnd(10), String(x.tyLeChuMau).padStart(5) + '%');
console.log(`\nTóm tắt: ${tom.soBai} bài | TB ${tom.tb}% | min ${tom.min}% | max ${tom.max}% (trần mục tiêu 70%)`);
