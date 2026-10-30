// In phễu mua từ các file sự kiện. Chạy: node tools/pheu.cjs  (DATA_DIR=… để đổi thư mục)
//   --nguon        thêm bảng theo nhóm nguồn khách (dac-ta-do-luong_v1.md mục 2–3)
//   --md           in bảng theo nhóm nguồn dạng Markdown (dán vào docs/)
//   --nhanh        báo cáo thử nghiệm giá theo nhánh (thu-gia_v1.md): phiên chon_goi, đơn, doanh thu/phiên, tỉ trọng gói, bao_loi, theo nhóm nguồn; kèm --md để dán vào docs/
//   --nhanh --bootstrap=10000 --hat=<số>  thêm chênh lệch (nhánh thử − gốc) + khoảng 95% bằng bootstrap: doanh thu/phiên, tỉ lệ trả tiền, tỉ lệ gói năm (thu-gia_v2.md mục 5 ý 3); hạt cố định → lặp lại y hệt
//   --nhanh --csv  xuất CSV (phiên, thiết bị, nhánh, doanh thu) để kiểm lại độc lập
//   --khao-sat     báo cáo khảo sát 'đáng tiền' theo gói (khao-sat-dang-tien_v1.md mục 3): điểm (a), điểm (c), tỉ lệ trả lời, tỉ lệ bỏ qua; < 30 phản hồi → 'chưa đủ mẫu'; thêm --tuan để tách theo tuần; kèm --gia-lap để ra số mẫu
//   --gom-thu      gồm cả sự kiện thử (mặc định bỏ theo tools/loai-tru-thu.json; không xóa dữ liệu gốc)
//   --gia-lap      dùng số giả lập (cố định theo --hat=N, mặc định 7) thay cho thư mục thật; không ghi file
//   --gia-lap --nhanh  số giả lập có 2 nhánh giá (thử 'a': Trọn lá số 99k so 129k)
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

const FILE_LOAI_TRU = path.join(__dirname, 'loai-tru-thu.json');

/** Đọc danh sách loại trừ sự kiện thử; thiếu/hỏng thì null (giữ hết, không làm mất số thật). */
function docLoaiTru(file = FILE_LOAI_TRU) {
  try { const c = JSON.parse(fs.readFileSync(file, 'utf8')); return c && typeof c === 'object' ? c : null; } catch { return null; }
}

const khopMau = (mau, chuoi) => typeof chuoi === 'string' && new RegExp('^' + String(mau).replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$', 'i').test(chuoi);

/** Tách sự kiện thử khỏi `dongs` theo `cfg` (khoảng giờ, mã phiên, email mẫu). Trả { giu, bo }; không sửa mảng gốc. */
function loaiTruThu(dongs, cfg) {
  if (!cfg) return { giu: dongs, bo: 0 };
  const khoang = (Array.isArray(cfg.khoang) ? cfg.khoang : []).map((k) => [Date.parse(k && k.tu), Date.parse(k && k.den)]).filter(([a, b]) => !isNaN(a) && !isNaN(b));
  const phien = new Set(Array.isArray(cfg.phien) ? cfg.phien : []);
  const mau = Array.isArray(cfg.emailMau) ? cfg.emailMau : [];
  const la = (d) => phien.has(d.phien) || (typeof d.t === 'number' && khoang.some(([a, b]) => d.t >= a && d.t < b)) || mau.some((m) => khopMau(m, d.email));
  const giu = dongs.filter((d) => !la(d));
  return { giu, bo: dongs.length - giu.length };
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

// ---- Theo nhánh thử giá (thu-gia_v1.md mục 1, 5) ----
/** Nhóm nguồn của từng phiên (vao_trang đầu tiên). */
function nhomCuaPhien(dongs) {
  const m = new Map();
  for (const d of dongs) if (d.ten === 'vao_trang' && !m.has(d.phien) && NHOM_NGUON.includes(d.nhom)) m.set(d.phien, d.nhom);
  return m;
}

/**
 * Mỗi phiên chon_goi gắn nhánh của sự kiện đầu có `nhanh` (khóa "<thử>/<nhánh>", vd a/thu).
 * Doanh thu CHỈ tính phiên có chon_goi (phiên chỉ có thanh_toan_xong bị bỏ); giá trị phiên = tổng `gia` MỌI thanh_toan_xong trong phiên (0 nếu không mua).
 * Thiết bị (trường thietBi) xuất hiện ở cả hai nhánh của cùng một thử bị loại khỏi mọi số liệu, kể cả bao_loi.
 */
function phienChonGoi(dongs) {
  const nhanhPhien = new Map(), thietBiPhien = new Map(), nhanhThietBi = new Map();
  for (const d of dongs) {
    if (d.thietBi && !thietBiPhien.has(d.phien)) thietBiPhien.set(d.phien, d.thietBi);
    if (!d.nhanh) continue;
    const k = `${d.thu || '?'}/${d.nhanh}`;
    if (!nhanhPhien.has(d.phien)) nhanhPhien.set(d.phien, k);
    if (d.thietBi) { const t = nhanhThietBi.get(d.thietBi) || new Set(); t.add(k); nhanhThietBi.set(d.thietBi, t); }
  }
  const trung = new Set();
  for (const [tb, ks] of nhanhThietBi) { const theoThu = new Map(); for (const k of ks) { const [thu, nh] = k.split('/'); theoThu.set(thu, (theoThu.get(thu) || new Set()).add(nh)); } if ([...theoThu.values()].some((v) => v.size > 1)) trung.add(tb); }
  const doanhThu = new Map(), coDon = new Set();
  for (const d of dongs) if (d.ten === 'thanh_toan_xong') { coDon.add(d.phien); doanhThu.set(d.phien, (doanhThu.get(d.phien) || 0) + (typeof d.gia === 'number' ? d.gia : 0)); }
  const hang = [];
  for (const [phien, dong] of lanCuoi(dongs, 'chon_goi')) {
    const nhanh = nhanhPhien.get(phien), thietBi = thietBiPhien.get(phien);
    if (!nhanh || (thietBi && trung.has(thietBi))) continue;
    hang.push({ phien, thietBi: thietBi || '', nhanh, goi: dong.goi, doanhThu: doanhThu.get(phien) || 0, tra: coDon.has(phien) ? 1 : 0, nam: dong.goi === 'thanh-vien-nam' ? 1 : 0 });
  }
  return { hang, trung };
}

/** Báo cáo theo nhánh. bao_loi tính theo `nhanh` ghi trên chính sự kiện đó (khách có thể báo lỗi ở phiên sau), chia cho đơn cùng nhánh. */
function tinhTheoNhanh(dongs) {
  const nhom = nhomCuaPhien(dongs);
  const { hang, trung } = phienChonGoi(dongs);
  const loi = {};
  for (const d of dongs) if (d.ten === 'bao_loi' && d.nhanh && !(d.thietBi && trung.has(d.thietBi))) { const k = `${d.thu || '?'}/${d.nhanh}`; (loi[k] = loi[k] || new Set()).add(d.phien); }
  const nh = {};
  const lay = (k) => (nh[k] = nh[k] || { chon: 0, don: 0, doanhThu: 0, goi: {}, nguon: {} });
  for (const h of hang) {
    const g = lay(h.nhanh);
    g.chon++; g.goi[h.goi] = (g.goi[h.goi] || 0) + 1;
    if (h.tra) { g.don++; g.doanhThu += h.doanhThu; }
    const nn = g.nguon[nhom.get(h.phien) || CHUA_RO] = g.nguon[nhom.get(h.phien) || CHUA_RO] || { chon: 0, don: 0, doanhThu: 0 };
    nn.chon++; if (h.tra) { nn.don++; nn.doanhThu += h.doanhThu; }
  }
  const ra = {};
  for (const k of Object.keys(nh).sort()) {
    const g = nh[k], baoLoi = loi[k] ? loi[k].size : 0;
    ra[k] = {
      chon: g.chon, don: g.don, doanhThu: g.doanhThu, doanhThuMoiPhien: chia(g.doanhThu, g.chon),
      tiLeTra: chia(g.don, g.chon), donTrungBinh: chia(g.doanhThu, g.don),
      tiTrongGoi: Object.fromEntries(MA_GOI.map((ma) => [ma, chia(g.goi[ma] || 0, g.chon)])),
      baoLoi, baoLoiTrenDon: chia(baoLoi, g.don), nguon: g.nguon,
    };
  }
  return ra;
}

// ---- Bootstrap (thu-gia_v2.md mục 5 ý 3) ----
/**
 * Đơn vị mẫu = phiên chon_goi. Mỗi thử nghiệm: nhánh gốc 'goc' so nhánh 'thu'. Mỗi lần lặp lấy mẫu có hoàn lại TRONG TỪNG nhánh, đúng cỡ nhánh đó;
 * thống kê = (nhánh thu) − (nhánh gốc). Khoảng 95% = phân vị 2,5 và 97,5 (chỉ số floor(0,025·N) và ceil(0,975·N)−1 của N chênh lệch đã sắp).
 * Ba chỉ số cùng một mẫu lặp: doanh thu/phiên, tỉ lệ trả tiền, tỉ lệ gói năm. Thắng: cận dưới > 0; thua: cận trên < 0; còn lại hòa.
 */
function bootstrap(hang, { lan = 10000, hat = 7 } = {}) {
  const theoThu = {};
  for (const h of hang) { const [thu, nh] = h.nhanh.split('/'); ((theoThu[thu] = theoThu[thu] || { goc: [], thu: [] })[nh]).push(h); }
  const ra = {};
  for (const thu of Object.keys(theoThu).sort()) {
    const { goc, thu: moi } = theoThu[thu];
    if (!goc.length || !moi.length) { ra[thu] = { thieu: true, cỡ: { goc: goc.length, thu: moi.length } }; continue; }
    const r = ngauNhien(hat);
    const tb = (ds, k) => ds.reduce((a, h) => a + h[k], 0) / ds.length;
    const goc0 = { doanhThu: tb(goc, 'doanhThu'), tra: tb(goc, 'tra'), nam: tb(goc, 'nam') }, moi0 = { doanhThu: tb(moi, 'doanhThu'), tra: tb(moi, 'tra'), nam: tb(moi, 'nam') };
    const diff = { doanhThu: new Float64Array(lan), tra: new Float64Array(lan), nam: new Float64Array(lan) };
    const mau = (ds) => { const t = { doanhThu: 0, tra: 0, nam: 0 }, n = ds.length; for (let i = 0; i < n; i++) { const h = ds[Math.floor(r() * n)]; t.doanhThu += h.doanhThu; t.tra += h.tra; t.nam += h.nam; } return { doanhThu: t.doanhThu / n, tra: t.tra / n, nam: t.nam / n }; };
    for (let i = 0; i < lan; i++) { const a = mau(goc), b = mau(moi); for (const k of Object.keys(diff)) diff[k][i] = b[k] - a[k]; }
    const kq = {};
    for (const k of Object.keys(diff)) {
      const d = Float64Array.from(diff[k]).sort();
      const thap = d[Math.floor(0.025 * lan)], cao = d[Math.ceil(0.975 * lan) - 1], chenh = moi0[k] - goc0[k];
      kq[k] = { goc: goc0[k], thu: moi0[k], chenh, thap, cao, ketLuan: thap > 0 ? 'thắng' : cao < 0 ? 'thua' : 'hòa' };
    }
    ra[thu] = { lan, hat, co: { goc: goc.length, thu: moi.length }, ...kq };
  }
  return ra;
}

function bangBootstrap(bt, md) {
  const nhan = { doanhThu: 'Doanh thu / phiên (đ)', tra: 'Tỉ lệ trả tiền', nam: 'Tỉ lệ gói năm' };
  const so = (k, x) => (k === 'doanhThu' ? Math.round(x).toLocaleString('vi-VN') : (x * 100).toFixed(2) + '%');
  const ra = [];
  for (const [thu, r] of Object.entries(bt)) {
    if (r.thieu) { ra.push(`Thử ${thu}: thiếu một nhánh (gốc ${r.cỡ.goc}, thử ${r.cỡ.thu} phiên chon_goi), không bootstrap.`); continue; }
    ra.push(`Thử ${thu} · bootstrap ${r.lan} lần · hạt ${r.hat} · phiên chon_goi: gốc ${r.co.goc}, thử ${r.co.thu} · khoảng 95% của (nhánh thử − gốc)`);
    const dau = ['Chỉ số', 'Gốc', 'Thử', 'Chênh', 'Cận dưới', 'Cận trên', 'Kết luận'];
    const hang = ['doanhThu', 'tra', 'nam'].map((k) => [nhan[k], so(k, r[k].goc), so(k, r[k].thu), so(k, r[k].chenh), so(k, r[k].thap), so(k, r[k].cao), r[k].ketLuan]);
    ra.push(md ? ['| ' + dau.join(' | ') + ' |', '|' + dau.map(() => '---').join('|') + '|', ...hang.map((h) => '| ' + h.join(' | ') + ' |')].join('\n') : [dau, ...hang].map((h) => h.map((c) => c.padEnd(22)).join(' ')).join('\n'));
  }
  return ra.join('\n\n');
}

function csvNhanh(hang) {
  return ['phien,thietBi,nhanh,doanhThu', ...hang.map((h) => [h.phien, h.thietBi, h.nhanh, h.doanhThu].join(','))].join('\n');
}

const dong = (n) => (n === null ? '—' : Math.round(n).toLocaleString('vi-VN') + 'đ');

function bangNhanh(t, md) {
  const khoa = Object.keys(t);
  if (!khoa.length) return 'Chưa có sự kiện mang trường nhanh (thử nghiệm giá chưa bật).';
  const goiCoDung = MA_GOI.filter((ma) => khoa.some((k) => t[k].tiTrongGoi[ma]));
  const dau = ['Nhánh', 'Phiên chon_goi', 'Đơn', 'Tỉ lệ trả', 'Doanh thu', 'Doanh thu / phiên', 'Đơn TB', ...goiCoDung.map((m) => 'Tỉ trọng ' + m), 'bao_loi', 'bao_loi / đơn'];
  const hang = khoa.map((k) => { const r = t[k]; return [k, r.chon, r.don, pct(r.tiLeTra), dong(r.doanhThu), dong(r.doanhThuMoiPhien), dong(r.donTrungBinh), ...goiCoDung.map((m) => pct(r.tiTrongGoi[m])), r.baoLoi, pct(r.baoLoiTrenDon)].map(String); });
  const nhomDu = [...new Set(khoa.flatMap((k) => Object.keys(t[k].nguon)))].sort();
  const dau2 = ['Nhánh', 'Nhóm nguồn', 'Phiên chon_goi', 'Đơn', 'Doanh thu / phiên'];
  const hang2 = [];
  for (const k of khoa) for (const n of nhomDu) { const r = t[k].nguon[n]; if (r) hang2.push([k, n, String(r.chon), String(r.don), dong(chia(r.doanhThu, r.chon))]); }
  const bang = (d, h) => (md ? ['| ' + d.join(' | ') + ' |', '|' + d.map(() => '---').join('|') + '|', ...h.map((x) => '| ' + x.join(' | ') + ' |')] : [d, ...h].map((x) => x.map((c) => c.padEnd(16)).join(' '))).join('\n');
  return bang(dau, hang) + '\n\nTheo nhóm nguồn\n' + (md ? '\n' : '') + bang(dau2, hang2);
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
const GIA_NHANH = { goc: { 'mot-chu-de': 29000, 'tron-la-so': 99000, 'thanh-vien-nam': 299000 }, thu: { 'mot-chu-de': 29000, 'tron-la-so': 129000, 'thanh-vien-nam': 299000 } };
/** Một phiên đã chọn gói trong thử nghiệm 'a': chia nhánh 50/50, nhánh 'thu' trả tiền ít hơn 20% ở gói Trọn lá số. */
function phienNhanhGiaLap(them, r, c) {
  const nhanh = r() < 0.5 ? 'goc' : 'thu', x = r(), goi = x < 0.15 ? 'mot-chu-de' : x < 0.25 ? 'thanh-vien-nam' : 'tron-la-so';
  const mang = { goi, nhanh, thu: 'a' };
  them('chon_goi', { ...mang, gia: GIA_NHANH[nhanh][goi] });
  if (r() >= 0.8) return;
  them('vao_thanh_toan', { ...mang, gia: GIA_NHANH[nhanh][goi] });
  if (r() < (c / 0.8) * (nhanh === 'thu' && goi === 'tron-la-so' ? 0.8 : 1)) {
    them('dang_nhap'); them('thanh_toan_xong', { ...mang, gia: GIA_NHANH[nhanh][goi] });
    if (r() < 0.04) them('bao_loi', mang);
  }
}
function taoGiaLap(hat = 7, coNhanh = false) {
  const r = ngauNhien(hat), ra = [];
  let n = 0;
  for (const [nhom, [soPhien, a, b, c, src, med, ref]] of Object.entries(MAU_GIA_LAP)) {
    for (let i = 0; i < soPhien; i++) {
      const phien = 'gl' + String(++n).padStart(14, '0');
      const them = (ten, x) => ra.push({ t: 1, ten, phien, trang: trangCua(ten), thietBi: 'tb' + phien.slice(2), ...x });
      them('vao_trang', { ...(src ? { utm_source: src, utm_medium: med } : {}), ...(ref ? { ref } : {}), dich: '/', may: r() < 0.7 ? 'dien-thoai' : 'may-tinh', nhom });
      if (r() >= a) continue;
      them('vao_form'); them('lap_la_so'); them('xem_tom_tat');
      if (r() < 0.8) them('bam_xem_sau');
      them('vao_chon_goi');
      if (r() >= b) continue;
      if (coNhanh) { phienNhanhGiaLap(them, r, c); continue; }
      them('chon_goi', { goi: 'tron-la-so', gia: 99000 });
      if (r() >= 0.8) continue;
      them('vao_thanh_toan', { goi: 'tron-la-so' });
      if (r() < c / 0.8) { them('dang_nhap'); them('thanh_toan_xong', { goi: 'tron-la-so', gia: 99000 }); }
    }
  }
  return ra;
}

// ---- Khảo sát 'đáng tiền' (khao-sat-dang-tien_v1.md mục 3) ----
const MAU_KHAO_SAT = 30; // phản hồi tối thiểu/gói (/tuần nếu --tuan); ít hơn: 'chưa đủ mẫu', không kết luận
const MUC_TIEU_A = 4.5;
const tuanCua = (t) => { const d = new Date(t + 7 * 3600_000); const th = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())); const so = th.getUTCDay() || 7; th.setUTCDate(th.getUTCDate() + 4 - so); const dau = Date.UTC(th.getUTCFullYear(), 0, 1); return th.getUTCFullYear() + '-T' + String(Math.ceil(((th - dau) / 86400000 + 1) / 7)).padStart(2, '0'); };
const tb = (ds) => (ds.length ? ds.reduce((a, b) => a + b, 0) / ds.length : null);

/** Gộp theo gói (và theo tuần nếu `theoTuan`). Mỗi dòng sự kiện là một lượt hiện/trả lời/bỏ qua (thẻ chỉ hiện 1 lần/bài nên không cần khử trùng). */
function tinhKhaoSat(dongs, { theoTuan = false } = {}) {
  const nhom = {};
  for (const d of dongs) {
    if (!['hien_khao_sat', 'tra_loi_khao_sat', 'bo_qua_khao_sat'].includes(d.ten) || !d.goi) continue;
    const k = theoTuan ? `${d.goi} · ${tuanCua(d.t || 0)}` : d.goi;
    const g = (nhom[k] = nhom[k] || { hien: 0, traLoi: 0, boQua: 0, a: [], c: [], coLoi: 0 });
    if (d.ten === 'hien_khao_sat') g.hien++;
    else if (d.ten === 'bo_qua_khao_sat') g.boQua++;
    else {
      g.traLoi++;
      if (Number.isInteger(d.diem_a)) g.a.push(d.diem_a);
      if (Number.isInteger(d.diem_c)) g.c.push(d.diem_c);
      if (d.co_loi_b === true) g.coLoi++;
    }
  }
  const ra = {};
  for (const k of Object.keys(nhom).sort()) {
    const g = nhom[k], duMau = g.traLoi >= MAU_KHAO_SAT;
    ra[k] = { hien: g.hien, traLoi: g.traLoi, boQua: g.boQua, coLoi: g.coLoi, duMau, diemA: tb(g.a), diemC: tb(g.c), tiLeTraLoi: chia(g.traLoi, g.hien), tiLeBoQua: chia(g.boQua, g.hien), datMucTieu: duMau && tb(g.a) !== null ? tb(g.a) >= MUC_TIEU_A : null };
  }
  return ra;
}

function bangKhaoSat(t, md) {
  const khoa = Object.keys(t);
  if (!khoa.length) return 'Chưa có sự kiện khảo sát (hien_khao_sat / tra_loi_khao_sat / bo_qua_khao_sat).';
  const so = (r, v) => (r.duMau ? v : 'chưa đủ mẫu');
  const dau = ['Gói', 'Hiện', 'Trả lời', 'Bỏ qua', 'Tỉ lệ trả lời', 'Tỉ lệ bỏ qua', 'Điểm (a) đáng tiền', 'Điểm (c) giới thiệu', 'Có lời (b)'];
  const hang = khoa.map((k) => { const r = t[k]; return [k, String(r.hien), String(r.traLoi), String(r.boQua), pct(r.tiLeTraLoi), pct(r.tiLeBoQua), so(r, r.diemA === null ? '—' : r.diemA.toFixed(2) + (r.datMucTieu ? ' (đạt ≥ 4,5)' : ' (chưa đạt 4,5)')), so(r, r.diemC === null ? '—' : r.diemC.toFixed(2)), String(r.coLoi)]; });
  const ghi = `Mẫu tối thiểu: ${MAU_KHAO_SAT} phản hồi/${'gói'}${t[khoa[0]] && khoa[0].includes('·') ? '/tuần' : ''}; ít hơn ghi 'chưa đủ mẫu'.`;
  return (md ? ['| ' + dau.join(' | ') + ' |', '|' + dau.map(() => '---').join('|') + '|', ...hang.map((h) => '| ' + h.join(' | ') + ' |')] : [dau, ...hang].map((h) => h.join('  |  '))).join('\n') + '\n' + ghi;
}

/** Số giả lập khảo sát: gói Trọn lá số đủ mẫu (điểm a trung bình ~4,6), gói Một chủ đề thiếu mẫu (dưới 30 phản hồi). */
function taoGiaLapKhaoSat(hat = 7) {
  const r = ngauNhien(hat), ra = [];
  let n = 0;
  const lo = [['tron-la-so', 160, 0.55, 0.25, 4.6], ['mot-chu-de', 40, 0.35, 0.40, 4.2]];
  for (const [goi, hien, pTra, pBo, a0] of lo) {
    for (let i = 0; i < hien; i++) {
      const phien = 'ks' + String(++n).padStart(14, '0'), bai = 'ban-than', t = 1730000000000 + i * 3600_000 * 5;
      ra.push({ t, ten: 'hien_khao_sat', phien, trang: 'luan-giai', bai, goi, cach: r() < 0.7 ? 'cuoi_bai' : 'doc_xong' });
      const x = r();
      if (x < pTra) {
        const a = Math.max(1, Math.min(5, Math.round(a0 + (r() - 0.5) * 1.6)));
        ra.push({ t, ten: 'tra_loi_khao_sat', phien, trang: 'luan-giai', bai, goi, diem_a: a, ...(r() < 0.8 ? { diem_c: Math.max(1, Math.min(5, a - (r() < 0.3 ? 1 : 0))) } : {}), co_loi_b: r() < 0.25 });
      } else if (x < pTra + pBo) ra.push({ t, ten: 'bo_qua_khao_sat', phien, trang: 'luan-giai', bai, goi });
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
  // Dữ liệu thật: bỏ sự kiện thử (loai-tru-thu.json) trừ khi --gom-thu. Số giả lập không lọc.
  const docThat = () => {
    const tat = docThuMuc(thuMucMacDinh());
    if (co('--gom-thu')) { console.log('(--gom-thu: gồm cả sự kiện thử)'); return tat; }
    const r = loaiTruThu(tat, docLoaiTru());
    if (r.bo) console.log('(đã bỏ ' + r.bo + ' sự kiện thử theo tools/loai-tru-thu.json; thêm --gom-thu để xem lại)');
    return r.giu;
  };
  if (co('--khao-sat')) {
    const ds = giaLap ? taoGiaLapKhaoSat(Number(tham('--hat')) || 7) : docThat();
    console.log((giaLap ? 'SỐ GIẢ LẬP (không phải số thật)\n' : '') + bangKhaoSat(tinhKhaoSat(ds, { theoTuan: co('--tuan') }), co('--md')));
    process.exit(0);
  }
  const dongs = giaLap ? taoGiaLap(Number(tham('--hat')) || 7, co('--nhanh')) : docThat();
  const ghi = tham('--ghi');
  if (giaLap && ghi) {
    fs.mkdirSync(ghi, { recursive: true });
    fs.writeFileSync(path.join(ghi, 'gia-lap.jsonl'), dongs.map((d) => JSON.stringify(d)).join('\n') + '\n');
    console.log('Đã ghi ' + dongs.length + ' dòng giả lập vào ' + ghi);
  } else if (co('--nhanh') && co('--csv')) {
    console.log(csvNhanh(phienChonGoi(dongs).hang));
  } else if (co('--nhanh')) {
    console.log(bangNhanh(tinhTheoNhanh(dongs), co('--md')));
    const lan = Number(tham('--bootstrap'));
    if (lan > 0) console.log('\nKhoảng tin cậy 95% (bootstrap)\n' + (co('--md') ? '\n' : '') + bangBootstrap(bootstrap(phienChonGoi(dongs).hang, { lan, hat: Number(tham('--hat')) || 7 }), co('--md')));
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

module.exports = { loaiTruThu, docLoaiTru, tinhKhaoSat, bangKhaoSat, taoGiaLapKhaoSat, MAU_KHAO_SAT, phienChonGoi, bootstrap, bangBootstrap, csvNhanh, tinhTheoNhanh, bangNhanh, tinhPheu, docThuMuc, tinhTheoNguon, bangNguon, taoGiaLap };
