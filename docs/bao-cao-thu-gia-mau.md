# Báo cáo thử giá theo nhánh — MẪU (số giả lập, không phải số thật)

Tạo bằng: `node tools/pheu.cjs --gia-lap --nhanh --md` (hạt 7). Thử nghiệm 'a': Trọn lá số 99k (goc) so 129k (thu).
Chỉ so hai nhánh với nhau, không dự báo doanh thu. Khoảng tin cậy bootstrap chưa có (việc sau, thu-gia_v1 mục 5).

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
