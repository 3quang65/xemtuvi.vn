# Rà 12 dòng nguồn "Trung Châu phái" trong tóm tắt miễn phí

Người rà: Thư (kiem-duyet) · Việc L-2381a4 việc 3 (cha L-d94399) · 30/10/2026
Đầu vào: `src/lib/luan-giai/tom-tat-mien-phi.json` (khối `thanCu`, dòng 864–1036), `src/lib/luan-giai/index.ts` dòng 133–140, `docs/nghien-cuu/luan-giai-12-cung.md` (MENH-YN-03/05/06/07/08, PHU-TRANH-07; TC = WM8). Đối chiếu lỗi 1 phiếu `docs/luan-giai/kiem-duyet-van-nam.md` (Q1).

## Phép kiểm
Lỗi Q1 xảy ra vì câu ra khách phụ thuộc **Tứ hóa theo can năm** (Thái Âm Kỵ tuổi Canh) và gắn nhãn Trung Châu, trong khi bảng Trung Châu cho can Canh khác bảng Việt (SPEC 10.4). Một dòng chỉ cùng lỗi khi câu "y" hoặc điều kiện chọn câu dùng Hóa Lộc/Quyền/Khoa/Kỵ hoặc vị trí sao lấy theo bảng Trung Châu.

Cả 12 dòng nằm trong khối `thanCu` (Thân cư cung nào). Code chọn câu (`index.ts` dòng 133–140):
- Vị trí Thân chỉ phụ thuộc tháng và giờ sinh (MENH-YN-05), **không phụ thuộc can năm** và giống nhau giữa mọi phái.
- Bản `kem` chỉ bật khi chính tinh ở cung Thân hãm hoặc có từ 2 sát tinh trở lên; **không xét Tứ hóa**.
- Không câu "y" nào nhắc Hóa Lộc/Quyền/Khoa/Kỵ hay tên sao.

## Bảng 12 dòng

| Dòng | Cung / mục | Mã | Kết luận | Lý do |
|---|---|---|---|---|
| 873 | Thân cư Mệnh (thường) | MENH-YN-05, 06, 07 | Chỉ ghi nguồn | Ý Mệnh tiên thiên, Thân hậu thiên (YN-06/07 có TC/WM8 làm nguồn); không dính Tứ hóa hay can năm. |
| 888 | Thân cư Mệnh (kém) | MENH-YN-05, 06, 07, CHUNG-PP-05, CHUNG-SP-02 | Chỉ ghi nguồn | Như dòng 873; điều kiện "kém" không có Tứ hóa. Ghi chú: code loại Mệnh khỏi nhánh kém (`than.ten !== 'Mệnh'`) nên bản này không bao giờ ra khách. |
| 902 | Thân cư Phu Thê (thường) | MENH-YN-08, PHU-TRANH-07 | Chỉ ghi nguồn | Ý "chịu ảnh hưởng của phối ngẫu, không phải sợ vợ/nhờ chồng"; PHU-TRANH-07 dẫn TC (WM8) đúng. |
| 916 | Thân cư Phu Thê (kém) | MENH-YN-08, PHU-TRANH-07, CHUNG-PP-05, CHUNG-SP-02 | Chỉ ghi nguồn | Như dòng 902; điều kiện kém xét sao hãm/sát tinh, không Tứ hóa. |
| 931 | Thân cư Tài Bạch (thường) | MENH-YN-06, 08 | Chỉ ghi nguồn | Ý nghĩa lĩnh vực cung Thân đóng; TC là một trong ba nguồn của YN-06/08. |
| 945 | Thân cư Tài Bạch (kém) | MENH-YN-06, 08, CHUNG-PP-05, CHUNG-SP-02 | Chỉ ghi nguồn | Câu nói "sao hãm hoặc sát tinh", không nhắc hóa; không phụ thuộc can. |
| 959 | Thân cư Thiên Di (thường) | MENH-YN-06, 08 | Chỉ ghi nguồn | Ý nghĩa cung chung, không sao, không hóa. |
| 973 | Thân cư Thiên Di (kém) | MENH-YN-06, 08, CHUNG-PP-05, CHUNG-SP-02 | Chỉ ghi nguồn | Như dòng 945. |
| 987 | Thân cư Quan Lộc (thường) | MENH-YN-06, 08 | Chỉ ghi nguồn | Ý nghĩa cung chung, không sao, không hóa. |
| 1001 | Thân cư Quan Lộc (kém) | MENH-YN-06, 08, CHUNG-PP-05, CHUNG-SP-02 | Chỉ ghi nguồn | Như dòng 945. |
| 1016 | Thân cư Phúc Đức (thường) | MENH-YN-03, 06, 08 | Chỉ ghi nguồn | Ý đời sống tinh thần; YN-03 không có TC nhưng TC đã có qua YN-06/08, nhãn đúng. |
| 1031 | Thân cư Phúc Đức (kém) | MENH-YN-03, 06, 08, CHUNG-PP-05, CHUNG-SP-02 | Chỉ ghi nguồn | Như dòng 1016. |

Tổng: 12 "chỉ ghi nguồn", 0 "có gắn Tứ hóa Trung Châu", 0 "cần đổi nhãn nguồn".

## Kết luận chung
**Không cùng lỗi Q1.** 12 dòng là luận Thân cư theo ý nghĩa cung, Trung Châu (WM8) chỉ là một trong 2–4 nguồn liệt kê, đúng với nguồn ghi ở mã MENH-YN-06/07/08 và PHU-TRANH-07. Không có tuổi nào (Canh, Nhâm hay can khác) bị lệch, vì cả câu lẫn điều kiện chọn câu đều không dùng can năm hay Tứ hóa. Khối `tuHoa` của cùng file không dẫn Trung Châu (grep chỉ ra 12 dòng này).

Ghi nhận phụ (không phải lỗi nghiêm trọng, không chặn): (1) bản `kem` của Thân cư Mệnh (dòng 877–891) là nội dung không bao giờ hiển thị; (2) câu `kem` nói "có sao hãm hoặc sát tinh", còn code đòi chính tinh hãm hoặc từ 2 sát tinh trở lên, nghĩa vẫn khớp nhưng có thể ghi rõ hơn khi Hạnh sửa đợt sau.

## Đề xuất cho Tùng
Giữ nguyên 12 dòng: không đổi câu nguồn, không tách đoạn; lỗi Trung Châu tuổi Canh chỉ cần sửa ở đoạn vận năm (đã sạch).
