# Hệ thống thiết kế xemtuvi.vn (v1)

Hướng: khách nữ 18–45, ưu tiên điện thoại. Cảm giác: tin cậy, nhẹ nhàng, học thuật nhưng gần gũi. Giá trị nằm trong `src/app/globals.css` (biến `:root`); sửa ở đó, không ghi cứng màu ở nơi khác.

## Màu (tương phản đo bằng script, đều ≥ AA 4,5:1 với chữ thường)
| Biến | Mã | Dùng cho |
|---|---|---|
| `--nen` / `--nen-sau` | #f8f4ef / #f1e9e4 | Nền trang ngà ấm / ô Thiên bàn |
| `--giay` | #fffdfb | Thẻ, phiếu, ô nhập |
| `--muc` / `--muc-nhat` | #2b2540 / #5b536c | Chữ chính / chữ phụ |
| `--ngoc` / `--ngoc-dam` | #6a3d73 / #52295c | Nút chính, viền chọn, focus (tím mận) |
| `--ngoc-nhat` | #f4ebf5 | Nền ô đang chọn, ghi chú riêng tư |
| `--vien` / `--vien-dam` | #e3d9d3 / #b9acb0 | Viền thẻ / viền ô nhập (thấy rõ) |
| `--sen` | #a8344f | Lỗi, sao hãm |
| `--hoang` | #7f5a0f | Tứ hóa, cung Mệnh |
| Ngũ hành `--kim --moc --thuy --hoa --tho` | #5f6573 #276b44 #28497e #a8344f #84571a | Màu tên sao theo hành |

Không dùng đỏ tươi/đen kịt gây cảm giác "điềm xấu"; màu hành chỉ dùng cho chữ, luôn kèm ký hiệu (Miếu/Hãm…) để không phụ thuộc màu.

## Chữ (miễn phí, có tiếng Việt)
- Thân: **Be Vietnam Pro** 400/500/600, 16px, dòng 1,6. Tiêu đề: **Noto Serif** 600, dòng 1,25 (nét serif tạo cảm giác học thuật).
- Tiêu đề trang `clamp(2.25rem, 5vw, 3.5rem)`; mục `1.5rem`; chữ phụ ≥ 0,85rem (trong ô lá số trên điện thoại 0,72–0,8rem, là mức tối thiểu).

## Khoảng cách, bo góc, đổ bóng
- Nhịp 4px: 6, 8, 12, 16, 24, 48. Lề trang 16px, rộng tối đa 1120px.
- Bo góc: ô nhập/nút 10px, thẻ 14px, phiếu 18px, bàn lá số 10px.
- Bóng `--bong`: nhẹ, một lớp mờ rộng; không viền đậm.

## Thành phần
- **Nút chính** `.nut-chinh`: nền `--ngoc`, chữ trắng, cao 52px, rê chuột đậm hơn. Mỗi màn hình chỉ một nút chính.
- **Ô nhập / chọn** : cao ≥ 48px, viền `--vien-dam`, focus viền `--ngoc` + vòng sáng 3px. Nhãn luôn hiện (không chỉ placeholder).
- **Chọn đôi** `.chon-doi`: ô to bằng nhau, đang chọn nền `--ngoc-nhat`, chữ `--ngoc-dam`.
- **Thẻ** `.chi-tiet`, `.phieu`: nền `--giay`, viền `--vien`, bóng `--bong`.
- **Ghi chú** (riêng tư, lưu ý): khối nền `--ngoc-nhat`, chữ `--ngoc-dam`, không viền trái.
- **Bàn lá số**: 4×4, viền chàm, ô được chọn tô `--ngoc-nhat` + viền trong 2px; nút đổi năm 36px.

## Điện thoại (≤ 640px)
Một cột; bàn lá số giữ 4×4, ẩn phụ tinh/sao lưu (xem ở thẻ chi tiết bên dưới khi chạm cung); mục tiêu chạm ≥ 36px (ô nhập, nút ≥ 48px). Không tràn ngang ở 375px.

## Kiểm tra
``tools/kiem-giao-dien.cjs`` (Playwright): chụp 375×812 và 1366×768, kiểm tra không tràn ngang, quét tương phản mọi chữ. Ảnh: `docs/thiet-ke/anh/` (sau), `anh-truoc/` (trước).

## Việc tiếp (ngoài phạm vi)
Trang luận giải (M2) và luồng mua (M3) dùng lại các thành phần trên; cần thêm: thẻ gói/giá, khung trích nguồn luận giải, trạng thái khóa/mở nội dung.
