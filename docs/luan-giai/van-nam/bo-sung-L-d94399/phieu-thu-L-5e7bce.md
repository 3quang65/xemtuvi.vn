# Phiếu kiểm duyệt: đoạn nền Quan Lộc 4 phần (NAM-MANG-07), mẫu CV-23…CV-37, mã nghiên cứu 107 đoạn QL-*

Người duyệt: Thư (kiem-duyet), 30/10/2026. Việc L-5e7bce. Bản nộp: Hạnh, commit 06b4f7f.
Chuẩn đối chiếu: `khung-doan-tra-phi.md` mục 6 và 6.0 (5 điều); `van-nam/QUY-TAC.md` mục 6; `docs/nghien-cuu/luan-giai-12-cung.md` (mã QUAN-*, CHUNG-VCD-*, CHUNG-TUAN-*); đoạn QL-* trong `src/lib/luan-giai/ai/quy-tac.json`; `tu-cam.json`; skill `kiem-duyet-noi-dung` mục 1–2. Lá số: an bằng `src/lib/tuvi` cho 25 lá số Canh của bộ đo.

## 1. Kết luận: KHÔNG ĐẠT (chưa nạp vào `src`)

| Tiêu chí | Điểm | Lý do ngắn |
|---|---|---|
| Đúng | 5 | Mã bám hợp lệ ở bản sáng/bình, nhưng mẫu "phát huy" gán cả cho 14 đoạn QL-Snn-HAM; câu đầu các đoạn HAM tả sao hãm như sao sáng; CV-25 trái vế "hãm" của chính mã bám QUAN-TDU-05 |
| Sâu | 5 | Đoạn đủ 4 phần chỉ in một chính tinh; bỏ sao đồng cung, Tuần/Triệt, Hóa Kỵ tại Quan Lộc; cung vô chính diệu không nêu chính tinh xung chiếu |
| Giọng | 7 | Câu rõ, có cách đo, ≤ 33 chữ; còn CV-26, CV-31 không trung tính cho người dưới 18; QL-VCD "giai đoạn đầu" lạc tuổi với người 57 tuổi; chưa có ngưỡng tuổi dưới 15 |
| An toàn | 9 | 0 từ cấm (52 mục `tu-cam.json`), không mê tín, không gây sợ, CV-37 đã bỏ câu nặng của QUAN-CC-01. Trừ: NAM-MANG-07 đưa QL-S04-HAM ("tránh dồn vốn vào một chỗ", lời khuyên đầu tư) lên bài trả phí |

**TB 6,5.** Trượt cả 4 điều kiện ngưỡng: TB < 7,5; Đúng và Sâu < 6; Sâu < 6; An toàn < 10. Không nâng điểm.

Phần đạt (giữ nguyên, không cần làm lại):
- `ql-ma-nghien-cuu.json`: 107/107 đoạn QL-* có mã, 0 mã thiếu trong tài liệu nghiên cứu (kiểm bằng máy). Gán mã phong cách (QUAN-<SAO>-cuối) cho đoạn nền là đúng.
- Bảng 6.1 khớp JSON ở 15/15 mẫu (câu, cách đo, hạn). Câu ≤ 33 chữ, một việc, hạn 2–3 tháng, đo được.
- Với đoạn **TOT** (Miếu, Vượng, Đắc), CV-23…CV-36 đủ 5 điều mục 6.0.
- Không có đoạn năm giả; NAM-MANG-07 cấm "năm nay sẽ…", đúng tinh thần NAM-MANG-01.

## 2. Hai câu Minh hỏi

**a) CV-37 có cần tách mẫu riêng cho sao hãm không?** Không cần tách theo độ sáng. QL-VCD không xét độ sáng, câu CV-37 trung tính, nên dùng được cả khi chính tinh xung chiếu hãm (3/5 lá số VCD có Thái Dương hãm ở Phu Thê). Nhưng CV-37 và đoạn VCD còn 3 lỗi (mục 3, lỗi Đ3, S2). **Cần tách mẫu ở chỗ khác: 14 đoạn QL-Snn-HAM** (lỗi Đ1). Mỗi đoạn HAM đã có lời khuyên riêng ("Nên…"), nên viết mẫu dạng (i) hoặc (iii) theo lời khuyên đó, không dùng chung mẫu "phát huy" với bản sáng.

**b) "công việc hoặc việc học" cho người dưới 18:** Chấp nhận ở CV-24, CV-37, và cụm "nhóm, lớp" ở CV-25, CV-30. Câu này vẫn đọc trơn với người 57 tuổi. Lời Hạnh nói cả 15 mẫu đều trung tính thì chưa đúng: CV-26 có "số khách", CV-31 có "người trong nghề" (người 17 tuổi chưa có nghề, và mẫu khuyến khích tự làm quen người lạ). Thêm nữa, NAM-MANG-07 bỏ lọc tuổi trên đường đi (Canh 2010 nữ 5/5h trước trống do `tuoiTu 18`, nay có đoạn) nhưng không đặt ngưỡng nào cho đoạn nền.

## 3. Lỗi cần Hạnh sửa (Thư không sửa)

| Mã | Mức | Lỗi (trích, vị trí) | Cần làm | Quy tắc vi phạm |
|---|---|---|---|---|
| Đ1 | P0 | CV-23…CV-36: `dieuKien.quyTacId` nhận cả `QL-Snn-HAM`. Câu (b) của đoạn HAM khuyên ngược hướng mẫu: QL-S13-HAM "có kế hoạch dự phòng, tránh quyết định lúc căng thẳng" → CV-35 "Nhận một việc khó do bạn tự phụ trách"; QL-S01-HAM "tích lũy chuyên môn sâu trước, nhận quản lý từng bước" → CV-23 lập nhóm, chia việc; QL-S09-HAM "giữ kỷ luật, minh bạch tiền bạc" → CV-31 mở rộng quan hệ. Trong bộ 25 lá số Canh có 4 lá dính lỗi này (Thái Âm hãm ở Mão: Canh 1990 nam 4/9h, 2000 nữ 12/1h, 2010 nữ 10/21h → CV-30; Thiên Tướng hãm: Canh 2000 nam 4/9h → CV-33) | Bỏ `QL-Snn-HAM` khỏi `quyTacId` của CV-23…CV-36. Khi đó NAM-MANG-07 giữ câu dẫn như cũ (đúng vế "không mẫu bám được"). Muốn phủ HAM thì viết mẫu mới dạng (i)/(iii) theo câu "Nên…" của từng đoạn HAM, bám mã độ sáng (vd QUAN-TA-02, QUAN-THL-02) | 6.0 điều 3 (ưu tiên i) và điều 4 (đúng vế); skill mục 1 (sao hãm mở bằng mặt cần chú ý) |
| Đ2 | P0 | CV-25 bám QUAN-TDU-05, nhưng mã này có vế riêng cho sao hãm: "hãm thì nên chọn chuyên môn sâu, bền bỉ để thành công muộn". Mẫu "chia sẻ trước nhóm" chỉ đúng vế sáng | Ghi vế trong mã ẩn (`QUAN-TDU-05/sáng`), và `quyTacId` chỉ nhận QL-S03-TOT, QL-S03-BINH | 6.0 điều 4 |
| Đ3 | P0 | Câu đầu của 14 đoạn QL-Snn-HAM giống hệt bản sáng (vd QL-S08-HAM "Thái Âm tại Quan Lộc: hợp công việc cần sự cẩn trọng, chăm chút…"; QL-S11-HAM "hợp vai trò hỗ trợ, phối hợp, đại diện…"). Trước đây đây chỉ là đoạn phụ; NAM-MANG-07 đưa chúng thành (b) của bài trả phí | Thêm vào NAM-MANG-07 điều kiện: đoạn nền độ sáng **Hãm** chỉ được in đủ 4 phần khi câu đầu đã viết theo mặt cần chú ý. Nếu chưa viết lại thì đoạn này giữ câu dẫn | NAM-MANG-07; skill mục 1 (Đúng ≤ 5 khi ≥ 3 câu tả sao hãm như sáng) |
| Đ4 | P1 | CV-37: QUAN-CC-01 làm mã bám, nhưng (b) của QL-VCD chỉ dùng phần phương pháp ("lấy chính tinh xung chiếu mà luận"), còn phần nội dung ("công danh khó hiển đạt") thì cố ý không nói. Mã ẩn "bám CHUNG-VCD-02" lại không ghi vế (mã này có hai vế: có cát tinh và không cát tinh) | Bỏ QUAN-CC-01 khỏi `maHuong`/`maPhatHuy` (vẫn giữ trong `maNghienCuu`). Ghi vế `CHUNG-VCD-02/không cát tinh`. Thêm điều kiện máy đọc cho vế đó; vế "có cát tinh hội chiếu" thì viết mẫu khác hoặc để câu dẫn | 6.0 điều 1, 2, 4 |
| S1 | P0 | Bản in mẫu Canh 2000 nữ 5/5h (`nen-quan-loc.md` dòng 78): "(a) Cung Quan Lộc (Ngọ): Liêm Trinh (vượng)". Lá số thật: **Liêm Trinh (V) + Thiên Tướng (V), có Triệt**. Thiếu sao đồng cung và Triệt, trong khi Triệt ở Quan Lộc làm đổi cường độ (CHUNG-TUAN-02). Cùng lỗi ở Canh 1990 nữ 5/5h (Thiên Cơ, Triệt) và các lá có Tuần ở Mão (Canh 1970) | Sửa định nghĩa (a) trong NAM-MANG-07: in **mọi** chính tinh tại cung kèm độ sáng, Tuần/Triệt tại cung, Hóa của sao gốc tại cung. Khi có Tuần/Triệt thì (b) thêm một câu theo CHUNG-TUAN-05 | NAM-MANG-07 (a); CHUNG-TUAN-02, CHUNG-TUAN-05; skill mục 3 (Tuần/Triệt áp đúng cung) |
| S2 | P0 | Đoạn VCD in "(a) vô chính diệu" mà không nêu chính tinh xung chiếu. Canh 1970 nữ 5/5h: Quan Lộc Ngọ có **Triệt**, xung chiếu Thiên Đồng (V) Hóa Khoa + Thái Âm (V) **Hóa Kỵ** → rơi đúng ngoại lệ (1) của QUAN-CC-01 (Tuần/Triệt án ngữ) nhưng bài không nói | NAM-MANG-07 (a) cho cung VCD: nêu chính tinh cung Phu Thê kèm độ sáng, Hóa, cùng Tuần/Triệt tại Quan Lộc. (b) thêm một câu theo CHUNG-VCD-01 (mượn sao, lực yếu hơn). Mẫu đạt: skill `kiem-duyet-noi-dung` mục 4, dòng QL-VCD | CHUNG-VCD-01; QUAN-CC-01; skill mục 4 |
| S3 | P1 | Hóa Kỵ gốc tại Quan Lộc (Thái Âm hãm hóa Kỵ, 3/25 lá số) không xuất hiện trong đoạn 4 phần. Đoạn QL-HOA-3 có sẵn nhưng NAM-MANG-07 chỉ lấy "đoạn đầu mục phong-cach" | Khi Quan Lộc có Hóa Kỵ, Kình/Đà/Hỏa/Linh/Không/Kiếp gốc: (a) phải nêu tên sao, và (b) phải có câu của đoạn QL-HOA-3/QL-PS-* tương ứng. Nếu chưa ghép được thì mẫu (d) không được là dạng "phát huy" | NAM-MANG-07; 6.0 điều 3 (iii); QUAN-HOA-03 |
| G1 | P1 | CV-31 "làm quen hoặc nối lại với hai người **trong nghề**"; CV-26 "(số việc xong, **số khách**, số giờ)": không hợp người dưới 18, trái với ghi chú "trung tính" ở `nen-quan-loc.md` mục 2 điều 5 | CV-31: đặt `tuoiTu: 18`, hoặc đổi thành "người làm cùng lĩnh vực hoặc cùng mối quan tâm" và bỏ ý tự làm quen người lạ với người chưa đủ 18. CV-26: bỏ "số khách" hoặc thay bằng "số bài" | Skill mục 1, tiêu chí Giọng (đúng tuổi) |
| G2 | P1 | NAM-MANG-07 không có ngưỡng tuổi. Lá số dưới 15 tuổi sẽ nhận đoạn Quan Lộc viết cho người lớn ("nhận vai trò quản lý nhóm", "tài chính, kinh doanh", "đổi việc", "nguồn thu") | Thêm vế: dưới 15 tuổi thì mảng Sự nghiệp giữ câu dẫn, hoặc dùng đoạn học tập riêng. Người 15–17 tuổi: các đoạn QL-S04-*, QL-S07-BINH, QL-S14-BINH/HAM giữ câu dẫn | Skill mục 1 (Giọng ≤ 5 khi lá số trẻ em mà Quan Lộc viết như cho người lớn) |
| G3 | P2 | QL-VCD "nên thử vài vai trò khác nhau **giai đoạn đầu**" in cho Canh 1970 (57 tuổi), Canh 1990 (37 tuổi). CV-37 lặp ở 5/25 lá số | Ghi vào NAM-MANG-07: lá số từ khoảng 30 tuổi trở lên thì bỏ vế "giai đoạn đầu" (đề xuất viết một bản QL-VCD cho người trưởng thành). Phần lặp chấp nhận tạm, theo dõi sau khi có đủ mẫu theo sao xung chiếu | Tiêu chí Giọng (đúng người đọc) |
| A1 | P0 | QL-S04-HAM "Nên kiểm soát rủi ro tiền bạc trong công việc và **tránh dồn vốn vào một chỗ**": lời khuyên đầu tư. Trước đây là đoạn phụ, nay NAM-MANG-07 in thành (b) của bài trả phí | Loại QL-S04-HAM khỏi NAM-MANG-07 cho đến khi câu viết lại thành hành vi (ghi chép, hỏi người có chuyên môn), không khuyên phân bổ vốn | Khung mục 6 quy tắc 3; 6.0 điều 5 (không đầu tư) |
| T1 | P1 | Thứ tự in (bản mẫu dòng 82): câu dẫn NAM-MANG-01 nằm **sau** "Việc nên làm", nên khách đọc lời khuyên trước, rồi mới gặp câu "năm nay không có yếu tố…". Trong khi đó NAM-MANG-07 định nghĩa (b) là câu dẫn đặt **trước** đoạn nền. Dòng (c) của QL-VCD chỉ in "Toàn Thư", thiếu nguồn mã (TB, KL) | Đưa hai việc này (`nen-quan-loc.md` mục 5 điểm 3) từ "nên làm" thành **điều kiện nạp** | NAM-MANG-07 (b), (c) |

## 4. Điều kiện để duyệt lại

1. P0 xong (Đ1, Đ2, Đ3, S1, S2, A1). Hạnh viết sửa NAM-MANG-07 và `dieuKien`; Tùng/Bảo làm phần bộ ghép cho S1, S2, T1.
2. Chạy lại `do-doan-du.cjs` trên bản giả lập rồi nộp bản in Sự nghiệp của 5 lá số: Canh 1970 nữ 5/5h (VCD + Triệt), Canh 2000 nữ 5/5h (Liêm Tướng + Triệt), Canh 1990 nam 4/9h (Thái Âm hãm hóa Kỵ), Canh 2000 nam 4/9h (Thiên Tướng hãm), Canh 2010 nam 4/9h (17 tuổi). Đếm được: 0 đoạn HAM gắn mẫu "phát huy"; 5/5 bản có đủ chính tinh và Tuần/Triệt trong (a); 0 lần "dồn vốn".
3. P1 (Đ4, S3, G1, G2, T1) xong trước khi lên site; P2 (G3) theo dõi.
