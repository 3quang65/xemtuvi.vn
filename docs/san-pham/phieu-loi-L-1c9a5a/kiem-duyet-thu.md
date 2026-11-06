# Phiếu kiểm duyệt 3 bài xuất ra từ site (L-1c9a5a)

Người chấm: Thư (kiem-duyet). Ngày: 2026-10-31. Đầu vào: `bai-1.md`, `bai-2.md`, `bai-3.md` (Phúc chép nguyên văn từ v3.xemtuvi.vn, gói Trọn lá số), `phieu-loi.md` (LOI-07, LOI-08).
Chuẩn chấm: skill `kiem-duyet-noi-dung` (Đúng/Sâu/Giọng/An toàn, 0–10). Đạt khi TB ≥ 7,5, không tiêu chí nào < 6, Sâu ≥ 6, An toàn = 10.
Đối chiếu lá số: `python3 -I ~/xemtuvi.vn/docs/nghien-cuu/tuvi-ref-engine.py 1995 8 15 7 0 nu` / `1988 3 2 23 30 nam` / `1960 5 20 10 0 nam`. Độ sáng theo bảng spec mục 6 (`docs/nghien-cuu/tuvi-an-sao-spec.md` dòng 549–575). Khung mục bắt buộc từng tab: `src/lib/luan-giai/ai/chuyen-de.json`.
Script `dem-sao-bo-sot.cjs` không chạy được trên 3 file này (cần định dạng `ban-*.md` có mục "Sao các cung liên quan"); các số đếm câu khuôn bên dưới đếm bằng grep trên chính file.

## Kết luận

**Cả 3 bài KHÔNG ĐẠT.** TB chung 5,92 (Đúng 4,0; Sâu 4,7; Giọng 5,0; An toàn 10). An toàn sạch ở cả 3 bài. Không bài nào đủ Đúng ≥ 6 hay Sâu ≥ 6. Điều kiện chặn số 2 trong phiếu của Phúc ("bài dưới ngưỡng Thư") là **CÓ**.

## Bảng điểm

| Bài | Lá số | Đúng | Sâu | Giọng | An toàn | TB | Kết quả |
|---|---|---|---|---|---|---|---|
| bai-1 | Nữ 15/8/1995 07:00, Mệnh Thìn Thất Sát (c1, "Lá số 2") | 4 | 5 | 5 | 10 | 6,00 | Không đạt |
| bai-2 | Nam 2/3/1988 23:30, Mệnh Dần vô chính diệu (c2, "Lá số 3") | 3 | 4 | 5 | 10 | 5,50 | Không đạt |
| bai-3 | Nam 20/5/1960 10:00, Mệnh Tý Thiên Cơ (c4, "Lá số 4") | 5 | 5 | 5 | 10 | 6,25 | Không đạt |

Tham chiếu: đợt mẫu 2 TB 6,68 (Sâu 5,4). Bản chạy thật thấp hơn đợt mẫu 2.

### Lý do từng bài
- **bai-1**: Đúng 4, vì có 3 câu tả sao hãm như sao sáng (Tham Lang Tý H, Phá Quân Thân H, Văn Khúc Thân H) và 1 câu dung hòa Triệt sai cung (2 lỗi nặng, trần 4). Sâu 5: cách Sát Phá Tham, Tử Phủ Vũ Tướng, Nhật Nguyệt có nêu và có điều kiện phá cách; nhưng tab Tài chính và Gia đạo thiếu mục bắt buộc, không có "Tóm lại". Giọng 5: 14 câu "ảnh hưởng đến …:", nhiều câu lạc chuyên đề ở Gia đạo. An toàn 10.
- **bai-2**: Đúng 3, vì 2 câu khẳng định "Không Kiếp giáp" trong khi Địa Không và Địa Kiếp cùng đóng ở Hợi; thêm 1 câu dung hòa Triệt sai cung và 2 sao hãm tả như sáng. Sâu 4: tab Tài chính gần như trống (khoảng 900 ký tự, không có Cự Môn, Hóa Khoa Hữu Bật, Tuần, đều đóng ngay tại Tài Bạch). Ở Gia đạo và Vận 10 năm, Không Kiếp vừa được gọi là trợ lực vừa bị coi là gây hao, không có câu dung hòa. Giọng 5: 18 câu "ảnh hưởng đến …:", câu "bàn với người cùng làm" xuất hiện trong tab Tình cảm. An toàn 10.
- **bai-3**: Đúng 5, vì 3 câu tả sao hãm như sao sáng (Thái Âm Thìn H hai lần, Thái Dương Tuất H). Thế Nhật Nguyệt cả hai sao hãm vẫn được gọi là "dáng dấp thế Nhật Nguyệt". Sâu 5: có 1 câu dung hòa đúng (Tuần cùng Hóa Kỵ ở Quan Lộc, dòng 151), nhưng tab Tài chính bỏ Thiên Đồng, Thiên Lương, Lộc Tồn và Hóa Khoa đều đóng tại Tài Bạch, tab Gia đạo bỏ Thiên Phủ, Tình cảm bỏ Hóa Lộc tại chính Phu Thê và Thân cư Phu Thê. Giọng 5: người 66 tuổi mà tab Sự nghiệp khuyên "chủ động nhận việc", "giai đoạn chuyển việc"; câu khuôn nhiều. An toàn 10.

## LOI-07 và LOI-08 (của Phúc)

**LOI-07: XÁC NHẬN, nâng từ NÊN SỬA lên CHẶN.** Gốc lỗi không nằm ở độ dài mà ở chỗ hai tab không sinh ra các mục bắt buộc của khung.
- `chuyen-de.json` quy định tab Tài chính có mục "Cách kiếm và giữ tiền" (chính tinh tại Tài Bạch), tab Gia đạo có "Nhà cửa và nếp nhà" (chính tinh tại Điền Trạch) và "Cha mẹ, anh chị em, con cái". Cả 3 bài đều **không có** các mục này. Mục "Cung hợp chiếu" của hai tab này cũng chỉ ra câu vô chính diệu hoặc không có gì, không nêu chính tinh của các cung chiếu.
- Hệ quả: tab Tài chính bai-2 còn 895 ký tự, bai-3 còn 1.374, bai-1 còn 1.793. Gia đạo bai-3 còn 1.181. Mức 961 ký tự Phúc đo ở "Lá số 1" (Mệnh Cự Môn) cũng đúng dạng lỗi này.
- Lý do nâng mức: đây là phần khách trả tiền, chính tinh của cung chủ đề là nội dung cốt lõi, và lỗi kéo Sâu của cả 3 bài xuống dưới 6.
- Tái hiện: v3.xemtuvi.vn, tài khoản thử, ô "Lá số" chọn "Lá số 3" (nam 2/3/1988 23:30), mở tab Tài chính. Chỉ có Cách cục, Cung hợp chiếu (1 câu vô chính diệu), Sao hỗ trợ (3 câu). Không câu nào nhắc Cự Môn dù lá số có Cự Môn tại Tài Bạch (Tuất). Làm tương tự với "Lá số 4" thì thấy tab Tài chính không nhắc Lộc Tồn, Thiên Đồng hóa Khoa, Thiên Lương, đều đóng tại Thân; tab Gia đạo không nhắc Thiên Phủ tại Mão.
- Chuyển: Bảo (bộ ghép không sinh mục `phong-cach` cho Tài Bạch/Điền Trạch, thiếu luật chính tinh × cung chiếu), Hạnh (kiểm có đủ câu chính tinh × Tài Bạch/Điền Trạch chưa). Nghiệm thu: 3 lá số trên, mỗi tab Tài chính/Gia đạo có câu cho từng chính tinh tại cung và tại 3 cung chiếu.

**LOI-08: XÁC NHẬN, giữ NÊN SỬA**, riêng phần bai-3 thì đổi lại chẩn đoán.
- bai-2, tab Vận 10 năm. Dòng 278 viết "Lộc Tồn, Địa Không, Địa Kiếp cùng hội về vận: phần lợi từ Lộc Tồn bị giảm bớt", dòng 289 lại viết "Địa Không, Địa Kiếp đắc địa…: mưu sự có thể thành nhanh", còn dòng 255 nói "sát tinh có chiếu cũng ít làm hỏng". Không có câu nào dung hòa ba ý này. Đúng là mâu thuẫn.
- bai-2, tab Gia đạo. Dòng 210 gọi Không Kiếp đắc địa là "trợ lực… sức bền", dòng 213 lại nói Không Kiếp "làm bức tranh nhiều biến đổi hơn". Tên Địa Kiếp xuất hiện 3 lần (dòng 210, 213, 232). Lỗi đúng như Phúc báo.
- bai-3, tab Sự nghiệp. Việc nêu cả Cơ Nguyệt Đồng Lương lẫn Nhật Nguyệt **không phải** mâu thuẫn, vì một lá số có thể hội nhiều cách. Lỗi thật là Thái Dương ở Tuất (H) và Thái Âm ở Thìn (H) đều hãm mà vẫn gọi là "dáng dấp thế Nhật Nguyệt", tức đang dùng tên một cách tốt. Lỗi này ghi riêng ở TH-04.
- Tái hiện: chọn "Lá số 3", tab Vận 10 năm, đọc mục "Điều cần chú ý" rồi "Ảnh hưởng xung quanh". Tab Gia đạo, đọc mục "Cách cục".

## Lỗi mới (Thư)

Tổng toàn phiếu: **CHẶN 2** (LOI-07 nâng mức, TH-01), **NÊN SỬA 10** (LOI-08, TH-02 đến TH-10), **NHỎ 3** (TH-11 đến TH-13).
Bước tái hiện chung: v3.xemtuvi.vn, đăng nhập tài khoản thử, ô "Lá số" chọn đúng số ghi trong lỗi (bai-1 = "Lá số 2", bai-2 = "Lá số 3", bai-3 = "Lá số 4"; xem LOI-01), mở tab ghi trong lỗi, tìm câu trích. Đối chiếu vị trí sao bằng lệnh engine ở đầu phiếu, độ sáng theo bảng spec mục 6.

### CHẶN
**TH-01. Khẳng định thế "Không Kiếp giáp" trong khi Địa Không và Địa Kiếp cùng đóng một cung.** Bài 2, tab Tình cảm (dòng 81) và tab Tài chính (dòng 180).
- Câu trích: "Địa Không và Địa Kiếp nằm ở hai cung kề Phu Thê (thế Không Kiếp giáp)" và "Địa Không và Địa Kiếp nằm ở hai cung kề Tài Bạch (thế Không Kiếp giáp)".
- Thực tế: sinh giờ Tý thì Địa Không và Địa Kiếp cùng ở Hợi (engine `"Địa Kiếp": "Hợi", "Địa Không": "Hợi"`, tab Gia đạo của chính bài này cũng ghi cả hai ở Tử Tức Hợi). Hợi chỉ kề một phía của Tý và một phía của Tuất, nên không có thế giáp.
- Lỗi quy tắc: điều kiện giáp không bắt hai sao ở **hai phía khác nhau**. Mọi lá số giờ Tý hoặc Ngọ (Không Kiếp đồng cung ở Hợi hoặc Tỵ) sẽ bị gắn sai thế giáp cho 2 cung kề.
- Tái hiện: "Lá số 3", tab Tình cảm, mục Cách cục, câu thứ 3.
- Chuyển: Bảo (điều kiện), Đức (xác nhận). Nghiệm thu: lá số 2/3/1988 23:30 không còn câu Không Kiếp giáp, và có test cho trường hợp Không Kiếp đồng cung.

(LOI-07 nâng lên CHẶN: xem mục trên.)

### NÊN SỬA
**TH-02. Câu dung hòa Triệt áp sang cung khác (lỗi đã biết từ đợt 2, nay tái phát).** Triệt chỉ tác động cung nó đóng, nhưng câu lại nói Triệt làm dịu Hóa Kỵ đang ở cung khác.
- Bài 1, Gia đạo, dòng 236: "Điền Trạch có Triệt trong khi Hóa Kỵ nằm ở cung hợp chiếu (Điền Trạch và Tật Ách): Triệt làm cả mặt mạnh lẫn mặt vướng đều dịu đi…". Triệt ở Ngọ/Mùi, Hóa Kỵ (Thái Âm) ở Hợi.
- Bài 2, Tình cảm, dòng 125: "Phu Thê có Triệt trong khi Hóa Kỵ nằm ở cung hợp chiếu (Phu Thê và Thiên Di)…". Triệt ở Tý/Sửu, Hóa Kỵ (Thiên Cơ) ở Thân.
- Tái hiện: "Lá số 2" tab Gia đạo câu cuối; "Lá số 3" tab Tình cảm câu cuối. Chuyển: Bảo (chỉ sinh câu khi Tuần/Triệt đóng cùng cung với hóa).

**TH-03. Sao hãm tả bằng nét tích cực, không nêu mặt cần chú ý.**
- Bài 1, Bản thân, dòng 33: Tham Lang Tý (H) "tiếp thêm nét đa tài, ham học hỏi, giỏi giao tiếp". Cùng tab, dòng 36: Phá Quân Thân (H) "thích đổi mới, dám bứt phá, không ngại làm lại". Sự nghiệp, dòng 149: Văn Khúc Thân (H) "có khiếu biểu đạt, nghệ thuật, khéo ăn nói".
- Bài 2, Bản thân, dòng 30: Cự Môn Tuất (H) "lời nói có sức nặng". Tình cảm, dòng 97: Thiên Đồng Thìn (H) "nhẹ nhàng, dễ thông cảm".
- Bài 3, Bản thân, dòng 27: Thái Âm Thìn (H, hóa Kỵ) "tinh tế, giàu cảm xúc, chú ý chi tiết". Tình cảm, dòng 82: Thái Âm "dịu dàng, nhạy cảm". Sự nghiệp, dòng 134: Thái Dương Tuất (H) "có tầm ảnh hưởng, dễ được ghi nhận".
- Tái hiện: mở tab, mục "Cung hợp chiếu" hoặc "Sao hỗ trợ". Chuyển: Hạnh (câu chính tinh × cung chiếu cần bản theo độ sáng), Bảo (chọn bản theo độ sáng).

**TH-04. Thế Nhật Nguyệt có cả hai sao hãm vẫn gọi là "dáng dấp thế Nhật Nguyệt".** Bài 3, Tình cảm dòng 72 và Sự nghiệp dòng 121.
- Câu trích: "Có dáng dấp của thế Nhật Nguyệt: có sao kém sáng…".
- Thực tế: Thái Dương Tuất (H) và Thái Âm Thìn (H) đều hãm. Câu cần nói rõ cả hai đều hãm (phái Việt gọi là thế Nhật Nguyệt phản bối), không nên viết "có sao kém sáng" theo khung của một cách tốt. Ở dòng 72 cũng không nhắc Thái Dương hóa Lộc.
- Tái hiện: "Lá số 4", tab Tình cảm, mục Cách cục. Chuyển: Hạnh, Bảo.

**TH-05. Chính tinh bị xếp vào nhóm "sát tinh" hoặc "yếu tố hung".**
- Bài 1, Vận 10 năm, dòng 279: "tam phương có nhiều sát tinh (Tử Vi, Đà La, Linh Tinh)".
- Bài 2, Bản thân, dòng 11: "nhiều yếu tố hung (Hỏa Tinh, Thiên Cơ, Kình Dương, Linh Tinh)". Cái hung ở đây là Hóa Kỵ, nên phải ghi "Thiên Cơ hóa Kỵ".
- Tái hiện: "Lá số 2" tab Vận 10 năm, mục "Điều cần chú ý" câu đầu; "Lá số 3" tab Bản thân câu đầu. Chuyển: Bảo (danh sách sao đưa vào câu).

**TH-06. Bỏ sót yếu tố nằm ngay tại cung chủ đề.**
- Bài 3, Tình cảm: Thái Dương **hóa Lộc tại chính Phu Thê** (Tuất) không có câu Tứ hóa riêng, chỉ có câu Hóa Kỵ ở cung xung chiếu. Thân cư Phu Thê không được nêu. Địa Kiếp ở Quan Lộc (cung xung chiếu) bị bỏ, trong khi Địa Không lại có câu.
- Bài 1: Thân cư Tài Bạch không được nêu ở tab Tài chính. Điền Trạch Mùi vô chính diệu có Triệt nhưng tab Gia đạo không nói đây là cung vô chính diệu, cũng không có câu "vô chính diệu gặp Triệt".
- Bài 2: Thân cư Mệnh không được nêu ở tab Bản thân.
- Tái hiện: mở các tab trên, tìm "hóa Lộc", "Thân cư", "vô chính diệu". Chuyển: Bảo (luật Thân cư, luật hóa tại cung chính), Hạnh.

**TH-07. Câu lạc chuyên đề.**
- "nên bàn với người cùng làm trước khi chốt quyết định lớn" xuất hiện ở bài 2 Tình cảm (dòng 111) và bài 1 Gia đạo (dòng 222).
- "nên giữ một khoản dự phòng trước khi mở hướng mới" ở bài 3 Tình cảm (dòng 96).
- Lộc Tồn "thận trọng với tài chính" ở bài 1 Gia đạo (dòng 233).
- Hỏa Tinh "nên tiết chế cảm xúc" ở bài 1 Gia đạo (dòng 227), bài 3 Gia đạo (dòng 230), bài 2 Tài chính (dòng 196).
- Hóa Kỵ Thái Âm "nặng chuyện tiền bạc và cảm xúc; nên chăm đời sống tinh thần" ở bài 3 Sự nghiệp (dòng 151).
- Chuyển: Hạnh (câu cho phụ tinh và câu "tam phương có cả hai hóa" cần viết theo từng chuyên đề).

**TH-08. Nội dung không theo tuổi người đọc.** Bài 3 là nam 66 tuổi.
- Sự nghiệp dòng 118: "nên chủ động nhận việc để năng lực được thấy". Dòng 140: "giữ quỹ dự phòng cho giai đoạn chuyển việc".
- Vận 66–75, dòng 250: "thuận nghề dùng lời nói và đàm phán".
- Không có câu nào nói tới nghỉ hưu, sức khỏe hay vai trò trong gia đình ở tuổi này.
- Chuyển: Bảo (truyền tuổi vào bộ ghép), Hạnh (bản câu cho người từ khoảng 60 tuổi).

**TH-09. Không tab nào có đoạn tổng hợp ("Tóm lại").** Cả 18 tab có nội dung của 3 bài đều vậy. Các ý trái chiều (Không Kiếp, Hỏa Linh đắc hay hãm, Hóa Lộc cùng Hóa Kỵ) được để cạnh nhau mà không có câu kết. Chuyển: Bảo (`tong-hop.ts` chưa xuất ra bài), Hạnh.

**TH-10. Câu khuôn và câu lặp.**
- Đuôi "(cung … của X) ảnh hưởng đến …:" xuất hiện 14, 18 và 16 lần ở bài 1, 2, 3. "mỗi người cảm nhận khác nhau tùy hoàn cảnh và nỗ lực" xuất hiện 5, 5 và 6 lần. "thuận lợi và điểm vướng cùng có" xuất hiện 1, 3 và 5 lần.
- Câu Tuần/Triệt dài khoảng 60 từ lặp gần nguyên văn ở mọi tab.
- Tuần và Triệt dùng cùng một câu: "…các đặc điểm của cung thường biểu hiện chậm hoặc kín đáo hơn" cho Tuần (bài 1 dòng 146) và cho Triệt (bài 2 dòng 116).
- "Trong tình cảm, bạn trân trọng sự bền vững; hãy nói rõ kỳ vọng để hai người cùng đi đường dài" lặp ở cả 3 bài, dù cách cục khác nhau.
- Câu vô chính diệu "nên mượn chính tinh của cung đối diện để xem" không nêu tên sao được mượn: bài 2 dòng 147, 185; bài 3 dòng 88, 184, 211.
- Chuyển: Hạnh, và Bảo thêm các khuôn này vào mảng `KHUON` của script đếm.

### NHỎ
**TH-11.** Bài 1. Tab Sự nghiệp (dòng 116) ghi "Sát Phá Tham (thành cách nhưng có khuyết)", còn tab Bản thân (dòng 11) và Tài chính (dòng 172) không ghi "có khuyết", dù cả ba sao đều hãm. Cùng một cách mà mỗi tab nhận định một kiểu.
**TH-12.** Bài 1, Gia đạo, dòng 211. Cách Nhật Nguyệt chỉ nêu Địa Không là yếu tố phá cách, bỏ Thái Âm hóa Kỵ. Bài 3 gặp trường hợp tương tự thì lại nêu hóa Kỵ, tức hai bài xử lý không giống nhau.
**TH-13.** Bài 3, Sự nghiệp. Tuần tại Quan Lộc được nói 2 lần (dòng 151 và 162), câu sau là câu khuôn thừa.

## An toàn (cả 3 bài: 10)
- Mỗi tab có dòng "Luận giải do hệ thống xemtuvi.vn tạo tự động…" (6/6 tab mỗi bài).
- Quét từ cấm (giải hạn, cúng, bùa, yểm, tai họa, tai nạn, ly hôn, xui) không có kết quả nào. Không có lời đoán chắc gây sợ.
- Lá số trong bài là lá số thử, không có dữ liệu khách thật.

## Đề xuất thứ tự sửa
- P0: LOI-07 (sinh đủ mục khung cho Tài chính và Gia đạo) và TH-01 (điều kiện giáp). Sau đó chạy lại 3 lá số này và gửi Thư chấm lại.
- P1: TH-02, TH-03, TH-05, TH-06 (Đúng). TH-09 (tổng hợp).
- P2: TH-07, TH-08, TH-10 (Giọng), LOI-08, các lỗi NHỎ.
- Mốc nghiệm thu: chấm lại 3 bài phải đạt TB ≥ 7,5, Đúng ≥ 6, Sâu ≥ 6, An toàn 10. Không còn câu Không Kiếp giáp sai, không còn câu dung hòa Triệt khác cung.
