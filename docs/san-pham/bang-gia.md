# Bảng giá MVP (L-771c02) — đã chốt bản 1

Căn cứ: `vanphongai/nghien-cuu-thi-truong/2026-10-30-luong-mua-gia-doi-thu.md` mục 2–3 (repo riêng tư).
Mặt bằng lần mua đầu của đối thủ 35k–129k; mở lẻ 9k/mục; chưa ai có gói năm; giá gạch 50–67% phổ biến.

## Ba bậc

| Bậc | Mã | Giá | Gồm |
|---|---|---|---|
| Mở một chủ đề | `mot-chu-de` | **29.000đ** / một lần | Luận sâu 1 chủ đề tự chọn: Bản thân · Tình cảm · Sự nghiệp (Tài chính, Gia đạo mở khi qua kiểm duyệt). Ghi sao, cung, nguồn. |
| Trọn lá số — **Khuyên dùng** | `tron-la-so` | **99.000đ** / một lần | Ba cung trọng yếu (Mệnh, Quan Lộc, Phu Thê) + vận 10 năm hiện tại (đại vận). Ghi sao, cung, trường phái. Xem lại không giới hạn thời gian khi đăng nhập tài khoản. |
| Thành viên năm | `thanh-vien-nam` | **299.000đ** / năm (≈ 25.000đ/tháng) | Trọn lá số của bạn + luận vận năm + lưu nguyệt từng tháng + hỏi đáp về lá số 5 câu/tháng + trọn lá số cho 2 người thân. |

Vận năm 2027 (`van-nam-2027`, giá nháp 39.000đ, chờ duyệt 49.000đ) và gói gộp `tron-la-so-kem-van-nam` 129.000đ, bán đến hết 6/2/2027 (`banDen`, máy chủ từ chối đơn sau ngày đó).
Điều kiện xem lại: hằng `DIEU_KIEN_XEM_LAI` trong `goi.ts` (L-44c062 theo trang giá v4: câu Thành viên năm chỉ ghép khi gói năm mở), hiện ở /chon-goi và bước xác nhận xóa ở /toi.

## Lý do chọn số
- **29k chủ đề**: đủ thấp để thử (gần 20–35k của Mèo Béo), nhưng 4 chủ đề = 116k > 99k → khách muốn xem nhiều tự thấy gói trọn lá số lợi hơn. Không hạ về 9k: định vị học thuật, không cạnh tranh giá rẻ nhất.
- **99k trọn lá số**: giữa giaimalaso 79k (không ghi nguồn) và xem-tuvi 129k (giá thật sau giá gạch). Dưới ngưỡng 100k. Thương hiệu mới, chưa có đánh giá khách → chưa nên vào 129k; thử 129k ở vòng sau.
- **299k năm**: bằng 3 lá số mua lẻ (3 × 99k = 297k) đã gần đủ giá, cộng thêm vận năm, lưu nguyệt, hỏi đáp. So sánh này đúng thật nên được ghi trên thẻ gói. Thấp hơn gói 5 năm 350k của xem-tuvi.
- Chi phí AI: hỏi đáp giới hạn 5 câu/tháng để chặn trần chi phí token mỗi thành viên.

## Quy tắc trình bày
- **Không giá gạch, không đếm ngược, không "sale"**. Chỉ một giá, ở một chỗ: `src/lib/goi.ts`. Mọi trang (chọn gói, thanh toán, FAQ sau này) đọc từ đó.
- Được ghi so sánh có thật: "≈ 25.000đ/tháng", "Mua lẻ 3 lá số đã là 297.000đ".
- Gói giữa có nhãn "Khuyên dùng", nút chính duy nhất; hai gói còn lại nút phụ.
- Không bán "hóa giải/giải hạn" trong bất kỳ bậc nào.

## Phụ thuộc nội dung (trước khi thu tiền thật)
Vận năm, lưu nguyệt, hỏi đáp và đại vận chưa có nội dung. Bản thử (thanh toán giả lập) vẫn hiện đủ quyền lợi để đo lựa chọn; phải làm xong nội dung trước khi bật thu tiền thật.

## Đo lường
Sự kiện `chon_goi`, `vao_thanh_toan`, `thanh_toan_xong` mang thêm `goi` (mã gói, kiểm tra theo danh sách); máy chủ tự ghi `gia` tra từ `goi.ts` lúc ghi (đổi giá không làm sai số cũ). `chon_goi` gói chủ đề mang thêm `chuDe`.
`node tools/pheu.cjs` in thêm:
- Tỉ lệ chọn từng bậc (trên số phiên `thanh_toan_xong`, và trên `chon_goi`).
- Giá trị đơn trung bình (trung bình `gia` của các phiên `thanh_toan_xong`).
- Tỉ lệ chọn gói năm. Chủ đề được chọn nhiều nhất.

## Ngưỡng ra quyết định (sau ≥ 200 phiên `thanh_toan_xong` giả lập)
Thanh toán giả lập chỉ đo ý định, tỉ lệ thật sẽ thấp hơn → dùng để so **tỉ trọng giữa các bậc**, không dự báo doanh thu.

| Kết quả | Hành động |
|---|---|
| Chủ đề > 60% số đơn | Gói lẻ đang "ăn" gói chính → nâng chủ đề lên 39k hoặc làm rõ lợi ích trọn lá số |
| Trọn lá số 40–55%, đơn TB ≥ 90k | Giữ; vòng sau thử 99k vs 129k cho gói chính |
| Gói năm < 3% | Sửa quyền lợi gói năm (thêm lá số người thân, bỏ hỏi đáp…) hoặc thử 199k |
| Gói năm ≥ 10% | Tín hiệu tốt cho khoảng trống thị trường → ưu tiên làm nội dung lưu nguyệt |

## Màn chào bán "đáng tin" (L-8ad80c)
- **Đoạn mẫu từ chính lá số khách** (`src/lib/luan-giai/doan-mau.js`, dữ liệu `doan-mau.json` sinh bởi `tools/tao-du-lieu-luan-giai.cjs`): ưu tiên "Thiên hướng và phong cách" ở Quan Lộc (trung tính, không mở đầu bằng câu nặng), rồi quy tắc riêng Phu Thê, rồi Quan Lộc. Chỉ nhận điều kiện máy đọc chắc chắn (sao đơn đúng chi, cặp sao); điều kiện có sát tinh, Tuần Triệt… bỏ qua để không áp sai. Độ phủ ≈ 87% lá số; còn lại dùng ví dụ minh họa có ghi rõ.
- **Nhãn phương pháp/nguồn** và **câu hoàn tiền**: hằng `PHUONG_PHAP`, `HOAN_TIEN` trong `src/lib/goi.ts` (một chỗ, mọi trang đọc từ đó).
- **Cấm** "hóa giải/giải hạn" và cấm ghi số tiền ngoài `goi.ts`: kiểm bằng `tests/man-chao-ban.test.cjs`.
- **Đo**: `node tools/pheu.cjs` in `chon_goi / vao_chon_goi` (bấm mua trên màn chào bán), tỉ lệ bỏ giữa chừng ở thanh toán, `bao_loi / thanh_toan_xong` (khiếu nại, nút "Báo lỗi" ở trang luận giải).
