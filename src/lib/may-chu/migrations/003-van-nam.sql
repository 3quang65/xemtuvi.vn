-- Thêm loại quyền 'van_nam' (chuyên đề Vận năm 2027) và cho phép một đơn cấp hai quyền (gói gộp).
CREATE TABLE quyen_xem_moi (
  id INTEGER PRIMARY KEY,
  nguoi_dung_id INTEGER NOT NULL REFERENCES nguoi_dung(id) ON DELETE CASCADE,
  la_so_id INTEGER REFERENCES la_so(id),
  loai TEXT NOT NULL CHECK (loai IN ('chu_de','tron_la_so','thanh_vien','van_nam')),
  chu_de TEXT,
  tu_luc INTEGER NOT NULL,
  den_luc INTEGER,
  don_hang_id INTEGER NOT NULL REFERENCES don_hang(id),
  UNIQUE (don_hang_id, loai)
);
INSERT INTO quyen_xem_moi SELECT id, nguoi_dung_id, la_so_id, loai, chu_de, tu_luc, den_luc, don_hang_id FROM quyen_xem;
DROP TABLE quyen_xem;
ALTER TABLE quyen_xem_moi RENAME TO quyen_xem;
CREATE INDEX quyen_xem_nguoi ON quyen_xem (nguoi_dung_id);
