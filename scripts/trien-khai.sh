#!/usr/bin/env bash
# Triển khai 1 lệnh: scripts/trien-khai.sh [tên-miền-thử]
#   Không tham số: chỉ build + chạy lại pm2 (cập nhật code).
#   Có tên miền (đã trỏ DNS về VPS): cấu hình nginx + xin HTTPS Let's Encrypt.
# Bản thử luôn noindex (SITE_NOINDEX=1). Gỡ khi ra chính thức.
set -euo pipefail
cd "$(dirname "$0")/.."
# Từ chối khi còn thay đổi chưa commit: bản chạy thật phải trùng với git. Ép bỏ qua: CHO_PHEP_GIT_BAN=1.
if [ -n "$(git status --porcelain)" ] && [ "${CHO_PHEP_GIT_BAN:-}" != "1" ]; then
  echo "TỪ CHỐI: git status chưa sạch. Commit hoặc gỡ trước khi triển khai:" >&2
  git status --short >&2
  exit 1
fi
# npm ci xóa node_modules đang chạy: chỉ cài lại khi package-lock.json đổi.
if [ "$(sha1sum package-lock.json | cut -d' ' -f1)" != "$(cat .lock-da-cai 2>/dev/null || echo)" ] || [ ! -d node_modules ]; then
  npm ci --silent
  sha1sum package-lock.json | cut -d' ' -f1 > .lock-da-cai
fi
npm test --silent
# Build vào ô trống (.next-a / .next-b), site vẫn chạy ô đang dùng; xong mới đổi ô + pm2 reload (cluster, không rớt yêu cầu).
HIEN_TAI="$(cat .next-slot 2>/dev/null || echo)"
if [ "$HIEN_TAI" = ".next-a" ]; then MOI=".next-b"; else MOI=".next-a"; fi
rm -rf "$MOI"
NEXT_DIST_DIR="$MOI" npm run build
git rev-parse HEAD > "$MOI/COMMIT"   # quay-lui.sh đọc để biết ô này build từ commit nào; ô cũ (.next-a/.next-b còn lại) giữ nguyên = bản quay lui
echo "$MOI" > .next-slot
export NEXT_DIST_DIR="$MOI"
SITE_NOINDEX="${SITE_NOINDEX:-1}" pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save
if [ "${1:-}" != "" ]; then
  MIEN="$1"
  # Giữ conf nginx trước (quay-lui.sh --nginx dùng lại)
  [ -f /etc/nginx/sites-available/xemtuvi ] && sudo cp -a /etc/nginx/sites-available/xemtuvi /etc/nginx/sites-available/xemtuvi.truoc
  sed "s/__TEN_MIEN__/$MIEN/g" deploy/nginx.conf.mau | sudo tee /etc/nginx/sites-available/xemtuvi >/dev/null
  sudo ln -sf /etc/nginx/sites-available/xemtuvi /etc/nginx/sites-enabled/xemtuvi
  sudo rm -f /etc/nginx/sites-enabled/default
  sudo nginx -t && sudo systemctl reload nginx
  sudo certbot --nginx -d "$MIEN" --non-interactive --agree-tos --register-unsafely-without-email --redirect
fi
# Đồng bộ GitHub: sau khi triển khai xong, đẩy main lên origin; lỗi chỉ CẢNH BÁO (không làm hỏng bản đã chạy). Bỏ qua: DONG_BO_GIT=0.
if [ "${DONG_BO_GIT:-1}" != "0" ] && [ "$(git rev-parse --abbrev-ref HEAD)" = "main" ]; then
  git push origin main >/dev/null 2>&1 || echo "CẢNH BÁO: không push được main lên GitHub, kiểm tra mạng/quyền rồi chạy: git push origin main" >&2
  git fetch -q origin 2>/dev/null || true
  CHENH="$(git rev-list --count origin/main..main 2>/dev/null || echo 0)"
  [ "$CHENH" != "0" ] && echo "CẢNH BÁO: main còn trước origin $CHENH commit (chưa lên GitHub)" >&2
fi
curl -sI http://127.0.0.1:3000 | head -1
