# Cờ khẩn bản thử (đổi không cần build lại)

Mã: `src/lib/may-chu/co-khan.ts`. Cờ được đọc **lúc chạy, mỗi yêu cầu**; không đóng băng lúc build.

| Cờ | Tác dụng khi bật |
|---|---|
| `THU_KIN_MOI_TAT` | Tắt toàn bộ /moi: trang `/moi/*` báo "Tạm dừng nhận khách mới" (410); `/api/ma-moi/kiem`, `/vao`, `/dung` trả 410. Kéo theo tắt cấp quyền 0đ. Lá số + tóm tắt miễn phí vẫn dùng bình thường. |
| `THU_KIN_CAP_QUYEN_0D_TAT` | Chỉ tắt cấp quyền 0đ: `/api/ma-moi/dung` trả 410 `cap_quyen_tat`, không tạo đơn. Trang /moi và việc kiểm mã vẫn chạy. |

Giá trị bật: `1`, `true`. Giá trị khác hoặc vắng = tắt cờ (chạy bình thường).

## Cách đổi (chọn một)

**A. Tệp, có hiệu lực ngay, không cần reload** (tệp thắng biến môi trường nếu có khóa):

```
echo '{"THU_KIN_MOI_TAT": true}' > ~/xemtuvi-data/co-khan.json     # bật khẩn
echo '{"THU_KIN_MOI_TAT": false}' > ~/xemtuvi-data/co-khan.json    # bỏ cờ (kể cả khi ecosystem đang đặt =1)
rm ~/xemtuvi-data/co-khan.json                                      # quay về biến môi trường
```

Đường dẫn khác: biến `CO_KHAN_FILE`. Tệp hỏng/không có → dùng biến môi trường.

**B. Biến môi trường trong `ecosystem.config.js`** (khối `env` của app `xemtuvi`), rồi:

```
pm2 reload ecosystem.config.js --only xemtuvi --update-env
```

Không `npm run build`. (Thiếu `--update-env` thì pm2 giữ biến cũ.)

## Kiểm nhanh

`curl -s -o /dev/null -w '%{http_code}\n' https://v3.xemtuvi.vn/moi/XXXXXXXX` → 410 khi cờ bật, 200 khi tắt.
Test: `node --test tests/co-khan.test.cjs`.

Lưu ý: `ecosystem.config.js` hiện đặt `THU_KIN_MOI_TAT: '1'`; muốn mở /moi lại thì dùng cách A với `false` hoặc sửa ecosystem rồi reload như B.
