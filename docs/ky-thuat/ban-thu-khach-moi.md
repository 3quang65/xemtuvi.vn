# Bản thử khách mời 50–100 người (đặc tả, việc L-de9ca7)

Cửa sổ thử 16/11–30/11/2026 (Minh chốt 30/10, khớp kế hoạch kinh doanh; trước đây ghi 25/11–5/12); sẵn sàng 13/11. Chưa mở công khai, chưa chạy quảng cáo, thanh toán vẫn giả lập, không nêu giá với khách.

## Luồng khách
1. Khách mở `/moi/<ma>` (mã do đội phát, in trong lời mời). Mã hợp lệ → ghi sự kiện `vao_moi` kèm nguồn của mã, lưu mã ở sessionStorage, chuyển về form lập lá số. Mã sai/hết hạn/hết lượt → trang báo nhẹ nhàng, vẫn cho lập lá số thường.
2. Khách lập lá số, đăng nhập thử như hiện nay (đồng ý thu liên hệ giữ nguyên).
3. Ở `/chon-goi` và `/luan-giai`, khách có mã thấy khung "Bạn được mời mở miễn phí 1 chuyên đề": chọn một trong 5 chủ đề hoặc Vận năm 2027 (chỉ khi bản nháp đã bật, xem 5) → POST `/api/ma-moi/dung {ma, laSoId, chuDe}` → cấp quyền xem như đơn 0đ, chuyển sang `/luan-giai`.
4. Mỗi tài khoản dùng mã mời **một lần** (một chuyên đề). Một mã có thể nhiều người dùng, tới `gioi_han` lượt.
5. Ở `/luan-giai` có nút **Góp ý** → mở đường dẫn biểu mẫu 6 câu (cấu hình qua biến môi trường `GOP_Y_URL`, Hoàng/Ngân cấp; chưa có thì ẩn nút). Đường dẫn gắn `?nguon=<nguon>`; không gắn ngày giờ sinh, email, tên.

## Dữ liệu
- Migration `004-ma-moi.sql`: bảng `ma_moi(ma TEXT PK, nguon TEXT, ghi_chu TEXT, gioi_han INTEGER, het_han INTEGER NULL, tao_luc)`, bảng `ma_moi_dung(id, ma, nguoi_dung_id UNIQUE, la_so_id, chu_de, luc)`. Đơn 0đ ghi vào `don_hang` với `cong='moi'`, `so_tien=0`, cấp quyền qua `xacNhanDaTra` (một chỗ duy nhất cấp quyền, giữ nguyên).
- `nguon` khớp mã `nguon=` của Hoàng: `tuvivn`, `anh`, `cd-3a`…`cd-3e`. Mã ngẫu nhiên 8 ký tự (khó đoán), không chứa thông tin cá nhân.
- Công cụ phát mã: `node tools/ma-moi.cjs tao --nguon tuvivn --so-luong 40 --gioi-han 1` và `... bao-cao`.
- **Phát mã (Sơn chạy `tao`)**: theo danh sách nguồn Hoàng gửi, mỗi nguồn một lệnh (`--nguon` đúng mã nguồn, `--so-luong` theo danh sách, `--gioi-han 1`, `--het-han` theo cửa sổ thử). Không ghi tên khách vào `--ghi-chu`. In ra `mã<TAB>đường dẫn`, gửi lại Hoàng.
- **Tra mã (Ngân)**: `node tools/ma-moi.cjs ds` in mã, nguồn, giới hạn, đã dùng, hết hạn, tình trạng (dùng được / hết lượt / hết hạn). Không in tên khách, không in ghi chú. Xem `docs/ky-thuat/cskh-cong-cu.md`.
- **Đọc báo lỗi (Ngân, 4 lần/ngày)**: `node tools/bao-loi.cjs --chua-xu-ly [--tu YYYY-MM-DD]` in mã, giờ VN, mô tả, mã đơn, gói, thiết bị, có/không liên hệ (không có ngày giờ sinh). `node tools/bao-loi.cjs lien-he <mã> --nguoi Ngân` in email/Zalo (ô khách tự điền, hoặc liên hệ đã đồng ý của tài khoản) và ghi nhật ký mỗi lần tra; `danh-dau <mã> da-xu-ly` khi xong. Form `/tro-giup#bao-loi` có ô tùy chọn 'Email hoặc Zalo để mình trả lời' (migration `010`).

## Đo theo nguồn
- Thêm sự kiện: `vao_moi` (vào bằng mã), `dung_ma_moi` (mở chuyên đề), `bam_gop_y`. Giữ quy tắc `su-kien.js`: máy chủ kiểm, không dữ liệu cá nhân; `nguon` lấy từ mã ở máy chủ, không tin máy khách.
- `tools/ma-moi.cjs bao-cao [--ngay YYYY-MM-DD]`: theo từng `nguon` in: số người vào (`vao_moi`, phiên khác nhau) · số lập lá số (`lap_la_so` của phiên đã vào bằng mã) · số mở chuyên đề · số bấm Góp ý. Số phản hồi hợp lệ do Quân lấy từ biểu mẫu (không về site).
- Mẫu < 10 phiên/nguồn: chỉ in số đếm.

## Vận năm 2027 bản nháp
- Cờ cấu hình (`VAN_NAM_THU=1`) mới cho khách mời chọn Vận năm; bật chỉ khi Thư vòng 1 đã duyệt. Bản nháp hiển thị nhãn "Bản thử".

## Nghiệm thu
- `npm test` + `npm run typecheck` + `npm run build` xanh; test mới: mã sai/hết hạn/hết lượt, dùng hai lần, mã không cấp quyền cho lá số người khác, sự kiện sai bị từ chối, báo cáo đúng số.
- 1 mã mời chạy trọn luồng trên điện thoại (375px): vào `/moi/<ma>` → lập lá số → mở chuyên đề miễn phí → thấy nội dung → bấm Góp ý. Ảnh chụp lưu trong `docs/ky-thuat/anh-ban-thu/`.
