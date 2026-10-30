# Sửa theo phiếu Thư L-5e7bce: Đ5, S4, S5, N1 (Hạnh, 30/10/2026)

Đầu vào: `phieu-thu-L-5e7bce.md` mục 1.3 (Đ5, S4, S5, N1). Không đổi giá/gói, không đổi mẫu CV-xx, không gắn mẫu "phát huy" cho đoạn HAM.
Lưu ý commit: phần Đ5 + N1 (quy-tac.json, ql-ma-nghien-cuu.json, ql-nguon-ma.json) đã nằm trong commit **2a81acf** của Tùng (L-28bc46): Tùng commit đúng lúc Hạnh đã `git add`, nên tệp của Hạnh đi chung commit đó. Nội dung là của Hạnh, không do Tùng sửa.

## 1. Đ5: câu đầu 14 đoạn QL-Snn-HAM (đã sửa trong `src/lib/luan-giai/ai/quy-tac.json`)

Câu đầu mở bằng mặt cần chú ý, bám vế (b) hãm của từng sao; câu "Nên…" giữ nguyên (Thư đã duyệt), riêng QL-S04-HAM áp câu thay A2 đúng chỗ Thư sửa ("kết quả dễ ít hơn công sức bỏ ra"). Mã vế hãm thêm vào đầu danh sách mã của đoạn trong `ql-ma-nghien-cuu.json`; nguồn của mã mới thêm vào `ql-nguon-ma.json`.

| Đoạn | Sao | Câu đầu mới | Mã (vế hãm trước) |
|---|---|---|---|
| QL-S01-HAM | Tử Vi | Tử Vi tại Quan Lộc khi kém sáng: công danh thường ở mức bình thường, có tài nhưng dễ thiếu người phò tá, việc lớn khó tự mình gánh hết. | QUAN-TV-02, QUAN-TV-05 |
| QL-S02-HAM | Thiên Cơ | Thiên Cơ hãm tại Quan Lộc: vẫn giỏi suy tính, nhưng đường công việc thường đến muộn và chật vật, dễ phải đổi vị trí khi kế hoạch chưa chín. | QUAN-TCO-02, QUAN-TCO-04 |
| QL-S03-HAM | Thái Dương | Thái Dương hãm tại Quan Lộc: có năng lực nhưng ít dịp được nhìn thấy, đường công việc thường vất vả lúc đầu và rõ dần về sau; người xung quanh vẫn nể bạn vì sự tử tế và chữ nghĩa. | QUAN-TDU-02, QUAN-TDU-05 |
| QL-S04-HAM | Vũ Khúc | Vũ Khúc hãm tại Quan Lộc: với việc liên quan tiền bạc, số liệu, kết quả dễ ít hơn công sức bỏ ra. | QUAN-VK-02, QUAN-VK-04 |
| QL-S05-HAM | Thiên Đồng | Thiên Đồng hãm tại Quan Lộc: dễ chán và muốn đổi việc khi chưa đủ lâu, nên công danh thường đến muộn và uy tín khó tích lũy. | QUAN-TD-02, QUAN-TD-04 |
| QL-S06-HAM | Liêm Trinh | Liêm Trinh hãm tại Quan Lộc: đường công việc dễ gặp trở ngại, va chạm về nguyên tắc và quyền lợi; vị trí càng nhạy cảm càng cần rõ ràng. | QUAN-LT-03, QUAN-LT-04, QUAN-LT-05 |
| QL-S07-HAM | Thiên Phủ | Thiên Phủ tại Quan Lộc khi kém sáng: vẫn thận trọng, giỏi giữ, nhưng vị trí hay chức danh thường chỉ bền một thời gian, gặp Không Kiếp thì thành quả ở mức bình thường. | QUAN-TP-02, QUAN-TP-03 |
| QL-S08-HAM | Thái Âm | Thái Âm hãm tại Quan Lộc: đường công việc thường nhiều trở ngại và đến muộn, kỳ vọng cao dễ khiến việc bỏ dở giữa chừng; bù lại bạn được nể vì sự tử tế và cách diễn đạt. | QUAN-TA-02, QUAN-TA-04 |
| QL-S09-HAM | Tham Lang | Tham Lang hãm tại Quan Lộc: vị trí công việc dễ lên xuống thất thường, dễ phân tán vì nhiều mối quan hệ và gặp cám dỗ về quyền lợi. | QUAN-THL-02, QUAN-THL-04 |
| QL-S10-HAM | Cự Môn | Cự Môn hãm tại Quan Lộc: giỏi lý luận, xét đoán nhưng lời nói dễ thành thị phi, bị hiểu lầm hoặc gièm pha; đường công việc dễ trắc trở lúc đầu và hay thay đổi. | QUAN-CM-02, QUAN-CM-03 |
| QL-S11-HAM | Thiên Tướng | Thiên Tướng hãm tại Quan Lộc: vị trí công việc dễ lên xuống, có lúc thành lúc chưa, và chịu ảnh hưởng nhiều từ người mình làm cùng. | QUAN-TT-02, QUAN-TT-04 |
| QL-S12-HAM | Thiên Lương | Thiên Lương hãm tại Quan Lộc: dễ chóng chán, thích thay đổi và di chuyển, nên thành quả công việc khó tích lũy lâu dài. | QUAN-TL-02, QUAN-TL-04 |
| QL-S13-HAM | Thất Sát | Thất Sát hãm tại Quan Lộc: vẫn dám nhận việc khó, nhưng con đường công việc dễ không bền, có giai đoạn áp lực cao; việc có rủi ro cần làm đúng quy trình an toàn. | QUAN-TS-02, QUAN-TS-04 |
| QL-S14-HAM | Phá Quân | Phá Quân hãm tại Quan Lộc: đường công việc dễ trắc trở, hay đổi hướng, thành quả có được rồi khó giữ lâu; thường thuận hơn khi làm bằng tay nghề, kỹ thuật. | QUAN-PQ-02, QUAN-PQ-04 |

Ghi chú:
- Tử Vi và Thiên Phủ **không có độ sáng Hãm** trong engine (quét 1960–2011, 36 giờ/năm: Tử Vi chỉ Miếu/Vượng/Đắc/Bình; Thiên Phủ cũng vậy). QL-S01-HAM, QL-S07-HAM hiện không bao giờ khớp; vẫn viết lại theo vế "bình/gặp sát" (QUAN-TV-02, QUAN-TP-02) và ghi "khi kém sáng", không ghi "hãm".
- Những ý sách gốc nặng đã trung tính hóa: QUAN-TS-02 ("rủi ro cao về an toàn" → "việc có rủi ro cần làm đúng quy trình an toàn"), QUAN-THL-02 ("quan tham" → "cám dỗ về quyền lợi"), QUAN-LT-03 (bỏ "rắc rối pháp lý", giữ "va chạm về nguyên tắc và quyền lợi"), QUAN-TA-02 TT 「氣高橫破」 → "kỳ vọng cao dễ khiến việc bỏ dở giữa chừng".
- Nghiệm thu: so câu đầu HAM với câu đầu TOT cùng sao: **0/14 trùng**; `grep -c "dồn vốn" src/lib/luan-giai/ai/quy-tac.json` = **0**; 0 từ trong `tu-cam.json`. Test `luan-giai-*`, `npm test` đạt (391/391).

## 2. S4, S5, N1 trong bản giả lập NAM-MANG-07 (`gia-lap-nam-mang-07.patch`, cập nhật)

Việc cho **Bảo** khi viết bản thật (Hạnh không sửa `src` ngoài dữ liệu luận):
1. **S4 – vế B3 cho VCD.** Với mỗi chính tinh cung xung chiếu (Phu Thê):
   - độ sáng Hãm: thêm câu "`<Sao>` mượn về ở thế hãm, nên mang theo mặt cần chú ý của sao này, ở mức nhẹ hơn khi sao đóng ngay tại Quan Lộc: `<vế sau dấu hai chấm của câu đầu QL-Snn-HAM>`." Mã: mã của QL-Snn-HAM + CHUNG-VCD-01.
   - mang Hóa Kỵ (trừ Nhật Nguyệt đồng cung Sửu/Mùi, ngoại lệ của QUAN-HOA-03): thêm câu "`<Sao>` mang Hóa Kỵ chiếu sang: công việc có lúc gặp chuyện phiền lòng, dễ trắc trở, nhưng ở mức nhẹ hơn khi Hóa Kỵ đóng ngay tại Quan Lộc." Mã: QUAN-HOA-03, CHUNG-VCD-01.
2. **S5 – sao thứ hai đồng cung.** Với chính tinh khác sao của đoạn nền: lấy đoạn QL-Snn theo độ sáng của chính nó (TOT/BINH/HAM), nối "`<Sao>` cùng cung thêm nét: `<vế câu đầu>`." (sáng/bình) hoặc "`<Sao>` cùng cung ở thế hãm: `<vế câu đầu>`." Mã: mã của đoạn đó.
3. **N1 – (c).** `ql-nguon-ma.json`: CHUNG-TUAN-05 = WC6, CHUNG-VCD-03 = WC6, WC7 (ghi "Tư liệu web: …", hiển thị "Tư liệu tham khảo trực tuyến"). Vì (c) chỉ in 3 tên sách đầu, nguồn của CHUNG-VCD-03 / CHUNG-TUAN-05 phải xếp ngay sau nguồn đoạn nền; VCD không có Tuần/Triệt thì bỏ CHUNG-VCD-03 khỏi mã.
4. **Hồi quy do 2a81acf (L-28bc46):** Quan Lộc VCD không còn QL-VCD ở mục `phong-cach` (nhường KHUNG-quan-loc-VCD-chinh*), nên NAM-MANG-07 mất đoạn nền ở 3 lá VCD (in trước khi sửa: Canh 1970 nữ, 2010 nam chỉ còn câu dẫn). Bản giả lập thêm `nenVcd`: không có đoạn `phong-cach` mà Quan Lộc VCD thì lấy thẳng QL-VCD từ `quy-tac.json`. Bảo cần làm tương tự.
5. Câu KHUNG-quan-loc-VCD-chinh-Tuan/-Triet ("phái Việt coi … thuận hơn") ở bài 12 cung có `maNghienCuu` CHUNG-VCD-03 nhưng `nguon` chỉ TT, TB: cùng lỗi N1, ngoài phạm vi việc này, báo Minh chuyển Tùng.

HAM vẫn **chưa** in đủ 4 phần: câu đầu đã đạt điều kiện Đ3, nhưng chưa có mẫu (d) dạng (i)/(iii) cho HAM (phiếu mục 2a). Mở HAM cần Thư duyệt Đ5 rồi giao viết mẫu riêng.

## 3. Đo lại (bản sao tạm `/tmp/hanh-ql3` tại HEAD 2a81acf + patch + 2 JSON + 21 mẫu)

Trên 25 lá số Canh: đoạn nền đủ 4 phần **5**; **0** đoạn HAM gắn mẫu; **0** lá có "dồn vốn" (cả bài); **0** đoạn thiếu chính tinh/Tuần/Triệt ở (a); câu S5 **1** (Canh 2000 nữ), câu S4 **3** (Canh 1970 nữ Kỵ, Canh 2010 nam Kỵ, Canh 1990 nữ 12/1h Thái Dương hãm). Bảng đầy đủ `do-doan-du.cjs`: `sau-d5-s4-s5.md` (lá số có mảng trống 16/28, như lần 2).

Bản in Sự nghiệp (in bằng `in-su-nghiep.cjs`; 5 lá số phiếu mục 4 điều 2, thêm Canh 1990 nữ 12/1h cho S4 hãm):

```
### Canh 1970 nu 5/5h
- [câu dẫn nam-nay NAM-MANG-01-QUAN-NEN] Năm nay cung Quan Lộc không có yếu tố của năm chạm trực tiếp, nên mảng này chủ yếu đi theo nền sẵn có trên lá số; đó là năm để giữ nhịp đều hơn là chờ biến chuyển.
- [4 phần nen QL-VCD]
  (a) Cung Quan Lộc (Ngọ): vô chính diệu; Linh Tinh; có Triệt; mượn Thiên Đồng (vượng, Hóa Khoa), Thái Âm (vượng, Hóa Kỵ) ở Phu Thê (Tý).
  (b) Quan Lộc không có chính tinh: con đường sự nghiệp có xu hướng linh hoạt, chịu ảnh hưởng nhiều từ cung xung chiếu và hoàn cảnh; nên chọn hướng mình làm tốt nhất để theo lâu dài. Vì cung không có chính tinh, phần này mượn Thiên Đồng, Thái Âm từ cung Phu Thê để luận, lực yếu hơn sao đóng ngay tại cung. Thái Âm mang Hóa Kỵ chiếu sang: công việc có lúc gặp chuyện phiền lòng, dễ trắc trở, nhưng ở mức nhẹ hơn khi Hóa Kỵ đóng ngay tại Quan Lộc. Tam phương không có cát tinh hội về, nên việc chính là xây nền tảng vững trước. Cung vô chính diệu gặp Triệt được phái Việt coi là thế thuận hơn: lúc đầu thường chậm, về sau rõ dần; khi việc tiến nhanh, nên giữ nhịp đều. Linh Tinh đồng cung Quan Lộc: nhạy bén, dễ căng thẳng, nên giữ nhịp nghỉ ngơi.
  (c) Toàn Thư, Tư liệu tham khảo trực tuyến, Tân Biên · tam hợp phái Việt
  (d) Sau mỗi 90 phút làm việc hoặc học liên tục, nghỉ 10 phút rời chỗ ngồi; ngày nào thấy căng, ghi một dòng điều gì làm mình căng. Cách đo: ≥ 4/5 ngày mỗi tuần có nghỉ đủ, trong 8 tuần (2 tháng) — CV-42 bám QUAN-SP-07/Hỏa Linh

### Canh 2000 nu 5/5h
- [câu dẫn nam-nay NAM-MANG-01-QUAN-NEN] Năm nay cung Quan Lộc không có yếu tố của năm chạm trực tiếp, nên mảng này chủ yếu đi theo nền sẵn có trên lá số; đó là năm để giữ nhịp đều hơn là chờ biến chuyển.
- [4 phần nen QL-S06-TOT]
  (a) Cung Quan Lộc (Ngọ): Liêm Trinh (vượng), Thiên Tướng (vượng); có Triệt.
  (b) Liêm Trinh tại Quan Lộc: hợp công việc đòi hỏi nguyên tắc và quản trị, cần mềm dẻo trong giao tiếp. Nên chọn môi trường có luật lệ rõ (pháp lý, quản lý, kỹ thuật) và giữ cân bằng giữa tham vọng với sự minh bạch. Thiên Tướng cùng cung thêm nét: hợp vai trò hỗ trợ, phối hợp, đại diện hoặc cố vấn. Cung Quan Lộc có Triệt: những nét trên thường bộc lộ chậm hơn, thuận lợi đến chậm và cần tự lực.
  (c) Tân Biên, Tư liệu tham khảo trực tuyến, Toàn Thư · tam hợp phái Việt
  (d) Viết ra ba nguyên tắc làm việc bạn muốn giữ (ví dụ: hứa là làm, số liệu rõ nguồn, nói thẳng mà mềm); cuối mỗi tuần tự chấm mình giữ được mấy điều. Cách đo: ≥ 10/12 tuần có tự chấm (3 tháng) — CV-28 bám QUAN-LT-05

### Canh 1990 nam 4/9h
- [câu dẫn nen QL-S08-HAM] Thái Âm hãm tại Quan Lộc: đường công việc thường nhiều trở ngại và đến muộn, kỳ vọng cao dễ khiến việc bỏ dở giữa chừng; bù lại bạn được nể vì sự tử tế và cách diễn đạt. Nên chọn môi trường ổn định và nói ra sớm khi việc không hợp chí hướng.
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
- [câu dẫn nen QL-S11-HAM] Thiên Tướng hãm tại Quan Lộc: vị trí công việc dễ lên xuống, có lúc thành lúc chưa, và chịu ảnh hưởng nhiều từ người mình làm cùng. Nên chọn cấp trên, môi trường đáng tin và giữ chuẩn mực của mình.
- [4 phần nam-nay NAM-TT-06]
  (a) Cung Quan Lộc (Mão): Bạch Hổ của năm.
  (b) Cung Quan Lộc có sao lưu của vòng Thái Tuế (Tang Môn, Bạch Hổ, Khốc hoặc Hư của năm): việc của lĩnh vực này cần nhiều tâm sức hơn, cảm xúc có lúc chùng; nên dành thời gian và giữ nhịp nghỉ.
  (c) Toàn Thư, Tân Biên · Tam hợp phái Việt
  (d) Đặt một giờ kết thúc ngày làm việc và giữ ít nhất 4 ngày mỗi tuần; việc chưa xong ghi vào danh sách cho sáng hôm sau. Cách đo: ≥ 6/8 tuần giữ đủ 4 ngày (2 tháng) — CV-09 bám NAM-TT-06

### Canh 2010 nam 4/9h
- [câu dẫn nam-nay NAM-MANG-01-QUAN-NEN] Năm nay cung Quan Lộc không có yếu tố của năm chạm trực tiếp, nên mảng này chủ yếu đi theo nền sẵn có trên lá số; đó là năm để giữ nhịp đều hơn là chờ biến chuyển.
- [4 phần nen QL-VCD]
  (a) Cung Quan Lộc (Dần): vô chính diệu; mượn Thiên Cơ (vượng), Thái Âm (vượng, Hóa Kỵ) ở Phu Thê (Thân).
  (b) Quan Lộc không có chính tinh: con đường sự nghiệp có xu hướng linh hoạt, chịu ảnh hưởng nhiều từ cung xung chiếu và hoàn cảnh; nên thử vài vai trò khác nhau giai đoạn đầu rồi chọn hướng mình làm tốt nhất để theo lâu dài. Vì cung không có chính tinh, phần này mượn Thiên Cơ, Thái Âm từ cung Phu Thê để luận, lực yếu hơn sao đóng ngay tại cung. Thái Âm mang Hóa Kỵ chiếu sang: công việc có lúc gặp chuyện phiền lòng, dễ trắc trở, nhưng ở mức nhẹ hơn khi Hóa Kỵ đóng ngay tại Quan Lộc. Tam phương không có cát tinh hội về, nên việc chính là xây nền tảng vững trước.
  (c) Toàn Thư, Tân Biên, Khảo Luận · tam hợp phái Việt
  (d) Ghi ra ba việc bạn làm tốt và hay được nhờ nhất, trong công việc hoặc việc học; chọn một việc và mỗi tuần dành một buổi để làm sâu hơn. Cách đo: Có danh sách ba việc; ≥ 10/12 tuần có buổi làm sâu (3 tháng) — CV-37 bám CHUNG-VCD-02/không cát tinh

### Canh 1990 nu 12/1h
- [câu dẫn nam-nay NAM-MANG-01-QUAN-NEN] Năm nay cung Quan Lộc không có yếu tố của năm chạm trực tiếp, nên mảng này chủ yếu đi theo nền sẵn có trên lá số; đó là năm để giữ nhịp đều hơn là chờ biến chuyển.
- [4 phần nen QL-VCD]
  (a) Cung Quan Lộc (Dần): vô chính diệu; mượn Thái Dương (hãm, Hóa Lộc), Cự Môn (đắc) ở Phu Thê (Thân).
  (b) Quan Lộc không có chính tinh: con đường sự nghiệp có xu hướng linh hoạt, chịu ảnh hưởng nhiều từ cung xung chiếu và hoàn cảnh; nên chọn hướng mình làm tốt nhất để theo lâu dài. Vì cung không có chính tinh, phần này mượn Thái Dương, Cự Môn từ cung Phu Thê để luận, lực yếu hơn sao đóng ngay tại cung. Thái Dương mượn về ở thế hãm, nên mang theo mặt cần chú ý của sao này, ở mức nhẹ hơn khi sao đóng ngay tại Quan Lộc: có năng lực nhưng ít dịp được nhìn thấy, đường công việc thường vất vả lúc đầu và rõ dần về sau; người xung quanh vẫn nể bạn vì sự tử tế và chữ nghĩa. Tam phương không có cát tinh hội về, nên việc chính là xây nền tảng vững trước.
  (c) Toàn Thư, Tân Biên, Khảo Luận · tam hợp phái Việt
  (d) Ghi ra ba việc bạn làm tốt và hay được nhờ nhất, trong công việc hoặc việc học; chọn một việc và mỗi tuần dành một buổi để làm sâu hơn. Cách đo: Có danh sách ba việc; ≥ 10/12 tuần có buổi làm sâu (3 tháng) — CV-37 bám CHUNG-VCD-02/không cát tinh

```
