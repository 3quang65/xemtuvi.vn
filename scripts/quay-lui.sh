#!/usr/bin/env bash
# Quay lui về bản build trước (mục tiêu ≤ 10 phút, thực tế vài chục giây). Dùng: scripts/quay-lui.sh [--nginx] [--kiem-tra]
#   (không tham số) đổi sang ô build còn lại (.next-a <-> .next-b): ghi .next-slot, pm2 delete + start ecosystem (nạp lại cờ môi trường), kiểm site sống.
#   --nginx     thêm: khôi phục conf nginx trước (/etc/nginx/sites-available/xemtuvi.truoc, do trien-khai.sh lưu), nginx -t rồi reload.
#   --kiem-tra  chỉ kiểm điều kiện (đủ 2 bản build, ô trước hợp lệ), không đổi gì.
# Chạy lần nữa = quay về bản vừa rời. Không đụng CSDL (tệp ngoài repo). Cây git KHÔNG bị đổi: commit xấu phải `git revert` trước khi triển khai lại,
# nếu không trien-khai.sh sẽ build lại đúng nó. Biến XTV_ROOT trỏ repo đang chạy (mặc định: repo chứa script).
set -euo pipefail
ROOT="${XTV_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"; cd "$ROOT"
T0=$(date +%s); T=$T0
buoc() { local n=$(date +%s); printf '[%3ss | tổng %3ss] %s\n' $((n-T)) $((n-T0)) "$1"; T=$n; }
HIEN="$(cat .next-slot 2>/dev/null || echo .next)"
case "$HIEN" in .next-a) TRUOC=.next-b;; .next-b) TRUOC=.next-a;; *) echo "TỪ CHỐI: .next-slot='$HIEN' không phải .next-a/.next-b"; exit 1;; esac
for o in .next-a .next-b; do [ -f "$o/BUILD_ID" ] || { echo "TỪ CHỐI: thiếu bản build $o (cần giữ ≥ 2 bản build)"; exit 1; }; done
cm() { cat "$1/COMMIT" 2>/dev/null | cut -c1-8 || true; }
echo "Hiện tại: $HIEN (commit $(cm $HIEN)) -> quay lui về: $TRUOC (commit $(cm $TRUOC))"
buoc "kiểm điều kiện: đủ 2 bản build"
[ "${1:-}" = "--kiem-tra" ] && { echo "OK, chưa đổi gì."; exit 0; }
if [ "${1:-}" = "--nginx" ]; then
  [ -f /etc/nginx/sites-available/xemtuvi.truoc ] || { echo "TỪ CHỐI: không có xemtuvi.truoc"; exit 1; }
  sudo cp -a /etc/nginx/sites-available/xemtuvi /tmp/xemtuvi.vua-roi
  sudo cp -a /etc/nginx/sites-available/xemtuvi.truoc /etc/nginx/sites-available/xemtuvi
  if sudo nginx -t 2>/dev/null; then sudo systemctl reload nginx; buoc "nginx: khôi phục conf trước + reload"
  else sudo cp -a /tmp/xemtuvi.vua-roi /etc/nginx/sites-available/xemtuvi; echo "conf trước lỗi nginx -t, giữ conf hiện tại" >&2; buoc "nginx: bỏ qua (conf trước lỗi)"; fi
fi
echo "$TRUOC" > .next-slot
export NEXT_DIST_DIR="$TRUOC"
pm2 delete xemtuvi >/dev/null 2>&1 || true
buoc "pm2 delete xemtuvi"
SITE_NOINDEX="${SITE_NOINDEX:-1}" pm2 start ecosystem.config.cjs --update-env >/dev/null
pm2 save >/dev/null
buoc "pm2 start ecosystem (NEXT_DIST_DIR=$TRUOC)"
OK=0
for i in $(seq 1 60); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/)" = 200 ] && { OK=1; break; }
  sleep 1
done
buoc "site sống lại (cổng 3000 trả 200) lần thử $i"
[ $OK = 1 ] || { echo "SITE KHÔNG LÊN: xem pm2 logs xemtuvi; thử chạy lại script để về $HIEN" >&2; exit 1; }
CH="$(curl -s http://127.0.0.1:3000/ | grep -o '/_next/static/[^"]*\.js' | head -1)"
[ -n "$CH" ] && [ "$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:3000$CH")" = 200 ] || { echo "chunk tĩnh lỗi" >&2; exit 1; }
buoc "kiểm trang chủ + chunk tĩnh 200"
echo "XONG sau $(( $(date +%s) - T0 )) giây. Bản đang chạy: $TRUOC"
