-- Báo lỗi / góp ý từ khối cuối trang /tro-giup. Không có cột ngày giờ sinh (khách không phải khai).
-- tinh_huong: mã tình huống tự điền (E04, E05, E07, E08) hoặc rỗng. trang_thai: moi | da_doc. Thời gian: mili giây UNIX.
CREATE TABLE bao_loi (
  id INTEGER PRIMARY KEY,
  tao_luc INTEGER NOT NULL,
  mo_ta TEXT NOT NULL,
  ma_don TEXT NOT NULL DEFAULT '',
  goi TEXT NOT NULL DEFAULT '',
  thiet_bi TEXT NOT NULL DEFAULT '',
  gio_khach TEXT NOT NULL DEFAULT '',
  tinh_huong TEXT NOT NULL DEFAULT '',
  nguoi_dung_id INTEGER REFERENCES nguoi_dung(id) ON DELETE SET NULL,
  trang_thai TEXT NOT NULL DEFAULT 'moi'
);
CREATE INDEX bao_loi_tao_luc ON bao_loi (tao_luc);
