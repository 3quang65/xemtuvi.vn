# Phiếu kiểm duyệt luận giải tự động, đợt 3 (việc L-09de0f)

- Người chấm: Thư (kiểm duyệt), theo skill `kiem-duyet-noi-dung`. Ngày 31/10/2026.
- Đối tượng: 10 bản trong `docs/luan-giai/mau-3/`, sinh bằng `node scripts/luan-giai/sinh-mau.cjs mau-3 10` (stub, cùng 10 lá số với mau-1, mau-2), đúng nội dung khách nhận theo cấu hình mặc định hiện tại. Đã chờ T-32e9e2 (Hạnh) và T-3afcc0 (Bảo): cả hai `done`.
- Thang chấm: giữ nguyên đợt 2 (4 tiêu chí, mốc trừ cố định). Ngưỡng đạt: TB ≥ 7,5; không tiêu chí nào < 6; Sâu ≥ 6; An toàn = 10.
- Số đo máy: `node scripts/luan-giai/dem-sao-bo-sot.cjs docs/luan-giai/mau-3` (đối chiếu mau-2 sinh lại cùng lúc).

## Kết luận

**Không đạt để thu tiền.** TB chung **7,03/10** (Đúng 6,7 · Sâu 5,7 · Giọng 5,7 · An toàn 10), tăng từ 6,68 ở đợt 2. Ba điều kiện chưa đạt: TB < 7,5; Sâu 5,7 < 6; Giọng 5,7 < 6. Chỉ bản 08 chạm 7,50; hai bản dưới 7,0 (02: 6,75; 06: 6,50), không bản nào dưới 6.

Tiến bộ thật: Đúng +0,8 (hết câu sai nghĩa cung kiểu "Quan Lộc … tính cách"; Hỏa Tham, Nhật Nguyệt, Sát Phá Tham nêu đúng lý do phá cách theo độ sáng; vô chính diệu mượn đúng tên sao đối diện và nói đúng về Triệt; có dung hòa Tuần/Triệt với hóa ở bản 01, 08); câu hợp chiếu có lời khuyên cụ thể theo chuyên đề (không còn "bổ sung xu hướng" trần).

Điểm nghẽn lớn nhất không nằm ở câu chữ mà ở cấu hình: **lớp Tóm lại/gộp sao/dung hòa (L-28bc46) đang tắt mặc định** (`tongHop` mặc định false trong `src/lib/luan-giai/ai/index.ts:89`), nên **0/10 bản có đoạn Tóm lại**. Đây là lý do Sâu không vượt 6 (mốc: thiếu tổng hợp thì tối đa 6). Chưa chấm bản bật `tongHop` vì đó không phải nội dung khách nhận hiện nay.

## 1. Bảng điểm

| Bản | Chuyên đề | Đúng | Sâu | Giọng | An toàn | **TB** | Đợt 2 |
|---|---|---|---|---|---|---|---|
| 01 | Mệnh (Tham Lang Đ Hóa Kỵ, Tuần, Hỏa Tinh) | 6 | 6 | 6 | 10 | **7,00** | 7,00 |
| 02 | Quan Lộc (Thiên Đồng Đ), lá số 2023 | 7 | 5 | 5 | 10 | **6,75** | 6,75 |
| 03 | Phu Thê (Tham Lang H tại Tý, Đào Hoa) | 6 | 6 | 6 | 10 | **7,00** | 6,75 |
| 04 | Mệnh (Tử Vi B), lá số 2020 | 7 | 6 | 6 | 10 | **7,25** | 7,00 |
| 05 | Quan Lộc (Thiên Cơ Đ Hóa Lộc) | 7 | 5 | 6 | 10 | **7,00** | 6,75 |
| 06 | Phu Thê (Thiên Cơ V, Tuần), lá số 2023 | 7 | 5 | 4 | 10 | **6,50** | 6,25 |
| 07 | Mệnh (Tử Vi Đ + Phá Quân V Hóa Quyền) | 6 | 6 | 6 | 10 | **7,00** | 6,50 |
| 08 | Quan Lộc (vô chính diệu, Triệt) | 7 | 7 | 6 | 10 | **7,50** | 6,00 |
| 09 | Phu Thê (Thái Âm M Hóa Lộc, Tuần) | 7 | 6 | 6 | 10 | **7,25** | 7,00 |
| 10 | Mệnh (Thiên Tướng Đ, Triệt, Địa Kiếp) | 7 | 5 | 6 | 10 | **7,00** | 6,75 |
| **TB** | | **6,7** | **5,7** | **5,7** | **10** | **7,03** | 6,68 |

Ghi chú: cột Đợt 2 lấy theo phiếu `kiem-duyet-2.md` (một số điểm Đợt 2 đã chấm khi bộ ghép còn lỗi, nay đã sửa). Mốc áp như đợt 2; không nâng điểm để đạt.

## 2. Lý do từng bản

**Bản 01 (7,00).** Có Sát Phá Tham kèm lý do phá cách đúng (Tham Lang hóa Kỵ), có dung hòa Tuần với Hóa Kỵ (`KHUNG-menh-KY-ThamLang-Tuần`), có thế giáp Khoa–Quyền. Lỗi Đúng còn nguyên: "Tham Lang đồng cung Hỏa Tinh nhưng **Tham Lang chưa đủ sáng**" (`KHUNG-menh-CC-HoaThamLinhTham-Hoa-PHA`) trong khi lá số ghi Tham Lang (Đắc). Sâu 6: không có Tóm lại. Giọng 6: câu Tuần/Triệt còn dài.

**Bản 02 (6,75).** Lá số 3 tuổi (6/3/2023), chuyên đề Quan Lộc viết như cho người lớn ("chọn nghề dịch vụ, chăm sóc, giáo dục và đặt mục tiêu theo quý", `QL-S05-TOT`) nên Giọng tối đa 5. Sâu 5: không có mục Cách cục; Địa Kiếp (H) tại Quan Lộc và Địa Không (H) tại Tài Bạch là hai câu rời (`QL-PS-13`, `KHUNG-quan-loc-SP-ĐịaKhông-tam-hop`), không gộp thành thế Không Kiếp. Đúng 7: vị trí và độ sáng khớp.

**Bản 03 (7,00).** Hỏa Tham và Sát Phá Tham nêu đúng lý do phá cách theo độ sáng, có câu "cả ba sao đều hãm" (`KHUNG-phu-the-CC-SatPhaTham-DeuHam`), đây là điểm tiến bộ rõ nhất. Đúng 6: "Hỏa Tinh đồng cung Phu Thê: nhiệt huyết, phản ứng nhanh" (`PT-PS-10`) mở bằng nét tích cực cho sao hãm. Sâu 6: vẫn chưa gọi tên **Phiếm thủy đào hoa** (Tham Lang hãm tại Tý gặp Đào Hoa), Thiên Không tại Phu Thê bỏ sót.

**Bản 04 (7,25).** Có hai cách cục (Tử Phủ Vũ Tướng có khuyết, Không Kiếp chiếu), cặp Không Kiếp nay được gộp đúng. Sâu 6: bỏ qua chính tinh xung chiếu **Tham Lang (H) tại Thiên Di**; Tuần/Triệt đóng ngay trên Địa Kiếp/Địa Không nhưng không có câu dung hòa. Giọng 6: lá số 6 tuổi chuyên đề Mệnh còn lời khuyên người lớn ("bảo lãnh hoặc cho vay", `ML-S11-C3`); mốc hiện chỉ trừ Quan Lộc/Phu Thê nên giữ 6, ghi vào P2.

**Bản 05 (7,00).** Có Cơ Lương đúng chuyên đề. Sâu 5 (bản mỏng, 6 câu): bỏ qua Thiên Đồng (H) tại Mệnh và Cự Môn (H) tại Tài Bạch, Triệt đóng ngay trên Thiên Lương nhưng chỉ có câu Triệt chung, cách Cơ Lương không nói yếu đi vì Triệt, Hóa Quyền Thiên Lương không dung hòa với Triệt. Mã `QL-HOA-0` còn là câu chung.

**Bản 06 (6,50).** Lá số 3 tuổi, chuyên đề Phu Thê ("Cách yêu và gắn bó", "trong tình cảm, bạn…") nên Giọng tối đa 5, chấm 4 vì cả bài là lời khuyên hôn nhân cho trẻ. Sâu 5: không có Cách cục; Địa Không và Địa Kiếp (Đắc) ở Quan Lộc không được nhắc (máy báo bỏ sót); Thiên Đồng, Cự Môn (H) xung chiếu bị bỏ qua; Triệt cùng cung Hóa Quyền ở Thiên Di không dung hòa.

**Bản 07 (7,00).** Có Sát Phá Tham (có khuyết), Tử Phá, trợ lực Đà La. Đúng 6: hai câu nét tích cực cho sao hãm — "Kình Dương ở Tài Bạch … nghị lực mạnh, quyết liệt" (Kình hãm, `KHUNG-menh-SP-KìnhDương-tam-hop`) và "Liêm Trinh mang Hóa Lộc … mở thêm cơ hội" (Liêm Trinh hãm, Lộc hãm, `KHUNG-menh-HOA-Lộc-tam-hop`). Hóa Khoa Vũ Khúc nằm cùng Tuần ở Tài Bạch nhưng không có dung hòa.

**Bản 08 (7,50).** Bản tốt nhất, tăng +1,5. Quan Lộc vô chính diệu mượn đúng Thiên Đồng, Cự Môn, nói đúng "vô chính diệu gặp Triệt là thuận hơn" (`KHUNG-quan-loc-VCD-chinh-Triet`), có Nhật Nguyệt kèm điều kiện, Lộc đồng cung Kiếp, dung hòa Tuần–Kỵ (`DH-Tuần-Ky`), Lộc–Kỵ, Khoa–Kỵ. Đúng 7: Hóa Khoa trên Thiên Đồng (H) còn tả đầy đủ. Giọng 6: Địa Không và Thiên Không cùng cung là hai câu rời; câu Tuần/Triệt dài. Chưa có Tóm lại.

**Bản 09 (7,25).** Hai cách cục Cơ Nguyệt Đồng Lương và Nhật Nguyệt theo đúng chuyên đề Phu Thê. Sâu 6 (giữ như đợt 2): **Hóa Lộc ngay Thái Âm tại Phu Thê không được nhắc**, Tuần đóng cùng cung không dung hòa với Lộc; Triệt đóng cùng cung Hóa Quyền ở Phúc Đức cũng không; Thiên Không tại Quan Lộc, Lộc Tồn tại Thiên Di bỏ sót.

**Bản 10 (7,00).** Có Tử Phá kèm điều kiện, vô chính diệu mượn Liêm Trinh, Tham Lang. Sâu 5: Địa Kiếp đồng cung Mệnh với Triệt không có câu dung hòa; Địa Kiếp (Mệnh) và Địa Không (Tài Bạch) là hai câu rời, không thành thế Không Kiếp; chưa nói Triệt làm Thiên Tướng yếu đi.

## 3. So sánh với đợt 2

| Chỉ số | Đợt 2 (mau-2) | Đợt 3 (mau-3) |
|---|---|---|
| TB / Đúng / Sâu / Giọng / An toàn | 6,68 / 5,9 / 5,4 / 5,4 / 10 | **7,03 / 6,7 / 5,7 / 5,7 / 10** |
| Số câu (10 bản) | 140 | 128 |
| Sao quan trọng bỏ sót | 6/66 (9%) | 6/66 (9%), cùng các sao Thiên Không, Không Kiếp, Lộc Tồn, Hóa Lộc |
| Câu khuôn "ảnh hưởng đến …:" | 23% | 25% |
| Đuôi "mỗi người cảm nhận khác nhau" | 6% | 7% |
| "Thái Thúc", "góp thêm sắc thái", "Độ sáng tốt, nên phát huy chủ động" | 0 | 0 |
| Bản có mục Cách cục | 8/10 | 8/10 |
| Bản có Tóm lại | 0/10 | **0/10** (lớp tổng hợp tắt mặc định) |
| Bản có câu dung hòa Tuần/Triệt với hóa | ít (không đếm) | 2/10 (01, 08) |
| Bản dưới 6,5 | 06, 08 | không |

Lưu ý: số bỏ sót mau-2 trong skill ghi 0% là số cũ; sinh lại mau-2 hôm nay ra 6/66, bằng mau-3, tức phần bỏ sót không đổi giữa hai đợt.

## 4. Top lỗi còn lại

| # | Lỗi | Tần suất | Mã tiêu biểu | Ảnh hưởng tới việc trả tiền |
|---|---|---|---|---|
| 1 | Không có đoạn Tóm lại, không gộp sao cùng cung (lớp `tongHop` tắt) | 10/10 bản | `src/lib/luan-giai/ai/index.ts:89`, mục "Tóm lại" không xuất hiện | **Rất cao.** Là lý do duy nhất giữ Sâu ≤ 6; bật lên có thể đưa TB vượt 7,5. |
| 2 | Tuần/Triệt đóng cùng cung với hóa hay sát tinh nhưng không có câu dung hòa (chỉ có `DH-Tuần-Ky` ở 01, 08) | 05, 06, 07, 09, 10 | `KHUNG-menh-HOA-Khoa-tam-hop` (07), `KHUNG-phu-the-HOA-Quyền-tam-hop` (06, 09), `ML-PS-13` + `ML-TT-TRIỆT` (10) | Cao. Lời luận trái với tác động của Tuần/Triệt. |
| 3 | Chính tinh hãm ở cung xung chiếu/tam hợp bị bỏ qua (chỉ nêu sao sáng) | 04 (Tham Lang), 05 (Đồng, Cự), 06 (Đồng, Cự), 07 (Liêm, Tham) | `ML-S*-C*`, `QL-S*-C*` chưa có C-HAM | Cao. Bài chỉ khen, bỏ mặt cần chú ý. |
| 4 | Sao hãm mở bằng nét tích cực | 03 `PT-PS-10`, 07 `KHUNG-menh-SP-KìnhDương-tam-hop`, `KHUNG-menh-HOA-Lộc-tam-hop`, 08 `KHUNG-quan-loc-HOA-Khoa-xung` | | Cao (Đúng ≤ 6). |
| 5 | Lá số trẻ em viết như cho người lớn | 02, 04, 06 | `QL-S05-TOT`, `PT-S02-TOT`, `ML-S11-C3` | Cao. Phụ huynh xem lá số con. |
| 6 | Câu phá cách "chưa đủ sáng" khi sao Đắc | 01 | `KHUNG-menh-CC-HoaThamLinhTham-Hoa-PHA` | Trung bình: sai so với lá số khách đang xem. |
| 7 | Thiếu cách: Phiếm thủy đào hoa (03), Tam Hóa (09), Không Kiếp rời (02, 06, 10) và Hóa Lộc Phu Thê bỏ sót (09) | 5 bản | | Trung bình. |
| 8 | Câu khuôn dài: Tuần/Triệt ~60 chữ, "ảnh hưởng đến …:" 25%, "mỗi người cảm nhận khác nhau" 7% | 10/10 | `KHUNG-*-TUAN-*`, `KHUNG-*-TRIET-*`, `KHUNG-*-SP-*` | Trung bình (Giọng). |

## 5. Đề xuất sửa (xếp ưu tiên)

| Ưu tiên | Việc | Người làm | Nghiệm thu |
|---|---|---|---|
| P0 | Bật `tongHop` mặc định cho bài trả phí (sau khi rà các câu Tóm lại chưa có mã quy tắc thật), rồi sinh lại `mau-4` | **Bảo** (cấu hình, cache), **Hạnh** (rà câu Tóm lại) | 10/10 bản có mục "Tóm lại" 2–3 câu; Thư chấm lại: Sâu ≥ 6, TB ≥ 7,5 |
| P0 | Dung hòa Tuần/Triệt khi đóng cùng cung với hóa hay sát tinh (cung chính và cung hợp chiếu): mở rộng `DH-*` ngoài Tuần–Kỵ | **Hạnh** viết câu, **Bảo** điều kiện ghép | Bản 05, 06, 07, 09, 10 có câu dung hòa tương ứng, không áp sai cung |
| P1 | Thêm nhánh C-HAM cho câu hợp chiếu chính tinh hãm (Tham Lang, Cự Môn, Thiên Đồng, Liêm Trinh); đổi câu khen sao hãm ở `PT-PS-10`, Kình Dương, Hóa Lộc/Hóa Khoa trên sao hãm sang mặt cần chú ý | **Hạnh** | Bản 03, 04, 05, 06, 07 không còn câu hãm tả như sáng; Đúng ≥ 7 |
| P1 | Sửa điều kiện câu "chưa đủ sáng" (Hỏa Tham với Tham Lang Đắc) | **Hạnh**, **Bảo** | Bản 01 không còn câu trái lá số |
| P1 | Thêm cách Phiếm thủy đào hoa, Tam Hóa hội; nhận cặp Không Kiếp khi hai sao ở hai cung khác nhau; nhắc Hóa Lộc/Thiên Không bỏ sót | **Hạnh**, **Bảo** | Script: bỏ sót ≤ 3% |
| P2 | Giọng lá số dưới 15 tuổi: mở rộng mốc sang chuyên đề Mệnh; Minh quyết ẩn chuyên đề Phu Thê/Quan Lộc hay viết lời cho phụ huynh | **Hạnh** (giọng), **Bảo** (điều kiện tuổi), Minh quyết | Bản 02, 04, 06 Giọng ≥ 6 |
| P2 | Rút gọn Tuần/Triệt ≤ 35 chữ, bỏ đuôi "mỗi người cảm nhận…", giảm "ảnh hưởng đến …:" xuống ≤ 10% | **Hạnh** | Script cột khuôn ≤ 10% |

Bước tiếp theo: xong hai việc P0 thì sinh `mau-4` (cùng 10 lá số), chạy `dem-sao-bo-sot.cjs`, rồi Thư chấm theo skill. Chưa mở bán luận giải trả phí.
