// In phễu mua từ các file sự kiện. Chạy: node tools/pheu.cjs  (DATA_DIR=… để đổi thư mục)
//   --nguon        thêm bảng theo nhóm nguồn khách (dac-ta-do-luong_v1.md mục 2–3)
//   --md           in bảng theo nhóm nguồn dạng Markdown (dán vào docs/)
//   --gia-lap      dùng số giả lập (cố định theo --hat=N, mặc định 7) thay cho thư mục thật; không ghi file
//   --gia-lap --ghi=<thư mục>  ghi số giả lập ra JSONL để thử các công cụ khác
const fs = require('fs');
const os = require('os');
const path = require('path');
const { TEN_SU_KIEN, NHOM_NGUON } = require('../src/lib/su-kien.js');
const { MA_GOI } = require('../src/lib/goi-ma.js');
const { trangCua } = require('../src/lib/su-kien.js');

function thuMucMacDinh() { return process.env.DATA_DIR || path.join(os.homedir(), 'xemtuvi-data', 'su-kien'); }

function docThuMuc(dir) {
  if (!fs.existsSync(dir)) return [];
  const ra = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.jsonl')).sort()) {
    for (const l of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) {
      if (!l.trim()) continue;
      try { const o = JSON.parse(l); if (o && o.ten && o.phien) ra.push(o); } catch { /* bỏ dòng hỏng */ }
    }
  }
  return ra;
}

const chia = (a, b) => (b ? a / b : null);

/** Mỗi phiên lấy lần cuối của sự kiện `ten` (khách có thể đổi ý); trả Map phiên → dòng. */
function lanCuoi(dongs, ten) {
  const m = new Map();
  for (const d of dongs) if (d.ten === ten) m.set(d.phien, d);
  return m;
}

function tinhBac(dongs) {
  const xong = [...lanCuoi(dongs, 'thanh_toan_xong').values()];
  const chon = [...lanCuoi(dongs, 'chon_goi').values()];
  const tiLe = (ds) => Object.fromEntries(MA_GOI.map((ma) => [ma, chia(ds.filter((d) => d.goi === ma).length, ds.length)]));
  const coGia = xong.filter((d) => typeof d.gia === 'number');
  const chuDe = {};
  for (const d of chon) if (d.chuDe) chuDe[d.chuDe] = (chuDe[d.chuDe] || 0) + 1;
  const ds = Object.entries(chuDe).sort((a, b) => b[1] - a[1]);
  return {
    soDon: xong.length,
    soChon: chon.length,
    tiLeTrenDon: tiLe(xong),
    tiLeTrenChon: tiLe(chon),
    donTrungBinh: coGia.length ? coGia.reduce((a, d) => a + d.gia, 0) / coGia.length : null,
    tiLeGoiNam: chia(xong.filter((d) => d.goi === 'thanh-vien-nam').length, xong.length),
    chuDe,
    chuDeNhieuNhat: ds.length ? ds[0][0] : null,
  };
}

function tinhPheu(dongs) {
  const phienTheoSk = Object.fromEntries(TEN_SU_KIEN.map((t) => [t, new Set()]));
  const trangTheoPhien = new Map();
  for (const d of dongs) {
    if (!phienTheoSk[d.ten]) continue;
    phienTheoSk[d.ten].add(d.phien);
    if (d.trang === 'vao') continue; // vao_trang là trang đích, không phải một trong 4 màn mua
    if (!trangTheoPhien.has(d.phien)) trangTheoPhien.set(d.phien, new Set());
    if (d.trang) trangTheoPhien.get(d.phien).add(d.trang);
  }
  const phien = Object.fromEntries(TEN_SU_KIEN.map((t) => [t, phienTheoSk[t].size]));
  const xong = [...phienTheoSk.thanh_toan_xong];
  const soMan = xong.map((p) => [...(trangTheoPhien.get(p) || [])].filter((t) => t !== 'luan-giai').length);
  return {
    phien,
    tiLe: {
      lapTrenVao: chia(phien.lap_la_so, phien.vao_form),
      lienHeTrenLap: chia(phien.de_lai_lien_he, phien.lap_la_so),
      bamTrenLap: chia(phien.bam_xem_sau, phien.lap_la_so),
      muaTrenBam: chia(phien.thanh_toan_xong, phien.bam_xem_sau),
      chonTrenChaoBan: chia(phien.chon_goi, phien.vao_chon_goi), // bấm mua trên màn chào bán
      boThanhToan: phien.vao_thanh_toan ? 1 - phien.thanh_toan_xong / phien.vao_thanh_toan : null,
      baoLoiTrenDon: chia(phien.bao_loi, phien.thanh_toan_xong),
    },
    bac: tinhBac(dongs),
    soManTrungBinh: soMan.length ? soMan.reduce((a, b) => a + b, 0) / soMan.length : null,
  };
}

const pct = (x) => (x === null ? 'chưa có dữ liệu' : (x * 100).toFixed(1) + '%');

// ---- Theo nhóm nguồn khách ----
const MAU_TOI_THIEU = 100; // dưới ngưỡng này ghi 'chưa đủ mẫu' (đặc tả mục 3)
const NGUONG = { lap: 0.25, chon: 0.10, tra: 0.12 }; // cảnh báo khi thấp hơn (chỉ khi đủ mẫu)
const CHUA_RO = 'chưa rõ'; // phiên không có vao_trang (dữ liệu trước khi bật đo nguồn)

/** Gộp theo nhóm nguồn: mỗi phiên thuộc nhóm của vao_trang đầu tiên; cùng phiên chỉ đếm 1 lần cho mỗi sự kiện. */
function tinhTheoNguon(dongs) {
  const nhomCuaPhien = new Map();
  for (const d of dongs) if (d.ten === 'vao_trang' && !nhomCuaPhien.has(d.phien) && NHOM_NGUON.includes(d.nhom)) nhomCuaPhien.set(d.phien, d.nhom);
  const tap = {};
  const lay = (n) => (tap[n] = tap[n] || { vao: new Set(), lap: new Set(), xemGia: new Set(), chon: new Set(), tra: new Set(), dangKy: new Set(), loi: new Set() });
  const KHOA = { vao_trang: 'vao', lap_la_so: 'lap', vao_chon_goi: 'xemGia', chon_goi: 'chon', thanh_toan_xong: 'tra', dang_ky_thanh_vien: 'dangKy', bao_loi: 'loi' };
  for (const d of dongs) {
    const k = KHOA[d.ten];
    if (!k) continue;
    const g = lay(nhomCuaPhien.get(d.phien) || CHUA_RO);
    g[k].add(d.phien);
    if (k !== 'vao' && !nhomCuaPhien.has(d.phien)) g.vao.add(d.phien); // phiên cũ không có vao_trang: dùng sự kiện đầu làm mẫu số
  }
  const tong = Object.values(tap).reduce((a, g) => a + g.vao.size, 0);
  const ra = {};
  for (const n of [...NHOM_NGUON, CHUA_RO]) {
    const g = tap[n];
    if (!g || (!g.vao.size && n === CHUA_RO)) { if (n !== CHUA_RO) ra[n] = { phien: 0, tiLePhien: tong ? 0 : null, duMau: false }; continue; }
    const phien = g.vao.size;
    ra[n] = {
      phien, tiLePhien: chia(phien, tong), duMau: phien >= MAU_TOI_THIEU,
      lap: g.lap.size, xemGia: g.xemGia.size, chon: g.chon.size, tra: g.tra.size, dangKy: g.dangKy.size, baoLoi: g.loi.size,
      lapTrenVao: chia(g.lap.size, phien), chonTrenLap: chia(g.chon.size, g.lap.size), traTrenChon: chia(g.tra.size, g.chon.size),
      cpa: null, // chỉ số 5: cần số chi ads nhập tay; chưa chạy ads
    };
  }
  const direct = ra.direct && tong ? ra.direct.phien / tong : 0;
  const canhBao = [];
  for (const [n, r] of Object.entries(ra)) {
    if (!r.duMau) continue;
    if (r.lapTrenVao !== null && r.lapTrenVao < NGUONG.lap) canhBao.push(`${n}: truy cập → lập lá số ${pct(r.lapTrenVao)} (< 25%)`);
    if (r.chonTrenLap !== null && r.chonTrenLap < NGUONG.chon) canhBao.push(`${n}: lập → chọn gói ${pct(r.chonTrenLap)} (< 10%)`);
    if (r.traTrenChon !== null && r.traTrenChon < NGUONG.tra) canhBao.push(`${n}: chọn → trả tiền ${pct(r.traTrenChon)} (< 12%)`);
  }
  if (tong >= MAU_TOI_THIEU && direct > 0.4) canhBao.push(`direct ${pct(direct)} tổng phiên (> 40%: có thể đang thiếu UTM)`);
  return { tong, nhom: ra, canhBao };
}

function bangNguon(t, md) {
  const dau = ['Nhóm nguồn', '1. Phiên', '% tổng', '2. Truy cập → lập lá số', '3. Lập → chọn gói', '4. Chọn → trả tiền', '5. CPA ads'];
  const o = (r, k) => (r.duMau ? pct(r[k]) : r.phien ? 'chưa đủ mẫu' : '—');
  const hang = Object.entries(t.nhom).map(([n, r]) => [n, String(r.phien), r.tiLePhien === null ? '—' : pct(r.tiLePhien), o(r, 'lapTrenVao'), o(r, 'chonTrenLap'), o(r, 'traTrenChon'), 'n/a']);
  if (md) return ['| ' + dau.join(' | ') + ' |', '|' + dau.map(() => '---').join('|') + '|', ...hang.map((h) => '| ' + h.join(' | ') + ' |')].join('\n');
  return [dau, ...hang].map((h) => h.map((c, i) => (i === 0 ? c.padEnd(10) : c.padStart(i === 3 ? 24 : i > 3 ? 18 : 8))).join(' ')).join('\n');
}

// ---- Số giả lập (chỉ để thử báo cáo; không phải số thật) ----
function ngauNhien(hat) { let a = hat >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const MAU_GIA_LAP = { // nhóm: [số phiên, truy cập→lập, lập→chọn, chọn→trả, utm_source, utm_medium, ref]
  'tuvi-vn': [420, 0.52, 0.22, 0.30, 'tuvi-vn', 'site'],
  organic: [260, 0.38, 0.17, 0.27, null, null, 'www.google.com'],
  social: [190, 0.33, 0.14, 0.22, 'facebook', 'social'],
  paid: [310, 0.41, 0.19, 0.25, 'meta', 'cpc'],
  email: [60, 0.55, 0.30, 0.35, 'email', 'email'],
  partner: [40, 0.45, 0.20, 0.30, 'doi-tac-a', 'partner'],
  direct: [150, 0.28, 0.11, 0.20, null, null, null],
  referral: [120, 0.30, 0.12, 0.18, null, null, 'blog.example.vn'],
};
function taoGiaLap(hat = 7) {
  const r = ngauNhien(hat), ra = [];
  let n = 0;
  for (const [nhom, [soPhien, a, b, c, src, med, ref]] of Object.entries(MAU_GIA_LAP)) {
    for (let i = 0; i < soPhien; i++) {
      const phien = 'gl' + String(++n).padStart(14, '0');
      const them = (ten, x) => ra.push({ t: 1, ten, phien, trang: trangCua(ten), ...x });
      them('vao_trang', { ...(src ? { utm_source: src, utm_medium: med } : {}), ...(ref ? { ref } : {}), dich: '/', may: r() < 0.7 ? 'dien-thoai' : 'may-tinh', nhom });
      if (r() >= a) continue;
      them('vao_form'); them('lap_la_so'); them('xem_tom_tat');
      if (r() < 0.8) them('bam_xem_sau');
      them('vao_chon_goi');
      if (r() >= b) continue;
      them('chon_goi', { goi: 'tron-la-so', gia: 99000 });
      if (r() >= 0.8) continue;
      them('vao_thanh_toan', { goi: 'tron-la-so' });
      if (r() < c / 0.8) { them('dang_nhap'); them('thanh_toan_xong', { goi: 'tron-la-so', gia: 99000 }); }
    }
  }
  return ra;
}

function in_(p) {
  console.log('Số phiên theo sự kiện');
  for (const t of TEN_SU_KIEN) console.log('  ' + (t === 'vao_chon_goi' ? 'xem_trang_gia' : t).padEnd(20) + p.phien[t] + (t === 'vao_chon_goi' ? '  (tên ghi: vao_chon_goi)' : ''));
  console.log('Tỉ lệ');
  console.log('  lap_la_so / vao_form          ' + pct(p.tiLe.lapTrenVao) + '  (mục tiêu ≥ 70%)');
  console.log('  de_lai_lien_he / lap_la_so    ' + pct(p.tiLe.lienHeTrenLap) + '  (để lại email/Zalo có đồng ý)');
  console.log('  bam_xem_sau / lap_la_so       ' + pct(p.tiLe.bamTrenLap));
  console.log('  thanh_toan_xong / bam_xem_sau ' + pct(p.tiLe.muaTrenBam));
  console.log('  chon_goi / vao_chon_goi       ' + pct(p.tiLe.chonTrenChaoBan) + '  (bấm mua trên màn chào bán)');
  console.log('  bỏ giữa chừng ở thanh toán    ' + pct(p.tiLe.boThanhToan) + '  (1 − thanh_toan_xong / vao_thanh_toan)');
  console.log('  bao_loi / thanh_toan_xong     ' + pct(p.tiLe.baoLoiTrenDon) + '  (khiếu nại: ' + p.phien.bao_loi + ' phiên)');
  const b = p.bac;
  console.log('Lựa chọn từng bậc (mỗi phiên lấy lần cuối)  · trên đơn (' + b.soDon + ') | trên chon_goi (' + b.soChon + ')');
  for (const ma of MA_GOI) console.log('  ' + ma.padEnd(16) + pct(b.tiLeTrenDon[ma]).padEnd(18) + pct(b.tiLeTrenChon[ma]));
  console.log('Giá trị đơn trung bình: ' + (b.donTrungBinh === null ? 'chưa có dữ liệu' : Math.round(b.donTrungBinh).toLocaleString('vi-VN') + 'đ'));
  console.log('Tỉ lệ gói năm (trên đơn): ' + pct(b.tiLeGoiNam));
  console.log('Chủ đề chọn nhiều nhất: ' + (b.chuDeNhieuNhat ? b.chuDeNhieuNhat + ' ' + JSON.stringify(b.chuDe) : 'chưa có dữ liệu'));
  console.log('Số màn hình trung bình của phiên đã thanh toán: ' + (p.soManTrungBinh === null ? 'chưa có' : p.soManTrungBinh.toFixed(1)) + '  (tối đa 4)');
}

if (require.main === module) {
  const co = (c) => process.argv.includes(c);
  const tham = (t) => (process.argv.find((a) => a.startsWith(t + '=')) || '').slice(t.length + 1);
  const giaLap = co('--gia-lap');
  const dongs = giaLap ? taoGiaLap(Number(tham('--hat')) || 7) : docThuMuc(thuMucMacDinh());
  const ghi = tham('--ghi');
  if (giaLap && ghi) {
    fs.mkdirSync(ghi, { recursive: true });
    fs.writeFileSync(path.join(ghi, 'gia-lap.jsonl'), dongs.map((d) => JSON.stringify(d)).join('\n') + '\n');
    console.log('Đã ghi ' + dongs.length + ' dòng giả lập vào ' + ghi);
  } else if (co('--md')) {
    console.log(bangNguon(tinhTheoNguon(dongs), true));
  } else {
    console.log((giaLap ? 'SỐ GIẢ LẬP (không phải số thật) · ' : 'Thư mục: ' + thuMucMacDinh() + ' · ') + dongs.length + ' dòng');
    in_(tinhPheu(dongs));
    if (co('--nguon') || giaLap) {
      const t = tinhTheoNguon(dongs);
      console.log('\nTheo nhóm nguồn (tổng ' + t.tong + ' phiên; < ' + MAU_TOI_THIEU + ' phiên/nhóm: chưa đủ mẫu)');
      console.log(bangNguon(t, false));
      console.log(t.canhBao.length ? 'Cảnh báo:\n  ' + t.canhBao.join('\n  ') : 'Cảnh báo: không có');
    }
  }
}

module.exports = { tinhPheu, docThuMuc, tinhTheoNguon, bangNguon, taoGiaLap };
