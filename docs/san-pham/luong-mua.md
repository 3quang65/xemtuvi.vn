# Luồng mua MVP (L-5e2a62) — đã chốt

## Quyết định
- Lá số + tóm tắt miễn phí, **không cần tài khoản**. Chỉ hỏi đăng nhập ở bước thanh toán (chuẩn thị trường: xem-tuvi.com, Mèo Béo, giaimalaso; xem `vanphongai/nghien-cuu-thi-truong/2026-10-30-luong-mua-gia-doi-thu.md` mục 3).
- Tối đa **4 màn hình** từ lúc vào tới khi trả tiền xong:
  1. `/` Nhập ngày giờ sinh.
  2. `/` (cùng trang, cuộn xuống) Lá số + **tóm tắt miễn phí** + nút "Xem luận giải chuyên sâu".
  3. `/chon-goi` Chọn gói (3 thẻ gói, có mẫu đoạn luận giải bị khóa một phần).
  4. `/thanh-toan?goi=…` Đăng nhập (Google / Zalo) + thanh toán **giả lập** trên cùng một màn. Xong → `/luan-giai` (trang đích, không tính là bước).
- Đăng nhập Google/Zalo ở MVP là **giả lập** (nút bấm tạo tài khoản thử trong trình duyệt). Đăng nhập thật cần đăng ký ứng dụng với Google/Zalo → việc sau.
- Thông tin sinh không gửi lên máy chủ: lưu trong `sessionStorage` của trình duyệt để mang qua các bước. Không đưa ngày sinh lên URL.
- Giá: xem `docs/san-pham/bang-gia.md` (một nguồn duy nhất `src/lib/goi.ts`, không giá gạch).

## Đo lường (không lưu dữ liệu cá nhân)
Sự kiện gửi về `/api/su-kien` với mã phiên ngẫu nhiên, ghi file JSONL trên máy chủ (ngoài repo):
`vao_form` (hiện form) · `lap_la_so` (lập thành công) · `xem_tom_tat` · `bam_xem_sau` · `vao_chon_goi` · `chon_goi` · `vao_thanh_toan` · `dang_nhap` · `thanh_toan_xong`.
Chỉ số: lập lá số / vào form ≥ 70%; bấm mua / xem lá số; số bước thực tế = số màn hình khác nhau giữa `vao_form` và `thanh_toan_xong` (≤ 4).
Xem số liệu: `node tools/pheu.cjs` (in bảng tỉ lệ).
