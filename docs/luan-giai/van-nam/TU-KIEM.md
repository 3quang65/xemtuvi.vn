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
