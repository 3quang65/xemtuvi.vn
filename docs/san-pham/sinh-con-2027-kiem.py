"""Tự kiểm quy tắc 'Sinh con 2027 hợp bố mẹ' (docs/san-pham/sinh-con-2027-quy-tac.md).
Chạy: python3 -I docs/san-pham/sinh-con-2027-kiem.py [docs/nghien-cuu/tuvi-ref-engine.py]
Mã thoát 0 = 5 ca mẫu khớp và bảng Tết khớp engine tham chiếu."""
import sys
CAN = "Giáp Ất Bính Đinh Mậu Kỷ Canh Tân Nhâm Quý".split()
CHI = "Tý Sửu Dần Mão Thìn Tỵ Ngọ Mùi Thân Dậu Tuất Hợi".split()
# hành nạp âm theo cặp (floor(n/2)), thứ tự bảng 30 nạp âm (spec 3.1)
HANH30 = ("Kim Hỏa Mộc Thổ Kim Hỏa Thủy Thổ Kim Mộc Thủy Thổ Hỏa Mộc Thủy "
          "Kim Hỏa Mộc Thổ Kim Hỏa Thủy Thổ Kim Mộc Thủy Thổ Hỏa Mộc Thủy").split()
SINH = {"Mộc": "Hỏa", "Hỏa": "Thổ", "Thổ": "Kim", "Kim": "Thủy", "Thủy": "Mộc"}
KHAC = {"Mộc": "Thổ", "Thổ": "Thủy", "Thủy": "Hỏa", "Hỏa": "Kim", "Kim": "Mộc"}
CON_CHI, CON_HANH = 7, "Thủy"  # Đinh Mùi 2027, Thiên Hà Thủy

def canchi(y): return (y - 4) % 10, (y - 4) % 12
def nap_hanh(c, z): return HANH30[((6 * c - 5 * z) % 60) // 2]
def diem_chi(z):          # tiêu chí A
    if z in (3, 11): return 1, "tam hợp (Hợi Mão Mùi)"
    if z == 6: return 1, "lục hợp (Ngọ Mùi)"
    if z == 1: return -1, "lục xung (Sửu Mùi)"
    if z == 7: return 0, "cùng chi Mùi"
    return 0, "không thuộc ba quan hệ"
def diem_hanh(h):         # tiêu chí B
    if h == CON_HANH: return 0, "bình hòa (cùng Thủy)"
    if SINH[h] == CON_HANH: return 1, f"{h} sinh Thủy"
    if SINH[CON_HANH] == h: return 1, f"Thủy sinh {h}"
    if KHAC[h] == CON_HANH: return -1, f"{h} khắc Thủy"
    if KHAC[CON_HANH] == h: return -1, f"Thủy khắc {h}"
    raise ValueError(h)
def muc(T): return "Thuận" if T >= 2 else ("Khác nhịp" if T <= -2 else "Cân bằng")
def mot_nguoi(y):
    c, z = canchi(y); h = nap_hanh(c, z)
    a, b = diem_chi(z)[0], diem_hanh(h)[0]
    return dict(nam=y, canchi=f"{CAN[c]} {CHI[z]}", hanh=h, A=a, B=b, s=a + b)
def ket_qua(yb, ym):
    b, m = mot_nguoi(yb), mot_nguoi(ym); T = b["s"] + m["s"]
    return b, m, T, muc(T)

if __name__ == "__main__":
    loi = 0
    assert nap_hanh(3, 7) == "Thủy"  # Đinh Mùi = Thiên Hà Thủy
    # 144 cặp chi: tổng điểm A
    A = [diem_chi(z)[0] for z in range(12)]
    bang = [[A[i] + A[j] for j in range(12)] for i in range(12)]
    dem = {}
    for i in range(12):
        for j in range(12):
            dem[bang[i][j]] = dem.get(bang[i][j], 0) + 1
    print("144 cặp chi, phân bố tổng A:", dict(sorted(dem.items())), "tổng", sum(dem.values()))
    print("Bảng 60 hoa giáp → điểm B:")
    for n in range(60):
        c, z = n % 10, n % 12
        assert (6 * c - 5 * z) % 60 == n
    # 5 ca mẫu (tính tay trong tài liệu)
    # (năm âm bố, năm âm mẹ, T kỳ vọng, mức kỳ vọng); ca 5: mẹ sinh 01/02/1991 dương = năm âm 1990
    CA = [(1980, 1984, 2, "Thuận"), (2002, 1993, 3, "Thuận"), (1990, 1992, 1, "Cân bằng"),
          (1986, 1991, -2, "Khác nhịp"), (1986, 1990, -1, "Cân bằng")]
    for yb, ym, T0, M0 in CA:
        b, m, T, M = ket_qua(yb, ym)
        ok = (T, M) == (T0, M0); loi += not ok
        print(("KHỚP" if ok else "LỆCH"), yb, b, ym, m, T, M)
    # phân bố mức với năm 1965–2005
    pb = {}
    for yb in range(1965, 2006):
        for ym in range(1965, 2006):
            k = ket_qua(yb, ym)[3]; pb[k] = pb.get(k, 0) + 1
    tong = sum(pb.values())
    print("Phân bố 1965–2005 (41×41):", {k: f"{v} ({100*v/tong:.0f}%)" for k, v in pb.items()})
    # 60 hoa giáp: không ca nào lỗi, s trong [-2, 2]
    for n in range(60):
        h = nap_hanh(n % 10, n % 12); assert -2 <= diem_chi(n % 12)[0] + diem_hanh(h)[0] <= 2
    # bảng Tết (đối chiếu engine tham chiếu nếu truyền đường dẫn)
    TET = {1960:(28,1),1961:(15,2),1962:(5,2),1963:(25,1),1964:(13,2),1965:(2,2),1966:(21,1),1967:(9,2),
           1968:(29,1),1969:(16,2),1970:(6,2),1971:(27,1),1972:(15,2),1973:(3,2),1974:(23,1),1975:(11,2),
           1976:(31,1),1977:(18,2),1978:(7,2),1979:(28,1),1980:(16,2),1981:(5,2),1982:(25,1),1983:(13,2),
           1984:(2,2),1985:(21,1),1986:(9,2),1987:(29,1),1988:(17,2),1989:(6,2),1990:(27,1),1991:(15,2),
           1992:(4,2),1993:(23,1),1994:(10,2),1995:(31,1),1996:(19,2),1997:(7,2),1998:(28,1),1999:(16,2),
           2000:(5,2),2001:(24,1),2002:(12,2),2003:(1,2),2004:(22,1),2005:(9,2),2006:(29,1),2007:(17,2),
           2008:(7,2),2009:(26,1),2010:(14,2),2027:(6,2),2028:(26,1)}
    if len(sys.argv) > 1:
        import importlib.util as u
        sp = u.spec_from_file_location("e", sys.argv[1]); e = u.module_from_spec(sp); sp.loader.exec_module(e)
        for y, (d, m) in TET.items():
            e.TZ = 8 if y < 1968 else 7
            r = e.solar2lunar(d, m, y); ok = r[:3] == (1, 1, y)
            loi += not ok
            if not ok: print("LỆCH Tết", y, r)
        print("Bảng Tết", len(TET), "năm: đối chiếu engine xong")
    sys.exit(1 if loi else 0)
