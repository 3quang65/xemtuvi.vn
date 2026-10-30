-- Mã khôi phục cho đăng nhập thử: chỉ lưu băm scrypt có muối (muối$băm, hex). NULL = tài khoản cũ chưa có mã.
ALTER TABLE nguoi_dung ADD COLUMN ma_khoi_phuc TEXT;
-- Lần nhập sai mã, đếm theo khóa 'e:<email>' hoặc 'i:<băm địa chỉ>'. Dọn dòng quá 15 phút khi ghi mới.
CREATE TABLE dang_nhap_sai (
  khoa TEXT NOT NULL,
  luc INTEGER NOT NULL
);
CREATE INDEX dang_nhap_sai_khoa ON dang_nhap_sai (khoa, luc);
