# Kiểm chứng năm 2025 và năm 2026: câu chữ chuẩn

Người viết: Hạnh (luan-giai), 31/10/2026, **bản sửa lần 2** theo phiếu Thư `docs/san-pham/kiem-chung-thu-duyet.md` (Không đạt, TB 6,75). Trạng thái: **chờ Thư duyệt lại**. Thư duyệt đạt thì Bảo chép mục 2 vào `MAU_CAU`/`CHU_DE_CUNG` (`src/lib/luan-giai/ai/kiem-chung.ts`), mục 3 vào `KIEM_CHUNG_NHAN` (`src/lib/kiem-chung-noi-dung.ts`), rồi đổi `KIEM_CHUNG_CAU_TAM` sang false. Bản này thay toàn bộ phần TẠM của bản khung do Bảo dựng.

Dữ liệu code dùng (không đổi): Lưu Thái Tuế của năm (cung có chi trùng chi năm xem) và Hóa Lộc lưu niên (Tứ hóa theo can năm xem), theo đặc tả an sao `docs/nghien-cuu/tuvi-an-sao-spec.md` mục 7.3 và bảng 5.8. Năm 2025 là Ất Tỵ (Hóa Lộc của năm hóa vào Thiên Cơ), năm 2026 là Bính Ngọ (Hóa Lộc của năm hóa vào Thiên Đồng), bảng 5.8. Phần này chỉ dùng **vị trí cung**, không dùng sao tọa thủ hay độ sáng, nên câu chữ chỉ được nói "mảng nào nổi lên", không được nói năm đó tốt hay xấu, và Hóa Lộc chỉ được nói "cơ hội" (không nói "suôn sẻ", vì nghĩa còn tùy tính sao bị hóa: NAM-HOA-03, CHUNG-HOA-06).

Năm 2026 (Bính Ngọ) kéo đến Tết Đinh Mùi 6/2/2027, nên trong suốt mùa bán (15/12/2026 đến 6/2/2027) năm 2026 **chưa qua**. Câu cho khách không được coi 2026 là năm đã kết thúc: 2025 là "năm đã qua", 2026 là "năm nay" hoặc "đang diễn ra".

## 1. Quy tắc viết

1. **Mỗi câu gắn một cung cụ thể của lá số** (cung Lưu Thái Tuế hoặc cung Hóa Lộc lưu niên). Không có câu chung chung kiểu "năm qua có lúc vui lúc buồn" vì ai đọc cũng thấy đúng.
2. **Chỉ nói xu hướng, không khẳng định sự kiện.** Dùng "thường", "dễ", "nghiêng về". Cấm "năm đó bạn đã…", "chắc chắn", "nhất định" (VAN-CAM-03). Không nói 2026 như việc đã xong.
3. **Trung tính về tốt xấu.** Cung Lưu Thái Tuế là nơi chủ đề của năm nổi rõ, không phải mọi việc trong năm (NAM-PP-07, NAM-TT-01); có việc thuận, có việc cần lo, không dùng giọng "sợ Thái Tuế", "phạm Thái Tuế" (VAN-CAM-07, NAM-CAM-01). Không có dữ liệu sao nên không được viết "năm khó khăn", "năm hạn".
4. **Không gây sợ, không ép mua.** Cấm: hạn, giải hạn, cúng, xui, tai họa, mất mát, "nếu không xem 2027 thì…", đếm ngược, khan hiếm giả (VAN-CAM-01, VAN-CAM-02, NAM-CAM-03). Phần xem trước miễn phí chỉ nêu chủ đề năm và một điểm thuận (NAM-CAM-03). Câu nối sang phần 2027 chỉ mô tả nội dung, khách tự chọn.
5. **Không đoán chuyện người thân, sức khỏe, tiền bạc cụ thể** (VAN-CAM-04, VAN-CAM-05). Tật Ách chỉ nói "nhịp sinh hoạt, cách nghỉ ngơi và đối diện áp lực"; **không dùng chữ "sức khỏe"** trong câu cho khách, kể cả trong bảng chủ đề.
6. **Ghi rõ lớp và trường phái.** Lưu Thái Tuế và Hóa Lộc lưu niên là lớp **năm**, khác Tứ hóa **gốc** của lá số; luôn viết "Hóa Lộc của năm {năm}" (NAM-HOA-02). Năm chỉ là một lớp, nằm trong đại vận 10 năm (NAM-PP-02), nên câu không được nói như kết luận về cả năm. Lấy Lưu Thái Tuế làm trọng điểm năm và đọc Tứ hóa của năm là **quy ước xemtuvi.vn**, không phải "phái Việt" (NAM-TRANH-01, NAM-TRANH-05); câu căn cứ phải ghi sách Việt (Tân Biên, Khảo Luận) lấy cung tiểu hạn làm cung năm chính.
7. **Giọng "hiểu mình, định hướng"**: xưng "bạn", câu ngắn, dễ đọc trên điện thoại, mỗi câu tối đa khoảng 40 chữ. Kết bằng lời mời tự nhìn lại, không phán.
8. **Không mã quy tắc trong nội dung khách thấy.** Mã quy tắc chỉ nằm ở tài liệu này để Thư duyệt; dòng "Căn cứ" cho khách chỉ ghi cung, sao, cách tính và trường phái.

Lưu ý nguồn: nhóm NAM trong `docs/luan-giai/van-nam/QUY-TAC.md` đã có quy tắc riêng cho lưu niên, bản này trích trực tiếp các mã đó: NAM-TT-01 (cung Lưu Thái Tuế, trọng điểm năm là quy ước sản phẩm), NAM-PP-07 (chủ đề năm theo tên cung; ⚑ tổng hợp, nguồn gốc VAN-CUNG-00 áp cho năm), NAM-HOA-03 (lưu Lộc kích hoạt cung theo nghĩa "cơ hội, nguồn lợi"), NAM-HOA-02 (ghi rõ lớp), NAM-PP-02 (ba lớp, quy ước xemtuvi.vn), NAM-TRANH-01 và NAM-TRANH-05 (ghi trường phái), NAM-CAM-03, NAM-CAM-04. Mã VAN-… chỉ còn dùng cho điều cấm chung (VAN-CAM, áp nguyên cho năm theo mục 8 QUY-TAC) và phạm vi từng cung (VAN-CUNG-02 đến 13, NAM-PP-07 dẫn tới). Không còn mã VAN-CUNG-00, VAN-HOA-02 làm căn cứ trực tiếp cho câu năm (VAN-HOA-02 nói về 10 năm đại vận, NAM-PP-06).

## 2. Câu mẫu (7 câu) và bảng chủ đề 12 cung

Biến code dùng: `{năm}`, `{can chi}`, `{cung Lưu Thái Tuế}`, `{cung Hóa Lộc lưu niên}`, `{chủ đề cung}` (tra bảng 2.2 theo tên cung đang nói). Câu M4, M5 dùng thêm `{sao Hóa Lộc}` (code có sẵn `loc.sao`) và `{can}` (chữ can của `{can chi}`, ví dụ "Ất", "Bính").

### 2.1. Câu mẫu

| Mã | Dùng ở đâu | Câu | Quy tắc |
|---|---|---|---|
| M1 | Đầu mục, trước các năm (tùy chọn) | Dưới đây là năm 2025 và năm 2026 nhìn qua lá số của bạn. Năm Bính Ngọ 2026 kéo đến Tết 6/2/2027, nên bạn đọc thử và tự so với những gì mình đã và đang trải qua. | VAN-CAM-03 |
| M2 | Trọng điểm mỗi năm (2025 và 2026) | Năm {năm} ({can chi}), Lưu Thái Tuế đi vào cung {cung Lưu Thái Tuế} trên lá số của bạn. xemtuvi.vn lấy cung này làm trọng điểm năm, nên những chuyện về {chủ đề cung} thường nổi rõ hơn các mảng khác. | NAM-TT-01, NAM-PP-07, NAM-TRANH-01, VAN-CAM-07 |
| M3 | Căn cứ dưới M2 | Căn cứ: Lưu Thái Tuế năm {năm} ở cung có chi trùng chi năm, trên lá số của bạn là cung {cung Lưu Thái Tuế}. Lấy cung này làm trọng điểm năm là quy ước của xemtuvi.vn; sách Việt như Tân Biên, Khảo Luận lấy cung tiểu hạn làm cung năm chính. Bài Vận 2027 đọc cả hai cung. | NAM-TT-01, NAM-TRANH-01, NAM-PP-02; SPEC 7.3 |
| M4 | Mỗi năm (2025 và 2026), sau M2, khi cung Hóa Lộc khác cung Lưu Thái Tuế | Cũng trong năm {năm}, Hóa Lộc của năm {năm} rơi vào cung {cung Hóa Lộc lưu niên}, nên cơ hội dễ đến hơn qua những chuyện về {chủ đề cung}. Đây là khả năng nghiêng về; mức độ còn tùy cả lá số và lựa chọn của bạn. | NAM-HOA-03, NAM-HOA-02, NAM-PP-02, VAN-CAM-03 |
| M5 | Căn cứ dưới M4 hoặc M6 | Căn cứ: can {can} của năm {năm} cho Hóa Lộc vào sao {sao Hóa Lộc}, sao này nằm ở cung {cung Hóa Lộc lưu niên}. Đây là Hóa Lộc của năm, khác Tứ hóa gốc của lá số. Đọc Tứ hóa của năm là quy ước của xemtuvi.vn; sách Việt như Tân Biên, Khảo Luận không dùng lớp này. | SPEC 5.8, 7.3; NAM-HOA-02, NAM-TRANH-05 |
| M6 | Thay M4 khi cung Hóa Lộc lưu niên trùng cung Lưu Thái Tuế | Năm {năm}, Hóa Lộc của năm cũng rơi vào chính cung {cung Lưu Thái Tuế}, nên mảng này vừa nổi rõ vừa là nơi cơ hội dễ đến hơn. Đây là khả năng nghiêng về, không phải điều chắc xảy ra. | NAM-PP-07, NAM-HOA-03, NAM-HOA-02 |
| M7 | Cuối mục, nối sang phần Vận 2027 | Nếu những điểm trên gần với điều bạn đã và đang trải qua, phần Vận 2027 đọc tiếp lá số của bạn theo cùng cách này, chi tiết theo từng mảng. | NAM-CAM-03 (không ép mua: chỉ mô tả nội dung) |

Ghi chú cho Bảo:
- M4 nay dùng cho **cả hai năm** (code tạm chỉ thêm ở năm cuối, điều kiện `i === NAM_KIEM_CHUNG.length - 1`; bỏ điều kiện này). Lý do: NAM-CAM-03 cho phép mỗi năm "chủ đề năm và một điểm thuận", và để hai năm cân nhau (phiếu Thư, S2). Năm 2025 can Ất cho Hóa Lộc vào Thiên Cơ; năm 2026 can Bính vào Thiên Đồng (SPEC 5.8). `ln.luuTuHoa` đã tính cho cả hai năm.
- M6 là nhánh mới (khi `loc.chi === ln.luuThaiTue`); nếu chưa muốn thêm nhánh thì giữ M4, câu vẫn đúng.
- M1, M7 là câu tĩnh, không có biến. Câu `canCu` tạm trong code (có "tam hợp phái Việt") phải thay bằng M3, M5.

### 2.2. Chủ đề 12 cung (`CHU_DE_CUNG`)

Viết dạng cụm danh từ để ghép sau "những chuyện về …". Tên cung khớp đúng mảng `CUNG` của engine (`src/lib/tuvi/tuvi-raw.js`). Không có cụm từ nào lặp giữa hai cung (chữ "bạn bè" chỉ ở Nô Bộc).

| Cung | Chủ đề cung | Quy tắc |
|---|---|---|
| Mệnh | bản thân bạn, cách bạn nhìn nhận mình và những lựa chọn của riêng bạn | MENH-YN-01, VAN-CUNG-02, NAM-PP-09 |
| Phụ Mẫu | cha mẹ, thầy cô, cấp trên và chuyện học hành, giấy tờ | PHUMAU-YN-01, VAN-CUNG-03 |
| Phúc Đức | đời sống tinh thần, giá trị sống và sự gắn bó với gia đình, họ hàng | PHUC-YN-01, VAN-CUNG-13 |
| Điền Trạch | nhà cửa, nơi ở, tổ ấm và tài sản tích lũy lâu dài | DIEN-YN-01, VAN-CUNG-12 |
| Quan Lộc | công việc, chuyên môn và vị trí của bạn trong nghề | QUAN-YN-01, VAN-CUNG-11 |
| Nô Bộc | bạn bè, đồng nghiệp, đối tác và mạng lưới quan hệ quanh bạn | NO-YN-01, VAN-CUNG-10 |
| Thiên Di | việc đi xa, môi trường mới và cơ hội đến từ bên ngoài | DI-YN-01, VAN-CUNG-09 |
| Tật Ách | nhịp sinh hoạt, cách bạn nghỉ ngơi và đối diện áp lực | TAT-YN-01, VAN-CUNG-08, VAN-CAM-04 |
| Tài Bạch | thu nhập, cách kiếm tiền và cách bạn chi tiêu, giữ tiền | TAI-YN-01, VAN-CUNG-07 |
| Tử Tức | những dự án sáng tạo, việc bạn ấp ủ và người nhỏ tuổi hơn mà bạn chăm lo | TU-YN-01, VAN-CUNG-06 |
| Phu Thê | tình cảm, hôn nhân và người đồng hành bên bạn | PHU-YN-01, VAN-CUNG-05 |
| Huynh Đệ | anh chị em và những người ngang hàng cùng bạn hợp tác | HUYNH-YN-01, VAN-CUNG-04 |

Ghi chú: Tử Tức đưa "dự án sáng tạo" lên trước và dùng "người nhỏ tuổi hơn mà bạn chăm lo" (bao gồm con cái với người đã có con, học trò, em nhỏ với người trẻ) thay cho chữ "con cái", để khách 18–22 tuổi không đọc lạc (phiếu Thư, G1; VAN-CUNG-06 có "người nhỏ tuổi mình chăm lo, học trò, sản phẩm sáng tạo"). Chọn một biến thể chung thay vì hai biến thể theo tuổi để code không phải thêm nhánh.

### 2.3. Ví dụ ghép (minh họa giọng; cung là giả định, không phải lá số thật)

- Đạt (M2): "Năm 2025 (Ất Tỵ), Lưu Thái Tuế đi vào cung Quan Lộc trên lá số của bạn. xemtuvi.vn lấy cung này làm trọng điểm năm, nên những chuyện về công việc, chuyên môn và vị trí của bạn trong nghề thường nổi rõ hơn các mảng khác."
- Đạt (M4): "Cũng trong năm 2026, Hóa Lộc của năm 2026 rơi vào cung Thiên Di, nên cơ hội dễ đến hơn qua những chuyện về việc đi xa, môi trường mới và cơ hội đến từ bên ngoài. Đây là khả năng nghiêng về; mức độ còn tùy cả lá số và lựa chọn của bạn."

Ghép thử Tật Ách (phiếu Thư, P0-2; kiểm không có chữ "sức khỏe", không đoán tình trạng cơ thể):
- M2: "Năm 2026 (Bính Ngọ), Lưu Thái Tuế đi vào cung Tật Ách trên lá số của bạn. xemtuvi.vn lấy cung này làm trọng điểm năm, nên những chuyện về nhịp sinh hoạt, cách bạn nghỉ ngơi và đối diện áp lực thường nổi rõ hơn các mảng khác."
- M4: "Cũng trong năm 2025, Hóa Lộc của năm 2025 rơi vào cung Tật Ách, nên cơ hội dễ đến hơn qua những chuyện về nhịp sinh hoạt, cách bạn nghỉ ngơi và đối diện áp lực. Đây là khả năng nghiêng về; mức độ còn tùy cả lá số và lựa chọn của bạn."
- M6: "Năm 2026, Hóa Lộc của năm cũng rơi vào chính cung Tật Ách, nên mảng này vừa nổi rõ vừa là nơi cơ hội dễ đến hơn. Đây là khả năng nghiêng về, không phải điều chắc xảy ra."

Không đạt (và lý do):
- "Năm 2025 bạn đã đổi việc." → khẳng định sự kiện (VAN-CAM-03).
- "Năm 2025 có lúc thuận lúc khó, bạn đã trưởng thành hơn." → câu ai đọc cũng đúng, không gắn cung.
- "Phái Việt lấy cung Lưu Thái Tuế làm trọng điểm năm." → ghi sai trường phái; đây là quy ước xemtuvi.vn, sách Việt lấy tiểu hạn (NAM-TRANH-01).
- "Thái Tuế chiếu Tật Ách nên năm 2026 dễ đau ốm." → gây sợ, đoán sức khỏe (VAN-CAM-04, VAN-CAM-07).
- "Hóa Lộc vào Thiên Di nên năm 2026 mọi việc suôn sẻ." → quá tay; lưu Lộc chỉ là "cơ hội", còn tùy sao bị hóa (NAM-HOA-03, CHUNG-HOA-06).
- "Hai năm vừa qua của bạn…" (nói về 2026) → 2026 chưa hết năm âm lịch (VAN-CAM-03).
- "Năm 2026 là năm hạn, xem ngay Vận 2027 để biết cách hóa giải." → mê tín, ép mua (VAN-CAM-02, NAM-CAM-03).
- "Hóa Lộc vào Tài Bạch nên năm 2026 bạn chắc chắn có thêm tiền." → phán cố định (VAN-CAM-03); chỉ được "cơ hội dễ đến hơn".

## 3. Nhãn minh bạch (`KIEM_CHUNG_NHAN`)

- **tieuDe**: Đối chiếu năm 2025 và năm 2026 trên lá số của bạn
- **minhBach**: Nội dung do hệ thống tự động tạo dựa trên lá số của bạn, mang tính tham khảo để hiểu mình, không thay lời khuyên chuyên môn (y tế, tài chính, pháp lý). Phần này nói về xu hướng của năm 2025 và năm 2026 (kéo đến Tết 6/2/2027), không khẳng định điều gì đã xảy ra. Năm chỉ là một lớp, nằm trong vận 10 năm, nên bạn hãy tự đối chiếu với những gì mình đã và đang trải qua.
- **truongPhai**: Trường phái: Tử Vi Đẩu Số tam hợp. Lấy cung Lưu Thái Tuế làm trọng điểm năm và đọc Hóa Lộc của năm là quy ước của xemtuvi.vn; sách Việt như Tân Biên, Khảo Luận lấy cung tiểu hạn làm cung năm chính. Mỗi câu ghi rõ cung và sao làm căn cứ; Hóa Lộc ở đây là của năm, khác Tứ hóa gốc của lá số.

Căn cứ nhãn: NAM-CAM-04 (vế do hệ thống tạo, tham khảo, không thay lời khuyên chuyên môn), NAM-HOA-02, NAM-TRANH-01, NAM-TRANH-05.

## 4. Tự kiểm

- [x] 7 câu mẫu, câu nào có nhận định đều gắn cung của lá số và mã quy tắc NAM (mục 2.1).
- [x] 12/12 cung có chủ đề, khớp tên cung engine, có mã quy tắc; không cụm từ trùng giữa hai cung.
- [x] Không chữ "phái Việt" trong câu cho khách (M1 đến M7, bảng 2.2, nhãn); chỉ còn trong ví dụ không đạt.
- [x] Không chữ "sức khỏe" trong câu cho khách; ba câu ghép thử Tật Ách nằm ở mục 2.3.
- [x] Không "suôn sẻ" trong câu cho khách; Hóa Lộc chỉ nói "cơ hội".
- [x] Không câu nào coi 2026 là năm đã kết thúc (tieuDe, M1, M7, minhBach).
- [x] Không từ cấm (hạn, giải hạn, cúng, xui, tai họa, chắc chắn, nhất định) trong câu cho khách; "chắc chắn" chỉ ở ví dụ không đạt.
- [x] Nhãn có đủ: do hệ thống tạo, tham khảo, không thay lời khuyên y tế, tài chính, pháp lý; trường phái; phân biệt lớp năm với lớp gốc.
- [x] Không còn VAN-CUNG-00, VAN-HOA-02 làm căn cứ trực tiếp cho câu năm.
- [ ] P1-3 (ngoài phạm vi Hạnh): Đức đính chính SPEC 7.3 câu "cung lưu niên chính ở phái Việt" cho khớp NAM-TRANH-01; đề xuất qua Minh.
- [ ] Thư duyệt lại.

## Bật thử
`KIEM_CHUNG_QUA_KHU=1` khi chạy máy chủ (mặc định tắt, không có trong `ecosystem.config.cjs`). Nhóm theo phiên 50/50 (a thấy, b không). Sự kiện: `xem_truoc_mo`, `kiem_chung_xem`, `bam_mua`, trường `nhom_ab`.
