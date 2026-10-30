# Đọc như khách, lần 1 (Phúc, 30/10/2026, T-6c24b2)

Bản kiểm: build `.next-a` đang chạy (commit 78e185c), bản riêng cổng 3100, CSDL thử trong /tmp (đã xóa). Playwright, iPhone 13 (390px), 4G giả lập 1,6 Mbps / 150 ms / CPU chậm 4 lần. Kịch bản: `anh-doc-nhu-khach-lan-1/kich-ban-doc-nhu-khach.cjs`. Ảnh: `anh-doc-nhu-khach-lan-1/`. Thư chưa tham gia lần này, bài trả phí chưa chấm theo bảng (cần Thư).

## Thời gian từng bước
| Bước | Thời gian |
|---|---|
| H1 mở trang chủ (lần nguội) | 3,1 s |
| H1 điền form, bấm Lập lá số, hiện lá số | 0,6 s |
| H2 sang trang chọn gói | 0,5–0,7 s |
| H3 chọn gói, sang thanh toán | 0,4–1,1 s |
| H3 đăng nhập, hiện mã khôi phục | 0,5–0,7 s |
| H3 thanh toán giả lập, bấm "Xem luận giải", hiện bài | ~1,9 s |
| H4 đổi tab bài | 0,9 s |
| Tải lại các trang chính (lần ấm): `/`, `/chon-goi`, `/thanh-toan`, `/luan-giai`, `/tro-giup` | 0,6–0,8 s (FCP 0,26–0,5 s) |

## Điều đáng tiền
Bài Trọn lá số khoảng 1.000 từ, mỗi nhận định có dòng "Căn cứ" (sao, cung, sách, trường phái); lá số miễn phí kèm tóm tắt 5 ý có nguồn; đoạn xem trước cho thấy giá trị thật (làm mờ phần còn lại). Không tìm thấy câu gây sợ hay từ cấm (quét từ khóa: hạn, sát, họa, tai nạn, chết, giải hạn, cúng, bùa, phá sản, ly hôn, bệnh: 0 kết quả) và không có câu ép mua (đếm ngược, "chỉ còn", giảm giá: 0). Không tràn ngang ở mọi trang, 0 lỗi JS.

## Phát hiện
**F1 (chặn ra mắt, không chặn giai đoạn thử): khách không thấy giá.** Mọi thẻ ở `/chon-goi` và dòng "Tổng" ở `/thanh-toan` ghi "Sẽ công bố khi ra mắt". Khách không so được "đáng tiền hay không", dễ bỏ đi ngay trước nút thanh toán. Tái hiện: lập lá số, bấm Xem luận giải chuyên sâu, xem các thẻ gói. Ảnh `03-chon-goi.png`, `04-thanh-toan.png`. Người nhận: Xuân/Minh chốt giá hiển thị, Bảo gắn vào.
**F2 (chặn nếu lặp lại trên bản triển khai): trang chủ mở nguội mất 3,1 s** (> 3 s). Lần mở sau chỉ 0,8 s, nên có thể do khởi động hoặc cache; cần đo lại trên bản triển khai qua Cloudflare. Tái hiện: khởi động bản chạy, mở `/` ngay lần đầu với giả lập 4G. Người nhận: Sơn đo, Bảo xem nếu lặp lại.
**F3 (không chặn): lá số khó đọc trên điện thoại.** 239 phần tử chữ dưới 14 px trên trang lá số (tên cung 12,8 px, sao 11,8 px, chữ viết tắt "V" 8 px); ô chọn giới tính, ngày/âm lịch, đồng ý nhận tin chỉ 13–22 px, dưới mức bấm dễ (40 px). Ảnh `02-la-so-mien-phi.png`. Người nhận: Mai thiết kế, Bảo sửa.
**F4 (không chặn): bước "mã khôi phục" làm khách muốn bỏ đi.** Đăng nhập thử không dùng Google; khách mới nhận mã 10 ký tự "chỉ hiện một lần, mất mã thì không đăng nhập lại được vào lá số đã lưu", phải bấm "Tôi đã lưu mã, tiếp tục". Nữ 25–35 quen đăng nhập Google/Zalo, dễ lo hoặc làm mất mã. Ảnh `04b-ma-khoi-phuc.png`. Người nhận: Minh/Mai quyết (chờ đăng nhập thật).
**F5 (không chặn): gói "Khuyên dùng" nằm cuối trang chọn gói.** Trên 390px khách phải cuộn khoảng 2.000 px, qua 3 thẻ khác, mới tới Trọn lá số; thẻ đầu là Vận năm 2027 (gói phụ). Ảnh `03-chon-goi.png`. Người nhận: Xuân/Mai.
**F6 (không chặn): sau thanh toán không chuyển thẳng vào bài.** Khách phải thấy trang xác nhận rồi bấm "Xem luận giải của tôi". Màn hình đầu của bài chỉ có tiêu đề và 7 nút tab xếp 3 hàng, nội dung bài bắt đầu dưới màn hình đầu. Ảnh `04c-sau-thanh-toan.png`, `05-bai-tra-phi-dau.png`. Người nhận: Mai/Bảo.

Tổng: 6 phát hiện, 2 chặn (F1; F2 chờ đo lại), 4 không chặn. Bài trả phí còn chờ Thư chấm theo bảng.
