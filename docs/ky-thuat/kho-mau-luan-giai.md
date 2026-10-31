# Kho mẫu huấn luyện luận giải (L-c8e74f)

Mục đích: lưu lời giải đã biên tập + điểm Thư để tháng 12 huấn luyện mô hình local (A6000). Kho nằm **ngoài repo công khai**: `~/xemtuvi-data/mau-luan-giai/` (đổi bằng `MAU_LUAN_GIAI_DIR`). Chỉ dữ liệu lá số (giới, ngày giờ sinh, sao), không tên/SĐT/email.

## Lệnh
- Lưu một mẫu: `node tools/luu-mau-luan-giai.cjs --tu <lời giải.md> --la-so <TCxx|tệp.json|'{json}'> --dung N --sau N --giong N --an-toan N --nguoi-cham thu --nguoi-viet hanh --nguon hanh|duc|claude|mau [--nguon-goc claude] [--chuyen-de menh] [--tang bai|doan] [--ly-do-am "…"] [--thu]`
- Nạp quét tự động: `node tools/nap-mau-luan-giai.cjs [--thu]` (cron 23:10 hằng đêm, trước sao lưu 23:15; trùng thì bỏ qua).
- Thống kê: `node tools/thong-ke-mau-luan-giai.cjs [--json]`.
- Sao lưu: `tools/sao-luu-csdl.cjs` nén kho thành `mau-luan-giai-<ngày>.tar.gz` (giữ 14 bản, Drive "09 Sao lưu (backup)/Mẫu luận giải/").

## Quy tắc phân loại (Minh chốt 31/10, L-733080)
Dương: TB ≥ 7,5 · không tiêu chí < 6 · Sâu ≥ 6 · An toàn = 10 · Đúng ≥ 8. Không đạt → mẫu âm (`am-YYYY-MM.jsonl`, bắt buộc `lyDoAm`). Lệnh lưu không nâng điểm, không cho nhãn dương khi chưa đạt. Từ chối: thiếu trường, điểm lệch, SĐT/email, từ cấm (`tu-cam.json`, mẫu dương), thiếu người chấm.

## Trường mỗi dòng
id, ngay, tang (bai|doan), chuyenDe, laSo (đầu vào + 12 cung sao/độ sáng/Tuần-Triệt/đại vận + `daiVanHienTai`, tuổi mụ tại `ngay`), laSoId, cauHoi, loiGiai, maQuyTac[], tyLeChuMau (null đến khi chạy B1), nguoiViet, nguoiBienTap, nguoiCham, diem (TB 4 tiêu chí), diemThu{dung,sau,giong,anToan}, loai, lyDoAm, phienBanQuyTac (git `src/lib/tuvi`), phienBanKho (git `quy-tac*.json`), nguon (claude|hanh|duc|mau), nguonGoc (sach|nguoi|claude|claude-bien-tap-nguoi), quyenSoHuu.
Ghi chú: `phienBanQuyTac`/`phienBanKho` của mẫu nạp lại là phiên bản **tại lúc nạp**, không phải lúc viết. `nguon`=`mau` là bài do bộ ghép sinh từ quy tắc Hạnh viết (`nguonGoc`=`claude`).
