# Đoạn nền Quan Lộc đủ 4 phần khi mảng Sự nghiệp không có yếu tố năm (việc L-5e7bce)

Hạnh, 30/10/2026. Thực hiện đề xuất (b) của `bo-sung-viec-L-d94399.md` mục 4 điểm 1, Minh đã chốt: không viết đoạn năm giả; mảng in đoạn nền của cung (bộ 12 cung) đủ 4 phần. Chỉ sửa docs; không sửa `src/`. **Bản sửa lần 1** theo phiếu Thư `phieu-thu-L-5e7bce.md` (Đ1–Đ4, S1–S3, G1–G3, A1, T1).

## 1. Mã nghiên cứu cho 107 đoạn QL-* (bộ 12 cung)

Tệp: `ql-ma-nghien-cuu.json` (bảng `mã đoạn → maNghienCuu`). Mọi mã đều có trong `docs/nghien-cuu/luan-giai-12-cung.md` (đã kiểm bằng máy, 0 mã thiếu).

| Đoạn QL-* | maNghienCuu | Lý do (phần (b) dùng ý của mã) |
|---|---|---|
| QL-S01-TOT/BINH/HAM (Tử Vi) | QUAN-TV-05 | "vai trò điều phối… xây vài cộng sự" = điều hành, cần phụ tá |
| QL-S02-* (Thiên Cơ) | QUAN-TCO-04 | phân tích, lập kế hoạch, tham mưu |
| QL-S03-* (Thái Dương) | QUAN-TDU-05 | công khai, truyền đạt, được ghi nhận |
| QL-S04-* (Vũ Khúc) | QUAN-VK-04 | chỉ tiêu, số liệu, đo kết quả rõ |
| QL-S05-* (Thiên Đồng) | QUAN-TD-04 | dịch vụ, chăm sóc, giáo dục; thích cải tiến |
| QL-S06-* (Liêm Trinh) | QUAN-LT-05 | nguyên tắc, luật lệ rõ, cân bằng tham vọng với minh bạch |
| QL-S07-* (Thiên Phủ) | QUAN-TP-03 | quản lý nguồn lực, tiến từng bước chắc |
| QL-S08-* (Thái Âm) | QUAN-TA-04 | cẩn trọng, tỉ mỉ, thẩm mỹ |
| QL-S09-* (Tham Lang) | QUAN-THL-04 | năng động, giao tiếp, cần giữ tập trung |
| QL-S10-* (Cự Môn) | QUAN-CM-03 | lời nói, lập luận, diễn đạt khéo |
| QL-S11-* (Thiên Tướng) | QUAN-TT-04 | điều phối, hỗ trợ, đại diện |
| QL-S12-* (Thiên Lương) | QUAN-TL-04 | tư vấn, giáo dục, đạo đức nghề |
| QL-S13-* (Thất Sát) | QUAN-TS-04 | tiên phong, việc khó, quyết đoán |
| QL-S14-* (Phá Quân) | QUAN-PQ-04 | khởi sự, cải tổ, cần đối tác giữ ổn định |
| QL-Snn-C3/C4/C5 (sao ở Tài Bạch, Phu Thê, Mệnh chiếu về) | mã phong cách của sao + QUAN-YN-04 | "tiếp thêm/soi sang thêm nét…" + tam phương tứ chính |
| QL-VCD | QUAN-CC-01, CHUNG-VCD-01, CHUNG-VCD-02, CHUNG-VCD-03 | "chịu ảnh hưởng từ cung xung chiếu và hoàn cảnh" |
| QL-HOA-0/1/2 (Lộc, Quyền, Khoa) | QUAN-HOA-02, QUAN-HOA-01 | nguồn lực, dẫn dắt, danh tiếng |
| QL-HOA-3 (Kỵ) | QUAN-HOA-03 | điểm nhạy cảm, vướng mắc |
| QL-TT-TUẦN / QL-TT-TRIỆT | CHUNG-TUAN-02, CHUNG-TUAN-05 | biểu hiện chậm, kín đáo hơn |
| QL-PS-0/1 (Tả, Hữu) | QUAN-SP-03 | có người hỗ trợ |
| QL-PS-2/3 (Xương, Khúc) | QUAN-SP-01 | chữ nghĩa, biểu đạt |
| QL-PS-4/5 (Khôi, Việt) | QUAN-SP-02 | quý nhân, người đi trước |
| QL-PS-6 (Lộc Tồn) | QUAN-SP-04 | tích lũy, tổ chức |
| QL-PS-7 (Thiên Mã) | QUAN-SP-05, CHUNG-SP-05 | năng động, di chuyển |
| QL-PS-8 (Kình Dương) | QUAN-SP-06 | nghị lực, cần kiểm soát nóng vội |
| QL-PS-9/10/11 (Đà, Hỏa, Linh) | QUAN-SP-07 | kiên trì / nhiệt huyết / nhạy bén |
| QL-PS-12/13 (Không, Kiếp) | QUAN-SP-08 | ý tưởng khác lạ, hay đổi hướng |
| QL-PS-14/15 (Hồng Loan, Đào Hoa) | QUAN-SP-14 | duyên giao tiếp, sức hút |

Không gán mã chi tiết theo chi (vd QUAN-THL-03 "Tham Lang tại Dần, Thân") vì đoạn QL-* chỉ phân theo độ sáng, câu (b) không dùng ý đó. Không gán mã TRANH, mã phương pháp (QUAN-YN-01/02/05).

## 2. Mẫu việc nên làm (CV-23…CV-43), sửa theo phiếu Thư

Bảng: `docs/luan-giai/khung-doan-tra-phi.md` mục 6.1. JSON nháp: `viec-nen-lam-ql.json` (21 mẫu, chủ đề `cong-viec`).

| Nhóm | Mẫu | Dạng | Dùng khi |
|---|---|---|---|
| Phát huy theo chính tinh | CV-23…CV-36 | ii | đoạn nền QL-Snn-TOT/BINH; Quan Lộc **không** có Hóa Kỵ, sát tinh gốc. CV-25 ghi vế `QUAN-TDU-05/sáng`. CV-31 `tuoiTu 18`. CV-26 bỏ "số khách" |
| Vô chính diệu | CV-37 (`CHUNG-VCD-02/không cát tinh`, i); CV-38 (`CHUNG-VCD-02/có cát tinh`, ii) | i / ii | QL-VCD; tách theo lục cát tinh ở Quan Lộc, Mệnh, Tài Bạch, Phu Thê. QUAN-CC-01 bỏ khỏi mã bám |
| Hóa Kỵ gốc tại cung | CV-39 (QUAN-HOA-03) | i | thay mẫu phát huy |
| Sát tinh gốc tại cung | CV-40 Kình, CV-41 Đà, CV-42 Hỏa/Linh, CV-43 Không/Kiếp | i | thay mẫu phát huy; lời khuyên lấy từ câu QL-PS tương ứng |

Đủ 5 điều mục 6.0: mã bám nằm trong `maNghienCuu` của đoạn (mã đoạn nền ∪ mã câu bổ sung B2–B4) và (b) có câu dùng ý mã; mã nội dung; dạng i ưu tiên khi đoạn có lời khuyên; điều kiện vế máy đọc được (`quyTacId`, `saoTrongCung`, `khongSaoTrongCung`, `catTinhTamPhuong`); không tài chính, y tế, pháp lý. Câu ≤ 35 chữ, đo được trong 2–3 tháng.

## 3. Quy tắc NAM-MANG-07 (đã viết lại)

`docs/luan-giai/van-nam/QUY-TAC.md` mục 6. Điểm mới so với bản trước:
- Không áp dụng: dưới 15 tuổi; mọi đoạn nền **hãm** (QL-Snn-HAM, gồm QL-S04-HAM "dồn vốn"); 15–17 tuổi với QL-S04-*, QL-S07-BINH, QL-S14-BINH/HAM.
- (a) in mọi chính tinh + độ sáng + Hóa gốc, Hóa Kỵ và sát tinh gốc, Tuần/Triệt; vô chính diệu in chính tinh Phu Thê và lục cát tinh hội về.
- (b) thêm câu B1 (bỏ "giai đoạn đầu" từ 30 tuổi), B2 Tuần/Triệt (CHUNG-TUAN-05/06), B3 vô chính diệu (CHUNG-VCD-01/02/03, QUAN-CC-01), B4 câu QL-HOA-3, QL-PS-*.
- Câu dẫn NAM-MANG-01 in **trước** đoạn nền; (c) nối nguồn của mã (`ql-nguon-ma.json`).

Đề xuất câu thay cho QL-S04-HAM (phiếu Thư A1; Tùng/Bảo sửa `quy-tac.json` khi Minh duyệt, Thư xem lại): "Vũ Khúc hãm tại Quan Lộc: việc liên quan tiền bạc, số liệu dễ vất vả hơn mức bỏ ra. Nên ghi chép rõ các khoản trong công việc và hỏi người có chuyên môn trước quyết định lớn." Viết lại câu đầu 14 đoạn QL-Snn-HAM theo mặt cần chú ý (Đ3) là việc riêng, chưa làm trong lượt này.

## 4. Đo lại (giả lập trên bản sao tạm)

Cách đo: `git worktree` tạm `/tmp/hanh-ql2` tại HEAD a34b580; áp `gia-lap-nam-mang-07.patch` (tệp `nen-quan-loc.ts` + 4 chỗ trong `van-nam.ts`: chèn đoạn nền theo NAM-MANG-07, đọc `canCu` đã dựng, hai điều kiện mẫu mới); chép `ql-ma-nghien-cuu.json`, `ql-nguon-ma.json` vào `quy-tac-van/`; nối 21 mẫu (trường máy đọc) vào `viec-nen-lam.json`. Chạy `do-doan-du.cjs`. Bản sao đã xóa; `src/` của repo chính không đổi.

**5 lá số mục tiêu: 5/5 có đoạn nền đủ 4 phần ở Sự nghiệp** (trước 0/5).

| Lá số | Quan Lộc | Sự nghiệp trước → sau | Đoạn nền | Việc |
|---|---|---|---|---|
| Canh 1970 nữ 5/5h (57 tuổi) | Ngọ, vô chính diệu, Linh Tinh, Triệt; Phu Thê: Thiên Đồng (V, Khoa), Thái Âm (V, Kỵ) | 0 → 1 | QL-VCD + B1, B3 (không cát tinh, Triệt), QL-PS-11 | CV-42 bám QUAN-SP-07/Hỏa Linh |
| Canh 1980 nam 4/9h | Dần, Tham Lang (đắc) | 0 → 1 | QL-S09-TOT | CV-31 bám QUAN-THL-04 |
| Canh 1990 nữ 12/1h | Dần, vô chính diệu; Phu Thê: Thái Dương (hãm, Lộc), Cự Môn (đắc) | 0 → 1 | QL-VCD + B1, B3 | CV-37 bám CHUNG-VCD-02/không cát tinh |
| Canh 2000 nữ 5/5h | Ngọ, Liêm Trinh (V), Thiên Tướng (V), Triệt | 0 → 1 | QL-S06-TOT + B2 (TUAN-05) | CV-28 bám QUAN-LT-05 |
| Canh 2010 nam 4/9h (17 tuổi) | Dần, vô chính diệu; Phu Thê: Thiên Cơ (V), Thái Âm (V, Kỵ) | 0 → 1 | QL-VCD + B3 | CV-37 bám CHUNG-VCD-02/không cát tinh |

Hai lá số Thư yêu cầu thêm (có yếu tố năm nên NAM-MANG-07 không áp dụng): Canh 1990 nam 4/9h (Thái Âm hãm Hóa Kỵ) và Canh 2000 nam 4/9h (Thiên Tướng hãm): đoạn nền HAM giữ câu dẫn, không gắn mẫu; các đoạn năm giữ nguyên.

Đếm trên 28 lá số: đoạn nền đủ 4 phần **5** (đúng 5 lá số trên), **0** đoạn HAM gắn mẫu phát huy, **0** lần "dồn vốn"; 5/5 đoạn có đủ chính tinh (hoặc chính tinh Phu Thê) và Tuần/Triệt ở (a). Mảng Sự nghiệp trống (mốc trước đo ở HEAD 7e7b1d4, các commit sau không đụng luận giải) 6/28 → 1/28 (còn Canh 2010 nữ 5/5h: có yếu tố năm nhưng đoạn năm bị lọc tuổi, ngoài phạm vi NAM-MANG-07). Các mảng khác không đổi ở 28/28 lá số. Lá số có mảng trống: 18/28 → 16/28.

Bản in Sự nghiệp (giả lập):

```
### Canh 1970 nu 5/5h
- [câu dẫn nam-nay NAM-MANG-01-QUAN-NEN] Năm nay cung Quan Lộc không có yếu tố của năm chạm trực tiếp, nên mảng này chủ yếu đi theo nền sẵn có trên lá số; đó là năm để giữ nhịp đều hơn là chờ biến chuyển.
- [4 phần nen QL-VCD]
  (a) Cung Quan Lộc (Ngọ): vô chính diệu; Linh Tinh; có Triệt; mượn Thiên Đồng (vượng, Hóa Khoa), Thái Âm (vượng, Hóa Kỵ) ở Phu Thê (Tý).
  (b) Quan Lộc không có chính tinh: con đường sự nghiệp có xu hướng linh hoạt, chịu ảnh hưởng nhiều từ cung xung chiếu và hoàn cảnh; nên chọn hướng mình làm tốt nhất để theo lâu dài. Vì cung không có chính tinh, phần này mượn Thiên Đồng, Thái Âm từ cung Phu Thê để luận, lực yếu hơn sao đóng ngay tại cung. Tam phương không có cát tinh hội về, nên việc chính là xây nền tảng vững trước. Cung vô chính diệu gặp Triệt được phái Việt coi là thế thuận hơn: lúc đầu thường chậm, về sau rõ dần; khi việc tiến nhanh, nên giữ nhịp đều. Linh Tinh đồng cung Quan Lộc: nhạy bén, dễ căng thẳng, nên giữ nhịp nghỉ ngơi.
  (c) Toàn Thư, Tân Biên, Khảo Luận · tam hợp phái Việt
  (d) Sau mỗi 90 phút làm việc hoặc học liên tục, nghỉ 10 phút rời chỗ ngồi; ngày nào thấy căng, ghi một dòng điều gì làm mình căng. Cách đo: ≥ 4/5 ngày mỗi tuần có nghỉ đủ, trong 8 tuần (2 tháng) — CV-42 bám QUAN-SP-07/Hỏa Linh

### Canh 1980 nam 4/9h
- [câu dẫn nam-nay NAM-MANG-01-QUAN-NEN] Năm nay cung Quan Lộc không có yếu tố của năm chạm trực tiếp, nên mảng này chủ yếu đi theo nền sẵn có trên lá số; đó là năm để giữ nhịp đều hơn là chờ biến chuyển.
- [4 phần nen QL-S09-TOT]
  (a) Cung Quan Lộc (Dần): Tham Lang (đắc).
  (b) Tham Lang tại Quan Lộc: hợp môi trường năng động, nhiều mối quan hệ, cần giữ tập trung. Nên tận dụng duyên giao tiếp trong kinh doanh, bán hàng, ngoại giao và đặt mục tiêu rõ cho từng quý.
  (c) Tân Biên, Toàn Thư · tam hợp phái Việt
  (d) Mỗi tháng chủ động làm quen hoặc nối lại với hai người trong nghề; ghi một việc có thể cùng làm, và chỉ chọn theo một việc mỗi tháng. Cách đo: 6 người trong 3 tháng; mỗi tháng tối đa một việc mới được theo (3 tháng) — CV-31 bám QUAN-THL-04

### Canh 1990 nu 12/1h
- [câu dẫn nam-nay NAM-MANG-01-QUAN-NEN] Năm nay cung Quan Lộc không có yếu tố của năm chạm trực tiếp, nên mảng này chủ yếu đi theo nền sẵn có trên lá số; đó là năm để giữ nhịp đều hơn là chờ biến chuyển.
- [4 phần nen QL-VCD]
  (a) Cung Quan Lộc (Dần): vô chính diệu; mượn Thái Dương (hãm, Hóa Lộc), Cự Môn (đắc) ở Phu Thê (Thân).
  (b) Quan Lộc không có chính tinh: con đường sự nghiệp có xu hướng linh hoạt, chịu ảnh hưởng nhiều từ cung xung chiếu và hoàn cảnh; nên chọn hướng mình làm tốt nhất để theo lâu dài. Vì cung không có chính tinh, phần này mượn Thái Dương, Cự Môn từ cung Phu Thê để luận, lực yếu hơn sao đóng ngay tại cung. Tam phương không có cát tinh hội về, nên việc chính là xây nền tảng vững trước.
  (c) Toàn Thư, Tân Biên, Khảo Luận · tam hợp phái Việt
  (d) Ghi ra ba việc bạn làm tốt và hay được nhờ nhất, trong công việc hoặc việc học; chọn một việc và mỗi tuần dành một buổi để làm sâu hơn. Cách đo: Có danh sách ba việc; ≥ 10/12 tuần có buổi làm sâu (3 tháng) — CV-37 bám CHUNG-VCD-02/không cát tinh

### Canh 2000 nu 5/5h
- [câu dẫn nam-nay NAM-MANG-01-QUAN-NEN] Năm nay cung Quan Lộc không có yếu tố của năm chạm trực tiếp, nên mảng này chủ yếu đi theo nền sẵn có trên lá số; đó là năm để giữ nhịp đều hơn là chờ biến chuyển.
- [4 phần nen QL-S06-TOT]
  (a) Cung Quan Lộc (Ngọ): Liêm Trinh (vượng), Thiên Tướng (vượng); có Triệt.
  (b) Liêm Trinh tại Quan Lộc: hợp công việc đòi hỏi nguyên tắc và quản trị, cần mềm dẻo trong giao tiếp. Nên chọn môi trường có luật lệ rõ (pháp lý, quản lý, kỹ thuật) và giữ cân bằng giữa tham vọng với sự minh bạch. Cung Quan Lộc có Triệt: những nét trên thường bộc lộ chậm hơn, thuận lợi đến chậm và cần tự lực.
  (c) Tân Biên, Toàn Thư · tam hợp phái Việt
  (d) Viết ra ba nguyên tắc làm việc bạn muốn giữ (ví dụ: hứa là làm, số liệu rõ nguồn, nói thẳng mà mềm); cuối mỗi tuần tự chấm mình giữ được mấy điều. Cách đo: ≥ 10/12 tuần có tự chấm (3 tháng) — CV-28 bám QUAN-LT-05

### Canh 2010 nam 4/9h
- [câu dẫn nam-nay NAM-MANG-01-QUAN-NEN] Năm nay cung Quan Lộc không có yếu tố của năm chạm trực tiếp, nên mảng này chủ yếu đi theo nền sẵn có trên lá số; đó là năm để giữ nhịp đều hơn là chờ biến chuyển.
- [4 phần nen QL-VCD]
  (a) Cung Quan Lộc (Dần): vô chính diệu; mượn Thiên Cơ (vượng), Thái Âm (vượng, Hóa Kỵ) ở Phu Thê (Thân).
  (b) Quan Lộc không có chính tinh: con đường sự nghiệp có xu hướng linh hoạt, chịu ảnh hưởng nhiều từ cung xung chiếu và hoàn cảnh; nên thử vài vai trò khác nhau giai đoạn đầu rồi chọn hướng mình làm tốt nhất để theo lâu dài. Vì cung không có chính tinh, phần này mượn Thiên Cơ, Thái Âm từ cung Phu Thê để luận, lực yếu hơn sao đóng ngay tại cung. Tam phương không có cát tinh hội về, nên việc chính là xây nền tảng vững trước.
  (c) Toàn Thư, Tân Biên, Khảo Luận · tam hợp phái Việt
  (d) Ghi ra ba việc bạn làm tốt và hay được nhờ nhất, trong công việc hoặc việc học; chọn một việc và mỗi tuần dành một buổi để làm sâu hơn. Cách đo: Có danh sách ba việc; ≥ 10/12 tuần có buổi làm sâu (3 tháng) — CV-37 bám CHUNG-VCD-02/không cát tinh

### Canh 1990 nam 4/9h
- [câu dẫn nen QL-S08-HAM] Thái Âm tại Quan Lộc: hợp công việc cần sự cẩn trọng, chăm chút và làm việc âm thầm. Nên chọn môi trường ổn định và nói ra sớm khi việc không hợp chí hướng.
- [4 phần nam-nay NAM-HOA-LOC-HAM]
  (a) Cung Quan Lộc (Mão): Thái Âm (hãm), mang Hóa Kỵ gốc, nhận Hóa Lộc của năm.
  (b) Hóa Lộc của năm 2027 (Thái Âm) rơi vào cung Quan Lộc nhưng Thái Âm ở thế hãm: có lợi nhưng nhỏ và đến chậm, cần thêm công sức mới thấy kết quả.
  (c) Tân Biên, Toàn Thư, Tư liệu tham khảo trực tuyến · Tam hợp phái Việt
  (d) Chia việc chính đang làm thành các bước nhỏ; mỗi tuần làm xong một bước và đánh dấu vào danh sách. Cách đo: ≥ 10/12 tuần xong một bước (3 tháng) — CV-19 bám NAM-HOA-04/hãm
- [4 phần nam-nay NAM-HOA-08-KY-LOC-CANH]
  (a) Cung Quan Lộc (Mão): Thái Âm (hãm), mang Hóa Kỵ gốc, nhận Hóa Lộc của năm.
  (b) Thái Âm mang Hóa Kỵ trên lá số gốc (theo bảng Tứ hóa xemtuvi.vn dùng; can Canh khác bảng giữa các sách), năm nay lại nhận Hóa Lộc của năm. Theo cách xét tổng hợp (hóa của năm chạm hóa gốc cùng sao), đây thường là lúc điểm vướng cũ có cơ hội chuyển thành có lợi, nếu bạn chủ động gỡ thay vì né.
  (c) Khảo Luận, Nghiệm Lý, Tư liệu tham khảo trực tuyến · Tam hợp phái Việt · nhận xét tổng hợp của xemtuvi.vn
  (d) Hẹn cấp trên hoặc đồng nghiệp một buổi nói thẳng về một việc lâu nay còn vướng giữa hai bên, mang theo một cách gỡ bạn đề xuất. Cách đo: 1 buổi trong 2 tháng, có một dòng ghi kết quả (2 tháng) — CV-20 bám NAM-HOA-08/Kỵ-Lộc
- [4 phần nam-nay NAM-TT-06]
  (a) Cung Quan Lộc (Mão): Bạch Hổ của năm.
  (b) Cung Quan Lộc có sao lưu của vòng Thái Tuế (Tang Môn, Bạch Hổ, Khốc hoặc Hư của năm): việc của lĩnh vực này cần nhiều tâm sức hơn, cảm xúc có lúc chùng; nên dành thời gian và giữ nhịp nghỉ.
  (c) Toàn Thư, Tân Biên · Tam hợp phái Việt
  (d) Đặt một giờ kết thúc ngày làm việc và giữ ít nhất 4 ngày mỗi tuần; việc chưa xong ghi vào danh sách cho sáng hôm sau. Cách đo: ≥ 6/8 tuần giữ đủ 4 ngày (2 tháng) — CV-09 bám NAM-TT-06

### Canh 2000 nam 4/9h
- [câu dẫn nen QL-S11-HAM] Thiên Tướng tại Quan Lộc: hợp vai trò hỗ trợ, phối hợp, đại diện hoặc cố vấn. Nên chọn cấp trên, môi trường đáng tin và giữ chuẩn mực của mình.
- [4 phần nam-nay NAM-TT-06]
  (a) Cung Quan Lộc (Mão): Bạch Hổ của năm.
  (b) Cung Quan Lộc có sao lưu của vòng Thái Tuế (Tang Môn, Bạch Hổ, Khốc hoặc Hư của năm): việc của lĩnh vực này cần nhiều tâm sức hơn, cảm xúc có lúc chùng; nên dành thời gian và giữ nhịp nghỉ.
  (c) Toàn Thư, Tân Biên · Tam hợp phái Việt
  (d) Đặt một giờ kết thúc ngày làm việc và giữ ít nhất 4 ngày mỗi tuần; việc chưa xong ghi vào danh sách cho sáng hôm sau. Cách đo: ≥ 6/8 tuần giữ đủ 4 ngày (2 tháng) — CV-09 bám NAM-TT-06
```

## 5. Việc cho Tùng khi nạp (Minh quyết)

1. Viết phần bộ ghép theo NAM-MANG-07 (tham khảo `gia-lap-nam-mang-07.patch`, chỉ là bản giả lập để đo): chèn đoạn nền sau câu dẫn, dựng (a), (b) B1–B4, (c), mã nghiên cứu hợp nhất; hai điều kiện mẫu mới `khongSaoTrongCung`, `catTinhTamPhuong`.
2. Chép `ql-ma-nghien-cuu.json`, `ql-nguon-ma.json`; nối CV-23…CV-43 (trường máy đọc) vào `viec-nen-lam.json` sau CV-22 khi Thư duyệt; test đếm số mẫu tăng 21.
3. Sửa câu QL-S04-HAM khi Minh duyệt câu thay ở mục 3.

## 6. Rủi ro, điểm Thư cần xem

- 14 đoạn hãm vẫn chỉ là câu dẫn cho tới khi viết lại câu đầu (Đ3); lá số có Quan Lộc hãm và không có yếu tố năm sẽ còn mảng Sự nghiệp không có đoạn 4 phần.
- Đoạn VCD dài (tới 5 câu ở Canh 1970 nữ 5/5h); Thư xem độ dài.
- Câu B2/B3 là câu khuôn có biến; khác lá số chỉ khác tên sao.
- Chưa nạp vào `src/`; cần Thư duyệt lại.
