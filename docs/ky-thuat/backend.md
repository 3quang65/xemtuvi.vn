# Backend MVP xemtuvi.vn (L-adb9cd)

Mục tiêu: tài khoản, đơn mua, quyền xem nằm trên máy chủ. Khách mua ở máy A, đăng nhập máy B vẫn xem được; nội dung trả phí chỉ rời máy chủ khi đã mua. Thanh toán vẫn giả lập, có sẵn chỗ cắm cổng thật. Không đổi luồng mua 4 bước (`docs/san-pham/luong-mua.md`).

## 1. Chọn công nghệ

| Phương án | Ưu | Nhược |
|---|---|---|
| **A. SQLite (`better-sqlite3`) trong chính app Next.js** | Một tệp CSDL, không thêm dịch vụ; nhanh, đồng bộ; sao lưu = chép 1 tệp bằng `db.backup()`; miễn phí | Một máy chủ ghi (đủ cho MVP, hàng trăm đơn/giờ vẫn ổn) |
| B. PostgreSQL trên VPS + Prisma | Mở rộng nhiều máy, nhiều công cụ | Thêm dịch vụ phải vận hành, cập nhật, giám sát; nặng RAM; chậm ra MVP |
| C. `node:sqlite` có sẵn trong Node 22 | Không cần thư viện | Còn "experimental", API có thể đổi |

**Chọn A.** Lý do: một tiến trình pm2 duy nhất, không thêm thứ phải vận hành; đổi sang PostgreSQL sau chỉ cần thay lớp `src/lib/may-chu/csdl.ts` (mọi chỗ khác gọi qua lớp này). Phiên đăng nhập tự viết (cookie ngẫu nhiên) thay vì Auth.js: Auth.js tiện cho Google nhưng kéo theo nhiều cấu hình; cookie tự viết ~80 dòng, đủ cho MVP, khi cắm Google/Zalo thật (T-950bdc) chỉ thêm bộ "nhà cung cấp".

## 2. Tài khoản & phiên
- Nhà cung cấp đăng nhập là một giao diện `NhaCungCapDangNhap` (`thu`, sau này `google`, `zalo`). Bản MVP: **`thu`** — nút Google/Zalo giả lập hỏi một email, không xác minh (chỉ bật khi `DANG_NHAP_THU=1`). Nhờ đó kiểm được "máy A mua → máy B đăng nhập cùng email thấy gói".
- Phiên: mã ngẫu nhiên 32 byte trong cookie `xtv_phien` (`HttpOnly; Secure; SameSite=Lax`, 90 ngày). CSDL chỉ lưu **băm SHA-256** của mã. Đăng xuất = xóa dòng phiên.
- API ghi (POST) kiểm `Origin` trùng site để chặn giả mạo từ trang khác.

## 3. CSDL (tệp `~/xemtuvi-data/csdl/xemtuvi.db`, ngoài repo)
- `nguoi_dung(id, nha_cung_cap, ma_ngoai, email, tao_luc)` — duy nhất (nha_cung_cap, ma_ngoai).
- `phien(ma_bam, nguoi_dung_id, het_han)`
- `la_so(id, nguoi_dung_id, sinh_ma_hoa, khoa_tim, ten_goi, tao_luc)` — thông tin sinh **mã hóa AES-256-GCM**, khóa trong `~/xemtuvi-data/.env` (`KHOA_DU_LIEU`, không vào repo, không lên Drive cùng CSDL). `khoa_tim` = HMAC của thông tin sinh để tìm trùng mà không giải mã.
- `don_hang(id, nguoi_dung_id, la_so_id, ma_goi, chu_de, so_tien, trang_thai[cho|da_tra|huy|hoan], cong[gia_lap|…], ma_giao_dich_cong, tao_luc, tra_luc)` — `so_tien` lấy từ `src/lib/goi.ts` tại máy chủ, không tin số từ trình duyệt.
- `quyen_xem(id, nguoi_dung_id, la_so_id NULL, loai[chu_de|tron_la_so|thanh_vien], chu_de, tu_luc, den_luc NULL, don_hang_id)` — thành viên năm: `den_luc` = +365 ngày; `la_so_id NULL` = áp cho mọi lá số của người đó (thành viên: tối đa 3 lá số theo bang-gia.md).
- `luan_giai_luu(khoa_cache, chuyen_de, phien_ban, noi_dung_ma_hoa)` — kết quả sinh lưu lại để không sinh lại (thay bộ nhớ đệm tệp hiện có).
- Đổi cấu trúc bằng tệp `src/lib/may-chu/migrations/NNN-*.sql`, chạy tự động khi khởi động.

## 4. API (App Router, `src/app/api/…`)
| Đường dẫn | Việc |
|---|---|
| `POST /api/dang-nhap` `{nhaCungCap, email}` → đặt cookie; `POST /api/dang-xuat`; `GET /api/toi` | tài khoản + quyền đang có |
| `POST /api/la-so` `{thongTinSinh}` → `{id}`; `GET /api/la-so` | lưu lá số khi khách mua (chỉ lúc này dữ liệu sinh mới lên máy chủ, có báo trên màn thanh toán) |
| `POST /api/don-hang` `{maGoi, chuDe, laSoId}` → đơn `cho` | tạo đơn |
| `POST /api/thanh-toan/gia-lap` `{donHangId}` | chỉ khi `CONG_THANH_TOAN=gia_lap`; gọi chung hàm `xacNhanDaTra()` |
| `POST /api/thanh-toan/webhook/[cong]` | chỗ cắm cổng thật: kiểm chữ ký → `xacNhanDaTra()` (idempotent theo `ma_giao_dich_cong`). Bản MVP trả 501 |
| `GET /api/luan-giai?laSo=&chuDe=` | kiểm quyền → trả **chỉ** chuyên đề đã mua; chưa mua → 403, không kèm nội dung |

`xacNhanDaTra()` là chỗ duy nhất đổi đơn sang `da_tra` và cấp `quyen_xem` (một giao dịch CSDL).

## 5. Luận giải sinh + khóa phía máy chủ
- Trang `/luan-giai` không nhúng nội dung trả phí trong HTML/JS gửi xuống; chỉ gọi `GET /api/luan-giai` sau đăng nhập. `doan-mau.json` (mẫu ở `/chon-goi`) chỉ chứa phần xem trước công khai.
- Sinh bằng `src/lib/luan-giai/ai/index.ts`, nhà cung cấp **`stub`** (không gọi API trả tiền). Bật Claude thật = việc riêng, cần anh duyệt chi (xem mục 8).
- Mọi route có dữ liệu riêng: `Cache-Control: private, no-store`; `robots` chặn `/api/`, `/luan-giai`, `/thanh-toan`; trang đó có `noindex`.

## 6. Sao lưu
- Script `tools/sao-luu-csdl.cjs`: `db.backup()` ra `~/xemtuvi-data/sao-luu/xemtuvi-YYYY-MM-DD.db`, nén, giữ 14 bản trên máy; `rclone copy` lên `drive:09 Sao lưu (backup)/Cơ sở dữ liệu/`. Chạy 23:15 bằng cron (Sơn), cùng mốc sao lưu Văn phòng AI. Khóa `KHOA_DU_LIEU` sao lưu riêng (anh giữ), không để cùng tệp CSDL.
- Thử khôi phục mỗi tháng một lần: tải bản mới nhất, mở được, đếm số đơn khớp.

## 7. Nhật ký lỗi
- `src/lib/may-chu/nhat-ky.ts`: ghi JSON một dòng (`t, muc, route, ma_loi, thong_diep`) vào `~/xemtuvi-data/nhat-ky/loi-YYYY-MM-DD.jsonl`; không ghi email, thông tin sinh, cookie. pm2-logrotate giữ 14 ngày.
- Tuần tra: `tools/loi-hom-nay.cjs` đếm lỗi theo route; > 20 lỗi/giờ → ghi sự kiện cảnh báo lên dashboard (`office`).

## 8. Không làm / để sau
- Cổng thanh toán thật, đăng nhập Google/Zalo thật (T-950bdc, cần anh tạo ứng dụng — miễn phí), gọi Claude thật cho luận giải (**cần duyệt chi**: ước lượng sẽ trình riêng theo số lượt sinh/ngày, có bộ nhớ đệm nên mỗi lá số × chuyên đề chỉ tốn một lần).

## 9. Cờ giai đoạn thử: phải tắt trước khi chạy chính thức
- `DANG_NHAP_THU=1` (khai trong `ecosystem.config.cjs`) cho đăng nhập KHÔNG xác minh danh tính: ai nhập email nào cũng vào được tài khoản đó. Chỉ chấp nhận khi site còn `SITE_NOINDEX=1` (không lên công cụ tìm kiếm) và chưa có khách thật.
- Trước khi chạy chính thức: bỏ `DANG_NHAP_THU` (đấu OAuth thật), đổi `CONG_THANH_TOAN` khỏi `gia_lap`, bỏ `SITE_NOINDEX`; `pm2 delete xemtuvi && pm2 start ecosystem.config.cjs && pm2 save`; kiểm `POST /api/dang-nhap` phải trả 404. Ghi vào danh sách siết bảo mật.
- Khởi động đúng: luôn `pm2 start ecosystem.config.cjs` (pm2 restart giữ biến cũ, không nạp lại cờ mới; cần `pm2 delete` rồi start). Khóa đọc từ `~/xemtuvi-data/.env` theo HOME của user chạy app (`claude`).

