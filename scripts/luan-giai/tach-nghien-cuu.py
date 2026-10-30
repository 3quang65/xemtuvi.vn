#!/usr/bin/env python3
"""Tách quy tắc từ docs/nghien-cuu/luan-giai-12-cung.md thành bản nháp máy đọc (việc L-90ad99).
Đầu ra: docs/luan-giai/quy-tac-v2/nhap/<tiền tố>.json — mỗi quy tắc: ma, nhom, goc (văn bản gốc),
nguonGoc (chuỗi nguồn gốc), nguon (tên sách đầy đủ), mot_nguon, goiY (sao, độ sáng đoán từ văn bản).
Chạy: python3 -I scripts/luan-giai/tach-nghien-cuu.py"""
import json, re, pathlib, collections
GOC = pathlib.Path(__file__).resolve().parents[2]
SRC = GOC / 'docs/nghien-cuu/luan-giai-12-cung.md'
OUT = GOC / 'docs/luan-giai/quy-tac-v2/nhap'
SACH = {
  'TT': 'Tử Vi Đẩu Số Toàn Thư (Hy Di Trần Đoàn)',
  'TB': 'Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)',
  'NL': 'Tử Vi Nghiệm Lý Toàn Thư (Thiên Lương)',
  'CN': 'Tử Vi Chỉ Nam (Song An Đỗ Văn Lưu)',
  'KL': 'Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)',
  'HS': 'Tử Vi Hàm Số (Nguyễn Phát Lộc)',
  'TC': 'Trung Châu phái (Vương Đình Chi)',
  'PT': 'Phi tinh – Tứ Hóa phái',
  'SPEC': 'Đặc tả an sao xemtuvi.vn',
}
SAO = {'TV':'Tử Vi','LT':'Liêm Trinh','TD':'Thiên Đồng','VK':'Vũ Khúc','TDU':'Thái Dương','TCO':'Thiên Cơ',
  'TP':'Thiên Phủ','TA':'Thái Âm','THL':'Tham Lang','CM':'Cự Môn','TT':'Thiên Tướng','TL':'Thiên Lương',
  'TS':'Thất Sát','PQ':'Phá Quân'}
DONG = re.compile(r'^- \*\*\[([A-Z]+(?:-[A-Z0-9]+)+)\]\*\*\s*(.*)$')
def tach_nguon(s):
    m = re.search(r'—\s*\*Nguồn:\s*(.*?)\*\s*(⚑\S+)?\s*$', s)
    if not m: return s.strip(), '', None
    return s[:m.start()].strip(), m.group(1).strip(), m.group(2)
def ten_sach(ng):
    ma = []
    for tok in re.findall(r'(?:^|[;,(]\s*)([A-Z]{2,4})(?=\s|\(|;|,|$)', ng):
        if tok in SACH and SACH[tok] not in ma: ma.append(SACH[tok])
    return ma
def do_sang(t):
    t0 = t[:160].lower()
    if re.search(r'\bhãm\b|\(h\)', t0) and not re.search(r'miếu|vượng|đắc', t0[:40]): return ['Hãm']
    if re.search(r'\bbình\b|\(b\)', t0[:40]): return ['Bình']
    if re.search(r'miếu|vượng|đắc|\(m\)|\(v\)|\(đ\)', t0[:60]): return ['Miếu','Vượng','Đắc']
    return None
ds = collections.defaultdict(list)
for dong in SRC.read_text(encoding='utf8').splitlines():
    m = DONG.match(dong)
    if not m: continue
    ma, phan = m.group(1), m.group(2)
    tien, nhom = ma.split('-')[0], ma.split('-')[1]
    goc, ng, co = tach_nguon(phan)
    r = {'ma': ma, 'nhom': nhom, 'goc': goc, 'nguonGoc': ng, 'nguon': ten_sach(ng), 'motNguon': bool(co and '1' in co), 'chuaNguon': bool(co and 'chưa' in co)}
    if nhom in SAO: r['goiY'] = {'sao': [SAO[nhom]], 'doSang': do_sang(goc)}
    ds[tien].append(r)
OUT.mkdir(parents=True, exist_ok=True)
for k, v in ds.items():
    (OUT / f'{k}.json').write_text(json.dumps(v, ensure_ascii=False, indent=1), encoding='utf8')
print({k: len(v) for k, v in sorted(ds.items())})
print('không có tên sách:', sum(1 for v in ds.values() for r in v if not r['nguon']))
