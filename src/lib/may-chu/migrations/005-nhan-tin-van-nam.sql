-- Đăng ký nhận tin Vận 2027 ở trang /van-nam-2027. Chỉ lưu khi khách tích đồng ý (ô không tích sẵn).
-- ban_chu = phiên bản câu chữ đồng ý lúc khách tích. Hủy = đặt huy_luc (giữ dòng để không gửi lại). Thời gian: mili giây UNIX.
CREATE TABLE nhan_tin_van_nam (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  ma_huy TEXT NOT NULL UNIQUE,
  dong_y_luc INTEGER NOT NULL,
  nguon TEXT NOT NULL DEFAULT '{}',
  ban_chu TEXT NOT NULL,
  huy_luc INTEGER
);
