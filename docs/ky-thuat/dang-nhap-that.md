# Đăng nhập thật Google/Zalo — đánh giá phương án (T-950bdc, Tùng 30/10/2026)
Chưa làm. Chỉ đánh giá; phụ thuộc T-f60b6a (phiên + CSDL) trong L-adb9cd.

## Phương án
| | A. Tự viết OAuth (khuyến nghị) | B. Auth.js | C. Dịch vụ ngoài (Firebase/Clerk…) |
|---|---|---|---|
| Cách làm | Thêm 2 nhà cung cấp `google`, `zalo` vào `NhaCungCapDangNhap`; dùng phiên cookie đã chốt ở backend.md §2 | Thư viện sẵn, Google có sẵn, Zalo phải tự viết | Thuê nền tảng quản lý đăng nhập |
| Công | ~1 lượt Bảo + 1 lượt Phúc | Tương đương, thêm cấu hình | Ít code nhất |
| Chi phí | 0đ | 0đ | 0đ mức đầu, trả theo số người dùng về sau; dữ liệu khách nằm ngoài |
| Rủi ro | Phải tự giữ đúng chuẩn (state, PKCE) | Xung đột với phiên tự viết | Phụ thuộc bên thứ ba |

## Chi phí
- Google Cloud (OAuth) và Zalo Developers: **miễn phí**. Cần tài khoản Google + Zalo của anh; Zalo có thể yêu cầu xác minh tổ chức/ứng dụng (thời gian duyệt chưa rõ, nên nộp sớm). Không phát sinh khoản chi → chưa cần `office approval add`.
- Chạy chính thức: Google yêu cầu trang chính sách quyền riêng tư và xác minh màn hình xin quyền (chỉ xin email + tên thì không cần duyệt nặng).

## Khuyến nghị
A, làm sau T-f60b6a. Việc anh phải làm (khi tới lượt, Minh soạn hướng dẫn từng bước): tạo ứng dụng Google Cloud + Zalo Developers, đưa Client ID/Secret vào VPS qua Sơn (không vào repo). Zalo là điểm chậm nhất → đề xuất anh nộp đăng ký Zalo sớm. Bản chính thức tắt `DANG_NHAP_THU`.

## Đã làm: Google OAuth, phương án A (L-5520be, 30/10/2026)
- Mã: `src/lib/may-chu/google-oauth.ts` (state, PKCE S256, nonce, đổi mã, kiểm id_token), `xu-ly.ts` (`googleBatDau`, `googleVe`, `cauHinhDangNhap`), `dich-vu.ts` (`dangNhapGoogle`). Đường dẫn: `GET /api/dang-nhap/google?ve=/trang`, `GET /api/dang-nhap/google/callback`, `GET /api/dang-nhap/cau-hinh`; trang lỗi `/dang-nhap-loi`. Zalo chưa làm.
- An toàn: cookie `xtv_oauth` (HttpOnly, Secure, Lax, 10 phút, chỉ gửi tới `/api/dang-nhap/google`) giữ state+verifier+nonce, xóa sau mỗi lần về; state so bằng `timingSafeEqual`; **chỉ nhận email có `email_verified === true`**; kiểm iss, aud, azp, exp, nonce; `ve` chỉ nhận đường dẫn nội bộ. Tài khoản định danh bằng `sub` của Google (không phải email).
- Gộp: tài khoản thử cùng email được chuyển sang Google (giữ lá số, đơn, quyền); từ đó không vào bằng mã khôi phục nữa.
- Bật/tắt: không có `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` thì nút ẩn, đường dẫn trả 404. Hai khóa đặt trong `~/xemtuvi-data/.env` (hoặc biến môi trường), không vào repo. `GOOGLE_REDIRECT_URI` tùy chọn (mặc định `https://<host>/api/dang-nhap/google/callback`). Danh sách `EMAIL_THU_CHO_PHEP` chỉ áp cho đăng nhập thử, không áp cho Google (email đã được Google xác minh).
- Việc anh làm ở Google Cloud: tạo OAuth client loại Web, Authorized redirect URI = `https://<tên miền bản thử>/api/dang-nhap/google/callback`, màn xin quyền chỉ `openid email profile`, chế độ Testing + thêm email khách mời làm Test user (tối đa 100) HOẶC Publish (xin email/tên không cần duyệt nặng; cần trang quyền riêng tư).
- Nhập khóa: anh chạy `bash tools/nhap-khoa-google.sh` trên VPS (secret gõ ẩn, ghi `.env` quyền 600, tự restart pm2 và kiểm `/api/dang-nhap/cau-hinh`). Hướng dẫn cho anh: vanphongai `san-pham/huong-dan-anh-google-oauth_v1.md` (L-e7bc21).
- Test: `tests/dang-nhap-google.test.cjs` (13 ca).
