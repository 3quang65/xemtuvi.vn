# Phiếu kiểm duyệt: 42 câu chính tinh Tài Bạch và 10 bản mẫu (diễn tập #1)

Việc L-b2e4a1 (Minh). Người chấm: Thư (kiem-duyet), 30/10/2026. Người viết: Hạnh (câu), Bảo (bộ ghép), Đức (nguồn, đang kiểm song song).
Phạm vi: commit `6cc423f`: `src/lib/luan-giai/ai/quy-tac.json` id `TB-S01-TOT`…`TB-S14-HAM` (42 câu, lấy đúng bản trong commit, không tính phần người khác đang sửa dở); `docs/luan-giai/mau-tb/ban-01..10.md`.
Danh sách kiểm: `docs/luan-giai/kiem-duyet-ra-soat-phan-hoi.md` (#1 gợi ý riêng, không lặp ý; #8 không khẳng định cứng; câu khuôn). Chấm theo skill `kiem-duyet-noi-dung`. Ngưỡng việc này: mỗi tiêu chí ≥ 8, Giọng ≥ 8 bắt buộc. Đúng chỉ chấm ở mức đọc thấy; nguồn do Đức kiểm.

## 1. Kết luận

| Tiêu chí | 42 câu TB-S (riêng câu) | 10 bản mẫu (bài khách nhận) | Ngưỡng | Kết quả |
|---|---|---|---|---|
| Đúng | 8 | **6** | ≥ 8 | Trượt (ở bài) |
| Sâu | 7 | **6** | ≥ 8 | Trượt |
| Giọng | **7** | **5** | ≥ 8 (bắt buộc) | Trượt |
| An toàn | 10 | 10 | ≥ 8 | Đạt |

**Chung: CHƯA ĐẠT.** Lỗi phải sửa: **P0 2, P1 7**; nên sửa P2 5.

Phần làm tốt (đúng mục tiêu #1): 42/42 câu có đúng 1 gợi ý hành động; 42 gợi ý khác nhau từng chữ, cụ thể, làm được ngay (hạn mức, quỹ thử nghiệm, chờ ba ngày, biên nhận…). Không còn đuôi khuôn: script đếm 0 câu "góp thêm sắc thái", "Độ sáng tốt…", 0 câu trùng, 0 đuôi trùng. Câu `-HAM` nêu mặt cần chú ý ngay câu đầu, không tả sao hãm như sao sáng. Không từ cấm, 10/10 bản có dòng "do hệ thống xemtuvi.vn tạo tự động".

## 2. Bằng chứng đã chạy

- Trích 42 câu từ `git show 6cc423f:src/lib/luan-giai/ai/quy-tac.json`; so với cây làm việc: 42 câu TB-S trùng khớp (phần khác của file đang bị người khác sửa, không chấm).
- Đối chiếu câu TB-S trong 10 bản với JSON: 13 lượt, **3 lượt lệch chữ** (bản mẫu sinh từ bản nháp cũ): `ban-04`, `ban-07` `TB-S04-TOT` ("nên đây" ≠ "vì vậy đây"); `ban-08` `TB-S08-TOT` ("sự chắc chắn" ≠ "sự an toàn").
- Bản mẫu chỉ phủ 13/42 id (HAM 2, BINH 1). 29 câu còn lại chấm bằng đọc trực tiếp.
- `node scripts/luan-giai/dem-sao-bo-sot.cjs docs/luan-giai/mau-tb`: 81 câu, bỏ sót **6/55 sao quan trọng (11%)**; câu khuôn "ảnh hưởng đến …:" **32/81 (40%)**; "mỗi người cảm nhận khác nhau" 9/81; 2/10 bản không có mục Cách cục.
- Đếm trong phần "Bài luận giải": "dự phòng" ban-01 3, ban-03 2, ban-06 2, **ban-08 5**; "Tóm lại" 0/10 bản; năm sinh: ban-02 2023, ban-04 2020, ban-06 2023 (trẻ 3–6 tuổi).
- Quét từ cấm (giải hạn, hóa giải, bùa, cúng, cầu an, tai họa, tai ương, phá sản, nhất định, xui, vận đen, khắc chồng): **0**. "chắc chắn" 1 lần (ban-08, nghĩa trung tính, và đã khác JSON).

## 3. Lỗi phải sửa

| # | Mức | Tiêu chí | id / vị trí | Vấn đề | Sửa đề nghị |
|---|---|---|---|---|---|
| 1 | **P0** | Giọng | `TB-S*` (42 câu) + bộ ghép; ban-02, ban-04, ban-06 | Lá số trẻ 3–6 tuổi nhận lời khuyên người lớn: "chọn một nguồn thu phụ dựa trên chuyên môn" (ban-02), "lưu lời giới thiệu từ đối tác" (ban-04), "kế hoạch cho học hành của con, chăm sóc cha mẹ" (ban-06). Skill mục 1: chuyên đề viết như người lớn cho lá số trẻ em thì Giọng tối đa 5. `quy-tac.json` không có điều kiện tuổi nào. | Hạnh: thêm biến thể trẻ em cho 14 sao (giọng "bé thường…", gợi ý cho cha mẹ: tập tiết kiệm, cho tiêu vặt có kế hoạch). Bảo: điều kiện tuổi < 15 chọn biến thể này (như `tuoiVanTuMin` đang có ở Vận). Nghiệm thu: sinh lại ban-02/04/06, 0 câu nói nguồn thu, đối tác, con cái, cha mẹ. |
| 2 | **P0** | Đúng | ban-01, `KHUNG-tai-bach-CC-HoaThamLinhTham-Hoa-PHA` | "Tham Lang chưa đủ sáng" trong khi lá số ghi Tham Lang (Đắc). Đây là lỗi đã có trong bảng "không đạt" của skill từ đợt 2, lặp lại. | Bảo/Hạnh: câu phá cách nêu đúng lý do có trong lá số (Tham Lang hóa Kỵ, Mệnh bị Tuần); không viết "chưa đủ sáng" khi sao ở M/V/Đ. Nghiệm thu: grep "chưa đủ sáng" trên 10 bản sinh lại chỉ khớp khi sao ở B/H. |
| 3 | P1 | Giọng | Mở câu của 42/42 câu | Đầu khuôn "X tại Tài Bạch: về tiền bạc, bạn có xu hướng…". Bài có hai chính tinh đồng cung (ban-03, 04, 06, 07) thì hai câu liền nhau mở y hệt, đọc ra là máy ghép. Đuôi đã hết khuôn nhưng đầu thành khuôn mới. | Bỏ "về tiền bạc," (tiêu đề mục đã là "Cách kiếm và giữ tiền"); đổi cách mở theo sao, ví dụ "Thiên Phủ ở Tài Bạch là sao chủ kho: bạn giỏi giữ của…", "Với Cự Môn ở Tài Bạch, tiền thường đến từ lời nói…". Nghiệm thu: không cụm mở đầu nào (6 chữ sau tên cung) lặp quá 5/42. |
| 4 | P1 | Giọng | `TB-S04-HAM`, `TB-S05-HAM`, `TB-S06-BINH`, `TB-S06-HAM`, `TB-S09-BINH`, `TB-S10-HAM`, `TB-S11-TOT`, `TB-S11-HAM`, `TB-S13-TOT`, `TB-S13-HAM` | "bạn có xu hướng" ghép với cụm danh từ, không xuôi: "có xu hướng tiền vào nhanh", "có xu hướng thu chi không đều", "có xu hướng có nguyên tắc riêng", "có xu hướng đủ đầy", "có xu hướng thu nhập ở mức bình thường", "có xu hướng trước ít sau nhiều", "có xu hướng tài chính hay eo hẹp". Vòng 3 phiếu rà soát đã ghi đúng dạng lỗi này. | "tiền của bạn thường vào nhanh nhưng ra cũng nhanh", "thu chi của bạn thường không đều", "bạn có nguyên tắc riêng với tiền", "tài chính thường đủ đầy"… Nghiệm thu: 10 câu trên không còn "có xu hướng" + danh từ. |
| 5 | P1 | Giọng (#1 không lặp ý) | Cặp đồng cung: `TB-S05-HAM`+`TB-S10-HAM` (Đồng Cự); `TB-S05-HAM`+`TB-S08-HAM` (Đồng Âm); `TB-S04-HAM`+`TB-S14-HAM` (Vũ Phá) | Khi hai sao cùng hãm đồng cung (Đức xác nhận độ sáng), hai câu liền nhau lặp ý: "thu chi không đều" / "thu chi thất thường"; "sự ổn định thường đến muộn" / "sự sung túc thường đến muộn" và hai gợi ý cùng là ghi chép, cắt chi; hai câu "sách cho rằng hợp nghề…" đưa hai nghề khác nhau (sản xuất, buôn bán / thủ công, mỹ thuật) trong cùng bài. | Đổi mô tả để mỗi sao giữ nét riêng (Cự Môn: thị phi lời nói; Thái Âm: cảm xúc chi phối; Phá Quân: phá đi làm lại). Gợi ý nghề chỉ giữ ở một sao hoặc gộp. Nghiệm thu: sinh 3 lá số có các cặp trên, không câu nào lặp cụm ≥ 4 chữ với câu liền kề. |
| 6 | P1 | Sâu, Đúng | ban-07 (`TB-S04-TOT` + `TB-S13-HAM`, Tuần tại Tài Bạch) | Vũ Khúc "giữ kỷ luật tài chính tốt, vị trí thuận" đứng cạnh Thất Sát hãm "tài chính hay eo hẹp", không câu dung hòa; Tuần đóng ngay Tài Bạch và Hóa Khoa của Vũ Khúc tại Tài Bạch không được nhắc (script). | Bảo: khi hai chính tinh đồng cung lệch độ sáng, thêm câu nối (ví dụ "Vũ Khúc giữ kỷ luật, Thất Sát kém sáng làm thu nhập có đợt hụt: kỷ luật của bạn là chỗ dựa trong những đợt đó"). Thêm câu Tuần tọa thủ Tài Bạch và Tứ hóa tại chính cung. Nghiệm thu: ban-07 sinh lại có Tuần@Tài Bạch, Hóa Khoa@Tài Bạch và 1 câu dung hòa. |
| 7 | P1 | Đúng, Sâu | ban-10 (`TB-S07-BINH`, Địa Không hãm, Hóa Khoa Hữu Bật tại Tài Bạch) | Thiên Phủ được tả "biết vun vén, giữ của, vững dần" trong khi Địa Không hãm tọa thủ cùng cung (Phủ gặp Không, kho dễ trống) không được nhắc ở đâu; Hóa Khoa tại Tài Bạch cũng bị bỏ. Bài không có mục Cách cục. | Đức xác nhận điều kiện; Hạnh viết câu Thiên Phủ gặp Địa Không/Địa Kiếp tại Tài Bạch; Bảo gắn. Nghiệm thu: script bỏ sót ban-10 = 0. |
| 8 | P1 | Sâu, Đúng | ban-04 | Vũ Khúc hóa Quyền và Lộc Tồn ở ngay Tài Bạch (điểm nổi bật nhất của cung) không có câu nào. | Bảo: Tứ hóa và Lộc Tồn tọa thủ Tài Bạch phải luôn có câu. Nghiệm thu: script bỏ sót toàn đợt = 0%. |
| 9 | P1 | Giọng (#1, lẫn giọng) | Câu khung trong bài: `KHUNG-tai-bach-SP-*`, `-HOA-*-tam-hop`, `-TUAN/TRIET-*`, các câu Cách cục | Bài lẫn hai giọng: câu chính tinh là câu đủ, có "bạn" và gợi ý đo được; câu khung là khuôn "ở Mệnh (cung tam hợp của Tài Bạch) ảnh hưởng đến cách kiếm tiền và giữ tiền: nhiệt huyết, phản ứng nhanh, nên tiết chế cảm xúc" (32/81 câu, 40%), vài câu lạc chuyên đề (Linh Tinh "nên giữ nhịp nghỉ ngơi"). Lặp ý "dự phòng" giữa Cách cục, Tứ hóa và chính tinh: ban-08 **5 lần** (Nhật Nguyệt, Không Kiếp, Hóa Lộc, Hóa Kỵ, Lộc-Kỵ), ban-01 3 (Sát Phá Tham, Hóa Kỵ, Lộc-Kỵ), ban-03 2 (Tử Phủ Vũ Tướng "quỹ dự phòng" + `TB-S07-TOT` "ngăn dự phòng"), ban-06 2; "ghi chép thu chi" ban-08 2. | Hạnh: viết lại câu khung theo giọng câu chính tinh (bỏ "ảnh hưởng đến cách kiếm tiền và giữ tiền:", mỗi sao một gợi ý về tiền). Bảo: `boCauLap` cho Tài Bạch, mỗi bài "dự phòng" tối đa 1 lần, "ghi chép thu chi" tối đa 1. Nghiệm thu: script "ảnh hưởng đến …:" = 0%; đếm "dự phòng" ≤ 1/bài trên 10 bản. |

## 4. Lỗi nên sửa (P2)

| # | Vị trí | Vấn đề | Đề xuất |
|---|---|---|---|
| 10 | ban-04, ban-07, ban-08 | Bản mẫu lệch chữ với JSON (3 lượt, mục 2): bản mẫu không sinh từ commit. | Sinh lại 10 bản từ JSON cuối trước khi nộp vòng sau. |
| 11 | ban-09 (Tài Bạch vô chính diệu) | Chỉ có câu phương pháp "nên mượn chính tinh của cung đối diện để xem (Thiên Đồng, Thiên Lương…)" rồi dừng: khách không nhận câu luận nào về Đồng Lương cho tiền bạc, không gợi ý hành động; câu đang nói với người luận chứ không với khách. | Bảo: khi vô chính diệu, dùng câu TB-S của sao mượn kèm câu "lực nhẹ hơn". |
| 12 | 10/10 bản | Không có đoạn "Tóm lại" (skill mục 1: Sâu tối đa 6 khi thiếu tổng hợp). ban-09, ban-10 không có mục Cách cục. | Thêm 1–2 câu tổng hợp cuối bài Tài Bạch. |
| 13 | `TB-S01-HAM`, `TB-S07-HAM` | Tử Vi và Thiên Phủ theo bảng phái Việt không có độ sáng Hãm: câu không bao giờ dùng. Không sai, nhưng chiếm chỗ. | Đức xác nhận; giữ hay bỏ đều được, ghi chú lý do. |
| 14 | `TB-S06-TOT` và `TB-S10-TOT`; `TB-S01-BINH` và `TB-S07-BINH` | Trùng nguyên cụm mô tả: "kiếm tiền tốt trong môi trường cạnh tranh, sôi động"; "mức sung túc thường ở mức khá và vững dần". Tử Phủ đồng cung có thể ra cả hai câu sau. | Viết lại để mỗi sao có nét riêng. |

## 5. Nhận xét Đúng (mức đọc thấy, chuyển Đức)

- 42 câu khớp nhóm độ sáng (TOT = M/V/Đ, BINH = B, HAM = H); không câu `-HAM` nào tả như sao sáng; mã `TAI-*` gắn hợp lý với nội dung đọc thấy.
- `TB-S11-HAM` "nghề kỹ thuật, công nghệ": sách ghi "kỹ nghệ"; "công nghệ" là cách nói nay, nên ghi "sách cho rằng hợp nghề kỹ thuật" cho sát nguồn.
- Lỗi Đúng ở bài (#2, #6, #7, #8) nằm ở câu khung và bộ ghép, không ở 42 câu.

## 6. Chấm lại

Sau khi sửa #1–#9 và sinh lại 10 bản từ JSON cuối: Thư chạy lại script bỏ sót, đếm "dự phòng"/bài, đọc lại ban-01, 02, 04, 06, 07, 09, 10 và 3 lá số có cặp sao ở #5.

## 7. Chấm lại vòng 2 (commit `a286924`, 30/10/2026)

Phạm vi: chỉ 42 câu `TB-S01-TOT`…`TB-S14-HAM` (lấy từ `git show a286924:src/lib/luan-giai/ai/quy-tac.json`, cây làm việc trùng khớp phần TB-S) và lỗi #3 #4 #5 #6 #7 #10 #14. Các mục #1, #2, #8, #9, #11, #12 thuộc code/câu khung, Minh đã chuyển Kỹ thuật (Tùng): không tính vào kết luận vòng này.

### Kết luận vòng 2

| Tiêu chí | Vòng 1 (42 câu) | Vòng 2 (42 câu) | Ngưỡng | Kết quả |
|---|---|---|---|---|
| Đúng | 8 | 8 | ≥ 8 | Đạt |
| Sâu | 7 | 8 | ≥ 8 | Đạt |
| Giọng | 7 | **8** | ≥ 8 (bắt buộc) | Đạt |
| An toàn | 10 | 10 | ≥ 8 | Đạt |

**42 câu TB-S: ĐẠT** (mỗi tiêu chí ≥ 8, Giọng 8). Còn 1 lỗi P1 ở câu (L2-1, liên quan #7) phải sửa trước khi bài Tài Bạch đến khách, nhưng không kéo tiêu chí nào dưới 8 khi chấm riêng 42 câu. Bài khách nhận (10 bản) chưa chấm lại vì phụ thuộc các mục đã chuyển Kỹ thuật.

### Bằng chứng đã chạy

- Mở câu: 0/42 còn "về tiền bạc, bạn"; từ đầu câu có 17 dạng khác nhau (nhiều nhất "Thiên…" 10, là tên sao); cụm 6 chữ sau "Tài Bạch" không lặp lần nào (tối đa 1/42, ngưỡng ≤ 5).
- "có xu hướng": 8/42, cả 8 đều ghép động từ ("có xu hướng muốn tự quyết", "hay đổi kế hoạch", "đến chậm"…); 0 câu ghép danh từ.
- Cặp đồng cung: chạy engine trên 2.160 lá số (1950–2009, nữ), ra 29 tổ hợp hai chính tinh × độ sáng thực có. So từng cặp câu: 0 cặp lặp cụm ≥ 4 chữ ngoài phần tên cung ("kém sáng tại Tài Bạch", cặp Nhật Lương hãm).
- 42/42 câu đúng 1 gợi ý "Nên…", 42 gợi ý khác nhau; 0 "dự phòng"; từ cấm (giải hạn, hóa giải, bùa, cúng, cầu an, tai họa, tai ương, phá sản, nhất định, xui, vận đen, chắc chắn): 0.
- Bản mẫu `mau-tb` đối chiếu JSON `a286924`: 13/13 lượt TB-S khớp chữ (12 id).
- Script bỏ sót `mau-tb`: 5/55 (9%, vòng 1 11%); còn sót Hóa Quyền, Lộc Tồn @Tài Bạch (ban-04), Tuần, Hóa Khoa @Tài Bạch (ban-07), Hóa Khoa @Tài Bạch (ban-10): thuộc #8, chuyển Kỹ thuật. Lưu ý: ban-10 hết sót Địa Không chỉ vì câu `TB-S07-BINH` nhắc tên sao trong mệnh đề "khi không gặp…", không phải đã luận (xem L2-1).

### Từng lỗi trong phạm vi

| # | Kết quả | Ghi chú |
|---|---|---|
| 3 | **Đã sửa** | Bỏ đầu khuôn; mở theo sao ("Thiên Phủ là sao chủ kho…", "Cự Môn sáng ở Tài Bạch biến lời nói thành công cụ kiếm tiền…"). |
| 4 | **Đã sửa** | 10/10 câu đã viết lại ("tiền của bạn thường vào nhanh nhưng ra cũng nhanh", "thu chi của bạn thường lên xuống thất thường"…). |
| 5 | **Đã sửa** | Đồng Cự: không đều/eo hẹp ↔ thị phi tiền chung; Đồng Âm: nhịp làm việc ↔ cảm xúc chi phối; Vũ Phá: chỉ `TB-S04-HAM` còn gợi ý nghề. Gợi ý của các cặp khác nhau. |
| 6 | **Đã sửa (phần câu)** | `TB-S04-TOT` ("dù có khi phải bền bỉ một thời gian") và `TB-S13-HAM` ("tính quyết nhanh, dám làm là thế mạnh khi đi kèm cân nhắc") đứng cạnh nhau không còn đối nghịch. Phần câu nối riêng, Tuần@Tài Bạch, Hóa Khoa@Tài Bạch ở ban-07: bộ ghép, chuyển Kỹ thuật (cùng #8). |
| 7 | **Chưa** | Xem L2-1: Hạnh chưa viết câu Thiên Phủ gặp Không/Kiếp; thay bằng mệnh đề điều kiện trong `TB-S07-BINH`. Phần gắn câu (Bảo) chuyển Kỹ thuật. |
| 10 | **Đã sửa** | 10 bản sinh lại từ `a286924`, 13/13 lượt khớp JSON. |
| 14 | **Đã sửa** | S06-TOT/S10-TOT và S01-BINH/S07-BINH không còn cụm chung. |

Ngoài phạm vi, chuyển Kỹ thuật (không tính): #1, #2, #8, #9, #11, #12. #13 (P2, Đức): `TB-S01-HAM`, `TB-S07-HAM` vẫn viết theo điều kiện "đồng cung sát tinh" trong khi `dieuKien` là `doSang: Hãm` (hai sao không bao giờ Hãm), nên câu không bao giờ được dùng.

### Lỗi mới

| id | Mức | Vấn đề | Sửa đề nghị |
|---|---|---|---|
| L2-1 `TB-S07-BINH` | P1 (Đúng, Giọng) | "khi không gặp Địa Không, Địa Kiếp hay sao hao tán cùng cung, của cải có xu hướng bền lên" là điều kiện viết cho người luận. `dieuKien` chỉ có `doSang: Bình`, nên ban-10 (Địa Không hãm cùng cung) vẫn nhận câu này: khách đọc được ý "bền lên" mà không biết lá số mình có đúng điều kiện bị loại trừ. Script bỏ sót cũng tính nhầm Địa Không là đã nhắc. | Hạnh: bỏ mệnh đề điều kiện khỏi `noiDung`; viết thêm câu riêng "Thiên Phủ gặp Địa Không/Địa Kiếp tại Tài Bạch" (kho dễ hở, gợi ý cụ thể), dùng chung cho mọi độ sáng của Thiên Phủ. Bảo: `dieuKien` đồng cung Không/Kiếp chọn câu này. Nghiệm thu: ban-10 sinh lại có câu Phủ gặp Không, `noiDung` của TB-S07-* không còn chữ "khi không gặp". |
| L2-2 `TB-S05-TOT`, `TB-S09-TOT` | P2 (Giọng) | Trùng cụm "càng về sau càng khá". Ý "trước ít sau nhiều / đến muộn" lặp ở 6 câu (S03-HAM, S04-HAM, S05-TOT, S09-TOT, S13-TOT, S13-HAM). Hai sao không đồng cung nên không cùng bài; trừ điểm nhẹ ở mức bộ câu. | Giữ "trước ít sau nhiều" cho Thất Sát (đúng sách); đổi S05-TOT, S09-TOT sang nét riêng (Thiên Đồng: tiền đến từ việc mình thích; Tham Lang: tiền theo quan hệ, giai đoạn). |
| L2-3 `TB-S02-TOT` | P2 (Giọng) | "Thiên Cơ sáng tại Tài Bạch là lá số của người kiếm tiền bằng trí óc": một vị trí sao không phải "lá số". | "…cho thấy bạn kiếm tiền bằng trí óc". |
| L2-4 `TB-S11-HAM` | P2 (Đúng) | Vẫn "nghề kỹ thuật, công nghệ"; mục 5 vòng 1 đã ghi sách là "kỹ nghệ". | "sách cho rằng hợp nghề kỹ thuật". |
