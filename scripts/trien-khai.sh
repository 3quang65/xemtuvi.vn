#!/usr/bin/env bash
# Triển khai 1 lệnh: scripts/trien-khai.sh [tên-miền-thử]
#   Không tham số: chỉ build + chạy lại pm2 (cập nhật code).
#   Có tên miền (đã trỏ DNS về VPS): cấu hình nginx + xin HTTPS Let's Encrypt.
# Bản thử luôn noindex (SITE_NOINDEX=1). Gỡ khi ra chính thức.
set -euo pipefail
cd "$(dirname "$0")/.."
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
echo "$MOI" > .next-slot
export NEXT_DIST_DIR="$MOI"
SITE_NOINDEX="${SITE_NOINDEX:-1}" pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save
if [ "${1:-}" != "" ]; then
  MIEN="$1"
  sed "s/__TEN_MIEN__/$MIEN/g" deploy/nginx.conf.mau | sudo tee /etc/nginx/sites-available/xemtuvi >/dev/null
  sudo ln -sf /etc/nginx/sites-available/xemtuvi /etc/nginx/sites-enabled/xemtuvi
  sudo rm -f /etc/nginx/sites-enabled/default
  sudo nginx -t && sudo systemctl reload nginx
  sudo certbot --nginx -d "$MIEN" --non-interactive --agree-tos --register-unsafely-without-email --redirect
fi
curl -sI http://127.0.0.1:3000 | head -1
