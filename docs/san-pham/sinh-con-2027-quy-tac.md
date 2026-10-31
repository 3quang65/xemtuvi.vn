# Quy tắc công cụ miễn phí "Sinh con 2027 hợp bố mẹ"

Phiên bản: 31/10/2026 · Người soạn: Đức (Nghiên cứu Tử vi) · Việc: L-98ca32 · Trạng thái: **bản nháp, chờ Thư duyệt nội dung**
Script tự kiểm: `docs/san-pham/sinh-con-2027-kiem.py` (mã thoát 0 = khớp).

## 0. Phạm vi và cách hiểu đúng

- Đầu vào: năm sinh của bố và của mẹ (kèm ngày/tháng nếu sinh tháng 1–2 dương lịch, xem mục 4). Đầu ra: một trong ba mức trung tính + hai dòng giải thích ngắn cho từng người + lời mời lập lá số / xem Vận 2027.
- Con: sinh trong năm âm lịch **Đinh Mùi**, tức từ **06/02/2027 đến 25/01/2028** dương lịch (Tết 2027 = 06/02/2027, Tết 2028 = 26/01/2028, tính bằng engine tham chiếu `docs/nghien-cuu/tuvi-ref-engine.py`, lịch Việt UTC+7). Bé sinh 01/01–05/02/2027 thuộc năm Bính Ngọ: công cụ không tính, hiện một dòng ghi chú.
- **Trường phái**: cả hai tiêu chí là lý thuyết **can chi – ngũ hành chung** (dùng chung trong mệnh lý Việt Nam và Trung Hoa: lịch pháp, Bát tự, xem tuổi dân gian). Đây **không phải phép an sao Tử Vi Đẩu Số**; Tử Vi phái Việt dùng tam hợp, xung chiếu để xét quan hệ giữa các cung trong một lá số, không dùng để so tuổi bố mẹ với con. Trang công cụ phải nói rõ điều này (một câu) và dẫn sang lá số Tử Vi cho phần "hiểu mình".
- Kết quả là **tham khảo văn hóa**, chỉ dựa trên năm sinh. Không mức nào là kết luận về sức khỏe, tính cách, tương lai của bé hay quan hệ gia đình. Năm nào sinh con cũng là năm tốt để đón bé.
- Loại khỏi công cụ (theo chỉ đạo L-98ca32): không phán tuổi nào "không nên sinh"; không bàn chọn tháng có em bé; không dùng phép tính tuổi cưới/làm nhà theo tuổi mụ; không bày cách hóa giải; không đoán bé trai hay bé gái; không dùng quan hệ tương hình, tương hại (xem mục 7).

## 1. Ký hiệu

Chi: Tý 0, Sửu 1, Dần 2, Mão 3, Thìn 4, Tỵ 5, Ngọ 6, Mùi 7, Thân 8, Dậu 9, Tuất 10, Hợi 11. Can: Giáp 0 … Quý 9 (như spec an sao mục 0).
Với **năm âm lịch** `y` (đã xử lý mục 4): can `c = (y − 4) mod 10`, chi `z = (y − 4) mod 12`.
Con: Đinh Mùi, `c = 3`, `z = 7`, nạp âm **Thiên Hà Thủy** → hành **Thủy** (spec `docs/nghien-cuu/tuvi-an-sao-spec.md` mục 3.1, dòng 44).

## 2. Tiêu chí A: quan hệ địa chi của bố/mẹ với chi Mùi của con

| Chi bố/mẹ | Quan hệ với Mùi | Điểm A |
|---|---|---|
| Hợi, Mão | **Tam hợp** Hợi – Mão – Mùi (Mộc cục) | +1 |
| Ngọ | **Lục hợp** Ngọ – Mùi | +1 |
| Sửu | **Lục xung** Sửu – Mùi | −1 |
| Mùi | cùng chi (đồng tuổi con giáp với bé) | 0 |
| Tý, Dần, Thìn, Tỵ, Thân, Dậu, Tuất | không thuộc ba quan hệ trên | 0 |

Công thức: `A(z) = +1 nếu z ∈ {3, 6, 11}; −1 nếu z = 1; 0 còn lại`.

Đầy đủ các nhóm (để kiểm nguồn): tam hợp Thân Tý Thìn (Thủy), Tỵ Dậu Sửu (Kim), Dần Ngọ Tuất (Hỏa), Hợi Mão Mùi (Mộc); lục hợp Tý–Sửu, Dần–Hợi, Mão–Tuất, Thìn–Dậu, Tỵ–Thân, Ngọ–Mùi; lục xung Tý–Ngọ, Sửu–Mùi, Dần–Thân, Mão–Dậu, Thìn–Tuất, Tỵ–Hợi.

Nguồn (đọc 31/10/2026):
1. Wikipedia tiếng Trung, mục 地支 (các mục 地支六合, 地支三合, 地支相沖): https://zh.wikipedia.org/wiki/地支 — khớp đủ 4 nhóm, 6 cặp hợp, 6 cặp xung ở trên. Trang không dẫn sách cổ cho phần này.
2. Master Sean Chan, trang tham khảo Bát tự: https://www.masterseanchan.com/bazi-branch-trines/ , https://www.masterseanchan.com/bazi-branch-hexes/ , https://www.masterseanchan.com/bazi-branch-clashes/ — khớp nguồn 1 (Hợi Mão Mùi Mộc; Ngọ Mùi hợp; Sửu Mùi xung).
3. Nội bộ, phái Việt: spec an sao mục 5.10 dùng đúng bốn nhóm tam hợp (câu phú Hỏa Linh "Dần Ngọ Tuất…, Hợi Mão Mùi…") — khớp nhóm tam hợp.
- Sách cổ (Tam Mệnh Thông Hội, Hiệp Kỷ Biện Phương Thư): **chưa kiểm chứng** nguyên văn (ctext.org chặn đọc tự động). Không ghi tên sách này trên trang khách cho tới khi có bản in.

## 3. Tiêu chí B: ngũ hành nạp âm năm sinh bố/mẹ với Thủy (Thiên Hà Thủy) của con

Bước 1: nạp âm năm sinh = phần tử `floor(n / 2)` của bảng 30 nạp âm, với `n = (6c − 5z) mod 60` (spec mục 3.1); lấy hành ở chữ cuối.
Bước 2: so hành `h` của bố/mẹ với Thủy:

| Hành nạp âm bố/mẹ | Quan hệ với Thủy | Điểm B |
|---|---|---|
| Kim | Kim sinh Thủy (bố mẹ sinh con) | +1 |
| Mộc | Thủy sinh Mộc (con sinh bố mẹ) | +1 |
| Thủy | bình hòa (cùng hành) | 0 |
| Thổ | Thổ khắc Thủy | −1 |
| Hỏa | Thủy khắc Hỏa | −1 |

Chu trình dùng: tương sinh Mộc → Hỏa → Thổ → Kim → Thủy → Mộc; tương khắc Mộc → Thổ → Thủy → Hỏa → Kim → Mộc.

Nguồn (đọc 31/10/2026):
1. Bảng nạp âm 60 hoa giáp: spec an sao mục 3.1 (đã đối chiếu engine repo xemboi.vn và iztro theo spec mục 11, 13.1). Đinh Mùi = Thiên Hà Thủy còn khớp các trang phổ thông (fptshop.com.vn, hoanghamobile.com, bài "2027 mệnh gì") — chỉ đọc qua kết quả tìm kiếm.
2. Chu trình sinh khắc: Wikipedia "Wuxing (Chinese philosophy)", mục Inter-promoting / Inter-regulating: https://en.wikipedia.org/wiki/Wuxing_(Chinese_philosophy) ; Wikipedia tiếng Việt "Ngũ hành" (chú thích 2, thứ tự tương sinh Mộc Hỏa Thổ Kim Thủy): https://vi.wikipedia.org/wiki/Ngũ_hành . Cả hai không dẫn sách cổ; nguồn kinh điển (Hoài Nam Tử, Đổng Trọng Thư) **chưa kiểm chứng**.
- Lựa chọn sản phẩm (không phải quy tắc sách): tương sinh **hai chiều** cùng +1 cho đơn giản, trung tính. Một số trang dân gian coi "bố mẹ sinh con" nhỉnh hơn "con sinh bố mẹ"; không có nguồn thống nhất nên không phân biệt.

## 4. Năm sinh âm lịch: người sinh tháng 1–2 dương lịch

Quy ước (spec mục 1.7): năm tính từ **mùng 1 Tết**, không theo Lập Xuân. Người sinh từ 01/01 dương đến **trước ngày Tết** của năm đó thuộc **năm âm trước** (`y = năm dương − 1`).

Luồng nhập đề xuất (Bảo/Mai quyết định giao diện):
1. Nhập năm dương lịch (cho phép 1960–2010; ngoài khoảng: tính Tết bằng hàm đổi lịch Việt sẵn có trong repo, không dùng lịch Trung Quốc).
2. Hỏi "Sinh vào tháng 1 hoặc tháng 2 dương lịch?" — nếu có, hỏi ngày/tháng và so với bảng Tết dưới đây. Nếu bỏ qua: tính theo năm dương và hiện ghi chú "nếu sinh trước Tết năm đó, kết quả theo năm trước".
3. Hiện lại can chi đã dùng ("Bố: 1990 – Canh Ngọ") để khách tự kiểm.

Bảng Tết Việt Nam (ngày/tháng dương lịch), engine tham chiếu (thuật toán Hồ Ngọc Đức; UTC+8 trước 1968, UTC+7 từ 1968), script đối chiếu đủ 53 năm:

| Năm | Tết | Năm | Tết | Năm | Tết | Năm | Tết | Năm | Tết |
|---|---|---|---|---|---|---|---|---|---|
| 1960 | 28/1 | 1971 | 27/1 | 1982 | 25/1 | 1993 | 23/1 | 2004 | 22/1 |
| 1961 | 15/2 | 1972 | 15/2 | 1983 | 13/2 | 1994 | 10/2 | 2005 | 9/2 |
| 1962 | 5/2 | 1973 | 3/2 | 1984 | 2/2 | 1995 | 31/1 | 2006 | 29/1 |
| 1963 | 25/1 | 1974 | 23/1 | 1985 | 21/1 | 1996 | 19/2 | 2007 | 17/2 |
| 1964 | 13/2 | 1975 | 11/2 | 1986 | 9/2 | 1997 | 7/2 | 2008 | 7/2 |
| 1965 | 2/2 | 1976 | 31/1 | 1987 | 29/1 | 1998 | 28/1 | 2009 | 26/1 |
| 1966 | 21/1 | 1977 | 18/2 | 1988 | 17/2 | 1999 | 16/2 | 2010 | 14/2 |
| 1967 | 9/2 | 1978 | 7/2 | 1989 | 6/2 | 2000 | 5/2 | 2027 | 6/2 |
| 1968 | 29/1 | 1979 | 28/1 | 1990 | 27/1 | 2001 | 24/1 | 2028 | 26/1 |
| 1969 | 16/2 | 1980 | 16/2 | 1991 | 15/2 | 2002 | 12/2 | | |
| 1970 | 6/2 | 1981 | 5/2 | 1992 | 4/2 | 2003 | 1/2 | | |

Lưu ý lịch: Tết 1985 Việt Nam là 21/1 (Trung Quốc 20/2), Tết 2007 là 17/2 (Trung Quốc 18/2) — spec mục 1.5; công cụ dùng lịch Việt. Tết 1968 ở miền Nam (lịch UTC+8) là 30/1: người sinh đúng ngày 29/1/1968 ở miền Nam còn thuộc năm Đinh Mùi 1967 (ca hiếm, ghi chú, không xử lý riêng).

## 5. Gộp điểm và ba mức

- Mỗi người: `s = A + B` (từ −2 đến +2). Cả hai: `T = s_bố + s_mẹ` (từ −4 đến +4).
- **Thuận**: `T ≥ 2`. **Cân bằng**: `−1 ≤ T ≤ 1`. **Khác nhịp**: `T ≤ −2`.
- Phân bố kiểm thử (mọi cặp năm 1965–2005, 41 × 41 = 1.681 cặp): Thuận 20%, Cân bằng 73%, Khác nhịp 7%. Đa số ở mức giữa, đúng định vị không gây lo.
- Chỉ dùng mức cho **cả gia đình**; phần từng người chỉ hiện quan hệ ("Bố tuổi Ngọ: lục hợp với Mùi"; "Mẹ mệnh Kim: Kim sinh Thủy"), không gắn nhãn mức cho từng người.

Gợi ý lời (Hạnh viết bản cuối, Thư duyệt; giữ giọng nhẹ, không hứa hẹn):
- **Thuận**: "Theo can chi năm sinh, tuổi bố mẹ và năm Đinh Mùi 2027 có nhiều điểm tương hợp. Đây là một góc tham khảo văn hóa; điều quan trọng nhất vẫn là sự sẵn sàng của cả nhà."
- **Cân bằng**: "Tuổi bố mẹ và năm Đinh Mùi 2027 có điểm hợp, có điểm khác nhịp, cân bằng như phần lớn gia đình. Năm sinh không quyết định tính cách hay tương lai của bé."
- **Khác nhịp**: "Theo can chi, tuổi bố mẹ và năm Đinh Mùi khác nhịp ở vài điểm. Đây chỉ là một lớp tham khảo; nhiều gia đình như vậy vẫn rất gắn bó. Muốn hiểu sâu hơn, nên xem lá số theo ngày giờ sinh của từng người."
- Cuối mọi mức: lời mời lập lá số miễn phí / xem Vận 2027 của bố mẹ.

## 6. Bảng tra

### 6.1. 144 cặp chi (bố × mẹ): tổng điểm A

Tổng `A_bố + A_mẹ`. Phân bố: −2: 1 cặp; −1: 16; 0: 70; +1: 48; +2: 9 (tổng 144, script kiểm).

| Bố \ Mẹ | Tý | Sửu | Dần | Mão | Thìn | Tỵ | Ngọ | Mùi | Thân | Dậu | Tuất | Hợi |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Tý** | 0 | -1 | 0 | +1 | 0 | 0 | +1 | 0 | 0 | 0 | 0 | +1 |
| **Sửu** | -1 | -2 | -1 | 0 | -1 | -1 | 0 | -1 | -1 | -1 | -1 | 0 |
| **Dần** | 0 | -1 | 0 | +1 | 0 | 0 | +1 | 0 | 0 | 0 | 0 | +1 |
| **Mão** | +1 | 0 | +1 | +2 | +1 | +1 | +2 | +1 | +1 | +1 | +1 | +2 |
| **Thìn** | 0 | -1 | 0 | +1 | 0 | 0 | +1 | 0 | 0 | 0 | 0 | +1 |
| **Tỵ** | 0 | -1 | 0 | +1 | 0 | 0 | +1 | 0 | 0 | 0 | 0 | +1 |
| **Ngọ** | +1 | 0 | +1 | +2 | +1 | +1 | +2 | +1 | +1 | +1 | +1 | +2 |
| **Mùi** | 0 | -1 | 0 | +1 | 0 | 0 | +1 | 0 | 0 | 0 | 0 | +1 |
| **Thân** | 0 | -1 | 0 | +1 | 0 | 0 | +1 | 0 | 0 | 0 | 0 | +1 |
| **Dậu** | 0 | -1 | 0 | +1 | 0 | 0 | +1 | 0 | 0 | 0 | 0 | +1 |
| **Tuất** | 0 | -1 | 0 | +1 | 0 | 0 | +1 | 0 | 0 | 0 | 0 | +1 |
| **Hợi** | +1 | 0 | +1 | +2 | +1 | +1 | +2 | +1 | +1 | +1 | +1 | +2 |

Kết quả cuối cần thêm B của từng người (phụ thuộc can, nên tra bảng 6.2 theo năm).

### 6.2. Theo năm âm lịch 1960–2008 (A, B, s của một người)

Các năm ngoài bảng: dùng công thức mục 2–3 (chu kỳ 60 năm: năm `y` và `y ± 60` cho cùng kết quả).

| Năm | Can chi | Hành nạp âm | A | B | s |
|---|---|---|---|---|---|
| 1960 | Canh Tý | Thổ | 0 | -1 | -1 |
| 1961 | Tân Sửu | Thổ | -1 | -1 | -2 |
| 1962 | Nhâm Dần | Kim | 0 | +1 | +1 |
| 1963 | Quý Mão | Kim | +1 | +1 | +2 |
| 1964 | Giáp Thìn | Hỏa | 0 | -1 | -1 |
| 1965 | Ất Tỵ | Hỏa | 0 | -1 | -1 |
| 1966 | Bính Ngọ | Thủy | +1 | 0 | +1 |
| 1967 | Đinh Mùi | Thủy | 0 | 0 | 0 |
| 1968 | Mậu Thân | Thổ | 0 | -1 | -1 |
| 1969 | Kỷ Dậu | Thổ | 0 | -1 | -1 |
| 1970 | Canh Tuất | Kim | 0 | +1 | +1 |
| 1971 | Tân Hợi | Kim | +1 | +1 | +2 |
| 1972 | Nhâm Tý | Mộc | 0 | +1 | +1 |
| 1973 | Quý Sửu | Mộc | -1 | +1 | 0 |
| 1974 | Giáp Dần | Thủy | 0 | 0 | 0 |
| 1975 | Ất Mão | Thủy | +1 | 0 | +1 |
| 1976 | Bính Thìn | Thổ | 0 | -1 | -1 |
| 1977 | Đinh Tỵ | Thổ | 0 | -1 | -1 |
| 1978 | Mậu Ngọ | Hỏa | +1 | -1 | 0 |
| 1979 | Kỷ Mùi | Hỏa | 0 | -1 | -1 |
| 1980 | Canh Thân | Mộc | 0 | +1 | +1 |
| 1981 | Tân Dậu | Mộc | 0 | +1 | +1 |
| 1982 | Nhâm Tuất | Thủy | 0 | 0 | 0 |
| 1983 | Quý Hợi | Thủy | +1 | 0 | +1 |
| 1984 | Giáp Tý | Kim | 0 | +1 | +1 |
| 1985 | Ất Sửu | Kim | -1 | +1 | 0 |
| 1986 | Bính Dần | Hỏa | 0 | -1 | -1 |
| 1987 | Đinh Mão | Hỏa | +1 | -1 | 0 |
| 1988 | Mậu Thìn | Mộc | 0 | +1 | +1 |
| 1989 | Kỷ Tỵ | Mộc | 0 | +1 | +1 |
| 1990 | Canh Ngọ | Thổ | +1 | -1 | 0 |
| 1991 | Tân Mùi | Thổ | 0 | -1 | -1 |
| 1992 | Nhâm Thân | Kim | 0 | +1 | +1 |
| 1993 | Quý Dậu | Kim | 0 | +1 | +1 |
| 1994 | Giáp Tuất | Hỏa | 0 | -1 | -1 |
| 1995 | Ất Hợi | Hỏa | +1 | -1 | 0 |
| 1996 | Bính Tý | Thủy | 0 | 0 | 0 |
| 1997 | Đinh Sửu | Thủy | -1 | 0 | -1 |
| 1998 | Mậu Dần | Thổ | 0 | -1 | -1 |
| 1999 | Kỷ Mão | Thổ | +1 | -1 | 0 |
| 2000 | Canh Thìn | Kim | 0 | +1 | +1 |
| 2001 | Tân Tỵ | Kim | 0 | +1 | +1 |
| 2002 | Nhâm Ngọ | Mộc | +1 | +1 | +2 |
| 2003 | Quý Mùi | Mộc | 0 | +1 | +1 |
| 2004 | Giáp Thân | Thủy | 0 | 0 | 0 |
| 2005 | Ất Dậu | Thủy | 0 | 0 | 0 |
| 2006 | Bính Tuất | Thổ | 0 | -1 | -1 |
| 2007 | Đinh Hợi | Thổ | +1 | -1 | 0 |
| 2008 | Mậu Tý | Hỏa | 0 | -1 | -1 |

## 7. Điểm chưa chắc và lựa chọn đã làm

1. Bỏ tương hình (Sửu – Tuất – Mùi), tương hại (Tý – Mùi): có trong nguồn 1 mục 2 nhưng dễ gây lo; chỉ đạo chỉ nêu tam hợp, lục hợp, lục xung. Nếu Thư/Minh muốn thêm, phân bố mức sẽ lệch về "Khác nhịp".
2. Không dùng thiên can (ví dụ Đinh hợp Nhâm, Đinh khắc Tân/Quý): có thể là tiêu chí thứ ba; để ngoài cho đơn giản và tránh trùng với B.
3. Ngưỡng ba mức và tương sinh hai chiều cùng +1 là lựa chọn sản phẩm, không có trong sách.
4. Nguồn sách cổ cho hợp/xung và sinh khắc **chưa kiểm chứng** nguyên văn; nguồn hiện có: Wikipedia (2 bản), một trang Bát tự, spec nội bộ.
5. Người không biết mình sinh trước hay sau Tết: kết quả có thể lệch một năm; luôn hiện can chi đã dùng.

## 8. Năm ca mẫu tính tay (máy kiểm khớp: `sinh-con-2027-kiem.py`)

| # | Bố | Mẹ | Tính | T | Mức |
|---|---|---|---|---|---|
| 1 | 1980 Canh Thân, Thạch Lựu **Mộc** | 1984 Giáp Tý, Hải Trung **Kim** | Bố: A 0 (Thân không thuộc), B +1 (Thủy sinh Mộc) → +1. Mẹ: A 0, B +1 (Kim sinh Thủy) → +1 | +2 | Thuận |
| 2 | 2002 Nhâm Ngọ, Dương Liễu **Mộc** | 1993 Quý Dậu, Kiếm Phong **Kim** | Bố: A +1 (Ngọ – Mùi lục hợp), B +1 → +2. Mẹ: A 0, B +1 → +1 | +3 | Thuận |
| 3 | 1990 Canh Ngọ, Lộ Bàng **Thổ** | 1992 Nhâm Thân, Kiếm Phong **Kim** | Bố: A +1 (lục hợp), B −1 (Thổ khắc Thủy) → 0. Mẹ: A 0, B +1 → +1 | +1 | Cân bằng |
| 4 | 1986 Bính Dần, Lô Trung **Hỏa** | 1991 Tân Mùi, Lộ Bàng **Thổ** | Bố: A 0, B −1 (Thủy khắc Hỏa) → −1. Mẹ: A 0 (cùng chi Mùi), B −1 → −1 | −2 | Khác nhịp |
| 5 (trước Tết) | 1986 Bính Dần, **Hỏa** | sinh **01/02/1991** dương: trước Tết 15/2/1991 → âm lịch 17/12 **Canh Ngọ 1990**, **Thổ** | Bố: −1. Mẹ: A +1 (lục hợp), B −1 → 0. (Nếu lấy nhầm 1991 Tân Mùi: T = −2, Khác nhịp) | −1 | Cân bằng |

Ca 1 là đúng mẫu câu khách hay hỏi ("ck 80 vk 84 sinh 2027 hợp không", `nghien-cuu-thi-truong/mxh/2026-10-31.md`). Ca 5: đổi lịch 01/02/1991 → 17/12/1990 âm, kiểm bằng `solar2lunar` của engine tham chiếu.

## 9. Nghiệm thu cho Kỹ thuật (đề xuất)

- Cài đặt phải cho đúng 5 ca mục 8 và đúng bảng 6.2 cho mọi năm 1960–2008.
- Không gọi engine an sao: công cụ chỉ cần can chi năm và bảng nạp âm.
- Ghi sự kiện: mức kết quả, có/không nhập ngày tháng (để đo tỉ lệ người sinh tháng 1–2), có bấm sang lá số.
