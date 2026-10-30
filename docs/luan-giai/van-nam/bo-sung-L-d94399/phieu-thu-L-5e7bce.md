# Phiếu kiểm duyệt: đoạn nền Quan Lộc 4 phần (NAM-MANG-07), mẫu CV-23…CV-37, mã nghiên cứu 107 đoạn QL-*

Người duyệt: Thư (kiem-duyet), 30/10/2026. Việc L-5e7bce. Bản nộp lần 1: Hạnh, commit 06b4f7f. Lần 2: commit dbd84f9 (+8e2797c).
Chuẩn đối chiếu: `khung-doan-tra-phi.md` mục 6 và 6.0 (5 điều); `van-nam/QUY-TAC.md` mục 6; `docs/nghien-cuu/luan-giai-12-cung.md` (mã QUAN-*, CHUNG-VCD-*, CHUNG-TUAN-*); đoạn QL-* trong `src/lib/luan-giai/ai/quy-tac.json`; `tu-cam.json`; skill `kiem-duyet-noi-dung` mục 1–2. Lá số: an bằng `src/lib/tuvi` cho 25 lá số Canh của bộ đo.

## 1. Kết luận lần 2 (30/10/2026): ĐẠT để nạp vào `src`, kèm 2 điều kiện trước khi lên site

Bản duyệt lại: Hạnh sửa lần 1, nội dung nằm trong commit dbd84f9 (ghi nhận ở 8e2797c). Đối chiếu: `nen-quan-loc.md` mục 2–4 (bản in 7 lá số), `viec-nen-lam-ql.json` (21 mẫu), `khung-doan-tra-phi.md` 6.1, NAM-MANG-07, `ql-nguon-ma.json`. Thư an lại 7 lá số bằng `src/lib/tuvi` (Quan Lộc, cung xung chiếu, Mệnh, Tài Bạch): (a) của 5 đoạn 4 phần khớp lá số (chính tinh, độ sáng, Hóa, Linh Tinh, Triệt; 0/5 lá VCD có lục cát tinh, nên vế "không cát tinh" đúng).

Phạm vi chấm: phần L-5e7bce thêm vào (NAM-MANG-07, CV-23…43, 5 đoạn nền 4 phần). Hai dòng câu dẫn HAM trong bản in là hành vi sẵn có ở HEAD, không do việc này sinh ra; xét ở mục 1.3.

| Tiêu chí | Lần 1 | Lần 2 | Lý do ngắn |
|---|---|---|---|
| Đúng | 5 | 8 | 0 đoạn HAM gắn mẫu; (a) đủ sao, đúng lá số ở 5/5 bản in; CV-25 ghi vế sáng; CV-37/38 tách vế CHUNG-VCD-02, bỏ QUAN-CC-01 khỏi `maHuong` |
| Sâu | 5 | 7 | Có B2 Tuần/Triệt, B3 mượn sao xung chiếu, B4 Kỵ/sát. Còn thiếu: (b) chỉ luận chính tinh đầu (Thiên Tướng ở Liêm Tướng Ngọ không có câu); VCD mượn sao **hãm** hoặc mang **Hóa Kỵ** mà (b) không nói (lỗi S4) |
| Giọng | 7 | 8 | CV-31 `tuoiTu 18`, CV-26 bỏ "số khách", dưới 15 giữ câu dẫn, 15–17 loại QL-S04/S07-BINH/S14; B1 bỏ "giai đoạn đầu" từ 30 tuổi (Canh 1970 đã bỏ, Canh 2010 nam 17 tuổi giữ đúng). B2/B3 là câu khuôn có biến, chấp nhận |
| An toàn | 9 | 10 | 0 "dồn vốn" trong phần 4 phần; 6 mẫu mới CV-38…43 không có lời khuyên tài chính, y tế, pháp lý; 0 từ cấm |

**TB 8,25.** Đạt cả 4 điều kiện ngưỡng. Tùng/Bảo được nạp NAM-MANG-07 và CV-23…43 vào `src`.

### 1.1 Kiểm từng lỗi lần 1

| Mã | Lần 2 | Bằng chứng |
|---|---|---|
| Đ1 P0 | Xong | `quyTacId` CV-23…36 chỉ TOT/BINH; thêm `khongSaoTrongCung` Kỵ/sát. Canh 1990 nam, Canh 2000 nam: đoạn HAM giữ câu dẫn, không gắn mẫu |
| Đ2 P0 | Xong | CV-25 `QUAN-TDU-05/sáng`, `quyTacId` QL-S03-TOT/BINH |
| Đ3 P0 | Xong (theo phương án "giữ câu dẫn" lần 1 đã cho phép) | NAM-MANG-07: HAM không áp dụng cho tới khi câu đầu viết lại và Thư duyệt. Câu đầu chưa viết lại, xem 1.3 |
| S1 P0 | Xong | Canh 2000 nữ: "Liêm Trinh (vượng), Thiên Tướng (vượng); có Triệt" + B2 |
| S2 P0 | Xong | Canh 1970 nữ: VCD, Linh Tinh, Triệt, mượn Thiên Đồng (Khoa), Thái Âm (Kỵ) ở Phu Thê + B3 Triệt |
| A1 P0 | Xong trong NAM-MANG-07 | QL-S04-HAM bị loại; nhưng câu dẫn vẫn in nguyên văn, xem 1.3 |
| Đ4 P1 | Xong | CV-37 `CHUNG-VCD-02/không cát tinh`, CV-38 `/có cát tinh`, điều kiện `catTinhTamPhuong` |
| S3 P1 | Xong | CV-39 (Kỵ), CV-40…43 (sát, dạng i); B4 nối QL-HOA-3, QL-PS-* |
| G1, G2 P1 | Xong | như bảng điểm |
| T1 P1 | Xong | câu dẫn trước đoạn nền ở 5/5 bản in; (c) 3 sách |
| G3 P2 | Xong | B1 |

### 1.2 Ý kiến về "chặn bằng câu dẫn"

Đủ để **L-5e7bce đạt**: NAM-MANG-07 không đưa đoạn HAM lên thành 4 phần, không gắn mẫu "phát huy", đúng điều kiện lần 1 (Đ3, A1). **Chưa đủ để lên site**: câu dẫn không chặn nội dung. `src/lib/luan-giai/ai/van-nam.ts` dòng 628 chèn **nguyên văn** đoạn nền `phong-cach` làm câu dẫn của mảng Sự nghiệp, bất kể độ sáng. Vì vậy:
- Bản in Canh 1990 nam 4/9h: "Thái Âm tại Quan Lộc: hợp công việc cần sự cẩn trọng, chăm chút…" (Thái Âm **hãm**, Hóa Kỵ); Canh 2000 nam 4/9h: "Thiên Tướng tại Quan Lộc: hợp vai trò hỗ trợ, phối hợp, đại diện…" (Thiên Tướng **hãm**). Hai câu tả sao hãm như sao sáng, nằm trong bài trả phí. Nếu chấm cả mảng Sự nghiệp như khách đọc thì Đúng tối đa 6.
- Lá số có Vũ Khúc hãm tại Quan Lộc vẫn nhận "tránh dồn vốn vào một chỗ" (QL-S04-HAM, `quy-tac.json` dòng 1913) ở câu dẫn. Đếm "0 lần dồn vốn" trên 28 lá số chỉ vì bộ đo không có lá nào như vậy. Đoạn này cũng in ở bài Quan Lộc của bộ 12 cung.

### 1.3 Lỗi còn lại và điều kiện lên site (Thư không sửa)

| Mã | Mức | Lỗi | Cần làm | Người |
|---|---|---|---|---|
| A2 | P0 (trước thử kín 16/11) | QL-S04-HAM "dồn vốn" vẫn đến khách qua câu dẫn và bài 12 cung | Áp câu thay. Câu Hạnh đề xuất **đạt**, chỉ sửa một chỗ: "dễ vất vả hơn mức bỏ ra" đọc ngược nghĩa, đổi thành "kết quả dễ ít hơn công sức bỏ ra". Gắn mã vế hãm của QUAN-VK. Nghiệm thu: `grep "dồn vốn" src/lib/luan-giai/ai/quy-tac.json` = 0 | Minh duyệt, Tùng/Bảo nạp |
| A3 | P0 (báo Minh, ngoài phạm vi) | `quy-tac-van/van-10-nam.json` dòng 450: "Vũ Khúc hãm ở cung vận: … có khoản hao; nên lập quỹ dự phòng và tránh dồn vốn vào một chỗ" (lời khuyên tài chính, bài 10 năm) | Hạnh viết lại theo hành vi như A2 | Hạnh |
| Đ5 | P1 (trước ra mắt 27/11) | Câu đầu 14 đoạn QL-Snn-HAM tả như sao sáng, đang in ở câu dẫn (vi phạm skill mục 1) | Hạnh viết lại câu đầu theo mặt cần chú ý, bám vế hãm (QUAN-TA-02, QUAN-THL-02…). Xong thì Thư duyệt và NAM-MANG-07 mở cho HAM | Hạnh |
| S4 | P1 | VCD mượn sao xung chiếu **hãm** (Canh 1990 nữ: Thái Dương hãm) hoặc mang **Hóa Kỵ** (Canh 1970 nữ, Canh 2010 nam: Thái Âm Kỵ): (a) có ghi, (b) không nói, mẫu (d) vẫn trung tính | Thêm vế B3: sao mượn hãm hoặc Hóa Kỵ thì thêm một câu mặt cần chú ý (CHUNG-VCD-01, QUAN-HOA-03), lực nhẹ hơn khi ở ngay cung | Hạnh |
| S5 | P2 | Hai chính tinh đồng cung: (b) chỉ có câu của sao đầu (Canh 2000 nữ: Thiên Tướng không được luận) | Nối câu ngắn của sao thứ hai hoặc câu gộp cặp sao | Hạnh, Bảo |
| N1 | P2 | CHUNG-TUAN-05, CHUNG-VCD-03 có nguồn web (WC6, WC7) nhưng `ql-nguon-ma.json` để `[]`; câu "phái Việt coi là thế thuận hơn" không có nguồn ở (c) | Ghi "Tư liệu tham khảo trực tuyến" hoặc nguồn sách nếu có | Hạnh |

Ghi chú lần 1 (mục 2–4 dưới đây) giữ nguyên làm lịch sử.

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
