# Phiếu lỗi "đọc như khách" lần 2 (L-55b1f0 / L-1c9a5a)

Người kiểm: Phúc. Ngày: 2026-10-31. Bản chạy thật: https://v3.xemtuvi.vn (build id lúc đo `bjmhlVM30TJb692vzspNq`). Không sửa code. Thanh toán giả lập; tài khoản thử (không ghi ở đây).
Đo: mobile = iPhone 13 (390px, Playwright), 4G giả lập 1,6 Mbps / 150 ms / CPU 4x, context mới (lần nguội, cache trống); desktop = 1366x768, không giả lập mạng. Kịch bản: /tmp/phuc/run.cjs (bản tạm, không commit). Ảnh trong `anh/`.

## Lá số đã kiểm (8)
| Mã | Lá số | Mobile | Desktop | Kết quả |
|---|---|---|---|---|
| c1 | Nữ 15/8/1995 07:00 | 3 hành trình đủ | đủ | Lập, mua, mở đủ 7 tab; âm lịch, Mệnh Thìn Thất Sát, Kim Tứ Cục khớp engine tham chiếu |
| c2 | Nam 2/3/1988 23:30 (Tý muộn) | đủ | đủ | Âm 16/1 Mậu Thìn (cộng ngày), Mệnh=Thân Dần, khớp tham chiếu |
| c3 | Nữ âm lịch 15/2 nhuận 2023 14:00 | chỉ lập | chỉ lập | Ra dương 5/4/2023 đúng; "15/2 nhuận" ghi rõ |
| c4 | Nam 20/5/1960 10:00 (trước 1968) | đủ | đủ | Âm 25/4 Canh Tý, Mệnh Tý, Hỏa Lục Cục khớp tham chiếu |
| c5 | Nữ Việt kiều Mỹ (New York) 24/12/1990 22:15 | KHÔNG kiểm được | không | Xem LOI-03 |
| c6 | Nam 29/2/2000 00:10 (ngày nhuận dương, biên giờ) | chỉ lập | chỉ lập | Âm 25/1 Canh Thìn, Mệnh Dần, Thổ Ngũ Cục khớp |
| c7 | Nữ 10/9/1972 05:00, ô "miền Nam trước 1975" | chỉ lập | chỉ lập | Quy đổi về 05:00→giờ Dần, âm 3/8 Nhâm Tý, nhãn Dương Nữ nghịch lý đúng |
| c8 | Nam 31/12/1999 23:59 (biên năm + Tý muộn) | chỉ lập | chỉ lập | Âm 25/11 Kỷ Mão, giờ Tý, Mệnh Tý, Thủy Nhị Cục khớp |
Đã đối chiếu skill tuvi-an-sao (engine tham chiếu `tuvi-ref-engine.py`) cho c1, c2, c4, c6, c8: khớp lịch âm, Mệnh, Thân, cục. Không thấy lỗi an sao. Nhãn "Âm dương nghịch lý" ở c1 và c3 (Âm Nữ) nhìn thoáng như sai nhưng đúng quy ước spec 4.x dòng 191 (so âm dương chi cung Mệnh với năm sinh).

## Thời gian từng bước (mobile 4G, nguội), ms
| Bước | c1 | c2 | c4 |
|---|---|---|---|
| Mở trang chủ (load) | 3541 | 3185 | 3235 |
| Lập lá số (bấm → có tóm tắt) | 1503 | 708 | 696 |
| Sang /chon-goi | 1021 | 799 | 885 |
| Chọn gói → /thanh-toan | 785 | 1053 | 573 |
| Đăng nhập | 465 | 133 | 123 |
| Thanh toán giả lập → trang xác nhận | 1294 | 1237 | 1224 |
| Mở bài | 1888 | 1460 | 1524 |
| Chuyển tab (gồm chờ 600 ms) | 70-250 | 70-250 | 70-350 |
Tải trang đầy đủ lần nguội (load / LCP / dung lượng): `/` 3200 ms / 1404 / 481 KB; `/chon-goi` 2300 / 1200 / 281 KB; `/thanh-toan` 2318 / 1316 / 247 KB; `/luan-giai` 2517 / 1276 / 293 KB; `/tro-giup` 2891 / 1448 / 435 KB; `/van-nam-2027` 2813 / 1360 / 422 KB. Lần sau: 650-900 ms. Desktop: trang chủ 0,77-0,9 s.
Kiểm chung: không tràn ngang ở mọi trang (375/390 và 1366); không lỗi JS; không HTTP >= 400 trong luồng; không có chữ ép mua (đếm ngược, "chỉ còn", giảm giá) ở trang chủ, chọn gói, thanh toán, bài; không thấy câu gây sợ trong 3 bài (quét từ khóa hạn, họa, bệnh, ly hôn, tai nạn..., chỉ khớp tên sao Địa Kiếp, Triệt, "đại hạn" trong ngữ cảnh trung tính).

## Danh sách lỗi
Tổng: CHẶN 2, NÊN SỬA 6, NHỎ 3.

### CHẶN
**LOI-01 CHẶN (điều kiện 1: không mở được bài đã mua) Mua cho lá số này nhưng nút "Xem luận giải của tôi" mở bài của lá số khác.** Task: T-813d0d.
- Tái hiện: v3.xemtuvi.vn, tài khoản đã có nhiều lá số. Lập lá số nữ 15/8/1995 07:00, mua Trọn lá số (giả lập), bấm "Xem luận giải của tôi". Làm lại với nam 2/3/1988 23:30 rồi nam 20/5/1960 10:00. Cả ba lần ô "Lá số" chọn sẵn "Lá số 1" và bài là của lá số có Cự Môn tại Mệnh (không phải lá số vừa mua). 7 tab của 3 lần mua giống hệt từng chữ (3140/4856/3440/961/4019/6567 ký tự).
- Chọn tay "Lá số 2/3/4" mới ra đúng bài (Thất Sát; vô chính diệu; Thiên Cơ tại Mệnh), nhưng nhãn chỉ ghi "Lá số 1..4", khách không biết cái nào là của mình.
- Màn hình: 375/390px và 1366px. Lá số: c1, c2, c4.
- Ảnh: `anh/mobile-c2-nam-ty-muon-1988-06-bai-dau.png` (ô Lá số = Lá số 1 sau khi mua c2), `anh/mobile-tk-thu-chon-la-so-mac-dinh-la-so-1.png`, `anh/mobile-c2-nam-ty-muon-1988-05-sau-thanh-toan.png`. So lá số vừa lập: `anh/mobile-c2-nam-ty-muon-1988-02-la-so.png` (Mệnh Dần vô chính diệu).
- Gợi ý: mặc định lá số của đơn gần nhất (đưa laSoId vào link sau thanh toán); nhãn ô chọn ghi ngày sinh, giới tính. Khách chỉ có một lá số không gặp lỗi này nên dễ lọt.

**LOI-02 CHẶN (điều kiện 4: tải >3 s trên 4G giả lập, đo nguội) Trang chủ load 3,2-3,5 s.** Task: T-9e3f4d.
- Tái hiện: mở https://v3.xemtuvi.vn/ bằng context mới, iPhone 13, 1,6 Mbps/150 ms/CPU 4x. Load event 3185-3541 ms trong 9/9 lần (c1-c8 và đo riêng). FCP và LCP 1,4 s (nội dung hiện sớm), 481 KB, 25 request.
- Ghi chú: theo quy trình "trang tải" đo bằng load event nên tính CHẶN; nếu Tùng/Minh quyết định đo bằng LCP thì hạ NÊN SỬA. Các trang khác 2,3-2,9 s, sát ngưỡng.
- Lá số: không liên quan. Ảnh: `anh/mobile-c1-nu-1995-01-trang-chu.png`.

### NÊN SỬA
**LOI-03 NÊN SỬA Bản chạy v3 không có ô "Sinh ở nước ngoài?"; không lập được lá số Việt kiều.** Mã nguồn main có (commit 583c443) nhưng bản chạy (build id `bjmhlVM30TJb692vzspNq`) không có; build trên đĩa `.next/BUILD_ID` = `AUytx1pT08DfTGwSZ-fT3` khác bản đang chạy. Tái hiện: trang chủ, dương lịch, không có nút nào dưới ô Giờ sinh (375 và 1366). Lá số c5. Ảnh `anh/mobile-c5-nu-vietkieu-my-02-la-so.png`. Nhờ Sơn xác nhận bản triển khai khớp main. Việt kiều chưa kiểm được (khách là một phần Việt kiều).

**LOI-04 NÊN SỬA Trang chọn gói không hiện giá, chỉ ghi "Sẽ công bố khi ra mắt".** Bảng kiểm yêu cầu giá nhìn thấy trước khi bấm mua; trang thanh toán cũng chưa có giá. Có thể là chủ ý (chưa đổi giá thật), nhờ Minh quyết. 375px, mọi lá số. Ảnh `anh/mobile-c2-nam-ty-muon-1988-03-chon-goi.png`.

**LOI-05 NÊN SỬA Chữ nhỏ hơn 14 px trên điện thoại.** Lá số: 229-241 phần tử 12,5-12,8 px (tên cung, sao phụ, can cung). Chọn gói 5 (nhãn "Khuyên dùng" 12,8 px, "Quy tắc" 13,1 px); bài trả phí 16 (dòng "Căn cứ" 13,3 px); chân trang 13,6 px. 375/390px. Ảnh `anh/mobile-c1-nu-1995-02-la-so.png`, `anh/mobile-c1-nu-1995-06-bai-dau.png`.

**LOI-06 NÊN SỬA Ô bấm nhỏ hơn 40 px trên điện thoại.** Radio Nữ/Nam, Dương/Âm lịch và giờ: ô 13x13 (nhãn kèm chữ có thể bấm nhưng vùng thật nhỏ, cần kiểm vùng label); mũi tên đổi năm ‹ › 27x36; ô tick 22x22; logo "xemtuvi.vn" 122x29; liên kết "Trợ giúp" 54x18 ở chân trang mọi trang. 375/390px. Ảnh `anh/mobile-c1-nu-1995-01-trang-chu.png`.

**LOI-07 NÊN SỬA Độ dài tab không đều, tab Tài chính của một lá số chỉ 961 ký tự (lá số có Mệnh Cự Môn) so với 3600-5400 ký tự ở lá số khác, và nhiều tab dựa trên câu mẫu chung.** Tab Tài chính gần như chỉ hai đoạn "Cung hợp chiếu" và "Tứ hóa". Cần Thư chấm bảng 25 điểm (điều kiện 2 chưa chấm được, em không chấm thay Thư). Ảnh tab xem `bai-1.md`..`bai-3.md`.

**LOI-08 NÊN SỬA Nội dung tab đôi chỗ mâu thuẫn trong cùng bài.** Lá số 3 (bai-2.md), tab Vận 10 năm: đoạn đầu nói Không Kiếp làm giảm lợi Lộc Tồn, đoạn sau nói Không Kiếp "đắc địa, mưu sự thành nhanh"; tab Gia đạo vừa "trợ lực" vừa "nhiều biến đổi" và lặp câu Địa Kiếp ba lần. Lá số 4 (bai-3.md), tab Sự nghiệp: vừa "có dáng dấp thế Cơ Nguyệt Đồng Lương" vừa "thế Nhật Nguyệt" nhưng "chưa thể coi là cách vững". Chuyển Thư/Hạnh.

### NHỎ
**LOI-09 NHỎ** Ô chọn lá số ghi "Lá số 1..4" không kèm ngày sinh (phần phụ của LOI-01, nếu LOI-01 sửa xong thì thôi).
**LOI-10 NHỎ** Chưa kiểm hiển thị ô "giữ ngày sinh cũ" khi chọn 23 giờ trên 375px (chưa đủ bằng chứng), đề nghị Mai rà.
**LOI-11 NHỎ** Tab "Vận năm 2027" ở gói Trọn lá số hiện bản khóa kèm hộp "Hỏi về lá số của bạn" cũng khóa; khách đã trả tiền gói Trọn lá số có thể thắc mắc vì sao vẫn bị khóa. Ảnh cùng trang LOI-01.

## Điều kiện chặn (kết luận)
1. Lỗi chặn luồng: CÓ (LOI-01, mở sai bài đã mua).
2. Bài dưới ngưỡng Thư: CHƯA CHẤM (3 bài lưu ở bai-1..3.md).
3. Câu gây sợ / ép mua: KHÔNG thấy.
4. Tải >3 s nguội: CÓ (LOI-02, trang chủ; các trang khác 2,3-2,9 s).
Đề nghị: chặn ra mắt cho tới khi sửa LOI-01 và LOI-02, báo Minh.

## Hạn chế
- "Lần nguội" = context mới/cache trống; không khởi động lại server nên chưa đo cold start phía máy chủ.
- Chưa kiểm Việt kiều (LOI-03). Tài khoản thử đã có thêm 3 lá số/đơn giả lập do lần kiểm này.
- Không chấm độ đúng của từng nhận định luận giải (việc của Thư).
