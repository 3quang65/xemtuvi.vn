# Phiếu kiểm duyệt luận giải tự động, đợt 1 (việc L-8631bb)

- Người chấm: Thư (kiểm duyệt). Ngày 30/10/2026.
- Đối tượng: 10 bản trong `docs/luan-giai/mau-1/` (commit 97ef3cc, chế độ **stub**: ghép thẳng quy tắc, chưa qua AI viết lại).
- Thang học thuật: skill `tuvi-luan-giai` (quy trình 10 bước), `docs/nghien-cuu/luan-giai-12-cung.md` (CHUNG-TUAN, CHUNG-CC, CHUNG-VCD…), `docs/nghien-cuu/luan-giai/QUY-UOC.md`, quy tắc nội dung trong `CLAUDE.md`.
- Bốn tiêu chí, thang 0–10: (1) **Đúng**: sao/cung/độ sáng/Tứ hóa khớp danh sách sao trong bản và câu luận khớp độ sáng; (2) **Sâu**: tam hợp, xung chiếu, cách cục, tổng hợp; (3) **Giọng**: nghiêm túc, gần gũi, "hiểu mình, định hướng"; (4) **An toàn**: không mê tín, không gây sợ.

## Kết luận

**Không đạt để thu tiền.** Điểm trung bình chung **6,25/10** (Đúng 6,2 · Sâu 3,0 · Giọng 5,8 · An toàn 10). Bài an toàn tuyệt đối và đặt sao đúng vị trí, nhưng chỉ là ghép câu rời. Bài bỏ qua **51/66 (77%)** sao quan trọng có trong các cung liên quan (Tứ hóa, Tuần/Triệt, Không Kiếp, Kình Đà, Hỏa Linh, Thiên Không, Lộc Tồn), không nêu được cách cục nào, và nói sao hãm như sao sáng. Khách đã đọc qua một trang tử vi miễn phí sẽ thấy bài này nông hơn. Nguyên nhân gốc nằm ở **bộ quy tắc sản xuất** `quy-tac.json` (321 quy tắc, viết đơn giản hóa), không phải ở cách viết câu. Bộ nghiên cứu 946 quy tắc đã có sẵn nhưng chưa được nối vào (0 mã nào trùng).

## 1. Bảng điểm

| Bản | Chuyên đề | Đúng | Sâu | Giọng | An toàn | **TB** |
|---|---|---|---|---|---|---|
| 01 | Mệnh (Tham Lang Đ, Hóa Kỵ, Tuần, Hỏa Tinh) | 6 | 3 | 6 | 10 | **6,25** |
| 02 | Quan Lộc (Thiên Đồng Đ) | 7 | 3 | 6 | 10 | **6,50** |
| 03 | Phu Thê (Tham Lang H tại Tý) | 6 | 2 | 5 | 10 | **5,75** |
| 04 | Mệnh (Tử Vi B tại Tý) | 6 | 3 | 6 | 10 | **6,25** |
| 05 | Quan Lộc (Thiên Cơ Đ, Hóa Lộc) | 7 | 3 | 6 | 10 | **6,50** |
| 06 | Phu Thê (Thiên Cơ V, Tuần) | 6 | 3 | 6 | 10 | **6,25** |
| 07 | Mệnh (Tử Vi Đ + Phá Quân V, Hóa Quyền) | 6 | 3 | 5 | 10 | **6,00** |
| 08 | Quan Lộc (vô chính diệu, Triệt) | 5 | 3 | 6 | 10 | **6,00** |
| 09 | Phu Thê (Thái Âm M, Hóa Lộc, Tuần) | 7 | 4 | 6 | 10 | **6,75** |
| 10 | Mệnh (Thiên Tướng Đ, Triệt, Địa Kiếp) | 6 | 3 | 6 | 10 | **6,25** |
| **TB** | | **6,2** | **3,0** | **5,8** | **10** | **6,25** |

Cao nhất: bản 09 (6,75). Thấp nhất: bản 03 (5,75).

## 2. Lý do từng bản

**Bản 01 (6,25).** Tham Lang Hóa Kỵ đồng cung Hỏa Tinh tại Mệnh là **cách Hỏa Tham**, đồng thời tam phương đủ Thất Sát và Phá Quân (**Sát Phá Tham**, MENH-CC-07). Bài không nêu cách nào, chỉ có "Hỏa Tinh… nên tiết chế cảm xúc" (ML-PS-10). Mâu thuẫn: "Độ sáng tốt, nên phát huy chủ động" (ML-S09-TOT) đứng cạnh "Hóa Kỵ… dễ vướng mắc" (ML-HOA-3) và "Tuần… biểu hiện chậm" (ML-TT-TUẦN), không có câu nào dung hòa. Câu Hóa Kỵ không gắn với Tham Lang. Bài bỏ sót Địa Kiếp (H) và Hóa Lộc tại Tài Bạch, Thiên Không tại Mệnh.

**Bản 02 (6,50).** Vị trí và tam hợp đúng. Bài bỏ sót Hóa Quyền (Cự Môn) và Đà La tại Mệnh, Hóa Khoa (Thái Âm) tại Phu Thê, cặp **Không Kiếp** chiếu Quan Lộc–Tài Bạch (Địa Kiếp H tại Quan Lộc được nhắc, Địa Không H tại Tài Bạch thì không). Câu chung chung: "Thiên Khôi… dễ gặp quý nhân, người hướng dẫn" (QL-PS-4). Lưu ý thêm: lá số sinh năm 2023, bài vẫn nói về "phong cách làm việc" như với người trưởng thành.

**Bản 03 (5,75).** Tham Lang hãm tại Tý cùng Đào Hoa, Hỏa Tinh hãm, Thiên Không tại Phu Thê là tổ hợp nặng nhất trong 10 bản. Bài chỉ nói "thu hút, thích sự mới mẻ" (PT-S09-HAM), "Đào Hoa… sức hút cá nhân" (PT-PS-15), và bỏ Thiên Không. Thất Sát (H) và Phá Quân (H) được mô tả như sao sáng (PT-S13-C6, PT-S14-C1). "Thiên Khôi đồng cung Phu Thê: dễ gặp quý nhân, người hướng dẫn" (PT-PS-4) lạc ngữ cảnh hôn nhân. "Cá tính mạnh, cần học cách mềm mỏng" không rõ nói về khách hay bạn đời. Bài bỏ sót Hóa Khoa (Tử Vi) và Triệt tại Quan Lộc ở xung chiếu, Tuần và Địa Kiếp tại Thiên Di.

**Bản 04 (6,25).** Mệnh Tử Vi, Quan Lộc Liêm Phủ, Tài Bạch Vũ Tướng là **Tử Phủ Vũ Tướng** (CHUNG-CC-01), nhưng bài không nêu. Tham Lang hãm, bị Triệt, có Địa Không tại Thiên Di, vậy mà bài viết "đa tài, nhiều ham muốn học hỏi, giỏi giao tiếp" (ML-S09-C1). Bài không có mục Tứ hóa dù Vũ Khúc Hóa Quyền chiếu từ Tài Bạch, và không có mục sao phụ. Bỏ sót Tuần và Địa Kiếp tại Quan Lộc, Lộc Tồn tại Tài Bạch.

**Bản 05 (6,50).** Thiên Cơ Hóa Lộc tại Quan Lộc, xung chiếu là Thiên Lương Hóa Quyền, tạo thành **Cơ Lương hội** (MENH-TCO-03: giỏi phân tích, bàn mưu). Bài không nêu. Bài bỏ sót Triệt tại Phu Thê. Thiên Đồng (H) và Cự Môn (H) được viết như sao sáng (QL-S05-C5, QL-S10-C3). Bài không có mục sao phụ.

**Bản 06 (6,25).** Thiên Đồng (H) và Cự Môn (H) bị Triệt, có Kình Dương tại Thiên Di, nhưng bài viết "nhẹ nhàng, dễ thông cảm" (PT-S05-C1). Xung chiếu Quan Lộc có đủ Địa Không, Địa Kiếp, Đà La, Hóa Khoa: bài bỏ toàn bộ. Phúc Đức vô chính diệu (cung tam hợp) không được nhắc. "Thiên Việt… cơ hội từ người đi trước" (PT-PS-5) lạc ngữ cảnh. Bài cũng bỏ Cô Thần tại Phu Thê; sao này cần nói trung tính chứ không nên bỏ.

**Bản 07 (6,00).** Tử Vi cùng Phá Quân tại Mùi là cách **Tử Phá**, bài không nêu. Liêm Trinh và Tham Lang đều hãm tại Hợi, có Hóa Lộc, nhưng bài viết "có nguyên tắc", "đa tài" (ML-S06-C2, ML-S09-C2). Thất Sát (H) cùng Kình Dương (H) và Tuần tại Tài Bạch bị viết thành "mạnh mẽ, dứt khoát" (ML-S13-C3). Bài bỏ Hóa Lộc (Liêm) và Hóa Khoa (Vũ Khúc). Câu "Độ sáng tốt, nên phát huy chủ động" lặp hai lần liền nhau (ML-S01-TOT, ML-S14-TOT).

**Bản 08 (6,00).** Có lỗi sai nghĩa: "Quan Lộc không có chính tinh: **tính cách** linh hoạt" (QL-VCD). Quan Lộc là công việc, không phải tính cách; quy tắc được chép từ ML-VCD. Câu "Triệt đóng tại Quan Lộc: biểu hiện chậm hoặc kín đáo" (QL-TT-TRIỆT) giống hệt câu của Tuần. Câu này cũng bỏ qua nguyên tắc vô chính diệu gặp Tuần/Triệt (CHUNG-TUAN-02, CHUNG-VCD). Thái Dương Hóa Lộc tại Mệnh và Thái Âm Hóa Kỵ có Tuần tại Tài Bạch đều nằm trong tam hợp nhưng bị bỏ. Thiên Không đồng cung với Địa Không cũng bị bỏ. Ghi chú: Canh Thiên Đồng Hóa Khoa, Thái Âm Hóa Kỵ là bảng Việt, đúng (spec 10.4); nên có một câu ghi trường phái.

**Bản 09 (6,75).** Bản tốt nhất. Có cả Tứ hóa và Tuần. Tuy vậy, Phu Thê Thái Âm, Thiên Di Thiên Cơ và Phúc Đức Đồng Lương đủ bộ **Cơ Nguyệt Đồng Lương**, bài không nêu. Bỏ sót Hóa Quyền (Thiên Đồng) và Triệt tại Phúc Đức, Hóa Khoa (Thiên Cơ) và Lộc Tồn tại Thiên Di. Câu chung chung: "Hóa Lộc tại Phu Thê mở ra cơ hội và nguồn lực" (PT-HOA-0); "nguồn lực" không ăn nhập với chuyện tình cảm. Ba lời khuyên ("phát huy chủ động", "chủ động nắm bắt", "kiên nhẫn, nhìn theo giai đoạn") đặt cạnh nhau mà không dung hòa.

**Bản 10 (6,25).** Mâu thuẫn: "Độ sáng tốt, nên phát huy chủ động" (ML-S11-TOT) và "Triệt… biểu hiện chậm" (ML-TT-TRIỆT) đặt cạnh nhau. Quan Lộc (tam hợp) vô chính diệu, có Lộc Tồn và Thiên Không, nhưng **không được nhắc một chữ**, vì bộ quy tắc không có câu nào cho cung hợp chiếu vô chính diệu. Bỏ sót Hóa Khoa (Hữu Bật) tại Tài Bạch, cặp Địa Kiếp (Mệnh) với Địa Không (Tài Bạch). Địa Kiếp hãm tại Mệnh chỉ được viết thành "hay muốn đổi hướng" (ML-PS-13).

## 3. Xem xét riêng

- **Câu mâu thuẫn trong cùng bài (3/10 bản: 01, 09, 10).** Câu đuôi "Độ sáng tốt, nên phát huy chủ động" đặt cạnh Hóa Kỵ/Tuần/Triệt mà không có câu dung hòa (skill bước 8, CHUNG-TUAN-06). Ở hợp chiếu thì sao hãm bị mô tả như sao sáng: 10/10 bản có ít nhất một câu như vậy.
- **Câu lặp.** Đuôi "góp thêm sắc thái cho chuyên đề …" xuất hiện **37/74 câu (50%)**. "Độ sáng tốt, nên phát huy chủ động" lặp 2 lần trong bản 07. Câu Tuần và câu Triệt trùng chữ.
- **Sao quan trọng bị bỏ.** 51/66 lần xuất hiện bị bỏ. Riêng **Tứ hóa: 16/20 bị bỏ**, vì chỉ có hóa nằm ngay tại cung chính được luận. **Tuần/Triệt: 9/14 bị bỏ** (tất cả ở cung hợp chiếu). **Không Kiếp: 9/11 bị bỏ**. Bộ quy tắc không có mục cho Thiên Không, Cô Thần, Quả Tú, Thiên Hình, Kiếp Sát.
- **Câu chung chung, áp cho ai cũng được.** 16 sao phụ dùng **cùng một câu cho cả 3 chuyên đề** (16/16), ví dụ PT-PS-4 = ML-PS-4. Câu Tứ hóa không phụ thuộc sao mang hóa. QL-VCD là bản chép của ML-VCD.
- **Truy nguồn.** Tên tác giả bị ghi sai ở mọi bài: "Vân Đằng **Thái Thúc**", đúng là **Vân Đằng Thái Thứ Lang** (QUY-UOC mã TB). Mỗi quy tắc chỉ ghi 1 nguồn chung chung ("Tử Vi Đẩu Số Toàn Thư"), không có thiên/chương, trái quy định ≥ 2 nguồn cho quy tắc chính. Trên giao diện (`TomTatMienPhi.tsx` dòng 35), mã quy tắc hiện ra cho khách xem; skill quy định mã này "ẩn với khách".
- **Thời điểm đọc.** 4/10 lá số là trẻ dưới 6 tuổi (02, 04, 06, 07). Bài Quan Lộc/Phu Thê viết như cho người lớn; chưa có cách viết cho phụ huynh xem lá số con.
- **An toàn.** Không có từ cấm, không gây sợ, có dòng "do hệ thống tạo tự động". Đạt.

## 4. Top 5 lỗi lặp lại

| # | Lỗi | Tần suất | Mã tiêu biểu | Ảnh hưởng tới việc trả tiền |
|---|---|---|---|---|
| 1 | Không nêu cách cục, chỉ ghép câu từng sao | 10/10 bản; 6 bản có cách rõ bị bỏ (7 cách) (Hỏa Tham, Sát Phá Tham, Tử Phủ Vũ Tướng, Tử Phá, Cơ Lương, Cơ Nguyệt Đồng Lương) | không có loại CC trong quy-tac.json | **Rất cao.** Cách cục là thứ khách chờ ở bài trả phí; thiếu nó thì bài giống bản miễn phí của đối thủ. |
| 2 | Bỏ Tứ hóa, Tuần/Triệt, sát tinh ở cung hợp chiếu | 10/10 bản; 51/66 sao quan trọng bị bỏ | ML-HOA-*, *-TT-* chỉ áp cho cung chính | **Rất cao.** Khách có lá số trước mặt, thấy Hóa Kỵ/Không Kiếp mà bài không nhắc, sẽ mất niềm tin vào "độ tin cậy học thuật". |
| 3 | Câu hợp chiếu bỏ qua độ sáng: sao hãm được mô tả như sao sáng | 10/10 bản | ML-S09-C1, PT-S14-C1, QL-S10-C3 (42×3 quy tắc C không có điều kiện độ sáng) | **Cao.** Sai học thuật, dễ bị người biết tử vi bắt lỗi công khai. |
| 4 | Câu khuôn, lặp, lạc ngữ cảnh | 37/74 câu có "góp thêm sắc thái"; 16/16 sao phụ chung một câu; QL-VCD nói "tính cách" | PT-PS-4, PT-PS-5, QL-VCD, PT-HOA-0 | **Cao.** Đọc ra ngay là máy ghép, không "hiểu mình". |
| 5 | Mâu thuẫn không dung hòa; Tuần = Triệt | 3/10 bản mâu thuẫn; 100% câu Triệt chép câu Tuần | ML-S*-TOT với ML-HOA-3; ML-TT-TRIỆT | **Trung bình–cao.** Lời khuyên trái chiều làm bài mất giá trị định hướng. |

## 5. Đề xuất sửa quy tắc (xếp ưu tiên)

1. **(P0) Nối bộ nghiên cứu vào sản xuất.** Thay hoặc bổ sung `quy-tac.json` từ `docs/nghien-cuu/luan-giai-12-cung.md` (946 quy tắc, đa nguồn, có CC/HOA/TUAN/VCD/SP), giữ nguyên mã nghiên cứu (MENH-THL-01…) để truy nguồn. Việc này giải quyết gốc lỗi 1–3.
2. **(P0) Thêm loại quy tắc cách cục (CC)** với điều kiện máy kiểm được (sao X ở cung Y, sao Z ở tam phương, độ sáng, điều kiện phá cách). Ưu tiên 10 cách: Tử Phủ Vũ Tướng, Sát Phá Tham, Cơ Nguyệt Đồng Lương, Cự Nhật, Hỏa Tham/Linh Tham, Tử Phá, Cơ Lương, Nhật Nguyệt, Tham Đào (phiếm thủy đào hoa), Không Kiếp giáp/chiếu. Cách cục đặt ở đầu bài, trước câu từng sao.
3. **(P0) Mở rộng phạm vi khớp sang tam phương tứ chính:** Tứ hóa, Tuần/Triệt, Không Kiếp, Kình Đà, Hỏa Linh ở cung hợp chiếu phải sinh câu "… chiếu vào <cung chính>". Thêm câu cho cung hợp chiếu **vô chính diệu**, mượn chính tinh xung chiếu (bản 10).
4. **(P1) Thêm điều kiện độ sáng cho 126 quy tắc hợp chiếu (C)**: tách TOT/HAM như quy tắc tọa thủ. Câu HAM phải mở bằng mặt cần chú ý, không chép mặt tốt.
5. **(P1) Viết lại theo ngữ cảnh chuyên đề:** 16 sao phụ × 3 chuyên đề = 48 câu riêng (Khôi Việt ở Phu Thê nói về bạn đời, không nói "người hướng dẫn"); Tứ hóa theo **sao mang hóa** (Tham Lang Hóa Kỵ khác Cự Môn Hóa Kỵ); sửa QL-VCD và PT-VCD.
6. **(P1) Tách Tuần và Triệt**, viết theo CHUNG-TUAN-02/05/06: tốt giảm, xấu nhẹ đi, vô chính diệu gặp Tuần Triệt.
7. **(P1) Sửa cách ghép:** bỏ đuôi "góp thêm sắc thái cho chuyên đề …" và "Độ sáng tốt, nên phát huy chủ động". Khi cung có cả yếu tố tốt và Kỵ/Tuần/Triệt/sát thì thêm câu dung hòa (CHUNG-PP-10, TUAN-06). Thêm đoạn "Tóm lại" đầu bài theo mẫu skill.
8. **(P1) Sửa nguồn:** "Vân Đằng Thái Thúc" thành "Vân Đằng Thái Thứ Lang"; ghi thiên/chương; ẩn mã quy tắc khỏi giao diện khách (chỉ giữ tên sách và trường phái).
9. **(P2) Bổ sung sao phụ:** Thiên Không, Cô Thần/Quả Tú, Thiên Hình, Thiên Riêu, Lộc Tồn ở hợp chiếu, Kiếp Sát, Tang Môn/Bạch Hổ, viết trung tính.
10. **(P2) Cách viết theo tuổi:** lá số dưới khoảng 15 tuổi thì chuyên đề Quan Lộc/Phu Thê đổi sang giọng "gợi ý cho phụ huynh / tiềm năng", hoặc ẩn chuyên đề Phu Thê.

Ghi chú: các bản mẫu là chế độ **stub**. Lớp AI viết lại chỉ được dùng nhận định có sẵn (prompt-he-thong.md, quy tắc 1), nên **lớp AI không bù được độ sâu**. Phải sửa ở bộ quy tắc.

## 6. Kế hoạch sửa (TB 6,25 < 7)

| Bước | Việc | Ai làm | Nghiệm thu đo được |
|---|---|---|---|
| 1 | Chuyển bộ nghiên cứu cho 3 chuyên đề (Mệnh, Quan Lộc, Phu Thê) sang định dạng quy tắc máy đọc: điều kiện sao/cung/độ sáng/hóa/tam phương; giữ mã gốc; sửa tên nguồn | Hạnh (luận giải); Đức rà điều kiện an sao | ≥ 150 quy tắc/chuyên đề; 100% có mã nghiên cứu và ≥ 1 nguồn đúng tên; 0 câu "Thái Thúc" |
| 2 | Viết 10 quy tắc cách cục ưu tiên (mục 5.2), câu C bản hãm, 48 câu sao phụ theo chuyên đề, câu Tuần/Triệt tách riêng, câu Tứ hóa theo sao | Hạnh | Có đủ danh mục; mỗi cách có điều kiện và điều kiện phá cách; Thư duyệt văn bản đạt |
| 3 | Sửa bộ ghép: khớp tam phương tứ chính (hóa, Tuần/Triệt, sát tinh, vô chính diệu ở hợp chiếu), loại CC lên đầu bài, bỏ đuôi lặp, thêm câu dung hòa và "Tóm lại", ẩn mã quy tắc trên giao diện | Bảo (lập trình) | Test tự động: với 10 lá số mẫu, tỷ lệ bỏ sót sao quan trọng ≤ 10% (hiện 77%); 7 cách cục ghi ở mục 2 đều được nhận ra; 0 câu chứa "góp thêm sắc thái" |
| 4 | Sinh lại 10 bản (cùng 10 lá số), mau-2 | Bảo | Thư chấm lại: TB chung ≥ 7,5, không tiêu chí nào < 6, Sâu ≥ 6, An toàn giữ 10 |
| 5 | Chuẩn hóa bộ tiêu chí chấm này thành skill `kiem-duyet-noi-dung` (có ví dụ đạt/không đạt lấy từ đợt này) | Thư | Skill có bảng tiêu chí và script đếm sao bỏ sót, chạy lại được trên mau-2 |

Thứ tự: 1 và 2 song song với phần sửa bộ ghép ở bước 3 (Bảo dựng khung khớp tam phương bằng quy tắc hiện có trước), sau đó làm 4 và 5. Chưa đủ điều kiện mở bán luận giải trả phí cho đến khi mau-2 đạt bước 4.
