-- Mã mời cho bản thử khách mời (docs/ky-thuat/ban-thu-khach-moi.md). Mã không chứa thông tin cá nhân.
-- nguon khớp mã nguon= của kinh doanh (tuvivn, anh, cd-3a..cd-3e). Thời gian: mili giây UNIX.
CREATE TABLE ma_moi (
  ma TEXT PRIMARY KEY,
  nguon TEXT NOT NULL,
  ghi_chu TEXT,
  gioi_han INTEGER NOT NULL DEFAULT 1,
  het_han INTEGER,
  tao_luc INTEGER NOT NULL
);

-- Mỗi tài khoản dùng mã mời một lần (UNIQUE nguoi_dung_id).
CREATE TABLE ma_moi_dung (
  id INTEGER PRIMARY KEY,
  ma TEXT NOT NULL REFERENCES ma_moi(ma),
  nguoi_dung_id INTEGER NOT NULL UNIQUE REFERENCES nguoi_dung(id) ON DELETE CASCADE,
  la_so_id INTEGER NOT NULL REFERENCES la_so(id),
  chu_de TEXT NOT NULL,
  luc INTEGER NOT NULL
);
CREATE INDEX ma_moi_dung_ma ON ma_moi_dung (ma);
