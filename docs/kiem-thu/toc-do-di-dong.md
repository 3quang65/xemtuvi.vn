# Tốc độ di động - số đo "trước" (L-c8a890)

Đo ngày 31/10/2026 trên https://v3.xemtuvi.vn bởi Phúc. Lighthouse 13.6, mobile (Moto G Power, 412px), mô phỏng 3G chậm (RTT 400ms, 400 kbps) + CPU chậm 4x. Mỗi trang chạy 3 lần, ghi trung vị. Mục tiêu nghiệm thu: Performance >= 85.

| # | Trang | Performance | LCP (ms) | CLS | TBT (ms) | Sau (Perf trung vị 9 lần) |
|---|-------|------------:|---------:|----:|---------:|----------------|
| 1 | `/` trang chủ | 84 | 2140 | 0 | 409 | 89 (khoảng 77 đến 90); LCP trung vị 2,16 s; CLS 0,001; TBT 340 |
| 2 | `/` form đã điền (1) | 84 | 2140 | 0 | 0 | 99 (99 đến 100); CLS 0; TBT khi điền 79 |
| 3 | lá số sau khi lập (2) | 56 | n/a | 0.350 | 327 | 95 (85 đến 97); CLS 0; TBT 190 |
| 4 | `/chon-goi` | 63 | 4531 | 0 | 323 | 77 (70 đến 89); LCP trung vị 2,12 s; CLS 0,006; TBT 795 |
| 5 | `/cung/phu-the` | 74 | 2118 | 0 | 728 | 91 (78 đến 92); LCP trung vị 2,15 s; CLS 0,034; TBT 265 |

Cột "Sau": trung vị 9 lần tuần tự, số thô ở mục "Số đo sau D4 (Phúc, 9 lần)" cuối file.

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

## Số đo sau D4 (Phúc, 9 lần)
Đo 31/10 10:05 đến 10:07, v3.xemtuvi.vn đã nhúng CSS (0 thẻ stylesheet), cấu hình như bảng (mobile, rtt 400, 400 kbps, cpuSlowdown 4), chạy tuần tự.
Trang `/`:
| Lần | Điểm | LCP (s) | CLS | TBT (ms) |
|---|---|---|---|---|
| 1 | 89 | 2,42 | 0,002 | 259 |
| 2 | 89 | 2,21 | 0,001 | 312 |
| 3 | 77 | 2,13 | 0,002 | 839 |
| 4 | 90 | 2,15 | 0,001 | 300 |
| 5 | 89 | 2,12 | 0,001 | 340 |
| 6 | 81 | 2,25 | 0,001 | 533 |
| 7 | 77 | 2,13 | 0,002 | 811 |
| 8 | 89 | 2,16 | 0,001 | 336 |
| 9 | 88 | 2,19 | 0,001 | 353 |

- Trung vị 9 lần: **89** (khoảng 77 đến 90).
- Trung vị riêng các lần có LCP < 3 s: **89** (9/9 lần; không còn nhóm LCP chậm 4,6 đến 5,5 s).
- Hai lần thấp (77) do TBT cao (811 đến 839 ms), không do LCP.
- Tải CPU (load average 1/5/15 phút): trước 3,67 / 2,12 / 2,25; sau 1,37 / 1,75 / 2,09.

Trang `/chon-goi` (đo 10:08 đến 10:10, cùng cấu hình, tuần tự):
| Lần | Điểm | LCP (s) | CLS | TBT (ms) |
|---|---|---|---|---|
| 1 | 76 | 2,13 | 0,004 | 838 |
| 2 | 70 | 2,14 | 0,006 | 1377 |
| 3 | 77 | 2,10 | 0,004 | 795 |
| 4 | 89 | 2,08 | 0,006 | 310 |
| 5 | 77 | 2,08 | 0,006 | 787 |
| 6 | 75 | 2,24 | 0,006 | 868 |
| 7 | 77 | 2,10 | 0,006 | 799 |
| 8 | 89 | 2,12 | 0,006 | 326 |
| 9 | 88 | 2,18 | 0,006 | 286 |

- Trung vị 9 lần: **77** (khoảng 70 đến 89).
- Trung vị riêng các lần có LCP < 3 s: **77** (9/9 lần).
- Điểm thấp (70 đến 77) do TBT cao (787 đến 1377 ms), không do LCP.
- Tải CPU (load average 1/5/15 phút): trước 2,27 / 2,01 / 2,16; sau 3,37 / 2,87 / 2,48.

Trang `/cung/phu-the` (đo 10:10 đến 10:12, cùng cấu hình, tuần tự):
| Lần | Điểm | LCP (s) | CLS | TBT (ms) |
|---|---|---|---|---|
| 1 | 92 | 2,11 | 0,027 | 259 |
| 2 | 78 | 2,16 | 0,053 | 759 |
| 3 | 89 | 2,43 | 0,027 | 265 |
| 4 | 92 | 2,10 | 0,046 | 250 |
| 5 | 92 | 2,18 | 0,027 | 226 |
| 6 | 90 | 2,14 | 0,034 | 302 |
| 7 | 79 | 2,15 | 0,034 | 719 |
| 8 | 91 | 2,11 | 0,034 | 284 |
| 9 | 92 | 2,17 | 0,027 | 229 |

- Trung vị 9 lần: **91** (khoảng 78 đến 92).
- Trung vị riêng các lần có LCP < 3 s: **91** (9/9 lần).
- Hai lần thấp (78, 79) do TBT cao (719 đến 759 ms), không do LCP.
- Tải CPU (load average 1/5/15 phút): trước 3,37 / 2,87 / 2,48; sau 1,32 / 2,23 / 2,29.

Form đã điền (Lighthouse timespan lúc điền ngày, tháng, năm, giờ sinh, giới tính; đo 10:14 đến 10:19, cùng cấu hình, tuần tự):
| Lần | Điểm | CLS | TBT (ms) |
|---|---|---|---|
| 1 | 99 | 0,000 | 106 |
| 2 | 99 | 0,000 | 76 |
| 3 | 100 | 0,000 | 0 |
| 4 | 99 | 0,000 | 79 |
| 5 | 99 | 0,000 | 89 |
| 6 | 99 | 0,000 | 80 |
| 7 | 100 | 0,000 | 0 |
| 8 | 100 | 0,000 | 0 |
| 9 | 99 | 0,000 | 83 |

- Trung vị 9 lần: điểm **99**, TBT **79 ms**, CLS **0** (điểm 99 đến 100, TBT 0 đến 106 ms).

Lá số sau khi lập (timespan từ lúc bấm "Lập lá số" đến khi lá số hiện, cùng đợt):
| Lần | Điểm | CLS | TBT (ms) | Bấm đến thấy lá số (ms) |
|---|---|---|---|---|
| 1 | 92 | 0,000 | 231 | 447 |
| 2 | 95 | 0,000 | 190 | 388 |
| 3 | 89 | 0,000 | 292 | 487 |
| 4 | 97 | 0,000 | 155 | 339 |
| 5 | 96 | 0,000 | 179 | 375 |
| 6 | 95 | 0,000 | 189 | 399 |
| 7 | 85 | 0,000 | 364 | 553 |
| 8 | 95 | 0,000 | 197 | 392 |
| 9 | 96 | 0,000 | 179 | 372 |

- Trung vị 9 lần: điểm **95**, TBT **190 ms**, CLS **0** (điểm 85 đến 97, TBT 155 đến 364 ms); bấm đến thấy lá số trung vị 392 ms.
- CLS lá số trước là 0,350, nay 0 ở cả 9 lần.
- Lighthouse không có LCP cho timespan nên không ghi.
- Tải CPU (load average 1/5/15 phút), cả hai bài đo: trước 4,13 / 3,31 / 2,69; sau 1,20 / 1,90 / 2,23 (giữa hai đợt 5 lần và 4 lần: 1,31 / 2,31 / 2,40).

## Số đo sau 49faa96 (Phúc, L-23297f) - `/chon-goi`, 9 lần
Đo 31/10 10:40 đến 10:53, cấu hình như bảng (mobile, rtt 400, 400 kbps, cpuSlowdown 4), tuần tự, URL `/chon-goi` không kèm phiên.
| Lần | Điểm | LCP (s) | CLS | TBT (ms) |
|---|---|---|---|---|
| 1 | 76 | 2,14 | 0,075 | 759 |
| 2 | 85 | 2,10 | 0,076 | 385 |
| 3 | 89 | 2,15 | 0,051 | 275 |
| 4 | 90 | 2,12 | 0,051 | 262 |
| 5 | 75 | 2,12 | 0,076 | 820 |
| 6 | 76 | 2,11 | 0,076 | 765 |
| 7 | 89 | 2,13 | 0,051 | 302 |
| 8 | 76 | 2,08 | 0,076 | 814 |
| 9 | 90 | 2,11 | 0,049 | 297 |

- Trung vị: Performance **85** (đạt ngưỡng >= 85, sát ngưỡng; 4/9 lần dưới 85, khoảng 75 đến 90), LCP 2,12 s, CLS 0,075, TBT 385 ms.
- Hạn chế đo: Lighthouse mở `/chon-goi` không có thông tin sinh trong sessionStorage nên trang tự chuyển về `/` (ChonGoi.tsx dòng 58). Số trên thực chất là của trang `/`, không gồm bảng gói và đoạn mẫu. Thử bơm phiên cho Lighthouse không giữ được (Lighthouse vẫn kết thúc ở `/`).
- Kiểm tay bằng Playwright (có phiên, không throttle): 375px và 1366px không tràn ngang (scrollWidth = bề rộng); bảng 6 gói hiển thị đủ, giá đúng (129k, 49k, 179k, 99k, 29k, 299k); đoạn mẫu nạp xong, không còn khung chờ.
- Lỗi CLS (trung bình): khi vào có phiên, chân trang (`chan-trang`) nằm ở y=423 (375px) hoặc 397 (1366px) rồi bị đẩy xuống khi nội dung gói/đoạn mẫu hiện ra: CLS 0,39 (375px), 0,175 (1366px), vượt ngưỡng tốt 0,1. Cần giữ chỗ (min-height) cho khu bảng gói trước khi bảng giá/đoạn mẫu nạp, hoặc ẩn chân trang tới khi sẵn sàng.

## Giảm JS trang đầu (Bảo, L-bf67de, commit 2d3189c) - `/chon-goi` và `/`
Nguyên nhân: Lighthouse mở `/chon-goi` không có phiên nên trang chuyển về `/` (client router). Trang `/` nạp sẵn engine an sao (`9277`, 39 KB), luận giải mẫu (`9570`, 34 KB) và bảng lá số (`763`, 163 KB) dù chưa ai bấm "Lập lá số". Đã tách: hàm giờ/múi giờ sang `src/lib/tuvi/nhe.ts` (index.ts xuất lại), khối kết quả `KetQuaLaSo.tsx` nạp bằng `dynamic`, engine nạp bằng `import()` khi bấm lập hoặc quay lại có phiên. Test `tests/trang-chu-khong-nap-engine.test.cjs` chặn nạp tĩnh trở lại.
- JS nạp đầu trang `/` (thô): 636 KB -> 385 KB (-40%); First Load JS `/` 177 -> 115 kB; `/chon-goi` 111 -> 112 kB (không đổi); các trang khác giữ nguyên.
- Đo thử cục bộ (next start trên VPS, http, cấu hình như bảng, URL `/chon-goi`, 8 lần mỗi bản, xen kẽ): TBT trung vị 312 -> 296 ms. Điểm Performance cục bộ ~66 ở cả hai bản (LCP 14 đến 16 s do không qua Cloudflare/brotli) nên KHÔNG so được với bảng trên; chưa chứng minh được "trung vị >= 85" - cần Phúc đo lại trên v3 sau khi Tùng triển khai.
- Nhóm TBT cao (750 đến 890 ms, 3/8 lần ở cả hai bản) vẫn còn: nằm trong chunk `1255` (runtime Next) ở tác vụ ~550 ms ngay sau khi `router.replace('/')` dựng lại trang chủ. Đã thử chuyển cứng `window.location.replace('/')`: Lighthouse kẹt ở `/chon-goi`, TBT 9 s, đã bỏ. Muốn hết nhóm này phải bỏ chuyển hướng (ví dụ lưu thông tin sinh bằng cookie để server biết có phiên) - đề xuất, chưa làm.
- Polyfills: `polyfills-*.js` (112 KB) là bản nomodule của Next, trình duyệt mới không chạy; thử `browserslist` hiện đại: chunk `1255` đổi 28 byte, build font lỗi, đã bỏ.
- Đo lại: `/tmp/bao-lh.sh` (xen kẽ bản cũ `.next-base` cổng 3911 và bản mới cổng 3912). Không thuộc repo.

## Số đo sau 1706fac (Phúc, L-bf67de) - 3 trang, 9 lần mỗi trang
Đo 31/10 12:24 đến 12:30 trên https://v3.xemtuvi.vn, tuần tự, mobile, rtt 400, 400 kbps, cpuSlowdown 4 (`/tmp/lh/run27.sh`, bản của run.sh với 9 lần). Load average (1 phút) trước mỗi lần: 2,33 giảm dần còn 0,6 đến 1,3 (đa số < 1,3); sau đo 0,78.
| Trang | Điểm 9 lần | Trung vị | LCP trung vị (s) | TBT trung vị (ms) | CLS trung vị |
|---|---|---|---|---|---|
| `/` | 76, 77, 89, 87, 90, 91, 89, 89, 77 | **89** | 2,15 | 332 | 0,002 |
| `/chon-goi` | 49, 53, 66, 66, 64, 67, 66, 63, 65 | **65** | 9,27 | 304 | 0,001 |
| `/cung/phu-the` | 90, 89, 91, 91, 89, 79, 92, 89, 89 | **89** | 2,19 | 265 | 0,052 |
- LCP thô `/`: 2,14 2,22 2,15 2,87 2,16 2,15 2,22 2,13 2,14; TBT thô: 877 763 336 294 299 264 303 332 808.
- LCP thô `/chon-goi`: 10,34 9,24 9,32 9,39 9,37 9,09 9,27 9,20 9,22; TBT thô: 837 711 287 244 371 263 271 355 304.
- LCP thô `/cung/phu-the`: 2,51 2,50 2,18 2,15 2,15 2,19 2,16 2,45 2,51; TBT thô: 265 245 272 268 329 695 230 244 233.
- KHÔNG ĐẠT: `/chon-goi` trung vị 65 (tiêu chí >= 85; trước đó 85). Khác trước: Lighthouse nay kết thúc ở `/chon-goi` (finalUrl = /chon-goi, không còn chuyển về `/`), LCP mô phỏng 9,3 s ổn định ở cả 9 lần (LCP quan sát thật ~0,9 s: TTFB 275 ms + trễ dựng 638 ms; phần tử LCP là đoạn `p.ghi-chu-rieng-tu` ở `section.mo-dau`). Nhiều khả năng đồ thị phụ thuộc của mô phỏng kéo dài do nạp trễ (dynamic/import) trên trang này; cần Bảo xem. Số 85 trước đây thực chất là số của `/`.
- `/` đạt (89 >= 85, trước 84); `/cung/phu-the` đạt (89, trước 74). Nhóm chậm 76-77 (TBT 760-880) còn ở 3/9 lần `/`, 1 lần cung.
- Lá số (`/tmp/flow.mjs`, 3 lần, devtools throttling): bước nạp trang 0,84 / 0,86 / 0,84 (TBT 540-620 ms, LCP 1,4-1,6 s); bước điền 0,99-1; bước lập lá số 0,96 / 0,98 / 0,95 (TBT 117-192 ms, CLS 0); lập xong sau 286-403 ms. Số lần ít hơn 9.
