# Phiếu kiểm duyệt: Kiểm chứng năm đã qua (2025, 2026)

Người duyệt: Thư (kiem-duyet), 31/10/2026. Đối tượng: `docs/san-pham/kiem-chung-mau.md` (nhánh `hanh-l-20205f`, commit 2673daa, người viết Hạnh). Skill: `kiem-duyet-noi-dung` (Đúng/Sâu/Giọng/An toàn). Thư không sửa nội dung; trả Hạnh sửa rồi nộp lại.

## 1. Kết luận

**KHÔNG ĐẠT.** TB 6,75. Đúng 5 · Sâu 6 · Giọng 8 · An toàn 8.
Lý do trượt: Đúng < 6 (ghi sai trường phái ở hai câu dùng cho mọi khách), An toàn < 10 (Tật Ách nói "sức khỏe" trái chính quy tắc 5 của bài; nhãn thiếu câu "tham khảo, không thay lời khuyên chuyên môn"), TB < 7,5.
Những điểm đạt so với trọng tâm duyệt: không có câu khẳng định sự kiện; không có câu ai đọc cũng đúng (câu nào có nhận định cũng gắn cung); không có từ mê tín, gây sợ; M7 không ép mua; nhãn có dòng "do hệ thống tự động tạo" và tách lớp năm với lớp gốc.

Bảo **chưa** chép vào `MAU_CAU`, `CHU_DE_CUNG`, `KIEM_CHUNG_NHAN`; giữ `KIEM_CHUNG_CAU_TAM = true` cho tới khi có phiếu đạt.

## 2. Lỗi theo tiêu chí (trích câu + mã quy tắc)

### Đúng: 5/10 (có câu sai nguồn và chỗ tự mâu thuẫn, nên tối đa 5)

| # | Vị trí | Trích | Lỗi | Mã |
|---|---|---|---|---|
| Đ1 | M2 (mục 2.1, dòng 29) | "Theo cách xem năm của phái Việt, những chuyện về {chủ đề cung} thường được bạn để tâm…" | **Ghi sai trường phái (lỗi nặng).** Sách Việt (TB, KL) lấy **cung tiểu hạn** làm cung năm chính. Lấy Lưu Thái Tuế làm trọng điểm năm là **quy ước của xemtuvi.vn**. NAM-TRANH-01 cấm viết thẳng "phái Việt lấy Lưu Thái Tuế làm trọng điểm". Câu này hiện ra ở mọi bài, mỗi bài hai lần (2025, 2026). | NAM-TRANH-01, NAM-TT-01 |
| Đ2 | M3 (dòng 30) | "…trên lá số của bạn là cung {cung Lưu Thái Tuế}. Tam hợp phái Việt." | Cách tính cung (chi trùng chi năm) đúng SPEC 7.3. Sai ở nhãn "Tam hợp phái Việt" đặt cạnh việc **chọn cung này làm trọng điểm**: đó là quy ước sản phẩm. Lưu ý: SPEC 7.3 câu "cung lưu niên chính ở phái Việt" mâu thuẫn với NAM-TRANH-01, chưa ai đính chính (xem P1-3). | NAM-TRANH-01; SPEC 7.3 |
| Đ3 | Mục 1, lưu ý nguồn (dòng 18) và cột "Quy tắc" của M2, M4, M6 | "bộ quy tắc… chưa có mục riêng cho lưu niên… áp dụng tương tự VAN-CUNG-00… VAN-HOA-02" | **Căn cứ đã cũ.** `docs/luan-giai/van-nam/QUY-TAC.md` đã có nhóm NAM, có quy tắc riêng cho lưu niên: NAM-PP-07 (chủ đề năm theo tên cung Lưu Thái Tuế, đã chuyển từ VAN-CUNG-00, có ⚑ tổng hợp), NAM-HOA-03 (lưu Lộc "kích hoạt" cung, nguồn WV1 cùng VAN-HOA-02 đến 05), NAM-HOA-02 (ghi rõ lớp), NAM-TT-01. Không cần chờ Đức "mở nhóm NAM-…" nữa. Phải trích đúng mã NAM. VAN-HOA-02 nói về **10 năm** đại vận; áp nguyên văn cho năm là sai lớp (NAM-PP-06). | NAM-PP-07, NAM-HOA-03, NAM-PP-06 |
| Đ4 | Quy tắc 5 (dòng 13) và bảng 2.2, hàng Tật Ách (dòng 51) | Quy tắc: "Tật Ách chỉ nói 'nhịp sinh hoạt, cách đối diện áp lực'". Bảng ghi: "**sức khỏe**, nhịp sinh hoạt và cách bạn đối diện áp lực" | **Tự mâu thuẫn trong cùng tài liệu.** Khi ghép vào M2 hoặc M4, câu thành "những chuyện về sức khỏe… thường được bạn để tâm nhiều hơn" (Đ4 kéo theo lỗi An toàn A1). | VAN-CAM-04 |
| Đ5 | M4, M6 (dòng 31, 33) | "nên cơ hội và **sự suôn sẻ** dễ đến hơn" | Nghĩa lưu Lộc theo NAM-HOA-03 là "cơ hội, nguồn lợi", và còn tùy **tính sao bị hóa** (Thiên Đồng hãm thì "nhiều việc vụn", NAM-HOA-05). Bài không xét sao tọa thủ (dòng 5) nên viết "sự suôn sẻ" là quá tay. Chỉ nên giữ "cơ hội". | NAM-HOA-03, CHUNG-HOA-06 |
| Đ6 | tieuDe (dòng 71), M1, M7 | "Đối chiếu với **hai năm vừa qua**"; "năm bạn **đã sống**" | Năm Bính Ngọ kéo tới Tết Đinh Mùi 6/2/2027. Hôm nay và trong mùa bán 15/12–6/2/2027, năm 2026 **chưa qua**. Câu đúng với 2025, chưa đúng với 2026. | VAN-CAM-03 (không nói như sự đã rồi) |

Đã kiểm, không lỗi: Hóa Lộc can Bính vào Thiên Đồng, can Ất vào Thiên Cơ (SPEC 5.8). Lưu Thái Tuế 2025 ở Tỵ, 2026 ở Ngọ. M5 tách đúng lớp năm với lớp gốc (NAM-HOA-02).

### Sâu: 6/10

Theo NAM-CAM-03, phần xem trước miễn phí chỉ nêu chủ đề năm và một điểm thuận, nên không đòi tam phương hay cách cục. Trừ vì:
- S1. Bài chỉ đọc Lưu Thái Tuế, không nhắc **tiểu hạn**. NAM-PP-02, NAM-TRANH-01 yêu cầu ghi chú trường phái rằng xemtuvi.vn đọc cả hai cung. Không cần luận tiểu hạn ở đây, nhưng câu căn cứ phải nói đúng như vậy (gộp với Đ1, Đ2).
- S2. Năm 2025 không có câu Hóa Lộc lưu niên (M4 ghi "chỉ năm 2026"), trong khi dòng 5 nói code dùng Hóa Lộc lưu niên. Hai năm không cân nhau mà không có lý do. Cần ghi rõ lý do, hoặc thêm M4 cho 2025 (Thiên Cơ hóa Lộc).

### Giọng: 8/10

Câu ngắn, xưng "bạn", có lời mời tự đối chiếu, không phán. M7 chỉ mô tả nội dung. Trừ vì:
- G1. Hàng Tử Tức: "con cái hoặc người nhỏ tuổi bạn chăm lo…". Ghép vào M2 cho khách sinh viên 18–22 thì đọc thành "chuyện về con cái… thường được bạn để tâm", lạc người đọc. Nên đưa "dự án sáng tạo" lên trước, hoặc làm hai biến thể theo tuổi.
- G2. "bạn bè" có ở cả Huynh Đệ ("bạn bè đồng trang lứa") lẫn Nô Bộc ("bạn bè, đồng nghiệp"). Khách có hai năm rơi vào hai cung này sẽ đọc hai câu gần như trùng nhau.

### An toàn: 8/10 (phải là 10)

| # | Vị trí | Lỗi | Mã |
|---|---|---|---|
| A1 | Bảng 2.2, hàng Tật Ách, khi ghép vào M2, M4, M6 | Ra câu "cơ hội và sự suôn sẻ dễ đến hơn qua những chuyện về **sức khỏe**…" hoặc "chuyện về sức khỏe… được bạn để tâm nhiều hơn". Câu ngầm đoán tình trạng sức khỏe theo năm, trái quy tắc 5 của chính bài. | VAN-CAM-04, VAN-CUNG-08 |
| A2 | Nhãn `minhBach` (dòng 72) | Có "do hệ thống tự động tạo", nhưng **thiếu** vế bắt buộc: "mang tính tham khảo để hiểu mình, không thay lời khuyên chuyên môn (y tế, tài chính, pháp lý)". Nội dung có nhắc Tài Bạch (tiền) và Tật Ách (sức khỏe) nên vế này phải có. | NAM-CAM-04 |

Không có từ cấm (hạn, giải hạn, cúng, xui, tai họa, chắc chắn, nhất định) trong câu cho khách. Không lộ dữ liệu khách: ví dụ ở mục 2.3 dùng cung giả định.

## 3. Đề xuất sửa (người làm: Hạnh; Bảo chỉ chép khi có phiếu đạt)

| Ưu tiên | Việc | Nghiệm thu |
|---|---|---|
| P0-1 | Viết lại vế trường phái của M2, M3 (và câu `truongPhai` nếu nhắc tới). Ví dụ hướng: "xemtuvi.vn lấy cung Lưu Thái Tuế làm trọng điểm năm; sách Việt như Tân Biên, Khảo Luận lấy cung tiểu hạn làm cung năm chính". Thư không viết câu thay, chỉ nêu hướng. | grep "cách xem năm của phái Việt" trong bài ra 0; câu căn cứ khớp NAM-TRANH-01 |
| P0-2 | Hàng Tật Ách bỏ "sức khỏe", chỉ giữ nhịp sinh hoạt và cách đối diện áp lực, khớp quy tắc 5. Ghép thử Tật Ách vào M2, M4, M6 và dán ba câu kết quả vào bài. | 0 câu cho khách có chữ "sức khỏe"; ba câu ghép thử nằm trong bài |
| P0-3 | Bổ sung vế NAM-CAM-04 vào `minhBach` | Nhãn có đủ: do hệ thống tạo, tham khảo, không thay lời khuyên y tế, tài chính, pháp lý |
| P1-1 | Đổi cột "Quy tắc" sang mã NAM (NAM-PP-07, NAM-HOA-02, NAM-HOA-03, NAM-TT-01, NAM-CAM-03, NAM-CAM-04). Viết lại "Lưu ý nguồn" ở dòng 18: nhóm NAM đã có, các mã còn ⚑ tổng hợp thì giữ ⚑. | 0 mã VAN-HOA-02, VAN-CUNG-00 làm căn cứ trực tiếp cho câu năm |
| P1-2 | M4, M6: bỏ "sự suôn sẻ", chỉ giữ "cơ hội" | Câu khớp NAM-HOA-03 |
| P1-3 | Đức (qua Minh): đính chính SPEC 7.3 câu "cung lưu niên chính ở phái Việt" cho khớp NAM-TRANH-01 | SPEC và QUY-TAC không còn trái nhau |
| P2-1 | Năm 2026 chưa qua: đổi tieuDe, M1, M7 sao cho không nói 2026 là năm "đã qua", "đã sống"; hoặc ghi "năm nay" cho 2026 | Không câu nào coi 2026 là năm đã kết thúc |
| P2-2 | Giải thích hoặc bổ sung Hóa Lộc lưu niên cho 2025 (S2) | Có lý do ghi trong bài, hoặc có câu M4 cho 2025 |
| P2-3 | Tử Tức theo tuổi (G1); tách "bạn bè" giữa Huynh Đệ và Nô Bộc (G2) | Chủ đề 12 cung không trùng cụm từ |

Nộp lại: sửa trong cùng file, ghi commit mới, Thư duyệt lại các mục P0 và P1.
