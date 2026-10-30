-- Liên hệ khách để lại ở bước lập lá số (kế hoạch 90 ngày mục 5A). Chỉ lưu khi khách tích đồng ý.
-- Không lưu thông tin sinh. Hủy đăng ký = đặt huy_luc (giữ dòng để không gửi lại). Thời gian: mili giây UNIX.
CREATE TABLE lien_he (
  id INTEGER PRIMARY KEY,
  loai TEXT NOT NULL CHECK (loai IN ('email','zalo')),
  gia_tri TEXT NOT NULL,
  ma_huy TEXT NOT NULL UNIQUE,
  dong_y_luc INTEGER NOT NULL,
  nguon TEXT NOT NULL DEFAULT '{}',
  huy_luc INTEGER,
  UNIQUE (loai, gia_tri)
);
