# Rà bố cục điện thoại v3.xemtuvi.vn (L-85044d, 31/10/2026)

Cách làm: Playwright/Chromium headless, cảm ứng, cuộn hết trang, 360/375/414px. Lá số mẫu: Nữ, dương lịch 15/8/1992, 9 giờ. Ảnh: `docs/kiem-thu/anh-di-dong/<trang>-<cỡ>.png` (15 ảnh).
Trang: 01 `/` (form nhập), 02 lá số sau khi lập (hiện ngay trên `/`), 03 `/chon-goi`, 04 `/cung/phu-the`, 05 `/luan-giai`.

Kết quả đo: không trang nào tràn ngang (scrollWidth = chiều rộng màn hình ở cả 15 ca); không chữ bị cắt/đè; bàn lá số 4x4 không méo, đọc được.

## Danh sách lỗi (3 lỗi: cao 0, vừa 2, thấp 1)

- **L1 (vừa)** - `/` sau khi lập lá số, 360/375/414: chữ trong ô bàn lá số quá nhỏ, nhiều nhãn 8,3px và 9,5px (một số 9,8px), thấp hơn mức tối thiểu 0,72rem (11,5px) ghi trong `docs/thiet-ke/he-thong-thiet-ke.md`. Ảnh: `02-la-so-360.png`, `02-la-so-375.png`, `02-la-so-414.png` (vùng bàn lá số, quanh nhãn Quyền/Khoa/Kỵ và dòng tuổi/độ sáng).
- **L2 (vừa)** - `/luan-giai`, 360/375/414: liên kết "Chưa mua? Lập lá số miễn phí" cao 20px (<44px), dễ bấm nhầm. Ảnh: `05-luan-giai-360.png`, `-375.png`, `-414.png`.
- **L3 (thấp)** - `/` (lá số), 360/375/414: hai nút đổi năm ‹ › rộng 27/28/30px x cao 44px (chiều rộng <44px; tài liệu thiết kế ghi 36px). Ảnh: `02-la-so-360.png`, `-375.png`, `-414.png`.

Ghi chú không tính lỗi: ô radio/checkbox nhỏ (13px, 22px) nhưng nhãn bao quanh cao 48px nên vùng chạm đủ. Trang 01, 03, 04 đạt: 0 lỗi.
Chưa làm: không đo trên máy thật (chỉ giả lập Chromium); không kiểm các trang khác ngoài 5 trang giao.
