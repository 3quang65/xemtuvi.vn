# Định dạng bài và đoạn mẫu "Vận năm 2027" (việc T-23a91b)

Theo định dạng quy tắc bản 2 (`docs/luan-giai/quy-tac-v2/DINH-DANG.md`) và bộ đại vận (`src/lib/luan-giai/ai/quy-tac-van/van-10-nam.json`), thêm các trường cho lớp năm. Quy tắc gốc: `QUY-TAC.md` (mã NAM-…). Dữ liệu lá số mẫu: `du-lieu.md` (sinh bằng `node tools/du-lieu-van-nam.cjs 2027`).

## File
| File | Nội dung |
|---|---|
| `QUY-TAC.md` | Quy tắc luận năm Đinh Mùi (NAM-PP, TH, TT, HOA, LUU, MANG, THANG, CAM, TRANH) có nguồn, trường phái. |
| `doan-mau.json` | 76 đoạn mẫu theo khóa, máy đọc (định dạng dưới). |
| `du-lieu.md` | Dữ liệu engine của 3 lá số giả lập VN01–VN03. |
| `VN01.md`–`VN03.md` | 3 bài mẫu đủ khung. |
| `TU-KIEM.md` | Tự chấm theo thang `docs/luan-giai/kiem-duyet-dai-van.md`. |
| `tools/kiem-van-nam.cjs` | Kiểm tự động: mã quy tắc có thật, nguồn đúng tên, từ cấm, khung bài. |

## Khung bài (thứ tự cố định)
0. **Đầu bài**: thông tin sinh (bài mẫu: ghi "giả lập"), năm Đinh Mùi 6/2/2027–25/1/2028, câu NAM-CAM-04 "Nội dung do hệ thống tạo…".
1. **Tổng quan năm** (`muc: tong-quan`), các `phan` theo thứ tự: `boi-canh` (đại vận đang đi, trùng cung) → `thai-tue` (trọng điểm năm) → `tieu-han` (việc riêng) → `tu-hoa` (lưu tứ hóa can Đinh, chồng lớp) → `sao-luu`. Kết bằng **Tóm lại** 2–3 câu (tổng hợp, ghi rõ là tổng hợp trong mã).
2. **Bốn mảng**: `su-nghiep`, `tai-chinh`, `tinh-cam`, `suc-khoe`. Mỗi mảng: *Nền* (1 câu từ quy tắc 12 cung) + *Năm nay* (đoạn khớp lớp năm) + *Gợi ý*. Không có yếu tố năm → dùng `NAM-MANG-01-<X>-NEN`.
3. **12 tháng** (`muc: thang`): bảng hoặc danh sách T1–T12, mỗi tháng 2–3 câu: chủ đề (`NAM-THANG-03-<CUNG>`) + 1 điểm từ sao cung tháng/sao lưu + 1 gợi ý. Đánh dấu "tháng mốc" theo NAM-THANG-04.
4. **Ghi chú trường phái** (khi dùng NAM-HOA-08 hoặc chạm NAM-TRANH).
5. Mã quy tắc trong `<!-- quy tắc: … -->` sau mỗi đoạn (ẩn với khách).

Bản miễn phí (xem trước): đầu bài + đoạn `thai-tue` + 1 điểm thuận + tên 12 cung tháng (không nội dung tháng). Không dùng câu gây lo để kéo mua (NAM-CAM-03).

## Một đoạn mẫu (JSON)
```json
{
 "chuyenDe": "van-nam", "namXem": 2027, "truongPhai": "Tam hợp phái Việt",
 "id": "NAM-TT-01-TU", "lop": "thai-tue", "cung": "Lưu Thái Tuế", "loai": "YN",
 "maNghienCuu": ["NAM-TT-01", "NAM-PP-07", "VAN-CUNG-06"],
 "dieuKien": [{ "tenCung": ["Tử Tức"] }], "khong": [],
 "muc": "tong-quan", "phan": "thai-tue",
 "noiDung": "Năm Đinh Mùi, Lưu Thái Tuế đến cung Mùi, trên lá số của bạn là cung Tử Tức. …",
 "nguon": ["Đặc tả an sao xemtuvi.vn", "Tư liệu web: iztro \"运限\"", "…"],
 "nguonChiTiet": "SPEC 7.3; WV1; VAN-CUNG-06", "tongHop": true
}
```

## Trường mới so với quy tắc bản 2
| Trường | Ý nghĩa |
|---|---|
| `chuyenDe` | Luôn `van-nam`. `namXem`: năm âm lịch (2027). Đoạn dùng cho năm khác phải viết lại phần phụ thuộc can chi (vị trí sao lưu, lưu hóa). |
| `lop` | Cung gốc để tính vị trí: `tieu-han` (cung `tieuHan`), `thai-tue` (cung `luuThaiTue`), `dai-van` (cung `daiVan`), `thang` (cung `luuNguyet[t-1]`, chạy 12 lần), `cung-goc` (cung tên `cung`; `cung: "*"` = mọi cung, bộ ghép thử từng cung và thay `{cung}` bằng tên cung chức năng), `nam` (không cần cung). |
| `phan` | Thứ tự trong mục tổng quan (xem khung). |
| `tongHop` | `true` nếu dựa trên dòng ⚑ của QUY-TAC (áp dụng tương tự, chưa có câu sách trực tiếp). Kiểm duyệt ưu tiên đọc các đoạn này. |
| `ghiChu` | Nội bộ, không hiện. |

## Điều kiện mới (bổ sung cho bảng điều kiện bản 2)
| Trường | Ý nghĩa |
|---|---|
| `tenCung` | Tên cung chức năng gốc của cung đang xét (vd cung Lưu Thái Tuế là `Tử Tức`). |
| `trung` | Cung gốc của `lop` trùng cung lớp khác: `dai-van`, `tieu-han`, `thai-tue`. |
| `saoLuu` | Có sao lưu (tên đúng engine `saoLuu[].ten`, vd `L. Lộc Tồn`) ở cung trong `viTri` (mặc định `chinh`). Dùng chung `toiThieu`. |
| `luuHoa` | Có lưu hóa này ở cung trong `viTri`; có `sao` thì `sao[0]` phải mang lưu hóa này (engine `luuTuHoa[].sao`). Kết hợp được với `hoa` (hóa gốc) và `doSang`. |
| `chiNamSinh` | Chi năm sinh, vd `["Mùi","Hợi","Mão"]` (NAM-TT-05). |
| `khongCoYeuToNam` | `true` khi cung không là tiểu hạn/Thái Tuế/đại vận, không có lưu hóa, sao lưu, kể cả ở xung chiếu (NAM-MANG-01). |
| `nhom` + `toiThieu` | Mảng các nhóm sao; cần ≥ `toiThieu` **nhóm** có ít nhất một phần tử trong `viTri`. Phần tử dạng `Tên sao`, `Tên sao:sáng` (Miếu/Vượng/Đắc), `hoa:<hóa gốc>`, `luuHoa:<hóa năm>` (NAM-TH-04). |
| `sao` chứa tên `L. …` | Cho phép trộn sao gốc và sao lưu trong `toiThieu` (vd NAM-TH-04). |

## Ghép bài (gợi ý cho Kỹ thuật, không sửa engine)
1. `luuNien(ls, 2027, true)` → xác định cung của từng `lop`.
2. Lọc đoạn khớp điều kiện; với `cung: "*"` thử 12 cung, thay `{cung}`.
3. Xếp theo khung; mỗi `phan`/mảng tối đa 3 đoạn, ưu tiên theo NAM-PP-10 (chính tinh > Tứ hóa gốc > lưu hóa > sao lưu > vòng Thái Tuế).
4. Đoạn chính tinh tại cung năm: dùng lại bộ `van-10-nam.json` (VAN-CT) với `cungVan` thay bằng cung tiểu hạn/Thái Tuế, đổi "giai đoạn 10 năm" → "năm nay" (NAM-PP-06). Bộ ghép cần bảng thay chữ này.
5. Đoạn **Tóm lại** và **Gợi ý** của từng mảng hiện viết tay trong bài mẫu (nhận xét tổng hợp); bản AI sẽ sinh từ các đoạn đã khớp theo prompt, không thêm ý ngoài quy tắc.
