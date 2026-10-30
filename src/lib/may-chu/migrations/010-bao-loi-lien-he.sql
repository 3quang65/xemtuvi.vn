-- Liên hệ khách tự điền để được trả lời báo lỗi (email hoặc số Zalo đã chuẩn hóa; rỗng nếu không điền).
-- Chỉ dùng trả lời đúng báo lỗi này. Xóa theo xoaTaiKhoan. trang_thai thêm giá trị da_xu_ly (tools/bao-loi.cjs danh-dau).
ALTER TABLE bao_loi ADD COLUMN lien_he_tra_loi TEXT NOT NULL DEFAULT '';
