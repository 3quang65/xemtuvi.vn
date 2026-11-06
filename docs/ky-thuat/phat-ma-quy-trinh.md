# Quy trình phát mã mời bản thử (Sơn, việc L-a9690f / T-de1db4)

Không chứa mã thật, không chứa thông tin khách.

## Trạng thái hạ tầng (kiểm 6/11/2026)
- Migration `004-ma-moi.sql` đã có trong main và đã chạy trên CSDL đang chạy (bảng `migrations` có 001–012; `ma_moi`, `ma_moi_dung` tồn tại). Không cần chạy thêm.
- `GOP_Y_URL`: site đọc lúc chạy (`process.env`), chỉ nhận `https://`. Chưa đặt vì chưa có đường dẫn biểu mẫu (Hoàng/Ngân cấp). `ecosystem.config.cjs` nay truyền biến này nếu có.
- `/moi/*` đang TẮT (cờ `THU_KIN_MOI_TAT`, `~/xemtuvi-data/co-khan.json`) tới 16/11. Bật đúng ngày thử: `echo '{"THU_KIN_MOI_TAT": false}' > ~/xemtuvi-data/co-khan.json` (có hiệu lực ngay).

## Đặt GOP_Y_URL (khi có đường dẫn)
1. Đường dẫn phải `https://`, không chứa dữ liệu cá nhân.
2. `GOP_Y_URL='https://…' scripts/trien-khai.sh` (cần git sạch, test xanh) hoặc `GOP_Y_URL='https://…' pm2 reload ecosystem.config.cjs --update-env && pm2 save`.
3. Kiểm: `curl -s 'http://127.0.0.1:3000/api/ma-moi/kiem?ma=<mã hợp lệ>'` thấy `gopYUrl`.

## Phát mã (chỉ khi có điều kiện cổng)
Cổng, đủ cả ba mới chạy `tao`:
1. Anh Cường đã duyệt nguồn trên việc L-a9690f (trích lời duyệt vào báo cáo).
2. Hoàng đã gửi danh sách nguồn + số lượng.
3. Không trước 14/11/2026.

Các bước:
1. Sao lưu CSDL: `cp ~/xemtuvi-data/csdl/xemtuvi.db ~/xemtuvi-data/sao-luu/xemtuvi-truoc-phat-ma-$(date +%Y%m%d).db`.
2. Mỗi nguồn một lệnh: `node tools/ma-moi.cjs tao --nguon <tuvivn|anh|cd-3a..cd-3e> --so-luong N --gioi-han 1 --het-han 2026-11-30`. Không ghi tên khách vào `--ghi-chu`.
3. Kiểm: `node tools/ma-moi.cjs ds` (số mã mỗi nguồn khớp danh sách).
4. Gửi `mã<TAB>đường dẫn` cho Hoàng qua `office`. Không dán mã vào repo, issue hay báo cáo công khai.
5. Báo cáo ≤10 dòng: số mã theo nguồn, sha sao lưu, không chi tiền.
