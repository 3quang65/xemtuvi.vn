"""Đếm quy tắc, tỉ lệ có nguồn, độ phủ 14 chính tinh × 12 cung trong bộ luận giải.
Dùng: python3 -I dem-quy-tac.py <file.md> [...]"""
import re
import sys
from collections import Counter, defaultdict

SAO = ["TV", "LT", "TD", "VK", "TDU", "TCO", "TP", "TA", "THL", "CM", "TT", "TL", "TS", "PQ"]
CUNG = ["MENH", "HUYNH", "PHU", "TU", "TAI", "TAT", "DI", "NO", "QUAN", "DIEN", "PHUC", "PHUMAU"]
RULE = re.compile(r"^\s*-\s+\*\*\[([A-Z]+)-([A-Z]+(?:-[A-Z]+)?)-(\d+[a-z]?)\]\*\*(.*)$")
NGUON = re.compile(r"Nguồn:\s*\S")

tong = 0
co_nguon = 0
mot_nguon = 0
chua_nguon = 0
phu = defaultdict(Counter)
theo_cung = Counter()
ma_nguon = Counter()
trung = Counter()
for path in sys.argv[1:]:
    for line in open(path, encoding="utf-8"):
        m = RULE.match(line)
        if not m:
            continue
        cung, chude, so, rest = m.groups()
        trung[f"{cung}-{chude}-{so}"] += 1
        tong += 1
        theo_cung[cung] += 1
        phu[cung][chude] += 1
        if "⚑chưa-nguồn" in rest or not NGUON.search(rest):
            chua_nguon += 1
        else:
            co_nguon += 1
            nguon = rest.split("Nguồn:", 1)[1]
            for code in set(re.findall(r"\b(TT|TB|NL|CN|KL|HS|TC|PT|W\d+|[A-Z]{2,4}\d*)\b", nguon)):
                ma_nguon[code] += 1
        if "⚑1nguồn" in rest:
            mot_nguon += 1

print(f"Tổng quy tắc: {tong}; có nguồn: {co_nguon} ({co_nguon / max(tong, 1):.1%}); "
      f"⚑1nguồn: {mot_nguon}; chưa nguồn: {chua_nguon}")
print("Theo cung:", dict(theo_cung))
thieu = []
for c in CUNG:
    if c not in phu:
        continue
    for s in SAO:
        if phu[c][s] < 2:
            thieu.append(f"{c}-{s}({phu[c][s]})")
    for muc in ["YN", "SP", "CC", "HOA", "TRANH"]:
        if phu[c][muc] == 0:
            thieu.append(f"{c}-{muc}(0)")
print("Thiếu (<2 quy tắc sao hoặc thiếu mục):", thieu or "không")
print("Mã trùng:", [k for k, v in trung.items() if v > 1] or "không")
print("Mã nguồn dùng nhiều:", ma_nguon.most_common(15))
print("Số mã nguồn khác nhau:", len(ma_nguon))
