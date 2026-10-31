// L-9279a8 (B1): lõi đo tyLeChuMau — % từ của bài nằm trong chuỗi >= NGUONG từ liên tiếp trùng noiDung một quy tắc.
const NGUONG = 8;

// Chữ thường, bỏ dấu câu/ký hiệu, GIỮ dấu tiếng Việt (chỉ tách theo ký tự không phải chữ/số).
function tachTu(s) {
  return String(s || '').toLowerCase().normalize('NFC').split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

function taoChiMuc(dsNoiDung, n = NGUONG) {
  const tap = new Set();
  for (const nd of dsNoiDung) {
    const t = tachTu(nd);
    for (let i = 0; i + n <= t.length; i++) tap.add(t.slice(i, i + n).join(' '));
  }
  return tap;
}

function tyLeVoiChiMuc(vanBan, chiMuc, n = NGUONG) {
  const t = tachTu(vanBan);
  if (!t.length) return 0;
  const phu = new Uint8Array(t.length);
  for (let i = 0; i + n <= t.length; i++) {
    if (chiMuc.has(t.slice(i, i + n).join(' '))) phu.fill(1, i, i + n);
  }
  let dem = 0;
  for (const x of phu) dem += x;
  return Math.round((dem / t.length) * 1000) / 10;
}

const tyLeChuMau = (vanBan, dsNoiDung, n = NGUONG) => tyLeVoiChiMuc(vanBan, taoChiMuc(dsNoiDung, n), n);

// Gom mọi trường `text` của thân bài (dauBai, muc, thang…), bỏ ghiChu/ghiChuTruongPhai.
function baiThanhVanBan(bai) {
  const kq = [];
  const di = (v) => {
    if (Array.isArray(v)) v.forEach(di);
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { if (k === 'text' && typeof x === 'string') kq.push(x); else if (k !== 'thamChieu') di(x); }
  };
  for (const k of Object.keys(bai)) if (!k.startsWith('ghiChu')) di(bai[k]);
  return kq.join('\n');
}

module.exports = { NGUONG, tachTu, taoChiMuc, tyLeVoiChiMuc, tyLeChuMau, baiThanhVanBan };
