# Biên bản diễn tập khôi phục CSDL (L-ba78a4, Sơn)
- Script: `tools/dien-tap-khoi-phuc.sh` (chạy 1 lệnh: `bash tools/dien-tap-khoi-phuc.sh`; chỉ đọc DB thật, ghi vào thư mục tạm rồi xóa; không đụng Drive/pm2/nginx/site cũ).
- Giờ sao lưu: 01/11/2026 15:50:37 (giờ VN). Bản VACUUM INTO 991.232 B, nén gzip 590.142 B.
- Khôi phục (giải nén ra tệp tạm): 0,02 giây; VACUUM 0,09 s; nén 0,07 s; tổng cả diễn tập 0,37 s.
- integrity_check bản khôi phục: ok.
- Đối chiếu số dòng 15/15 bảng khớp (DB thật không ghi trong lúc chạy, chạy lại lần 2 vẫn khớp). Bảng chính: nguoi_dung 53/53, don_hang 82/82, ma_moi 0/0, ma_moi_dung 0/0.
- Mã mời nằm trong DB (ma_moi, ma_moi_dung) nên một bản sao DB là đủ; hiện chưa phát mã nào (0 dòng), cần diễn tập lại sau khi có mã thật.
- Chưa kiểm: diễn tập từ bản trên Drive (chỉ thử bản sinh tại chỗ); .env (KHOA_DU_LIEU) không nằm trong bản sao lưu, nếu mất thì dữ liệu mã hóa không đọc được.
- Đề xuất: (1) thêm bước tải bản mới nhất từ Drive về thư mục tạm và khôi phục (cần anh Cường duyệt nếu đụng tài khoản Drive); (2) cất khóa KHOA_DU_LIEU ở nơi riêng, có diễn tập; (3) diễn tập định kỳ hằng tuần.
