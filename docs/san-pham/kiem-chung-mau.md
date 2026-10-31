# Kiểm chứng năm đã qua (2025, 2026): khung câu chữ

TẠM – chờ Hạnh/Thư. Toàn bộ câu dưới đây là khung tạm do Bảo dựng để chạy thử A/B; Hạnh viết lại, Thư duyệt, rồi chép vào `CHU_DE_CUNG` và `MAU_CAU` trong `src/lib/luan-giai/ai/kiem-chung.ts` và `src/lib/kiem-chung-noi-dung.ts`, đổi `KIEM_CHUNG_CAU_TAM` sang false.

Nguyên tắc: chỉ nói xu hướng truy về sao/cung; không khẳng định sự kiện đã xảy ra; không câu gây sợ hay ép mua; không câu ai đọc cũng đúng (mỗi câu nêu cung cụ thể của lá số).

## Mẫu câu (TẠM)
- Trọng điểm mỗi năm: "Năm {năm} ({can chi}): lá số của bạn đặt trọng điểm của năm ở cung {cung Lưu Thái Tuế}, liên quan đến {chủ đề cung}. Đây là xu hướng theo cách an sao."
- Chỉ năm 2026: "Cũng trong năm 2026, nguồn thuận của năm dễ đến qua lĩnh vực của cung {cung Hóa Lộc lưu niên} ({chủ đề}). Đây là khả năng nghiêng về, không phải điều chắc xảy ra."
- Căn cứ (dưới mỗi câu): Lưu Thái Tuế / Hóa Lộc lưu niên rơi vào cung nào, tam hợp phái Việt.
- Nhãn minh bạch (đầu mục): hệ thống tạo tự động, nói về xu hướng, không khẳng định điều đã xảy ra, bạn tự đối chiếu; cuối mục ghi trường phái.

## Chủ đề 12 cung (TẠM)
Mệnh, Phụ Mẫu, Phúc Đức, Điền Trạch, Quan Lộc, Nô Bộc, Thiên Di, Tật Ách, Tài Bạch, Tử Tức, Phu Thê, Huynh Đệ: xem bảng `CHU_DE_CUNG`.

## Bật thử
`KIEM_CHUNG_QUA_KHU=1` khi chạy máy chủ (mặc định tắt, không có trong `ecosystem.config.cjs`). Nhóm theo phiên 50/50 (a thấy, b không). Sự kiện: `xem_truoc_mo`, `kiem_chung_xem`, `bam_mua`, trường `nhom_ab`.
