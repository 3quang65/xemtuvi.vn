# Đoạn nền Quan Lộc đủ 4 phần khi mảng Sự nghiệp không có yếu tố năm (việc L-5e7bce)

Hạnh, 30/10/2026. Thực hiện đề xuất (b) của `bo-sung-viec-L-d94399.md` mục 4 điểm 1, Minh đã chốt: không viết đoạn năm giả; mảng in đoạn nền của cung (bộ 12 cung) đủ 4 phần. Chỉ sửa docs; không sửa `src/`.

## 1. Mã nghiên cứu cho 107 đoạn QL-* (bộ 12 cung)

Tệp: `ql-ma-nghien-cuu.json` (bảng `mã đoạn → maNghienCuu`). Mọi mã đều có trong `docs/nghien-cuu/luan-giai-12-cung.md` (đã kiểm bằng máy, 0 mã thiếu).

| Đoạn QL-* | maNghienCuu | Lý do (phần (b) dùng ý của mã) |
|---|---|---|
| QL-S01-TOT/BINH/HAM (Tử Vi) | QUAN-TV-05 | "vai trò điều phối… xây vài cộng sự" = điều hành, cần phụ tá |
| QL-S02-* (Thiên Cơ) | QUAN-TCO-04 | phân tích, lập kế hoạch, tham mưu |
| QL-S03-* (Thái Dương) | QUAN-TDU-05 | công khai, truyền đạt, được ghi nhận |
| QL-S04-* (Vũ Khúc) | QUAN-VK-04 | chỉ tiêu, số liệu, đo kết quả rõ |
| QL-S05-* (Thiên Đồng) | QUAN-TD-04 | dịch vụ, chăm sóc, giáo dục; thích cải tiến |
| QL-S06-* (Liêm Trinh) | QUAN-LT-05 | nguyên tắc, luật lệ rõ, cân bằng tham vọng với minh bạch |
| QL-S07-* (Thiên Phủ) | QUAN-TP-03 | quản lý nguồn lực, tiến từng bước chắc |
| QL-S08-* (Thái Âm) | QUAN-TA-04 | cẩn trọng, tỉ mỉ, thẩm mỹ |
| QL-S09-* (Tham Lang) | QUAN-THL-04 | năng động, giao tiếp, cần giữ tập trung |
| QL-S10-* (Cự Môn) | QUAN-CM-03 | lời nói, lập luận, diễn đạt khéo |
| QL-S11-* (Thiên Tướng) | QUAN-TT-04 | điều phối, hỗ trợ, đại diện |
| QL-S12-* (Thiên Lương) | QUAN-TL-04 | tư vấn, giáo dục, đạo đức nghề |
| QL-S13-* (Thất Sát) | QUAN-TS-04 | tiên phong, việc khó, quyết đoán |
| QL-S14-* (Phá Quân) | QUAN-PQ-04 | khởi sự, cải tổ, cần đối tác giữ ổn định |
| QL-Snn-C3/C4/C5 (sao ở Tài Bạch, Phu Thê, Mệnh chiếu về) | mã phong cách của sao + QUAN-YN-04 | "tiếp thêm/soi sang thêm nét…" + tam phương tứ chính |
| QL-VCD | QUAN-CC-01, CHUNG-VCD-01, CHUNG-VCD-02 | "chịu ảnh hưởng từ cung xung chiếu và hoàn cảnh" |
| QL-HOA-0/1/2 (Lộc, Quyền, Khoa) | QUAN-HOA-02, QUAN-HOA-01 | nguồn lực, dẫn dắt, danh tiếng |
| QL-HOA-3 (Kỵ) | QUAN-HOA-03 | điểm nhạy cảm, vướng mắc |
| QL-TT-TUẦN / QL-TT-TRIỆT | CHUNG-TUAN-02, CHUNG-TUAN-05 | biểu hiện chậm, kín đáo hơn |
| QL-PS-0/1 (Tả, Hữu) | QUAN-SP-03 | có người hỗ trợ |
| QL-PS-2/3 (Xương, Khúc) | QUAN-SP-01 | chữ nghĩa, biểu đạt |
| QL-PS-4/5 (Khôi, Việt) | QUAN-SP-02 | quý nhân, người đi trước |
| QL-PS-6 (Lộc Tồn) | QUAN-SP-04 | tích lũy, tổ chức |
| QL-PS-7 (Thiên Mã) | QUAN-SP-05, CHUNG-SP-05 | năng động, di chuyển |
| QL-PS-8 (Kình Dương) | QUAN-SP-06 | nghị lực, cần kiểm soát nóng vội |
| QL-PS-9/10/11 (Đà, Hỏa, Linh) | QUAN-SP-07 | kiên trì / nhiệt huyết / nhạy bén |
| QL-PS-12/13 (Không, Kiếp) | QUAN-SP-08 | ý tưởng khác lạ, hay đổi hướng |
| QL-PS-14/15 (Hồng Loan, Đào Hoa) | QUAN-SP-14 | duyên giao tiếp, sức hút |

Không gán mã chi tiết theo chi (vd QUAN-THL-03 "Tham Lang tại Dần, Thân") vì đoạn QL-* chỉ phân theo độ sáng, câu (b) không dùng ý đó. Không gán mã TRANH, mã phương pháp (QUAN-YN-01/02/05).

## 2. Mẫu việc nên làm dạng "phát huy" (CV-23…CV-37)

Bảng: `docs/luan-giai/khung-doan-tra-phi.md` mục 6.1 (sau CV-22). JSON nháp: `viec-nen-lam-ql.json` (15 mẫu, chủ đề `cong-viec`, dạng ii, `tongHop`, có `maPhatHuy`, `nguonChiTiet`).

Đủ 5 điều mục 6.0:
1. Mã bám nằm trong `maNghienCuu` của đoạn nền và phần (b) dùng ý mã (cột "Lý do" ở trên).
2. Mã bám là mã nội dung (QUAN-<SAO>-phong cách, QUAN-CC-01, CHUNG-VCD-02), không mã phương pháp/TRANH/CAM.
3. Dạng (ii) phát huy điểm mạnh mã mô tả; CV-37 đồng thời là cách làm cụ thể của lời khuyên "chọn hướng mình làm tốt nhất để theo lâu dài" trong QL-VCD.
4. Điều kiện máy đọc: `quyTacId` chỉ nhận QL-S<nn>-TOT/BINH/HAM (CV-37: QL-VCD), `cung` = Quan Lộc, `saoTrongCung` = đúng chính tinh đó. Mẫu không bám nhầm vào đoạn C3/C4/C5 hay đoạn năm.
5. An toàn: không tài chính, y tế, pháp lý; không chọn ngày, vật phẩm; không ép mua. Câu ≤ 33 chữ, có cách đo trong 2–3 tháng. Viết "công việc hoặc việc học", "nhóm, lớp" để dùng được cho người dưới 18 tuổi (lá số Canh 2010 tuổi 17 năm 2027), nên không đặt `tuoiTu`.

## 3. Quy tắc NAM-MANG-07

Đã ghi vào `docs/luan-giai/van-nam/QUY-TAC.md` mục 6: mảng không có yếu tố năm → in đoạn nền đủ 4 phần ((a) sao gốc tại cung, (b) "năm nay đi theo nền" + nội dung đoạn nền, (c) nguồn, (d) mẫu phát huy). Thiếu mã hoặc không mẫu bám được thì giữ câu dẫn, không gán mẫu chung. Đoạn nền nói tính chất lâu dài, không viết thành dự báo năm.

## 4. Đo lại (giả lập nạp trên bản sao tạm)

Cách đo: `git worktree` tạm `/tmp/hanh-ql` tại HEAD 7e7b1d4 (đã có bộ ghép L-9409be). Trên bản sao: (1) chép `ql-ma-nghien-cuu.json` vào `quy-tac-van/ma-nghien-cuu-12-cung.json`, cho `maNghienCuuCua` (index.ts) đọc thêm bảng này khi mã không có trong bản 2; (2) nối 15 mẫu (8 trường máy đọc) vào `viec-nen-lam.json` sau CV-22. Chạy `do-doan-du.cjs`. `src/` của repo chính không đổi.

**5 lá số mục tiêu: 5/5 có đoạn đủ 4 phần ở Sự nghiệp.**

| Lá số | Quan Lộc | Đoạn đủ 4 phần ở Sự nghiệp: trước → sau | Đoạn nền | Việc bám |
|---|---|---|---|---|
| Canh 1970 nữ 5/5h | Ngọ, vô chính diệu | 0 → 1 | QL-VCD | CV-37 bám CHUNG-VCD-02 |
| Canh 1980 nam 4/9h | Dần, Tham Lang (đắc) | 0 → 1 | QL-S09-TOT | CV-31 bám QUAN-THL-04 |
| Canh 1990 nữ 12/1h | Dần, vô chính diệu | 0 → 1 | QL-VCD | CV-37 bám CHUNG-VCD-02 |
| Canh 2000 nữ 5/5h | Ngọ, Liêm Trinh (vượng), Thiên Tướng | 0 → 1 | QL-S06-TOT | CV-28 bám QUAN-LT-05 |
| Canh 2010 nam 4/9h | Dần, vô chính diệu | 0 → 1 | QL-VCD | CV-37 bám CHUNG-VCD-02 |

Toàn bộ 28 lá số (25 Canh + VN01–VN03), đo cùng HEAD 7e7b1d4:
- Mảng Sự nghiệp trống: **6/28 → 0/28** (thêm Canh 2010 nữ 5/5h, trống ở HEAD hiện tại do lọc tuổi `tuoiTu 18`).
- Mọi lá số tăng đúng 1 đoạn đủ 4 phần ở Sự nghiệp (đoạn nền); Tổng quan, Tài chính, Tình cảm, Sức khỏe **không đổi** ở cả 28 lá số (mẫu mới không lấy chỗ của đoạn nào).
- Lá số có ít nhất một mảng trống: 18/28 → 15/28; phần còn lại là Tài chính (Lưu Thái Tuế ở Tài Bạch, đề xuất (a), việc khác).
- Đoạn nền ở 25 lá số Canh: 25/25 đủ 4 phần (QL-VCD 5, QL-S03-TOT 6, QL-S08-HAM 3, QL-S01 3, QL-S02-TOT 2, còn lại 1 mỗi loại); 11/15 mẫu mới được dùng ít nhất một lần (chưa gặp CV-32, CV-34, CV-35, CV-36 vì bộ 25 lá số không có Cự Môn, Thiên Lương, Thất Sát, Phá Quân làm đoạn nền).

Bản in mẫu (Canh 2000 nữ 5/5h, Sự nghiệp, từ bản giả lập):
> **Căn cứ trên lá số của bạn:** Cung Quan Lộc (Ngọ): Liêm Trinh (vượng).
> Liêm Trinh tại Quan Lộc: hợp công việc đòi hỏi nguyên tắc và quản trị, cần mềm dẻo trong giao tiếp. Nên chọn môi trường có luật lệ rõ (pháp lý, quản lý, kỹ thuật) và giữ cân bằng giữa tham vọng với sự minh bạch.
> **Nguồn:** Tân Biên · tam hợp phái Việt
> **Việc nên làm (3 tháng):** Viết ra ba nguyên tắc làm việc bạn muốn giữ (ví dụ: hứa là làm, số liệu rõ nguồn, nói thẳng mà mềm); cuối mỗi tuần tự chấm mình giữ được mấy điều. Cách đo: ≥ 10/12 tuần có tự chấm.
> *(câu dẫn NAM-MANG-01 in ngay sau: "Năm nay cung Quan Lộc không có yếu tố của năm chạm trực tiếp…")*

## 5. Việc cho Tùng khi nạp (Minh quyết)

1. Cho `maNghienCuuCua` đọc thêm bảng mã bộ 12 cung (chép `ql-ma-nghien-cuu.json`), hoặc thêm trường `maNghienCuu` vào các đoạn QL-* trong `quy-tac.json`. Đổi một dòng; không đổi văn bản đoạn.
2. Nối CV-23…CV-37 (8 trường) vào `viec-nen-lam.json` sau CV-22 khi Thư duyệt; test đếm số mẫu `luan-giai-van-nam-4-phan` tăng 15.
3. Nên làm (không bắt buộc cho số đo): đưa câu dẫn NAM-MANG-01 lên **trước** đoạn nền để (b) đọc thành "năm nay đi theo nền, nên phát huy…"; dòng (c) nối thêm nguồn của mã nghiên cứu (vd QL-VCD hiện chỉ in "Toàn Thư", mã QUAN-CC-01 nguồn TB, KL).

## 6. Rủi ro, điểm Thư cần xem

- Đoạn QL-* là bản 1 (câu ngắn, chung theo độ sáng): đúng học thuật ở mức thiên hướng, chưa sâu bằng bản 2. QL-S08-HAM, QL-S11-HAM nhận mẫu phát huy giống bản sáng; câu (b) của chúng vẫn nêu điểm mạnh nên hợp lệ, nhưng Thư xem có cần tách mẫu riêng cho bản hãm không.
- CV-37 (vô chính diệu) dùng ở 5/25 lá số: nhiều khách sẽ thấy cùng một việc. Không nhắc câu nặng của QUAN-CC-01 ("công danh khó hiển đạt").
- Mã ẩn của CV-37 hiện in "bám CHUNG-VCD-02" (bộ chọn ưu tiên mã bậc 0); cả hai mã đều hợp lệ.
- Toàn bộ là đề xuất, chưa qua Thư; chưa nạp vào `src/`.
