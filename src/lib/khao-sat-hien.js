// Khi nào hiện thẻ khảo sát (khao-sat-dang-tien_v1.md mục 2). Trạng thái ở localStorage: chỉ mã bài và giờ hỏi, không dữ liệu sinh.
const K_KHAO_SAT = 'xtv.khao-sat';
const BAY_NGAY_MS = 7 * 24 * 3600_000;
const GIU_MS = 2000; // cuối bài ở trong khung nhìn ≥ 2 giây mới hiện

/** `da` = { baiDaHoi: {<mã bài>: giờ}, lanCuoi: giờ } hoặc dữ liệu hỏng/thiếu. Một lần mỗi bài; khách đã thấy khảo sát: bài khác, sau tối thiểu 7 ngày. */
function nenHoi(da, bai, bayGio) {
  const d = da && typeof da === 'object' ? da : {};
  const daHoi = d.baiDaHoi && typeof d.baiDaHoi === 'object' ? d.baiDaHoi : {};
  if (daHoi[bai] !== undefined) return false;
  const cuoi = typeof d.lanCuoi === 'number' ? d.lanCuoi : 0;
  return !cuoi || bayGio - cuoi >= BAY_NGAY_MS;
}

/** Ghi nhận đã hiện thẻ cho `bai` (trả bản mới, không sửa bản cũ). */
function danhDauDaHoi(da, bai, bayGio) {
  const d = da && typeof da === 'object' ? da : {};
  return { baiDaHoi: { ...(d.baiDaHoi && typeof d.baiDaHoi === 'object' ? d.baiDaHoi : {}), [bai]: bayGio }, lanCuoi: bayGio };
}

/**
 * Mốc cuối bài so với khung nhìn: 'doi' (đang trong khung: đợi GIU_MS), 'ngay' (mốc đã nằm phía trên khung nhìn: khách đã cuộn qua
 * cuối bài, kể cả nhảy thẳng xuống chân trang), 'khong' (mốc còn phía dưới hoặc thiếu dữ liệu).
 * `giaoNhau` = IntersectionObserverEntry.isIntersecting; `canhDuoi` = boundingClientRect.bottom của mốc.
 */
function cachHien(e) {
  if (!e || typeof e !== 'object') return 'khong';
  if (e.giaoNhau === true) return 'doi';
  if (e.giaoNhau === false && typeof e.canhDuoi === 'number' && e.canhDuoi <= 0) return 'ngay';
  return 'khong';
}

module.exports = { K_KHAO_SAT, BAY_NGAY_MS, GIU_MS, nenHoi, danhDauDaHoi, cachHien };
