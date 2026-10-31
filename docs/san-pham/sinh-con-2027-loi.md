# Lời hiển thị: công cụ "Sinh con 2027 hợp bố mẹ"

Phiên bản: 31/10/2026 · Người soạn: luan-giai (Nghiên cứu Tử vi) · Việc: L-7df60f · Trạng thái: **bản nháp, chờ Thư duyệt**
Đầu vào: `docs/san-pham/sinh-con-2027-quy-tac.md` (mục 0, 2, 3, 4, 5, 8). Tài liệu này chỉ viết lời; không đổi cách tính.
Mã quy tắc dùng trong tài liệu: `SC27-A…` = tiêu chí A (quy tắc mục 2), `SC27-B…` = tiêu chí B (mục 3), `SC27-M…` = ba mức (mục 5). Trường phái: can chi – ngũ hành chung, không phải Tử Vi Đẩu Số (quy tắc mục 0).

Nguyên tắc lời (áp cho mọi phần dưới): giọng nghiêm túc, gần gũi, viết cho bố mẹ 25–40 tuổi; không dọa, không hứa hẹn; không nói về sức khỏe, tính cách, giới tính hay tương lai của bé; mức chỉ dùng cho cả gia đình, không gắn mức cho từng người.

## 1. Lời cho ba mức (hiện sau tiêu đề mức)

| Mã | Mức | Điều kiện | Lời hiển thị |
|---|---|---|---|
| SC27-M1 | **Thuận** | T ≥ 2 | Theo can chi năm sinh, tuổi bố mẹ và năm Đinh Mùi 2027 có nhiều điểm tương hợp. Đây là một góc tham khảo văn hóa, chỉ dựa trên năm sinh. Điều làm nên một năm đón bé trọn vẹn vẫn là sự sẵn sàng và gắn bó của cả nhà. |
| SC27-M2 | **Cân bằng** | −1 ≤ T ≤ 1 | Tuổi bố mẹ và năm Đinh Mùi 2027 có điểm hợp, có điểm khác nhịp, cân bằng như phần lớn các gia đình. Đây là tham khảo văn hóa theo năm sinh, không nói lên điều gì về bé. Năm nào đón con cũng có những điều đáng mong chờ riêng. |
| SC27-M3 | **Khác nhịp** | T ≤ −2 | Theo can chi, tuổi bố mẹ và năm Đinh Mùi 2027 khác nhịp ở vài điểm. Đây chỉ là một lớp tham khảo văn hóa theo năm sinh; rất nhiều gia đình như vậy vẫn gắn bó, vui vầy. Muốn hiểu mình rõ hơn, bố mẹ có thể xem lá số theo ngày giờ sinh của từng người. |

Số chữ (đếm bằng `wc -w`): Thuận 51, Cân bằng 51, Khác nhịp 58 — đều ≤ 60.

## 2. Dòng quan hệ cho từng người (không gắn mức)

Ghép một dòng cho bố, một dòng cho mẹ theo mẫu:

> **{Bố|Mẹ}** · {năm dương} – {Can Chi} · mệnh {tên nạp âm}: {câu A}; {câu B}.

Ví dụ (ca 3, quy tắc mục 8): **Bố** · 1990 – Canh Ngọ · mệnh Lộ Bàng Thổ: tuổi Ngọ lục hợp với tuổi Mùi của bé; Thổ khắc Thủy, một điểm khác nhịp theo vòng ngũ hành.

### 2.1. Câu A: quan hệ địa chi với Mùi (quy tắc mục 2)

| Mã | Chi bố/mẹ | Câu A |
|---|---|---|
| SC27-A1 | Hợi, Mão | tuổi {Hợi\|Mão} cùng nhóm tam hợp Hợi – Mão – Mùi với bé |
| SC27-A2 | Ngọ | tuổi Ngọ lục hợp với tuổi Mùi của bé |
| SC27-A3 | Sửu | tuổi Sửu và tuổi Mùi là cặp lục xung, hai chi đối diện nhau trên vòng 12 con giáp |
| SC27-A4 | Mùi | cùng tuổi Mùi với bé, theo can chi không tính hợp hay xung |
| SC27-A5 | Tý, Dần, Thìn, Tỵ, Thân, Dậu, Tuất | tuổi {Chi} không thuộc nhóm hợp hay xung với tuổi Mùi |

Nguồn: Wikipedia tiếng Trung mục 地支; Master Sean Chan (trang tam hợp, lục hợp, lục xung); spec an sao mục 5.10 (nhóm tam hợp) — theo quy tắc mục 2.

### 2.2. Câu B: ngũ hành nạp âm với Thiên Hà Thủy của bé (quy tắc mục 3)

| Mã | Hành nạp âm bố/mẹ | Câu B |
|---|---|---|
| SC27-B1 | Kim | Kim sinh Thủy, mệnh {bố\|mẹ} sinh ra mệnh Thiên Hà Thủy của bé theo vòng tương sinh |
| SC27-B2 | Mộc | Thủy sinh Mộc, mệnh Thiên Hà Thủy của bé và mệnh {bố\|mẹ} có quan hệ tương sinh |
| SC27-B3 | Thủy | cùng hành Thủy với bé, quan hệ bình hòa |
| SC27-B4 | Thổ | Thổ khắc Thủy, một điểm khác nhịp theo vòng ngũ hành |
| SC27-B5 | Hỏa | Thủy khắc Hỏa, một điểm khác nhịp theo vòng ngũ hành |

Nguồn: bảng nạp âm spec an sao mục 3.1; chu trình sinh khắc Wikipedia "Wuxing (Chinese philosophy)" và "Ngũ hành" — theo quy tắc mục 3. Ghi chú lời: giữ thuật ngữ "khắc" vì là tên gọi đúng của quan hệ, đi kèm "khác nhịp" để khách không hiểu thành điều xấu; không thêm diễn giải nào ngoài quan hệ hành.

## 3. Câu ghi rõ trường phái (hiện ngay dưới kết quả, chữ nhỏ)

> Kết quả được tính tự động theo năm sinh, dựa trên lý thuyết can chi – ngũ hành chung, **không phải phép an sao Tử Vi Đẩu Số**; muốn hiểu sâu từng người, cần lá số lập theo ngày giờ sinh.

## 4. Lời mời cuối (hiện ở cả ba mức, chọn một trong hai biến thể)

| Mã | Biến thể | Dòng dẫn | Nút |
|---|---|---|---|
| SC27-C1 | Lập lá số | Năm sinh chỉ là lớp ngoài cùng. Lá số Tử Vi theo ngày giờ sinh giúp bạn hiểu mình rõ hơn: điểm mạnh, cách mình yêu thương và chăm lo cho gia đình. | Lập lá số miễn phí |
| SC27-C2 | Vận 2027 | Năm Đinh Mùi 2027 mở ra những gì cho riêng bố, riêng mẹ? Xem Vận 2027 lập theo lá số ngày giờ sinh của từng người. | Xem Vận 2027 của bố mẹ |

Gợi ý dùng: mặc định SC27-C1; SC27-C2 dùng khi chạy mùa Vận 2027 hoặc thử A/B (Quân đo).

## 5. Ghi chú năm sinh và ngày Tết (quy tắc mục 0, 4)

- **Bé sinh 01/01–05/02/2027** (hiện dưới ô chọn hoặc khi khách hỏi):
  > Bé chào đời từ 01/01 đến 05/02/2027 thuộc năm Bính Ngọ, vì Tết Đinh Mùi rơi vào ngày 06/02/2027. Công cụ này dành cho bé sinh từ 06/02/2027 đến 25/01/2028.
- **Bố/mẹ sinh tháng 1–2 dương lịch, bỏ qua ô ngày tháng** (hiện cạnh can chi đã dùng):
  > Kết quả đang tính theo năm dương lịch bạn nhập. Nếu sinh trước Tết năm đó, tuổi âm lịch của bạn thuộc năm trước và kết quả có thể khác: hãy nhập ngày tháng sinh để công cụ tính đúng.
- Luôn hiện lại can chi đã dùng ("Mẹ: 1991 – Canh Ngọ (sinh trước Tết)") để khách tự kiểm (quy tắc mục 4, bước 3).

## 6. Cần Thư duyệt

1. Lời ba mức và CTA: giọng, độ an toàn, không hứa hẹn.
2. Câu B4, B5 giữ chữ "khắc": đúng thuật ngữ, cần Thư xác nhận mức an toàn.
3. Nguồn sách cổ cho hợp/xung, sinh khắc vẫn **chưa kiểm chứng** (quy tắc mục 7.4); trang khách không nêu tên sách cổ.
