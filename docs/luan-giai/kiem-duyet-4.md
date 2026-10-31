# Phiếu kiểm duyệt luận giải tự động, đợt 4 (việc L-c32d3a)

- Người chấm: Thư (kiểm duyệt), theo skill `kiem-duyet-noi-dung` và `tuvi-luan-giai`. Ngày 31/10/2026.
- Đối tượng: 10 bản trong `docs/luan-giai/mau-4/`, sinh bằng `node scripts/luan-giai/sinh-mau.cjs mau-4 10` (stub, `boQuaCache: true`, biên dịch thẳng từ `src/`, cùng 10 lá số với mau-1…mau-3), đúng nội dung khách nhận theo cấu hình mặc định hiện tại.
- Thang chấm và mốc trừ: giữ nguyên đợt 3. Ngưỡng đạt: TB ≥ 7,5; không tiêu chí nào < 6; Sâu ≥ 6; An toàn = 10.
- Số đo máy: `node scripts/luan-giai/dem-sao-bo-sot.cjs docs/luan-giai/mau-4` và `… mau-3`.

## Kết luận

**Không đạt để thu tiền.** TB chung **7,03/10** (Đúng 6,7 · Sâu 5,7 · Giọng 5,7 · An toàn 10), **không đổi so với đợt 3**. Ba điều kiện chưa đạt: TB < 7,5; Sâu 5,7 < 6; Giọng 5,7 < 6.

Lý do không đổi: **mau-4 giống hệt mau-3 từng byte** (`diff -r docs/luan-giai/mau-3 docs/luan-giai/mau-4` ra 0 dòng; md5 ban-01 trùng). Các commit sau 06:18 (a1ab8eb, 0209b53, 485c9b1, a18f8f4, 32834ef…) chỉ chạm `van-nam.ts`, `quy-tac-van/nen-cung-thang.json`, `kiem-chung.ts` (chuyên đề Vận năm và Kiểm chứng quá khứ), không chạm đường luận giải mặc định Mệnh/Quan Lộc/Phu Thê: `quy-tac.json`, `quy-tac-khung.json`, `khop-v2.ts`, `tong-hop.ts` sửa lần cuối 30/10; `tongHop` vẫn mặc định tắt (`src/lib/luan-giai/ai/index.ts`, chú thích dòng `tongHop?: boolean`). Hai việc P0 của phiếu đợt 3 (bật Tóm lại, mở rộng dung hòa `DH-*`) **chưa vào code**.

Đã đọc lại cả 10 bản để xác nhận, không chép điểm máy móc: mọi lỗi đợt 3 còn nguyên, có thêm 1 lỗi thiếu cách chưa ghi ở đợt 3 (Tam Hóa hội Phu Thê bản 09, đợt 3 chỉ ghi chung "Tam Hóa"). Không có lỗi an sao (vị trí, độ sáng, Tứ hóa khớp lá số ở cả 10 bản).

## 1. Bảng điểm

| Bản | Chuyên đề | Đúng | Sâu | Giọng | An toàn | **TB** | Đợt 3 |
|---|---|---|---|---|---|---|---|
| 01 | Mệnh (Tham Lang Đ Hóa Kỵ, Tuần, Hỏa Tinh) | 6 | 6 | 6 | 10 | **7,00** | 7,00 |
| 02 | Quan Lộc (Thiên Đồng Đ), lá số 2023 | 7 | 5 | 5 | 10 | **6,75** | 6,75 |
| 03 | Phu Thê (Tham Lang H tại Tý, Đào Hoa) | 6 | 6 | 6 | 10 | **7,00** | 7,00 |
| 04 | Mệnh (Tử Vi B), lá số 2020 | 7 | 6 | 6 | 10 | **7,25** | 7,25 |
| 05 | Quan Lộc (Thiên Cơ Đ Hóa Lộc) | 7 | 5 | 6 | 10 | **7,00** | 7,00 |
| 06 | Phu Thê (Thiên Cơ V, Tuần), lá số 2023 | 7 | 5 | 4 | 10 | **6,50** | 6,50 |
| 07 | Mệnh (Tử Vi Đ + Phá Quân V Hóa Quyền) | 6 | 6 | 6 | 10 | **7,00** | 7,00 |
| 08 | Quan Lộc (vô chính diệu, Triệt) | 7 | 7 | 6 | 10 | **7,50** | 7,50 |
| 09 | Phu Thê (Thái Âm M Hóa Lộc, Tuần) | 7 | 6 | 6 | 10 | **7,25** | 7,25 |
| 10 | Mệnh (Thiên Tướng Đ, Triệt, Địa Kiếp) | 7 | 5 | 6 | 10 | **7,00** | 7,00 |
| **TB** | | **6,7** | **5,7** | **5,7** | **10** | **7,03** | 7,03 |

Bản dưới 8: **cả 10 bản**. Bản dưới 7: 02 (6,75), 06 (6,50). Không bản nào dưới 6.

## 2. Lý do từng bản (trích câu + mã quy tắc)

**Bản 01 (7,00).**
- Đúng 6 — câu trái lá số: "Tham Lang đồng cung Hỏa Tinh nhưng **Tham Lang chưa đủ sáng**, nên chưa đủ điều kiện gọi trọn cách Hỏa Tham" (`KHUNG-menh-CC-HoaThamLinhTham-Hoa-PHA`), lá số ghi Tham Lang (Đắc). Lý do phá cách đúng là Tham Lang hóa Kỵ và Mệnh bị Tuần.
- Sâu 6: không có đoạn Tóm lại (lớp `tongHop` tắt). Điểm tốt giữ nguyên: dung hòa Tuần–Kỵ (`KHUNG-menh-KY-ThamLang-Tuần`), Sát Phá Tham có lý do phá cách (`KHUNG-menh-CC-SatPhaTham-PHA3-ky`).
- Giọng 6: "Địa Kiếp ở Tài Bạch (cung tam hợp của Mệnh) **ảnh hưởng đến tính cách và hướng đi của bạn**:" (`KHUNG-menh-SP-ĐịaKiếp-tam-hop`) — câu khuôn.

**Bản 02 (6,75).**
- Giọng 5 (mốc trẻ em): lá số 6/3/2023, Quan Lộc viết cho người lớn: "Nên chọn nghề dịch vụ, chăm sóc, giáo dục và đặt mục tiêu theo quý để giữ động lực" (`QL-S05-TOT`).
- Sâu 5: không có mục Cách cục; Không Kiếp tách hai câu rời: "Địa Kiếp đồng cung Quan Lộc: hay muốn đổi hướng…" (`QL-PS-13`) và "Địa Không ở Tài Bạch … hay nghĩ khác lạ…" (`KHUNG-quan-loc-SP-ĐịaKhông-tam-hop`), không gọi thế Không Kiếp.

**Bản 03 (7,00).**
- Đúng 6 — sao hãm mở bằng nét tích cực: "Hỏa Tinh đồng cung Phu Thê: nhiệt huyết, phản ứng nhanh, nên tiết chế cảm xúc" (`PT-PS-10`).
- Sâu 6: chưa gọi tên Phiếm thủy đào hoa (Tham Lang H tại Tý + Đào Hoa; thiếu mã `KHUNG-phu-the-CC-*`); Thiên Không tại Phu Thê bỏ sót (máy báo). Điểm tốt: `KHUNG-phu-the-CC-SatPhaTham-DeuHam`.

**Bản 04 (7,25).**
- Sâu 6: bỏ qua chính tinh xung chiếu **Tham Lang (Hãm) tại Thiên Di** (không có câu `ML-S09-C*` nào); Tuần ở Quan Lộc đóng trên Địa Kiếp, Triệt ở Thiên Di đóng trên Địa Không nhưng chỉ có câu Tuần/Triệt chung, không dung hòa với cách "Không Kiếp chiếu".
- Giọng 6: lá số 6 tuổi, Mệnh còn lời khuyên người lớn: "nên cân nhắc kỹ trước khi đứng ra bảo lãnh hoặc cho vay" (`ML-S11-C3`); mốc hiện chỉ trừ Quan Lộc/Phu Thê nên giữ 6.

**Bản 05 (7,00).**
- Sâu 5 (6 câu): bỏ qua Thiên Đồng (H) tại Mệnh và Cự Môn (H) tại Tài Bạch; Triệt đóng trên Thiên Lương (Hóa Quyền) ở Phu Thê chỉ có câu Triệt chung ("Triệt đóng ở Phu Thê (cung xung chiếu của Quan Lộc): Triệt chỉ tác động hai cung nó tách đôi…"), cách Cơ Lương không nói yếu đi vì Triệt, Hóa Quyền không dung hòa.
- Câu Hóa Lộc chung: "Hóa Lộc tại Quan Lộc mở ra cơ hội và nguồn lực, nên chủ động nắm bắt" (`QL-HOA-0`), không gắn Thiên Cơ.

**Bản 06 (6,50).**
- Giọng 4 (mốc trẻ em, cả bài là lời khuyên hôn nhân cho bé 3 tuổi): "Thiên Cơ tại Phu Thê: trong tình cảm, bạn có xu hướng thích trao đổi nhiều… Nên giữ thói quen trò chuyện mỗi tuần về kế hoạch chung" (`PT-S02-TOT`).
- Sâu 5: không có mục Cách cục; Địa Không, Địa Kiếp tại Quan Lộc bỏ sót (máy báo); Triệt cùng cung Hóa Quyền ở Thiên Di không dung hòa: "Cự Môn mang Hóa Quyền ở Thiên Di … thêm mong muốn giữ vai trò chủ động" (`KHUNG-phu-the-HOA-Quyền-tam-hop`).

**Bản 07 (7,00).**
- Đúng 6 — hai câu sao hãm tả như sáng: "Kình Dương ở Tài Bạch … nghị lực mạnh, quyết liệt" (`KHUNG-menh-SP-KìnhDương-tam-hop`, Kình H) và "Liêm Trinh mang Hóa Lộc ở Quan Lộc … mở thêm cơ hội và nguồn lực" (`KHUNG-menh-HOA-Lộc-tam-hop`, Liêm Trinh H).
- Sâu 6: "Vũ Khúc mang Hóa Khoa ở Tài Bạch … thêm sự thanh nhã, danh tiếng tốt" (`KHUNG-menh-HOA-Khoa-tam-hop`) không dung hòa với Tuần cùng cung.

**Bản 08 (7,50).**
- Đúng 7: "Thiên Đồng mang Hóa Khoa ở Phu Thê … thêm danh tiếng tốt, cơ hội học hỏi và quý nhân" (`KHUNG-quan-loc-HOA-Khoa-xung`) tả đầy đủ trên Thiên Đồng (H).
- Giọng 6: Địa Không và Thiên Không cùng cung là hai câu rời; câu Tuần/Triệt ~60 chữ. Chưa có Tóm lại. Điểm tốt: `KHUNG-quan-loc-VCD-chinh-Triet`, `DH-Tuần-Ky`.

**Bản 09 (7,25).**
- Sâu 6: **Hóa Lộc ngay trên Thái Âm tại Phu Thê không được nhắc** (máy báo), Tuần cùng cung không dung hòa với Lộc; Lộc (Phu Thê), Quyền (Phúc Đức), Khoa (Thiên Di) đủ trong tam phương nhưng **không gọi Tam Hóa hội** (thiếu mã `KHUNG-phu-the-CC-*`); Triệt cùng cung Hóa Quyền ở Phúc Đức: "Thiên Đồng mang Hóa Quyền ở Phúc Đức … thêm mong muốn giữ vai trò chủ động" (`KHUNG-phu-the-HOA-Quyền-tam-hop`) không dung hòa; Thiên Không (Quan Lộc), Lộc Tồn (Thiên Di) bỏ sót.

**Bản 10 (7,00).**
- Sâu 5: "Địa Kiếp đồng cung Mệnh: hay muốn đổi hướng…" (`ML-PS-13`) và "Triệt đóng tại Mệnh: các đặc điểm của cung thường biểu hiện chậm…" (`ML-TT-TRIỆT`) là hai câu rời, không dung hòa; Địa Kiếp (Mệnh) và Địa Không (Tài Bạch) không gộp thành Không Kiếp; chưa nói Triệt làm Thiên Tướng yếu đi.

## 3. So sánh với đợt 3

| Chỉ số | Đợt 3 (mau-3) | Đợt 4 (mau-4) |
|---|---|---|
| TB / Đúng / Sâu / Giọng / An toàn | 7,03 / 6,7 / 5,7 / 5,7 / 10 | **7,03 / 6,7 / 5,7 / 5,7 / 10** |
| Nội dung khác nhau | — | **0 dòng** (`diff -r`) |
| Số câu (10 bản) | 128 | 128 |
| Sao quan trọng bỏ sót | 6/66 (9%) | **6/66 (9%)**: Thiên Không 2/5, Không Kiếp 2/12, Lộc Tồn 1/3, Tứ hóa 1/20 |
| Câu khuôn "ảnh hưởng đến …:" | 25% (32/128) | 25% (32/128) |
| Đuôi "mỗi người cảm nhận khác nhau" | 7% (9/128) | 7% (9/128) |
| "Thái Thúc", "góp thêm sắc thái", "Độ sáng tốt…" | 0 | 0 |
| Bản có mục Cách cục | 8/10 | 8/10 (thiếu 02, 06) |
| Bản có Tóm lại | 0/10 | **0/10** |
| Bản có dung hòa Tuần/Triệt với hóa | 2/10 (01, 08) | 2/10 (01, 08) |
| Câu "do hệ thống tạo" | 10/10 | 10/10 |

## 4. Top lỗi

| # | Lỗi | Tần suất | Mã | Ảnh hưởng tới việc trả tiền |
|---|---|---|---|---|
| 1 | Không có Tóm lại, không gộp sao cùng cung (`tongHop` tắt mặc định) | 10/10 | `src/lib/luan-giai/ai/index.ts` (`tongHop`), `tong-hop.ts` | Rất cao: một mình giữ Sâu ≤ 6 ở cả 10 bản |
| 2 | Tuần/Triệt cùng cung với hóa hay sát tinh mà không dung hòa | 04, 05, 06, 07, 09, 10 | `KHUNG-menh-HOA-Khoa-tam-hop`, `KHUNG-phu-the-HOA-Quyền-tam-hop`, `ML-PS-13`+`ML-TT-TRIỆT`, chỉ có `DH-Tuần-Ky` | Cao: lời luận trái tác động Tuần/Triệt |
| 3 | Sao hãm tả như sáng / chính tinh hãm hợp chiếu bị bỏ qua | 03, 04, 05, 06, 07, 08 | `PT-PS-10`, `KHUNG-menh-SP-KìnhDương-tam-hop`, `KHUNG-menh-HOA-Lộc-tam-hop`, `KHUNG-quan-loc-HOA-Khoa-xung`, thiếu nhánh `ML-S*-C*`/`QL-S*-C*` cho sao (H) | Cao: Đúng ≤ 6, bài chỉ khen |
| 4 | Lá số trẻ em viết như người lớn | 02, 04, 06 | `QL-S05-TOT`, `PT-S02-TOT`, `ML-S11-C3` | Cao: phụ huynh xem lá số con |
| 5 | Thiếu cách / sao bỏ sót: Phiếm thủy đào hoa (03), Tam Hóa hội (09), Không Kiếp rời (02, 06, 10), Hóa Lộc Phu Thê (09) | 5 bản | `KHUNG-*-CC-*` chưa có; `QL-PS-13`, `ML-PS-13` | Trung bình |
| 6 | Câu "chưa đủ sáng" khi sao Đắc | 01 | `KHUNG-menh-CC-HoaThamLinhTham-Hoa-PHA` | Trung bình: sai so với lá số khách xem |
| 7 | Câu khuôn dài: "ảnh hưởng đến …:" 25%, "mỗi người cảm nhận khác nhau" 7%, Tuần/Triệt ~60 chữ | 10/10 | `KHUNG-*-SP-*`, `KHUNG-*-HOA-*`, `KHUNG-*-TUAN-*`/`TRIET-*` | Trung bình (Giọng) |

## 5. Trả Hạnh (mọi bản TB < 8: 01–10)

Thư không sửa nội dung; trả về người viết kèm mã. Cột "Người" theo skill: Hạnh = câu và quy tắc, Bảo = bộ ghép/điều kiện, Đức = an sao.

| Ưu tiên | Lỗi cần sửa | Bản | Mã | Người | Nghiệm thu |
|---|---|---|---|---|---|
| P0 | Bật `tongHop` mặc định cho bài trả phí (sau khi Hạnh rà câu Tóm lại có mã quy tắc thật) | 10/10 | `index.ts` `tongHop`, `tong-hop.ts` | **Bảo** (cấu hình), **Hạnh** (câu Tóm lại) | mau-5: 10/10 có "Tóm lại" 2–3 câu |
| P0 | Viết câu dung hòa Tuần/Triệt × Lộc/Quyền/Khoa và × Không/Kiếp (cùng cung) | 04, 05, 06, 07, 09, 10 | mở rộng `KHUNG-*-DH-*` ngoài `DH-Tuần-Ky` | **Hạnh** (câu), **Bảo** (điều kiện "cùng cung", không áp sai cung) | 6 bản có câu dung hòa đúng cung |
| P1 | Đổi câu khen sao hãm sang mặt cần chú ý | 03, 07, 08 | `PT-PS-10`, `KHUNG-menh-SP-KìnhDương-tam-hop`, `KHUNG-menh-HOA-Lộc-tam-hop`, `KHUNG-quan-loc-HOA-Khoa-xung` | **Hạnh** (câu nhánh H), **Bảo** (chọn nhánh theo độ sáng sao mang hóa) | 0 câu sao (H) mở bằng nét tích cực; Đúng ≥ 7 |
| P1 | Thêm nhánh C-HAM cho chính tinh hãm hợp chiếu (Tham Lang, Thiên Đồng, Cự Môn, Liêm Trinh) | 04, 05, 06, 07 | `ML-S*-C*`, `QL-S*-C*`, `PT-S*-C*` (xem `docs/luan-giai/cho-hanh-C-HAM.md`) | **Hạnh** | Mỗi chính tinh (H) trong tứ chính có 1 câu |
| P1 | Sửa điều kiện "chưa đủ sáng" khi Tham Lang Đắc | 01 | `KHUNG-menh-CC-HoaThamLinhTham-Hoa-PHA` | **Bảo** (điều kiện), **Hạnh** (câu lý do Kỵ/Tuần) | Bản 01 hết câu trái lá số |
| P1 | Thêm cách Phiếm thủy đào hoa, Tam Hóa hội; gộp Không Kiếp khi ở hai cung khác nhau | 02, 03, 06, 09, 10 | `KHUNG-phu-the-CC-*` (mới), `QL-PS-13`, `ML-PS-13` | **Hạnh** (quy tắc + nguồn), **Bảo** (nhận cặp ở hai cung) | Script bỏ sót ≤ 3%; 03, 09 có mục cách tương ứng |
| P1 | Nhắc Hóa Lộc trên chính tinh tại cung chính, Thiên Không, Lộc Tồn | 03, 06, 09 | Tứ hóa tại cung chính (09), `*-SP-ThienKhong-*`, `*-SP-LocTon-*` | **Bảo** (bộ ghép đang bỏ), **Hạnh** (câu nếu thiếu) | Script: 0 bỏ sót Tứ hóa, Thiên Không ≤ 1/5 |
| P2 | Giọng lá số dưới 15 tuổi (mở rộng sang Mệnh; Minh quyết ẩn Phu Thê/Quan Lộc hay viết lời cho phụ huynh) | 02, 04, 06 | `QL-S05-TOT`, `PT-S02-TOT`, `ML-S11-C3` | **Hạnh** (giọng), **Bảo** (điều kiện tuổi), Minh quyết | Giọng ≥ 6 ở 02, 04, 06 |
| P2 | Rút câu Tuần/Triệt ≤ 35 chữ, bỏ đệm "ảnh hưởng đến …:", "mỗi người cảm nhận khác nhau" | 10/10 | `KHUNG-*-SP-*`, `KHUNG-*-HOA-*`, `*-TT-*` | **Hạnh** | Script: hai cột khuôn ≤ 10% |

Đức: không có lỗi an sao trong đợt này (vị trí, độ sáng, Tứ hóa khớp mục "Sao các cung liên quan" ở cả 10 bản).

Bước tiếp theo: chỉ sinh `mau-5` khi ít nhất hai việc P0 đã vào code; sinh lại khi engine luận giải mặc định không đổi sẽ ra cùng kết quả (như đợt này). Chưa mở bán luận giải trả phí.
