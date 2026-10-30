# Phiếu kiểm duyệt: 49 mẫu "việc nên làm" + đoạn NAM-MANG-06-PHU (Vận 2027)

Người duyệt: Thư (kiem-duyet), 30/10/2026. Việc L-2381a4 (cha L-d94399). Bản nộp: Hạnh, HEAD 4988fa5.
Chuẩn đối chiếu: `khung-doan-tra-phi.md` mục 6.0 (5 điều) và 6.1; `mau-khung-4-phan.md`; `src/lib/luan-giai/ai/tu-cam.json`; `van-nam-2027.json`; cách chọn mẫu trong `src/lib/luan-giai/ai/van-nam.ts` (`chonViec`, `dieuKienViecDung`).

## 1. Kết luận: ĐẠT CÓ ĐIỀU KIỆN

- **Mẫu việc: 47/49 đạt, 2 không đạt (TC-21, TT-18).** Hai mẫu này phải sửa xong, hoặc tạm để ra ngoài, rồi mới nạp vào `src`.
- **Đoạn NAM-MANG-06-PHU: ĐẠT.** Đúng 8 · Sâu 7 · Giọng 8 · An toàn 10, trung bình 8,25.
- **Từ cấm: 0.** Quét 52 mục `tuCam` của `tu-cam.json` trên 49 câu, 49 cách đo, đoạn Phu Thê và dòng QUY-TAC [NAM-MANG-06]. Hạnh ghi trong mục Tự kiểm là "0/74 từ", nhưng tệp hiện chỉ có 52 mục; xin Hạnh ghi lại cho đúng số.
- Quét thêm nhóm từ ngoài ranh (vay, đầu tư, mua, bán, tất toán, gia hạn, thuốc, xét nghiệm, ăn kiêng, chuyên khoa, ngày/giờ tốt, hướng, màu, vật phẩm, kiện, ly hôn, cưới, chia tay, nghỉ việc, Trung Châu, Canh, bảng Tứ hóa): **0 lần**.
- Kiểm bằng máy: 49/49 câu ≤ 45 chữ (dài nhất 32 chữ, TC-12); 49/49 có hạn 1–3 tháng; 49/49 mã bám nằm trong `maNghienCuu` hoặc là `quyTacId` của đoạn trong `van-nam-2027.json`; mọi `quyTacId` trong `dieuKien` đều có thật. Không mã mẫu nào trùng 33 mẫu cũ, và câu, cách đo, hạn ở bảng 6.1 khớp JSON ở cả 49 mẫu.
- Script `dem-sao-bo-sot.cjs` không chạy được trên đợt này vì không có tệp `ban-*.md` (đây là mẫu câu, không phải bài luận). Phần sao bỏ sót sẽ chấm khi có bài sinh thật sau khi nạp.

**Điều kiện nạp (Tùng làm sau khi Hạnh sửa xong):**
1. Hạnh sửa TC-21 và TT-18 theo bảng mục 2. Nếu chưa kịp, Tùng nạp 47 mẫu và để hai mẫu này ra ngoài.
2. Tùng thêm `VAN-SP-10/hãm` vào `maHuong` của TT-01, kèm `dieuKien` khóa `quyTacId: ["NAM-MANG-06-PHU"]` (theo bảng 6.1 đã duyệt). Thiếu bước này thì đoạn Phu Thê bị loại ở cả 4/4 lá số (`sau.md`). Khi chèn đoạn, đổi số đoạn trong test `van-nam-hoi-quy` từ 88 thành 89.
3. Hạnh sửa nhãn dạng trong bảng 6.1 và bảng mục 2 của báo cáo (giữ nguyên câu):
   - TC-13 đổi thành dạng **ii** và thêm `maPhatHuy: ["NAM-HOA-04"]` vào JSON. Lý do: NAM-HOA-LOC-SANG chỉ mô tả điểm mạnh ("thuận việc nhà cửa, chi tiêu gia đình"), không có lời khuyên.
   - CV-12, CV-19, TC-14 đổi thành dạng **iii**. Lý do: NAM-HOA-LOC-HAM chỉ mô tả rủi ro ("cần thêm công sức mới thấy kết quả"), không có lời khuyên.
   - Sửa nhãn không đổi hành vi của máy (`maPhatHuy` hiện chưa được code dùng), nhưng mã ẩn phải ghi đúng dạng theo 6.0 điều 3 và quy tắc 6.
4. Nhánh Lưu Thái Tuế của NAM-MANG-06 chờ Đức kiểm (mục 4). Nhánh này **không chặn nạp** vì đoạn đã gắn ⚑ tổng hợp. Nếu Đức bác, Tùng bỏ `{"trung":["thai-tue"]}` khỏi `motTrong`.

## 2. Mẫu không đạt

| Mã | Lý do | Cần sửa gì (Hạnh tự viết lại) | Quy tắc vi phạm |
|---|---|---|---|
| TC-21 | Câu có hai việc: (1) ghi một dòng, (2) để {phần} vào khoản tích góp. Cách đo "100% khoản thu thêm có ghi" chỉ đo việc (1), còn việc (2), tức điểm "tích góp" mà mẫu dựa vào để bám NAM-HOA-04/sáng, không được đo. Ngoài ra câu gần trùng TC-03 đã duyệt ("chuyển ngay {phần bạn tự chọn} vào tài khoản riêng"). | Giữ một việc. Nếu giữ ý tích góp thì cách đo phải đếm lần đã để phần tích góp, và câu phải khác TC-03 về đối tượng (khoản thu thêm, không phải thu nhập thường kỳ). Cụm "của gia đình" giả định người đọc đã có gia đình; nên để trung tính. | 6.0 điều 3 + quy tắc 1 mục 6 (đúng 1 việc, cách đo đo được việc đó) |
| TT-18 | "hỏi ý một **người lớn** bạn tin" chỉ hợp với người đọc trẻ. Bộ đo có lá số Canh 1970 (57 tuổi năm 2027) và Canh 1980 (47 tuổi); với họ, "người lớn" nghe lạc. Phần bám NAM-LUU-03 (người có vị thế nâng đỡ) thì hợp lệ. | Đổi đối tượng hỏi ý sang cách gọi đúng với mọi lứa tuổi (người từng trải, người bạn tin), giữ vế "tự viết ra quyết định và lý do của mình" vì vế này giữ quyền quyết định ở người đọc. | Tiêu chí Giọng (đúng người đọc, đúng tuổi), skill kiem-duyet-noi-dung mục 1 |

Chấm theo 5 điều mục 6.0, 47 mẫu còn lại đều đạt: một việc, ≤ 45 chữ, có cách đo, hạn 1–3 tháng, bám đúng mã, giữ giới hạn an toàn. Ghi chú không chặn nạp:
- CV-09 và CV-17 có thêm một vế chuẩn bị ("việc chưa xong ghi vào danh sách"; "ghi tên ba người"). Vế này phục vụ việc chính và cách đo vẫn đo việc chính, nên tính là một việc, như TC-07 đã duyệt.
- HT-04 dùng chữ "lĩnh vực này". Chữ này chỉ rõ nghĩa khi đứng sau đoạn (b) có tên cung. Bộ ghép luôn đặt (d) sau (b) nên chấp nhận.
- TC-22 viết thẳng "người liên quan" thay vì dùng biến `{nguoiLienQuan}`. Câu vẫn đúng.

## 3. Đoạn NAM-MANG-06-PHU

| Tiêu chí | Điểm | Lý do |
|---|---|---|
| Đúng | 8 | Điều kiện khớp VAN-SP-10 (c) (Hỏa/Linh **hãm**, `dai-van.md` dòng 139). Câu không khen sao hãm. Nguồn đúng tên sách và tác giả (TT Hy Di Trần Đoàn; KL Hoàng Thường, Hàm Chương). VN01 có cả hai sao nên `{sao}` điền thành "Hỏa Tinh, Linh Tinh", vẫn đọc trơn. Trừ điểm: với nhánh đại vận, cụm "**năm nay** cung này lại là cung hạn (đại vận…)" làm người đọc tưởng đây là chuyện riêng năm 2027, trong khi đại vận kéo dài 10 năm (VN01 khớp đúng nhánh này). Không sai lá số, nhưng nên nói rõ lớp nào. |
| Sâu | 7 | Câu gắn được sao, cung hạn và chuyên đề, có tính cả người đã có đôi ("người đồng hành") lẫn người đang tìm hiểu, đúng NAM-MANG-04. Đoạn chưa có vế cho trường hợp Tuần/Triệt đóng ở Phu Thê. VN01 có Tuần tại Phu Thê, và theo CHUNG-TUAN-02 / VAN-SP-12, Tuần làm dịu nét hãm. Đoạn đơn lẻ nên không trừ nặng; Hạnh cân nhắc thêm vế này ở vòng sau. |
| Giọng | 8 | Lời nhẹ, gần gũi, có định hướng ("để điều cần bàn sang lúc cả hai đã dịu"). "Cung hạn" có ngoặc giải thích. Không câu khuôn. |
| An toàn | 10 | 0 từ cấm. Đã bỏ ý "mất đồ", kiện tụng, chia tay (VAN-CAM-05). Dùng "dễ có lúc", không phán cố định. Có ⚑ tổng hợp. |

**Điều kiện máy so với tinh thần VAN-SP-10 (火鈴限陷): đúng tinh thần.** Câu sách nói Hỏa/Linh hãm **nhập hạn**. Điều kiện "sao hãm nằm ngay tại cung hạn" là đúng nghĩa đen của 入限, và còn chặt hơn bản đại vận VAN-SP-10C (bản đó xét cả tam phương). Vế "Phu Thê phải là cung hạn" là bắt buộc, đúng NAM-MANG-01: sao gốc không phải yếu tố của năm. Câu đã bỏ ý "thất lạc đồ đạc" vì lạc chuyên đề tình cảm. Hợp lý.

**Áp câu nhập hạn của đại vận cho cung hạn năm: chấp nhận, ba nhánh có mức chắc khác nhau.**
- Nhánh **đại vận**: đúng nguyên văn (限 = đại hạn).
- Nhánh **tiểu hạn**: có căn cứ trong chính bộ quy tắc. Sách dùng "二限" (đại hạn và tiểu hạn) trong cùng thiên 諸星入限, ví dụ VAN-SP-08 "二限休教落陷逢" (`dai-van.md`). Nên tiểu hạn nằm trong chữ 限.
- Nhánh **Lưu Thái Tuế** là phần mở rộng tổng hợp. Sách nêu Thái Tuế **tách riêng** khỏi hai hạn (VAN-SP-06: "若遇太歲與二限"), nên không thể suy Thái Tuế ra từ chữ 限. **Cần Đức kiểm** xem có câu sách nào áp 火鈴 cho Thái Tuế không, hoặc chấp nhận là quy ước của xemtuvi.vn theo NAM-MANG-01. Trong lúc chờ, nhãn ⚑ tổng hợp hiện có là đủ để nạp.

## 4. Trả lời 7 điểm Hạnh nêu ở mục 5

1. **Dạng (ii) "phát huy": không mẫu nào suy từ hình tượng sao.** Mẫu nào cũng truy được về một cụm chữ trong `noiDung` của chính đoạn nó bám:
   - NAM-HOA-KHOA-SANG ("ý tưởng, kế hoạch… dễ được ghi nhận") cho CV-14, TC-23, TT-17.
   - NAM-HOA-QUYEN-SANG ("quyền đến nhờ khéo léo và hòa nhã") cho CV-16, TC-17, TT-14.
   - NAM-LUU-03 ("được người có vị thế… nâng đỡ, giới thiệu") cho CV-17, TC-08, TC-20, TT-09, TT-18.
   - NAM-LUU-05-PHU ("thuận gặp gỡ và vun đắp") cho TT-10.
   - NAM-HOA-LOC-SANG ("chu đáo… tích góp") cho TT-13, TC-21.

   Không mẫu nào dạng "Khôi Việt thì đi gặp sếp" hay "Hồng Loan thì đi xem mắt". TT-10 không chọn thời điểm, cũng không giục cưới. Bám yếu nhất là TC-23 và TT-17: hai mẫu dựa vào chữ "kế hoạch", trong khi mã nói kế hoạch **được người khác ghi nhận**, còn mẫu bảo người đọc tự viết kế hoạch. Vẫn nằm trong nghĩa của mã nên đạt. TC-08 và TT-09 hợp lệ vì "người có chuyên môn mà bạn tin" và "người cả hai quý trọng" chính là "người có vị thế trong lĩnh vực này". TT-18 đạt về bám mã nhưng trượt vì lý do tuổi (mục 2). TC-21 bám mã đúng nhưng trượt vì có hai việc và cách đo lệch.
2. **SK-05: đạt.** Mẫu chỉ nói nếp ngủ, không nhắc bộ phận, bệnh hay thuốc. Dạng (iii) đúng: giảm rủi ro "di chuyển, thay đổi" mà NAM-LUU-02 mô tả.
3. **TC-13 và TC-21 không vượt ranh tài chính.** Mức tiền do người đọc tự đặt; không có sản phẩm, vay, đầu tư hay thời điểm nào; lập danh sách chi và để riêng một phần đã có tiền lệ ở TC-01 và TC-03 đã duyệt. TC-21 trượt vì lý do khác (mục 2). TC-11, TC-22, TC-24 cũng đạt: chỉ có ghi điều khoản, nói rõ, xin thêm thời gian; không bảo nhận, từ chối, vay hay trả.
4. **TT-07 và TT-19: đạt.** "Trước khi ký hay gửi" không khuyên ký hay không ký; động từ quyết định không có. Ghi chú cho Tùng: vế `VAN-SP-06/thận trọng` chỉ khóa bằng `saoTrongCung`, chưa khóa `quyTacId`, nên vế này còn khớp cả đoạn NAM-LUU-02 nếu Phu Thê ở Tỵ (năm 2027, L. Văn Khúc và L. Đà La cùng ở Tỵ). Trường hợp này vẫn hợp lệ vì đúng là vế "更有羊陀" của VAN-SP-06, và (b) của NAM-LUU-02 có nói giấy tờ. Không cần sửa.
5. **Tuổi Canh, 5 mẫu (CV-11, CV-20, TC-12, TC-22, TT-12): không lộ Trung Châu.** Máy đếm 0 lần "Trung Châu", "Canh", "bảng", "Tứ hóa" trong câu và cách đo. Phần bảo lưu bảng Canh nằm ở (b) của đoạn NAM-HOA-08-KY-LOC-CANH, đúng chỗ.
6. **NAM-LUU-02 có nhắc "Văn Khúc": chấp nhận, không cần sửa.** Năm Đinh Mùi: L. Văn Khúc theo can Đinh ở Tỵ; L. Thiên Mã theo chi Mùi (Hợi Mão Mùi) ở Tỵ; L. Đà La đứng trước L. Lộc Tồn (Đinh, Ngọ) nên cũng ở Tỵ. Ba sao luôn cùng cung, nên câu đúng với mọi lá số khớp điều kiện Mã + Đà. Tệp chỉ dùng cho năm 2027 nên không có rủi ro dùng lại sang năm khác.
7. **Câu mở bằng cụm điều kiện ("Khi…", "Trước khi…", "Với mỗi…"): chấp nhận.** Động từ chính đứng ngay sau một cụm điều kiện ngắn, giống CV-01, CV-06, TC-02, TC-05 đã duyệt. Cụm điều kiện còn giúp mẫu không thành mệnh lệnh khi người đọc chưa gặp tình huống đó.

## 5. Rủi ro báo Minh (không thuộc 49 mẫu, không chặn nạp)

- **Tuổi người đọc:** lá số Canh 2010 (17 tuổi năm 2027) vẫn có thể nhận các mẫu "giấy tờ chung… trước khi ký" (TT-07, TT-19), "chi tiêu gia đình" (TC-13), "gửi cấp trên đề xuất" (CV-14). Đề xuất (Minh quyết, Bảo hoặc Tùng làm): khi người đọc dưới khoảng 18 tuổi, bộ chọn mẫu ưu tiên `hoc-tap` ở mảng Sự nghiệp và bỏ các mẫu có ký giấy tờ hoặc tiền chung. Nghiệm thu: sinh bài Canh 2010 cả 5 giờ sinh, 0 mẫu loại này.
- Mảng Tài chính còn trống ở 14 lá số và Sự nghiệp ở 5 lá số, do bộ ghép (lớp `thai-tue` không được kéo vào mảng), không do mẫu. Đồng ý với đề xuất (a) của Hạnh ở mục 4.1; Minh quyết.
