# Bổ sung "việc nên làm" và đoạn Phu Thê VAN-SP-10 — việc L-2381a4 (cha L-d94399)

Người viết: Hạnh (luận giải), 30/10/2026. Người giao: Minh. Người duyệt: Thư, rồi Tùng nạp vào `src/` (trước 15/12).
Tệp kèm: `viec-nen-lam-bo-sung.json` (49 mẫu, cùng schema `viec-nen-lam.json`), `doan-mau-bo-sung.json` (1 đoạn), `truoc.md`, `sau.md`, `sau-tt01-dong-bo.md`.
Cách đo: bản sao `git worktree` tại `/tmp/xtv-hanh`; chép đoạn mới vào `van-nam-2027.json`, nối 49 mẫu vào `viec-nen-lam.json`, chạy `do-doan-du.cjs`. Không sửa `src/` của repo chính.

## 1. Bảng trước / sau

**Lá số có mảng trống: 28/28 → 17/28.** Theo mảng (số lá số còn trống): Sự nghiệp 28 → 5 · Tài chính 20 → 14 · Tình cảm 16 → 0 · Sức khỏe 0 → 0.
`sau-tt01-dong-bo.md`: cùng số 17/28, khi giả lập TT-01 trong `src` đã có `VAN-SP-10/hãm` như bảng 6.1 (xem mục 3, điểm 2): đoạn Phu Thê mới có đủ 4 phần ở cả 4 lá số khớp.

Số đoạn đủ 4 phần (trước → sau):

| Lá số | Tổng quan | Sự nghiệp | Tài chính | Tình cảm | Sức khỏe | Mảng trống (sau) |
|---|---|---|---|---|---|---|
| VN01 | 2 → 8 | 0 → 1 | 1 → 1 | 0 → 1 | 1 → 1 | đủ |
| VN02 | 3 → 11 | 0 → 2 | 1 → 3 | 1 → 2 | 1 → 1 | đủ |
| VN03 | 2 → 10 | 0 → 1 | 0 → 2 | 1 → 1 | 1 → 1 | đủ |
| Canh 1970 nam 4/9h | 1 → 9 | 0 → 1 | 0 → 2 | 1 → 3 | 1 → 1 | đủ |
| Canh 1970 nu 5/5h | 2 → 7 | 0 → 0 | 0 → 0 | 0 → 1 | 1 → 2 | su-nghiep, tai-chinh |
| Canh 1970 nam 7/15h | 2 → 6 | 0 → 1 | 0 → 0 | 1 → 3 | 1 → 1 | tai-chinh |
| Canh 1970 nu 10/21h | 1 → 7 | 0 → 1 | 0 → 0 | 1 → 3 | 1 → 1 | tai-chinh |
| Canh 1970 nu 12/1h | 2 → 6 | 0 → 1 | 0 → 0 | 1 → 3 | 1 → 1 | tai-chinh |
| Canh 1980 nam 4/9h | 2 → 8 | 0 → 0 | 1 → 1 | 0 → 1 | 1 → 1 | su-nghiep |
| Canh 1980 nu 5/5h | 1 → 9 | 0 → 1 | 0 → 3 | 0 → 1 | 1 → 1 | đủ |
| Canh 1980 nam 7/15h | 1 → 8 | 0 → 1 | 0 → 0 | 0 → 2 | 1 → 1 | tai-chinh |
| Canh 1980 nu 10/21h | 1 → 8 | 0 → 1 | 0 → 0 | 1 → 3 | 1 → 1 | tai-chinh |
| Canh 1980 nu 12/1h | 2 → 7 | 0 → 1 | 0 → 0 | 1 → 3 | 1 → 1 | tai-chinh |
| Canh 1990 nam 4/9h | 2 → 9 | 0 → 3 | 0 → 0 | 0 → 2 | 1 → 1 | tai-chinh |
| Canh 1990 nu 5/5h | 1 → 8 | 0 → 1 | 0 → 2 | 0 → 2 | 1 → 2 | đủ |
| Canh 1990 nam 7/15h | 1 → 6 | 0 → 1 | 1 → 1 | 0 → 1 | 1 → 1 | đủ |
| Canh 1990 nu 10/21h | 1 → 6 | 0 → 1 | 1 → 1 | 0 → 1 | 1 → 1 | đủ |
| Canh 1990 nu 12/1h | 0 → 9 | 0 → 0 | 1 → 2 | 0 → 2 | 1 → 1 | su-nghiep |
| Canh 2000 nam 4/9h | 1 → 7 | 0 → 1 | 0 → 0 | 1 → 3 | 1 → 1 | tai-chinh |
| Canh 2000 nu 5/5h | 1 → 6 | 0 → 0 | 0 → 0 | 0 → 1 | 1 → 1 | su-nghiep, tai-chinh |
| Canh 2000 nam 7/15h | 2 → 9 | 0 → 1 | 0 → 1 | 0 → 1 | 1 → 1 | đủ |
| Canh 2000 nu 10/21h | 2 → 7 | 0 → 3 | 0 → 0 | 1 → 2 | 1 → 1 | tai-chinh |
| Canh 2000 nu 12/1h | 2 → 8 | 0 → 3 | 0 → 0 | 0 → 2 | 1 → 1 | tai-chinh |
| Canh 2010 nam 4/9h | 2 → 10 | 0 → 0 | 1 → 1 | 0 → 1 | 1 → 1 | su-nghiep |
| Canh 2010 nu 5/5h | 2 → 9 | 0 → 1 | 1 → 3 | 1 → 2 | 1 → 1 | đủ |
| Canh 2010 nam 7/15h | 1 → 8 | 0 → 1 | 0 → 0 | 0 → 1 | 1 → 1 | tai-chinh |
| Canh 2010 nu 10/21h | 2 → 8 | 0 → 3 | 0 → 0 | 0 → 2 | 1 → 1 | tai-chinh |
| Canh 2010 nu 12/1h | 1 → 9 | 0 → 1 | 0 → 2 | 1 → 3 | 1 → 1 | đủ |

## 2. Danh sách mẫu mới (49)

Thứ tự viết theo mã thiếu nhiều nhất ở `truoc.md`; mỗi mã có mẫu ở chủ đề còn thiếu (cong-viec trước). Mã có hai mẫu cùng chủ đề (CV-11/CV-20, TC-10/TC-19…) vì bộ ghép dùng mỗi mẫu một lần mỗi bài và đoạn tổng quan cùng mã đứng trước đã lấy mẫu thứ nhất (đo vòng 1: 25/28 còn trống chủ yếu vì lý do này). Câu đầy đủ, cách đo, hạn: bảng 6.1 `khung-doan-tra-phi.md` (dòng có mã mới) và JSON.

Mọi mã bám đã kiểm có trong `maNghienCuu` (hoặc là `quyTacId`) của đoạn thật đang bị loại ở `truoc.md`: NAM-HOA-04/05/06/07/08 (đoạn NAM-HOA-*), NAM-LUU-02, NAM-LUU-03, NAM-LUU-05, NAM-LUU-04-SAT + VAN-SP-06, NAM-TT-02, NAM-TT-06. Vế được khóa bằng `dieuKien.quyTacId` (vd `NAM-HOA-06/sáng` chỉ nhận đoạn NAM-HOA-KHOA-SANG). Không mẫu nào bám NAM-PP, NAM-TT-01, NAM-MANG-01, TAT-YN, CAM, TRANH.

| Mã | chuDe | Mã bám / vế | Dạng | Điều kiện máy (dieuKien) |
|---|---|---|---|---|
| CV-09 | cong-viec | NAM-TT-06 | i | NAM-TT-06: quyTacId=NAM-TT-06, cung=Quan Lộc, saoTrongCung=nhóm sao |
| CV-10 | cong-viec | NAM-HOA-07 | i | NAM-HOA-07: quyTacId=NAM-HOA-KY-SANG/NAM-HOA-KY-HAM |
| CV-11 | cong-viec | NAM-HOA-08/Kỵ-Lộc | i | NAM-HOA-08/Kỵ-Lộc: quyTacId=NAM-HOA-08-KY-LOC/NAM-HOA-08-KY-LOC-CANH |
| CV-12 | cong-viec | NAM-HOA-04/hãm | iii | NAM-HOA-04/hãm: quyTacId=NAM-HOA-LOC-HAM |
| CV-13 | cong-viec | NAM-HOA-05/hãm | i | NAM-HOA-05/hãm: quyTacId=NAM-HOA-QUYEN-HAM |
| CV-14 | cong-viec | NAM-HOA-06/sáng | ii · tongHop | NAM-HOA-06/sáng: quyTacId=NAM-HOA-KHOA-SANG |
| CV-15 | cong-viec | NAM-HOA-06/hãm | i | NAM-HOA-06/hãm: quyTacId=NAM-HOA-KHOA-HAM |
| CV-16 | cong-viec | NAM-HOA-05/sáng | ii · tongHop | NAM-HOA-05/sáng: quyTacId=NAM-HOA-QUYEN-SANG |
| CV-17 | cong-viec | NAM-LUU-03 | ii · tongHop | NAM-LUU-03: quyTacId=NAM-LUU-03 |
| CV-18 | cong-viec | NAM-LUU-02 | i | NAM-LUU-02: quyTacId=NAM-LUU-02 |
| HT-04 | hoc-tap | NAM-HOA-06/sáng | i | NAM-HOA-06/sáng: quyTacId=NAM-HOA-KHOA-SANG |
| TC-08 | tai-chinh | NAM-LUU-03 | ii · tongHop | NAM-LUU-03: quyTacId=NAM-LUU-03 |
| TC-09 | tai-chinh | NAM-TT-06 | i | NAM-TT-06: quyTacId=NAM-TT-06, cung=Tài Bạch, saoTrongCung=nhóm sao |
| TC-10 | tai-chinh | NAM-HOA-07 | i | NAM-HOA-07: quyTacId=NAM-HOA-KY-SANG/NAM-HOA-KY-HAM |
| TC-11 | tai-chinh | NAM-HOA-08/Lộc-Kỵ | i | NAM-HOA-08/Lộc-Kỵ: quyTacId=NAM-HOA-08-LOC-KY |
| TC-12 | tai-chinh | NAM-HOA-08/Kỵ-Lộc | i | NAM-HOA-08/Kỵ-Lộc: quyTacId=NAM-HOA-08-KY-LOC/NAM-HOA-08-KY-LOC-CANH |
| TC-13 | tai-chinh | NAM-HOA-04/sáng | ii · tongHop | NAM-HOA-04/sáng: quyTacId=NAM-HOA-LOC-SANG |
| TC-14 | tai-chinh | NAM-HOA-04/hãm | iii | NAM-HOA-04/hãm: quyTacId=NAM-HOA-LOC-HAM |
| TC-15 | tai-chinh | NAM-HOA-05/hãm | i | NAM-HOA-05/hãm: quyTacId=NAM-HOA-QUYEN-HAM |
| TC-16 | tai-chinh | NAM-HOA-06/sáng | i | NAM-HOA-06/sáng: quyTacId=NAM-HOA-KHOA-SANG |
| TC-17 | tai-chinh | NAM-HOA-05/sáng | ii · tongHop | NAM-HOA-05/sáng: quyTacId=NAM-HOA-QUYEN-SANG |
| TT-07 | tinh-cam | VAN-SP-06/thận trọng, NAM-LUU-04-SAT | i | VAN-SP-06/thận trọng: saoTrongCung=nhóm sao; NAM-LUU-04-SAT: quyTacId=NAM-LUU-04-SAT |
| TT-08 | tinh-cam | NAM-TT-06 | i | NAM-TT-06: quyTacId=NAM-TT-06, cung=Phu Thê, saoTrongCung=nhóm sao |
| TT-09 | tinh-cam | NAM-LUU-03 | ii · tongHop | NAM-LUU-03: quyTacId=NAM-LUU-03 |
| TT-10 | tinh-cam | NAM-LUU-05 | ii · tongHop | NAM-LUU-05: quyTacId=NAM-LUU-05-PHU |
| TT-11 | tinh-cam | NAM-HOA-07 | i | NAM-HOA-07: quyTacId=NAM-HOA-KY-SANG/NAM-HOA-KY-HAM |
| TT-12 | tinh-cam | NAM-HOA-08/Kỵ-Lộc | i | NAM-HOA-08/Kỵ-Lộc: quyTacId=NAM-HOA-08-KY-LOC/NAM-HOA-08-KY-LOC-CANH |
| TT-13 | tinh-cam | NAM-HOA-04/sáng | ii · tongHop | NAM-HOA-04/sáng: quyTacId=NAM-HOA-LOC-SANG |
| TT-14 | tinh-cam | NAM-HOA-05/sáng | ii · tongHop | NAM-HOA-05/sáng: quyTacId=NAM-HOA-QUYEN-SANG |
| TT-15 | tinh-cam | NAM-HOA-05/hãm | i | NAM-HOA-05/hãm: quyTacId=NAM-HOA-QUYEN-HAM |
| TT-16 | tinh-cam | NAM-HOA-06/hãm | i | NAM-HOA-06/hãm: quyTacId=NAM-HOA-KHOA-HAM |
| TT-17 | tinh-cam | NAM-HOA-06/sáng | ii · tongHop | NAM-HOA-06/sáng: quyTacId=NAM-HOA-KHOA-SANG |
| SK-05 | suc-khoe | NAM-LUU-02 | iii · tongHop | NAM-LUU-02: quyTacId=NAM-LUU-02 |
| SK-06 | suc-khoe | NAM-TT-06 | i | NAM-TT-06: quyTacId=NAM-TT-06, cung=Tật Ách, saoTrongCung=nhóm sao |
| CV-19 | cong-viec | NAM-HOA-04/hãm | iii | NAM-HOA-04/hãm: quyTacId=NAM-HOA-LOC-HAM |
| CV-20 | cong-viec | NAM-HOA-08/Kỵ-Lộc | i | NAM-HOA-08/Kỵ-Lộc: quyTacId=NAM-HOA-08-KY-LOC/NAM-HOA-08-KY-LOC-CANH |
| CV-21 | cong-viec | NAM-LUU-02 | i | NAM-LUU-02: quyTacId=NAM-LUU-02 |
| TC-18 | tai-chinh | NAM-HOA-05/hãm | i | NAM-HOA-05/hãm: quyTacId=NAM-HOA-QUYEN-HAM |
| TC-19 | tai-chinh | NAM-HOA-07 | i | NAM-HOA-07: quyTacId=NAM-HOA-KY-SANG/NAM-HOA-KY-HAM |
| TC-20 | tai-chinh | NAM-LUU-03 | ii · tongHop | NAM-LUU-03: quyTacId=NAM-LUU-03 |
| TC-21 | tai-chinh | NAM-HOA-04/sáng | ii · tongHop | NAM-HOA-04/sáng: quyTacId=NAM-HOA-LOC-SANG |
| TC-22 | tai-chinh | NAM-HOA-08/Kỵ-Lộc | i | NAM-HOA-08/Kỵ-Lộc: quyTacId=NAM-HOA-08-KY-LOC/NAM-HOA-08-KY-LOC-CANH |
| TC-23 | tai-chinh | NAM-HOA-06/sáng | ii · tongHop | NAM-HOA-06/sáng: quyTacId=NAM-HOA-KHOA-SANG |
| TT-18 | tinh-cam | NAM-LUU-03 | ii · tongHop | NAM-LUU-03: quyTacId=NAM-LUU-03 |
| TT-19 | tinh-cam | VAN-SP-06/thận trọng, NAM-LUU-04-SAT | i | VAN-SP-06/thận trọng: saoTrongCung=nhóm sao; NAM-LUU-04-SAT: quyTacId=NAM-LUU-04-SAT |
| TT-20 | tinh-cam | NAM-HOA-07 | i | NAM-HOA-07: quyTacId=NAM-HOA-KY-SANG/NAM-HOA-KY-HAM |
| CV-22 | cong-viec | NAM-TT-02 | i | NAM-TT-02: quyTacId=NAM-TT-02 |
| TC-24 | tai-chinh | NAM-TT-02 | i | NAM-TT-02: quyTacId=NAM-TT-02 |
| GD-06 | gia-dao | NAM-TT-02 | i | NAM-TT-02: quyTacId=NAM-TT-02 |

## 3. Đoạn Phu Thê mới (NAM-MANG-06-PHU)

- Điều kiện: Hỏa Tinh hoặc Linh Tinh gốc **hãm** ở Phu Thê **và** Phu Thê là cung hạn của năm (`motTrong` trung đại vận / tiểu hạn / Lưu Thái Tuế). Lý do thêm vế cung hạn: VAN-SP-10 là câu "nhập hạn" (火鈴限陷); sao gốc không có yếu tố năm thì không phải chuyện của năm (NAM-MANG-01).
- `maNghienCuu`: VAN-SP-10, NAM-MANG-04 (không đưa PHU-SP-06 vào để TT-01 bám đúng VAN-SP-10/hãm; PHU-SP-06 chỉ là mã phụ trong mã ẩn).
- Câu (b): "{sao} ở thế hãm tại cung Phu Thê, mà năm nay cung này lại là cung hạn (đại vận, tiểu hạn hoặc Lưu Thái Tuế): chuyện tình cảm, với người đồng hành hay người bạn đang tìm hiểu, dễ có lúc nóng lời hoặc có việc bất ngờ xen vào kế hoạch chung. Nên giữ bình tĩnh khi trao đổi, để điều cần bàn sang lúc cả hai đã dịu." Sao hãm, không khen; bỏ ý "mất đồ", kiện tụng của sách.
- Nguồn: TT q.2 〈火鈴二星入限〉, KL A.4 · Tam hợp phái Việt · ⚑ tổng hợp (áp câu nhập hạn của đại vận cho cung hạn năm; Đức cần kiểm). Quy tắc ghi `QUY-TAC.md` mục 6, mã **[NAM-MANG-06]**.
- Khớp 4/28 lá số: VN01 (đại vận ở Phu Thê, Hỏa + Linh hãm), Canh 1980 nữ 5/5h (Hỏa), Canh 2000 nữ 10/21h (Linh), Canh 2010 nam 7/15h.
- Việc (d): TT-01 bám VAN-SP-10/hãm (bảng 6.1 đã duyệt).

## 4. Điều chưa đạt và vì sao

1. **Mục tiêu 0 lá số có mảng trống: chưa đạt (17/28).** Cả 17 lá số còn trống là mảng **không có đoạn năm nào** trước bước chọn việc (chỉ có câu nền NAM-MANG-01 / NAM-TT-01 / NAM-TH-01, là câu dẫn), nên không mẫu việc nào cứu được:
   - Tài chính (14 lá số Canh): Lưu Thái Tuế ở Tài Bạch (Mùi). Đoạn năm của cung này (NAM-TT-02 Kình Dương của năm, VAN-CT chính tinh tại Lưu Thái Tuế) thuộc lớp `thai-tue`, bộ ghép chỉ kéo đoạn lớp `cung-goc` sang mảng (`van-nam.ts` dòng 414), nên mảng chỉ còn câu dẫn.
   - Sự nghiệp (5 lá số: Canh 1970 nữ 5/5h, 1980 nam 4/9h, 1990 nữ 12/1h, 2000 nữ 5/5h, 2010 nam 4/9h): Quan Lộc không có yếu tố năm nào; đoạn nền QL-* (bộ 12 cung bản 1) không có `maNghienCuu` nên không mẫu nào bám hợp lệ.
   - Đề xuất (Minh quyết, Tùng làm): (a) khi cung của mảng là Lưu Thái Tuế/tiểu hạn, cho bộ ghép kéo cả đoạn lớp `thai-tue`/`tieu-han` (trừ câu dẫn) vào mảng: mẫu TC-24, CV-22 bám NAM-TT-02 đã có sẵn, nên phần lớn 14 lá số Tài chính sẽ có đoạn (cần đo lại sau khi sửa); (b) mảng không có yếu tố năm: cho đoạn nền bộ 12 cung mang `maNghienCuu` (bản 2) để bám mẫu "phát huy", hoặc chấp nhận mảng chỉ có câu nền "năm nay đi theo nền" (QUY-TAC NAM-MANG mục 6). Không tự viết đoạn năm giả cho cung không có yếu tố năm.
2. **TT-01 trong `src/.../viec-nen-lam.json` chưa có `VAN-SP-10/hãm`** (bảng 6.1 có, commit 9cfa15f). Không sửa mẫu cũ theo lời dặn; Tùng cần đồng bộ khi nạp, nếu không đoạn NAM-MANG-06-PHU bị loại ở 4/4 lá số (thấy ở `sau.md`, mục Thiếu (d)).
3. **Đoạn Phu Thê để ở tệp nháp, chưa chèn vào `doan-mau.json`**: test `tests/van-nam-hoi-quy.test.cjs` dòng 171 đếm cứng 88 đoạn nên hook pre-commit chặn. Khi nạp: chèn sau `NAM-LUU-05-PHU` trong `doan-mau.json` và `van-nam-2027.json`, đổi 88 → 89.
4. Phần tổng quan còn thiếu (d) chủ yếu ở cung Phúc Đức, Điền Trạch, Tật Ách (chủ đề gia-dao, suc-khoe) và các đoạn chính tinh VAN-CT-* (VAN-CT-VCD-01 18 lần). Không thuộc mục tiêu 4 mảng; để vòng sau.

## 5. Điểm cần Thư chú ý

1. **Dạng (ii) phát huy** (tongHop): CV-14, CV-16, CV-17, TC-08, TC-17, TC-20, TC-21, TC-23, TT-09, TT-10, TT-13, TT-14, TT-17, TT-18. Nhất là NAM-LUU-03 (quý nhân) sang tình cảm (TT-09 gặp người thân/bạn bè cả hai quý trọng; TT-18 hỏi ý người từng trải) và tài chính (TC-08 hỏi người có chuyên môn): xin Thư xác nhận không phải "suy từ hình tượng sao".
2. **SK-05** bám NAM-LUU-02 dạng (iii) (di chuyển, đổi lịch → giữ giờ ngủ): chỉ nếp sống, không bộ phận, bệnh.
3. **Giới hạn tài chính**: TC-13, TC-21 có "tích góp", "chi tiêu gia đình" theo chữ NAM-HOA-04; người đọc tự đặt mức. TC-11, TC-22, TC-24 chỉ là ghi điều khoản, hỏi rõ, xin thêm thời gian; không bảo nhận/từ chối, vay, trả.
4. **TT-07, TT-19** (giấy tờ chung hai người, bám VAN-SP-06/thận trọng): dùng cùng điều kiện TC-07; câu "trước khi ký hay gửi" không khuyên ký hay không ký.
5. **Tuổi Canh** (NAM-HOA-08-KY-LOC-CANH → CV-11, CV-20, TC-12, TC-22, TT-12): câu việc không nhắc Trung Châu, không nhắc bảng Tứ hóa.
6. NAM-LUU-02 trong `doan-mau.json` viết "Thiên Mã, Đà La **và Văn Khúc** của năm" nhưng điều kiện máy chỉ xét Mã + Đà (L. Văn Khúc luôn ở Tỵ cùng hai sao này năm 2027 nên câu vẫn đúng); ghi để Thư biết, không sửa.
7. Một số câu mở bằng cụm điều kiện ("Khi…", "Trước khi…", "Mỗi tháng…") rồi mới tới động từ, giống CV-01, CV-06 đã duyệt.

## 6. Sửa theo phiếu Thư (L-2381a4)

- TC-21: viết lại thành một việc (để riêng phần tích góp từ khoản thu thêm, khác TC-03 là thu nhập thường kỳ); cách đo đếm số khoản đã để riêng; bỏ "của gia đình".
- TT-18: "người lớn bạn tin" → "người từng trải mà bạn tin".
- Nhãn dạng: TC-13 → ii (`maPhatHuy: ["NAM-HOA-04"]`); CV-12, CV-19, TC-14 → iii. Câu giữ nguyên.

## 7. Lọc theo tuổi

Minh nhận đề xuất của Thư (phiếu mục 5). Mẫu có ký giấy tờ chung, tiền chung/gia đình hoặc gửi đề xuất lên cấp trên mang `"tuoiTu": 18`: bộ chọn mẫu bỏ qua khi người đọc dưới 18 tuổi trong năm xem (Bảo/Tùng làm phần code).

- Bộ mới (`viec-nen-lam-bo-sung.json`, đã thêm trường): CV-14 (gửi cấp trên), TC-10 (thỏa thuận có tiền giữa hai bên), TC-13 (chi tiêu gia đình), TC-22 (khoản tiền giữa hai bên), TT-07 (giấy tờ chung/gia đình), TT-11 (việc chung có tiền, việc nhà), TT-19 (ký giấy tờ chung).
- Bộ cũ (`src/lib/luan-giai/ai/quy-tac-van/viec-nen-lam.json`, chưa sửa, Tùng thêm khi nạp): CV-08 (hợp đồng, văn bản gửi ra ngoài), TC-04 (tiền chung, cho mượn, góp vốn), TC-05 (ký, chuyển tiền giao dịch lớn), GD-02 (tiền với anh chị em), GD-04 (giấy tờ nhà ở).
- Rà và không gắn: các mẫu còn lại hợp mọi tuổi (học, ghi chép, nếp ngủ, trò chuyện); TC-11, TC-17, TC-19 chỉ là ghi/bàn chuyện tiền của chính người đọc.

## Tự kiểm (mục 8 khung)

- Cổng an toàn: 0/52 từ (52 mục `tuCam`) trong `tu-cam.json` ở 49 câu việc, cách đo và đoạn Phu Thê (lọc bằng máy); không giải hạn, vật phẩm, chọn ngày; không lời khuyên tài chính, y tế, pháp lý cụ thể; đoạn Phu Thê không phán cố định.
- (b) đoạn Phu Thê: mỗi ý truy về VAN-SP-10 (c) và NAM-MANG-04; điều kiện máy khớp đúng 4 lá số (kiểm từng lá số bằng bộ ghép).
- (c) Toàn Thư, Khảo Luận · Tam hợp phái Việt · đánh dấu tổng hợp.
- (d) 49/49 câu ≤ 45 chữ, một việc, có cách đo, hạn 1–3 tháng; mã bám nằm trong `maNghienCuu`/`quyTacId` của đoạn; vế khóa bằng `dieuKien`.
