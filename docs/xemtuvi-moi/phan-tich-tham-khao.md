# Phân tích tham khảo: laso-battu.netlify.app (L-1da39f)

Nguồn: HTML trang chủ tải 1/11/2026 (≈49 KB, một tệp, CSS/JS nhúng). Chưa vào được phần ứng dụng sau trang chủ.

**Lưu ý:** đây là site **Bát Tự** (4 trụ), không phải Tử Vi 12 cung. Chỉ học được phong cách và cách tổ chức, không học được lưới 12 cung.

## Cấu trúc
Thanh trên (logo, nút "Cài ứng dụng" PWA) → hero (tiêu đề, mô tả, 2 nút, hình cuộn giấy 4 trụ) → 3 số liệu → lịch âm có nút tháng trước/sau → 4 dải nội dung (vì sao, công năng, so sánh, cà phê) → chân trang, hộp thoại nhật ký cập nhật.

## Tương tác & hiệu ứng
- Hình "cuộn giấy" mở ra khi vào trang (`unroll` 0,9 s); hộp thoại hiện 0,18 s; hover nền 0,12–0,15 s. Hiệu ứng chỉ bật khi `prefers-reduced-motion: no-preference`.
- Hỗ trợ tối tự động (`prefers-color-scheme`). Điểm gãy: 760 / 480 / 420 px.
- Màu theo ngũ hành cho từng chữ trụ (`ch e-Kim`…). Nền giấy, chữ thư pháp (Ma Shan Zheng), tiêu đề Alegreya, thân Be Vietnam Pro.

## Áp dụng cho xemtuvi mới
| Nên lấy | Không lấy |
|---|---|
| Màu chữ theo hành (đã có trong hệ thiết kế v1) | Tông vàng đỏ giấy cổ: lệch hướng khách nữ 18–45, tím mận |
| Hiệu ứng mở một lần, tôn trọng giảm chuyển động | Chữ thư pháp Trung Hoa |
| Nút cài PWA, chế độ tối | Cà phê/ủng hộ: ngoài mô hình doanh thu |
| Ô lịch có nút điều hướng | Hộp thoại nhật ký (để sau) |

## Đã dựng (nhánh quan-l-1da39f)
- `src/styles/xemtuvi-moi/tokens.css`: token màu/chữ lấy từ `he-thong-thiet-ke.md`, tiền tố `--xtv-`.
- `src/lib/xemtuvi-moi/view.ts`: nối engine (`@/lib/tuvi`) → mô hình hiển thị; `VI_TRI_CHI` là địa bàn 4×4.
- `src/components/xemtuvi-moi/`: `LaSoGrid` (12 cung + thiên bàn giữa, chọn cung), `CungO`. CSS `la-so-grid.css`: điện thoại ẩn phụ tinh, tràn mép.
- Test `tests/xemtuvi-moi-view.test.cjs` (4 ca).

## Chưa làm / chờ mockup
Bảng chi tiết cung, đại vận/lưu niên, đường tam hợp, giao diện cuối, gắn route v3.xemtuvi.vn. Chưa nhúng vào trang nào; chưa chụp ảnh 375/1366 px (chưa có route để chụp).
