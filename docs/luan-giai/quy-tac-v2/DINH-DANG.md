# Định dạng quy tắc luận giải bản 2 (việc L-90ad99)

Bộ quy tắc máy đọc cho 3 chuyên đề (Mệnh, Quan Lộc, Phu Thê), chuyển từ `docs/nghien-cuu/luan-giai-12-cung.md`.
Thay `src/lib/luan-giai/ai/quy-tac.json` khi bộ ghép mới chạy (bước 3, Bảo). Bộ khớp: `src/lib/luan-giai/ai/khop-v2.ts`.

## File
- `src/lib/luan-giai/ai/quy-tac-v2/menh.json`, `quan-loc.json`, `phu-the.json`: quy tắc của từng chuyên đề.
- `src/lib/luan-giai/ai/quy-tac-v2/cach-cuc.json`: 10 cách cục ưu tiên × 3 chuyên đề (kể cả phá cách).
- Bản nháp tách tự động (đầu vào để soạn): `docs/luan-giai/quy-tac-v2/nhap/<MENH|QUAN|PHU|CHUNG|DI|TAI|PHUC>.json`, sinh bằng `python3 -I scripts/luan-giai/tach-nghien-cuu.py`.
- Nghiệm thu: `node --test tests/quy-tac-v2.test.cjs` (lọc khi soạn từng phần: `QT_TEP=menh.json QT_MIN=140 node --test tests/quy-tac-v2.test.cjs`).

## Một quy tắc
```json
{
  "id": "MENH-TV-01-TOT",
  "chuyenDe": "menh",
  "cung": "Mệnh",
  "loai": "CT",
  "maNghienCuu": ["MENH-TV-01"],
  "dieuKien": [{ "sao": ["Tử Vi"], "doSang": ["Miếu", "Vượng", "Đắc"] }],
  "khong": [{ "sao": ["Địa Không", "Địa Kiếp"], "toiThieu": 1 }],
  "muc": "tong-quan",
  "noiDung": "Tử Vi sáng ở Mệnh: …",
  "nguon": ["Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)", "Tử Vi Đẩu Số Toàn Thư (Hy Di Trần Đoàn)"],
  "nguonChiTiet": "TB (Đặc tính tinh đẩu — Tử Vi); TT (Mệnh cung — Tử Vi)",
  "truongPhai": "Tam hợp phái Việt"
}
```

| Trường | Ý nghĩa |
|---|---|
| `id` | Duy nhất. Lấy mã nghiên cứu chính + hậu tố (`-TOT`, `-HAM`, `-C-TOT`, `-PHA`…). |
| `cung` | Cung gốc để tính vị trí. Thường là cung chính của chuyên đề; cách cục có thể đặt `Mệnh` cho cả 3 chuyên đề. |
| `loai` | `YN` ý nghĩa cung · `CT` chính tinh tọa thủ · `C` chính tinh ở cung hợp chiếu · `SP` sao phụ · `CC` cách cục · `HOA` Tứ hóa · `TUAN` · `TRIET` · `VCD` vô chính diệu. |
| `maNghienCuu` | ≥ 1 mã có thật trong `luan-giai-12-cung.md` (MENH-…, QUAN-…, PHU-…, CHUNG-…, DI-…). Quy tắc mới viết (câu C bản hãm, sao phụ theo chuyên đề) dẫn mã nghiên cứu làm căn cứ. |
| `dieuKien` | Mảng điều kiện, **tất cả** phải đúng. Rỗng = luôn khớp (chỉ dùng cho `YN`, tối đa 2 quy tắc/chuyên đề). |
| `khong` | Không điều kiện nào được đúng (loại trừ, phá cách). |
| `cachCuc`, `phaCach`, `uuTien` | Chỉ cho `CC`: tên cách đúng danh mục dưới; `phaCach: true` cho quy tắc bị phá; `uuTien: 100` để lên đầu bài. |
| `muc` | Mục trong `chuyen-de.json` (menh: tong-quan, cung-lien-quan, tu-hoa, phu-tinh; quan-loc, phu-the: phong-cach, cung-lien-quan, tu-hoa, phu-tinh). |
| `noiDung` | Câu cho khách, ≥ 40 ký tự, giọng "hiểu mình, định hướng", qua được `tu-cam.json`. Không đuôi khuôn "góp thêm sắc thái…", "Độ sáng tốt, nên phát huy chủ động". |
| `nguon` | Tên sách đầy đủ, đúng một trong: Tử Vi Đẩu Số Toàn Thư (Hy Di Trần Đoàn) · Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang) · Tử Vi Nghiệm Lý Toàn Thư (Thiên Lương) · Tử Vi Chỉ Nam (Song An Đỗ Văn Lưu) · Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương) · Tử Vi Hàm Số (Nguyễn Phát Lộc) · Trung Châu phái (Vương Đình Chi) · Phi tinh – Tứ Hóa phái · Đặc tả an sao xemtuvi.vn. Chỉ có nguồn web: `"Tư liệu web: <tên trang/bài>"`. |
| `nguonChiTiet` | Thiên/chương như trong bản nghiên cứu (không bịa số trang). Nội bộ, không hiện cho khách. |

## Một điều kiện
| Trường | Ý nghĩa |
|---|---|
| `viTri` | So với `cung`: `chinh` (mặc định) · `xung` (cung đối) · `tam-hop` (2 cung tam hợp) · `hop-chieu` (xung + tam hợp) · `tam-phuong` (chính + xung + tam hợp) · `giap` (2 cung kề). |
| `sao` | Các sao phải **cùng ở một cung** trong vị trí. `sao[0]` là sao được xét độ sáng/hóa. Tên đúng engine (Tử Vi, Kình Dương, Đà La, Địa Không, Địa Kiếp, Hỏa Tinh, Linh Tinh, Văn Xương, Văn Khúc, Tả Phù, Hữu Bật, Thiên Khôi, Thiên Việt, Lộc Tồn, Thiên Mã, Đào Hoa, Hồng Loan, Thiên Hỷ, Thiên Riêu, Thiên Hình, Cô Thần, Quả Tú, Thiên Không, Kiếp Sát, Tang Môn, Bạch Hổ…). |
| `rai` | `true`: các sao trong `sao` rải ở bất kỳ cung nào thuộc vị trí (dùng cho cách cục). |
| `toiThieu` | Chỉ cần ≥ n sao trong `sao` có mặt (rải trong vị trí). Không dùng chung với `doSang`, `hoa`. |
| `doSang` | Độ sáng của `sao[0]`: Miếu, Vượng, Đắc, Bình, Hãm (theo bảng spec mục 6, engine tính sẵn). |
| `hoa` | `sao[0]` mang hóa này; không có `sao` thì: cung nào trong vị trí có sao mang hóa này. |
| `chi` | Địa chi của cung chứa sao, vd `["Dần","Thân"]`. |
| `tuan`, `triet`, `voChinhDieu` | Cung (chứa sao, hoặc trong vị trí) có Tuần / Triệt / không có chính tinh. |
| `gioiTinh` | `Nam` / `Nữ`. |
| `canNam` | Can năm sinh, vd `["Đinh"]`. |

Ví dụ: Sát Phá Tham ở tam phương Mệnh: `{"sao":["Thất Sát","Phá Quân","Tham Lang"],"rai":true,"viTri":"tam-phuong"}`, đồng thời `{"sao":["Thất Sát"],"viTri":"tam-phuong"}` không cần thêm. Phá cách: thêm quy tắc `phaCach: true` với điều kiện `{"sao":["Địa Không","Địa Kiếp","Kình Dương","Đà La"],"toiThieu":2,"viTri":"tam-phuong"}`. Không Kiếp giáp Mệnh: `{"sao":["Địa Không","Địa Kiếp"],"rai":true,"viTri":"giap"}`.

Điều kiện không biểu diễn được (sinh ngày/đêm, tuổi, hạn, số lượng con…) thì không chuyển; ghi vào danh sách "không chuyển" trong báo cáo kèm lý do.

## 10 cách cục ưu tiên (tên `cachCuc` đúng chính tả)
Tử Phủ Vũ Tướng · Sát Phá Tham · Cơ Nguyệt Đồng Lương · Cự Nhật · Hỏa Tham / Linh Tham · Tử Phá · Cơ Lương · Nhật Nguyệt · Tham Đào · Không Kiếp giáp / chiếu

## Nghiệm thu (test tự động)
≥ 150 quy tắc/chuyên đề (gồm phần cách cục) · 100% có mã nghiên cứu thật + ≥ 1 nguồn đúng tên · 0 "Thái Thúc" · đủ 10 cách × 3 chuyên đề, mỗi cách có phá cách · Tuần, Triệt tách câu · sạch từ cấm · ≤ 5% quy tắc không khớp lá số nào trong 2.500 lá số ngẫu nhiên.
