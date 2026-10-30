# Phiếu kiểm duyệt "Vận năm 2027" VN01–VN03 (việc T-7199bd)

- Người chấm: Thư (kiểm duyệt). Ngày 30/10/2026.
- Đối tượng: `docs/luan-giai/van-nam/` tại commit 87c95bd (người viết: Hạnh): `QUY-TAC.md`, `DINH-DANG.md`, `doan-mau.json`, `du-lieu.md`, `VN01.md`–`VN03.md`, `TU-KIEM.md`.
- Chuẩn đối chiếu: `du-lieu.md`, `docs/nghien-cuu/luan-giai/dai-van.md` (VAN-), `docs/nghien-cuu/luan-giai-12-cung.md` (CHUNG-, PHU-, QUAN-…), `docs/nghien-cuu/tuvi-an-sao-spec.md` (5.8, 6, 7, 10.4), skill `tuvi-luan-giai`, `tuvi-an-sao`.
- Thang như `kiem-duyet-dai-van.md`: 4 tiêu chí 0–10 (**Đúng**, **Sâu**, **Giọng**, **An toàn**). Ngưỡng nghiệm thu việc này: **Đạt** khi TB ≥ 8, 0 lỗi học thuật nặng, 0 từ cấm (thêm: An toàn = 10 mỗi bài, như vòng đại vận).

## Vòng 1

### 1. Kết luận

**CHƯA ĐẠT.** TB chung **8,5/10**, không có từ cấm, nhưng còn **2 lỗi học thuật nặng** (cả hai ở VN02) và **1 lỗi nặng ở QUY-TAC**, là gốc của lỗi nặng số 1. Có **11 lỗi nhẹ** (6 ở bài, 5 ở quy tắc). VN01 và VN03 đủ điều kiện đạt sau khi sửa lỗi nhẹ. VN02 phải sửa 2 lỗi nặng, sau đó Thư duyệt lại riêng VN02 và các dòng quy tắc liên quan; không cần chấm lại cả bộ.

Phần đã kiểm và khớp:
- `node tools/kiem-van-nam.cjs`: Đạt (76 đoạn, 45 quy tắc NAM, 3 bài đủ khung, không có từ cấm, mọi mã đều có thật).
- `node tools/du-lieu-van-nam.cjs 2027` chạy lại cho kết quả trùng từng dòng với `du-lieu.md`. Dữ liệu khớp engine.
- Thư tự tính lại và khớp engine ở cả 3 lá: tuổi mụ, cung đại vận, năm thứ mấy trong vận (VN01: năm 9, VN02: năm 3, VN03: năm 5), tiểu hạn (TT2 安小限訣: VN01 Hợi, VN02 Tỵ, VN03 Dậu), tháng Giêng theo Đẩu Quân (VN01 Hợi, VN02 Thân, VN03 Ngọ), Tứ hóa gốc (Mậu, Canh theo bảng Việt, Tân), lưu tứ hóa can Đinh, vị trí 15 sao lưu năm Đinh Mùi.
- Không gán nhầm sao mang hóa ở bài nào. Không có câu đoán bệnh, tai nạn, tang, chia tay. Không có "phạm Thái Tuế", "năm hạn", "giải hạn".
- Câu ghi nguồn hệ thống ("Nội dung do hệ thống tạo…") có ở đầu cả 3 bài, đúng `~/xemtuvi.vn/CLAUDE.md`.

### 2. Bảng điểm

| Bài | Hồ sơ | Đúng | Sâu | Giọng | An toàn | **TB** | Kết quả |
|---|---|---|---|---|---|---|---|
| VN01 | Nữ 30 Mậu Dần; Thái Tuế Tử Tức, tiểu hạn Phụ Mẫu, vận Phu Thê | 8 | 9 | 9 | 10 | **9,00** | Đạt (có 2 lỗi nhẹ) |
| VN02 | Nam 38 Canh Ngọ; Thái Tuế Thiên Di, tiểu hạn Quan Lộc | 6 | 8 | 8 | 9 | **7,75** | **Chưa đạt: 2 lỗi nặng** |
| VN03 | Nữ 47 Tân Dậu; Thái Tuế trùng vận Quan Lộc, tiểu hạn Thiên Di | 9 | 8 | 8 | 10 | **8,75** | Đạt (có 2 lỗi nhẹ) |
| **TB** | | **7,7** | **8,3** | **8,3** | **9,7** | **8,50** | 2/3 bài đạt |

So với tự chấm của Hạnh (TB 8,9): VN02 bị hạ ở Đúng và An toàn (lỗi 1, 2, 5), VN03 bị hạ ở Giọng (lỗi 6).

### 3. Danh sách lỗi (Thư không sửa, trả Hạnh)

**Lỗi trong bài**

| # | Vị trí | Câu hiện tại | Lỗi | Đối chiếu | Mức | Cách sửa |
|---|---|---|---|---|---|---|
| 1 | VN02, Tổng quan, đoạn "Việc riêng của năm"; Sự nghiệp; T10; Ghi chú trường phái | "Theo phái Trung Châu, Kỵ gốc gặp Lộc của năm là lúc điểm vướng cũ có cơ hội chuyển thành có lợi" | **Áp sai trường phái.** Thái Âm chỉ hóa Kỵ ở tuổi Canh khi dùng **bảng Việt**. Bảng Trung Quốc mà Vương Đình Chi và iztro dùng cho can Canh là Hóa Khoa Thái Âm, Hóa Kỵ Thiên Đồng. Theo chính phái Trung Châu, lá số này không có Kỵ gốc ở Thái Âm, nên không thể dẫn "theo phái Trung Châu" cho tổ hợp này. Người rành tử vi đọc là thấy mâu thuẫn, mất đúng điểm khác biệt "tin cậy học thuật". | SPEC 5.8 dòng 463 và 10.4; du-lieu.md VN02 (Canh: Hóa Kỵ Thái Âm); QUY-TAC NAM-HOA-08(a) | **Nặng** | Bỏ nhãn "theo phái Trung Châu" ở câu này. Viết thành "nguyên tắc hóa của năm chạm hóa gốc (tổng hợp, mượn cách xét của Trung Châu, áp trên bảng Tứ hóa phái Việt)". Ghi chú trường phái nói rõ can Canh khác bảng giữa các phái. Giữ giọng xu hướng. Câu Hóa Khoa gốc của Thiên Đồng (cũng là ô lệch bảng) chỉ cần ghi "theo bảng Việt". |
| 2 | VN02, Tài chính (Năm nay, Gợi ý); T2 | "Văn Xương và Thiên Việt của năm cùng vào Tài Bạch: hồ sơ, giấy tờ liên quan tiền bạc (vay, bảo hiểm, thuế, hợp đồng) **thuận hơn thường lệ**" + "**Dồn các thủ tục tài chính** (gia hạn, tái cơ cấu khoản vay, hợp đồng) **vào năm nay**" | **Sai điều kiện quy tắc, kết luận ngược chiều.** Cung Tài Bạch Dậu có **Kình Dương gốc (H)** và Hỏa Tinh (H). VAN-SP-06 ghi rõ Xương Khúc gặp Kình Đà, Hóa Kỵ thì "dễ nhầm lẫn giấy tờ; nên rà soát kỹ văn bản". Bài lấy bản tốt (NAM-LUU-04) trong khi điều kiện của bản cần thận trọng đã có, rồi dựa vào đó khuyên dồn thủ tục tài chính. Cùng dạng với lỗi chặn DV09 ở vòng đại vận. Chính VN01 đã xử đúng tình huống này (Xương hãm gặp Đà thì rà hồ sơ). | du-lieu.md VN02 Tài Bạch: Kình Dương (H), Hỏa Tinh (H), L. Văn Xương, L. Thiên Việt; VAN-SP-06; NAM-LUU-00 | **Nặng** | Viết hai mặt: "có người có vị thế giúp việc hồ sơ tiền bạc (Thiên Việt của năm), nhưng Văn Xương của năm gặp Kình Dương, Hỏa Tinh hãm nên giấy tờ dễ nhầm, cần rà soát kỹ". Bỏ gợi ý "dồn thủ tục… tái cơ cấu khoản vay vào năm nay" (xem lỗi 5). T2 sửa theo cùng hướng. |
| 3 | VN01, Tổng quan, đoạn tam phương tiểu hạn; Sự nghiệp, Gợi ý | "Tam phương cung tiểu hạn hội Văn Xương, Văn Khúc (Văn Khúc của năm)… theo Toàn Thư, đây là năm thuận cho học thêm…" + "đây là năm nên đăng ký" | Theo câu chữ NAM-TH-04 ở QUY-TAC thì **chưa đủ điều kiện**: quy tắc đòi "cung tiểu hạn hoặc cung Lưu Thái Tuế **có** Văn Xương, Văn Khúc", mà ở VN01 cả hai sao chỉ nằm ở cung xung chiếu (Tỵ), Văn Xương lại hãm và gặp Đà La của năm. JSON thì cho phép xét tam phương (xem lỗi Q2), nên bài khớp máy nhưng lệch quy tắc chữ. Bài đã có câu rà hồ sơ, nên không xếp nặng. | du-lieu.md VN01: Phụ Mẫu Hợi không có Xương Khúc; Tật Ách Tỵ có Văn Xương (H), L. Văn Khúc, L. Đà La; NAM-TH-04; VAN-SP-06 | Nhẹ | Chờ chốt Q2. Trong lúc chờ, hạ xuống "có yếu tố thuận cho học thêm, nhưng sao văn hãm và ở xa nên cần chuẩn bị kỹ". Gợi ý "đây là năm nên đăng ký" đổi thành "nếu đang cân nhắc chứng chỉ, có thể lên kế hoạch từ đầu năm". |
| 4 | VN02, T5 (Huynh Đệ) | "Tử Vi ở đây có Thiên Phủ, Vũ Khúc, Thiên Tướng hội ở tam phương: tiếng nói của bạn được coi trọng" | Chỉ dùng VAN-CT-TV-01 trong khi điều kiện VAN-CT-TV-02 cũng có: xung chiếu Ngọ có Tham Lang (H) nằm trong Triệt, Tử Vi chỉ bình hòa. VN01 xử đúng tình huống này ở đoạn bối cảnh. | du-lieu.md VN02 T5, Nô Bộc Ngọ; VAN-CT-TV-01/02 | Nhẹ | Thêm một vế: "tam phương có Tham Lang hãm nên vị thế có lúc lên xuống; chọn việc vừa sức". |
| 5 | VN02, Tài chính, Gợi ý | "Dồn các thủ tục tài chính (gia hạn, **tái cơ cấu khoản vay**, hợp đồng) vào năm nay" | **An toàn: lời khuyên tài chính vượt giới hạn.** Bài khuyên thời điểm cho một hành động tài chính cụ thể dựa vào sao, trái với câu miễn trừ ở đầu bài ("không thay lời khuyên chuyên môn về tài chính"). | NAM-CAM-04; tiêu chí An toàn (không vượt giới hạn tài chính); VAN-CAM chưa có dòng riêng, đề xuất Đức thêm | Nhẹ (trừ An toàn 1 điểm) | Đổi thành gợi ý thói quen: "rà lại giấy tờ tài chính đang có; việc vay hay tái cơ cấu nên hỏi người làm chuyên môn". |
| 6 | VN03, Tổng quan, đoạn "Việc riêng của năm" | "Thái Âm miếu ở đây: **năm tài lộc dồi dào**, thuận mua sắm, nhà đất, có tin vui gia đình" | Giọng khẳng định như hứa kết quả. Câu chép gần nguyên VAN-CT-TA-01 mà không đổi sang giọng xu hướng (NAM-PP-06, VAN-CAM-03). Ngay sau đó bài lại nói "giữ kỳ vọng vừa phải", hai câu tự mâu thuẫn. Vòng đại vận đã có tiền lệ sửa kiểu câu này (thêm "thường"). | VAN-CAM-03; NAM-PP-06; NAM-HOA-09 | Nhẹ | "Thái Âm miếu ở đây thường cho thấy năm có nguồn lợi, thuận việc nhà cửa, mua sắm cho gia đình". |
| 7 | VN03, T12 (Phúc Đức) | "Thái Dương miếu mang Hóa Quyền gốc là nguồn năng lượng tốt" | Bỏ sót **Triệt** ở cung Phúc Đức Tỵ. Thái Dương miếu gặp Triệt thì lực giảm, đến chậm. Các tháng khác trong bài đều ghi Tuần, Triệt. | du-lieu.md VN03: Phúc Đức Quý Tỵ, Triệt; CHUNG-TUAN-05 | Nhẹ | Thêm "Triệt làm năng lượng này đến chậm". |
| 8 | VN01, Ghi chú trường phái | "Xemtuvi.vn luận năm **theo phái Việt**: đọc cả cung Lưu Thái Tuế (trọng điểm năm) lẫn cung tiểu hạn (việc riêng)" | Câu này gán cho phái Việt cách chia vai "Thái Tuế là trọng điểm, tiểu hạn là việc riêng". QUY-TAC tự ghi đây là quy ước của xemtuvi.vn, còn sách Việt (TB) thường đặt nặng tiểu hạn và nhóm chưa trích được đoạn sách (NAM-TRANH-01 ⚑). | NAM-TRANH-01, NAM-PP-02 (nguồn là iztro WV1, không phải sách Việt) | Nhẹ | Viết như VN02, VN03: "Xemtuvi.vn đọc cả hai cung…, an sao và Tứ hóa theo phái Việt", không nói phái Việt chia vai như vậy. |

**Lỗi trong QUY-TAC.md và doan-mau.json**

| # | Mã | Lỗi | Mức | Cách sửa |
|---|---|---|---|---|
| Q1 | NAM-HOA-08(a); JSON `NAM-HOA-08-KY-LOC` (truongPhai "Trung Châu") | Lấy "tuổi Ất, Canh" làm ví dụ cho Thái Âm Kỵ gốc, rồi gắn nhãn Trung Châu. Tuổi Ất thì đúng ở mọi phái. Tuổi Canh thì chỉ bảng Việt có Thái Âm Kỵ (SPEC 10.4). Máy ghép đoạn sẽ tự đưa câu "Theo phái Trung Châu…" vào **mọi lá tuổi Canh** (1980, 1990, 2000), tức là lỗi 1 sẽ lặp lại hàng loạt. | **Nặng** (áp sai trường phái, gốc của lỗi 1) | Tách thành hai đoạn: (1) tuổi Ất giữ nhãn Trung Châu; (2) tuổi Canh dùng `truongPhai: "tổng hợp"`, câu chữ không dẫn Trung Châu, ghi chú "can Canh lệch bảng". Thêm điều kiện `canNamSinh` vào JSON (hoặc `khong` với Canh) để máy chọn đúng đoạn. |
| Q2 | NAM-TH-04 / JSON `NAM-TH-04`, `NAM-TH-04-TT` | QUY-TAC nói "cung … **có** Văn Xương, Văn Khúc", còn JSON cho phép `viTri: "tam-phuong"`, `toiThieu: 1`. Hai bản mâu thuẫn nhau. Cả hai đều thiếu vế loại trừ của VAN-SP-06 (Xương Khúc hãm hoặc gặp Kình Đà, Kỵ). | Nhẹ | Đức đọc nguyên văn TT q.1 問流年昌曲 để chốt điều kiện "tại cung" hay "hội tam phương". Thêm đoạn `NAM-TH-04-SAT` (Xương Khúc hãm hoặc gặp Kình Đà, Kỵ: thuận nhưng phải rà hồ sơ kỹ). |
| Q3 | NAM-LUU-04 / JSON `NAM-LUU-04` (`khong: []`) | Không có vế loại trừ theo VAN-SP-06. Đây là gốc của lỗi 2: cung có Kình, Đà hoặc Hóa Kỵ (gốc hoặc lưu) vẫn ra câu "thuận lợi hơn thường lệ". | Nhẹ (gây ra lỗi nặng 2) | Thêm `khong` gồm Kình Dương, Đà La, Hóa Kỵ, lưu Hóa Kỵ, kèm đoạn thay thế `NAM-LUU-04-SAT`. Bảo thêm phép kiểm vào `kiem-van-nam.cjs` (mục 6). |
| Q4 | NAM-HOA-08, NAM-TT-02 (thiếu ca) | Chưa có quy tắc cho **tuổi Đinh**: bốn hóa của năm trùng đúng bốn hóa gốc (Lộc–Lộc Thái Âm, Quyền–Quyền Thiên Đồng, Khoa–Khoa Thiên Cơ, Kỵ–Kỵ Cự Môn), và Lộc Tồn, Kình, Đà của năm trùng Lộc Tồn, Kình, Đà gốc. Mới có (c) Kỵ–Kỵ. Tuổi Đinh Sửu 1997 (31 tuổi) và Đinh Mão 1987 (41 tuổi) nằm giữa tệp khách mục tiêu. Riêng Kình, Đà trùng là chỗ sách diễn đạt nặng, dễ bị viết thành câu gây sợ. | Nhẹ (thiếu quy tắc, rủi ro an toàn khi viết tự do) | Thêm NAM-HOA-08(d) "hóa năm trùng hóa gốc: lĩnh vực của sao đó nổi rõ gấp đôi, cả thuận lẫn cần giữ" và một dòng NAM-LUU cho Kình Đà trùng, viết trung tính. Gắn ⚑ để Đức tìm nguồn. |
| Q5 | NAM-TT-03 | Câu "năm 2027: Thiên Lương ở Sửu" dễ hiểu thành vị trí cố định. Thực tế Thiên Lương nằm ở Sửu tùy từng lá; điều kiện đúng là "Thiên Lương nằm ở cung Sửu, xung chiếu Mùi" (JSON đã viết đúng: `viTri: "xung"`). Câu TT 太歲沖而為福 mới đọc qua trích đoạn, chưa có ⚑. | Nhẹ | Sửa câu chữ. Thêm ⚑ "đối chiếu nguyên văn 問天梁" vào danh sách việc của Đức. |
| Q6 | VAN-CT-TP-01 khi dùng ở lớp năm (VN02 bối cảnh) | Chưa định nghĩa "xa Tam Không" tính tại cung hay cả xung chiếu. VN02: cung vận Thìn sạch, xung chiếu Tuất có Tuần. | Nhẹ (chưa trừ điểm VN02) | Đề xuất của Thư: xét tại cung và xung chiếu. Không Kiếp, Tuần Triệt nằm ở xung chiếu thì hạ một bậc, viết dung hòa ("tính kho có, nhưng giữ dè dặt"), không chuyển hẳn sang TP-02. **Cần Đức chốt** rồi ghi vào `dai-van.md`. |

Thiếu độ sâu, không tính lỗi: VN02 Thái Tuế bỏ sót Thiên Không, Tài Bạch bỏ sót L. Tang Môn. VN03 Tình cảm bỏ sót L. Thiên Hư, Thiên Hình. VN01 bối cảnh gộp TV-02 và TP-02 thành một câu hơi nén (Hạnh đã tự nêu). Các mục này chỉ là ghi chú để bài sâu hơn, không bắt buộc sửa.

Ý kiến về câu hỏi của Hạnh (TU-KIEM mục 2, VN02 Giọng): ba gạch đầu dòng thử thách ở đoạn Thái Tuế **được giữ**, vì mỗi ý đều có gợi ý và ngay sau là đoạn "Phần đỡ". Có thể gộp gạch 1 và gạch 3 (việc vụn, kế hoạch đổi giữa chừng) cho nhẹ hơn, nhưng không bắt buộc.

### 4. Truy nguồn ngẫu nhiên (3–4 ý mỗi bài)

| Bài | Ý | Mã | Kết quả |
|---|---|---|---|
| VN01 | Mệnh Tham (V) gặp vận Tử Phủ: "đủ đầy, khó bứt phá" | VAN-PP-15 | Đúng |
| | Lưu Lộc Tồn ở Ngọ gặp Địa Không gốc: dùng bản KHONG | NAM-LUU-01-KHONG | Đúng (Tài Bạch có Địa Không (H)) |
| | Tham hóa Lộc ở tứ mộ "mức vừa phải" | CHUNG-HOA-THL-01 (TT) | Đúng |
| | NAM-TH-04 ở tiểu hạn | NAM-TH-04 | Lệch câu chữ quy tắc (lỗi 3) |
| VN02 | Mệnh VCD mượn Đồng Cự ở Thiên Di | CHUNG-VCD-01, NAM-PP-09 | Đúng |
| | Lưu Thái Tuế có Đà La gốc và lưu Kỵ | NAM-TT-04 | Đúng (Canh: Đà ở Mùi) |
| | Thái Âm Kỵ gốc gặp Lộc năm, "theo Trung Châu" | NAM-HOA-08-KY-LOC | **Sai trường phái** (lỗi 1) |
| | Lưu Xương và Việt ở Tài Bạch: "thuận hơn thường lệ" | NAM-LUU-04 | **Sai điều kiện** (lỗi 2) |
| VN03 | Thái Tuế trùng đại vận | NAM-PP-08-DV | Đúng |
| | NAM-TH-04-TT: Xương Khúc tại cung, đủ 3 nhóm (Khôi Việt, Khoa Quyền Lộc, Mã) | NAM-TH-04 | Đúng (đã kèm câu rà văn bản do Xương Kỵ, Kình) |
| | Song Lộc đồng cung kém song Lộc chiếu | NAM-HOA-09, VAN-SP-02 | Đúng |
| | Cự Lộc gốc gặp Kỵ năm, "theo Trung Châu" | NAM-HOA-08-LOC-KY | Đúng (can Tân giống nhau ở mọi bảng) |
| | T3 Thiên Phủ gặp Địa Không: dùng TP-02 | VAN-CT-TP-02 | Đúng |

Kết quả: truy 13 ý, có 10 ý khớp (77%). 3 ý không khớp là lỗi 1, 2, 3.

### 5. Ý kiến về 6 điểm Hạnh nêu chưa chắc (TU-KIEM mục 3)

| # | Điểm | Ý kiến của Thư | Kết luận |
|---|---|---|---|
| 1 | Cung năm chính: Lưu Thái Tuế hay tiểu hạn (NAM-TRANH-01) | Cách "luận cả hai, khi trái chiều thì viết hai mặt" an toàn cho bản 1, và cả 3 bài đều làm đúng. Riêng thứ bậc "Thái Tuế là trọng điểm" là **quy ước sản phẩm**, chưa có câu sách Việt nào đỡ, nên không được viết như quan điểm của phái Việt (lỗi 8). | Dùng được cho bản 1. **Cần Đức** trích TB để chốt thứ bậc. |
| 2 | Hóa gốc chồng hóa năm (NAM-HOA-08) | Nguyên tắc "hóa của vận, năm chạm hóa gốc thì phát động" được dùng rộng rãi. Áp từ đại vận sang năm, có ⚑ và giữ giọng xu hướng, là chấp nhận được. Điều kiện bắt buộc: hóa gốc đó phải có trong bảng của chính trường phái được dẫn tên. Can Canh vi phạm điều kiện này (lỗi 1, Q1). Thêm ca tuổi Đinh (Q4). | Kết luận được phần nguyên tắc. Nguồn trực tiếp cho lưu niên: **cần Đức**. |
| 3 | Sao lưu tính vào điều kiện (NAM-LUU-00), ghép Mã + Đà + Khúc (NAM-LUU-02) | TT2 xét Kình Đà của năm cùng cung tiểu hạn, nên cho sao lưu "có mặt" là có cơ sở. Đề xuất thêm một giới hạn: sao lưu chỉ tính vào điều kiện của sao phụ và câu thận trọng, **không** dùng để thành cách cục lớn (vd Tham Hỏa, Tử Phủ đồng cung). Câu ghép LUU-02 gồm ba vế, mỗi vế có quy tắc riêng, giọng đã trung tính, nên dùng được. | Kết luận được (kèm giới hạn trên). Câu sách trực tiếp: **cần Đức**. |
| 4 | Câu TT "須詳大限獨守…" lấy qua iztro (NAM-PP-04) | Không bài nào trích nguyên văn câu này cho khách, chỉ dùng làm phương pháp, nên rủi ro thấp. Thư không tự định vị được thiên. | **Cần Đức kiểm.** Trước khi định vị được thì giữ cách ghi "dẫn qua iztro". |
| 5 | Khởi lưu nguyệt Đẩu Quân (NAM-TRANH-04) | Câu quyết TT2 安斗君訣 trong QUY-TAC chép đúng. Thư tính tay tháng Giêng của 3 lá, cả 3 khớp engine. Đẩu Quân là cách chung của TT và sách Việt. Lệch so với iztro chỉ là chuyện giải thích cho khách, không phải lỗi. | Đạt cho bản 1. Đối chiếu iztro: **cần Đức** (không chặn). |
| 6 | Nguồn TT1, TT2, WV1 mới đọc trích đoạn | Ưu tiên đối chiếu nguyên văn hai câu đang hiện thẳng cho khách: 問天梁 "太歲沖而為福" (NAM-TT-03, có trong cả VN01 và VN03) và 問流年昌曲 (NAM-TH-04). | **Cần Đức kiểm** trước bản chốt. |

### 6. Đề xuất sửa quy trình

1. **Hạnh (sửa trước bản chốt):** sửa lỗi 1, 2, 5 ở VN02 và Q1, Q3 trong QUY-TAC/JSON (đây là các lỗi chặn). Sửa các lỗi nhẹ 3, 4, 6, 7, 8, Q2, Q4, Q5. Nghiệm thu: Thư duyệt lại VN02 đạt Đúng ≥ 8, An toàn = 10; `kiem-van-nam.cjs` vẫn Đạt.
2. **Đức (qua Minh):** chốt Q2 (問流年昌曲), Q5 (問天梁), Q6 (định nghĩa "xa Tam Không"), các điểm 1, 2, 3, 4, 5 ở mục 5.
3. **Bảo (qua Tùng, không gấp):** `kiem-van-nam.cjs` thêm hai phép kiểm. (a) Đoạn có `truongPhai` khác phái Việt mà dựa trên hóa của can Canh hoặc Nhâm thì báo lỗi (bắt được lỗi 1, Q1). (b) Đoạn "thuận" về Xương Khúc (NAM-LUU-04, NAM-TH-04) mà cung có Kình, Đà hoặc Hóa Kỵ thì cảnh báo (bắt được lỗi 2, Q3).
4. **Lỗi lặp lại so với vòng đại vận:** lại gặp dạng "chọn bản tốt khi điều kiện của bản cần thận trọng đã có" (DV09 trước đây, nay là lỗi 2 và 4). Đề xuất Hạnh thêm vào bước tự kiểm: với mỗi câu thuận, tìm xem quy tắc cặp (b) có đủ điều kiện không.

## Vòng 2

- Người chấm: Thư. Ngày 30/10/2026. Đối tượng: bản sửa của Hạnh, commit 859159b (`QUY-TAC.md`, `doan-mau.json`, `DINH-DANG.md`, `VN01.md`–`VN03.md`). Đối chiếu: kết luận nguồn của Đức `van-nam/kiem-nguon-duc.md` (commit b6d4eda) và `du-lieu.md`.
- Phạm vi: chỉ duyệt lại lỗi vòng 1, chấm lại đủ VN02, kiểm các đoạn bị đổi ở VN01 và VN03, quét từ cấm toàn bộ thư mục `van-nam/`.
- `node tools/kiem-van-nam.cjs`: Đạt (87 đoạn JSON, 46 quy tắc NAM, 3 bài đủ khung, không từ cấm, mọi mã có thật).

### 1. Kết luận

**ĐẠT.** Không còn lỗi nặng. VN02 đạt **9,00/10** (An toàn 10). Cả 3 lỗi nặng và 11 lỗi nhẹ của vòng 1 đã sửa đúng, khớp kết luận của Đức. Quy tắc tuổi Đinh đã có (NAM-HOA-08(d), NAM-LUU-07, NAM-CAM-02). Còn **3 lỗi nhẹ mới trong `doan-mau.json`** (N1–N3). Ba lỗi này không nằm trong bài mẫu nhưng **phải sửa trước khi chép JSON sang engine**, vì máy ghép đoạn sẽ ra câu "thuận" mà thiếu vế thận trọng (cùng dạng lỗi 2 ở vòng 1).

### 2. Lỗi vòng 1, trạng thái

| # | Lỗi vòng 1 | Mức | Đã sửa | Bằng chứng |
|---|---|---|---|---|
| 1 | VN02 gán nhãn Trung Châu cho Thái Âm Kỵ gốc tuổi Canh | Nặng | **Đạt** | Tổng quan, Sự nghiệp, T10 đổi thành "cách xét tổng hợp", có câu "theo bảng Tứ hóa xemtuvi.vn dùng; can Canh khác bảng giữa các sách". Ghi chú trường phái: KL, NL cho Âm Kỵ; TT, Trung Châu cho Đồng Kỵ, đúng Đức Q1. Bài không còn chữ "Trung Châu". |
| 2 | VN02 Tài chính: Xương Việt "thuận hơn thường lệ" trong khi cung có Kình, Hỏa hãm | Nặng | **Đạt** | Viết hai mặt: Thiên Việt giúp, Văn Xương gặp Kình Dương và Hỏa Tinh hãm nên giấy tờ dễ nhầm. T2 viết cùng hướng. Đối chiếu du-lieu VN02, Tài Bạch Dậu: đúng. |
| 5 | VN02 khuyên dồn thủ tục, tái cơ cấu khoản vay vào năm nay | Nhẹ (An toàn) | **Đạt** | Gợi ý mới: "Rà lại giấy tờ…; việc vay, gia hạn hay thay đổi khoản vay thì hỏi người làm chuyên môn". NAM-LUU-04 có thêm câu cấm dùng sao lưu làm căn cứ chọn thời điểm cho việc tài chính, pháp lý. |
| 3 | VN01 dùng NAM-TH-04 khi Xương Khúc chỉ ở cung xung chiếu | Nhẹ | **Đạt** | Bài ghi rõ "chưa phải năm thi cử thuận theo sách". Điểm thuận chuyển sang Hóa Khoa của năm ở cung Thái Tuế (NAM-HOA-06): đúng dữ liệu, vì Thiên Cơ ở Mùi nhận Lưu Khoa. Gợi ý đổi thành "lên kế hoạch từ đầu năm". |
| 4 | VN02 T5 thiếu VAN-CT-TV-02 | Nhẹ | **Đạt** | Đã thêm "cung đối diện có Tham Lang hãm (trong Triệt)". Đối chiếu: Nô Bộc Ngọ có Tham Lang (H) và Triệt. |
| 6 | VN03 câu khẳng định "năm tài lộc dồi dào" | Nhẹ | **Đạt** | Đổi thành "thường cho thấy năm có nguồn lợi…". |
| 7 | VN03 T12 bỏ sót Triệt | Nhẹ | **Đạt** | Đã thêm "Triệt làm năng lượng này đến chậm". |
| 8 | VN01 gán cách chia vai Thái Tuế/tiểu hạn cho phái Việt | Nhẹ | **Đạt** | Ghi chú đổi đúng mẫu NAM-TRANH-01: "đây là cách đọc của xemtuvi.vn; sách Việt như Tân Biên, Khảo Luận lấy tiểu hạn làm cung năm chính". VN02, VN03 cùng câu. |
| Q1 | NAM-HOA-08(a) gắn Trung Châu cho cả tuổi Ất và tuổi Canh | Nặng | **Đạt** | QUY-TAC ghi trường phái "tổng hợp", câu cho khách không dẫn Trung Châu. JSON tách `NAM-HOA-08-KY-LOC` (`canNamSinh: Ất`) và `-CANH` (`canNamSinh: Canh`, nguồn KL, NL, ghi chú "không được gắn nhãn Trung Châu"). DINH-DANG có ghi cho Kỹ thuật rằng engine chưa đọc `canNamSinh`/`motTrong`: đúng, đây là điều kiện trước khi chép JSON. |
| Q2 | NAM-TH-04 chữ và JSON lệch nhau (tại cung hay tam phương) | Nhẹ | **Đạt** | Theo Đức Q2: Xương Khúc của năm phải ở tại cung, các nhóm khác cần ≥ 2 ở tam phương. JSON: `saoLuu` `viTri: "chinh"`, `toiThieu: 2`. Có thêm `-SAT`, `-TT-SAT` và `-GOC` (⚑). Tính lại VN02 (L. Khúc tại Tỵ, ≥ 2 nhóm, có Đà và Kỵ thì dùng bản SAT) và VN03 (L. Xương tại Dậu, cung sạch, ≥ 2 nhóm thì dùng bản thuận): cả hai đúng. |
| Q3 | NAM-LUU-04 thiếu vế loại trừ | Nhẹ | **Đạt** (còn lệch nhỏ, xem N2) | JSON có `khong` (Kình, Đà gốc/lưu, Hóa Kỵ, lưu Hóa Kỵ) và đoạn `NAM-LUU-04-SAT`. VN01 T11 (Huynh Đệ Dậu không có Kình, Đà, Kỵ) giữ bản thuận: đúng. |
| Q4 | Thiếu quy tắc tuổi Đinh | Nhẹ | **Đạt** | NAM-HOA-08(c)(d): viết hai lớp, cấm "gấp đôi", không kết luận cát hung. JSON có đủ 4 đoạn trùng hóa (`KY-KY`, `LOC-LOC`, `QUYEN-QUYEN`, `KHOA-KHOA`, `canNamSinh: Đinh`). NAM-LUU-07 (tuổi Đinh **và Kỷ**, theo Đức Q4b) viết giọng trung tính. NAM-CAM-02 cấm câu 羊陀迭並…十生九死 và câu TB "tai họa khủng khiếp". |
| Q5 | NAM-TT-03 "Thiên Lương ở Sửu" dễ hiểu sai | Nhẹ | **Đạt** | Đã viết "tùy lá số có Thiên Lương ở đó hay không", nguyên văn đối chiếu 2 bản, gắn ⚑ tổng hợp ở phần áp cho Lưu Thái Tuế. VN01, VN03 đổi thành "Toàn Thư có câu…; áp vào năm…". |
| Q6 | "Xa Tam Không" chưa định nghĩa | Nhẹ | **Đạt** | Đức chốt theo TB (Tuần Triệt tính tại cung, Không Kiếp tính cả tam phương). VN02 giữ TP-01, thêm vế "Tuần ở Tử Tức nên phần hỗ trợ đến chậm". Đối chiếu: Thìn sạch, Thân và Tý không có Thiên Không, Địa Không. Đúng. |

### 3. Chấm lại VN02

| Đúng | Sâu | Giọng | An toàn | **TB** | Kết quả |
|---|---|---|---|---|---|
| 9 | 8 | 9 | 10 | **9,00** | **Đạt** (vòng 1: 7,75) |

- Đúng: đối chiếu lại từng cung với `du-lieu.md`: Thái Tuế Mùi, tiểu hạn Tỵ, Tài Bạch Dậu, Phu Thê Hợi, Tật Ách Thân, 12 tháng. Sao, độ sáng, Tuần Triệt, sao lưu đều khớp. Áp NAM-TH-04-SAT đúng điều kiện mới. Không còn chỗ dẫn sai trường phái. Trừ 1 điểm vì phần Tứ hóa can Canh vẫn phụ thuộc bảng đang tranh luận (xem mục 5, rủi ro).
- Sâu: đã thêm Tang Môn ở Tài Bạch, TV-02 ở T5, Tuần ở xung chiếu cung vận. Vẫn chưa đọc Thiên Không tại cung Thái Tuế, Hồng Loan ở Tật Ách (do bộ quy tắc chưa có câu, bài đã ghi rõ), nên giữ 8.
- Giọng: hai mặt rõ, gợi ý cụ thể, không hứa kết quả.
- An toàn: không còn lời khuyên chọn thời điểm cho hành động tài chính, có câu "hỏi người làm chuyên môn". Ghi chú không tính lỗi: câu T2 "chưa quyết khoản lớn" chấp nhận được vì là lời nhắc thận trọng; nếu sửa thì nên viết "quyết khoản lớn sau khi đọc kỹ giấy tờ" cho đồng bộ với mảng Tài chính.

VN01, VN03 (chỉ kiểm các đoạn bị đổi): **Đạt**, giữ điểm vòng 1. Đoạn bối cảnh mới của VN01 tách TV-02 và TP-02 đúng dữ liệu (Thất Sát ở Dần; Đà La, Địa Kiếp ở Thìn; Tuần tại Thân). Câu Thiên Hình, Thiên Hư của VN03 ở mảng Tình cảm viết trung tính. Đoạn NAM-TH-04 của VN03 ở Thiên Di Dậu đủ điều kiện mới, và đoạn NAM-TH-04-GOC ở Thái Tuế có kèm câu rà văn bản.

### 4. Lỗi nhẹ mới (trong JSON; Hạnh sửa, không chặn bài mẫu, **chặn việc chép JSON sang engine**)

| # | Mã | Lỗi | Cách sửa |
|---|---|---|---|
| N1 | `NAM-TH-04-GOC` (JSON) | Không có vế loại trừ, cũng không có bản SAT. Năm 2027, Kình Dương của năm luôn ở Mùi, nên khi đoạn này dùng cho cung Thái Tuế thì **luôn** gặp Kình. Máy sẽ ra câu "thuận cho học hành" mà không có câu rà văn bản. Hiện chỉ ghi ở `ghiChu`, máy không đọc trường này. VN03 viết tay nên đúng, còn máy ghép thì sai. | Thêm `NAM-TH-04-GOC-SAT`: cùng `khong`/`motTrong` như NAM-TH-04 và câu "giấy tờ dễ nhầm, rà soát kỹ". Đoạn GOC gốc thêm `khong` tương ứng. |
| N2 | `NAM-LUU-04`, `-SAT` (JSON) | QUY-TAC có vế loại trừ "Văn Xương gốc hãm cùng cung", còn `khong` và `motTrong` trong JSON không có. Chữ và máy lại lệch nhau, cùng dạng Q2 ở vòng 1. | Thêm điều kiện Văn Xương gốc hãm vào `motTrong` ở cả hai đoạn. |
| N3 | `NAM-LUU-07-LOC` (JSON, QUY-TAC) | Không có vế loại trừ Địa Không, Địa Kiếp tại cung. Đoạn này mâu thuẫn với `NAM-LUU-01-KHONG` khi tuổi Đinh, Kỷ có Không/Kiếp ở Ngọ: hai đoạn cùng khớp, một đoạn nói "rõ hơn thường lệ", đoạn kia nói ngược lại. TB P3 §4.3 cũng chỉ nói hanh thông khi "gặp nhiều sao sáng sủa tốt đẹp". | Thêm `khong: Địa Không, Địa Kiếp` để nhường cho NAM-LUU-01-KHONG. QUY-TAC ghi cùng điều kiện. |

Ghi chú (không tính lỗi): các đoạn HOA-08 của tuổi Ất, Tân, Đinh còn ghi "Trung Châu phái" trong trường `nguon`. Chấp nhận được, vì bảng Tứ hóa của ba can này giống nhau ở mọi phái và câu cho khách không dẫn tên. Nếu trang hiển thị trường `nguon` cho khách thì đổi thành "Tổng hợp (nguyên tắc Trung Châu nói cho đại vận)".

### 5. Hai điểm Đức còn giữ ⚑: cách xử lý

| Điểm | Xử lý | Lý do |
|---|---|---|
| Q4a: hóa năm trùng hóa gốc (tuổi Đinh) | **Giữ đoạn, giữ ghi chú nguồn** (`truongPhai: "tổng hợp"`, `tongHop: true`, ⚑ trong QUY-TAC). Không thêm câu dẫn sách cho khách. | Câu đã viết hai lớp, trung tính, không kết luận cát hung, nên rủi ro thấp. Bỏ ghi chú thì mất dấu vết rằng đoạn này chưa có nguồn trực tiếp. |
| M5-2: nguồn trực tiếp cho hóa chồng ở lớp lưu niên | **Giữ ghi chú nguồn**: câu cho khách ghi "cách xét tổng hợp"; ghi chú trường phái cuối bài nói rõ đây là mượn nguyên tắc vốn nói cho đại vận (VN02, VN03 đã làm). | Ba sách Việt không dùng lưu tứ hóa. Nói rõ điều này là đúng định vị "tin cậy học thuật". |

Rủi ro (đưa Minh quyết, không chặn): Đức phát hiện TB bản số hóa ghi Canh hóa Kỵ Thiên Đồng, Nhâm hóa Khoa Tả Phù (kiem-nguon-duc.md mục 4.2). Nếu Đức đối chiếu ảnh quét bản in rồi đổi bảng Canh trong SPEC, VN02 phải viết lại toàn bộ phần Thái Âm Kỵ gốc. Đề xuất chờ Đức chốt mục 4.2 trước khi đưa VN02 làm bài mẫu công khai ngày 10/12.

### 6. Từ cấm (quét toàn thư mục `van-nam/`)

- VN01–VN03 và trường `noiDung` của 87 đoạn JSON: **0 từ cấm** (giải hạn, bùa, cúng, hóa giải, phạm Thái Tuế, năm hạn, tai họa, tai ương, khủng khiếp, chết, gấp đôi…). "Chắc chắn" chỉ xuất hiện trong câu phủ định "Thuận không có nghĩa là chắc chắn": đạt.
- Các từ nặng chỉ có trong tệp nội bộ (QUY-TAC mục CAM, kiem-nguon-duc.md, TU-KIEM), và đều nằm trong ngữ cảnh **cấm dùng**. Đạt.

### 7. Việc tiếp theo

1. **Hạnh**: sửa N1–N3 trong `doan-mau.json` và QUY-TAC. `kiem-van-nam.cjs` vẫn phải Đạt. Thư không cần duyệt lại cả bộ, chỉ kiểm 3 đoạn này.
2. **Bảo (qua Tùng)**: bộ khớp đọc `canNamSinh`, `motTrong` trước khi chép JSON. Thêm 2 phép kiểm đã đề xuất ở vòng 1 mục 6.3.
3. **Đức**: chốt mục 4.2 (bảng Canh, Nhâm theo bản in TB) trước 10/12.

N1–N3 đã sửa (commit 744be0f) — Hạnh: thêm NAM-TH-04-GOC-SAT; NAM-LUU-04/-SAT có vế Văn Xương gốc hãm; NAM-LUU-07-LOC loại trừ Địa Không, Địa Kiếp. kiem-van-nam.cjs Đạt, test 9/9.
