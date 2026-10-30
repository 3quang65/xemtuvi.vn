"""Gộp các phần nháp luan-giai/*.md thành luan-giai-12-cung.md.
Mã nguồn web W<n> của từng phần được đổi thành tiền tố riêng để không trùng.
Dùng: python3 -I gop-luan-giai.py <thư mục docs/nghien-cuu>"""
import re
import sys
from pathlib import Path

goc = Path(sys.argv[1])
nhap = goc / "luan-giai"
PHAN = [("cung-01-03.md", "WM", "1–3"), ("cung-04-06.md", "WT", "4–6"),
        ("cung-07-09.md", "WQ", "7–9"), ("cung-10-12.md", "WD", "10–12")]

than, phu_luc = [], []
for ten, tien_to, nhan in PHAN:
    text = re.sub(r"\bW(\d+)\b", lambda m: f"{tien_to}{m.group(1)}", (nhap / ten).read_text(encoding="utf-8"))
    dong = text.splitlines()
    dau = next(i for i, d in enumerate(dong) if re.match(r"## \d+\. ", d))
    cuoi = next(i for i, d in enumerate(dong) if d.startswith("## Danh sách"))
    ghi_chu = "\n".join(dong[1:dau]).strip()
    nguon = "\n".join(dong[cuoi + 1:]).strip()
    than.append("\n".join(dong[dau:cuoi]).rstrip())
    phu_luc.append(f"### Phần cung {nhan} (mã {tien_to}…)\n\n{ghi_chu}\n\n{nguon}")

chung = (nhap / "chung.md").read_text(encoding="utf-8")
chung = re.sub(r"^(#+) ", lambda m: "#" + m.group(1) + " ", chung, flags=re.M)

dau_trang = (goc / "luan-giai" / "DAU-TRANG.md").read_text(encoding="utf-8").rstrip()
tc01 = nhap / "tc01-luan-thu.md"
cuoi_doc = [tc01.read_text(encoding="utf-8").rstrip()] if tc01.exists() else []
ra = "\n\n".join([dau_trang, chung.rstrip(), *than,
                  "## Phụ lục A. Ghi chú và nguồn web theo từng phần", *phu_luc, *cuoi_doc]) + "\n"
(goc / "luan-giai-12-cung.md").write_text(ra, encoding="utf-8")
print("đã ghi", goc / "luan-giai-12-cung.md", len(ra.splitlines()), "dòng")
