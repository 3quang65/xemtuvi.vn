-- Bộ đếm chống gửi dồn /api/bao-loi, bền qua khởi động lại. khoa = băm nguồn gửi (không lưu địa chỉ gốc). luc: mili giây UNIX.
CREATE TABLE nguon_gui (khoa TEXT NOT NULL, luc INTEGER NOT NULL);
CREATE INDEX nguon_gui_khoa_luc ON nguon_gui (khoa, luc);
