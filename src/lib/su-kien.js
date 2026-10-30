// Danh sách sự kiện đo phễu (docs/san-pham/luong-mua.md). Không chứa dữ liệu cá nhân.
const TRANG = {
  vao_form: 'form', lap_la_so: 'form',
  xem_tom_tat: 'tom-tat', bam_xem_sau: 'tom-tat',
  vao_chon_goi: 'chon-goi', chon_goi: 'chon-goi',
  vao_thanh_toan: 'thanh-toan', dang_nhap: 'thanh-toan', thanh_toan_xong: 'thanh-toan',
};
const TEN_SU_KIEN = Object.keys(TRANG);

/** Màn hình (trong tối đa 4 màn) mà sự kiện thuộc về; máy chủ tự suy ra, không tin máy khách. */
function trangCua(ten) { return TRANG[ten]; }

/** Nhận đúng {ten, phien}; trả về bản sạch hoặc null nếu có bất kỳ điều gì sai. */
function kiemTraSuKien(b) {
  if (!b || typeof b !== 'object' || Array.isArray(b)) return null;
  const khoa = Object.keys(b);
  if (khoa.length !== 2 || !khoa.includes('ten') || !khoa.includes('phien')) return null;
  if (typeof b.ten !== 'string' || !TEN_SU_KIEN.includes(b.ten)) return null;
  if (typeof b.phien !== 'string' || !/^[A-Za-z0-9_-]{16,32}$/.test(b.phien)) return null;
  return { ten: b.ten, phien: b.phien };
}

module.exports = { TEN_SU_KIEN, trangCua, kiemTraSuKien };
