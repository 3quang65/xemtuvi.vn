# Phúc đọc mục Kiểm chứng 2025/2026 như khách (iPhone 390x844)

Phúc (kiem-thu), 31/10/2026. Nhánh tung-l-035622, commit gốc 32834ef. Máy chủ dev cổng riêng 3777 (cờ bật) và 3778 (cờ tắt), chỉ trong tiến trình thử, đã tắt. Không sửa code.
Ảnh: `kiem-chung-thu-duyet-390-nhom-a.png` (A), `...-nhom-b.png` (B), `...-co-tat.png` (cờ tắt).

Cách chụp: trang `/lp/van-nam-2027` (lá số mẫu máy chủ), ép nhóm bằng sessionStorage `xtv.phien` (mã tính đúng hàm FNV-1a của `kiem-chung-nhom.ts`). Lá số khác (1.840 lá số, 1960–2005, 8 ngày giờ x nam/nữ) kiểm bằng gọi `xemTruocCoKiemChung` trực tiếp. Luồng `/luan-giai` cần tài khoản/DB nên không đi qua.

| Ý | Kết quả |
|---|---|
| Nhóm A thấy mục, nhóm B không | Đạt (A: 1 mục; B: 0 phần tử `.kiem-chung`) |
| M1–M7 hiện đúng | Đạt (M1, nhãn, M2+M3, M4+M5 mỗi năm, M7, trường phái). M6 thay M4 đúng ở lá số 3/2/1960 giờ 13 nam (2025) |
| 2025 và 2026 đều có M2, M3, M4 hoặc M6, M5 | Đạt (1.840/1.840 lá số mỗi năm đủ 2 câu + căn cứ) |
| Không tràn ngang | Đạt (scrollWidth = clientWidth = 390; 0 phần tử vượt mép) |
| Chữ >= 14px | Đạt (nhỏ nhất đo được 14,4px) |
| Không "phái Việt", "sức khỏe", "suôn sẻ", mã quy tắc | Đạt (regex quét 1.840 lá số x 2 năm: 0 lần) |
| Không coi 2026 là đã kết thúc | Đạt (M1, nhãn ghi "kéo đến Tết 6/2/2027"; không có "đã qua" cho 2026) |
| Tật Ách là cung Thái Tuế hoặc Hóa Lộc | Đạt. Thái Tuế ở Tật Ách: 3/2/1960 giờ 7 nam (2025). Hóa Lộc ở Tật Ách: 25/9/1960 giờ 13 nam (2026). Câu ghép đúng "nhịp sinh hoạt, cách bạn nghỉ ngơi và đối diện áp lực" |
| Cờ tắt: không mục, không khóa kiemChung | Đạt (trang không có mục; HTML không chứa "kiemChung"; đối tượng xem trước không có khóa `kiemChung`) |
| API `/api/luan-giai` khi cờ tắt | Chưa kiểm qua HTTP (cần tài khoản); kiểm ở hàm máy chủ `xemTruocCoKiemChung`, route dùng đúng hàm này |

## Lỗi (nhẹ, không chặn)
1. **Thấp, văn phong:** lặp "những" khi Hóa Lộc vào Tử Tức. M4 ghép "những chuyện về" + chủ đề "những dự án sáng tạo..." thành "những chuyện về những dự án sáng tạo". Tái hiện: lá số 3/2/1960 giờ 7 nam, đoạn 2026 (hoặc chụp A, câu 2026). Gợi ý cho Hạnh/Bảo: bỏ chữ "những" đầu chủ đề Tử Tức.
2. **Thấp, văn phong:** Thiên Di + M4 lặp "cơ hội": "cơ hội dễ đến hơn qua những chuyện về việc đi xa, môi trường mới và cơ hội đến từ bên ngoài". Tái hiện: 3/2/1960 giờ 13 nam, đoạn 2026. Gợi ý: đổi chủ đề Thiên Di thành "...và những điều đến từ bên ngoài".
3. **Lưu ý:** mục dài (~11 đoạn trên 390px, 2 năm x 2 câu + căn cứ); khách cuộn nhiều trước khi tới phần khóa. Quyết định sản phẩm, không phải lỗi.

Kết luận: ĐẠT, hai lỗi văn phong mức thấp chuyển Hạnh/Thư xem.
