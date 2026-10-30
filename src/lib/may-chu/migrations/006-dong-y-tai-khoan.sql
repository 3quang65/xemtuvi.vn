-- Đồng ý nhận tin ở bước lập lá số: lưu phiên bản câu chữ lúc tích; nếu khách đang đăng nhập thì gắn tài khoản
-- để xóa tài khoản xóa luôn cờ đồng ý (kể cả số Zalo). Không khóa ngoại: xóa tài khoản do dich-vu.xoaTaiKhoan lo.
ALTER TABLE lien_he ADD COLUMN ban_chu TEXT NOT NULL DEFAULT 'lap-la-so-v1';
ALTER TABLE lien_he ADD COLUMN nguoi_dung_id INTEGER;
CREATE INDEX lien_he_nguoi ON lien_he (nguoi_dung_id);
