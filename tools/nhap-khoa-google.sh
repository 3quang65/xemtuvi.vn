#!/usr/bin/env bash
# Nhập Google Client ID/Secret vào ~/xemtuvi-data/.env (ngoài repo, quyền 600) rồi khởi động lại site.
# Anh Cường chạy: bash ~/xemtuvi.vn/tools/nhap-khoa-google.sh  — Secret gõ ẩn, không in ra màn hình, không lưu lịch sử.
set -euo pipefail
DIR="${XTV_DATA_DIR:-$HOME/xemtuvi-data}"; ENV="$DIR/.env"
mkdir -p "$DIR"; touch "$ENV"; chmod 600 "$ENV"

read -r -p "Dán Client ID (đuôi .apps.googleusercontent.com) rồi Enter: " ID
ID="$(echo "$ID" | tr -d '[:space:]')"
[[ "$ID" =~ ^[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com$ ]] || { echo "✗ Client ID không đúng dạng. Chạy lại lệnh và dán lại."; exit 1; }

read -r -s -p "Dán Client secret (bắt đầu GOCSPX-, gõ sẽ không hiện chữ) rồi Enter: " SEC; echo
SEC="$(echo "$SEC" | tr -d '[:space:]')"
[[ "$SEC" =~ ^GOCSPX-[A-Za-z0-9_-]{10,}$ ]] || { echo "✗ Client secret không đúng dạng. Chạy lại lệnh và dán lại."; exit 1; }

TMP="$(mktemp "$DIR/.env.XXXX")"; chmod 600 "$TMP"
grep -vE '^\s*GOOGLE_CLIENT_(ID|SECRET)\s*=' "$ENV" > "$TMP" || true
printf 'GOOGLE_CLIENT_ID=%s\nGOOGLE_CLIENT_SECRET=%s\n' "$ID" "$SEC" >> "$TMP"
mv "$TMP" "$ENV"; unset SEC

if [[ -z "${XTV_DATA_DIR:-}" ]] && command -v pm2 >/dev/null; then pm2 restart xemtuvi >/dev/null && sleep 4; fi
if [[ -z "${XTV_DATA_DIR:-}" ]] && curl -fsS https://v3.xemtuvi.vn/api/dang-nhap/cau-hinh 2>/dev/null | grep -q '"google":true'; then
  echo "✓ Đã lưu khóa. Nút \"Đăng nhập bằng Google\" đã bật trên v3.xemtuvi.vn."
else
  echo "✓ Đã lưu khóa vào $ENV. (Chưa kiểm được site; báo Sơn kiểm giúp.)"
fi
