# Sẵn sàng ra mắt 27/11: tải, cảnh báo, quay lui, sao lưu (Sơn, L-af0e74, đo 31/10/2026)

Máy: 8 nhân CPU, RAM 24 GB. Site chạy `pm2` `xemtuvi` (1 tiến trình, chế độ cluster) sau nginx. Không đo vào site cũ; không gọi API ghi dữ liệu.

## 1. Thử tải (autocannon, 30 giây mỗi ô, qua nginx cổng 80, Host v3.xemtuvi.vn, từ chính máy chủ)
`tools/thu-tai.sh chinh 50 100 200` với `TRANG="/ /luan-giai /chon-goi /api/gia"`. Số thô: `/tmp/thu-tai-chinh/`.
Ghi chú trang: `/lap-la-so` không tồn tại (404). Lá số lập ở trình duyệt từ `/`; trang luận giải là `/luan-giai`; trang giá là `/chon-goi` (+ `/api/gia`). Autocannon không xuất p95, ghi p90 và p97,5; p95 nằm giữa hai số này nên p95 < p97,5.

| Kết nối | Trang | req/s | p50 ms | p90 ms | p97,5 ms | p99 ms | Lỗi % | CPU tb/max | RAM pm2 |
|---|---|---|---|---|---|---|---|---|---|
| 50 | / | 470 | 89 | 202 | 244 | 266 | 0 | 21/34% | 272 MB |
| 50 | /luan-giai | 534 | 78 | 109 | 222 | 234 | 0 | 22/34% | 368 MB |
| 50 | /chon-goi | 561 | 75 | 99 | 210 | 220 | 0 | 18/23% | 388 MB |
| 50 | /api/gia | 443 | 95 | 214 | 242 | 250 | 0 | 18/20% | 451 MB |
| 100 | / | 449 | 202 | 338 | 365 | 375 | 0 | 20/27% | 452 MB |
| 100 | /luan-giai | 526 | 170 | 296 | 314 | 318 | 0 | 18/23% | 451 MB |
| 100 | /chon-goi | 533 | 171 | 298 | 315 | 327 | 0 | 17/21% | 451 MB |
| 100 | /api/gia | 453 | 201 | 331 | 361 | 378 | 0 | 17/20% | 452 MB |
| 200 | / | 533 | 357 | 487 | 506 | 514 | 0 | 22/34% | 452 MB |
| 200 | /luan-giai | 539 | 347 | 486 | 520 | 532 | 0 | 20/27% | 452 MB |
| 200 | /chon-goi | 543 | 354 | 476 | 499 | 507 | 0 | 18/21% | 462 MB |
| 200 | /api/gia | 475 | 409 | 529 | 550 | 565 | 0 | 18/21% | 483 MB |

(CPU là toàn máy 8 nhân; 20% = khoảng 1,6 nhân, tức một tiến trình Node chạy hết công suất. RAM máy 8-10%.)

Kết luận: ở 200 đồng thời, p97,5 cao nhất 550 ms (ngưỡng p95 1,5 s), lỗi 0% (ngưỡng 1%). Đạt, không cần chỉnh cache nginx. Lần đo trước (cùng máy, 1 tiến trình, trang `/van-nam-2027`) có p99 986 ms và CPU 99% ở 200 kết nối: trang nặng nhất vẫn dưới ngưỡng nhưng sát trần một nhân.
Giới hạn của phép đo: máy phát tải và máy chủ chung một máy (autocannon tranh CPU); không đo qua Cloudflare/HTTPS; không đo luồng ghi (đăng nhập, đơn thử). Khi ra mắt, throughput trần ~500 req/s cho một tiến trình.
Nếu sau này tải thật cao hơn: (1) `instances: 2` trong `ecosystem.config.cjs` (trần ~2x, cluster đã sẵn); (2) `proxy_cache` 30 giây cho `/`, `/chon-goi`, `/api/gia` trong nginx. Chưa làm vì chưa cần.

## 2. Cảnh báo miễn phí đã bật
Script `tools/canh-bao-ha-tang.cjs`, cron mỗi 5 phút (`crontab -l`, dòng "L-af0e74"), nhật ký `~/xemtuvi-data/canh-bao-ha-tang.log`. Gửi bằng `office event "..." --kind canh-bao` (kênh có sẵn của Văn phòng). Chống lặp: cùng cảnh báo không gửi lại trong 60 phút. Tin thử có tiền tố `[THỬ]`.

| # | Cảnh báo | Ngưỡng | Cách đã thử kích hoạt (kết quả: có sự kiện trong `~/office-data/events.jsonl`) |
|---|---|---|---|
| 1 | pm2 chết / không online | không có tiến trình `online` | `--gia-lap=a`: "[THỬ] pm2 xemtuvi không online" |
| 2 | pm2 restart lặp | >= 3 lần/60 phút | THẬT: ngưỡng hạ 1, chạy, `pm2 restart xemtuvi`, chạy lại: "restart 1 lần trong 0 phút" |
| 3 | nginx 5xx | >= 10 lỗi 5xx/15 phút (mọi vhost trong access.log) | `--gia-lap=b` (12 lỗi giả) và THẬT: log có 502 lúc 07:29 UTC, cửa sổ 200 phút ngưỡng 1: "1 lỗi 5xx" |
| 4 | Đĩa | `/` > 85% | `--gia-lap=c` (99%); THẬT: ngưỡng 10% so với 16% đo thật |
| 5 | RAM | > 85% | THẬT: ngưỡng 5% so với 8-9% đo thật |
| 6 | Chứng chỉ HTTPS | còn < 14 ngày (v3 và v3ad) | `--gia-lap=d` (3 ngày) và THẬT: ngưỡng 100 ngày so với 88 ngày còn lại |

Bằng chứng thô: dòng kết quả các lệnh trên (chạy 31/10 ~09:31 và 09:38 UTC). Trạng thái hiện tại: `ok | pm2=online dia=16% ram=9% cc=88 ngày`.
Phát hiện khi thử và đã sửa: bản đầu đọc 50.000 dòng cuối của log nên ở 500 req/s chỉ phủ ~100 giây và bỏ sót 5xx; nay đọc 100 MB cuối.
Còn thiếu (đề xuất, chưa bật): site v3 chết nhưng pm2 vẫn online (treo); cảnh báo ra ngoài Văn phòng (email/điện thoại) cần tài khoản của anh Cường. Cảnh báo cũ `tools/loi-hom-nay.cjs` (lỗi ứng dụng theo route) vẫn chạy song song.

## 3. Quay lui <= 10 phút
Cách làm: `scripts/trien-khai.sh` build vào ô xen kẽ `.next-a`/`.next-b` và ghi `.next-slot`; ô còn lại giữ nguyên là bản trước. `scripts/quay-lui.sh` đổi ô, nạp lại pm2, kiểm trang chủ và một tệp tĩnh. `trien-khai.sh` cũng lưu conf nginx trước thành `/etc/nginx/sites-available/xemtuvi.truoc` mỗi lần triển khai có tên miền.

Các bước (người trực):
1. `cd ~/xemtuvi.vn && scripts/quay-lui.sh --kiem-tra` (đủ 2 bản build chưa).
2. `scripts/quay-lui.sh` (chỉ app) hoặc `scripts/quay-lui.sh --nginx` (cả conf nginx; tự giữ conf hiện tại nếu conf cũ lỗi `nginx -t`).
3. Chạy lần nữa = quay về bản vừa rời.
4. Nếu commit xấu: `git revert <commit>` rồi triển khai lại; nếu không `trien-khai.sh` sẽ build lại đúng commit xấu. Quay lui không đổi cây git và không đụng CSDL.
5. Sự cố vẫn còn: ghi `docs/` theo SU-CO.md, báo Tùng.

Đo thực tế (31/10, trên v3 đang chạy, từ `.next-a` sang `.next-b` rồi về `.next-a`):
- Lần 1 (chỉ app): 2 giây (pm2 delete 0s, start 1s, site lên 1s, kiểm chunk 0s). Sau đó `/`, `/chon-goi` trả 200 trên bản cũ.
- Lần 2 (`--nginx`, về bản mới): 3 giây (nginx reload + pm2). Sau đó `/`, `/chon-goi`, `/luan-giai`, `/api/gia` 200, HTTPS thật 200.
Mục tiêu <= 10 phút: đạt, dư xa. Lưu ý: pm2 delete + start có khoảng gián đoạn ~1-2 giây; quay lui lên bản cũ hơn nhiều khi CSDL đã chạy migration mới có thể lỗi, cần xem migration trước. Ô build cũ chỉ còn 1 bản; `COMMIT` của ô chỉ có từ lần triển khai kế tiếp (script đã ghi).

## 4. Sao lưu CSDL hằng ngày và khôi phục
- Sao lưu: `tools/sao-luu-csdl.cjs`, cron 23:15 giờ VN (đã có): `VACUUM INTO`, `integrity_check`, nén, giữ 14 bản ở `~/xemtuvi-data/sao-luu/`, đẩy lên Drive `09 Sao lưu (backup)/Cơ sở dữ liệu/`. Nhật ký `~/xemtuvi-data/sao-luu.log`: bản 31/10 `ok` kèm tải lên Drive. Lỗi thì tự `office event --kind canh-bao`.
- Thử khôi phục (không đụng CSDL đang chạy): `node tools/khoi-phuc-thu.cjs [tep.db.gz]` giải nén vào thư mục tạm, `integrity_check`, so số dòng từng bảng với CSDL chạy, rồi xóa thư mục tạm.
- Kết quả chạy 31/10 trên `xemtuvi-2026-10-31.db.gz` (411 KB nén): `integrity_check = ok`, 14 bảng, đủ dòng (sao lưu <= đang chạy ở mọi bảng nghiệp vụ, vd `don_hang` 75/82, `luan_giai_luu` 48/72 do ghi sau lúc sao lưu; `dang_nhap_sai`, `phien` tự hết hạn nên loại khỏi so sánh). THÀNH CÔNG, dưới 1 giây.
- Khôi phục thật khi mất CSDL (chưa chạy, vì sẽ dừng site): `pm2 stop xemtuvi`; chuyển `~/xemtuvi-data/csdl/xemtuvi.db*` sang `~/xemtuvi-data/luu-tru/` (không xóa); `gunzip -c <bản> > ~/xemtuvi-data/csdl/xemtuvi.db`; `pm2 start xemtuvi`; kiểm `/`. Mất tối đa dữ liệu từ 23:15 hôm trước. Khóa mã hóa (`.env`, KHOA_DU_LIEU) không nằm trong sao lưu: phải giữ riêng, mất khóa thì dữ liệu mã hóa không đọc được.
- Việc còn lại trước 25/11: thử khôi phục từ bản tải về từ Drive (bản trên máy đã thử), kiểm `.env` có bản giữ riêng.

## 5. Rủi ro còn lại
1. Thử tải chạy từ chính máy chủ, chưa qua Cloudflare; số thật của khách có thể kém hơn do mạng, nhưng CPU còn dư nhiều (một nhân dùng, bảy nhân rảnh).
2. Một tiến trình Node: đổi sang `instances: 2` cần Tùng/Minh duyệt vì đổi cấu hình chạy.
3. Cảnh báo chỉ vào kênh Văn phòng; không có báo ra điện thoại.
4. Cron cảnh báo đang trỏ về nhánh `son-l-af0e74` đến khi gộp; sau khi gộp tự dùng `~/xemtuvi.vn/tools/`.
