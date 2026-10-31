# Phiếu kiểm duyệt: trang /phuong-phap (Phương pháp & nguồn)

Việc: L-1d030b (Minh giao) · Người chấm: Thư (kiem-duyet) · Ngày: 31/10/2026
Bản chấm: `content/phuong-phap.md` tại commit 4ef5ff1 (nhánh minh-l-1d030b), 44 dòng.
Nguồn đối chiếu: `docs/nghien-cuu/luan-giai-12-cung.md` (đầu tệp, "Hạn chế đã biết", 0.1, 0.8, 0.10), `scripts/luan-giai/dem-quy-tac.py`, `src/lib/luan-giai/ai/index.ts` (dòng 1–3, 95–96, 383–425), `loc.ts`, `quy-tac.json`, `quy-tac-khung.json`, `tu-cam.json`, `src/app/tro-giup/page.tsx`, skill kiem-duyet-noi-dung mục 2.

## 1. Kết luận

**KHÔNG ĐẠT.** Ngưỡng của việc: mọi tiêu chí ≥ 8 và An toàn = 10. Có 2 tiêu chí chưa đạt: Đúng 6 và An toàn 9.

Trang tốt về khung và giọng. Lỗi chính: một số câu khẳng định công khai nói quá so với thực tế, gồm số 948 quy tắc gắn với bài luận khách đọc, sách chưa đọc bản gốc vẫn ghi là nguồn, cách tính nguồn độc lập, và hai câu ngầm cho rằng có người hoặc chuyên gia kiểm duyệt (thực tế là quy trình AI, chưa có chuyên gia nào duyệt).

## 2. Bảng điểm

| Tiêu chí | Điểm | Ngưỡng việc | Lý do ngắn |
|---|---|---|---|
| Đúng | **6** | ≥ 8 | 948 quy tắc, có mã, có nguồn: đúng (`dem-quy-tac.py`: 948/948 có nguồn, 60 cờ ⚑1nguồn, 0 chưa nguồn). Phương pháp 6 bước, Tuần Triệt hai cung, 5 bậc độ sáng, Trung Châu/Phi tinh: khớp PP-01, PP-10, PHAI-03. Sai hoặc nói quá ở 5 chỗ: lỗi #1, #3, #4, #5, #6 |
| Sâu | 8 | ≥ 8 | Đủ 5 phần (trường phái, nguồn, quy trình, không làm, giới hạn); có nêu giới hạn giờ sinh và việc chưa thẩm định. Chưa nói phạm vi chuyên đề đang có (lỗi #1) |
| Giọng | 9 | ≥ 8 | Nghiêm túc, gần gũi, đúng định vị "hiểu mình, định hướng". Còn từ nội bộ "nhóm" và câu Hán Việt hơi cứng (lỗi #8, #9) |
| An toàn | **9** | = 10 | Không từ mê tín, không gây sợ, có câu "do hệ thống tạo tự động", có câu "không phải khoa học dự báo", không lộ dữ liệu khách. Trừ 1 điểm vì hai câu ngầm cho rằng có người hoặc chuyên gia nội bộ kiểm duyệt (lỗi #2, #7). Đây là lỗi minh bạch về AI và nguy cơ khách hiểu sai trên trang cam kết công khai |

## 3. Danh sách lỗi

Mức: **P0** = chặn lên site; P1 = phải sửa trước 16/11; P2 = nên sửa.

| # | Dòng | Mức | Tiêu chí | Câu hiện tại (trích) | Lý do (bằng chứng) | Câu sửa đề xuất |
|---|---|---|---|---|---|---|
| 1 | 14 (đọc cùng 27) | **P0** | Đúng | "Bộ quy tắc luận giải 12 cung có 948 quy tắc, quy tắc nào cũng có mã riêng và ghi nguồn." | Đúng với tài liệu nghiên cứu. Nhưng bài luận khách đọc lấy câu từ `quy-tac.json` (363 quy tắc, chỉ 42 có `maNghienCuu`) và `quy-tac-khung.json` (665 quy tắc, đều có `maNghienCuu`), cho 5 chuyên đề (index.ts dòng 1). Đặt cạnh bước 2 ("chỉ dùng quy tắc khớp"), khách sẽ hiểu bài của mình dùng 948 quy tắc đã kiểm cho đủ 12 cung | "Nền tảng là bộ quy tắc nghiên cứu cho 12 cung, gồm 948 quy tắc; mỗi quy tắc có mã riêng và ghi nguồn hoặc lý do chọn. Mỗi câu trong bài luận trên site gắn với một quy tắc có mã và ghi sách nguồn. Hiện site luận các chuyên đề Mệnh, Quan Lộc, Phu Thê, Tài Bạch, Điền Trạch và Vận năm." |
| 2 | 29 | **P0** | An toàn | "phòng kiểm duyệt chấm bài mẫu theo bốn tiêu chí…" | "Phòng kiểm duyệt" khiến khách nghĩ có nhân viên là người. Thực tế việc chấm do agent AI làm theo bộ tiêu chí. Trang đã ghi bài viết do hệ thống tạo (dòng 28) thì phần kiểm duyệt cũng phải minh bạch như vậy | "**Kiểm duyệt**: trước khi mở bán một loại bài, chúng tôi chấm một loạt bài mẫu theo bốn tiêu chí (Đúng, Sâu, Giọng văn, An toàn) bằng bộ tiêu chí viết sẵn, có công cụ AI hỗ trợ. Chỉ mở bán khi An toàn đạt điểm tuyệt đối và các tiêu chí còn lại đạt ngưỡng; chưa đạt thì trả về sửa, không nâng điểm cho qua." |
| 3 | 22 | **P0** | Đúng | "Sách Việt chép lại câu của *Toàn Thư* không được tính là nguồn độc lập." | Mục "Hạn chế đã biết" ghi rõ: "*Tân Biên* và *Khảo Luận* chép lại *Toàn Thư* ở nhiều câu, nên '2 nguồn' không phải lúc nào cũng độc lập". Nghĩa là bộ đếm hiện vẫn có chỗ tính thành 2 nguồn. Câu trên trang hứa một việc chưa làm | "Một số sách Việt chép lại câu của *Toàn Thư*, nên có quy tắc ghi hai nguồn nhưng thực chất chung một gốc; chúng tôi đang rà lại các quy tắc này." |
| 4 | 17 | P1 | Đúng | "*Tử Vi Đẩu Số Tân Biên*, Vân Đằng Thái Thứ Lang." (nằm trong "Nguồn chính") | Mục 0.10 ghi TB "Chưa đối chiếu bản in", và mục 0 ghi các mã sách Việt "ghi theo nội dung thường được các nguồn khác dẫn lại". TB lại là nguồn dùng nhiều thứ hai (610 quy tắc). Mục "Hạn chế đã biết" ghi ngược lại là đã đọc trực tiếp; tài liệu nguồn tự mâu thuẫn, Đức/Hạnh cần chốt. Chừng nào chưa chốt thì trang không được ngầm nói là đã đọc | "*Tử Vi Đẩu Số Tân Biên*, Vân Đằng Thái Thứ Lang (chưa đối chiếu bản in; trích theo bản chép lại)." Nếu Đức xác nhận đã đọc bản quét thì bỏ ngoặc và sửa luôn mục 0.10 |
| 5 | 20 | P1 | Đúng | "Tham khảo: *Tử Vi Chỉ Nam* (Song An Đỗ Văn Lưu), tài liệu Trung Châu của Vương Đình Chi, bài nghiên cứu có ghi tác giả." | Mục 0.10: CN "Chưa đối chiếu (không tìm thấy bản quét)"; TC "Chưa đối chiếu bản in; mô tả phái theo WC3" (Wikipedia). Nguồn web có Wikipedia, không có tác giả cụ thể, nên "bài nghiên cứu có ghi tác giả" là sai | "Tham khảo thêm (chưa đọc bản gốc, trích qua tài liệu khác): *Tử Vi Chỉ Nam* (Song An Đỗ Văn Lưu), sách của Vương Đình Chi về phái Trung Châu; cùng một số bài viết trên web, có ghi đường dẫn." |
| 6 | 10 | P1 | Đúng | "**Khi các sách nói khác nhau**, bài luận nêu cả hai cách hiểu và ghi cách xemtuvi.vn chọn." | Viết như thể mọi bài đều làm vậy. Thực tế: PP-12 và các mục TRANH là quy ước; ghi chú trường phái mới hiện trong Vận năm (`VanNamBai.tsx`, `ghiChuTruongPhai`). Chưa có bằng chứng các chuyên đề 12 cung đều làm | "Ở những điểm các sách nói khác nhau mà chúng tôi đã ghi nhận, bài luận theo cách xemtuvi.vn chọn và ghi chú trường phái khi điểm đó ảnh hưởng tới bài của bạn." |
| 7 | 42 | P1 | An toàn | "chưa được chuyên gia bên ngoài thẩm định" | Đầu tài liệu nguồn ghi "**Chưa qua chuyên gia duyệt**", tức là không có chuyên gia nào, kể cả trong nhóm. Chữ "bên ngoài" ngầm nói có chuyên gia nội bộ, đi ngược cam kết "không giả danh chuyên gia" ở dòng 36 | "Bộ quy tắc đang hoàn thiện, chưa được chuyên gia Tử Vi thẩm định; một số sách chưa đối chiếu được bản in. Trang này sẽ cập nhật khi có thay đổi." |
| 8 | 16 | P2 | Giọng | "tương truyền của Hy Di Trần Đoàn (bản Hán văn, nhóm tự dịch)" | Thiếu động từ ("tương truyền của"); "nhóm" là từ nội bộ, khách không biết nhóm nào | "*Tử Vi Đẩu Số Toàn Thư*, tương truyền do Hy Di Trần Đoàn soạn (chúng tôi đọc bản Hán văn và tự dịch)." |
| 9 | 28 | P2 | Đúng | "Bộ lọc chặn cách nói gây sợ hoặc phán định mệnh." | `loc.ts` lọc theo danh sách cụm từ cố định (`tu-cam.json`, 52 cụm), không hiểu nghĩa câu. "Chặn" là hứa tuyệt đối | "Bộ lọc tự động loại hoặc thay các cụm từ gây sợ, phán định mệnh; phần còn lại được rà ở bước kiểm duyệt." |

Số lỗi: **9** (P0: 3 · P1: 4 · P2: 2).

## 4. Câu đã kiểm, đúng thực tế (không cần sửa)

- Dòng 7–9: phái Việt, Tuần Triệt hai cung, 5 bậc độ sáng, tam hợp 6 bước, không kết luận từ một sao lẻ, Trung Châu chỉ tham khảo, chưa dùng Phi tinh. Khớp CHUNG-PP-01, PP-10, PHAI-02, PHAI-03.
- Dòng 14: số 948, 100% có nguồn, mã không trùng (`dem-quy-tac.py`). Chỉ sai cách đặt câu (lỗi #1).
- Dòng 22, vế đầu: quy tắc một nguồn có cờ ⚑1nguồn, hiện có 60 quy tắc.
- Dòng 26: test an sao đối chiếu tham chiếu có (`tests/research-cases.test.cjs`, `engine.test.cjs`); pre-commit chạy `npm test`.
- Dòng 27: đường AI bỏ câu không có mã hợp lệ (`kiemTraMaSauViet`); đường mặc định "stub" ghép thẳng từ quy tắc có mã.
- Dòng 28: câu "do hệ thống xemtuvi.vn tạo tự động" khớp `GHI_CHU` (index.ts dòng 95–96).
- Dòng 30: trang Trợ giúp có phần "Gửi báo lỗi hoặc góp ý" (`src/app/tro-giup/page.tsx` dòng 36).
- Dòng 34–36, 40–41: không mê tín, không gây sợ, có câu "không phải khoa học dự báo", không thay lời khuyên y tế, pháp lý, tài chính. Ý "đã lược số con, số lần kết hôn, tuổi thọ" khớp "Hạn chế đã biết".

## 5. Việc trả về

- **Minh** (người viết trang): sửa lỗi #1–#9 theo câu đề xuất hoặc câu tương đương có cùng mức chính xác, rồi nộp lại Thư chấm lần 2. Nghiệm thu: không còn P0/P1; Đúng ≥ 8; An toàn = 10.
- **Đức/Hạnh** (tài liệu nguồn, không chặn trang): chốt TB "đã đọc bản quét" hay "chưa đối chiếu", vì mục "Hạn chế đã biết" và mục 0.10 đang ghi ngược nhau. Câu ở dòng 17 phụ thuộc kết quả này.

## Lần 2 (commit 8dd9df0, 31/10/2026)

**KHÔNG ĐẠT, còn 1 lỗi P1.** Đúng 7 · Sâu 8 · Giọng 9 · An toàn **10**. 8/9 lỗi lần 1 đã sửa đúng câu đề xuất. Các câu Minh rút gọn thêm (dòng 7, 28, 36–38, 42) không làm sai nghĩa, không thêm lời hứa mới.

| Lỗi lần 1 | Kết quả |
|---|---|
| #1 (dòng 14) | Sửa một phần: vế "948 quy tắc… nguồn hoặc lý do chọn" và phạm vi chuyên đề đã đúng; vế "Mỗi câu… ghi sách nguồn" vẫn nói quá, thành lỗi #10 dưới đây |
| #2, #3, #4, #5, #6, #7, #8, #9 | Đã sửa (dòng 31, 24, 19, 22, 10, 44, 18, 30) |

| # | Dòng | Mức | Tiêu chí | Câu hiện tại | Lý do (bằng chứng) | Câu sửa đề xuất |
|---|---|---|---|---|---|---|
| 10 | 14 | P1 | Đúng | "Mỗi câu trong bài luận trên site gắn với một quy tắc có mã và ghi sách nguồn." | Có số liệu kiểm: `quy-tac.json` 363/363 và `quy-tac-khung.json` 665/665 có `nguon`, `van-10-nam*.json`, `van-nam-2027.json` 260/260 có `nguon`. Nhưng bài Vận năm còn câu không lấy từ quy tắc có sách nguồn: `quy-tac-van/viec-nen-lam.json` 104/104 câu gợi ý việc nên làm không có trường `nguon` (chỉ có `maHuong` trỏ tới mã quy tắc); câu nền tháng `nen-cung-thang.json` giữ mã ở `_nguon`, không ghi sách; câu dẫn (`cauDan`) hiển thị không kèm căn cứ (`VanNamBai.tsx` dòng 13). Chữ "mỗi câu" vì thế sai | "Mỗi nhận định trong bài luận trên site gắn với một quy tắc có mã và ghi nguồn; câu dẫn và gợi ý việc nên làm được viết dựa trên các quy tắc đó." |

Nghiệm thu lần 3: sửa dòng 14 theo câu trên (hoặc câu cùng mức chính xác) thì Đúng lên 8. Lúc đó trang **Đạt** (Đúng 8, Sâu 8, Giọng 9, An toàn 10), không cần chấm lại toàn trang, Thư chỉ soát đúng dòng 14.
