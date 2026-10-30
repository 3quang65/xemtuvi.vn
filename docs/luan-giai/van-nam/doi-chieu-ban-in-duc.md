# Đối chiếu bản in: Tứ hóa can Nhâm, Canh và khởi tháng Giêng lưu nguyệt

Việc L-91b469 · Đức (Phòng Nghiên cứu) · 30/10/2026. Nối tiếp `kiem-nguon-duc.md` mục 4. Không sửa code, không sửa SPEC; đề xuất để Minh quyết.

## 0. Nguồn và cách đọc

| Mã | Nguồn | Cách đọc lần này |
|---|---|---|
| TB | *Tử Vi Đẩu Số Tân Biên*, Vân Đằng Thái Thứ Lang. Internet Archive `TuViDdauSoTanBien-VDThaiThuLang-DV`, tệp `…-dv01` | Đọc **ảnh trang** (leaf 13 = tr. 14): https://archive.org/download/TuViDdauSoTanBien-VDThaiThuLang-DV/Tử-Vi-Đầu-Số-Tan-Bien-Van-Đằng-Thai-Thứ-Lang-dv01_jp2.zip/Tử-Vi-Đầu-Số-Tan-Bien-Van-Đằng-Thai-Thứ-Lang-dv01_jp2%2FTử-Vi-Đầu-Số-Tan-Bien-Van-Đằng-Thai-Thứ-Lang-dv01_0013.jp2&ext=jpg ; §10.4 đọc OCR `dv01_djvu.txt` |
| KL | *Tử Vi Khảo Luận*, Hoàng Thường (Hàm Chương), IA `tuvikhaoluan` | OCR (`~/nguon-quet/KL.txt`), có câu diễn giải từng sao nên không phụ thuộc dấu chữ |
| NL | *Tử Vi Nghiệm Lý Toàn Thư*, Thiên Lương, IA `TViNghihmLToanThu-dv` tập 1–3 | OCR (`~/nguon-quet/NL1–3.txt`) |
| LS | Thư viện mã nguồn `doanguyen/lasotuvi` (Python, phái Việt), `lasotuvi/App.py` dòng 432–446 | Đọc mã |

**Lưu ý về TB:** bản trên Internet Archive là **bản dàn trang lại** (chữ in máy hiện đại, không phải ảnh quét bản in gốc 1950–1970). Không tìm thấy ảnh quét bản in gốc TB trên Internet Archive (đã tìm 3 mục, 2 mục còn lại rỗng). Số trang TB dưới đây theo số in ở chân trang của bản này.

## 1. Tứ hóa can Nhâm: Hóa Khoa là **Tả Phù** — CHỐT

| Nguồn | Nguyên văn | Vị trí |
|---|---|---|
| TB (ảnh trang) | Bảng §8.23, dòng "Nhâm │ Thiên Lương │ Tử Vi │ **Tả Phụ** │ Vũ Khúc" | tr. 14 (bảng bắt đầu ở §8.23 tr. 13) |
| KL | "Tuổi Nhâm / Lương Vi Phụ Vũ / – Thiên Lương, ngậm miệng thì có lộc. – Tử vi, tỏ ra đàng hoàng thì có địa vị. – **Tả phụ, phải khéo léo, chăm chỉ mới có danh**. – Vũ khúc, quá mưu mô, lý tài thì không thành công." | mục Tứ hóa, tr. 363–365 (khối Nhâm nằm sau dấu trang 364) |
| NL tập 3 | Bảng: "Nhâm │ Lương │ Vi │ **Phụ** │ Vũ" | dấu trang 194 (bảng tr. 194–195) |
| NL tập 3 | "Ngắm trong hàng 14 chính tinh thấy có 3 sao từ chối thi thố khả năng nên vắng mặt như: a- **Thiên Phủ** … b- Thiên tướng … c- Thất Sát … Vậy chỉ còn 11 sao đối với thập can" | tr. 209–210 |
| NL tập 3 | "Tả Hữu đã khoác áo Khoa thực thi rất tài danh trong 2 tuổi **Mậu và Nhâm** … Nhâm đắc Thiên Lương giữ gìn Lộc, Tử Vi chấp chánh Quyền …, **Tả Phù** có phần dễ dàng đủ tài an ủi Vũ Khúc bị Kỵ … Tả Phù phải đủ khả năng như đệ nhị Thiên Phủ" | tr. 210–211 |
| Đối chiếu Trung Quốc | TT, iztro: 壬 梁紫**左**武 (Khoa Tả Phù) | `kiem-nguon-duc.md`, SPEC 5.8 |

**Kết luận:** ba sách Việt độc lập (Thái Thứ Lang, Hoàng Thường, Thiên Lương) và sách Trung Quốc đều cho Nhâm hóa Khoa **Tả Phù**. NL còn nói thẳng Thiên Phủ **không bao giờ** nhận Tứ hóa. Không có sách nào trong bộ nguồn ghi Thiên Phủ.

**Nguồn gốc nhầm (giả thuyết):** khẩu quyết "Lương Vi **Phụ** Vũ" (Tả Phụ) dễ đọc thành "Phủ" (OCR NL3 dòng 9577 cũng ra "Lương Vi Phủ Vũ"). Thư viện LS (`lasotuvi`, App.py dòng 445: `viTriHoaKhoa = viTriThienPhu`) dùng Thiên Phủ, có thể là chỗ engine/SPEC chép theo. Đây là lỗi lan truyền trong phần mềm, không phải một trường phái có sách.

**Engine hiện tại: SAI.** `src/lib/tuvi/tuvi-raw.js` dòng 84: `['thienLuong', 'tuVi', 'thienPhu', 'vuKhuc']` → cần `taPhu`. Ảnh hưởng: mọi lá số **sinh năm Nhâm** và **lưu Tứ hóa năm xem Nhâm** (dòng 362 dùng cùng bảng; năm Nhâm gần nhất 2032).

**Mức chắc chắn: cao** (3 sách Việt + TT, có câu diễn giải không phụ thuộc OCR, có ảnh trang TB).

## 2. Tứ hóa can Canh: hai phái thật, giữ bảng Việt — CHƯA CHỐT TUYỆT ĐỐI

| Nguồn | Khoa | Kỵ | Nguyên văn, vị trí |
|---|---|---|---|
| KL | Thiên Đồng | **Thái Âm** | "Tuổi Canh / Nhật Vũ Đồng Âm / … Thiên đồng: uyển chuyển khéo léo thì có danh. … Thái âm: ham tiền quá sẽ bị chê cười." tr. 364–365 |
| NL tập 3 | Thiên Đồng | **Thái Âm** | Bảng "Canh │ Nhật │ Vũ │ Đồng │ Âm" (tr. 194–195); "Canh: Nhật Vũ Đồng Âm: khiêm tốn đắc vinh" (tr. 197); "Thái Âm … Kỵ (Ất và Canh)" (tr. 209) |
| LS (mã nguồn Việt) | Thiên Đồng | Thái Âm | App.py dòng 432–436 |
| TB (ảnh trang, bản dàn lại) | **Thái Âm** | **Thiên Đồng** | Bảng §8.23 tr. 14: "Canh │ Thái Dương │ Vũ Khúc │ Thái Âm │ Thiên Đồng" |
| TT, iztro (Trung Quốc) | Thái Âm | Thiên Đồng | "庚日武陰同為首" (`kiem-nguon-duc.md`) |

TB bản này **có lỗi dàn trang chứng minh được ngay trong cùng bảng**: dòng Tân ghi Quyền "Thiên Lương" (mọi nguồn, kể cả KL "Cự Dương Khúc Xương", đều là Thái Dương). Vì vậy TB bản dàn lại không đủ tin để làm trọng tài cho Canh; cần ảnh quét bản in gốc TB (chưa tìm được).

**Kết luận:** Canh là **tranh cãi hai phái thật**: Việt (KL, NL, LS) "Nhật Vũ Đồng Âm" — Khoa Đồng, Kỵ Âm; TT/Trung Quốc (và TB bản dàn lại) — Khoa Âm, Kỵ Đồng. **Engine hiện tại: ĐÚNG theo bảng Việt** (dòng 83 `['thaiDuong','vuKhuc','thienDong','thaiAm']`). Đề xuất sản phẩm: giữ mặc định Việt, ghi rõ "can Canh các sách khác nhau" (đúng như `kiem-nguon-duc.md` Q1 đã làm); nếu sau này có ảnh quét TB gốc ghi Âm Khoa thì cân nhắc thêm tùy chọn `tuHoaCanh`. **Mức chắc chắn: trung bình–cao** cho việc giữ bảng Việt.

## 3. Khởi tháng Giêng lưu nguyệt: **từ cung tiểu hạn** (sách Việt) — engine dùng Thái Tuế

| Nguồn | Nguyên văn | Vị trí |
|---|---|---|
| TB §10.4 | "Muốn tính lưu nguyệt hạn, phải khởi hạn, có ba cách: – **Bắt đầu từ cung đã ghi được lưu niên tiểu hạn kể là tháng Giêng, đếm theo chiều nghịch đến tháng sinh**, ngừng lại ở cung nào, kể cung đó là giờ Tý, rồi đếm theo chiều thuận đến giờ sinh, ngừng lại ở cung nào, kể cung đó là tháng Giêng … [cách 2: thuận đến tháng sinh rồi thuận đến giờ sinh; cách 3: cung tiểu hạn là tháng Giêng] … Nhưng **thường người ta hay dùng cách thứ nhất**." | Phần 1, tr. 23 theo số trang bản dàn lại (`kiem-nguon-duc.md` ghi tr. 21 — đính chính) |
| KL | "III. NGUYỆT VẬN: Sau khi đã ghi **tiểu vận** Quí Mùi (2003) cho tuổi Đinh Dậu tại cung Dậu, lấy cung này là tháng thứ nhất, đếm nghịch tới tháng sinh, ngưng ở cung nào gọi là giờ Tí, từ giờ Tí đếm thuận tới giờ sinh, ngưng ở cung nào cung ấy là tháng Giêng." Ví dụ: tiểu vận ở **Dậu** trong khi Thái Tuế năm 2003 ở **Mùi** → rõ ràng không lấy Thái Tuế. | tr. 77–78 |
| TB §8.35 | Đẩu Quân: "Bắt đầu từ cung đã an **Thái Tuế** kể là tháng Giêng, đếm theo chiều nghịch đến tháng sinh … thuận đến giờ sinh … an Đẩu Quân" — đây là **sao** Đẩu Quân của lá số gốc, TB không dùng để khởi lưu nguyệt | Phần 1, §8.35 |
| NL tập 2 | Bác cả hai lối tính theo cung tiểu hạn ("tiểu hạn ở năm Mùi thì lấy ngay cung Mùi làm tháng giêng, hoặc lấy cung Mùi làm đích tính nguyệt nghịch thời thuận… Xem ra chỉ là một lối làm theo ý riêng của từng người. **Tháng Giêng đã gọi là tháng Dần**") | tr. 135–136 |
| NL tập 1 | Đẩu Quân "lấy Thái Tuế làm đích tính nghịch theo tháng, thuận theo giờ", gọi là "Nguyệt tướng" (chỉ nói ý nghĩa sao, không hướng dẫn khởi lưu nguyệt) | tr. 41–42 |
| TT (Trung Quốc) | 斗君 khởi từ cung lưu niên Thái Tuế là tháng Giêng (`kiem-nguon-duc.md` mục 4) | — |

**Kết luận:** có ba cách thật.
- **Việt (TB cách 1, KL): khởi từ cung tiểu hạn** của năm xem, nghịch đến tháng sinh, thuận đến giờ sinh. Hai sách Việt độc lập khớp nhau, TB ghi là cách phổ biến.
- **Trung Quốc (TT): Đẩu Quân năm xem** = khởi từ cung Thái Tuế (chi năm xem), cùng cách đếm.
- **NL (Thiên Lương): tháng Giêng cố định ở cung Dần** (thiểu số, bác cả hai cách trên).

**SPEC 7.5** ("Phái Việt dùng Đẩu Quân … từ cung Lưu Thái Tuế") và **engine** (`src/lib/tuvi/tuvi-raw.js` dòng 370–372: `m(y − (thang − 1) + gio + t − 1)` với `y` = chi năm xem) **SAI nhãn và SAI so với phái Việt TB/KL**; engine đang tính theo cách TT. Hai cách chỉ trùng nhau khi cung tiểu hạn trùng cung Thái Tuế.

**Đề xuất sản phẩm:** mặc định theo TB/KL: `cung tháng t = m(TH − (M − 1) + H + (t − 1))`, `TH` = cung tiểu hạn năm xem (engine đã có biến `tieuHan`, dòng 365–368). Giữ cách Thái Tuế làm tùy chọn `luuNguyet: 'dauQuanThaiTue'` trong `QUY_UOC_MAC_DINH`, ghi rõ "theo Toàn Thư". Nội dung luận vận tháng phải ghi "theo TB, KL". **Mức chắc chắn: cao** (2 sách Việt nguyên văn, có ví dụ số).

## 4. Việc kéo theo (Minh quyết, chuyển Kỹ thuật/Đức)

1. Engine: Nhâm Khoa → `taPhu` (dòng 84); lưu nguyệt khởi từ tiểu hạn (dòng 370–372). Chạy lại test lá số tuổi Nhâm và vận tháng.
2. SPEC 5.8, 10.4 (Nhâm), 7.5 và hàng Đẩu Quân (dòng 406); skill `~/vanphongai/skills/tuvi-an-sao` (SKILL.md dòng 30, `references/chi-muc-spec.md` dòng 56); `docs/nghien-cuu/tuvi-ref-engine.py`; câu ở `src/lib/goi.ts` dòng 158 ("Tứ hóa năm Canh, Nhâm khác một số sách Trung Quốc" — sau khi sửa chỉ còn Canh khác).
3. Hạnh: rà đoạn luận gắn "Hóa Khoa Thiên Phủ tuổi Nhâm" và NAM-THANG-01/NAM-TRANH-04 theo mục 3.
