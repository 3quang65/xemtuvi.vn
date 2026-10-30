# Hỏi đáp về lá số — Thành viên năm, 5 câu/tháng (L-caf770, thiết kế của Minh 30/10)

## Quyết định thiết kế
1. **Không gọi API AI ngoài.** Khung AI hiện là `stub` (chưa nối Claude), và việc cấm gửi dữ liệu sinh ra ngoài. Trả lời **ghép từ nhận định có mã quy tắc** do `sinhLuanGiai` đã sinh cho lá số (cùng nguồn, cùng bộ lọc từ cấm như bài luận). Mỗi câu trả lời = vài nhận định kèm sao/cung/nguồn/trường phái. Không có câu không mã. Chi phí token = 0.
2. **Hiểu câu hỏi** bằng bộ từ khóa → chuyên đề (`menh`, `phu-the`, `quan-loc`, `tai-bach`, `dien-trach`, `van-10-nam`; "năm nay/2027" → vận năm nếu khách có quyền Vận năm). Không khớp → trả "chưa trả lời được", **không trừ lượt**.
3. **Chỉ trả lời trong phạm vi luận giải đã có**: câu hỏi về sức khỏe/tuổi thọ/giờ chết, "có ly hôn không", "ngày giờ tốt", giải hạn, cúng bùa, người khác (không phải chủ lá số) → từ chối nhẹ, hướng sang góc "hiểu mình, định hướng", không trừ lượt. Chủ đề chưa có nội dung (CHU_DE_CO_NOI_DUNG) → không trả lời.
4. **Hạn mức 5 câu/tháng, đếm phía máy chủ**, theo **tài khoản thành viên** (không theo lá số), kỳ = tháng dương lịch giờ Việt Nam, không cộng dồn. Trừ lượt trong cùng giao dịch SQLite với việc ghi câu trả lời (chặn gửi song song vượt hạn). Câu 6 → 429 mã `het_luot`, nêu ngày lượt mới. Chỉ trừ khi đã trả lời được.
5. **Quyền**: chỉ `thanh_vien` còn hạn và lá số nằm trong 3 lá số đầu (dùng `coQuyenXem`/`tongHopQuyen`). Chưa mua gói năm → 403 `chua_mua`; giao diện hiện ô hỏi dạng khóa kèm nút xem gói. Tuyệt đối không lộ nội dung cho lá số người khác.
6. **Bảo mật dữ liệu**: lưu câu hỏi và câu trả lời mã hóa (`maHoaJson`), không ghi vào nhật ký/sự kiện đo lường; xóa tài khoản xóa theo (đưa vào script xóa của L-14d05a). Giới hạn độ dài câu hỏi 200 ký tự; lọc `lamSachCau` + từ cấm trên đầu ra.
7. **Giao diện** (`/luan-giai`, Mai rà): dưới các chủ đề, khối "Hỏi về lá số của bạn": ô nhập, 3 câu gợi ý bấm nhanh, dòng "Còn X/5 câu tháng này, làm mới ngày …". Câu trả lời: đoạn dẫn 1–2 dòng + danh sách nhận định có chip sao/cung/nguồn như bài luận; cuối câu ghi `GHI_CHU`. Lịch sử hỏi đáp hiện dưới ô (xem lại không tốn lượt). Chữ: không "AI", dùng "hệ thống xemtuvi.vn".
8. **Thẻ gói**: giữ dòng "hỏi đáp 5 câu/tháng" chỉ khi nghiệm thu đạt; nếu không kịp 20/11 → gỡ khỏi `goi.ts` + `bang-gia.md` + FAQ (một việc riêng, Minh quyết 19/11).

## Dữ liệu
Bảng `hoi_dap` (migration kế tiếp): id, nguoi_dung_id, la_so_id, luc (ms), thang ('YYYY-MM'), noi_dung_ma_hoa. Đếm = COUNT theo (nguoi_dung_id, thang). Chỉ dòng đã trả lời thành công mới được ghi.

## API
`POST /api/hoi-dap` {laSoId, cau} → {tra_loi: {doan_dan, nhanDinh[]}, con_lai}; `GET /api/hoi-dap?laSoId=` → {lich_su[], con_lai, lam_moi}.

## Nghiệm thu (đo được)
- Test đơn vị/tích hợp: gói năm hỏi 5 câu OK, câu 6 → 429; sang tháng mới (giả lập giờ) còn 5; câu bị từ chối/không khớp không trừ lượt; 2 yêu cầu song song ở câu 5 chỉ 1 thành công; tài khoản không có gói năm → 403; lá số thứ 4 → 403.
- Mọi câu trả lời: mọi nhận định có quyTacId, không chứa từ trong tu-cam.json.
- 10 câu mẫu (`docs/san-pham/hoi-dap-mau.md`, Tùng chạy trên lá số mẫu) Thư chấm theo `kiem-duyet-noi-dung`, TB ≥ 8, không câu nào dưới 7.
