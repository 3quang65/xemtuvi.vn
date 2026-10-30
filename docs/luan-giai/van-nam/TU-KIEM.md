# Tự kiểm bài mẫu Vận năm 2027 VN01–VN03 (việc T-23a91b)

- Người chấm: Hạnh (tự kiểm, **chưa phải kiểm duyệt của Thư**). Ngày 30/10/2026.
- Thang: 4 tiêu chí 0–10 như `docs/luan-giai/kiem-duyet-dai-van.md`: **Đúng** (sao, cung, độ sáng, Tứ hóa khớp `du-lieu.md`; ý khớp điều kiện quy tắc) · **Sâu** (đại vận làm nền, cả hai cung năm, tam phương, chồng lớp Tứ hóa, hai mặt) · **Giọng** ("hiểu mình, định hướng", không phán cố định) · **An toàn** (không mê tín, không gây sợ, không đoán bệnh, tai nạn, người thân). Ngưỡng: TB ≥ 8, An toàn = 10, không lỗi chặn (sai sao/sai Tứ hóa).
- Kiểm máy: `node tools/kiem-van-nam.cjs` → **Đạt** (76 đoạn JSON, 45 quy tắc NAM, 3 bài đủ khung tổng quan + 4 mảng + 12 tháng, mọi mã trong bài có thật, không từ cấm của `tu-cam.json`). `grep -rE "giải hạn|tai ương|cúng" docs/luan-giai/van-nam/` → 0 dòng.

## 1. Bảng điểm

| Bài | Hồ sơ giả lập | Đúng | Sâu | Giọng | An toàn | **TB** |
|---|---|---|---|---|---|---|
| VN01 | Nữ 30, Mậu Dần; Thái Tuế ở Tử Tức, tiểu hạn Phụ Mẫu, vận Phu Thê | 9 | 9 | 9 | 10 | **9,25** |
| VN02 | Nam 38, Canh Ngọ; Thái Tuế ở Thiên Di (nhiều sát), tiểu hạn Quan Lộc (Kỵ gốc gặp Lộc năm) | 8 | 9 | 8 | 10 | **8,75** |
| VN03 | Nữ 47, Tân Dậu; Thái Tuế trùng đại vận Quan Lộc, tiểu hạn Thiên Di (song Lộc), Lộc gốc gặp Kỵ năm | 8 | 8 | 9 | 10 | **8,75** |
| **TB** | | **8,3** | **8,7** | **8,7** | **10** | **8,9** |

Không có lỗi chặn đã biết: đối chiếu từng sao, độ sáng, Tứ hóa gốc, lưu tứ hóa, sao lưu, tiểu hạn, Lưu Thái Tuế, cung tháng với `du-lieu.md` (engine).

## 2. Đã kiểm theo từng bài

**VN01**
- Đúng: Lưu Thái Tuế Mùi = Tử Tức (Thiên Cơ Đ, Hóa Kỵ gốc, lưu Khoa, L. Kình, Thiên Việt) · tiểu hạn Hợi = Phụ Mẫu (Cự Môn Đ, lưu Kỵ, L. Khôi, L. Khốc) · lưu Lộc Thái Âm M ở Huynh Đệ (có Tuần) · L. Lộc Tồn ở Tài Bạch gặp Địa Không → dùng NAM-LUU-01-KHONG, không dùng bản tốt · Thiên Lương Sửu xung Thái Tuế (NAM-TT-03) có Triệt → đã ghi "đến chậm".
- Điều kiện đã cân: NAM-TH-04 đếm đủ 5 nhóm (Khôi Việt, Tả Phù, Thái Dương M, Khoa Quyền năm, Mã năm) nhưng Văn Xương hãm, gặp L. Đà → kèm câu rà hồ sơ. PHU-CC-06: đại vận ở Phu Thê nhưng tiểu hạn không → ghi "năm thuận, chưa phải năm định". Tham Lang hóa Lộc ở tứ mộ → thêm câu TT "mức vừa phải".
- Đã sửa trong lúc tự kiểm: T2 bỏ VAN-CT-LT-01 (cát tinh ở Tý chỉ có Tấu Thư, Thiên Tài, chưa đủ "gặp cát tinh").
- Trừ điểm nhỏ: VAN-CT-TV-02 trong đoạn bối cảnh dựa vào Thất Sát xung chiếu và Đà, Kiếp ở tam hợp; đúng điều kiện nhưng câu viết gộp với TP-02 hơi nén.

**VN02**
- Đúng: Mệnh vô chính diệu mượn Đồng Cự ở Thiên Di = cung Thái Tuế (NAM-PP-09) · Thiên Đồng H nhận lưu Quyền → bản HAM · Cự Môn H nhận lưu Kỵ + Đà La gốc → NAM-TT-04 · Triệt, Ân Quang, Thiên Quý làm phần đỡ · tiểu hạn Tỵ = Quan Lộc = Thân cư; Thái Âm H Kỵ gốc (bảng Việt can Canh) + lưu Lộc → NAM-HOA-08-KY-LOC (ghi Trung Châu) + bản HAM · L. Đà ở tiểu hạn → VAN-CT-TA-02 qua NAM-LUU-00.
- Trừ điểm Đúng: VAN-CT-TP-01 ở đoạn bối cảnh — cung vận không có Tuần/Triệt/Không, nhưng cung xung chiếu có Tuần; "xa Tam Không" chưa định nghĩa có tính xung chiếu không (cùng loại tranh cãi Thư nêu ở DV08). Đã viết đúng điều kiện tại cung, cần Thư/Đức chốt cách hiểu.
- Trừ điểm Giọng: đoạn Thái Tuế liệt kê ba gạch đầu dòng thử thách liền nhau; tuy mỗi ý có gợi ý và đoạn sau có phần đỡ, đọc vẫn nặng hơn hai bài kia. Đề xuất Thư xem có nên gộp còn hai ý.
- Mảng Sức khỏe: L. Hồng Loan ở Tật Ách chưa có quy tắc → ghi rõ, không suy diễn.

**VN03**
- Đúng: Thái Tuế trùng đại vận Quan Lộc (NAM-PP-08-DV) · tam phương Thái Tuế có Xương Khúc gốc tại cung, L. Khôi, Thiên Mã, Khoa gốc + năm, Quyền năm, Lộc gốc → NAM-TH-04-TT đủ 3 nhóm · tiểu hạn Dậu = Thiên Di = Thân cư; Thái Âm M + Lộc Tồn gốc + lưu Lộc → song Lộc đồng cung, ghi lời TB "không mạnh bằng chiếu" · Cự Môn Đ ở Tài Bạch: Hóa Lộc gốc (can Tân) + lưu Kỵ → NAM-HOA-08-LOC-KY (ghi Trung Châu) · Thiên Lương Sửu (Phu Thê) xung Thái Tuế → NAM-TT-03, có Tuần.
- Trừ điểm Đúng/Sâu: nền Phu Thê (Thiên Lương ở Sửu) và nền Tật Ách (Tham Lang ở Tuất) **chưa có quy tắc** trong bộ 12 cung; bài ghi rõ và chỉ dùng tính chất sao (CHUNG-CT-TL-01) / TAT-YN-03, nên hai mảng này mỏng hơn.

## 3. Điểm chưa chắc về học thuật (chuyển Đức kiểm, qua Minh)
1. **Cung năm chính** là Lưu Thái Tuế hay tiểu hạn (NAM-TRANH-01): bài luận cả hai; đoạn TB về tiểu hạn chưa đọc lại lần này.
2. **Chồng lớp hóa gốc với lưu hóa** (NAM-HOA-08): TC nói cho đại vận, đang áp sang năm; VN02, VN03 dựa vào đây.
3. **Sao lưu được tính vào điều kiện quy tắc nhập hạn** (NAM-LUU-00) và câu ghép Mã + Đà + Khúc (NAM-LUU-02): tổng hợp, chưa có câu sách trực tiếp.
4. Câu TT "須詳大限獨守…" (NAM-PP-04) mới thấy qua iztro, chưa định vị thiên trong bản Wikisource.
5. Khởi lưu nguyệt Đẩu Quân so với cách của iztro/trang Trung Quốc (NAM-TRANH-04) chưa đối chiếu.
6. Nguồn TT1, TT2, WV1 đọc trích đoạn qua công cụ đọc web, cần đối chiếu nguyên văn khi chuyên gia duyệt.

## 4. Việc tiếp theo
- Gửi Thư kiểm duyệt VN01–VN03 trước khi dùng cho chiến dịch Tết (chưa đưa lên site).
- Kỹ thuật (Tùng/Bảo, qua Minh): bộ khớp cần hỗ trợ điều kiện mới `tenCung`, `trung`, `saoLuu`, `luuHoa`, `nhom`, `chiNamSinh`, `khongCoYeuToNam` (DINH-DANG.md) và bảng đổi chữ "giai đoạn 10 năm" → "năm nay" khi tái dùng VAN-CT.

## 5. Đã sửa theo vòng 1 (việc T-752727, 30/10/2026)

Đầu vào: phiếu Thư `docs/luan-giai/kiem-duyet-van-nam.md` (vòng 1) và kết luận Đức `kiem-nguon-duc.md` (commit b6d4eda). Khác nhau thì theo Đức. Kiểm máy sau khi sửa: `node tools/kiem-van-nam.cjs` → **Đạt** (87 đoạn JSON, 46 quy tắc NAM, 3 bài đủ khung, không từ cấm, mọi mã có thật); `node --test tests/luan-giai-van-nam.test.cjs` → 9/9 đạt.

| # | Lỗi (mức) | Cách sửa | Ở đâu |
|---|---|---|---|
| 1 | VN02 dẫn "theo phái Trung Châu" cho Thái Âm Kỵ gốc tuổi Canh (**nặng**) | Bỏ nhãn Trung Châu ở cả 4 chỗ (tiểu hạn, Sự nghiệp, T10, ghi chú). Viết "cách xét tổng hợp (hóa của năm chạm hóa gốc cùng sao)" + câu "Thái Âm hóa Kỵ ở tuổi Canh theo bảng Tứ hóa xemtuvi.vn dùng; can Canh khác bảng giữa các sách". Ghi chú trường phái nêu rõ KL, NL (Âm Kỵ) và TT, Trung Châu (Đồng Kỵ); Hóa Khoa Thiên Đồng ghi "theo bảng này". Theo Đức (M5-2), VN03 (can Tân) cũng bỏ nhãn Trung Châu ở câu cho khách, chỉ giữ ở ghi chú. | VN02, VN03 |
| 2 | VN02 Tài chính: Xương Việt năm "thuận hơn thường lệ" khi cung có Kình, Hỏa hãm (**nặng**) | Viết hai mặt theo NAM-LUU-04-SAT, VAN-SP-06: có người giúp (Thiên Việt), giấy tờ dễ nhầm (Văn Xương gặp Kình, Hỏa hãm) → rà soát kỹ. T2 sửa cùng hướng. Thêm L. Tang Môn (mục "thiếu độ sâu"). | VN02 |
| 3 | VN01 dùng NAM-TH-04 khi Xương Khúc chỉ ở xung chiếu (nhẹ) | Theo Đức Q2: không đủ điều kiện, bỏ câu "theo Toàn Thư năm thuận thi cử". Thay bằng: Xương (hãm) và Khúc của năm ở cung đối diện, gặp Đà → rà hồ sơ; điểm thuận học đến từ Hóa Khoa năm (NAM-HOA-06). Gợi ý "đây là năm nên đăng ký" → "có thể lên kế hoạch từ đầu năm, chuẩn bị hồ sơ kỹ". | VN01 |
| 4 | VN02 T5 chỉ dùng VAN-CT-TV-01 (nhẹ) | Thêm vế TV-02: Tử Vi bình hòa, đối cung Tham Lang hãm trong Triệt → vị thế có lúc lên xuống; gợi ý "việc vừa sức". | VN02 |
| 5 | VN02 khuyên "dồn thủ tục… tái cơ cấu khoản vay vào năm nay" (nhẹ, trừ An toàn) | Đổi thành thói quen: rà giấy tờ tài chính đang có, đánh dấu điều chưa rõ; vay, gia hạn, thay đổi khoản vay thì hỏi người làm chuyên môn. Thêm vào NAM-LUU-04: không dùng sao lưu làm căn cứ khuyên thời điểm tài chính. | VN02, QUY-TAC |
| 6 | VN03 "năm tài lộc dồi dào" (nhẹ, Giọng) | "Thái Âm miếu ở đây thường cho thấy năm có nguồn lợi, thuận việc nhà cửa, mua sắm cho gia đình". | VN03 |
| 7 | VN03 T12 bỏ sót Triệt ở Phúc Đức (nhẹ) | Thêm "nhưng Triệt làm năng lượng này đến chậm" (CHUNG-TUAN-05). | VN03 |
| 8 | VN01 gán "phái Việt" cho cách chia vai Thái Tuế/tiểu hạn (nhẹ) | Ghi chú cả 3 bài: "xemtuvi.vn đọc cả hai cung…; sách Việt như Tân Biên, Khảo Luận lấy cung tiểu hạn làm cung năm chính" (Đức M5-1); "tháng theo Đẩu Quân của Toàn Thư". JSON NAM-PP-02-KHUNG: câu mở "Xemtuvi.vn đọc…", `truongPhai: "tổng hợp"`. | VN01–VN03, JSON |
| Q1 | NAM-HOA-08(a) gắn Trung Châu cho tuổi Canh (**nặng**) | QUY-TAC: NAM-HOA-08 ghi trường phái "tổng hợp", tách Ất / Canh, ghi bảng Canh theo từng sách (Đức Q1). JSON: `NAM-HOA-08-KY-LOC` (tuổi Ất) + `NAM-HOA-08-KY-LOC-CANH` (câu có "bảng xemtuvi.vn dùng; can Canh khác bảng"), cả hai `truongPhai: "tổng hợp"`, thêm điều kiện mới `canNamSinh` (ghi ở DINH-DANG). | QUY-TAC, JSON, DINH-DANG |
| Q2 | NAM-TH-04 câu chữ và JSON mâu thuẫn, thiếu vế loại trừ (nhẹ) | Theo Đức Q2: Xương Khúc **của năm tại cung** tiểu hạn/Thái Tuế, nhóm trợ lực ≥ 2; vế loại trừ Kình, Đà, Kỵ (VAN-SP-06) → `NAM-TH-04-SAT`, `NAM-TH-04-TT-SAT`; Xương Khúc gốc tại cung → `NAM-TH-04-GOC` ⚑ tổng hợp. VN02 nay dùng bản SAT (Văn Khúc năm tại Tỵ, có Đà, Kỵ); VN03 tiểu hạn Dậu đủ điều kiện thật (L. Văn Xương tại cung), cung Thái Tuế chuyển sang GOC ⚑. | QUY-TAC, JSON, VN01–VN03 |
| Q3 | NAM-LUU-04 không có vế loại trừ (nhẹ, gốc lỗi 2) | Thêm vế loại trừ vào QUY-TAC; JSON `khong` dùng điều kiện mới `motTrong` (Kình/Đà gốc hoặc lưu, Hóa Kỵ, lưu Hóa Kỵ) + đoạn `NAM-LUU-04-SAT`. Phép kiểm tự động (mục 6.3 phiếu Thư) là việc của Bảo. | QUY-TAC, JSON |
| Q4 | Thiếu quy tắc tuổi Đinh: hóa trùng, Kình Đà trùng (nhẹ) | NAM-HOA-08(c)(d): viết hai lớp tách riêng, **không "gấp đôi"**, ⚑ tổng hợp (Đức Q4a: không tìm thấy nguồn); JSON `-LOC-LOC`, `-QUYEN-QUYEN`, `-KHOA-KHOA`, sửa `-KY-KY`. NAM-LUU-07 mới cho **tuổi Đinh và Kỷ** (Đức Q4b, có nguồn TT q.3 論羊陀迭並, TB P3 §4.3), giọng trung tính; JSON `NAM-LUU-07-LOC/-KINH/-DA`. NAM-CAM-02 thêm cấm câu "羊陀迭並…十生九死" và "tai họa khủng khiếp". | QUY-TAC, JSON |
| Q5 | NAM-TT-03 "Thiên Lương ở Sửu" dễ hiểu là vị trí cố định (nhẹ) | Sửa câu: "Thiên Lương nằm ở cung xung chiếu (2027 là Sửu, tùy lá số)"; nguyên văn đã đối chiếu (Đức Q5); giữ ⚑ tổng hợp cho phần áp vào Lưu Thái Tuế; vế Bạch Hổ chỉ khi L. Bạch Hổ ở đúng cung. Bài VN01, VN03 đổi "Toàn Thư viết…" thành "Toàn Thư có câu…; áp vào năm, … thường…". | QUY-TAC, JSON, VN01, VN03 |
| Q6 | "Xa Tam Không" tính tại cung hay xung chiếu (nhẹ) | Theo Đức Q6: Tuần ở xung chiếu không tính; VN02 giữ VAN-CT-TP-01, thêm vế "cung đối diện có Tuần nên hỗ trợ từ phía Tử Tức đến chậm". | VN02 |
| Thêm | Mục "thiếu độ sâu" | VN02 Tài Bạch thêm L. Tang Môn; VN02 Thái Tuế: Thiên Không ghi "chưa có quy tắc riêng" trong mã ẩn (không luận thêm); VN03 Tình cảm thêm Thiên Hình (CHUNG-SP-08) và L. Thiên Hư (NAM-TT-06); VN01 bối cảnh tách TV-02 và TP-02 thành hai ý; VN02 Sức khỏe thêm TAT-VK-02 (Vũ Tướng: khám định kỳ). | VN01–VN03 |
| Thêm | Kết luận khác của Đức | NAM-PP-04, NAM-LUU-00 bỏ ⚑ (đã có nguồn); NAM-LUU-00 thêm giới hạn "không dùng sao lưu thành cách cục lớn"; NAM-TT-01, NAM-PP-02, NAM-TRANH-01 ghi rõ là quy ước xemtuvi.vn; NAM-THANG-01, NAM-TRANH-04 ghi "Đẩu Quân theo TT; TB, KL khởi tháng từ tiểu hạn" (đổi engine: Minh quyết). | QUY-TAC |

**Còn ⚑ (Đức giữ, viết giọng xu hướng):** NAM-HOA-08 (cả (a)–(d), không tìm thấy câu sách cho lưu niên), NAM-TT-03 (phần áp cho Lưu Thái Tuế), NAM-TH-04(d) Xương Khúc gốc, cùng các dòng ⚑ cũ chưa thuộc phạm vi T-ab4be9 (PP-06 đến 10, TT-04, TT-05, LUU-02, MANG-01, THANG-04).

**Lưu ý triển khai:** `doan-mau.json` bản này dùng hai điều kiện mới `canNamSinh`, `motTrong` mà bộ khớp `van-nam.ts` chưa đọc. **Chưa chép** đè `src/lib/luan-giai/ai/quy-tac-van/van-nam-2027.json`; cần Kỹ thuật hỗ trợ trước (DINH-DANG.md). Site hiện vẫn chạy bản JSON cũ (còn nhãn Trung Châu cho tuổi Canh) cho tới khi chép.
