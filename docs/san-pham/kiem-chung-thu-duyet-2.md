# Phiếu kiểm duyệt lần 2: Kiểm chứng năm 2025 và năm 2026

Người duyệt: Thư (kiem-duyet), 31/10/2026. Đối tượng: `docs/san-pham/kiem-chung-mau.md` (nhánh `hanh-l-20205f`, commit 27f529d, người viết Hạnh). Đối chiếu phiếu lần 1 `docs/san-pham/kiem-chung-thu-duyet.md` (8f3fbea). Skill: `kiem-duyet-noi-dung`. Thư không sửa nội dung.

## 1. Kết luận

**ĐẠT.** TB 8,5. Đúng 9 · Sâu 7 · Giọng 8 · An toàn 10 (lần 1: TB 6,75; Đúng 5 · Sâu 6 · Giọng 8 · An toàn 8).
Đủ cả bốn điều kiện: TB ≥ 7,5; không tiêu chí nào < 6; Sâu ≥ 6; An toàn = 10.
Cả 3 mục P0 và 2/3 mục P1 đã xử lý. P1-3 (SPEC 7.3) thuộc Đức, không nằm trong câu cho khách nên không chặn.

Bảo **được** chép mục 2 vào `MAU_CAU`/`CHU_DE_CUNG` và mục 3 vào `KIEM_CHUNG_NHAN`, rồi đổi `KIEM_CHUNG_CAU_TAM = false`, với điều kiện nghiệm thu ở mục 4.

## 2. Đối chiếu từng mục phiếu lần 1

| Mục | Yêu cầu | Kết quả ở 27f529d | Trạng thái |
|---|---|---|---|
| P0-1 (Đ1, Đ2, S1) | Bỏ "phái Việt" khỏi vế trường phái M2, M3, `truongPhai` | M2: "xemtuvi.vn lấy cung này làm trọng điểm năm". M3 và `truongPhai` có đủ hai vế: quy ước xemtuvi.vn, còn sách Việt (Tân Biên, Khảo Luận) lấy cung tiểu hạn. Khớp mẫu câu trong NAM-TRANH-01. grep "phái Việt" trong câu cho khách = 0 (chỉ còn ở ví dụ không đạt dòng 77 và ghi chú cho Bảo dòng 41) | Đã xử lý |
| P0-2 (Đ4, A1) | Tật Ách bỏ "sức khỏe"; ghép thử M2, M4, M6 | Hàng Tật Ách: "nhịp sinh hoạt, cách bạn nghỉ ngơi và đối diện áp lực". Ba câu ghép thử nằm ở mục 2.3, không có câu nào đoán tình trạng cơ thể. "sức khỏe" chỉ còn ở quy tắc và ví dụ không đạt | Đã xử lý |
| P0-3 (A2) | Thêm vế NAM-CAM-04 vào `minhBach` | Đủ các vế: do hệ thống tự động tạo, tham khảo để hiểu mình, không thay lời khuyên chuyên môn (y tế, tài chính, pháp lý) | Đã xử lý |
| P1-1 (Đ3) | Cột Quy tắc chuyển sang mã NAM, viết lại "Lưu ý nguồn" | M2 đến M7 trích NAM-TT-01, PP-07, HOA-02, HOA-03, PP-02, TRANH-01, TRANH-05, CAM-03. Không còn VAN-CUNG-00 hay VAN-HOA-02 làm căn cứ trực tiếp. Mã nào có ⚑ (PP-07) thì vẫn giữ ⚑. Đã đối chiếu từng mã với `docs/luan-giai/van-nam/QUY-TAC.md`: mã có thật và đúng nghĩa | Đã xử lý |
| P1-2 (Đ5) | Bỏ "suôn sẻ" | M4, M6 chỉ còn "cơ hội", khớp NAM-HOA-03 | Đã xử lý |
| P1-3 | Đức đính chính SPEC 7.3 | `docs/nghien-cuu/tuvi-an-sao-spec.md` dòng 617 vẫn ghi "cung lưu niên chính ở phái Việt", trái NAM-TRANH-01 | **Còn mở** (Đức, qua Minh; không chặn) |
| P2-1 (Đ6) | 2026 chưa qua | Tiêu đề, M1, M7, `minhBach` dùng "năm 2025 và năm 2026", "đã và đang trải qua", "kéo đến Tết 6/2/2027". Không câu nào nói 2026 là năm "đã qua", "vừa qua" hay "đã sống" | Đã xử lý |
| P2-2 (S2) | Hóa Lộc cho 2025 | M4 dùng cho cả hai năm, có ghi lý do (NAM-CAM-03, cân hai năm) | Đã xử lý |
| P2-3 (G1, G2) | Tử Tức theo tuổi; tách "bạn bè" | Tử Tức đưa "dự án sáng tạo" lên trước, bỏ chữ "con cái". "bạn bè" chỉ còn ở Nô Bộc, Huynh Đệ đổi thành "những người ngang hàng cùng bạn hợp tác" | Đã xử lý |

## 3. Kiểm thay đổi mới

| Thay đổi | Kiểm | Kết luận |
|---|---|---|
| M4 dùng cho 2025 | SPEC bảng 5.8 (dòng 455–456): Ất thì Hóa Lộc vào Thiên Cơ, Bính thì Hóa Lộc vào Thiên Đồng, khớp bài. Code tạm (nhánh `tung-l-3ce483`, `kiem-chung.ts` dòng 51–52) lấy `ln.luuTuHoa` trong vòng lặp theo năm và chỉ chặn bằng `i === NAM_KIEM_CHUNG.length - 1`. Ghi chú cho Bảo mô tả đúng chỗ phải bỏ | Đúng. Mỗi năm chỉ có chủ đề năm và một điểm thuận, nằm trong NAM-CAM-03 |
| "năm nay, đang diễn ra" | Quy ước ở dòng 7: 2025 là "đã qua", 2026 là "năm nay/đang diễn ra". Câu cho khách dùng "đã và đang trải qua" và "kéo đến Tết 6/2/2027" (Tết Đinh Mùi 6/2/2027, khớp hồ sơ dự án) | Đúng. Sau Tết 2027 câu vẫn đúng vì có vế "đã" |
| NAM-TRANH-05 ở M5 | Câu M5: "sách Việt như Tân Biên, Khảo Luận không dùng lớp này". QUY-TAC NAM-TRANH-05 ghi "ba sách Việt đã đối chiếu không dùng lưu tứ hóa" | Đúng nguồn. Câu nói rộng hơn nguồn một chút ("sách Việt như…" so với "ba sách đã đối chiếu"), nhưng có nêu tên sách nên chấp nhận |
| M3 "Bài Vận 2027 đọc cả hai cung" | `src/lib/luan-giai/ai/van-nam.ts` dòng 409, 414, 477 có xét `tieuHan` cùng `luuThaiTue` | Khớp NAM-PP-02, là câu mô tả, không ép mua |

## 4. Điểm trừ còn lại (không chặn đạt) và điều kiện nghiệm thu cho Bảo

Đúng 9: P1-3 còn mở. Nhãn "Căn cứ" trong code tạm vẫn có "tam hợp phái Việt" (`NGUON`, dòng 33 và 56). Phần này Bảo phải thay khi chép.
Sâu 7: theo NAM-CAM-03 đây là phần xem trước nên không đòi tam phương hay cách cục. Đã nhắc tiểu hạn và đã cân hai năm.
Giọng 8: còn 3 lỗi nhỏ, chuyển Hạnh làm ở P2.

| Ưu tiên | Người | Việc | Nghiệm thu |
|---|---|---|---|
| Điều kiện chép | Bảo | Chép nguyên văn M1 đến M7, bảng 2.2 và nhãn mục 3. Xóa hằng `NGUON` và câu `canCu` có "tam hợp phái Việt", thay bằng M3, M5. Bỏ điều kiện `i === NAM_KIEM_CHUNG.length - 1` | grep "phái Việt" trong `kiem-chung.ts` và `kiem-chung-noi-dung.ts` ra 0. Một lá số thử hiện M2, M3, M4, M5 cho cả 2025 và 2026. Phúc chụp màn hình gửi Thư soát câu thật trên site thử |
| P1-3 | Đức (qua Minh) | Đính chính SPEC 7.3 dòng 617 | SPEC không còn câu "cung lưu niên chính ở phái Việt" |
| P2-4 (G3) | Hạnh | M4 lặp "năm {năm}" hai lần trong một câu ("Cũng trong năm 2025, Hóa Lộc của năm 2025…"). Bỏ một lần lặp, vẫn giữ "Hóa Lộc của năm {năm}" theo NAM-HOA-02 | Mỗi câu M4 chỉ có một số năm |
| P2-5 (G4) | Hạnh | Ghép M4 hoặc M6 với Thiên Di thì chữ "cơ hội" xuất hiện hai lần ("cơ hội dễ đến hơn qua … cơ hội đến từ bên ngoài", chính ví dụ ở mục 2.3). Đổi cụm chủ đề Thiên Di hoặc cách nối | Câu ghép Thiên Di chỉ có một chữ "cơ hội" |
| P2-6 (G5) | Hạnh | Câu "cơ hội dễ đến hơn qua những chuyện về nhịp sinh hoạt, cách bạn nghỉ ngơi…" (M4 + Tật Ách) an toàn nhưng đọc gượng. Cân nhắc cách nối riêng cho Tật Ách, vẫn không dùng chữ "sức khỏe" | Có ghép thử mới, Thư soát ở lượt sau |

P2 không chặn chép. Hạnh sửa thì nộp commit mới, Thư soát lại riêng các câu đã đổi.
