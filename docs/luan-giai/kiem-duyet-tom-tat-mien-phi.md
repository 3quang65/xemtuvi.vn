# Phiếu kiểm duyệt: tóm tắt miễn phí 11 lá số mẫu (việc L-e8523f)

Người chấm: Thư (kiem-duyet) · 30/10/2026 · Skill `kiem-duyet-noi-dung`
Đầu vào: `docs/luan-giai/tom-tat-mien-phi/sau.md` (72 câu), so với `truoc.md` (35 câu); bộ câu `src/lib/luan-giai/tom-tat-mien-phi.json`; đối chiếu sao bằng `node /tmp/xem.cjs`; bộ ghép `src/lib/luan-giai/index.ts` (`cauCuaLaSo`).

## 1. Kết luận

**KHÔNG ĐẠT: 0/11 bản đạt** ngưỡng của việc (mỗi tiêu chí ≥ 7 ở từng bản, An toàn = 10).

| | Đúng | Sâu | Giọng | An toàn | TB chung |
|---|---|---|---|---|---|
| TB 11 bản | **6,18** | **6,45** | **6,91** | 10 | 7,39 |

Bản mới tốt hơn rõ so với bản cũ: có nhận định riêng từng lá số (11/11 bản có ≥ 2 câu nêu sao + cung, bản cũ 3/11), câu trùng giảm từ 48,6% xuống 16,7%, mỗi câu có lời khuyên cụ thể, có câu dẫn sang bản chuyên sâu nêu đúng sao tam phương. An toàn sạch ở cả 11 bản. Lỗi nằm ở **bộ câu không phân nhánh theo độ sáng (phụ tinh), câu Tuần/Triệt không khớp các câu còn lại, và không có giọng riêng cho lá số trẻ em**. Đây là lỗi hệ thống: sửa ở khóa JSON và bộ ghép thì sửa đồng loạt.

## 2. Bảng điểm

| Bản | Năm sinh | Đúng | Sâu | Giọng | An toàn | Đạt? | Lỗi chặn |
|---|---|---|---|---|---|---|---|
| TC01 | 1973 | 5 | 7 | 8 | 10 | Không | Tuần mâu thuẫn câu Hỏa Tinh, Hóa Kỵ |
| TC02 | 2023 | 6 | 7 | 5 | 10 | Không | Đà La (H) tả nét đắc; giọng người lớn cho bé 3 tuổi |
| TC03 | 1995 | 6 | 7 | 8 | 10 | Không | Đà La (H) tả nét đắc; Thân cư Thiên Di tả tốt khi cung xấu |
| TC04 | 2020 | 8 | 6 | 5 | 10 | Không | "người bạn đời" cho bé 6 tuổi; chỉ 3 nhận định |
| TC05 | 1985 | 6 | 7 | 8 | 10 | Không | Văn Khúc (H) tả như sáng |
| TC06 | 2023 | 7 | 6 | 5 | 10 | Không | giọng người lớn, "thị phi" 2 lần cho bé; bỏ Triệt ở cung mượn sao |
| TC07 | 1965 | 8 | 6 | 7 | 10 | Không | Tử Phá tả rời, không gộp |
| TC08 | 1990 | 6 | 6 | 7 | 10 | Không | Địa Kiếp (H) + Hóa Lộc đồng cung không dung hòa; thiếu cách Nhật Lương ở Mão |
| TC09 | 1987 | 6 | 7 | 8 | 10 | Không | Văn Khúc (H) tả như sáng |
| TC10 | 1988 | 5 | 6 | 7 | 10 | Không | Triệt mâu thuẫn câu Thiên Khôi; "thầy cô" cho người 38 tuổi |
| TC11 | 1981 | 5 | 6 | 8 | 10 | Không | Tuần "che chắn sao yếu" nhưng câu Tham Lang (H) không giảm |
| **TB** | | **6,18** | **6,45** | **6,91** | **10** | **0/11** | |

Cách chấm "Sâu" cho tóm tắt ngắn (theo đề việc): câu có nói riêng về lá số này không, khách có thấy "đúng mình" và muốn đọc tiếp không. 7 = có ≥ 3 nhận định riêng, câu dẫn đúng sao; 6 = nhận định rời, có chỗ mâu thuẫn chưa dung hòa hoặc bỏ cách cục nổi bật ngay tại Mệnh; 8 = gộp sao cùng cung thành một nhận định và có dung hòa.

## 3. Lý do từng bản

**TC01 (Tham Lang Đ + Hóa Kỵ + Hỏa Tinh Đ, Tuần, Mệnh Dần).** Câu Tuần nói "sao sáng bớt sức", nhưng câu Hỏa Tinh vẫn "nhanh, mạnh và nhiệt, có thể bứt phá trong thời gian ngắn", câu Hóa Kỵ không nói Tuần làm Kỵ dịu đi (Kỵ và Tuần cùng ở Mệnh, CHUNG-TUAN-02) → câu tự mâu thuẫn, Đúng tối đa 5. Tham Lang gặp Hỏa Tinh nhưng chưa nói "không thành cách Tham Hỏa vì Tham chỉ đắc lại hóa Kỵ" (bài luận thử tc01 đã có câu này, MENH-CC-06). Giọng tốt.

**TC02 (bé 3 tuổi; Cự Môn Đ + Hóa Quyền + Đà La H).** Đà La (Hãm) dùng câu "bền bỉ, lì và ít khi bỏ cuộc": đó là nét đắc địa; MENH-SP-06 ghi hãm thì "dễ nóng nảy, liều lĩnh" → Đúng 6. Giọng: cả bản nói với người lớn: "góp ý để ý kiến được đón nhận", "được giao vai trò dẫn dắt… sự tín nhiệm mới bền", "cách kiếm và giữ tiền trở thành trục chính" cho bé 3 tuổi → tối đa 5 (người đọc là cha mẹ, cần giọng "bé", hướng nuôi dạy).

**TC03 (Vũ Khúc V + Thiên Tướng M, Đà La H, Địa Không Đ).** Đà La (H) như TC02. Câu Thân cư Thiên Di "mạnh dạn ra ngoài… thường mang lại cơ hội tốt" trong khi Thiên Di có Phá Quân (H), Tuần, Địa Kiếp: câu tốt áp cho cung xấu (lỗi nhẹ) → Đúng 6. Sâu, Giọng đạt.

**TC04 (bé 6 tuổi; Tử Vi B tại Tý, Thiên Hình).** Vị trí, độ sáng đúng; "vua thiếu bề tôi" khớp vì Mệnh không có Tả Hữu, Khôi Việt (đúng do may, xem lỗi P2-13). Giọng: "Thân cư Phu Thê… người bạn đời… người cùng giá trị sống rất đáng chọn", "nghiêm khắc với bản thân lẫn người khác" cho bé gái 6 tuổi → tối đa 5. Sâu 6: chỉ 3 nhận định, không nhắc Thiên Di (Tham Lang H, Triệt, Địa Không) dù là cung xung chiếu nổi bật.

**TC05 (Thiên Đồng H, Văn Khúc H, Thiên Hình Đ).** Văn Khúc (Hãm) mà câu toàn nét tốt: "năng khiếu nghệ thuật, ăn nói duyên dáng" (MENH-SP-02 chỉ cho Xương Khúc đắc địa; gặp sát/Kỵ thì giảm) → Đúng 6. Khách thấy chữ "(Hãm)" ngay trước câu khen, dễ mất tin.

**TC06 (bé gần 3 tuổi; Mệnh VCD Mùi, mượn Đồng Cự H ở Sửu).** Câu VCD đúng phương pháp, có "nơi học tập" hợp tuổi. Nhưng cung bị mượn (Thiên Di Sửu) có Triệt và Cự Môn hóa Quyền, không câu nào nhắc → Đúng 7. Giọng: hai câu liền đều "vướng thị phi", "hứa ít làm nhiều để người khác tin cậy", "thận trọng khi phát biểu, theo một chuyên môn" là giọng người lớn, nặng với cha mẹ đọc cho bé → tối đa 5. Sâu 6: hai câu chính tinh chép nguyên câu tọa thủ, không dung hòa với "lực nhẹ hơn".

**TC07 (61 tuổi; Tử Vi Đ + Phá Quân V + Hóa Quyền, Thiên Việt, Mệnh Mùi).** Đúng: tứ hóa đúng can Giáp (sinh trước Tết Ất Tỵ 1965), độ sáng khớp. Sâu 6: Tử Vi "điềm đạm" và Phá Quân "thích thay đổi" đặt cạnh nhau, không gộp thành Tử Phá đồng cung ở Mùi. Giọng 7: Thiên Việt "được giúp đúng lúc trong học hành, thi cử" cho người 61 tuổi.

**TC08 (Thái Dương V + Thiên Lương V tại Mão, Hóa Lộc, Địa Kiếp H, Đào Hoa).** Địa Kiếp (Hãm) dùng câu chung "dám nghĩ dám làm, có thể tiến rất nhanh" (lỗi nhẹ); Hóa Lộc "khơi mở thành thuận lợi… dùng may mắn ấy" đặt cạnh Địa Kiếp cùng cung mà không dung hòa (Lộc gặp Kiếp) → Đúng 6. Sâu 6: Nhật Lương ở Mão là cách nổi bật nhất của lá số mà không nêu. Giọng 7: hai câu chính tinh lặp ý ("thích giúp người… nhận hết mọi lời nhờ cậy" và "thích giúp đỡ… không ôm việc của người khác"); 8 câu, chạm trần.

**TC09 (Cự Môn V + Hóa Kỵ tại Tý, Văn Khúc H, Đào Hoa).** Văn Khúc (H) như TC05 → Đúng 6. Câu Hóa Kỵ có nguồn đúng (Toàn Thư "chỉ cầu bảy phần") nhưng ghi "sách gốc". Sâu 7, Giọng đạt.

**TC10 (Thiên Tướng Đ, Triệt, Địa Kiếp H, Thiên Khôi, Mệnh Sửu).** Câu Triệt "mặt mạnh lẫn mặt vướng đều dịu đi" nhưng câu Thiên Khôi vẫn "mở ra nhiều cánh cửa" (Khôi cùng cung bị Triệt) → tự mâu thuẫn, Đúng tối đa 5; thêm Địa Kiếp (H) dùng câu chung. Giọng 7: "xin lời khuyên từ thầy cô" cho người 38 tuổi.

**TC11 (Tham Lang H tại Tý, Tuần, Địa Không H).** Câu Tuần nói "sao yếu được che chắn" nhưng câu Tham Lang (H) giữ nguyên mức nặng ("thiếu kiên nhẫn… dễ sa vào thú vui"), không có vế Tuần làm bớt → tự mâu thuẫn chiều ngược TC01, Đúng tối đa 5; Địa Không (H) dùng chung câu với Địa Không (Đ) của TC03. Sâu 6: không có câu dung hòa.

## 4. So sánh với bản cũ

| Chỉ số | truoc.md | sau.md |
|---|---|---|
| Số câu | 35 | 72 |
| Câu trùng nguyên văn | 17 (48,6%) | 12 (16,7%) |
| Bản có ≥ 2 nhận định nêu sao + cung | 3/11 | 11/11 |
| Câu ghi rõ do hệ thống tạo | 11/11 (câu chung) | 11/11 (liệt kê đúng sao đã xét) |
| Câu dẫn sang bản chuyên sâu | 0 | 11/11 |

## 5. Danh sách lỗi theo khóa JSON (cho Hạnh, Bảo)

### P0: chặn đạt

| # | Khóa | Bản | Lỗi | Mã | Hướng sửa, nghiệm thu |
|---|---|---|---|---|---|
| 1 | `phuTinh.Văn Khúc` (cùng lỗi tiềm ẩn: `phuTinh.Văn Xương`) | TC05, TC09 | Không có nhánh độ sáng; sao (H) nhận câu toàn nét tốt | MENH-SP-02 | Hạnh: thêm nhánh `H` mở bằng mặt cần chú ý (học nhiều mà chưa tới, dễ dao động khi gặp sát). Bảo: phụ tinh có độ sáng thì chọn theo nhánh. Nghiệm thu: 0 câu khen ở sao có nhãn (Hãm) |
| 2 | `phuTinh.Đà La` (cùng lỗi: `phuTinh.Kình Dương`) | TC02, TC03 | Câu nét đắc địa dùng cho Đà La (H) | MENH-SP-06 | Nhánh `H`: nóng nảy, cố chấp, liều; giữ lời khuyên. Nghiệm thu như #1 |
| 3 | `tuanTriet.Tuần`, `tuanTriet.Triệt` ghép với `phuTinh.Hỏa Tinh`, `tuHoa.Hóa Kỵ` (TC01); `phuTinh.Thiên Khôi`, `chinhTinh.Thiên Tướng.Đ` (TC10); `chinhTinh.Tham Lang.H` (TC11) | TC01, TC10, TC11 | Câu Tuần/Triệt nói sao bớt sức hoặc được che chắn, câu sao cùng cung không đổi | CHUNG-TUAN-02 | Bảo: khi Mệnh có Tuần/Triệt, câu Tuần/Triệt nêu tên sao bị ảnh hưởng (vd "Tuần làm Hỏa Tinh và Hóa Kỵ dịu đi") và đặt ngay sau câu sao đó; Hạnh: viết 2 biến thể câu Tuần/Triệt (Mệnh có sao sáng / Mệnh có sao hãm, sát tinh), bỏ vế "sao sáng bớt sức còn sao yếu được che chắn" chung chung. Nghiệm thu: 0 bản có Tuần/Triệt mà câu sao cùng cung trái chiều |
| 4 | `thanCu.Phu Thê`, `thanCu.Tài Bạch`, `tuHoa.Hóa Quyền`, `chinhTinh.Cự Môn.Đ`, `chinhTinh.Cự Môn.H`, `chinhTinh.Thiên Đồng.H`, `chinhTinh.Tử Vi.B`, `phuTinh.Thiên Hình` | TC02, TC04, TC06 | Không có giọng cho lá số trẻ em (dưới 15 tuổi): nói chuyện bạn đời, kiếm tiền, góp ý, tín nhiệm với bé 3–6 tuổi | Skill mục 1 (Giọng, lá số trẻ em) | Hạnh: thêm trường `treEm` cho mỗi mục (giọng nói với cha mẹ, "bé", hướng nuôi dạy; `thanCu.*` cho trẻ em nói "về sau"); Bảo: tuổi < 15 thì dùng `treEm`. Nghiệm thu: 3 bản trẻ em không còn chữ "bạn đời", "kiếm tiền", "tín nhiệm", "phát biểu" |

### P1: cần sửa trước khi lên site

| # | Khóa | Bản | Lỗi | Mã | Hướng sửa |
|---|---|---|---|---|---|
| 5 | `phuTinh.Địa Kiếp`, `phuTinh.Địa Không` | TC08, TC10, TC11 | Câu dùng chung cho Đắc (Dần Thân Tỵ Hợi) và Hãm; sao hãm vẫn mở bằng "dám nghĩ dám làm", "nhiều ý tưởng bất ngờ" | MENH-SP-08, CHUNG-SP-02 | Nhánh `H` nặng hơn về "thành bại thất thường", mở bằng mặt cần chú ý |
| 6 | `thanCu.*` (gặp ở `thanCu.Thiên Di`) | TC03 | Câu Thân cư tả tốt bất kể sao ở cung Thân (Phá Quân H, Tuần, Địa Kiếp) | MENH-YN-06, MENH-YN-08 | Bảo: cung Thân có chính tinh hãm hoặc ≥ 2 sát tinh thì dùng biến thể "cần chọn lọc"; Hạnh viết biến thể |
| 7 | Chưa có khóa (đề xuất `cachCuc`) | TC01, TC07, TC08, TC09 | Bỏ cách cục ngay tại Mệnh: Tham gặp Hỏa nhưng chưa thành cách vì Tham chỉ đắc, hóa Kỵ (TC01); Tử Phá đồng cung Mùi (TC07); Nhật Lương ở Mão (TC08); Cự Môn ở Tý có Hóa Kỵ (TC09) | MENH-CC-06, MENH-CC-* | Hạnh: 1 câu cách cục cho các cặp chính tinh đồng cung và cách tại Mệnh, kèm điều kiện phá cách; Bảo: câu cách cục thay cho 2 câu chính tinh rời. Nghiệm thu: 4 bản trên có câu cách cục đúng điều kiện |
| 8 | `voChinhDieu` | TC06 | Cung bị mượn sao có Triệt và Cự Môn hóa Quyền, không nhắc | MENH-CC-09, CHUNG-VCD-01, CHUNG-TUAN-02 | Bảo: Mệnh VCD thì xét Tuần/Triệt và tứ hóa ở cung xung chiếu; Hạnh: thêm vế "sao mượn lại bị Triệt nên càng nhẹ" |
| 9 | `tuHoa.Hóa Lộc` ghép `phuTinh.Địa Kiếp` | TC08 | Hóa Lộc "khơi mở thuận lợi" cùng cung Địa Kiếp, không dung hòa | CHUNG-HOA-06, CHUNG-SP-02 | Biến thể Hóa Lộc khi đồng cung Không/Kiếp: có cơ hội nhưng dễ đến nhanh đi nhanh |

### P2: nên sửa

| # | Khóa | Bản | Lỗi |
|---|---|---|---|
| 10 | `phuTinh.Thiên Việt`, `phuTinh.Thiên Khôi` | TC07 (61t), TC10 (38t) | "học hành, thi cử", "thầy cô" không hợp người lớn tuổi: thêm biến thể theo tuổi (người đi trước, cấp trên, đối tác) |
| 11 | `chinhTinh.Thái Dương.V` + `chinhTinh.Thiên Lương.V` | TC08 | Hai câu liền lặp ý "giúp người, ôm việc nhờ" (sẽ hết khi có câu cách cục #7) |
| 12 | `chinhTinh.Thiên Đồng.H` + `chinhTinh.Cự Môn.H` | TC06 | "vướng thị phi" lặp 2 câu liền |
| 13 | `chinhTinh.Tử Vi.B`, `chinhTinh.Tử Vi.H` | TC04 | "vua thiếu bề tôi" gán theo độ sáng; đúng ra là điều kiện thiếu Tả Hữu, Khôi Việt, Xương Khúc. TC04 đúng do Mệnh tình cờ thiếu các sao này; Bảo nên gắn điều kiện |
| 14 | `tuHoa.Hóa Kỵ` | TC01, TC09 | Ghi "sách gốc" thay vì tên sách: đổi thành "Toàn Thư" như MENH-HOA-04 |

## 6. Rủi ro ngoài phạm vi (chuyển Minh, Đức)

- Engine ghi Văn Khúc (H) ở Dậu (TC05) và Tý (TC09), Văn Xương (H) ở Tỵ (TC05). Một số bảng độ sáng phái Việt xếp Xương Khúc ở Tỵ, Dậu là sáng. Đề nghị Đức đối chiếu bảng độ sáng Xương Khúc trước khi Hạnh viết nhánh `H` (lỗi #1), để không sửa câu theo một nhãn sai.
- `TOI_DA_DIEM_NHAN = 3` cắt mất Thiên Không + Hồng Loan ở TC01 (MENH-SP-09). Không phải lỗi, ghi để Minh cân nhắc thứ tự ưu tiên.

Không sửa nội dung, không sửa code, không commit.
