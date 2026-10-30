// Danh sách sự kiện đo phễu (docs/san-pham/luong-mua.md). Không chứa dữ liệu cá nhân.
const TRANG = {
  vao_trang: 'vao', // trang đầu của phiên, kèm nguồn khách (docs/bao-cao-pheu-mau.md)
  vao_form: 'form', lap_la_so: 'form', de_lai_lien_he: 'form', // sau lập lá số: khách tích đồng ý và để lại email/Zalo
  xem_tom_tat: 'tom-tat', bam_xem_sau: 'tom-tat',
  vao_chon_goi: 'chon-goi', chon_goi: 'chon-goi',
  vao_thanh_toan: 'thanh-toan', dang_nhap: 'thanh-toan', dang_ky_thanh_vien: 'thanh-toan', thanh_toan_xong: 'thanh-toan', // dang_ky_thanh_vien = tài khoản tạo lần đầu, tách khỏi dang_nhap
  dang_ky_nhan_tin: 'lp', // đăng ký nhận tin ở /van-nam-2027; KHÔNG ghi email vào sự kiện
  xem_lp_van_nam: 'lp', bam_lap_la_so_lp: 'lp', // trang đích /lp/van-nam-2027
  vao_moi: 'form', dung_ma_moi: 'luan-giai', bam_gop_y: 'luan-giai', // bản thử khách mời (ban-thu-khach-moi.md)
  hien_khao_sat: 'luan-giai', tra_loi_khao_sat: 'luan-giai', bo_qua_khao_sat: 'luan-giai', // khảo sát 'đáng tiền' sau bài trả phí (khao-sat-dang-tien_v1.md); không tính vào 4 màn
  bao_loi: 'luan-giai', // khách báo không xem được đủ phần đã mua (đếm khiếu nại); sau khi mua nên không tính vào 4 màn
};
const { MA_GOI, MA_CHU_DE } = require('./goi-ma.js');
const TEN_SU_KIEN = Object.keys(TRANG);
const KHAO_SAT = ['hien_khao_sat', 'tra_loi_khao_sat', 'bo_qua_khao_sat'];
const MA_BAI = [...MA_CHU_DE, 'van-nam-2027']; // mã bài = chuyên đề đã mua (không phải mã lá số, không dữ liệu sinh)
const CACH_KICH_HOAT = ['cuoi_bai', 'doc_xong'];
const DIEM = [1, 2, 3, 4, 5];
// Chỉ máy chủ được ghi (kèm nguon tra từ mã mời); máy khách gửi lên /api/su-kien thì bị từ chối.
const CHI_MAY_CHU = ['vao_moi', 'dung_ma_moi', 'dang_ky_nhan_tin'];

/** Màn hình (trong tối đa 4 màn) mà sự kiện thuộc về; máy chủ tự suy ra, không tin máy khách. */
function trangCua(ten) { return TRANG[ten]; }

const NHANH = ['goc', 'thu']; // nhánh thử nghiệm giá (thu-gia_v1.md); máy chủ mới là bên quyết định nhánh và giá
const MAU_THIET_BI = /^[A-Za-z0-9_-]{16,32}$/; // mã thiết bị ẩn danh (chuỗi ngẫu nhiên, cookie bên thứ nhất); máy chủ gắn từ cookie
const CO_GOI = ['chon_goi', 'vao_thanh_toan', 'thanh_toan_xong', 'bao_loi', 'dang_ky_thanh_vien'];

// Nguồn khách (dac-ta-do-luong_v1.md mục 2). Chỉ chữ thường không dấu, không có thông tin cá nhân.
const NHOM_NGUON = ['tuvi-vn', 'organic', 'social', 'paid', 'email', 'partner', 'direct', 'referral'];
const TRUONG_UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const MAU_UTM = /^[a-z0-9][a-z0-9._-]{0,49}$/;
const MAU_HOST = /^[a-z0-9][a-z0-9.-]{0,98}[a-z0-9]$/;
const MAU_DICH = /^\/(?:[A-Za-z0-9_-]{1,40}(?:\/[A-Za-z0-9_-]{1,40})?)?$/;
const MAY = ['dien-thoai', 'may-tinh'];
const TIM_KIEM = /^(www\.|m\.)?(google|bing|coccoc|duckduckgo|yahoo|baidu|yandex|ecosia)\.[a-z.]+$/;
const MXH = /(^|\.)(facebook\.com|fb\.com|fb\.me|instagram\.com|threads\.net|tiktok\.com|zalo\.me|youtube\.com|t\.co)$/;

/** Gộp nguồn vào 8 nhóm. UTM thắng; không UTM thì suy từ trang giới thiệu (`ref` là tên máy chủ, không đường dẫn). */
function nhomNguon(n) {
  const nguon = n.utm_source, kenh = n.utm_medium, ref = n.ref || '';
  if (nguon === 'tuvi-vn') return 'tuvi-vn';
  if (kenh === 'cpc' || kenh === 'paid') return 'paid';
  if (kenh === 'social') return 'social';
  if (kenh === 'email') return 'email';
  if (kenh === 'partner') return 'partner';
  if (kenh === 'organic') return 'organic';
  if (nguon || kenh) return 'referral'; // có UTM nhưng ngoài danh mục: không đoán, gom vào referral
  if (!ref || ref === 'xemtuvi.vn' || ref === 'www.xemtuvi.vn') return 'direct';
  if (ref === 'tuvi.vn' || ref === 'www.tuvi.vn') return 'tuvi-vn';
  if (TIM_KIEM.test(ref)) return 'organic';
  if (MXH.test(ref)) return 'social';
  return 'referral';
}

/** Kiểm trường nguồn của vao_trang; trả bản sạch hoặc null nếu có trường sai. */
function kiemNguon(b) {
  const ra = {};
  for (const k of TRUONG_UTM) {
    if (b[k] === undefined) continue;
    if (typeof b[k] !== 'string' || !MAU_UTM.test(b[k])) return null;
    ra[k] = b[k];
  }
  if (b.ref !== undefined) { if (typeof b.ref !== 'string' || !MAU_HOST.test(b.ref)) return null; ra.ref = b.ref; }
  if (typeof b.dich !== 'string' || !MAU_DICH.test(b.dich)) return null;
  ra.dich = /^\/moi(\/|$)/.test(b.dich) ? '/moi' : b.dich.toLowerCase(); // mã mời là thông tin riêng: chỉ giữ '/moi'
  if (!MAY.includes(b.may)) return null;
  ra.may = b.may;
  return ra;
}

/** Sự kiện khảo sát: chỉ nhận danh sách trường cho phép (mã bài, gói, cách kích hoạt, điểm, có lời hay không). */
function kiemKhaoSat(b) {
  const choPhep = { hien_khao_sat: ['bai', 'goi', 'cach'], tra_loi_khao_sat: ['bai', 'goi', 'diem_a', 'diem_c', 'co_loi_b'], bo_qua_khao_sat: ['bai', 'goi'] }[b.ten];
  const khoa = Object.keys(b);
  if (!khoa.includes('phien') || khoa.some((k) => !['ten', 'phien', 'thietBi', ...choPhep].includes(k))) return null;
  if (typeof b.phien !== 'string' || !/^[A-Za-z0-9_-]{16,32}$/.test(b.phien)) return null;
  if (typeof b.bai !== 'string' || !MA_BAI.includes(b.bai)) return null;
  if (typeof b.goi !== 'string' || !MA_GOI.includes(b.goi)) return null;
  const ra = { ten: b.ten, phien: b.phien, bai: b.bai, goi: b.goi };
  if (khoa.includes('thietBi')) {
    if (typeof b.thietBi !== 'string' || !MAU_THIET_BI.test(b.thietBi)) return null;
    ra.thietBi = b.thietBi;
  }
  if (b.ten === 'hien_khao_sat') {
    if (!CACH_KICH_HOAT.includes(b.cach)) return null;
    ra.cach = b.cach;
  }
  if (b.ten === 'tra_loi_khao_sat') {
    if (!DIEM.includes(b.diem_a)) return null;
    ra.diem_a = b.diem_a;
    if (b.diem_c !== undefined && b.diem_c !== null) { if (!DIEM.includes(b.diem_c)) return null; ra.diem_c = b.diem_c; }
    if (typeof b.co_loi_b !== 'boolean') return null;
    ra.co_loi_b = b.co_loi_b;
  }
  return ra;
}

/** Nhận {ten, phien} và (chỉ với CO_GOI) thêm goi, chuDe, nhanh; thietBi (tùy chọn, kiểm định dạng); trả về bản sạch hoặc null nếu có bất kỳ điều gì sai. */
function kiemTraSuKien(b) {
  if (!b || typeof b !== 'object' || Array.isArray(b)) return null;
  if (typeof b.ten !== 'string' || !TEN_SU_KIEN.includes(b.ten) || CHI_MAY_CHU.includes(b.ten)) return null;
  if (KHAO_SAT.includes(b.ten)) return kiemKhaoSat(b);
  const laVaoTrang = b.ten === 'vao_trang';
  const choPhep = laVaoTrang ? ['ten', 'phien', 'thietBi', ...TRUONG_UTM, 'ref', 'dich', 'may']
    : CO_GOI.includes(b.ten) ? ['ten', 'phien', 'thietBi', 'goi', 'chuDe', 'nhanh'] : ['ten', 'phien', 'thietBi'];
  const khoa = Object.keys(b);
  if (!khoa.includes('phien') || khoa.some((k) => !choPhep.includes(k))) return null;
  if (typeof b.phien !== 'string' || !/^[A-Za-z0-9_-]{16,32}$/.test(b.phien)) return null;
  const ra = { ten: b.ten, phien: b.phien };
  if (khoa.includes('thietBi')) {
    if (typeof b.thietBi !== 'string' || !MAU_THIET_BI.test(b.thietBi)) return null;
    ra.thietBi = b.thietBi;
  }
  if (laVaoTrang) {
    const n = kiemNguon(b);
    return n ? { ...ra, ...n } : null;
  }
  if (khoa.includes('goi')) {
    if (typeof b.goi !== 'string' || !MA_GOI.includes(b.goi)) return null;
    ra.goi = b.goi;
  }
  if (khoa.includes('nhanh')) {
    if (typeof b.nhanh !== 'string' || !NHANH.includes(b.nhanh)) return null;
    ra.nhanh = b.nhanh;
  }
  if (khoa.includes('chuDe')) {
    if (ra.goi !== 'mot-chu-de' || typeof b.chuDe !== 'string' || !MA_CHU_DE.includes(b.chuDe)) return null;
    ra.chuDe = b.chuDe;
  }
  return ra;
}

module.exports = { KHAO_SAT, MA_BAI, NHANH, TEN_SU_KIEN, CHI_MAY_CHU, NHOM_NGUON, trangCua, kiemTraSuKien, nhomNguon };
