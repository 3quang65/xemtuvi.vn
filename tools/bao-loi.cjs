// Công cụ CSKH đọc báo lỗi của khách (docs/ky-thuat/cskh-cong-cu.md). Không in ngày giờ sinh (bảng không có).
//   node tools/bao-loi.cjs [--tu YYYY-MM-DD] [--chua-xu-ly]   (không lệnh con = tất cả; tương đương moi = --chua-xu-ly, tat-ca)
//   node tools/bao-loi.cjs moi|tat-ca [--tu YYYY-MM-DD]
//   node tools/bao-loi.cjs danh-dau <id> da-xu-ly
//   node tools/bao-loi.cjs lien-he <id> --nguoi <tên người tra>
const fs = require('fs');
const os = require('os');
const path = require('path');

const gioVN = (t) => new Date(t + 7 * 3600_000).toISOString().slice(0, 16).replace('T', ' ');
const mot = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

/** Liên hệ để trả lời: ô khách tự điền, hoặc liên hệ ĐÃ ĐỒNG Ý (chưa hủy) của tài khoản gửi báo lỗi. */
function timLienHe(db, b) {
  if (b.lien_he_tra_loi) return { nguon: 'khach điền ở ô báo lỗi', loai: b.lien_he_tra_loi.includes('@') ? 'email' : 'zalo', giaTri: b.lien_he_tra_loi };
  if (!b.nguoi_dung_id) return null;
  const r = db.prepare('SELECT loai, gia_tri FROM lien_he WHERE nguoi_dung_id=? AND huy_luc IS NULL ORDER BY dong_y_luc DESC, id DESC LIMIT 1').get(b.nguoi_dung_id);
  return r ? { nguon: 'liên hệ đã đồng ý của tài khoản', loai: r.loai, giaTri: r.gia_tri } : null;
}

function dsBaoLoi(db, { tatCa = false, tu } = {}) {
  const dk = [], th = [];
  if (!tatCa) dk.push("trang_thai <> 'da_xu_ly'");
  if (tu) { dk.push('tao_luc >= ?'); th.push(Date.parse(tu + 'T00:00:00+07:00')); }
  const dong = db.prepare(`SELECT * FROM bao_loi ${dk.length ? 'WHERE ' + dk.join(' AND ') : ''} ORDER BY id`).all(...th);
  return dong.map((b) => ({
    ma: b.id, gio: gioVN(b.tao_luc), moTa: mot(b.mo_ta), maDon: b.ma_don, goi: b.goi, thietBi: b.thiet_bi,
    tinhHuong: b.tinh_huong, trangThai: b.trang_thai, coLienHe: !!timLienHe(db, b),
  }));
}

function inDs(ds) {
  if (!ds.length) return console.log('Không có báo lỗi.');
  for (const d of ds) {
    console.log(`#${d.ma} | ${d.gio} (giờ VN) | ${d.trangThai === 'da_xu_ly' ? 'đã xử lý' : 'mới'} | liên hệ: ${d.coLienHe ? 'có' : 'không'}`);
    console.log(`   ${d.moTa}`);
    console.log(`   mã đơn: ${d.maDon || '-'} | gói: ${d.goi || '-'} | thiết bị: ${d.thietBi || '-'} | tình huống: ${d.tinhHuong || '-'}`);
  }
  console.log(`Tổng: ${ds.length}`);
}

function danhDau(db, id, trangThai) {
  if (trangThai !== 'da-xu-ly') throw new Error('trạng thái chỉ có: da-xu-ly');
  const r = db.prepare("UPDATE bao_loi SET trang_thai='da_xu_ly' WHERE id=?").run(id);
  if (!r.changes) throw new Error(`Không có báo lỗi #${id}`);
}

/** Ghi nhật ký TRƯỚC khi trả liên hệ: không ghi được thì không cho tra. Nhật ký không chứa liên hệ. */
function traLienHe(db, id, nguoi, { thuMuc, bayGio = Date.now() } = {}) {
  if (!nguoi || nguoi === true) throw new Error('Thiếu --nguoi <tên người tra>');
  const b = db.prepare('SELECT * FROM bao_loi WHERE id=?').get(id);
  if (!b) throw new Error(`Không có báo lỗi #${id}`);
  const lh = timLienHe(db, b);
  fs.mkdirSync(thuMuc, { recursive: true });
  fs.appendFileSync(path.join(thuMuc, 'tra-lien-he.jsonl'), JSON.stringify({ t: new Date(bayGio).toISOString(), gio_vn: gioVN(bayGio), bao_loi: id, nguoi, co_lien_he: !!lh }) + '\n');
  return lh;
}

function thamSo(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) argv[i].startsWith('--') ? (o[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true) : o._.push(argv[i]);
  return o;
}
const soId = (s) => { if (!/^#?\d+$/.test(String(s ?? ''))) throw new Error('id báo lỗi phải là số'); return Number(String(s).replace('#', '')); };

function moDb() {
  const nap = require('../tests/_nap-ts.cjs');
  const { moCsdl } = nap('lib/may-chu/csdl.ts');
  const { thuMucDuLieu } = nap('lib/may-chu/ma-hoa.ts');
  return { db: moCsdl(process.env.XTV_CSDL || path.join(thuMucDuLieu(), 'csdl', 'xemtuvi.db')), thuMuc: process.env.NHAT_KY_DIR || path.join(thuMucDuLieu(), 'nhat-ky') };
}

function chay(argv) {
  const o = thamSo(argv);
  const [lenh0, a, b] = o._;
  const lenh = lenh0 ?? (o['chua-xu-ly'] ? 'moi' : 'tat-ca');
  if (lenh === 'moi' || lenh === 'tat-ca') {
    if (o.tu && !/^\d{4}-\d{2}-\d{2}$/.test(o.tu)) throw new Error('tu dạng YYYY-MM-DD');
    inDs(dsBaoLoi(moDb().db, { tatCa: lenh === 'tat-ca' && !o['chua-xu-ly'], tu: o.tu }));
  } else if (lenh === 'danh-dau') {
    const id = soId(a); danhDau(moDb().db, id, b); console.log(`Đã đánh dấu #${id}: đã xử lý.`);
  } else if (lenh === 'lien-he') {
    const { db, thuMuc } = moDb();
    const lh = traLienHe(db, soId(a), o.nguoi, { thuMuc });
    if (!lh) console.log('Không có liên hệ đã đồng ý cho báo lỗi này. KHÔNG tìm cách khác để liên lạc; ghi nhận "không liên hệ được".');
    else console.log(`${lh.loai === 'email' ? 'Email' : 'Zalo'}: ${lh.giaTri}\n(${lh.nguon}; chỉ dùng để trả lời báo lỗi này. Đã ghi nhật ký tra.)`);
  } else {
    console.log('Dùng: [moi|tat-ca] [--tu YYYY-MM-DD] [--chua-xu-ly] | danh-dau <id> da-xu-ly | lien-he <id> --nguoi <tên>');
    process.exitCode = 1;
  }
}

if (require.main === module) { try { chay(process.argv.slice(2)); } catch (e) { console.error('Lỗi: ' + e.message); process.exit(1); } }
module.exports = { dsBaoLoi, danhDau, traLienHe, timLienHe };
