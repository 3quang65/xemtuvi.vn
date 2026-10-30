# Phiếu kiểm duyệt: rà soát kho đoạn luận theo phản hồi diễn tập #1, #8, #10

Việc L-84568a. Người chấm: Thư (kiem-duyet), 30/10/2026. Người viết: Hạnh.
Phạm vi: `git diff 164b2b6..0c77d0c` trên `ai/quy-tac.json`, `doan-mau.json`, `menh-chinh-tinh.json`, `ai/quy-tac-van/` (323 đoạn đổi, khớp số Hạnh báo).
Danh sách kiểm: `cskh/phan-hoi-ban-thu_v1.md` mục 2, các mục #1, #8, #10. Chấm theo skill `kiem-duyet-noi-dung`, ngưỡng của việc này: mỗi tiêu chí ≥ 8.

## 1. Kết luận

| Tiêu chí | Điểm | Ngưỡng | Kết quả |
|---|---|---|---|
| Giọng | **7** | ≥ 8 | Trượt |
| An toàn | **9** | ≥ 8 | Đạt |

**Chung: TRƯỢT** (Giọng dưới ngưỡng). Có **3 lỗi phải sửa** (P0 1, P1 2) và 3 lỗi nên sửa (P2).

Phần làm tốt: bỏ được ba đuôi "Độ sáng tốt/trung bình/kém…" ở cả 126 câu sao chính; mỗi sao × độ sáng × cung có gợi ý hành động riêng và cụ thể (đúng #1). Mệnh và Phu Thê đã chuyển sang "bạn có xu hướng" (đúng #8). Câu mời đối chiếu ở Mệnh/Phu Thê chỉ hiện 1 lần mỗi bài (đã kiểm). 9 từ nặng được gỡ hết.

## 2. Bằng chứng đã chạy

- Quét từ nặng `bash /tmp/hanh/quet.sh` trên cây làm việc (khớp 0c77d0c, không có thay đổi chưa commit): **36 từ, TỔNG 0**.
- Quét thêm của Thư (trường `noiDung`, `cau`, 5 file): giải hạn, hóa giải, bùa, cúng, lễ, cầu an, phong thủy, kiêng, định mệnh, số phận, nguy, tai, họa, hại, thất bại, tổn, khắc, hung, xấu, đau, sảy, vô sinh, nghiệp chướng/báo oán/tiền kiếp: **0**. Các kết quả "hạn", "mất", "nặng", "chắc", "sẽ" đã đọc tay: đều là nghĩa trung tính (hạn chót, giới hạn, tiểu hạn, sức nặng lời nói, bước chắc).
- Lấy mẫu **47 đoạn** sau sửa, trải đều: Vận năm 2027 7 (Tật Ách 5), Vận 10 năm 4 (Phụ Mẫu, Tật Ách, Nô Bộc, Thiên Lương hãm), Tài Bạch 8 (4 ở chuyên đề Mệnh, 4 ở Quan Lộc), Quan Lộc 7, Phu Thê 8, Mệnh 5, doan-mau 5, menh-chinh-tinh 4. Cộng thêm đọc toàn bộ 42 câu `-HAM`.
- Sinh thật 480 bài Vận năm 2027 (sinh 1975–2004, 4 tháng × 4 giờ) và 40 lá số × 4 chuyên đề, đếm câu nhắc bác sĩ và câu mời đối chiếu mỗi bài (script `/tmp/thu/vn.cjs`).

| Đếm trên bài sinh thật | Kết quả |
|---|---|
| Câu mời đối chiếu / bài: Mệnh, Phu Thê | tối đa 1 (đạt) |
| Câu nhắc bác sĩ / bài: Vận 10 năm | tối đa 1 (đạt) |
| Câu nhắc bác sĩ / bài: Vận năm 2027 | **2–6 lần; 480/480 bài ≥ 2; 264 bài ≥ 3** (không đạt) |

## 3. Lỗi phải sửa

| # | Mức | Tiêu chí | Vị trí (khóa JSON) | Mã | Lỗi | Đề xuất cho Hạnh |
|---|---|---|---|---|---|---|
| 1 | **P0** | Giọng (#1 không lặp ý, #10) | `van-nam-2027.json`: `NAM-TT-01-TAT`, `NAM-TH-01-TAT`, `NAM-THANG-03-TAT`, `NAM-MANG-01-TAT-NEN`, `NAM-MANG-05-NHIP` | #10 | Câu "Khi có dấu hiệu bất thường về sức khỏe, bạn nên hỏi ý kiến bác sĩ." lặp 2–6 lần mỗi bài, có bài 2 đoạn liền nhau trong mục Sức khỏe cùng kết bằng câu này. Báo cáo ghi "mỗi bài chỉ hiện một lần" là chưa đúng: bộ ghép Vận năm (`van-nam.ts`) không gọi `boCauLap`. Lặp nhiều lần lời nhắc bác sĩ lại làm khách lo, ngược mục đích #10. | Chỉ giữ câu nhắc bác sĩ ở `NAM-MANG-05-NHIP` (đoạn luôn có trong mục Sức khỏe), bỏ ở 4 đoạn còn lại. Nếu muốn giữ ở nhiều đoạn thì đề nghị Minh giao Bảo gắn `boCauLap` cho Vận năm. Nghiệm thu: chạy lại đếm trên ≥ 100 bài, mỗi bài đúng 1 câu. |
| 2 | P1 | Giọng (#1) | `quy-tac.json`: `ML-S01-C1`…`ML-S14-C1` và `ML-S01-C2`…`ML-S14-C2` (chuyên đề Mệnh, sao ở Thiên Di và Quan Lộc) | #1, câu khuôn (skill mục 4) | 28 câu vẫn kết bằng "góp thêm sắc thái cho chuyên đề Mệnh" và không có gợi ý hành động, trong khi 14 câu Tài Bạch cùng chuyên đề đã có. Cùng một bài Mệnh lẫn hai giọng. Báo cáo ghi đã bỏ đuôi này. | Viết lại theo mẫu đã làm cho Tài Bạch: Thiên Di thì "Khi ra ngoài, gặp người mới, …", Quan Lộc thì "Trong công việc, …", mỗi sao một gợi ý. Nghiệm thu: `grep -c "góp thêm sắc thái"` = 0. |
| 3 | P1 | Giọng (khẳng định cứng) | `doan-mau.json` Quan Lộc: `QUAN-TV-01`, `QUAN-TV-03`, `QUAN-LT-01`, `QUAN-LT-02`, `QUAN-TD-01`, `QUAN-VK-01`, `QUAN-VK-03`, `QUAN-TCO-01`, `QUAN-TCO-03`, `QUAN-TP-01`, `QUAN-THL-01`, `QUAN-CM-01`, `QUAN-TL-01`, `QUAN-TS-01`, `QUAN-PQ-01`, `QUAN-PQ-03` | #8 | Hứa hẹn chắc chắn: "công danh hiển hách, giàu sang và địa vị đi cùng nhau", "phú quý song toàn", "hiển đạt ở ngành kỷ luật", "rất nổi tiếng nếu theo y khoa". Không đáng sợ nhưng là khẳng định cứng và hứa giàu, sai định vị "hiểu mình, định hướng". | Phần lời xemtuvi.vn viết "có xu hướng/thuận cho…"; câu sách gốc giữ ở dạng trích ("TT cho rằng…"). Nghiệm thu: 16 khóa trên đều có "xu hướng", "thuận" hoặc "sách cho rằng" trước nhận định giàu sang/hiển đạt. |

## 4. Lỗi nên sửa (P2)

| # | Vị trí | Lỗi | Đề xuất |
|---|---|---|---|
| 4 | `quy-tac.json` `PT-S03-TOT`, `PT-S03-BINH`, `PT-S03-HAM` | Lặp từ: "trong tình cảm, bạn có xu hướng ấm áp, hào phóng trong tình cảm." | Bỏ "trong tình cảm" ở cuối. |
| 5 | `van-10-nam.json` `VAN-CT-TL-02` | "tài chính dễ hao, sức bền giảm" còn là khẳng định cứng về sức khỏe (#10). | "sức bền có xu hướng giảm, dễ thấy mệt khi dồn việc; nên giữ…" |
| 6 | `menh-chinh-tinh.json` `MENH-TL-01`; `quy-tac.json` 126 câu sao ở tam phương | "Có khả năng \"giải\" khó khăn" (chữ "giải" trong ngoặc dễ gợi "giải hạn"); tiền tố "bổ sung xu hướng" lặp ở 126 câu, vẫn đọc ra là máy ghép. | "biết gỡ khó khăn"; tiền tố nên đổi theo cung ("Từ cung Tài Bạch, …"). |

## 5. Nhận xét Đúng (không chấm, chuyển Hạnh xem)

- Câu đầu của các quy tắc `QL-Sxx-HAM` (và tương tự ở Mệnh, Phu Thê) dùng chung với bản sao sáng, ví dụ `QL-S03-HAM` "Thái Dương tại Quan Lộc: hợp môi trường công khai, có tầm ảnh hưởng, dễ được ghi nhận" cho Thái Dương **hãm**. Gợi ý hành động đã đổi theo độ sáng, nhưng câu nhận định vẫn tả sao hãm như sao sáng (skill mục 4, dòng 1). Lỗi có từ trước đợt này, nên xử lý ở đợt sau.
- `doan-mau.json` Phu Thê `PHU-TA-01` "Người nam thường nể vợ…; người nữ thường gặp người chồng hiền": đúng sách, nhưng nên viết trung tính giới khi khách nữ đọc.

## 6. Ngoài phạm vi, ghi nhận

- `tom-tat-mien-phi.json` còn khẳng định ("bạn chững chạc…"): Hạnh đã tự nêu, đồng ý rà #8 ở việc sau.
- Chấm lại sau khi Hạnh sửa #1–#3: Thư chạy lại `/tmp/thu/vn.cjs` và grep ở mục 2.

## 7. Chấm lại vòng 2 (commit e34d441, Thư, 30/10/2026)

**Kết luận: ĐẠT.** Giọng **8**/10, An toàn **10**/10 (cả hai ≥ 8).

| Mục phiếu | Kiểm đo của Thư | Kết quả |
|---|---|---|
| P0 câu nhắc bác sĩ trong Vận năm | `node scripts/luan-giai/dem-cau-van-nam.cjs` và `/tmp/thu/vn.cjs`: 480 bài, **480/480 đúng 1 câu**; Mệnh, Phu Thê, Quan Lộc, Vận 10 năm 0 câu; `docs/luan-giai/van-nam/doan-mau.json` trùng byte với `van-nam-2027.json` | Đã sửa |
| P1 28 câu `ML-S01..14-C1/C2` | `grep -c "góp thêm sắc thái"` = 0; đọc mẫu `ML-S03-C1`, `ML-S09-C1`, `ML-S06-C2`, `ML-S13-C2`: có gợi ý riêng theo cung ("Khi ra ngoài…", "Trong công việc…") | Đã sửa |
| P1 16 đoạn Quan Lộc `doan-mau.json` | phú quý, giàu sang, hiển hách, song toàn, lưỡng toàn, rất nổi tiếng, hiển đạt: đều 0; đọc `QUAN-TV-01`, `QUAN-TCO-01`, `QUAN-TL-01`, `QUAN-LT-01`, `QUAN-PQ-03`: có "có xu hướng", câu sách viết "TT cho rằng…" | Đã sửa |
| P2 #4 `PT-S03-*` | lặp "trong tình cảm" = 0 | Đã sửa |
| P2 #5 `VAN-CT-TL-02` | "sức bền có xu hướng giảm, dễ thấy mệt khi dồn việc" | Đã sửa |
| P2 #6 | "Biết gỡ khó khăn"; "bổ sung xu hướng" = 0 | Đã sửa |
| Quét từ nặng | `/tmp/hanh/quet.sh`: TỔNG 0 | Sạch |

**Câu hỏi: Vận 10 năm không còn câu nhắc bác sĩ, có đạt An toàn theo #10 không?** Thư quyết: **Đạt, không cần thêm lại.** Lý do:
1. Mục #10 yêu cầu "nhắc bác sĩ **khi cần**", tức khi câu nói tới dấu hiệu bệnh hoặc rủi ro sức khỏe cụ thể. Các đoạn Vận 10 năm còn lại không có câu như vậy: `VAN-CUNG-08` chỉ nói ưu tiên nhịp sống và khuyên "khám sức khỏe định kỳ" (đây đã là lời khuyên đi khám); `VAN-CT-TL-02` nói "có xu hướng", "dễ thấy mệt khi dồn việc", là mức mệt sinh hoạt, không phải triệu chứng.
2. Bài Vận năm 2027 dùng lại đoạn đại vận. Thêm câu bác sĩ vào `van-10-nam.json` sẽ làm Vận năm quay lại 2 câu/bài, tức lỗi P0 vòng 1.
3. Điều kiện giữ: sau này đoạn Vận 10 năm nào nói tới dấu hiệu sức khỏe cụ thể (đau, bệnh, mất ngủ kéo dài…) thì phải có lời khuyên đi khám **trong chính đoạn đó**. Nếu khi ấy Vận năm lặp lại 2 câu thì xử lý bằng `boCauLap` cho Vận năm (Bảo), không bỏ lời khuyên.

**Còn lại, không chặn (P2, đợt sau):**
- Tiền tố mới "soi sang thêm nét" (42 câu) và "tiếp thêm nét" (84 câu) vẫn là tiền tố chung. Có 42 câu ghép thành câu không xuôi, ví dụ `QL-S04-C4` "soi sang thêm nét hợp việc cần kỷ luật…" (nét + "hợp…"). Đề xuất: khi phần sau bắt đầu bằng "hợp/mạnh về/có phong thái" thì bỏ chữ "nét" ("tiếp thêm thế mạnh: hợp việc…"). Đây là lý do Giọng 8, chưa lên 9.
- `menh-chinh-tinh.json` dòng 444 "Thiên Lương ở Ngọ: đường công danh trong sạch, hiển đạt." vẫn khẳng định cứng (câu chưa sửa ở vòng 1): nên viết "có xu hướng…".
- Mục 5 (câu đầu quy tắc `-HAM`, `PHU-TA-01`) vẫn để đợt sau, như Hạnh đã ghi.
