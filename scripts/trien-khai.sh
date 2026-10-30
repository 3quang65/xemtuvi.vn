#!/usr/bin/env bash
# Triển khai 1 lệnh: scripts/trien-khai.sh [tên-miền-thử]
#   Không tham số: chỉ build + chạy lại pm2 (cập nhật code).
#   Có tên miền (đã trỏ DNS về VPS): cấu hình nginx + xin HTTPS Let's Encrypt.
# Bản thử luôn noindex (SITE_NOINDEX=1). Gỡ khi ra chính thức.
set -euo pipefail
cd "$(dirname "$0")/.."
npm ci --silent
npm test --silent
npm run build
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
