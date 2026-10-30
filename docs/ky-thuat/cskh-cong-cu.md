# Công cụ CSKH cho bản thử kín (Ngân) — 1 trang

Chạy trong `~/xemtuvi.vn`. Không công cụ nào in ngày giờ sinh hay tên khách.

| Lúc nào | Lệnh | Cho ra |
|---|---|---|
| Mỗi lần rà (8:00, 12:30, 17:00, 20:30) | `node tools/bao-loi.cjs moi` | Báo lỗi chưa xử lý: mã `#id`, giờ VN, mô tả, mã đơn, gói, thiết bị, tình huống, có/không liên hệ |
| Cần xem lại | `node tools/bao-loi.cjs tat-ca --tu 2026-11-16` | Cả báo lỗi đã xử lý, từ ngày (giờ VN) |
| Cần trả lời khách | `node tools/bao-loi.cjs lien-he <id> --nguoi Ngân` | Email/Zalo để trả lời |
| Trả lời xong | `node tools/bao-loi.cjs danh-dau <id> da-xu-ly` | Báo lỗi ra khỏi danh sách `moi` |
| Khách báo "mã không dùng được" | `node tools/ma-moi.cjs ds` | Mã, nguồn, giới hạn, đã dùng, hết hạn, tình trạng |

## Quy tắc dùng liên hệ
1. Chỉ dùng liên hệ do lệnh `lien-he` in ra: khách tự điền ở ô báo lỗi, hoặc liên hệ khách đã đồng ý nhận tin trong tài khoản (chưa hủy). Hai loại này đều chỉ để trả lời báo lỗi đó.
2. Dòng "liên hệ: không" hoặc lệnh báo không có liên hệ: dừng. Không tra chỗ khác, không đoán email từ đơn hàng hay tài khoản. Ghi "không liên hệ được" vào phiếu.
3. Mỗi lần tra đều ghi nhật ký (giờ, mã báo lỗi, người tra; không ghi liên hệ) vào `~/xemtuvi-data/nhat-ky/tra-lien-he.jsonl`. Phải có `--nguoi`; chỉ tra khi thật sự sắp trả lời.
4. Không dán liên hệ vào chat chung, phiếu hay file; không dùng để gửi tin khác ngoài câu trả lời báo lỗi.
5. Khách xóa tài khoản/dữ liệu thì liên hệ trong báo lỗi bị xóa theo; lệnh sẽ báo không có liên hệ.
6. Hệ thống không tự gửi email/Zalo; Ngân gửi tay từ kênh chính thức.
