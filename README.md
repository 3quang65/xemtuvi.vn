# xemtuvi.vn

Nền tảng lập và luận giải lá số Tử Vi Đẩu Số theo cách an sao Việt Nam — phiên bản làm mới.

## Hiện có

- Trang lập lá số: nhập ngày giờ sinh (dương hoặc âm lịch, có tháng nhuận), hiển thị bàn 12 cung, chính tinh, phụ tinh, độ sáng, tứ hóa, Tuần – Triệt, vòng Tràng Sinh, đại vận; bấm vào cung để xem chi tiết.
- Lá số được tính hoàn toàn trên trình duyệt; không gửi, không lưu dữ liệu sinh của khách.
- Bộ máy an sao và đổi lịch: `src/lib/tuvi/` (nguồn gốc và giấy phép xem `NOTICE`). Giao diện chỉ gọi qua `src/lib/tuvi/index.ts`.

## Chạy

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # kiểm thử bộ máy lịch và an sao (không cần cài gói)
npm run build
```

Yêu cầu Node.js 20 trở lên.

## Nguyên tắc nội dung

Định vị "hiểu mình, định hướng". Không dùng ngôn ngữ gây sợ, không bán "giải hạn", không giả danh thầy thật. Mọi nhận định luận giải phải có căn cứ trong lá số và ghi rõ trường phái khi các sách khác nhau.
