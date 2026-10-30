# Báo cáo thử giá theo nhánh — MẪU (số giả lập, không phải số thật)

Tạo bằng: `node tools/pheu.cjs --gia-lap --nhanh --md --bootstrap=10000 --hat=7`. Thử nghiệm 'a': Trọn lá số 99k (goc) so 129k (thu).
Chỉ so hai nhánh với nhau, không dự báo doanh thu. Doanh thu chỉ tính phiên có chon_goi (giá trị phiên = tổng gia mọi thanh_toan_xong); thiết bị thấy cả hai nhánh bị loại.
Với số thật: dùng `--bootstrap=10000 --hat=<số>`, ghi hạt vào báo cáo; `--nhanh --csv` xuất (phiên, thiết bị, nhánh, doanh thu) để kiểm lại độc lập. Chạy một lần khi đủ cỡ mẫu.

| Nhánh | Phiên chon_goi | Đơn | Tỉ lệ trả | Doanh thu | Doanh thu / phiên | Đơn TB | Tỉ trọng mot-chu-de | Tỉ trọng tron-la-so | Tỉ trọng thanh-vien-nam | bao_loi | bao_loi / đơn |
|---|---|---|---|---|---|---|---|---|---|---|---|
| a/goc | 56 | 16 | 28.6% | 2.244.000đ | 40.071đ | 140.250đ | 14.3% | 73.2% | 12.5% | 1 | 6.3% |
| a/thu | 61 | 17 | 27.9% | 1.863.000đ | 30.541đ | 109.588đ | 13.1% | 80.3% | 6.6% | 1 | 5.9% |

Theo nhóm nguồn

| Nhánh | Nhóm nguồn | Phiên chon_goi | Đơn | Doanh thu / phiên |
|---|---|---|---|---|
| a/goc | direct | 3 | 0 | 0đ |
| a/goc | email | 6 | 3 | 82.833đ |
| a/goc | organic | 11 | 1 | 27.182đ |
| a/goc | paid | 12 | 4 | 21.333đ |
| a/goc | partner | 3 | 3 | 99.000đ |
| a/goc | referral | 2 | 1 | 149.500đ |
| a/goc | social | 1 | 0 | 0đ |
| a/goc | tuvi-vn | 18 | 4 | 33.111đ |
| a/thu | direct | 2 | 0 | 0đ |
| a/thu | email | 2 | 0 | 0đ |
| a/thu | organic | 7 | 2 | 36.857đ |
| a/thu | paid | 12 | 4 | 18.000đ |
| a/thu | partner | 5 | 0 | 0đ |
| a/thu | referral | 8 | 1 | 37.375đ |
| a/thu | social | 6 | 3 | 64.500đ |
| a/thu | tuvi-vn | 19 | 7 | 37.000đ |

Khoảng tin cậy 95% (bootstrap)

Thử a · bootstrap 10000 lần · hạt 7 · phiên chon_goi: gốc 56, thử 61 · khoảng 95% của (nhánh thử − gốc)

| Chỉ số | Gốc | Thử | Chênh | Cận dưới | Cận trên | Kết luận |
|---|---|---|---|---|---|---|
| Doanh thu / phiên (đ) | 40.071 | 30.541 | -9.530 | -36.116 | 15.175 | hòa |
| Tỉ lệ trả tiền | 28.57% | 27.87% | -0.70% | -17.54% | 15.22% | hòa |
| Tỉ lệ gói năm | 12.50% | 6.56% | -5.94% | -16.51% | 4.48% | hòa |
