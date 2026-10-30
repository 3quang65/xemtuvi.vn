-- Cấu trúc ban đầu (docs/ky-thuat/backend.md mục 3). Thời gian: mili giây UNIX.
CREATE TABLE nguoi_dung (
  id INTEGER PRIMARY KEY,
  nha_cung_cap TEXT NOT NULL,
  ma_ngoai TEXT NOT NULL,
  email TEXT,
  tao_luc INTEGER NOT NULL,
  UNIQUE (nha_cung_cap, ma_ngoai)
);

CREATE TABLE phien (
  ma_bam TEXT PRIMARY KEY,
  nguoi_dung_id INTEGER NOT NULL REFERENCES nguoi_dung(id) ON DELETE CASCADE,
  het_han INTEGER NOT NULL
);

CREATE TABLE la_so (
  id INTEGER PRIMARY KEY,
  nguoi_dung_id INTEGER NOT NULL REFERENCES nguoi_dung(id) ON DELETE CASCADE,
  sinh_ma_hoa TEXT NOT NULL,
  khoa_tim TEXT NOT NULL,
  ten_goi TEXT,
  tao_luc INTEGER NOT NULL,
  UNIQUE (nguoi_dung_id, khoa_tim)
);

CREATE TABLE don_hang (
  id INTEGER PRIMARY KEY,
  nguoi_dung_id INTEGER NOT NULL REFERENCES nguoi_dung(id),
  la_so_id INTEGER REFERENCES la_so(id),
  ma_goi TEXT NOT NULL,
  chu_de TEXT,
  so_tien INTEGER NOT NULL,
  trang_thai TEXT NOT NULL DEFAULT 'cho' CHECK (trang_thai IN ('cho','da_tra','huy','hoan')),
  cong TEXT NOT NULL DEFAULT 'gia_lap',
  ma_giao_dich_cong TEXT,
  tao_luc INTEGER NOT NULL,
  tra_luc INTEGER
);
CREATE UNIQUE INDEX don_hang_giao_dich ON don_hang (cong, ma_giao_dich_cong) WHERE ma_giao_dich_cong IS NOT NULL;

CREATE TABLE quyen_xem (
  id INTEGER PRIMARY KEY,
  nguoi_dung_id INTEGER NOT NULL REFERENCES nguoi_dung(id) ON DELETE CASCADE,
  la_so_id INTEGER REFERENCES la_so(id),
  loai TEXT NOT NULL CHECK (loai IN ('chu_de','tron_la_so','thanh_vien')),
  chu_de TEXT,
  tu_luc INTEGER NOT NULL,
  den_luc INTEGER,
  don_hang_id INTEGER NOT NULL REFERENCES don_hang(id),
  UNIQUE (don_hang_id)
);
CREATE INDEX quyen_xem_nguoi ON quyen_xem (nguoi_dung_id);

CREATE TABLE luan_giai_luu (
  khoa_cache TEXT PRIMARY KEY,
  chuyen_de TEXT NOT NULL,
  phien_ban TEXT NOT NULL,
  noi_dung_ma_hoa TEXT NOT NULL
);
