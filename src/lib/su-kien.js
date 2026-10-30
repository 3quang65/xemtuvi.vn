// Danh sách sự kiện đo phễu (docs/san-pham/luong-mua.md). Không chứa dữ liệu cá nhân.
const TRANG = {
  vao_form: 'form', lap_la_so: 'form',
  xem_tom_tat: 'tom-tat', bam_xem_sau: 'tom-tat',
  vao_chon_goi: 'chon-goi', chon_goi: 'chon-goi',
  vao_thanh_toan: 'thanh-toan', dang_nhap: 'thanh-toan', thanh_toan_xong: 'thanh-toan',
};
const { MA_GOI, MA_CHU_DE } = require('./goi-ma.js');
const TEN_SU_KIEN = Object.keys(TRANG);

/** Màn hình (trong tối đa 4 màn) mà sự kiện thuộc về; máy chủ tự suy ra, không tin máy khách. */
function trangCua(ten) { return TRANG[ten]; }

const CO_GOI = ['chon_goi', 'vao_thanh_toan', 'thanh_toan_xong'];

/** Nhận {ten, phien} và (chỉ với CO_GOI) thêm goi, chuDe; trả về bản sạch hoặc null nếu có bất kỳ điều gì sai. */
function kiemTraSuKien(b) {
  if (!b || typeof b !== 'object' || Array.isArray(b)) return null;
  if (typeof b.ten !== 'string' || !TEN_SU_KIEN.includes(b.ten)) return null;
  const choPhep = CO_GOI.includes(b.ten) ? ['ten', 'phien', 'goi', 'chuDe'] : ['ten', 'phien'];
  const khoa = Object.keys(b);
  if (!khoa.includes('phien') || khoa.some((k) => !choPhep.includes(k))) return null;
  if (typeof b.phien !== 'string' || !/^[A-Za-z0-9_-]{16,32}$/.test(b.phien)) return null;
  const ra = { ten: b.ten, phien: b.phien };
  if (khoa.includes('goi')) {
    if (typeof b.goi !== 'string' || !MA_GOI.includes(b.goi)) return null;
    ra.goi = b.goi;
  }
  if (khoa.includes('chuDe')) {
    if (ra.goi !== 'mot-chu-de' || typeof b.chuDe !== 'string' || !MA_CHU_DE.includes(b.chuDe)) return null;
    ra.chuDe = b.chuDe;
  }
  return ra;
}

module.exports = { TEN_SU_KIEN, trangCua, kiemTraSuKien };
