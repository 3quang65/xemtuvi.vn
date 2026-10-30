-- Số tiền đã trừ khi nâng lên Thành viên năm (0 = không trừ). Cột có DEFAULT nên DB cũ giữ nguyên dữ liệu.
ALTER TABLE don_hang ADD COLUMN tru INTEGER NOT NULL DEFAULT 0;
