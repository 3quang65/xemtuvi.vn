// Công cụ mã mời bản thử khách mời (docs/ky-thuat/ban-thu-khach-moi.md).
//   node tools/ma-moi.cjs tao --nguon tuvivn --so-luong 40 --gioi-han 1 [--het-han YYYY-MM-DD] [--ghi-chu "..."]
//   node tools/ma-moi.cjs bao-cao [--ngay YYYY-MM-DD]
//   node tools/ma-moi.cjs ds   (mã, nguồn, giới hạn, đã dùng, hết hạn; không tên khách, không ghi chú)
const path = require('path');
const { docThuMuc } = require('./pheu.cjs');

const NGUON_MOI = 10; // mẫu < 10 phiên/nguồn: chỉ in số đếm, không in tỉ lệ
const ngayVN = (t) => new Date(t + 7 * 3600_000).toISOString().slice(0, 10);

/** Tính theo nguồn. nguon của phiên lấy từ dòng vao_moi do MÁY CHỦ ghi (tra từ mã), không tin máy khách. */
function tinhBaoCao(dongs, { ngay } = {}) {
  const nguonCuaPhien = new Map();
  for (const d of dongs) if (d.ten === 'vao_moi' && d.nguon && !nguonCuaPhien.has(d.phien)) nguonCuaPhien.set(d.phien, d.nguon);
  const ra = {};
  const dem = (nguon, k, phien) => { (ra[nguon] ??= { vao: new Set(), lap: new Set(), mo: new Set(), gopY: new Set() })[k].add(phien); };
  for (const d of dongs) {
    if (ngay && ngayVN(d.t) !== ngay) continue;
    const nguon = nguonCuaPhien.get(d.phien);
    if (!nguon) continue; // phiên không vào bằng mã: không thuộc báo cáo này
    if (d.ten === 'vao_moi') dem(nguon, 'vao', d.phien);
    else if (d.ten === 'lap_la_so') dem(nguon, 'lap', d.phien);
    else if (d.ten === 'dung_ma_moi') dem(nguon, 'mo', d.phien);
    else if (d.ten === 'bam_gop_y') dem(nguon, 'gopY', d.phien);
  }
  return Object.fromEntries(Object.entries(ra).sort().map(([n, v]) => [n, { vao: v.vao.size, lap: v.lap.size, mo: v.mo.size, gopY: v.gopY.size }]));
}

/** Danh sách mã cho CSKH tra khi khách báo "mã không dùng được". Không join sang tài khoản, không in ghi chú. */
function dsMa(db, bayGio = Date.now()) {
  return db.prepare('SELECT m.ma, m.nguon, m.gioi_han, m.het_han, (SELECT COUNT(*) FROM ma_moi_dung d WHERE d.ma = m.ma) AS da_dung FROM ma_moi m ORDER BY m.nguon, m.tao_luc, m.ma').all()
    .map((r) => ({ ma: r.ma, nguon: r.nguon, gioiHan: r.gioi_han, daDung: r.da_dung, hetHan: r.het_han ? ngayVN(r.het_han) : '-', tinhTrang: r.het_han && r.het_han <= bayGio ? 'hết hạn' : r.da_dung >= r.gioi_han ? 'hết lượt' : 'dùng được' }));
}
function inDsMa(ds) {
  if (!ds.length) return console.log('Chưa có mã mời nào.');
  console.log('mã'.padEnd(10) + 'nguồn'.padEnd(9) + 'giới hạn'.padStart(9) + 'đã dùng'.padStart(9) + '  ' + 'hết hạn'.padEnd(12) + 'tình trạng');
  for (const d of ds) console.log(d.ma.padEnd(10) + d.nguon.padEnd(9) + String(d.gioiHan).padStart(9) + String(d.daDung).padStart(9) + '  ' + d.hetHan.padEnd(12) + d.tinhTrang);
  console.log(`Tổng: ${ds.length} mã`);
}

const pct = (a, b) => (b ? (a / b * 100).toFixed(0) + '%' : '-');
function inBaoCao(bc) {
  const nguons = Object.keys(bc);
  if (!nguons.length) return console.log('Chưa có phiên nào vào bằng mã mời.');
  console.log('nguon'.padEnd(10) + 'vào'.padStart(6) + 'lập lá số'.padStart(12) + 'mở chuyên đề'.padStart(14) + 'bấm Góp ý'.padStart(12));
  for (const n of nguons) {
    const v = bc[n];
    console.log(n.padEnd(10) + String(v.vao).padStart(6) + String(v.lap).padStart(12) + String(v.mo).padStart(14) + String(v.gopY).padStart(12)
      + (v.vao >= NGUON_MOI ? `   (lập ${pct(v.lap, v.vao)}, mở ${pct(v.mo, v.vao)}, góp ý ${pct(v.gopY, v.vao)})` : '   (mẫu < 10 phiên: chỉ số đếm)'));
  }
  console.log('Số phản hồi hợp lệ do Quân lấy từ biểu mẫu, không về site.');
}

function thamSo(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) if (argv[i].startsWith('--')) o[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  return o;
}

function chay(argv) {
  const [lenh, ...con] = argv;
  const o = thamSo(con);
  if (lenh === 'tao') {
    const nap = require('../tests/_nap-ts.cjs'); // dùng chung bộ nạp .ts với test; chạy migrations nếu chưa
    const { moCsdl } = nap('lib/may-chu/csdl.ts');
    const { thuMucDuLieu } = nap('lib/may-chu/ma-hoa.ts');
    const { taoMa } = nap('lib/may-chu/ma-moi.ts');
    const db = moCsdl(process.env.XTV_CSDL || path.join(thuMucDuLieu(), 'csdl', 'xemtuvi.db'));
    const hetHan = o['het-han'] ? Date.parse(o['het-han'] + 'T16:59:59Z') : null; // hết ngày theo giờ VN
    if (o['het-han'] && Number.isNaN(hetHan)) throw new Error('het-han dạng YYYY-MM-DD');
    const goc = (process.env.GOC_URL || 'https://xemtuvi.vn').replace(/\/$/, '');
    for (const ma of taoMa(db, { nguon: o.nguon, soLuong: Number(o['so-luong'] ?? 1), gioiHan: o['gioi-han'] ? Number(o['gioi-han']) : 1, hetHan, ghiChu: typeof o['ghi-chu'] === 'string' ? o['ghi-chu'] : undefined })) console.log(`${ma}\t${goc}/moi/${ma}`);
  } else if (lenh === 'ds') {
    const nap = require('../tests/_nap-ts.cjs');
    const { moCsdl } = nap('lib/may-chu/csdl.ts');
    const { thuMucDuLieu } = nap('lib/may-chu/ma-hoa.ts');
    inDsMa(dsMa(moCsdl(process.env.XTV_CSDL || path.join(thuMucDuLieu(), 'csdl', 'xemtuvi.db'))));
  } else if (lenh === 'bao-cao') {
    if (o.ngay && !/^\d{4}-\d{2}-\d{2}$/.test(o.ngay)) throw new Error('ngay dạng YYYY-MM-DD');
    const dir = process.env.DATA_DIR || path.join(require('os').homedir(), 'xemtuvi-data', 'su-kien');
    inBaoCao(tinhBaoCao(docThuMuc(dir), { ngay: o.ngay }));
  } else {
    console.log('Dùng: tao --nguon <tuvivn|anh|cd-3a..cd-3e> --so-luong N [--gioi-han N] [--het-han YYYY-MM-DD] | bao-cao [--ngay YYYY-MM-DD] | ds');
    process.exitCode = 1;
  }
}

if (require.main === module) { try { chay(process.argv.slice(2)); } catch (e) { console.error('Lỗi: ' + e.message); process.exit(1); } }
module.exports = { tinhBaoCao, dsMa };
