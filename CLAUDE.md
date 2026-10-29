# CLAUDE.md — quy ước dự án xemtuvi.vn

Repo công khai: không ghi thông tin cá nhân, tài chính, mật khẩu, khóa API vào bất kỳ file nào được commit.

## Sản phẩm
- Web lập và luận giải lá số Tử Vi Đẩu Số cho người Việt (chủ yếu nữ, 18–45 tuổi).
- Doanh thu: bán luận giải chuyên sâu theo chuyên đề và gói thành viên. Không quảng cáo hiển thị.
- Giọng thương hiệu: nghiêm túc, đúng học thuật, nhưng gần gũi. Định vị "hiểu mình, định hướng".

## Quy tắc nội dung (bắt buộc)
- Không ngôn ngữ gây sợ ("sắp gặp hạn", "cung chết chóc"), không bán "giải hạn", bùa, cúng.
- Không giả danh thầy, chuyên gia có thật; luận giải AI phải ghi rõ là do hệ thống tạo.
- Mỗi nhận định phải truy được về sao/cung/vận cụ thể trong lá số; khi các sách khác nhau, ghi rõ trường phái.
- Không công khai, không để Google index dữ liệu sinh của khách.

## Kỹ thuật
- Next.js 15 (App Router) + TypeScript. Node ≥ 20.
- Bộ máy lịch và an sao: `src/lib/tuvi/` (nguồn gốc, giấy phép trong `NOTICE`). Mọi chỗ khác chỉ gọi qua `src/lib/tuvi/index.ts`.
- Sửa engine → phải chạy `npm test` và đạt hết; thêm test case khi sửa quy tắc an sao.
- Ngôn ngữ giao diện, commit, chú thích: tiếng Việt.

## Lệnh
- `npm run dev` — chạy thử tại http://localhost:3000
- `npm test` — kiểm thử engine
- `npm run build` — build bản chạy thật
