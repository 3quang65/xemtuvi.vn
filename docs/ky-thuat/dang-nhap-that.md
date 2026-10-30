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
