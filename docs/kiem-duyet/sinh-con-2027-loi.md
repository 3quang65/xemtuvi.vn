# Phiếu kiểm duyệt: lời công cụ "Sinh con 2027 hợp bố mẹ"

Người duyệt: Thư (kiem-duyet) · Ngày: 31/10/2026 · Việc: L-7df60f · Bản duyệt: `docs/san-pham/sinh-con-2027-loi.md` @ 7530082 · Đối chiếu: `docs/san-pham/sinh-con-2027-quy-tac.md` @ 3689ec0 · Chuẩn: skill `kiem-duyet-noi-dung`

## Kết luận: ĐẠT

| Đúng | Sâu | Giọng | An toàn | TB |
|---|---|---|---|---|
| 9 | 7 | 8 | 10 | 8,5 |

Ngưỡng (nội dung miễn phí): An toàn = 10, Đúng ≥ 6, không tiêu chí < 6 → đạt cả. Không có lỗi chặn. Các mục KD-SC27-xx dưới đây là góp ý P1/P2, người viết quyết định có sửa trước khi giao Bảo hay không.

## Đối chiếu quy tắc (đã kiểm từng dòng)

- Tam hợp Hợi – Mão – Mùi (A1), lục hợp Ngọ – Mùi (A2), lục xung Sửu – Mùi, đối diện trên vòng 12 chi (A3), cùng chi Mùi = 0 (A4), 7 chi còn lại = 0 (A5): khớp mục 2. A5 nói "không thuộc nhóm hợp hay xung" là đúng; không nhắc tương hại Tý – Mùi, đúng mục 7.1.
- Ngũ hành với Thiên Hà Thủy: Kim sinh Thủy (B1), Thủy sinh Mộc (B2), bình hòa (B3), Thổ khắc Thủy (B4), Thủy khắc Hỏa (B5): khớp mục 3, đúng chiều sinh khắc.
- Ba mức: ngưỡng T ≥ 2 / −1..1 / ≤ −2 khớp mục 5; mức chỉ gắn cho cả gia đình, dòng từng người không gắn mức: đúng.
- Ví dụ ca 3 (Canh Ngọ 1990, Lộ Bàng Thổ): khớp mục 8.
- Ngày: Tết Đinh Mùi 06/02/2027, khoảng 06/02/2027 – 25/01/2028, bé sinh 01/01–05/02/2027 thuộc Bính Ngọ: khớp mục 0.
- Số chữ ba mức 51/51/58 (`wc -w`, Thư đếm lại khớp): đọc trên điện thoại khoảng 4–5 dòng, vừa một màn hình.
- "Lập lá số miễn phí": đúng với luồng hiện có (`src/app/moi/[ma]/page.tsx`).

## Hai điểm Hạnh nhờ xem riêng

1. **Chữ "khắc" ở B4/B5: CHẤP NHẬN.** Lý do: là tên đúng của quan hệ; câu chỉ nói hành với hành ("Thổ khắc Thủy"), không nói người khắc người; có "khác nhịp" đi kèm; mức gia đình vẫn do tổng điểm quyết định. Điều kiện giữ: không bao giờ viết dạng "mệnh mẹ/bố khắc bé", "khắc con", "con khắc cha mẹ" ở bất kỳ chỗ nào (lời, tooltip, bài SEO, CSKH). Bảo không ghép tên người vào trước/sau chữ "khắc".
2. **Không nêu tên sách cổ: ĐÚNG.** Phần hiển thị (mục 1–5) không có tên Tam Mệnh Thông Hội, Hiệp Kỷ Biện Phương Thư hay nguồn kinh điển nào. Dòng "Nguồn:" ở mục 2.1, 2.2 là ghi chú nội bộ, **không hiển thị** cho khách (Bảo lưu ý khi cài).

## Góp ý (không chặn)

| Mã | Mức | Vị trí | Trích | Lý do | Gợi ý hướng (Hạnh tự viết) |
|---|---|---|---|---|---|
| KD-SC27-01 | P1 | Mục 4, SC27-C2 | "định hướng rõ ràng cho một năm nhiều thay đổi" | Nửa câu khẳng định trước năm 2027 của khách "nhiều thay đổi" và hứa "rõ ràng"; lệch nhẹ nguyên tắc không hứa hẹn | Nói điều khách được xem (Vận 2027 theo lá số từng người), bỏ khẳng định về năm của khách |
| KD-SC27-02 | P2 | Mục 5, ghi chú bố/mẹ | "Nếu sinh trước Tết năm đó, kết quả theo năm trước." | Dễ hiểu nhầm là công cụ đã tự tính theo năm trước; thực tế đang tính theo năm dương | Nói rõ: sinh trước Tết thì tuổi âm là năm trước, kết quả đang hiện có thể chưa đúng; mời nhập ngày tháng |
| KD-SC27-03 | P2 | Mục 2, dòng từng người | B2 "nối nhau trên vòng tương sinh" so với B1 "mệnh bố sinh ra mệnh bé" | Hai câu cùng +1 nhưng B2 mơ hồ hơn; khách khó hiểu "nối nhau" là tốt | Giữ chiều trung tính nhưng nói rõ là quan hệ tương sinh |
| KD-SC27-04 | P2 | Mục 3, câu trường phái | — | Kết quả do hệ thống tính theo quy tắc; quy ước repo yêu cầu ghi rõ nội dung do hệ thống tạo cho luận giải AI. Công cụ này không dùng AI nên không bắt buộc, nhưng thêm "tính tự động" giúp minh bạch | Thêm vài chữ "tính tự động theo năm sinh" vào câu trường phái |
| KD-SC27-05 | P2 (cho Minh/Đức) | Quy tắc mục 5, tên mức | "Cần lưu ý" | Lời M3 đã an toàn, nhưng nhãn có thể khiến người mẹ đang mang thai hỏi "lưu ý điều gì?" mà lời không trả lời | Cân nhắc nhãn gần với lời hơn (ví dụ "Khác nhịp"); thuộc quy tắc, không phải lỗi của lời |

## Kiểm an toàn

Không có từ cấm (giải hạn, cúng, bùa, hóa giải, xung khắc nặng, đại kỵ), không phán "không nên sinh", không nói sức khỏe, tính cách, giới tính, tương lai của bé, không chọn tháng, không lộ dữ liệu khách (ví dụ dùng năm sinh mẫu). Ba mức đều có câu "tham khảo văn hóa, chỉ dựa trên năm sinh". → An toàn 10.

## Cập nhật 31/10/2026 (việc L-1e52ef): đọc trang thật như khách, chốt KD-SC27-05

Đã mở v3.xemtuvi.vn/sinh-con-2027 (main e1b2fa5) trên 390px và 1280px, nhập ca bố 1961 Tân Sửu + mẹ 1990 Canh Ngọ (mức thấp nhất).

| Hạng mục | Kết quả |
|---|---|
| Dòng "Nguồn:" | Không hiện trên trang (chỉ còn ở tài liệu nội bộ). ĐẠT |
| Chữ "khắc" | Chỉ xuất hiện dạng "Thổ khắc Thủy" / "Thủy khắc Hỏa" (hành với hành); không có "bố/mẹ khắc bé", "khắc con", "con khắc cha mẹ". ĐẠT |
| Mê tín | Không có giải hạn, cúng, bùa, chọn ngày giờ, phán tốt xấu cho bé; mọi mức có câu "tham khảo văn hóa". ĐẠT |
| KD-SC27-05 | **ĐỔI** nhãn "Cần lưu ý" thành **"Khác nhịp"** (không dấu "?"). |

Lý do đổi: lời M3 mở bằng "khác nhịp ở vài điểm" nên nhãn khớp lời, hết cảnh mẹ bầu hỏi "lưu ý điều gì?". Không thêm dấu "?": hai nhãn kia là trạng thái (Thuận, Cân bằng), dấu hỏi làm nhãn thành câu hỏi mà lời không trả lời và nghe lo hơn. "Khác nhịp" cũng đã dùng ở dòng từng người (B4, B5) nên giọng thống nhất.

Đã sửa: `src/lib/sinh-con-2027/loi.ts` (tieuDe), `docs/san-pham/sinh-con-2027-loi.md` (mục 1). Giữ nguyên mã nội bộ `can-luu-y` (sự kiện đo không đổi). Chưa sửa `sinh-con-2027-quy-tac.md` mục 5 và `sinh-con-2027-kiem.py` (còn nhãn cũ, thuộc Đức).
Lưu ý nhỏ không chặn: mức Cân bằng (M2) cũng có chữ "khác nhịp" trong lời; chấp nhận được vì đó là mô tả điểm, không phải nhãn.
