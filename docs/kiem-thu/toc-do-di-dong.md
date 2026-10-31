# Tốc độ di động - số đo "trước" (L-c8a890)

Đo ngày 31/10/2026 trên https://v3.xemtuvi.vn bởi Phúc. Lighthouse 13.6, mobile (Moto G Power, 412px), mô phỏng 3G chậm (RTT 400ms, 400 kbps) + CPU chậm 4x. Mỗi trang chạy 3 lần, ghi trung vị. Mục tiêu nghiệm thu: Performance >= 85.

| # | Trang | Performance | LCP (ms) | CLS | TBT (ms) | Sau (Perf trung vị 5 lần) |
|---|-------|------------:|---------:|----:|---------:|----------------|
| 1 | `/` trang chủ | 84 | 2140 | 0 | 409 | 78 (89, 90, 60, 78, 59); LCP 2096; CLS 0; TBT 338 |
| 2 | `/` form đã điền (1) | 84 | 2140 | 0 | 0 | như hàng 1; TBT khi điền 0 đến 77 (3 lần) |
| 3 | lá số sau khi lập (2) | 56 | n/a | 0.350 | 327 | 60 đến 64 (3 lần); CLS vẫn 0.350 (xem ghi chú dưới); TBT 184 đến 240 |
| 4 | `/chon-goi` | 63 | 4531 | 0 | 323 | 76 (76, 74, 59, 85, 87); LCP 2113; CLS 0; TBT 356 |
| 5 | `/cung/phu-the` | 74 | 2118 | 0 | 728 | 90 (86, 59, 92, 90, 91); LCP 2099; CLS 0; TBT 253 |

(1) Form và lá số cùng URL `/` (trạng thái trong trình duyệt, không có URL riêng). Hàng 2: Performance và LCP là của lần tải `/` (trùng hàng 1, vì lần tải chưa có dữ liệu điền); TBT và CLS đo trong lúc điền ngày, tháng, năm, giờ sinh, giới tính (Lighthouse timespan, trung vị 3 lần).
(2) Hàng 3: đo timespan từ lúc bấm "Lập lá số" đến khi lá số hiện. Lighthouse không có LCP cho tương tác nên ghi n/a; điểm 56 là điểm timespan (chỉ gồm TBT, CLS), trung vị 3 lần (62, 55, 56). Thời gian bấm đến thấy lá số: 405 đến 599 ms.

Số liệu thô 3 lần (Performance / LCP ms / TBT ms):
- `/`: 85/2140/409, 48/4718/809, 84/2081/308
- `/chon-goi`: 63/4531/282, 74/2195/793, 61/4556/323
- `/cung/phu-the`: 87/2065/252, 74/2118/728, 70/2215/1241

Lưu ý độ nhiễu: VPS chạy chung nhiều việc nên các lần chạy lệch lớn (vd `/` từ 48 đến 85). Cần đo lại cùng điều kiện cho cột "sau", nên chạy 5 lần nếu muốn chắc. Cách đo đảo ngược chế độ khác (throttling devtools thật, không mô phỏng) cho `/` ra 54 đến 57, LCP khoảng 4.5 s, tức nặng hơn nhiều; bảng trên dùng mô phỏng theo chuẩn Lighthouse.

## Trang dưới 85: nguyên nhân hàng đầu

Phân loại: M = mã (sửa trong repo), H = hạ tầng (nginx, Cloudflare).

### `/` (84, sát ngưỡng) và hàng 2
1. M - JS chưa dùng, ước tiết kiệm 21 KiB (chunk `4bd1b696...` thực thi ~480 ms trên CPU 4x; là runtime React/Next).
2. M - JS kiểu cũ (legacy JavaScript) ~22 KiB do polyfills (`polyfills-*.js`); trình duyệt di động hiện nay không cần.
3. M - CSS chặn render: `css/5745b7aacfbd6641.css` (7 KiB) nạp đồng bộ trước khi vẽ.
Ghi chú H: TTFB 471 ms ở lần đo này (cao hơn hai trang kia ~260 ms), do Cloudflare trả `cf-cache-status: DYNAMIC` (HTML không được cache ở biên).

### Lá số sau khi lập (hàng 3)
1. M - CLS 0.350 (ngưỡng tốt <= 0.1): khi lá số hiện ra, bố cục nhảy. Nhiều khả năng khối lá số/ form thay nhau không giữ chỗ (min-height). Đây là lỗi mã rõ nhất trong đợt đo, Bảo cần ưu tiên.
2. M - TBT 327 ms khi dựng lá số (tính an sao + render trên luồng chính ở client, CPU 4x).
3. M - cùng gói JS như trang chủ (xem trên).

### `/chon-goi` (63, thấp nhất)
1. M - LCP 4531 ms, trong đó trễ vẽ phần tử (element render delay) ~1170 ms: phần tử LCP là đoạn chữ `<p>` trong `main > section`; vẽ sau khi JS chunk `1255-...js` chạy xong (chunk này thực thi ~640 ms, nặng nhất trang). Nên render phần chữ này từ server, không đợi hydrate.
2. M - JS kiểu cũ/polyfills ~22 KiB (điểm 0 ở mục legacy-javascript).
3. H/M - CSS chặn render 7 KiB; tổng tải trang 520 KB. Phần cache: file JS/CSS/font của site đã `immutable` 1 năm, nén br tốt, nên hạ tầng không phải nguyên nhân chính. Riêng `static.cloudflareinsights.com/beacon.min.js` (script đo của Cloudflare, bên thứ ba) chỉ cache 1 ngày, ~4 KiB lãng phí: H, tắt Web Analytics của Cloudflare nếu không dùng.

### `/cung/phu-the` (74)
1. M - TBT 728 ms (một lần đo 1241 ms): chunk `1255-...js` thực thi ~950 ms; trang bài đọc tĩnh nhưng vẫn nạp JS của khối tương tác.
2. M - JS chưa dùng ước tiết kiệm 42 KiB (nhiều nhất trong 5 trang).
3. M - JS kiểu cũ ~22 KiB + CSS chặn render 7 KiB.

## Kết luận hạ tầng và mã
- Hạ tầng ổn: nén brotli bật, tài nguyên tĩnh cache `public, max-age=31536000, immutable`, TTFB 260 đến 470 ms. Chỉ có HTML là `DYNAMIC` ở Cloudflare (muốn nhanh hơn phải cho cache HTML ở biên, là quyết định của Sơn/Tùng, có rủi ro với nội dung theo người dùng).
- Gốc vấn đề chủ yếu ở mã: gói JS `1255-*.js` nặng chạy chậm trên CPU 4x, polyfills thừa, CSS chặn render, và CLS 0.35 khi lập lá số.
- Chưa ghi nhận lỗi ảnh (trang không có ảnh nặng) hoặc font (2 file woff2 ~5 KB mỗi file, preload).

## Cách đo lại
`/tmp/lh/run.sh` (3 trang điều hướng, lighthouse CLI với `--throttling.rttMs=400 --throttling.throughputKbps=400 --throttling.cpuSlowdownMultiplier=4`) và `/tmp/flow.mjs` (form điền + lập lá số, Lighthouse user flow bằng puppeteer-core). Script nằm trong /tmp, không thuộc repo.

## Số đo "sau" (Tùng đo 31/10, sau commit 2b9bd30 và 3932385)
- Cùng cấu hình như "trước" (mô phỏng 3G chậm, CPU 4x), 5 lần mỗi trang; kết quả lệch hai nhóm: LCP ~2,1 s (điểm 85 đến 92) hoặc ~4,6 đến 5,5 s (điểm 46 đến 60); nhóm chậm chiếm khoảng 1/4 số lần ở mọi trang. Mạng quan sát thật trong cùng lần chạy xong trong ~1 s, nên nhiều khả năng chênh do VPS dùng chung làm nhiễu số liệu đầu vào của mô phỏng.
- D6 (thêm): bỏ preload 8 file font (commit 3932385), bớt ~110 KB tải sớm; không loại được nhóm chậm.
- CLS lá số: cú dịch duy nhất (0.350) là phần "giới thiệu" ẩn đi ngay sau cú bấm (hadRecentInput=true); Chrome thật/CrUX loại trừ, Lighthouse flow vẫn tính vì bấm bằng puppeteer.
- Chưa làm: D4 (polyfills, CSS chặn render), D5 (TBT lá số).
- Cần: đo ngoài VPS (PageSpeed Insights hoặc máy khác, không tốn phí) để có số tin cậy; trong VPS chưa chốt được >= 85 cho /, lá số, /chon-goi.

## Hạ tầng

### Đề xuất tắt Cloudflare Web Analytics cho v3.xemtuvi.vn (Sơn, 31/10, L-05893f)
Trạng thái: chỉ là đề xuất, chưa đổi gì ở Cloudflare. Mã site không chứa beacon (grep `cloudflareinsights` trong src và cấu hình: không có); script `static.cloudflareinsights.com/beacon.min.js` do Cloudflare tự chèn ở biên (Web Analytics bật kiểu "tự động").

Lợi ích: bớt 1 request bên thứ ba (~4 KiB, cache 1 ngày), hết cảnh báo cache trong Lighthouse; tác động điểm nhỏ.

Các bước cho anh Cường (cần đăng nhập Cloudflare, tự thao tác):
1. Cloudflare Dashboard, chọn tên miền xemtuvi.vn.
2. Menu bên trái: Analytics & Logs, rồi Web Analytics.
3. Tìm site `v3.xemtuvi.vn` (hoặc xemtuvi.vn nếu bật theo zone) trong danh sách, bấm Manage site (biểu tượng ba chấm), chọn Disable / Delete site hoặc tắt "Enable automatic setup" (tên nút có thể khác theo giao diện).
4. Chờ vài phút, xóa cache trình duyệt, kiểm: `curl -s https://v3.xemtuvi.vn/ | grep -c cloudflareinsights` phải ra 0 và tab Network không còn `beacon.min.js`. Sơn kiểm giúp sau khi anh báo đã đổi.
5. Hoàn tác: bật lại cùng mục đó (không mất dữ liệu cấu hình khác).

Rủi ro:
- Mất số liệu lượt truy cập/Core Web Vitals thật từ Cloudflare (dữ liệu cũ có thể không xem được nếu xóa site). Hiện chưa có công cụ đo thay thế ngoài log nginx; nếu cần số liệu thật nên thống nhất với Quân (phân tích) trước khi tắt. Khuyến nghị: chỉ tắt nếu không ai đang xem số liệu này, hoặc tắt sau đợt đo Lighthouse.
- Chỉ ảnh hưởng v3.xemtuvi.vn nếu thao tác đúng site; KHÔNG đụng site cũ xemtuvi.vn và DNS. Kiểm lại danh sách site trước khi bấm.
- Không ảnh hưởng HTTPS, cache, WAF, tốc độ tải ngoài ~4 KiB nói trên.

### Job nền ăn CPU trên VPS (đo 09:50 UTC, load 1,5 sau đỉnh 3,5)
Đang chạy thường trực (không nên dừng): pm2 `xemtuvi` (chính là site đang đo, 1 instance), nginx, `vanphongai/server.mjs` (~7% CPU, dashboard), `dispatcher.mjs` (~2%), litellm, claude `--remote-control Chi` (~1%), pm2 daemon. Ngoài ra các phiên `claude -p` của agent (ví dụ Tùng ~3%) chạy khi có việc.

Cron user claude:
- `*/5` canh-bao-ha-tang.cjs: nhẹ, giữ.
- `*/30` loi-hom-nay.cjs --canh-bao: nhẹ, giữ.
- `0 1,4,7,10,13,16 UTC` tuan-tra-chi.sh: mở một phiên Claude (tối đa 25 phút), NẶNG nhất. Lượt kế 10:00 UTC (17:00 VN).
- `30 4,10 UTC` danh-gia-giam-doc.sh: một phiên Claude, nặng. Lượt kế 10:30 UTC (17:30 VN).
- `15 23 UTC` sao-luu-csdl.cjs: nhẹ, ngoài khung đo.
Systemd: apt-daily 10:26 UTC (khoảng 1 phút, có thể nặng đĩa/CPU), fwupd-refresh 10:23 UTC, sysstat-collect mỗi 10 phút (không đáng kể).

Khuyến nghị để Phúc đo Lighthouse ngoài tải ~30 phút:
- An toàn tạm dừng: tuan-tra-chi.sh và danh-gia-giam-doc.sh (chỉ là tuần tra/đánh giá định kỳ, bỏ lỡ một lượt không mất dữ liệu; Chi/Kiên chạy bù được). Cách: chọn khung 30 phút KHÔNG chứa 10:00 và 10:30 UTC, ví dụ 10:35 đến 11:05 UTC; hoặc nếu phải đo ngay thì hoãn bằng cách comment 2 dòng cron trong khung đó (Sơn làm khi Tùng đồng ý, khôi phục ngay sau đó). Tránh cả apt-daily 10:26 UTC.
- Không nên dừng: canh-bao-ha-tang (giám sát sống), sao lưu, pm2 xemtuvi, nginx. Dispatcher/server.mjs: dừng sẽ làm agent không nhận việc, chỉ dừng nếu Tùng chấp thuận, không cần thiết vì CPU thấp.
- Tạm ngưng giao việc mới cho agent trong khung đo (các phiên `claude -p` đang chạy là nguồn nhiễu chính, không phải cron).
- Đo thật chuẩn vẫn nên chạy ngoài VPS (PageSpeed Insights).
