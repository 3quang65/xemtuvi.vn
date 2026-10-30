# Phiếu kiểm thử độc lập: CC-08 "Ngoại lệ Sát Phá Tham" + TRANH-13 (commit 61841b1)

Người kiểm: Phúc · 30/10/2026 · Không sửa code. Script tạm: `/tmp/phuc/spt2.cjs` (chạy từ thư mục repo).

## Kết luận: ĐƯỢC GIAO BẢO (kèm 3 việc bắt buộc ở mục 3)

## 1. Engine/an sao không bị ảnh hưởng
- 61841b1 chỉ đổi 3 file `docs/nghien-cuu/*.md` (6 dòng), không đụng `src/`, `tests/`, `tuvi-test-cases.json`.
- `npm test`: 302 test, 295 pass, 0 fail, 7 skip (gồm bộ an sao 11 lá TC01–TC11 và TC09).
- Đối chiếu độ sáng sát tinh của engine với bảng SP-10 trên 66 sát tinh của 11 lá: lệch 0.

## 2. Lá có cách Sát Phá Tham: mức theo vế mới (điểm phá; đắc = 0)
Điểm đã loại trùng sao. Mức: 1 thành, 2 có khuyết, 3 phá cách (CC-08). "Code" = chữ bài tự động đang sinh ra.

| Bài | Điểm cũ → mới | Mức cũ → mới | Đổi mức? | Code đang ra |
|---|---|---|---|---|
| TC01 mệnh | 7→5 | 3→3 (Kỵ hóa vào Tham Lang, Địa Kiếp hãm) | không | dáng dấp (đúng) |
| TC01 quan-lộc, tài-bạch | 4→3 | 3→3 (Kỵ vào Tham Lang) | không | dáng dấp (đúng) |
| TC02 điền-trạch | 3→1 | 3→3 (chỉ vì Kỵ vào Tham Lang) | không, nhưng lý do đổi: Linh Tinh đắc không còn là lý do | dáng dấp (đúng) |
| TC03 phu-thê (= ban-03) | 4→2 | 3→3 | không | dáng dấp (đúng). Lý do duy nhất: Hỏa Tinh hãm tọa thủ Phu Thê; Kình (Thìn) và Kiếp (Thân) đắc = 0. Khớp câu trả lời của Đức |
| TC04 phu-thê | 2→2 | 2→2 | không | dáng dấp (SAI, xem 3a) |
| TC05 điền-trạch | 3→2 | 2→2 | không (Kình đắc = 0) | dáng dấp (SAI, 3a) |
| TC07 mệnh | 2→1 | 2→2 | không (Đà La đắc = 0; còn Kình hãm hội chiếu) | dáng dấp (SAI, 3a) |
| TC07 quan-lộc | 3→1 | 2→2 | không (Kiếp, Không đắc = 0) | dáng dấp (SAI, 3a) |
| TC07 tài-bạch | 4→4 | 3→3 (Kình hãm tọa thủ) | không | dáng dấp (đúng) |
| TC09 điền-trạch | 6→5 | 3→3 (Không hãm tọa thủ) | không | dáng dấp (đúng) |
| TC10 phu-thê | 2→2 (Tuần ở chính cung) | 2→2 | không | "thành cách", không ghi "có khuyết" (SAI, 3c) |
| TC11 mệnh, quan-lộc, tài-bạch | 5/6/4→5/5/3 | 3→3 (sát hãm tọa thủ hoặc điểm >= 4 hoặc nhiều hãm) | không | dáng dấp (đúng) |

Tóm lại: vế mới không làm đổi mức của lá nào trong 11 lá. Chỉ đổi điểm và lý do nêu ra (không được nêu sát tinh đắc: TC01, TC02, TC03, TC05, TC07, TC09, TC11).

## 3. Việc Bảo phải làm / lỗi phát hiện
a. **Đếm trùng sát tinh (lỗi nghiêm trọng, có từ trước vế mới)**: `phaCachMuc3` (`src/lib/luan-giai/ai/khop-v2.ts` dòng 87–98) và hàm `saoCua` gộp `hungTinh` + `phuTinh`, mà sát tinh nằm ở cả hai mảng, nên mỗi sát tinh bị tính 2 lần. Hệ quả: 4 bài đáng ở mức 2 (TC04 phu-thê, TC05 điền-trạch, TC07 mệnh, TC07 quan-lộc) bị ghi là "phá cách / dáng dấp", ngay cả theo spec cũ. Hàm `laPhaCach` trong `tests/luan-giai-cach-cuc-cc08.test.cjs` có cùng lỗi nên test không bắt được. Sửa: loại trùng theo tên sao ở cả hai nơi; thêm test đúng điểm cho 4 bài trên.
b. **Cài vế ngoại lệ**: trong `phaCachMuc3` và điều kiện `toiThieu: 2` sát tinh của quy tắc `...CC-SatPhaTham[-PHA]` (quy-tac-khung.json, 5 chuyên đề), chỉ tính sát tinh bình/hãm khi cách là Sát Phá Tham (đắc = 0; Kỵ, Tuần, Triệt giữ nguyên). Cách khác không đổi. Câu "hợp hơn khi các sát tinh đắc địa" đã có, giữ.
c. **Mức 2 chưa theo CC-08**: quy tắc "có khuyết" chỉ xét "từ hai sát tinh", bỏ Tuần/Triệt ở chính cung và Hóa Kỵ (TC10 phu-thê có Tuần ở chính cung nhưng ra "thành cách"). Nên chuyển sang dùng cùng bộ điểm với mức 3 (điểm > 0 và < 4 thì "có khuyết").
d. Câu thêm của TRANH-13 ("sức bứt phá lớn, cần nhịp nghỉ và tích lũy" khi từ 3 sát tinh đắc trở lên ở tứ chính, không Lộc Tồn/Hóa Lộc): **0/11 lá mẫu kích hoạt** (nhiều nhất 2 sát đắc). Cần test tổng hợp (lá giả lập hoặc kiểm hàm riêng) vì bộ mẫu không bắt được.

## 4. Mâu thuẫn / chỗ mơ hồ trong spec (không chặn giao)
1. CHUNG-PP-11 vẫn viết "gặp tứ sát ... thì coi là phá cách" không kèm ngoại lệ; CC-08 nay nói ngược cho Sát Phá Tham đắc địa. Nên thêm "(trừ Sát Phá Tham, xem CC-08)" vào PP-11 và CC-07.
2. CC-08 mức 2 ghi "không yếu tố nào vừa tọa thủ vừa hãm", ngoại lệ ghi "hãm tọa thủ vẫn là mức 3": nhất quán; nhưng Hóa Kỵ **đắc/hãm** của Tham Lang tọa thủ (TC01) cần rõ: code dùng quy tắc "Kỵ hóa vào chính sao tạo cách = mức 3" bất kể độ sáng. Đức xác nhận giúp.
3. TRANH-13 dùng chữ "tứ chính", CC-08 chỉ định điểm theo tứ chính, còn quy tắc khung dùng "tam-phuong": hiện trùng tập cung, nhưng nên thống nhất chữ.
4. Bình (Hỏa/Linh ở Sửu Mùi) tính điểm như hãm theo vế mới: đúng chữ spec, nhưng TT/phái Việt chưa rõ: nên Thư/Đức xác nhận trường hợp "bình".
