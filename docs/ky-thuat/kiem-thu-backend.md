# Biên bản kiểm thử backend (BE5, T-0c6d63)

Người kiểm: Phúc (kiểm thử). Ngày 30/10/2026. Code: commit f2cec0c (BE1 3ec6c10, BE2 e516c41, BE3 f2cec0c).
Cách làm: bản chạy riêng `pm2 xemtuvi-kt` cổng 3100 (build hiện có, `DANG_NHAP_THU=1`, `CONG_THANH_TOAN=gia_lap`, CSDL và khóa thử trong /tmp, đã xóa sau test) để không đụng bản đang chạy cổng 3000. Ba hồ sơ trình duyệt Playwright độc lập: máy A (375px), máy B (1366px), người khác C (1366px). Kịch bản: `anh-kiem-thu-backend/kich-ban-be5.cjs` (chạy lại: `node …` sau khi sửa URL/đường dẫn). Ảnh: `anh-kiem-thu-backend/`.

## Kết luận
Backend đạt: tài khoản/đơn/quyền nằm ở máy chủ, nội dung trả phí không lộ khi chưa mua. **2 lỗi giao diện (không phải lỗi bảo mật)** và **2 rủi ro triển khai** cần xử lý trước khi cho khách thật (mục Lỗi).

## Kết quả từng ca
| # | Ca | Kết quả |
|---|---|---|
| 1 | Chưa đăng nhập: `/api/luan-giai` 401, `/api/la-so` 401, `/api/toi` `{dangNhap:false}` | Đạt |
| 2 | Máy A lập lá số, đăng nhập thử, chưa trả: quyền rỗng | Đạt |
| 3 | Máy A trả giả lập (trọn lá số) → thấy luận giải, không tràn ngang 375px | Đạt (A-375-luan-giai.png) |
| 4 | Máy B (hồ sơ khác) trước đăng nhập không thấy gì; đăng nhập cùng email → `/api/toi` có gói; `/api/luan-giai` 200 | Đạt |
| 5 | Máy B mở `/luan-giai` bằng giao diện | **Hỏng** (L1) |
| 6 | Chưa mua (lá số của chính mình) → 403 `chua_mua`, không kèm nội dung | Đạt |
| 7 | HTML/JS khách chưa mua (40 tài nguyên: `/`, `/chon-goi`, `/thanh-toan`, `/luan-giai`) không chứa câu luận giải thật; chunk `/luan-giai` chỉ có tên trường (`nhanDinh`) trong mã hiển thị | Đạt |
| 8 | Người khác C: không có quyền, `/api/la-so` chỉ trả lá số của C; GET luận giải lá số của A (`ban-than`, `van-10-nam`) 403; tạo đơn trên lá số của A 403; thanh toán đơn của A 404; lá số không tồn tại 403 (không phân biệt được lá số có thật hay không) | Đạt |
| 9 | Thanh toán giả lập gọi lại và 3 lần song song: lần 1 `daCapMoi:true`, sau đó `false`; quyền chỉ 1 | Đạt |
| 10 | Số tiền lấy từ máy chủ: gửi `soTien:1` → đơn 29.000 | Đạt |
| 11 | POST `dang-nhap/dang-xuat/la-so/don-hang/thanh-toan/gia-lap` thiếu Origin, Origin lạ, Origin gần giống (`site.evil`) → 403 (15/15) | Đạt |
| 12 | Cookie `xtv_phien`: HttpOnly; Secure; SameSite=Lax; 90 ngày. Phiên lưu băm 64 ký tự; thông tin sinh mã hóa (không có "1995"/"ngay" trong CSDL) | Đạt |
| 13 | Đăng xuất xóa phiên | Đạt |
| 14 | Sau `pm2 restart`: đăng nhập lại cùng email vẫn thấy 2 quyền, luận giải 200; 3 đơn `da_tra` còn trong CSDL | Đạt |
| 15 | `tai-chinh`, `gia-dao` → 404 (biết trước, việc của Hạnh) | Đúng dự kiến |
| 16 | `Cache-Control: private, no-store` trên API; `/robots.txt` `Disallow: /` (biết trước) | Đạt |
| 17 | Không tràn ngang `/`, `/chon-goi`, `/thanh-toan` ở 375px và 1366px; không lỗi JS | Đạt |

## Lỗi
**L1 (cao, giao diện): máy B không thấy gói bằng giao diện.** Đăng nhập cùng email trên máy B rồi mở `/luan-giai` bị đẩy về `/` vì trang bắt buộc có lá số trong `sessionStorage` (`useLaSoDaLuu`), dù máy chủ đã có lá số và quyền. Mục tiêu "đăng nhập máy B thấy gói" chỉ đúng ở API, chưa đúng với khách thật.
- Tái hiện: máy A mua trọn lá số; mở trình duyệt mới, vào `/`, đăng nhập (POST `/api/dang-nhap` hoặc nút Google thử ở `/thanh-toan`), vào `/luan-giai` → về trang chủ. Ảnh: `B-1366-vao-thang-luan-giai.png`.
- Gợi ý: `/luan-giai` lấy lá số từ `GET /api/la-so` khi đã đăng nhập; chỉ bắt lập lá số khi chưa đăng nhập hoặc chưa có lá số.

**L2 (trung bình, giao diện): trang chỉ hiện quyền mua gần nhất.** `LuanGiai.tsx` dùng `quyen.at(-1)`. Khách mua trọn lá số (99k) rồi mua thêm gói một chủ đề thì trang hiện "Mở một chủ đề — Sự nghiệp", mất 3 chủ đề còn lại dù API vẫn cho xem. Ảnh: `B-1366-nhap-lai-roi-luan-giai.png`. Gợi ý: lấy quyền rộng nhất theo lá số (thành viên > trọn lá số > chủ đề). Ngoài ra khi máy B tự nhập ngày sinh khác, phần tóm tắt lá số vẽ theo ngày sinh nhập tay còn nội dung luận theo lá số trên máy chủ; sau khi sửa L1 nên bỏ nhập tay.

**R1 (cao, triển khai): bản đang chạy cổng 3000 chưa dùng được backend.** `pm2` hiện thiếu `DANG_NHAP_THU` và `CONG_THANH_TOAN` (`/api/dang-nhap` trả 404 "Đăng nhập thử đang tắt") dù `ecosystem.config.cjs` có khai; nên start bằng `pm2 start ecosystem.config.cjs`. Ngoài ra `~/xemtuvi-data/.env` chưa có `KHOA_DU_LIEU` (và không có biến môi trường) → mọi thao tác lưu lá số/luận giải sẽ báo `LoiKhoa`. **Đã xử lý (Sơn, 30/10):** pm2 xóa và start lại bằng ecosystem (đã có cờ, đăng nhập 200, lưu lá số ok, `pm2 save`); `.env` có `KHOA_DU_LIEU` (app đọc được: lưu lá số thành công), không thấy lỗi đường dẫn/user, nhiều khả năng lúc kiểm chưa tạo hoặc kiểm bằng user khác. Việc của Sơn; khóa do anh Cường giữ bản sao (backend.md mục 6), không đưa vào repo/Drive cùng CSDL.

**R2 (thấp): thư mục `nhat-ky` không tạo ở lần chạy thử** vì không có lỗi 5xx; chưa kiểm được ghi nhật ký lỗi thật (ngoài phạm vi ca này).

## Chưa kiểm
Hết hạn phiên 90 ngày, thành viên năm giới hạn 3 lá số, sao lưu lên Drive (BE4), trình duyệt thật qua HTTPS của tên miền (kiểm trên localhost; cookie Secure chạy được vì localhost được coi là an toàn).

## Đã sửa L1, L2
`/luan-giai` không còn cần lá số trong `sessionStorage`: đăng nhập rồi lấy `/api/toi` + `GET /api/la-so`, cho chọn lá số; chưa đăng nhập thì hiện form đăng nhập tại chỗ. Quyền gộp theo lá số (`src/lib/quyen-xem.ts`): thành viên > trọn lá số > các chủ đề mua lẻ. Kiểm: `tests/quyen-xem.test.cjs`; kịch bản 2 trình duyệt `anh-kiem-thu-backend/kich-ban-l1-l2.cjs` (10/10 đạt, 375px không tràn ngang).
