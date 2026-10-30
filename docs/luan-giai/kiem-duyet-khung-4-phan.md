# Phiếu kiểm duyệt: 12 đoạn mẫu Vận năm 2027 theo khung 4 phần (việc L-fd4220, bước 2)

- Người kiểm: Thư (kiểm duyệt). Ngày 30/10/2026. Người viết: Hạnh.
- Bài chấm: `docs/luan-giai/van-nam/mau-khung-4-phan.md` (commit b4a0bfe).
- Đối chiếu: lá số `van-nam/du-lieu.md` (VN01, VN02, VN03); quy tắc `van-nam/QUY-TAC.md`, `kiem-nguon-duc.md`, `docs/nghien-cuu/luan-giai/dai-van.md`, `docs/nghien-cuu/luan-giai-12-cung.md`; khung `khung-doan-tra-phi.md` mục 6, 6.1, 8; thang `docs/nghien-cuu/bang-cham-chat-luong.md`.
- Thư không sửa đoạn. Lỗi trả Hạnh kèm cách sửa (mục 4). Đề xuất danh mục 6.1 chuyển Minh chốt (mục 2).

---

## 1. Quy định "việc nên làm" bám quy tắc có nguồn (bổ sung khung mục 6)

Mục đích: phần (d) phải suy ra từ ý nghĩa hoặc lời khuyên của chính mã quy tắc mà phần (b) đã dùng, không suy từ tên sao hay hình tượng sao.

**Hợp lệ khi đủ cả 5 điều:**
1. **Mã bám (`maHuong`) nằm trong `maNghienCuu` của đoạn và phần (b) có câu dùng ý của mã đó.** Mã chỉ có trong mã ẩn mà (b) không nói thì không được làm mã bám.
2. **Mã bám là mã nội dung**: mã mô tả tính chất, ý nghĩa, rủi ro hoặc lời khuyên (CHUNG-HOA, CHUNG-CT, VAN-CT, VAN-SP, NAM-HOA, NAM-LUU, NAM-TT-02…06, NAM-TH-03/04, NAM-MANG-02…05, MENH-, PHU-, TAI-, QUAN-, TAT-<sao>-…). **Không** dùng mã phương pháp (NAM-PP, NAM-MANG-01, NAM-TH-01/02, NAM-TT-01, CHUNG-PP, TAT-YN-01…04 kiểu "phải cân hai nhóm sao"), mã điều cấm (CAM), mã tranh luận (TRANH).
3. **Việc là một trong ba dạng, ưu tiên theo thứ tự**: (i) cách làm cụ thể của **lời khuyên có sẵn trong câu quy tắc** ("nên chốt kế hoạch", "nên rà soát kỹ văn bản", "thỏa thuận thành văn bản", "dành thời gian", "khám định kỳ"); (ii) phát huy **điểm mạnh** mã mô tả (mẫu "phát huy", mã in nghiêng ở 6.1); (iii) giảm **đúng rủi ro** mã mô tả (vd "dễ nóng lời" → quy ước khi bất đồng). Dạng (ii), (iii) ghi `tongHop`.
4. **Điều kiện của mã đủ trên lá số, kể cả vế loại trừ.** Mã có nhiều vế chỉ dùng vế đã kích hoạt và ghi rõ vế trong mã ẩn: `CHUNG-HOA-TCO-01/Kỵ`, `NAM-TH-03/Kỵ`, `VAN-SP-06/thận trọng`. Sao "tô thêm" (NAM-TT-06, CHUNG-SP-08…) chỉ làm mã bám khi sao ở **ngay** cung chủ đề của đoạn.
5. **Giữ giới hạn an toàn** (khung 6, quy tắc 3): tài chính chỉ là hành vi ghi chép, chờ, đọc lại, chốt bằng chữ, hỏi người có chuyên môn; không bảo vay, trả, gia hạn, tái cơ cấu, mua, bán, đầu tư, chọn sản phẩm, chọn thời điểm. Sức khỏe chỉ là nếp sống (ngủ, nghỉ, vận động, ghi năng lượng) và khám sức khỏe **tổng quát** định kỳ có điều kiện ("nếu đã hơn 12 tháng"); không chuyên khoa, xét nghiệm, thuốc, ăn kiêng, bộ phận cơ thể.

**Không hợp lệ (ví dụ):**
- Suy từ tên/hình tượng sao: Thiên Mã → "đi du lịch"; Lộc Tồn → "mở sổ tiết kiệm"; Thiên Y → "uống thuốc bổ"; Hồng Loan → "đi xem mắt tháng này".
- Suy từ mã phương pháp: SK-04 bám TAT-YN-03 ("phải cân hai nhóm sao") — mã này không nói điều gì về người đọc.
- Lấy sao lưu làm căn cứ chọn thời điểm cho một hành động tài chính, pháp lý (NAM-LUU-04).

**Biến thể câu mẫu**: được thay đối tượng theo cung/`nguoiLienQuan` và thêm một thước đo suy từ chính quy tắc (vd thêm "số lần đổi mục tiêu = 0" vì CHUNG-HOA-TCO-01/Kỵ nói "hay đổi ý"). Không đổi động từ chính, không thêm hành động mới; đổi hành động là mẫu mới, phải đề xuất.

**Ghi trong mã ẩn**: `việc: <maMau> bám <mã>/<vế>; dạng i|ii|iii; tongHop`.

---

## 2. Duyệt mẫu mới và mã bám Hạnh đề xuất

| Đề xuất | Kết luận Thư | Điều kiện, lý do |
|---|---|---|
| **TC-07** (gom giấy tờ tài chính, đọc lại, đánh dấu điều chưa rõ để hỏi người có chuyên môn; bám VAN-SP-06, NAM-LUU-04-SAT) | **Duyệt có điều kiện** | Dạng (i): VAN-SP-06 có lời khuyên "nên rà soát kỹ văn bản" (nguồn TT q.2 文昌入限, đã đọc), không cần Đức kiểm thêm. Chỉ dùng khi vế thận trọng của VAN-SP-06 kích hoạt tại Tài Bạch (Xương/Khúc gốc hoặc của năm ở Tài Bạch, hãm hoặc gặp Kình, Đà, Hóa Kỵ). Câu mẫu giữ nguyên "hỏi người có chuyên môn"; cấm thêm động từ quyết định (tất toán, gia hạn, đổi, vay, mua, bán). Qua cổng an toàn (mục 3). |
| **CV-08** (nhờ người tin tưởng đọc soát văn bản quan trọng; bám VAN-SP-06) | **Duyệt có điều kiện, sửa câu** | Bám đúng dạng (i). Hai chỗ phải sửa trước khi vào 6.1: (1) "một người (bạn) tin tưởng" → "một đồng nghiệp hoặc người được phép xem nội dung" (văn bản công việc đưa cho bạn ngoài đọc có thể vi phạm bảo mật nơi làm việc); (2) "mọi văn bản quan trọng" → "văn bản gửi ra ngoài mang tên bạn (hợp đồng, báo cáo, đề xuất)" cho làm được trong 3 tháng. Chỉ dùng khi Xương/Khúc hóa Kỵ hoặc gặp Kình, Đà, Kỵ tại Quan Lộc hoặc tại cung trọng điểm năm mang chủ đề công việc. |
| **CV-02 + CHUNG-HOA-TCO-01** | **Duyệt, chỉ vế Kỵ** | Ghi `CHUNG-HOA-TCO-01/Kỵ` (Thiên Cơ hóa Kỵ, tuổi Mậu: "nên chốt kế hoạch và làm đến cùng"). Vế Lộc, Quyền, Khoa của mã này không bám CV-02. |
| **CV-02 + NAM-TH-03** | **Duyệt, chỉ vế Hóa Kỵ gốc tại cung tiểu hạn** | Ghi `NAM-TH-03/Kỵ` ("năm có một việc chưa trọn ý, cần kiên trì"). Biến thể câu ở đoạn 6 ("việc tồn đọng lâu nhất, chia bước, mỗi tuần một bước") hợp lệ theo mục 1 (đổi đối tượng, giữ cấu trúc 12 tuần). |
| **TT-02 + NAM-TT-06** | **Duyệt có điều kiện** | Chỉ khi L. Thiên Khốc, L. Thiên Hư, L. Tang Môn hoặc L. Bạch Hổ ở **ngay** cung Phu Thê và (b) đã nêu sao đó; không dùng khi sao chỉ ở xung chiếu, tam phương. Câu việc không được nhắc tang, tai nạn (NAM-TT-06). |
| Phát hiện thêm (không thuộc đề xuất của Hạnh) | **Đề nghị Minh sửa 6.1** | (a) Cột "Bám quy tắc" của **SK-04** đang ghi TAT-YN-02, TAT-YN-03 là mã phương pháp, trái mục 1 điều 2 → đổi thành NAM-MANG-05 (nếp sống, nghỉ ngơi) và TAT-SP-04. (b) **SK-01** thêm NAM-MANG-05 (bảng tháng T5 đã bám mã này). (c) **TC-05** thêm vế cách đo: "không phát sinh giao dịch lớn thì ghi 'không có'", tránh thước đo rỗng. |

---

## 3. Cổng an toàn: Sức khỏe, Tài chính (SK-01, TC-05 và mọi đoạn liên quan)

| Đoạn / dòng | Việc nên làm | Kết luận | Lý do |
|---|---|---|---|
| Đoạn 8, **SK-01** | Nếu đã hơn 12 tháng chưa khám sức khỏe tổng quát, đặt lịch khám trong 3 tháng tới | **Qua** | Khám tổng quát định kỳ, có điều kiện; không chuyên khoa, xét nghiệm, bộ phận, thuốc (NAM-MANG-05, VAN-CAM-04). Câu (b) "những điều âm thầm, khó tự nhận biết" là cách diễn đạt đã trung tính hóa của TAT-VK-02, không nêu bệnh. |
| Đoạn 4, SK-04 | Ghi năng lượng mỗi tối, xem lại theo chuyến đi | **Qua** | Chỉ nếp sống. Lỗi mã bám (TAT-YN-03) là lỗi truy nguồn, không phải lỗi an toàn. |
| Bảng tháng T5 (VN03) | Đặt lịch khám định kỳ nếu đã hơn 12 tháng | **Qua** | Như SK-01. |
| Đoạn 2, **TC-05** | Trước khi ký hay chuyển tiền cho giao dịch lớn hơn {mức tự chọn}, đọc lại giấy tờ và hỏi người có chuyên môn | **Qua** | Thói quen kiểm tra, không bảo làm hay không làm giao dịch, không chọn thời điểm; người đọc tự đặt mức. |
| Đoạn 7, TC-07 | Gom giấy tờ tài chính, đánh dấu điều chưa rõ để hỏi người có chuyên môn | **Qua** | "khoản vay, bảo hiểm" chỉ là ví dụ loại giấy tờ; không khuyên vay, gia hạn, tái cơ cấu (lỗi 5 cũ đã sửa). |
| Bảng tháng T3, T6 (VN03) | Ghi rõ phần góp bằng tin nhắn; chốt bằng chữ thỏa thuận tiền bạc | **Qua** | Hành vi ghi chép, chốt điều khoản (VAN-CT-TP-02, NAM-HOA-08(b)). |
| Đoạn 9 (b) | "thuận việc nhà cửa, mua sắm cho gia đình" | **Qua** (nên sửa) | Câu mô tả, không phải lời khuyên; nhưng "mua sắm" dễ đọc thành gợi ý chi tiền. Dùng đúng chữ NAM-HOA-04: "chi tiêu gia đình". |

Cả 12 đoạn: có câu ghi nội dung do hệ thống tạo ở đầu mỗi bài (NAM-CAM-04); lọc `tu-cam.json` (74 mục) trên phần khách thấy: 0 từ trùng; không tên, ngày sinh thật (3 lá số giả lập). **Không đoạn nào trượt cổng an toàn.**

---

## 4. Chấm 12 đoạn

Thang 1–5 (Đúng · Sâu · Cụ thể · Áp dụng · Giọng). Đạt theo bảng chấm mục 2: qua cổng, tổng ≥ 20, không tiêu chí < 4, Đúng = 5. Đủ 4 phần: đoạn 1–11 có (a) ≤ 35 chữ, (b) 63–91 chữ, (c), (d) ≤ 32 chữ kèm cách đo (đếm bằng máy); đoạn 12 theo dạng rút gọn khung 7.2 (cột căn cứ + nhận định, việc trong tháng, nguồn chung). **12/12 đủ (a)–(d).**

### Bảng điểm

| Đoạn | Bài · mảng | Đúng | Sâu | Cụ thể | Áp dụng | Giọng | Tổng | Tự chấm của Hạnh | Kết luận |
|---|---|---|---|---|---|---|---|---|---|
| 1 | VN01 · Tổng quan | 5 | 4 | 5 | 5 | 4 | 23 | 24 | Đạt (sửa giọng) |
| 2 | VN01 · Tài chính | 5 | 4 | 5 | 5 | 5 | 24 | 24 | Đạt |
| 3 | VN01 · Tình cảm | 5 | 4 | 5 | 4 | 5 | 23 | 24 | Đạt |
| 4 | VN01 · Sức khỏe | **4** | 4 | 4 | 5 | 5 | 22 | 23 | **Trượt** (Đúng < 5) |
| 5 | VN02 · Tổng quan | 5 | **3** | 5 | 5 | 4 | 22 | 24 | **Trượt** (Sâu < 4) |
| 6 | VN02 · Sự nghiệp | 5 | 4 | 5 | 5 | 4 | 23 | 24 | Đạt |
| 7 | VN02 · Tài chính | 5 | 4 | 5 | 5 | 5 | 24 | 24 | Đạt (nên sửa) |
| 8 | VN02 · Sức khỏe | 5 | 4 | 4 | 5 | 4 | 22 | 23 | Đạt (sửa bắt buộc 1 câu) |
| 9 | VN03 · Tổng quan | 5 | 4 | 5 | 5 | 5 | 24 | 25 | Đạt |
| 10 | VN03 · Sự nghiệp | 5 | 4 | 5 | 4 | 5 | 23 | 24 | Đạt (CV-08 sửa câu) |
| 11 | VN03 · Tình cảm | 5 | 4 | 4 | 5 | 5 | 23 | 23 | Đạt |
| 12 | VN03 · Bảng 12 tháng | 5 | 4 | 5 | 4 | 5 | 23 | 23 | Đạt |
| **TB** | | **4,92** | **3,92** | **4,75** | **4,75** | **4,67** | **23,0** | 23,8 | 10/12 đạt |

Đối chiếu nghiệm thu L-fd4220: 12/12 đủ (a)–(d): **đạt**; TB Cụ thể 4,75 và TB Áp dụng 4,75 ≥ 4: **đạt**; mỗi đoạn ≥ 20/25 (thấp nhất 22): **đạt**; 0 đoạn trượt cổng: **đạt**. Theo bảng chấm (Đúng = 5, không tiêu chí < 4): **đoạn 4 và 5 trượt**, chưa được lên site cho đến khi sửa. Hạnh tự chấm cao hơn Thư 0,8 điểm/đoạn, lệch chủ yếu ở Sâu (4 đoạn tự chấm 5: đoạn 3, 5, 6, 9; Thư chấm 4 hoặc 3) và Giọng.

### Lỗi từng đoạn và cách sửa

Ký hiệu: **[B]** sửa bắt buộc (đoạn trượt hoặc lỗi hiện ra với khách) · [N] nên sửa (không đổi kết luận).

**Đoạn 1 · VN01 Tổng quan** — (a) khớp du-lieu: Tử Tức Mùi, Thiên Cơ (Đ), Hóa Kỵ gốc, Lưu Hóa Khoa, L. Kình Dương, L. Thái Tuế. Viết hai lớp Kỵ gốc / Khoa năm tách riêng đúng NAM-HOA-08 (tổ hợp chưa có quy tắc).
- **[B] Giọng 4**: câu "Hai lớp hóa đọc riêng:" là lời dặn người viết lọt ra bài khách đọc; "Kỵ gốc", "Khoa của năm" chưa giải thích. Sửa: "Sao Thiên Cơ ở đây mang hai dấu: dấu Hóa Kỵ có từ lá số gốc khiến bạn dễ nghĩ nhiều…; dấu Hóa Khoa của riêng năm 2027 giúp…".
- [N] Sâu 4: chưa nêu Thiên Lương (Đ) ở Điền Trạch Sửu xung chiếu cung Thái Tuế (NAM-TT-03, điểm tựa trong sức ép năm), Thiên Việt gốc trong cung. Thêm một vế.
- (d) CV-02 bám `CHUNG-HOA-TCO-01/Kỵ`: hợp lệ, dạng (i). Ghi lại mã ẩn theo mục 1.

**Đoạn 2 · VN01 Tài chính** — (a) khớp: Tài Bạch Ngọ, Phá Quân (M), Kình Dương (H), Địa Không (H), L. Lộc Tồn. Vế loại trừ NAM-LUU-01 (Địa Không cùng cung) đã dùng.
- [N] Sâu 4: chưa nêu Phúc Đức Tý (Liêm Trinh, Thiên Tướng vượng, Triệt) xung chiếu; Hóa Lộc năm ở Huynh Đệ là nguồn lợi qua anh chị em, bạn bè (NAM-MANG-03).
- (d) TC-05: qua cổng, bám NAM-LUU-01 dạng (i) hợp lệ.

**Đoạn 3 · VN01 Tình cảm** — (a) khớp: Phu Thê Thân, Tuần, Tử Vi (M), Thiên Phủ (M), Hỏa Tinh (H), Linh Tinh (H), đại vận, L. Hồng Loan. PHU-CC-06 dùng đúng ("năm thuận chứ chưa phải năm định").
- [N] Sâu 4 (Hạnh tự chấm 5): (b) không luận nền Tử Phủ miếu (PHU-TV-01: hòa hợp lâu bền) và tác dụng Tuần (PHU-SP-10: gắn bó đến chậm), dù hai mã có trong mã ẩn. Thêm một câu nền.
- [N] Áp dụng 4: người chưa có ai thì TT-01 khó dùng; thêm nhánh "(chưa có ai: dùng TT-04)".
- (d) TT-01 bám VAN-SP-10 ("nên giữ bình tĩnh", Hỏa Linh hãm ở cung vận): hợp lệ dạng (i). PHU-SP-06 chỉ mô tả, giữ làm mã phụ.

**Đoạn 4 · VN01 Sức khỏe — TRƯỢT**
- **[B] Đúng 4**: "Thái Dương miếu cùng Lộc Tồn, Tả Phù là nhóm sao cứu giải khá đủ". Bộ quy tắc Tật Ách không xếp Thái Dương vào nhóm cứu giải (TB tr. 181 mục 11.1.1 chỉ có Tử Vi, Thiên Phủ, Thiên Lương: TAT-TV-01, TAT-TP-01, TAT-TL-01); Thái Dương nằm ở mục 11.2.4 với ý cần chú ý (TAT-TDU-01). "khá đủ" cũng chưa cân nhóm còn lại tại cung (Văn Xương (H), Thiên Sứ, Lưu Hà, Cô Thần) như TAT-YN-03 đòi. Sửa: "Lộc Tồn, Tả Phù cùng cung là sao giúp hồi phục (TAT-SP-04, TAT-SP-02), cho nền thể trạng khá"; bỏ Thái Dương khỏi câu cứu giải, không nêu ý TAT-TDU-01 (bộ phận cơ thể).
- [N] Sâu 4: chưa nói ý nghĩa của tiểu hạn Phụ Mẫu đối diện (Hóa Kỵ năm vào Cự Môn, L. Thiên Khốc) với mảng sức khỏe (NAM-MANG-05).
- [N] Cụ thể 4: "nền thể trạng tốt" còn chung.
- **[B] mã bám**: SK-04 bám TAT-YN-03 là mã phương pháp, trái mục 1 điều 2. Đổi thành `NAM-MANG-05` (nhịp sống, nghỉ ngơi, cẩn thận khi di chuyển) + `NAM-LUU-02` (Mã, Đà của năm: đi lại nhiều, việc kéo dài).

**Đoạn 5 · VN02 Tổng quan — TRƯỢT**
- (a), (b) đúng phần đã viết: Thiên Di Mùi, Triệt, Thiên Đồng (H), Cự Môn (H), Lưu Hóa Kỵ Cự Môn, Đà La, Ân Quang, Thiên Quý; NAM-PP-09 (Lưu Thái Tuế xung chiếu Mệnh vô chính diệu → hình ảnh được chú ý) có nguồn.
- **[B] Sâu 3**: cung trọng điểm năm bỏ sót bốn yếu tố đổi được kết luận, có trong du-lieu: (1) **Kình Dương của năm** (NAM-TT-02, có trong mã ẩn nhưng (b) không nói); (2) **Địa Kiếp (H), Linh Tinh** cùng cung; (3) **Hóa Khoa gốc ở Thiên Đồng** cùng cung, sao giải làm Kỵ năm của Cự Môn nhẹ đi (CHUNG-HOA-08, MENH-CM-03); (4) **Hóa Quyền của năm ở Thiên Đồng** (NAM-HOA-05: chủ động nhờ khéo léo). Đoạn chỉ đọc một trong ba hóa đang ở cung Mùi. Sửa: thêm một câu cân hai phía, ví dụ "Kình Dương của năm và Địa Kiếp thêm sức ép, kế hoạch với bên ngoài dễ đổi giữa chừng; bù lại Thiên Đồng mang Khoa gốc và Quyền của năm, nên bạn gỡ hiểu lầm tốt nhất bằng sự khéo léo, mềm mỏng". Giữ (b) ≤ 110 chữ bằng cách rút câu Triệt.
- [N] Giọng 4: "vô chính diệu" chưa giải thích ("cung Mệnh không có sao chính").
- (d) CV-01 bám NAM-HOA-07: hợp lệ dạng (i).

**Đoạn 6 · VN02 Sự nghiệp** — (a) khớp: Quan Lộc Tỵ, cung Thân, tiểu hạn, Thái Âm (H) Hóa Kỵ gốc, Lưu Hóa Lộc, L. Đà La, L. Thiên Mã. Ghi chú tuổi Canh đúng kết luận Đức Q1 (không gắn Trung Châu cho tổ hợp; "cách xét tổng hợp"). CHUNG-HOA-05 (Lộc hãm đến chậm) đã dùng.
- **[B] Giọng 4**: "Kỵ gốc", "Lộc của năm" chưa giải thích ngắn (Hạnh tự nêu, chưa sửa). Sửa như đoạn 1.
- [N] Sâu 4 (tự chấm 5): chưa xét Phu Thê Hợi xung chiếu có Hóa Khoa và Thiên Khôi của năm (người có vị thế giúp gỡ việc), là điểm tựa cho kết luận "có cơ hội gỡ".
- (d) CV-02 bám `NAM-TH-03/Kỵ`: hợp lệ.

**Đoạn 7 · VN02 Tài chính** — (a) khớp: Tài Bạch Dậu, Thái Dương (H), Thiên Lương (H), Hóa Lộc gốc, Kình Dương (H), Hỏa Tinh (H), L. Văn Xương, L. Thiên Việt. NAM-LUU-04-SAT dùng đúng (Kình cùng cung → không viết "thuận"). Lỗi 5 cũ (khuyên tái cơ cấu khoản vay) đã bỏ.
- [N] Đúng giữ 5 nhưng phải chặt hơn: câu "Hóa Lộc gốc cho lộc khi bạn sáng suốt, dám thể hiện" lấy nguyên CHUNG-HOA-TDU-01, chưa kèm vế CHUNG-HOA-05 (Lộc ở sao hãm, gặp Kình, Hỏa hãm: thành quả đến chậm). Câu trước đã nói "vất vả mới đủ dùng, về sau mới sung túc" nên không đổi kết luận; sửa để không lặp dạng lỗi "chọn bản tốt" (phiếu 2 bảng chấm): "Hóa Lộc gốc ở Thái Dương hãm nên lộc thường đến chậm, rõ hơn khi bạn sáng suốt, dám thể hiện"; thêm CHUNG-HOA-05 vào mã ẩn.
- [N] Sâu 4: chưa nêu Tang Môn của năm tại cung (NAM-TT-06), Phúc Đức Mão xung chiếu có Địa Không (H).
- (d) TC-07: xem mục 2.

**Đoạn 8 · VN02 Sức khỏe** — (a) khớp: Tật Ách Thân, Vũ Khúc (V), Thiên Tướng (M), Lộc Tồn, Thiên Y, L. Hồng Loan. TAT-VK-01, TAT-TT-01, TAT-VK-02 dùng đúng.
- **[B] Giọng 4**: câu cho khách "bộ quy tắc chưa có câu riêng cho sao này ở Tật Ách, nên mảng sức khỏe đi theo nền" lộ quy trình nội bộ trong bài trả phí; khung mục 8 yêu cầu ghi "chưa có quy tắc" trong mã ẩn. Sửa: "Năm nay ít yếu tố của năm chạm vào cung này, nên mảng sức khỏe đi theo nền: …"; chuyển ghi chú Hồng Loan vào mã ẩn.
- [N] Sâu 4: chưa cân Hóa Quyền gốc ở Vũ Khúc, Tang Môn, Thiên Riêu cùng cung (TAT-YN-03) và Phá Quân (H) ở Phụ Mẫu đối diện.
- (d) SK-01: qua cổng (mục 3), bám TAT-VK-02 ("khám định kỳ") dạng (i) hợp lệ.

**Đoạn 9 · VN03 Tổng quan** — (a) khớp: Thiên Di Dậu, cung Thân, tiểu hạn, Thái Âm (M), Lộc Tồn gốc, Lưu Hóa Lộc, L. Văn Xương, L. Thiên Việt. NAM-TH-04 đủ điều kiện: L. Văn Xương **tại** cung tiểu hạn; tam phương tứ chính có ≥ 2 nhóm (Khôi Việt: L. Thiên Việt; Nhật Nguyệt sáng: Thái Âm (M) Dậu, Thái Dương (M) Tỵ; Khoa Quyền Lộc: Lưu Lộc, Lưu Quyền Mão; Mã: L. Thiên Mã Tỵ); vế loại trừ không có (Dậu không Kình, Đà, Kỵ). VAN-SP-02 (song Lộc đồng cung giảm) đúng.
- [N] Sâu 4 (tự chấm 5): chưa nêu Tang Môn của năm, Thiên Khốc gốc tại cung (NAM-TT-06: việc đi xa cần nhiều tâm sức).
- [N] "mua sắm cho gia đình" → "chi tiêu gia đình" (mục 3).
- (d) HT-01 bám NAM-TH-04: hợp lệ.

**Đoạn 10 · VN03 Sự nghiệp** — (a) khớp: Quan Lộc Mùi, đại vận trùng Lưu Thái Tuế, Thiên Cơ (Đ) Lưu Hóa Khoa, Văn Xương Hóa Kỵ gốc, L. Kình Dương. NAM-PP-08 viết đúng giọng "nổi rõ nhất". VAN-SP-06 vế thận trọng đúng (Xương Kỵ + Kình).
- [N] Sâu 4: chưa nêu Văn Khúc mang Hóa Khoa gốc cùng cung (đỡ cho phần văn bản), Linh Tinh, Thiên Lương xung chiếu.
- **[B] Áp dụng 4**: CV-08 "nhờ một người bạn tin tưởng đọc soát mọi văn bản quan trọng" — văn bản công việc đưa bạn ngoài đọc có rủi ro bảo mật; "mọi" khó giữ 3 tháng. Sửa theo mục 2.

**Đoạn 11 · VN03 Tình cảm** — (a) khớp: Phu Thê Sửu, Tuần, Thiên Lương (Đ), Thiên Hình, Long Trì, Phượng Các, L. Thiên Hư, đối diện cung Lưu Thái Tuế. NAM-TT-03 dùng đúng điều kiện (Thiên Lương ở Sửu), có nhãn tổng hợp.
- [N] "đối diện cung Thái Tuế" ở (b) → "cung Lưu Thái Tuế" (lá số VN03 có sao Thái Tuế gốc ở Dậu, dễ nhầm).
- [N] Cụ thể 4, Sâu 4: nền chỉ dựa tính chất sao CHUNG-CT-TL-01 vì chưa có PHU-TL cho Sửu, Mùi. Chấp nhận với nhãn tổng hợp; việc cho Đức: thêm PHU-TL tại Sửu, Mùi có nguồn.
- (d) TT-02 bám NAM-TT-06: hợp lệ theo điều kiện mục 2 (L. Thiên Hư ở ngay Phu Thê, (b) đã nêu).

**Đoạn 12 · VN03 Bảng 12 tháng** — 12 cung tháng, ngày dương bắt đầu tháng, sao chính, độ sáng, Tuần/Triệt, sao lưu khớp bảng lưu nguyệt VN03; tháng mốc T2 (đại vận + Thái Tuế), T4 (tiểu hạn), T6 (lưu Kỵ) đúng NAM-THANG-04. T3 dùng VAN-CT-TP-02 đúng định nghĩa Đức Q6 (Địa Không tại cung → TP-02 đầy đủ).
- [N] Sâu 4: T5 bỏ Kình Dương (Đ), Thiên Không gốc tại Tật Ách; T10 bỏ Bạch Hổ của năm tại Mệnh.
- [N] Áp dụng 4: T1 ("lập danh sách việc nhà") và T12 ("gạch bớt hai đầu việc") gắn quy tắc lỏng. T12 nên bám đúng lời khuyên NAM-LUU-02 "kiên nhẫn với thủ tục": vd "Liệt kê thủ tục đang chờ, hỏi tiến độ từng việc một lần trong tháng".
- T5 bám NAM-MANG-05 ("khám định kỳ"): hợp lệ; cần thêm NAM-MANG-05 vào cột SK-01 (mục 2).

---

## 5. Lỗi hay gặp (cho Hạnh, cập nhật thống kê tuần)

1. **Bỏ yếu tố trong chính cung trọng điểm** (đoạn 5, nhẹ hơn ở 1, 6, 9, 12): (a) bị giới hạn 35 chữ nên (b) quên luôn. Quy trình: trước khi viết (b), liệt kê mọi Tứ hóa (gốc + năm), sát tinh, sao lưu **tại cung** từ du-lieu; mỗi mục phải có mặt trong (b) hoặc ghi lý do bỏ trong mã ẩn.
2. **Mã có trong mã ẩn nhưng (b) không dùng** (đoạn 3: PHU-TV-01, PHU-SP-10; đoạn 5: NAM-TT-02). Mã ẩn chỉ ghi mã đã thành câu.
3. **Lời dặn nội bộ lọt ra bài** (đoạn 1 "Hai lớp hóa đọc riêng", đoạn 8 "bộ quy tắc chưa có câu riêng").
4. **Xếp sao sai nhóm** (đoạn 4: Thái Dương vào nhóm cứu giải): tra TAT-<sao> trước khi gộp nhóm.
5. **Tự chấm Sâu cao**: 4/12 đoạn tự chấm Sâu 5; Thư chấm 4 hoặc 3. Sâu 5 chỉ khi đã đi đủ tam phương, xung chiếu và cân yếu tố trái chiều.

## 6. Kết luận

- 12/12 đoạn đủ 4 phần, 0 đoạn trượt cổng an toàn, TB Cụ thể 4,75, TB Áp dụng 4,75, mọi đoạn ≥ 22/25: **đạt ngưỡng nghiệm thu L-fd4220**.
- Theo bảng chấm: **10/12 đạt; đoạn 4 (Đúng 4) và đoạn 5 (Sâu 3) trượt**, chưa dùng làm mẫu lên site. Hạnh sửa các mục [B] ở đoạn 1, 4, 5, 6, 8, 10; Thư chấm lại riêng các đoạn đó.
- Quy định "việc nên làm" (mục 1): Thư đề nghị Minh chép vào khung mục 6. Mẫu: TC-07 duyệt có điều kiện; CV-08 duyệt có điều kiện, sửa câu; mã bám mới cho CV-02 (2 mã, chỉ vế Kỵ) và TT-02 (NAM-TT-06, chỉ khi sao ở ngay Phu Thê) duyệt. Cột SK-04 phải đổi mã bám.
