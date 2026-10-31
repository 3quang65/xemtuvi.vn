// Cờ "tab này đã khai thông tin sinh" để máy chủ biết có nên cho vào /chon-goi hay không.
// Thông tin sinh vẫn chỉ ở sessionStorage; cookie này chỉ là cờ "1", không chứa dữ liệu nào.
export const COOKIE_CO_SINH = 'xtv_co_sinh';

export const chuoiCookieCoSinh = () => `${COOKIE_CO_SINH}=1; path=/; samesite=lax`;

/** Chưa khai thông tin sinh mà vào /chon-goi: máy chủ chuyển về trang chủ ngay, khỏi chờ trình duyệt nạp JS rồi mới chuyển. */
export const canChuyenVeTrangChu = (pathname: string, coCo: boolean) => !coCo && /^\/chon-goi\/?$/.test(pathname);
