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
