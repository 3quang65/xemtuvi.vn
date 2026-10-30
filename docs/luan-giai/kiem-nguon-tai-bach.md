# Kiểm nguồn 42 quy tắc Tài Bạch TB-S01..S14 (L-b2e4a1)

Người kiểm: Đức (Nghiên cứu), 30/10/2026. Đối tượng: commit 6cc423f, `src/lib/luan-giai/ai/quy-tac.json` (id `TB-S*`).
Cách kiểm: với mỗi sao, liệt kê mọi vị trí sao xuất hiện ở Tài Bạch (14 chính tinh an theo `docs/nghien-cuu/tuvi-ref-engine.py`), độ sáng theo bảng spec mục 6, rồi đối chiếu câu sẽ hiện với quy tắc `TAI-…`/`CHUNG-CT-…` của `docs/nghien-cuu/luan-giai-12-cung.md` mục 5.2, 0.2. Nguồn thêm: KL (*Tử Vi Khảo Luận*, Chương Hai, mục "Tài" của từng sao, bản quét archive.org/details/tuvikhaoluan).

Ghi chú quan trọng về bộ khớp: `khop()` trong `src/lib/luan-giai/ai/index.ts` chỉ so `sao[0]` + `doSang`. Bảng spec chỉ có Bình cho Tử Vi (Tý, Mão, Dậu, Hợi) và Thiên Phủ (Sửu, Mão, Dậu); Tử Vi, Thiên Phủ không có Hãm. Vì vậy 12 câu BINH của 12 sao còn lại và 2 câu HAM của Tử Vi, Thiên Phủ **không bao giờ hiện**.

## Bảng 42 dòng

| id | Kết quả | Lý do ngắn |
|---|---|---|
| TB-S01-TOT | đạt | Tử Phủ, Tử Tướng, Tử Sát Tỵ, Tử Phá, Tử Vi Ngọ: khớp TAI-TV-01/03; "tích lũy dần" không trái Tử Phá (TV-03). |
| TB-S01-BINH | đạt | Tý đơn thủ "khá, kém hơn Ngọ" (TV-01); Tử Tham Mão Dậu chọn diễn đạt "vững dần theo cách quản lý", hợp TAI-TRANH-01. |
| TB-S01-HAM | sửa | Câu lấy từ TAI-TV-02 (gặp sát tinh) nhưng ghi "kém sáng"; Tử Vi không có Hãm. Đổi tiền đề thành "đồng cung sát tinh". Điều kiện `doSang: Hãm` vẫn không bao giờ khớp, xem đề xuất B. |
| TB-S02-TOT | đạt | Câu chỉ nêu bản chất "lao tâm" (TT "劳心费力生财", đúng mọi vị trí), không hứa sung túc; giữ trung tính theo TAI-TRANH-02. Tý, Sửu cần câu riêng: đề xuất A. |
| TB-S02-BINH | đạt (không hiện) | Đúng CHUNG-CT-TCO-01; Thiên Cơ không có Bình. |
| TB-S02-HAM | sửa | Hãm = Hợi (đơn thủ) và Dần (Cơ Âm). "Lúc được lúc mất" ở Dần đến từ TAI-TCO-03, thêm mã này. |
| TB-S03-TOT | đạt | Dần→Ngọ, Nhật Nguyệt Sửu Mùi: khớp TAI-TDU-01/03; danh tiếng theo CHUNG-CT-TDU-01. |
| TB-S03-BINH | đạt (không hiện) | Thái Dương không có Bình. |
| TB-S03-HAM | đạt | Thân→Hợi, Tý: khớp TAI-TDU-02; Nhật Cự Thân (TB "vất vả") cũng khớp. |
| TB-S04-TOT | sửa | Câu này hiện cả ở Vũ Tham (VK-03: sau 30 mới phát) và Vũ Sát (VK-03: đầu vất vả). Thêm "có khi phải bền bỉ một thời gian mới thấy rõ kết quả" và mã TAI-VK-03; hết mâu thuẫn với S13-HAM (điểm 4). |
| TB-S04-BINH | đạt (không hiện) | Vũ Khúc không có Bình. |
| TB-S04-HAM | đạt | Hãm chỉ ở Tỵ Hợi = Vũ Phá: khớp nguyên văn TAI-VK-04. |
| TB-S05-TOT | đạt | Đồng Âm Tý, Đồng Lương, Mão: khớp TAI-TD-01 (KL cùng ý). Tỵ Hợi: TB luận kém (TAI-TRANH-02), câu không hứa sung túc; đề xuất A. |
| TB-S05-BINH | đạt (không hiện) | Thiên Đồng không có Bình. |
| TB-S05-HAM | đạt | Thìn Tuất, Dậu, Đồng Âm Ngọ, Đồng Cự Sửu Mùi: khớp TAI-TD-02/03; KL "Thìn Tuất túng thiếu", "đồng cung Cự túng thiếu". |
| TB-S06-TOT | đạt | Dần Thân, Liêm Phủ, Liêm Tướng khớp TAI-LT-01. Liêm Sát Sửu Mùi: KL "giàu có thất thường", hơi lệch "chậm nhưng chắc"; ghi vào đề xuất A. |
| TB-S06-BINH | đạt (không hiện) | Liêm Trinh không có Bình. |
| TB-S06-HAM | đạt | Liêm Tham Tỵ Hợi (TAI-LT-02), Liêm Phá Mão Dậu (TAI-LT-03); phần "tranh chấp vì tiền" ở Liêm Phá có KL đỡ ("tiền bạc đi liền với tai ương", đã trung tính hóa). |
| TB-S07-TOT | đạt | Tỵ Hợi, Tử Phủ, Vũ Phủ, Liêm Phủ: khớp TAI-TP-01, TAI-YN-04; KL "tốt đặc biệt ở Tỵ Hợi". |
| TB-S07-BINH | đạt | Sửu, Mão, Dậu đơn thủ: TAI-TP-01 "khá nhưng kém hơn". |
| TB-S07-HAM | sửa | Như S01-HAM: câu từ TAI-TP-02 (gặp sát tinh), Thiên Phủ không có Hãm. Đổi tiền đề thành "đồng cung sát tinh"; đề xuất B. |
| TB-S08-TOT | đạt | Dậu Tuất Hợi miếu (TAI-TA-01), Đồng Âm Tý, Cơ Âm Thân, Nhật Nguyệt Sửu Mùi: không trái. |
| TB-S08-BINH | đạt (không hiện) | Thái Âm không có Bình. |
| TB-S08-HAM | đạt | Mão Thìn Tỵ, Cơ Âm Dần, Đồng Âm Ngọ: khớp TAI-TA-02. |
| TB-S09-TOT | đạt | Thìn Tuất (TAI-THL-01), Vũ Tham (về sau khá), Dần Thân (THL-02: vào ra nhanh) đều khớp "có giai đoạn tiền vào nhanh, về sau càng khá". |
| TB-S09-BINH | đạt (không hiện) | Tham Lang không có Bình (Dần Thân engine cho Đắc). |
| TB-S09-HAM | sửa | Hiện cả ở Tử Tham Mão Dậu, nơi TB/TT nói "có nền tảng sẵn" (TAI-TRANH-01) và S01-BINH nói "khá". "Khiến tài chính hay eo hẹp" đổi thành "tài chính khó dư nếu thiếu kỷ luật chi tiêu" (đúng hướng trung tính hóa của THL-02); thêm mã LT-02, TRANH-01. |
| TB-S10-TOT | đạt | Tý Ngọ Hợi, Nhật Cự Dần, Cơ Cự: khớp TAI-CM-01, TCO-03; KL cùng ý. |
| TB-S10-BINH | đạt (không hiện) | Cự Môn không có Bình. |
| TB-S10-HAM | đạt | Thìn Tuất Tỵ, Đồng Cự Sửu Mùi: khớp TAI-CM-02, TD-03. |
| TB-S11-TOT | đạt | Khớp TAI-TT-01; "uy tín, chỉn chu" theo CHUNG-CT-TT-01. |
| TB-S11-BINH | đạt (không hiện) | Thiên Tướng không có Bình. |
| TB-S11-HAM | đạt | Hãm chỉ Mão Dậu đơn thủ: khớp TAI-TT-02 cả phần nghề kỹ thuật. |
| TB-S12-TOT | đạt | Khớp TAI-TL-01; KL "Lương Tí Ngọ giàu có". |
| TB-S12-BINH | đạt (không hiện) | Thiên Lương không có Bình. |
| TB-S12-HAM | đạt | Tỵ Hợi, Dương Lương Dậu: khớp TAI-TL-02; KL "Lương Nhật ở Dậu kiếm tiền chật vật". |
| TB-S13-TOT | sửa | Nội dung đạt (TAI-TS-01). Sửa trường `nguon`: thêm KL; KL Chương Hai mục Thất Sát khớp TB (điểm 3). |
| TB-S13-BINH | sửa | Không hiện; sửa `nguon` như S13-TOT cho đồng bộ. |
| TB-S13-HAM | sửa | Hãm = Thìn Tuất (đơn thủ, TS-02), Mão Dậu (Vũ Sát, VK-03: đầu vất vả sau dễ), Hợi (Tử Sát). Câu cũ chỉ đúng Thìn Tuất. Viết lại "giai đoạn đầu thường phải tự xoay xở, hay eo hẹp hơn mong muốn", thêm mã VK-03, nguồn KL, TT. |
| TB-S14-TOT | đạt | Tý Ngọ, Thìn Tuất (TAI-PQ-01), Tử Phá Sửu Mùi: không trái; KL "Tí Ngọ giầu có". |
| TB-S14-BINH | đạt (không hiện) | Phá Quân không có Bình. |
| TB-S14-HAM | sửa | Hiện cả ở Vũ Phá (VK-04: hợp sản xuất, thương mại; S04-HAM cùng hiện) và Liêm Phá. Bỏ ý "hợp nghề thủ công, mỹ thuật" (chỉ đúng Dần Thân đơn thủ), thêm mã LT-03, VK-04. |

Tổng: 33 đạt (trong đó 11 câu BINH không hiện), 9 sửa.

## Xử lý 4 điểm Hạnh nêu

1. **Thiên Cơ Tý, Sửu**: engine cho Đắc nên ra TB-S02-TOT. Câu TOT chỉ nói bản chất lao tâm, không hứa sung túc, nên giữ (đúng TAI-TRANH-02). Nguồn thứ ba KL xác nhận Tý Sửu "chật vật" (đã ghi vào TAI-TCO-02). Cần câu riêng theo địa chi: đề xuất A1.
2. **Tử Vi, Thiên Phủ không có Hãm**: sửa S01-HAM, S07-HAM về đúng tiền đề "đồng cung sát tinh" (TAI-TV-02, TP-02). Định dạng cũ chỉ cho một sao trong `cungCo`, nên điều kiện đúng phải viết ở bản 2: đề xuất B. 12 câu BINH không hiện: nội dung không sai nguồn, giữ làm dự phòng; đề xuất C.
3. **Thất Sát chỉ TB + WT7**: đã tìm thêm. KL Chương Hai, mục Thất Sát, phần Tài khớp TB cả 6 ý. Đã ghi vào TAI-TS-01/02, TAI-TRANH-05 và trường `nguon` của S13. NL (3 tập bản quét) không có mục Thất Sát theo cung.
4. **TC07 Vũ Khúc Đắc + Thất Sát Hãm (Vũ Sát Mão Dậu)**: hai câu đã chỉnh để nói cùng một hướng: S04-TOT ("thuận, có khi phải bền bỉ một thời gian") và S13-HAM ("giai đoạn đầu phải tự xoay xở"). Hai câu cùng khớp TAI-VK-03 và KL ("Sát Vũ lập nghiệp tự lực, vất vả buổi đầu"). Câu đồng cung riêng: đề xuất A2.

## Đề xuất cho Kỹ thuật (Minh chuyển; không sửa code `src/*.ts`)

Định dạng cũ (`quy-tac.json`) chỉ có `doSang`, `hoa`, `cungCo` (một sao). Theo các điều kiện dưới đây, nên chuyển các câu đồng cung / địa chi sang định dạng bản 2 (`docs/luan-giai/quy-tac-v2/DINH-DANG.md`: `chi`, `sao` nhiều sao cùng cung, `toiThieu`, `khong`) và loại câu chung bằng `khong`.

**A1. Thiên Cơ Tý, Sửu** (TAI-TCO-02, TAI-TRANH-02, KL):
```json
{ "id": "TB-TCO-02-TYSUU", "chuyenDe": "tai-bach", "cung": "Tài Bạch", "loai": "CT",
  "maNghienCuu": ["TAI-TCO-02", "TAI-TRANH-02", "CHUNG-CT-TCO-01"],
  "dieuKien": [{ "sao": ["Thiên Cơ"], "chi": ["Tý", "Sửu"] }],
  "noiDung": "Thiên Cơ tại Tài Bạch: về tiền bạc, bạn có xu hướng kiếm tiền bằng trí óc, nhưng kết quả thường đến chậm hơn công sức bỏ ra. Nên thử ý tưởng kiếm tiền ở quy mô nhỏ trước, có kết quả rồi mới mở rộng.",
  "muc": "phong-cach", "truongPhai": "Tam hợp phái Việt",
  "nguon": ["Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)", "Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)"] }
```
TB-S02-TOT khi chuyển thêm `"khong": [{ "sao": ["Thiên Cơ"], "chi": ["Tý", "Sửu"] }]`. Cùng cách cho Thiên Đồng Tỵ Hợi (TAI-TRANH-02) và Liêm Sát Sửu Mùi (KL "giàu có thất thường").

**A2. Vũ Sát Mão, Dậu** (TAI-VK-03, KL):
```json
{ "id": "TB-VK-03-VUSAT", "chuyenDe": "tai-bach", "cung": "Tài Bạch", "loai": "CT",
  "maNghienCuu": ["TAI-VK-03", "CHUNG-CT-VK-01", "CHUNG-CT-TS-01"],
  "dieuKien": [{ "sao": ["Vũ Khúc", "Thất Sát"] }],
  "noiDung": "Vũ Khúc cùng Thất Sát tại Tài Bạch: về tiền bạc, bạn có xu hướng tự lực gây dựng, giai đoạn đầu vất vả rồi về sau mới dễ hơn. Nên đặt mục tiêu tích lũy theo mốc vài năm thay vì kỳ vọng kết quả nhanh.",
  "muc": "phong-cach", "truongPhai": "Tam hợp phái Việt",
  "nguon": ["Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)", "Tử Vi Đẩu Số Toàn Thư (Hy Di Trần Đoàn)"] }
```
TB-S04-TOT và TB-S13-HAM khi chuyển thêm `"khong": [{ "sao": ["Vũ Khúc", "Thất Sát"] }]`. Làm tương tự cho Vũ Tham (VK-03), Tử Sát Hợi (TV-03), Tử Tham (TRANH-01), Liêm Phá / Vũ Phá ở S14-HAM.

**B. Tử Vi / Thiên Phủ gặp sát tinh** (thay điều kiện chết `doSang: Hãm` của S01-HAM, S07-HAM):
```json
"dieuKien": [{ "sao": ["Tử Vi"] }, { "sao": ["Kình Dương", "Đà La", "Hỏa Tinh", "Linh Tinh", "Địa Không", "Địa Kiếp"], "toiThieu": 1, "viTri": "chinh" }]
```
Thiên Phủ thì thay `"Tử Vi"` bằng `"Thiên Phủ"`. Cần Kỹ thuật kiểm `toiThieu` + `viTri: chinh` có đúng nghĩa "đồng cung" không (DINH-DANG ghi `toiThieu` là "rải trong vị trí"; với `chinh` thì là cùng cung).

**C. 12 câu BINH không hiện**: không sai nguồn, giữ. Nếu sau này bảng độ sáng đổi (ví dụ thêm bậc Bình theo nguồn khác) thì dùng được ngay. Nếu Minh muốn bộ gọn hơn thì có thể xóa; không ảnh hưởng đầu ra.

## Điểm còn tranh cãi
- Thiên Cơ ở Tỵ: TB (TAI-TCO-01) xếp vào nhóm sáng, sung túc; KL xếp vào nhóm chật vật. Giữ theo TB và bảng spec (Vượng).
- KL và TB cùng dòng sách Việt thập niên 1960, ý về Thất Sát gần như trùng, nên chưa chắc là hai nguồn độc lập hoàn toàn.
