#!/usr/bin/env bash
# Thử tải CHỈ vào localhost (nginx cổng 80 với Host v3, hoặc app cổng 3000). KHÔNG gọi site cũ, KHÔNG gọi API ghi dữ liệu/thanh toán.
# Dùng: tools/thu-tai.sh [nhan] [muc-ket-noi...]   vd: tools/thu-tai.sh truoc 50 100 200
# Biến: GIAY=30  DICH=http://127.0.0.1  HOST=v3.xemtuvi.vn  TRANG="/ /chon-goi /van-nam-2027 /api/gia"
set -euo pipefail
NHAN="${1:-thu}"; shift || true
MUC="${*:-50 100 200}"
GIAY="${GIAY:-30}"; DICH="${DICH:-http://127.0.0.1}"; HOST="${HOST:-v3.xemtuvi.vn}"
TRANG="${TRANG:-/ /chon-goi /van-nam-2027 /api/gia}"
case "$DICH" in http://127.0.0.1*|http://localhost*) ;; *) echo "Chỉ cho phép thử tải vào localhost"; exit 2;; esac
RA="${RA:-/tmp/thu-tai-$NHAN}"; mkdir -p "$RA"
for c in $MUC; do
  for p in $TRANG; do
    ten="$(echo "$p" | tr '/' '_')"; [ "$ten" = "_" ] && ten="_trang-chu"
    vmstat 2 $((GIAY/2+1)) > "$RA/vm-$c$ten.txt" &
    VM=$!
    npx -y autocannon -c "$c" -d "$GIAY" -H "Host: $HOST" --json "$DICH$p" > "$RA/ac-$c$ten.json" 2>/dev/null
    wait $VM || true
    PM=$(pm2 jlist 2>/dev/null | node -e 'const l=JSON.parse(require("fs").readFileSync(0));const x=l.filter(p=>p.name==="xemtuvi");console.log(x.length+" inst, RAM "+Math.round(x.reduce((a,p)=>a+p.monit.memory,0)/1048576)+"MB")')
    node -e '
const r=JSON.parse(require("fs").readFileSync(process.argv[1]));
const vm=require("fs").readFileSync(process.argv[2],"utf8").trim().split("\n").slice(3).map(l=>l.trim().split(/\s+/).map(Number));
const cpu=vm.map(a=>100-a[14]); const cmax=Math.max(...cpu), ctb=(cpu.reduce((a,b)=>a+b,0)/cpu.length).toFixed(0);
const tot=r["2xx"]+r.non2xx+r.errors+r.timeouts; const loi=((r.non2xx+r.errors+r.timeouts)/Math.max(tot,1)*100).toFixed(2);
console.log([process.argv[3],process.argv[4],"rps="+Math.round(r.requests.average),"p50="+r.latency.p50,"p90="+r.latency.p90,"p97.5="+r.latency.p97_5,"p99="+r.latency.p99,"max="+r.latency.max,"loi%="+loi,"cpu_tb/max="+ctb+"/"+cmax+"%",process.argv[5]].join(" | "));
' "$RA/ac-$c$ten.json" "$RA/vm-$c$ten.txt" "$c" "$p" "$PM,$(free -m | awk '/Mem/{printf "RAM máy %d%%", $3*100/$2}')" | tee -a "$RA/ket-qua.txt"
    sleep 3
  done
done
