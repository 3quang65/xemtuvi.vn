# Quy trình "đọc như khách" (QUY-CHE mục 0, cách làm 2)

Chạy trước mỗi lần ra tính năng hoặc gói mới. Phúc (kiểm thử) và Thư (kiểm duyệt nội dung) cùng làm; Tùng chịu trách nhiệm không lỗi, Mai chịu trách nhiệm trải nghiệm. Lỗi tìm được: Phúc ghi phiếu kèm bước tái hiện, Tùng tạo việc riêng cho Bảo. Người kiểm không sửa code trong lượt kiểm.

## Chân dung khách
Nữ 25–35 tuổi, dùng iPhone hoặc Android, màn hình 375–414px, mạng 4G (giả lập 1,6 Mbps, trễ 150 ms, CPU chậm 4 lần). Đã nghe tử vi từ bạn bè, không rành thuật ngữ, đọc lướt trên điện thoại giữa giờ làm. Muốn "hiểu mình, định hướng", sợ bị dọa và sợ bị ép mua. Sẵn sàng trả tiền nếu thấy bài nói đúng về mình và áp dụng được.

## Ba hành trình (mỗi hành trình bấm giờ từng bước)
1. **Lập lá số miễn phí**: mở trang chủ, điền form, bấm Lập lá số, đọc lá số và phần tóm tắt.
2. **Đọc xem trước, chọn gói**: bấm "Xem luận giải chuyên sâu", đọc đoạn xem trước và so các gói, đến trang thanh toán.
3. **Mua gói giả lập và đọc bài trả phí**: đăng nhập, lưu mã khôi phục, thanh toán giả lập, mở bài, đọc từng tab (Bản thân, Tình cảm, Sự nghiệp…).
Chạy lại bằng `docs/san-pham/anh-doc-nhu-khach-lan-1/kich-ban-doc-nhu-khach.cjs` (Playwright, thiết bị iPhone 13, giả lập 4G; sửa cổng và đường dẫn đầu file; dùng bản chạy riêng với CSDL thử trong /tmp, không dùng dữ liệu thật).

## Phiếu ghi (mỗi hành trình, mỗi bước)
| Bước | Thời gian | Điều khó chịu | Điều thấy đáng tiền | Chỗ muốn bỏ đi | Ảnh | Chặn? |
Mỗi phát hiện: mức (chặn / không chặn), bước tái hiện, ảnh, người nhận việc.

## Bảng kiểm bắt buộc
- Tải trang đầu và các trang chính trên 4G giả lập, đo cả lần mở nguội (ngay sau khởi động) và lần sau.
- Không tràn ngang; không lỗi JS; ô bấm ≥ 40 px; chữ thân bài ≥ 14 px. **Mục do Mai bổ sung (giao diện điện thoại: chữ, nút, cuộn ngang) sẽ chép vào đây khi Tùng chuyển yêu cầu.**
- Giá nhìn thấy trước khi khách bấm mua; không có chữ ép mua (đếm ngược, "chỉ còn…", giảm giả).
- Quét câu gây sợ và từ cấm (cổng an toàn mục 0 của `docs/nghien-cuu/bang-cham-chat-luong.md`); mỗi nhận định có căn cứ.
- Bài trả phí: Thư chấm theo bảng chấm (đạt khi ≥ 20/25, không tiêu chí < 4, Đúng = 5).

## Điều kiện chặn ra mắt
1. Lỗi chặn luồng (không lập được lá số, không mua được, không mở được bài đã mua).
2. Bài trả phí dưới ngưỡng bảng chấm của Thư.
3. Có câu gây sợ hoặc ép mua.
4. Trang tải quá 3 giây trên 4G giả lập (đo cả lần nguội).
Có một điều kiện bị vi phạm: Tùng đề nghị chặn ra mắt, báo Minh kèm phiếu.
