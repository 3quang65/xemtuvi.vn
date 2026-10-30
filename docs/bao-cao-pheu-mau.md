# Báo cáo phễu theo nhóm nguồn — bản mẫu (SỐ GIẢ LẬP)

Không phải số thật: tạo bằng `node tools/pheu.cjs --gia-lap` (hạt 7) để kiểm báo cáo trước khi chạy ads. Số thật: `node tools/pheu.cjs --nguon` (hoặc `--md` để lấy bảng Markdown).
Nguồn quy ước: `vanphongai/kinh-doanh/dac-ta-do-luong_v1.md` mục 2–3.

## Cách đọc
- Mỗi phiên thuộc nhóm nguồn của sự kiện `vao_trang` đầu tiên (máy chủ tự tính nhóm từ UTM; không UTM thì từ trang giới thiệu → `direct` / `organic` / `referral`, và `tuvi-vn` / `social` nếu trang giới thiệu là tuvi.vn / mạng xã hội).
- Nhóm dưới 100 phiên: ghi **chưa đủ mẫu**, không cảnh báo. Gộp nhiều ngày bằng cách để các file ngày trong cùng thư mục.
- Chỉ số 5 (CPA) = n/a: chưa chạy ads, chưa có số chi nhập tay.
- `vao_chon_goi` (tên ghi) được báo cáo là `xem_trang_gia`. `dang_ky_thanh_vien` chỉ ghi khi tạo tài khoản lần đầu; `dang_nhap` ghi mọi lần đăng nhập.
- Cảnh báo (khi đủ mẫu): lập < 25%, chọn gói < 10%, trả tiền < 12%; `direct` > 40% tổng phiên (nghi thiếu UTM).

## Bảng (số giả lập, 1.550 phiên)

| Nhóm nguồn | 1. Phiên | % tổng | 2. Truy cập → lập lá số | 3. Lập → chọn gói | 4. Chọn → trả tiền | 5. CPA ads |
|---|---|---|---|---|---|---|
| tuvi-vn | 420 | 27.1% | 47.6% | 18.5% | 24.3% | n/a |
| organic | 260 | 16.8% | 43.1% | 19.6% | 27.3% | n/a |
| social | 190 | 12.3% | 36.8% | 17.1% | 8.3% | n/a |
| paid | 310 | 20.0% | 41.3% | 13.3% | 29.4% | n/a |
| email | 60 | 3.9% | chưa đủ mẫu | chưa đủ mẫu | chưa đủ mẫu | n/a |
| partner | 40 | 2.6% | chưa đủ mẫu | chưa đủ mẫu | chưa đủ mẫu | n/a |
| direct | 150 | 9.7% | 30.7% | 4.3% | 50.0% | n/a |
| referral | 120 | 7.7% | 32.5% | 23.1% | 11.1% | n/a |

## Cảnh báo sinh ra


- social: chọn → trả tiền 8.3% (< 12%)
- direct: lập → chọn gói 4.3% (< 10%)
- referral: chọn → trả tiền 11.1% (< 12%)
