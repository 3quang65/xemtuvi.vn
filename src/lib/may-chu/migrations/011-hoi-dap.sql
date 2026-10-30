-- Hỏi đáp về lá số (Thành viên năm, 5 câu/tháng): chỉ ghi dòng đã trả lời thành công; đếm = COUNT theo (nguoi_dung_id, thang).
CREATE TABLE hoi_dap (
  id INTEGER PRIMARY KEY,
  nguoi_dung_id INTEGER NOT NULL REFERENCES nguoi_dung(id),
  la_so_id INTEGER NOT NULL REFERENCES la_so(id),
  luc INTEGER NOT NULL,
  thang TEXT NOT NULL,
  noi_dung_ma_hoa TEXT NOT NULL
);
CREATE INDEX hoi_dap_nguoi_thang ON hoi_dap (nguoi_dung_id, thang);
