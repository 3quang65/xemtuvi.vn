#!/usr/bin/env bash
# Diễn tập khôi phục CSDL xemtuvi (L-ba78a4). Chạy: bash tools/dien-tap-khoi-phuc.sh
# Chỉ ĐỌC DB thật (readOnly). Mọi tệp ghi nằm trong thư mục tạm, xóa khi xong. Không Drive/pm2/nginx. Chỉ in số dòng.
# Mã mời nằm trong DB (ma_moi, ma_moi_dung) nên một bản sao DB là đủ.
set -Eeuo pipefail
IFS=$'\n\t'

DB="${CSDL_TEP:-$HOME/xemtuvi-data/csdl/xemtuvi.db}"
TMP=""
cleanup() { [[ -n "$TMP" && -d "$TMP" ]] && rm -rf -- "$TMP"; return 0; }
trap cleanup EXIT
trap 'echo "[dien-tap] LỖI dòng ${LINENO}" >&2' ERR

command -v node >/dev/null || { echo "thiếu node" >&2; exit 2; }
[[ -r "$DB" ]] || { echo "không đọc được DB nguồn" >&2; exit 2; }
TMP="$(mktemp -d -t dien-tap-XXXXXXXX)"
chmod 700 "$TMP"

# Trợ giúp node:sqlite: sao-luu <nguon> <dich> | kiem <db> | dem <db>
read -r -d '' JS <<'JSEOF' || true
const { DatabaseSync } = require('node:sqlite');
const [m, a, b] = process.argv.slice(1);
if (m === 'sao-luu') { const d = new DatabaseSync(a, { readOnly: true }); d.exec(`VACUUM INTO '${b.replace(/'/g, "''")}'`); d.close(); }
else if (m === 'kiem') { const d = new DatabaseSync(a, { readOnly: true }); console.log(Object.values(d.prepare('PRAGMA integrity_check').get())[0]); d.close(); }
else if (m === 'dem') { const d = new DatabaseSync(a, { readOnly: true });
  for (const t of d.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all())
    console.log(t.name + ' ' + d.prepare('SELECT COUNT(*) c FROM "' + t.name.replace(/"/g, '""') + '"').get().c);
  d.close(); }
JSEOF
nd() { node --no-warnings -e "$JS" -- "$@"; }
now() { date +%s.%N; }
dt() { awk -v a="$1" -v b="$2" 'BEGIN{printf "%.2f", b-a}'; }

echo "[dien-tap] bắt đầu: $(TZ=Asia/Ho_Chi_Minh date '+%F %T') (giờ VN)"
T0="$(now)"
nd sao-luu "$DB" "$TMP/sao-luu.db";                       T1="$(now)"
SIZE_DB="$(stat -c %s "$TMP/sao-luu.db")"
GIO_SL="$(TZ=Asia/Ho_Chi_Minh date '+%F %T')"
gzip -c -- "$TMP/sao-luu.db" > "$TMP/sao-luu.db.gz";      T2="$(now)"
SIZE_GZ="$(stat -c %s "$TMP/sao-luu.db.gz")"
mkdir -- "$TMP/khoi-phuc"
gzip -dc -- "$TMP/sao-luu.db.gz" > "$TMP/khoi-phuc/xemtuvi.db"; T3="$(now)"
IC="$(nd kiem "$TMP/khoi-phuc/xemtuvi.db")";              T4="$(now)"
nd dem "$DB" > "$TMP/dem-that.txt"
nd dem "$TMP/khoi-phuc/xemtuvi.db" > "$TMP/dem-kp.txt";   T5="$(now)"

echo "[dien-tap] giờ sao lưu (VN): $GIO_SL ; db=${SIZE_DB}B gz=${SIZE_GZ}B"
echo "[dien-tap] thời gian (giây): VACUUM=$(dt "$T0" "$T1") nén=$(dt "$T1" "$T2") giải nén/khôi phục=$(dt "$T2" "$T3") integrity=$(dt "$T3" "$T4") đối chiếu=$(dt "$T4" "$T5") tổng=$(dt "$T0" "$T5")"
echo "[dien-tap] integrity_check bản khôi phục: $IC"
echo "[dien-tap] số dòng (bảng: thật / khôi phục):"
LECH=0
while IFS=" " read -r ten sl; do
  kp="$(awk -v t="$ten" '$1==t{print $2}' "$TMP/dem-kp.txt")"
  kp="${kp:-THIẾU}"
  tt="ok"; [[ "$sl" == "$kp" ]] || { tt="LỆCH"; LECH=$((LECH+1)); }
  nhan=""; case "$ten" in ma_moi|ma_moi_dung|nguoi_dung|don_hang) nhan=" *";; esac
  echo "  $ten$nhan: $sl / $kp $tt"
done < "$TMP/dem-that.txt"
KQ="KHỚP"; [[ "$LECH" -eq 0 && "$IC" == "ok" ]] || KQ="KHÔNG KHỚP (lệch $LECH bảng)"
echo "[dien-tap] kết quả: $KQ ; thư mục tạm sẽ xóa"
[[ "$KQ" == "KHỚP" ]]
