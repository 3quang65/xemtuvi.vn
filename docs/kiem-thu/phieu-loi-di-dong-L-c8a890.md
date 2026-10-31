# Phiếu lỗi gộp: tốc độ + bố cục di động (L-c8a890)
Nguồn: toc-do-di-dong.md (Phúc), bo-cuc-di-dong.md (Mai). Không đổi giao diện ngoài các lỗi dưới đây.

| Mã | Loại | Trang | Lỗi | Nghiệm thu đo được |
|----|------|-------|-----|--------------------|
| D1 | Perf (ưu tiên 1) | lá số sau khi lập (`/`) | CLS 0.350 khi lá số hiện (không giữ chỗ) | CLS ≤ 0.1; Performance timespan ≥ 85 |
| D2 | Perf | `/chon-goi` | Performance 63, LCP 4531ms: chữ LCP chờ hydrate; render từ server | Perf ≥ 85, LCP ≤ 2500ms |
| D3 | Perf | `/cung/phu-the` | Perf 74, TBT 728ms: nạp JS khối tương tác (chunk 1255) cho trang tĩnh; JS chưa dùng 42KiB | Perf ≥ 85, TBT ≤ 300ms |
| D4 | Perf | `/` | Perf 84, TBT 409ms: polyfills 22KiB (legacy JS), CSS chặn render 7KiB | Perf ≥ 85 ổn định (3 lần) |
| D5 | Perf | lá số | TBT 327ms khi dựng lá số | TBT ≤ 300ms nếu làm được không đổi giao diện |
| L1 | Bố cục (vừa) | `/` | Chữ ô bàn lá số 8,3–9,8px < 11,5px tối thiểu | ≥ 11,5px ở 360/375/414 mà không tràn ngang |
| L2 | Bố cục (vừa) | `/luan-giai` | Liên kết "Chưa mua? Lập lá số miễn phí" cao 20px | vùng bấm ≥ 44px |
| L3 | Bố cục (thấp) | lá số | Nút đổi năm ‹ › rộng 27–30px | vùng bấm ≥ 44px |

Ghi chú hạ tầng (Sơn/Tùng, không thuộc Bảo): HTML `cf-cache-status: DYNAMIC`; beacon Cloudflare Web Analytics 3rd-party.
Đo nhiễu lớn (VPS dùng chung): chạy lại 5 lần, lấy trung vị.
