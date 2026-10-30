# Vận hành bản thử khách mời 25/11–5/12/2026 (Sơn)

## Sao lưu
- `tools/sao-luu-csdl.cjs` chạy cron 23:15: VACUUM INTO, kiểm `integrity_check`, nén, giữ 14 bản trong `~/xemtuvi-data/sao-luu/`, đẩy lên `drive:09 Sao lưu (backup)/Cơ sở dữ liệu/`. Không sao lưu `.env`.
- Đã thử khôi phục 30/10: giải nén ra thư mục tạm, `integrity_check` = ok, đủ 8 bảng, số dòng khớp; đã xóa thư mục tạm.
- Chặn: máy chủ chưa có remote `drive:` (anh Cường kết nối ở trang Nguồn AI & token). Trước đó chỉ có bản trên máy; script sẽ cảnh báo lên dashboard khi tải lên lỗi.
- Trước 24/11: chạy tay một lần, kiểm `rclone lsf` thấy tệp; thử khôi phục lại từ bản tải về từ Drive.

## Theo dõi hằng ngày (Sơn, 8:00)
1. `node tools/loi-hom-nay.cjs --canh-bao` (cron 8:00 và mỗi 30 phút): lỗi theo route; > 20 lỗi/giờ tự cảnh báo.
2. `pm2 list`: số lần restart (cột ↺) của `xemtuvi` không tăng so với hôm trước; bộ nhớ < 400 MB. `pm2 logs xemtuvi --lines 50 --nostream` khi tăng.
3. `df -h /`, mở `/` và `/api/...` kiểm sống; chứng chỉ HTTPS còn > 14 ngày.
4. Xem `~/xemtuvi-data/sao-luu.log`: bản 23:15 hôm trước có `ok`.

## Mức cảnh báo
- Cao (báo Tùng ngay bằng `office event ... --kind canh-bao` và `office task add --to tung`): site không mở được; restart ≥ 3 lần/giờ hoặc bộ nhớ > 600 MB; > 20 lỗi/giờ kéo dài 2 lần đo; sao lưu lỗi 1 đêm; đĩa > 85%; luồng mã mời không cấp quyền.
- Thường: ghi vào báo cáo sáng, xử lý trong ngày, ghi nguyên nhân theo SU-CO.md.

## Triển khai
- Chỉ triển khai bản có migration 004 và `/moi/<ma>` sau khi Bảo xong và Phúc kiểm; sao lưu CSDL tay ngay trước khi triển khai. Hạn chót sẵn sàng 24/11.
