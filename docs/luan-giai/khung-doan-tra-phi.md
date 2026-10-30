# Khung chuẩn đoạn luận trả phí (4 phần)

Người lập: Hạnh (luận giải). Ngày 30/10/2026. Trạng thái: bản 1.1, thêm mục 6.0 và sửa 6.1 theo phiếu Thư `kiem-duyet-khung-4-phan.md` (L-fd4220).
Mục tiêu: mọi đoạn luận khách trả tiền đều **cụ thể với lá số người đọc** và **áp dụng được** (nguyên tắc "giá trị khách hàng là số 1"). Khung này dùng cho người viết tay, cho prompt AI và cho bộ ghép tự động (Kỹ thuật ghép từ dữ liệu lá số).

Áp dụng: đoạn luận trong bài cung, chuyên đề (`menh`, `quan-loc`, `phu-the`…), vận 10 năm, vận năm (tổng quan và bốn mảng). Bảng 12 tháng dùng bản rút gọn (mục 7.2).
Chuẩn đối chiếu:
- Cách luận: skill `tuvi-luan-giai`; quy tắc `docs/nghien-cuu/luan-giai-12-cung.md` (CHUNG-, MENH-, PHU-, TAI-…), `docs/nghien-cuu/luan-giai/dai-van.md` (VAN-), `docs/luan-giai/van-nam/QUY-TAC.md` (NAM-).
- Chấm: `docs/nghien-cuu/bang-cham-chat-luong.md` (mục 0 cổng an toàn; 1.3 Cụ thể; 1.4 Áp dụng được).
- Dữ liệu: engine `src/lib/tuvi/index.ts` (`LaSo`, `Cung`, `Sao`, `LuuNien`), bộ khớp `src/lib/luan-giai/ai/khop-v2.ts` (`QuyTacV2`), `src/lib/luan-giai/ai/index.ts` (`NhanDinh`, `ThongTinVan`, `GHI_CHU`), `src/lib/luan-giai/ai/van-nam.ts` (`QuyTacNam`, `BaiVanNam`); bản in đọc được: `docs/luan-giai/van-nam/du-lieu.md`.

Khung này **không thêm quy tắc luận mới**. Phần (b) chỉ lấy từ quy tắc đã có nguồn; phần (d) là gợi ý hành động của xemtuvi.vn, mỗi mẫu bám vào lời khuyên hoặc tính chất đã ghi trong một quy tắc có nguồn (cột "Bám quy tắc" ở mục 6) và được đánh dấu là tổng hợp.

---

## 1. Một đoạn trông thế nào

### 1.1. Khách thấy

```
### <Tiêu đề: tên cung/mảng — sao chính (độ sáng) tại <chi>>
Căn cứ trên lá số của bạn: <1 dòng: sao, độ sáng, cung, Tứ hóa/Tuần Triệt/sao lưu dẫn tới nhận định>.
<Nhận định: 2–4 câu, xu hướng + mặt cần chú ý + lối ra>.
Nguồn: <tên sách ngắn> · <trường phái>. [Ghi chú trường phái: … — chỉ khi có]
Việc nên làm (1–3 tháng): <1 hành động>. Cách đo: <thước đo>.
<!-- quy tắc: <mã nhận định>; việc: <mã mẫu> bám <mã quy tắc hướng>; tongHop -->
```

Đầu bài (không thuộc đoạn) luôn có câu ghi nội dung do hệ thống tạo: dùng `GHI_CHU` (bài cung, chuyên đề, vận 10 năm) hoặc câu NAM-CAM-04 (vận năm). Thiếu câu này là trượt cổng an toàn.

### 1.2. Máy đọc (đề xuất cho bộ ghép, một đoạn = một bản ghi)

```json
{
  "id": "doan-phu-the-PHU-CC-07",
  "chuDe": "tinh-cam",
  "canCu": { "yeuToKhop": [ { "sao": "Thiên Phủ", "doSang": "Miếu", "hoa": null, "lopHoa": null, "cung": "Phu Thê", "chi": "Thân", "viTri": "chinh", "tuan": true, "triet": false } ],
             "yeuToKhong": [] },
  "nhanDinh": { "maQuyTac": ["PHU-CC-07", "PHU-TV-01"], "noiDung": "…", "tongHop": false },
  "nguon": { "nguon": ["…"], "truongPhai": "Tam hợp phái Việt", "tranh": [] },
  "viecNenLam": { "maMau": "TC-04", "maHuong": "PHU-CC-07", "cau": "…", "thuocDo": "…", "thoiHanThang": 3 }
}
```

Một đoạn = **một nhận định chính** (một điểm trên lá số), có thể dùng 1–3 quy tắc cùng nói về điểm đó (kể cả quy tắc vế loại trừ). Hai điểm khác nhau thì hai đoạn.

---

## 2. Biến dữ liệu lá số dùng chung

"CÓ" = đã có trong engine/bộ khớp, dùng đúng tên. "MỚI" = Kỹ thuật cần bổ sung (mô tả lấy từ đâu). Không tự an sao để điền biến: mọi giá trị lấy từ engine.

| Biến | Kiểu | Lấy từ | Trạng thái |
|---|---|---|---|
| `ls.gioiTinh` | `'Nam' \| 'Nữ'` | `LaSo` | CÓ |
| `ls.canChi.nam` | chuỗi, vd "Mậu Dần" | `LaSo` | CÓ |
| `ls.menhTai`, `ls.thanTai` | tên cung | `LaSo` | CÓ |
| `cung.ten` | tên cung chức năng (Mệnh, Phu Thê…) | `Cung` | CÓ |
| `cung.tenChi`, `cung.can` | địa chi, can của cung | `Cung` | CÓ |
| `cung.tuan`, `cung.triet`, `cung.laThan` | boolean | `Cung` | CÓ |
| `cung.chinhTinh[]`, `catTinh[]`, `hungTinh[]`, `phuTinh[]` | danh sách `Sao` | `Cung` | CÓ |
| `sao.ten`, `sao.dacTinhTen`, `sao.hoa` | tên; Miếu/Vượng/Đắc/Bình/Hãm; Hóa gốc | `Sao` | CÓ |
| `luuNien.namXem`, `.canChi`, `.tuoiMu` | năm âm lịch xem | `LuuNien` | CÓ |
| `luuNien.luuTuHoa[]` (`hoa`, `sao`, `chi`) | Tứ hóa của năm | `LuuNien` | CÓ |
| `luuNien.saoLuu[]` (`ten`, `chi`) | sao lưu, tên dạng "L. Lộc Tồn" | `LuuNien` | CÓ |
| `luuNien.luuThaiTue`, `.tieuHan`, `.daiVan`, `.luuNguyet[]` | chỉ số chi | `LuuNien` | CÓ |
| `van.cung`, `van.tuoiTu`, `van.tuoiDen`, `van.namTu`, `van.namDen` | đại vận đang đi | `ThongTinVan` | CÓ |
| `quyTac.id`, `.maNghienCuu[]`, `.noiDung`, `.nguon[]`, `.nguonChiTiet`, `.truongPhai`, `.loai`, `.muc`, `.cachCuc`, `.phaCach` | quy tắc đã khớp | `QuyTacV2` | CÓ |
| `quyTacNam.lop`, `.phan`, `tongHop` | lớp năm, vị trí trong khung | `QuyTacNam`, `doan-mau.json` | CÓ (chỉ vận năm) |
| `nhanDinh.thamChieu.sao[]`, `.cung`, `.cungLienQuan[]`, `.yeuTo[]` | sao/cung đã khớp | `NhanDinh` | CÓ |
| `bai.ghiChuTruongPhai` | ghi chú trường phái cả bài | `BaiVanNam` | CÓ (chỉ vận năm) |
| `yeuToKhop[]` | mỗi yếu tố làm điều kiện quy tắc đúng: `{sao, doSang, hoa, lopHoa, cung, chi, viTri, tuan, triet}` | bộ khớp ghi lại lúc `khopQuyTac` duyệt `dieuKien` (hiện chỉ trả tên sao và cung, thiếu độ sáng, hóa, vị trí) | **MỚI** |
| `yeuToKhong[]` | yếu tố của vế loại trừ đang có mặt (vd Địa Kiếp cùng cung Hóa Lộc khiến chọn bản thận trọng) | bộ khớp: khi bản `-TOT` bị `khong` chặn và bản thận trọng khớp, ghi sao/cung của điều kiện `khong` đã đúng | **MỚI** |
| `lopHoa` | `goc` (từ `sao.hoa`) · `nam` (từ `luuNien.luuTuHoa`) · `van` (để sau, engine chưa có Tứ hóa đại vận) | suy ra khi lập `yeuToKhop` | **MỚI** |
| `chuDe` | `cong-viec` · `tai-chinh` · `tinh-cam` · `suc-khoe` · `hoc-tap` · `gia-dao` | bảng ánh xạ mục 2.1 | **MỚI** |
| `nguoiLienQuan` | cách gọi người/lĩnh vực của cung trong câu (vd Phụ Mẫu → "cha mẹ, cấp trên") | bảng tra mục 2.2 theo `cung.ten` | **MỚI** |
| `tongHop` (cho quy tắc bản 2) | `true` nếu nhận định là tổng hợp, không có câu sách trực tiếp | thêm trường vào `QuyTacV2`; hiện chỉ có ở `doan-mau.json` vận năm | **MỚI** |
| `tranh[]` | mã TRANH liên quan + câu ghi chú trường phái ngắn | trường mới trong quy tắc, Hạnh/Đức điền theo mục TRANH của bộ nghiên cứu | **MỚI** |
| `mucCach` | 1 thành cách · 2 thành cách có khuyết · 3 phá cách (CHUNG-CC-08) | bộ ghép tính từ điểm phá; hiện chỉ có `phaCach` boolean, lỗi ở phiếu chấm 3 | **MỚI** |
| `viecNenLam` | `{maMau, maHuong, cau, thuocDo, thoiHanThang}` | chọn từ bảng mẫu mục 6 (đề xuất lưu `src/lib/luan-giai/ai/viec-nen-lam.json`) | **MỚI** |

### 2.1. Ánh xạ chủ đề (`chuDe`)

| Nguồn đoạn | `chuDe` |
|---|---|
| Quan Lộc; mảng `su-nghiep` (gồm Phụ Mẫu khi tiểu hạn/Thái Tuế ở đó, NAM-MANG-02); Nô Bộc khi nói đồng nghiệp | `cong-viec` |
| Tài Bạch; mảng `tai-chinh`; Phúc Đức khi xung chiếu Tài Bạch (PHUC-YN-04) | `tai-chinh` |
| Phu Thê; mảng `tinh-cam` | `tinh-cam` |
| Tật Ách; mảng `suc-khoe`; Phúc Đức khi nói lao tâm, nghỉ ngơi (PHUC-YN-01) | `suc-khoe` |
| Đoạn có Văn Xương, Văn Khúc, Hóa Khoa làm yếu tố chính; NAM-TH-04 | `hoc-tap` |
| Phụ Mẫu, Huynh Đệ, Điền Trạch, Tử Tức | `gia-dao` |
| Mệnh, Thiên Di, cách cục | theo `muc` của đoạn; mặc định `cong-viec` nếu đoạn nói về hướng đi, `tinh-cam` nếu nói về cách đối xử với người thân |

### 2.2. Bảng `nguoiLienQuan` (chỉ để viết câu, theo phần Ý nghĩa cung)

| `cung.ten` | Gọi trong câu | Căn cứ |
|---|---|---|
| Phụ Mẫu | cha mẹ, cấp trên, người đỡ đầu | PHUMAU-YN-01 |
| Huynh Đệ | anh chị em, người ngang hàng thân thiết | ý nghĩa cung Huynh Đệ |
| Phu Thê | người đồng hành, người yêu, vợ/chồng | ý nghĩa cung Phu Thê |
| Tử Tức | con cái; lớp nghĩa phụ: học trò, sản phẩm sáng tạo (ghi rõ là lối hiện đại) | TU-TRANH-03 |
| Nô Bộc | bạn bè, đồng nghiệp, cấp dưới | NO-HOA-01, NO-HOA-03 |
| Điền Trạch | nhà ở, tài sản tích lũy, không khí gia đình | DIEN-YN-01 |
| Phúc Đức | đời sống tinh thần, sự an nhàn hay lao tâm | PHUC-YN-01 |

---

## 3. Phần (a) "Căn cứ trên lá số của bạn"

**Mục đích:** khách thấy ngay nhận định đến từ chính lá số của mình (tiêu chí 1.3 Cụ thể, mức 5: "đổi lá số khác thì câu không còn đúng").

**Quy tắc viết**
1. Một dòng, **≤ 35 chữ**, lời thường. Mở bằng nhãn cố định "Căn cứ trên lá số của bạn:".
2. Nêu đủ yếu tố **đã làm quy tắc khớp**, theo thứ tự ưu tiên CHUNG-PP-10: chính tinh + độ sáng → cách cục → Tứ hóa (ghi lớp: gốc hay của năm) → sát/cát tinh → Tuần Triệt → sao lưu.
3. Luôn có: tên sao, độ sáng viết chữ ("miếu", "hãm"), tên cung chức năng, địa chi. Có Tứ hóa thì ghi sao nào mang hóa nào.
4. Có `yeuToKhong` (vế loại trừ) thì **bắt buộc nêu** trong dòng này. Đây là lỗi lặp nhiều nhất (phiếu chấm 2: Hóa Lộc gặp Địa Kiếp).
5. Thuật ngữ lần đầu xuất hiện thì giải thích trong ngoặc ≤ 6 chữ: "xung chiếu (cung đối diện)", "Tuần (làm chậm, giảm lực)".
6. Không đưa vào yếu tố không dùng ở phần (b). Không liệt kê cả cung.

**Biến cần:** `yeuToKhop[]` (MỚI), `yeuToKhong[]` (MỚI), `lopHoa` (MỚI), `cung.ten`, `cung.tenChi`, `sao.ten`, `sao.dacTinhTen`, `sao.hoa`, `cung.tuan`, `cung.triet`, `luuNien.luuTuHoa[]`, `luuNien.saoLuu[]`, `nhanDinh.thamChieu.cungLienQuan[]`, `quyTac.cachCuc` + `mucCach` (MỚI, khi đoạn là cách cục).

**Câu mẫu cho bộ ghép:**
`Căn cứ trên lá số của bạn: {sao} ({doSang}) ở cung {cung.ten} ({chi}){, mang {hoa} {gốc|của năm}}{, cùng cung có {yeuToKhong}}{, có {Tuần|Triệt}}.`
Yếu tố ở cung khác: `…; {sao} ({doSang}) ở {cung.ten} chiếu sang ({viTri lời thường}).` Bảng lời thường của `viTri`: `xung` → "từ cung đối diện", `tam-hop` → "từ cung tam hợp", `giap` → "ở hai cung kề bên".

**Đúng**
> Căn cứ trên lá số của bạn: Phá Quân (miếu) ở Tài Bạch (Ngọ), cùng cung có Kình Dương (hãm) và Địa Không (hãm). *(VN01; TAI-PQ-01, TAI-SP-05, CHUNG-SP-02)*

**Sai**
> Căn cứ trên lá số của bạn: cung Tài Bạch có nhiều sao tốt xấu đan xen. *(không tên sao, không độ sáng; đúng với mọi lá số)*
> Căn cứ trên lá số của bạn: Phá Quân miếu ở Tài Bạch. *(bỏ Kình, Không cùng cung, trong khi phần (b) nói "thu chi lên xuống")*

---

## 4. Phần (b) Nhận định

**Mục đích:** nói yếu tố ở (a) nghĩa gì **đúng chuyên đề đang luận**, hai mặt, có lối ra.

**Quy tắc viết**
1. **2–4 câu, 40–110 chữ.** Câu đầu là xu hướng chính; câu sau là mặt cần chú ý (nếu quy tắc có) và lối ra.
2. Mọi ý lấy từ `quyTac.noiDung` của quy tắc đã khớp. Viết lại cho tự nhiên được, **không thêm ý mới**. Ý tổng hợp từ nhiều quy tắc → `tongHop: true`.
3. Đủ điều kiện mới dùng: vế loại trừ đúng thì dùng bản thận trọng (Bảng chấm 1.1). Cách cục gọi tên chỉ khi `mucCach` 1 hoặc 2; mức 3 viết "có dáng dấp của…" (CHUNG-CC-08).
4. Nói đúng chuyên đề, dùng `nguoiLienQuan`: tình cảm nói về người đồng hành, gia đạo nói về cha mẹ/anh chị em/nhà ở; không dùng câu công việc cho bài tình cảm (phiếu chấm 3).
5. Từ xu hướng: "thường", "dễ", "có xu hướng". Không "chắc chắn", "nhất định", không hứa kết quả ("năm tài lộc dồi dào" → "thường cho thấy năm có nguồn lợi").
6. Hãm, sát tinh, Hóa Kỵ: viết trung tính, kèm lối ra (CHUNG-SP-02, CHUNG-HOA-03). Không từ trong `tu-cam.json`; không đoán bệnh, tai nạn, ly hôn, phá sản; không nói số con, tuổi cưới cụ thể (HUYNH-YN-03, PHU-YN-05).
7. Không câu khuôn dùng chung: cấm đuôi "góp thêm sắc thái…", "ảnh hưởng đến tính cách và hướng đi của bạn", "nên chủ động nắm bắt" đứng một mình. Kiểm: bỏ tên sao đi mà câu vẫn đọc được thì viết lại.
8. Vận 10 năm, vận năm: đổi thời lượng theo NAM-PP-06 ("giai đoạn này", "năm nay"); không lấy câu vận làm nhận định cả đời. Tách lớp Tứ hóa gốc và của năm (CHUNG-HOA-04).

**Biến cần:** `quyTac.noiDung`, `quyTac.maNghienCuu[]`, `quyTac.loai`, `quyTac.muc`, `chuDe` (MỚI), `nguoiLienQuan` (MỚI), `tongHop` (MỚI cho bản 2; CÓ ở vận năm), `mucCach` (MỚI), `yeuToKhong[]` (MỚI, để chọn bản thận trọng), `van.*` hoặc `luuNien.namXem` (đoạn vận).

**Đúng** (chuyên đề Tài chính, cùng căn cứ ở mục 3)
> Phá Quân miếu cho thấy bạn kiếm tiền mạnh tay, dám chi để thu về nhiều hơn, và thường có tích lũy. Kình Dương, Địa Không hãm cùng cung khiến dòng tiền có lúc lên xuống, phải xoay xở vất vả hơn người khác. Điểm mạnh của bạn phát huy tốt nhất khi mỗi khoản chi lớn đều có kế hoạch trước. *(TAI-PQ-01, TAI-SP-05, CHUNG-SP-02; câu cuối tổng hợp)*

**Sai**
> Phá Quân là sao mạnh, bạn sẽ giàu có nếu biết nắm bắt cơ hội. *(hứa kết quả; bỏ Kình, Không)*
> Cung Tài Bạch có sát tinh nên năm nay dễ phá sản, cần cẩn trọng. *(từ cấm, gây sợ; trượt cổng)*

---

## 5. Phần (c) Nguồn / trường phái

**Mục đích:** khách thấy nhận định có gốc sách; người duyệt truy được mã. Đây là điểm khác biệt "độ tin cậy học thuật".

**Quy tắc viết**
1. Khách thấy **một dòng ≤ 25 chữ**: "Nguồn: <tên sách ngắn> · <trường phái>". Tên ngắn: Toàn Thư · Tân Biên · Nghiệm Lý · Chỉ Nam · Khảo Luận · Hàm Số · Trung Châu · Đặc tả an sao xemtuvi.vn. Nhiều nguồn thì tối đa 3, nối bằng dấu phẩy. Tên đầy đủ, tác giả: ở trang "Nguồn tham khảo" của site.
2. Nguồn web: "Tư liệu tham khảo trực tuyến" (khách), tên trang để trong mã ẩn.
3. Trường phái mặc định "Tam hợp phái Việt" (CHUNG-PHAI-03). Dùng Trung Châu thì ghi "theo Trung Châu" ngay trong (b) hoặc ở dòng này, và chỉ khi tổ hợp tồn tại ở phái đó (phiếu chấm 1.1, ví dụ không đạt).
4. Có `tranh[]` thì thêm "Ghi chú trường phái:" 1 câu ≤ 30 chữ, nêu hai cách hiểu, không phán bên nào đúng. Không gán quy ước sản phẩm cho một trường phái (phiếu chấm 1, lỗi b).
5. `tongHop: true` thì thêm "· nhận xét tổng hợp của xemtuvi.vn".
6. Mã quy tắc, `nguonChiTiet` (thiên, chương) chỉ nằm trong `<!-- quy tắc: … -->`, không hiện cho khách.

**Biến cần:** `quyTac.nguon[]`, `quyTac.nguonChiTiet`, `quyTac.truongPhai`, `quyTac.maNghienCuu[]`, `tranh[]` (MỚI), `tongHop` (MỚI cho bản 2), `bai.ghiChuTruongPhai` (CÓ, vận năm), bảng tên ngắn (MỚI, tĩnh: 9 dòng như liệt kê ở điểm 1, khớp danh sách tên sách trong `docs/luan-giai/quy-tac-v2/DINH-DANG.md`).

**Đúng**
> Nguồn: Tân Biên, Toàn Thư · Tam hợp phái Việt.
> Ghi chú trường phái: Toàn Thư và Khảo Luận coi cung đối diện nặng hơn cung tam hợp; Nghiệm Lý coi tam hợp là chính. Bài này theo Toàn Thư. *(CHUNG-TRANH-09)*

**Sai**
> Nguồn: sách Tử Vi cổ. *(không truy được)*
> Theo phái Việt, xemtuvi.vn đọc cả hai cung năm… *(gán quy ước sản phẩm cho phái Việt)*

---

## 6. Phần (d) "Việc nên làm"

**Mục đích:** khách biết bắt đầu từ đâu (tiêu chí 1.4, mức 5: "hành động cụ thể, làm được trong đời thường, gắn với đúng điểm vừa luận, không vượt giới hạn chuyên môn").

**Quy tắc viết**
1. **Đúng 1 việc**, ≤ 45 chữ, mở bằng động từ (ghi, đặt, hẹn, chọn, gửi…). Kèm **"Cách đo:"** một thước đo tự kiểm được (đếm số lần, số tuần, có/không) trong **1–3 tháng**.
2. Gắn đúng điểm ở (b): việc phải trả lời "làm gì với chính điều vừa nói". Chọn mẫu theo `chuDe` **và** `maHuong` khớp `quyTac.maNghienCuu` của đoạn (bảng mục 6.1). Không mẫu nào khớp `maHuong` → dùng mẫu "phát huy" hoặc "chuẩn bị" chung của chủ đề kèm `tongHop`, và đánh dấu đoạn để người viết rà.
3. Giới hạn: không lời khuyên tài chính cụ thể (vay, đầu tư, mua bán tài sản, chọn sản phẩm), không lời khuyên y tế (bộ phận, xét nghiệm, thuốc, ăn kiêng), không pháp lý; không chọn ngày giờ, hướng nhà, màu sắc, vật phẩm; không "cưới/chia tay/nghỉ việc vào lúc…". Người đọc tự đặt mức (số tiền, số giờ): câu mẫu để `{mức bạn tự chọn}`.
4. Không ép mua: "Việc nên làm" không bao giờ là "mua gói…", "xem thêm luận giải…".
5. Vận năm: ưu tiên việc làm trong "tháng mốc" (NAM-THANG-04) nếu có, ghi tháng âm lịch.
6. Luôn có mã ẩn: `việc: <maMau> bám <maHuong>/<vế>; dạng i|ii|iii; tongHop` (quy định mục 6.0).

**Biến cần:** `viecNenLam` (MỚI: `maMau`, `maHuong`, `cau`, `thuocDo`, `thoiHanThang`), `chuDe` (MỚI), `nguoiLienQuan` (MỚI), `quyTac.maNghienCuu[]` (khớp `maHuong`), `cung.ten`, `luuNien.luuNguyet[]` + `thangMoc` (CÓ ở `ThangNam`, chỉ vận năm), `ls.gioiTinh` (chỉ để chọn cách xưng hô, không đổi nội dung việc).

**Đúng**
> Việc nên làm (3 tháng): trước mỗi khoản chi lớn hơn {mức bạn tự chọn} mà không có trong kế hoạch, chờ 48 giờ rồi mới quyết. Cách đo: ghi lại các khoản này; mục tiêu ≥ 4/5 khoản có chờ đủ 48 giờ. *(TC-02 bám TAI-SP-07)*

**Sai**
> Nên cẩn trọng trong chi tiêu và chủ động nắm bắt cơ hội. *(chung, không đo được)*
> Năm nay nên vay thêm để mở rộng kinh doanh. *(lời khuyên tài chính dựa vào sao; trượt cổng)*
> Nên đeo vòng đá hợp mệnh để giữ tiền. *(vật phẩm; trượt cổng)*

### 6.0. Quy định "việc nên làm" bám quy tắc có nguồn

Chép từ phiếu Thư `docs/luan-giai/kiem-duyet-khung-4-phan.md` mục 1 (30/10/2026). Phần (d) phải suy ra từ ý nghĩa hoặc lời khuyên của chính mã quy tắc mà phần (b) đã dùng, không suy từ tên sao hay hình tượng sao.

**Hợp lệ khi đủ cả 5 điều:**
1. **Mã bám (`maHuong`) nằm trong `maNghienCuu` của đoạn và phần (b) có câu dùng ý của mã đó.** Mã chỉ có trong mã ẩn mà (b) không nói thì không được làm mã bám.
2. **Mã bám là mã nội dung**: mã mô tả tính chất, ý nghĩa, rủi ro hoặc lời khuyên (CHUNG-HOA, CHUNG-CT, VAN-CT, VAN-SP, NAM-HOA, NAM-LUU, NAM-TT-02…06, NAM-TH-03/04, NAM-MANG-02…05, MENH-, PHU-, TAI-, QUAN-, TAT-<sao>-…). **Không** dùng mã phương pháp (NAM-PP, NAM-MANG-01, NAM-TH-01/02, NAM-TT-01, CHUNG-PP, TAT-YN-01…04), mã điều cấm (CAM), mã tranh luận (TRANH).
3. **Việc là một trong ba dạng, ưu tiên theo thứ tự**: (i) cách làm cụ thể của **lời khuyên có sẵn trong câu quy tắc** ("nên chốt kế hoạch", "nên rà soát kỹ văn bản", "thỏa thuận thành văn bản", "dành thời gian", "khám định kỳ"); (ii) phát huy **điểm mạnh** mã mô tả (mẫu "phát huy", mã in nghiêng ở 6.1); (iii) giảm **đúng rủi ro** mã mô tả (vd "dễ nóng lời" → quy ước khi bất đồng). Dạng (ii), (iii) ghi `tongHop`.
4. **Điều kiện của mã đủ trên lá số, kể cả vế loại trừ.** Mã có nhiều vế chỉ dùng vế đã kích hoạt và ghi rõ vế trong mã ẩn: `CHUNG-HOA-TCO-01/Kỵ`, `NAM-TH-03/Kỵ`, `VAN-SP-06/thận trọng`. Sao "tô thêm" (NAM-TT-06, CHUNG-SP-08…) chỉ làm mã bám khi sao ở **ngay** cung chủ đề của đoạn.
5. **Giữ giới hạn an toàn** (quy tắc 3 ở trên): tài chính chỉ là hành vi ghi chép, chờ, đọc lại, chốt bằng chữ, hỏi người có chuyên môn; không bảo vay, trả, gia hạn, tái cơ cấu, mua, bán, đầu tư, chọn sản phẩm, chọn thời điểm. Sức khỏe chỉ là nếp sống (ngủ, nghỉ, vận động, ghi năng lượng) và khám sức khỏe **tổng quát** định kỳ có điều kiện ("nếu đã hơn 12 tháng"); không chuyên khoa, xét nghiệm, thuốc, ăn kiêng, bộ phận cơ thể.

**Không hợp lệ (ví dụ):** suy từ tên/hình tượng sao (Thiên Mã → "đi du lịch"; Lộc Tồn → "mở sổ tiết kiệm"; Thiên Y → "uống thuốc bổ"; Hồng Loan → "đi xem mắt tháng này"); suy từ mã phương pháp (SK-04 bám TAT-YN-03); lấy sao lưu làm căn cứ chọn thời điểm cho một hành động tài chính, pháp lý (NAM-LUU-04).

**Biến thể câu mẫu**: được thay đối tượng theo cung/`nguoiLienQuan` và thêm một thước đo suy từ chính quy tắc (vd thêm "số lần đổi mục tiêu = 0" vì CHUNG-HOA-TCO-01/Kỵ nói "hay đổi ý"). Không đổi động từ chính, không thêm hành động mới; đổi hành động là mẫu mới, phải đề xuất (qua Minh, Thư duyệt).

**Ghi trong mã ẩn**: `việc: <maMau> bám <mã>/<vế>; dạng i|ii|iii; tongHop`.

### 6.1. Danh mục mẫu "việc nên làm"

Cột "Bám quy tắc" (`maHuong`): đoạn có một trong các mã này trong `maNghienCuu` thì được dùng mẫu. Mã có lời khuyên trực tiếp trong câu quy tắc ghi thường; mã chỉ mô tả điểm mạnh (dùng cho mẫu "phát huy") ghi *nghiêng*. Mọi mẫu là gợi ý tổng hợp (`tongHop: true`). Thời hạn tính từ ngày khách đọc.

**Công việc (`cong-viec`)**

| Mã | Bám quy tắc | Việc nên làm (câu mẫu) | Cách đo | Hạn |
|---|---|---|---|---|
| CV-01 | NAM-HOA-07, MENH-CM-02, CHUNG-HOA-CM-01 | Sau mỗi buổi trao đổi quan trọng với {nguoiLienQuan}, gửi lại 3 dòng chốt kết luận trong ngày. | ≥ 80% buổi quan trọng có tin chốt, đếm theo tuần | 2 tháng |
| CV-02 | MENH-THL-02, MENH-TL-02, MENH-TCO-02, CHUNG-HOA-TCO-01/Kỵ, NAM-TH-03/Kỵ (Hóa Kỵ gốc tại cung tiểu hạn) | Chọn một mục tiêu nghề nghiệp cho 12 tuần, viết ra một câu; mỗi tuần làm một việc nhỏ cho mục tiêu đó. | ≥ 9/12 tuần có việc hoàn thành | 3 tháng |
| CV-03 | MENH-TT-02 | Trước khi nhận vai trò hay dự án mới, viết một trang: việc phải làm, nguồn lực đang có, người có thể hỏi. | 100% việc mới nhận trong 3 tháng có trang này | 3 tháng |
| CV-04 | MENH-TDU-02, MENH-TD-02 | Giữ hai khung giờ cố định mỗi tuần cho việc quan trọng nhất, không xếp việc khác vào. | ≥ 10/12 tuần giữ đủ hai khung | 3 tháng |
| CV-05 | MENH-HOA-04, TAI-HOA-04 | Với mỗi việc lớn, viết trước 3 tiêu chí "đủ tốt"; đạt đủ ba thì chốt, không sửa thêm. | ≥ 3 việc chốt đúng hạn theo tiêu chí viết trước | 2 tháng |
| CV-06 | MENH-TS-02, MENH-LT-02, CHUNG-SP-11 | Khi gặp tin nhắn hay ý kiến khiến bạn bực, chờ ít nhất 2 giờ rồi mới trả lời. | Ghi các lần gặp; ≥ 4/5 lần có chờ | 1 tháng |
| CV-07 | *QUAN-SP-03, CHUNG-SP-01* | Mỗi tháng hẹn một người đi trước trong nghề, hỏi một câu cụ thể về việc bạn đang làm. | 3 cuộc hẹn trong 3 tháng | 3 tháng |
| CV-08 | VAN-SP-06/thận trọng (chỉ khi Xương/Khúc hóa Kỵ hoặc gặp Kình, Đà, Kỵ tại Quan Lộc hoặc tại cung trọng điểm năm mang chủ đề công việc) | Nhờ một đồng nghiệp hoặc người được phép xem nội dung đọc soát văn bản gửi ra ngoài mang tên bạn (hợp đồng, báo cáo, đề xuất) trước khi gửi. | 100% văn bản loại này trong 3 tháng có người đọc soát | 3 tháng |

**Tài chính (`tai-chinh`)**

| Mã | Bám quy tắc | Việc nên làm (câu mẫu) | Cách đo | Hạn |
|---|---|---|---|---|
| TC-01 | MENH-VK-02, TAI-THL-02, TAI-HOA-04, MENH-TP-02 | Ghi mọi khoản chi từ {mức bạn tự chọn} trở lên; cuối tuần cộng theo ba nhóm: cần, muốn, phát sinh. | ≥ 7/8 tuần ghi đủ | 2 tháng |
| TC-02 | TAI-SP-07, MENH-SP-08, MENH-PQ-02 | Trước mỗi khoản chi lớn hơn {mức bạn tự chọn} không có trong kế hoạch, chờ 48 giờ rồi mới quyết. | ≥ 4/5 khoản có chờ đủ 48 giờ | 3 tháng |
| TC-03 | MENH-SP-08, MENH-PQ-02, PHU-CC-07 | Mỗi lần nhận thu nhập, chuyển ngay {phần bạn tự chọn} vào một tài khoản riêng chỉ dùng cho việc bất ngờ. | 3/3 tháng chuyển đúng ngày | 3 tháng |
| TC-04 | TAI-LT-02, HUYNH-HOA-02, HUYNH-TL-03, PHU-CC-07 | Mỗi khoản tiền chung, cho mượn hay góp vốn với người quen đều có một tin nhắn ghi số tiền, mục đích, hạn. | 100% khoản mới trong 3 tháng có tin nhắn | 3 tháng |
| TC-05 | NAM-LUU-01, DIEN-HOA-04 | Trước khi ký hay chuyển tiền cho giao dịch lớn, đọc lại toàn bộ giấy tờ và hỏi một người có chuyên môn. | 100% giao dịch lớn trong 3 tháng có bước này; không phát sinh giao dịch lớn thì ghi "không có" | 3 tháng |
| TC-06 | *TAI-PQ-01, TAI-HOA-02, TAI-SP-03* | Liệt kê các nguồn thu hiện có; chọn một nguồn bạn làm tốt nhất và dành thêm một buổi mỗi tuần cho nó. | ≥ 8/12 tuần có buổi này | 3 tháng |
| TC-07 | VAN-SP-06/thận trọng, NAM-LUU-04-SAT (chỉ khi Xương/Khúc gốc hoặc của năm ở Tài Bạch, hãm hoặc gặp Kình, Đà, Hóa Kỵ) | Gom giấy tờ tài chính đang có vào một chỗ, đọc lại từng tờ, đánh dấu điều chưa rõ để hỏi người có chuyên môn. Cấm thêm động từ quyết định (tất toán, gia hạn, đổi, vay, mua, bán). | Xong danh mục (có/không); 100% điều đánh dấu được hỏi | 1 tháng |

**Tình cảm (`tinh-cam`)**

| Mã | Bám quy tắc | Việc nên làm (câu mẫu) | Cách đo | Hạn |
|---|---|---|---|---|
| TT-01 | PHU-SP-06, PHU-HOA-04, PHU-LT-02 | Cùng {nguoiLienQuan} thống nhất một quy ước: khi bất đồng, tạm dừng và hẹn lúc bình tĩnh trong ngày để nói tiếp. | Ghi các lần bất đồng; ≥ 3/4 lần dùng quy ước | 2 tháng |
| TT-02 | PHU-SP-08, PHU-TL-02, NAM-TT-06 (chỉ khi L. Thiên Khốc, L. Thiên Hư, L. Tang Môn hoặc L. Bạch Hổ ở ngay Phu Thê và (b) đã nêu; câu không nhắc tang, tai nạn) | Đặt một buổi cố định mỗi tuần cho hai người, không điện thoại, không bàn việc. | ≥ 10/12 tuần giữ được | 3 tháng |
| TT-03 | PHU-THL-02, PHU-SP-11, PHU-HOA-04 | Dành một buổi nói rõ ba điều mỗi người cần trong mối quan hệ; viết lại và xem lại sau một tháng. | Có buổi nói chuyện + một lần xem lại | 2 tháng |
| TT-04 | PHU-PQ-02, PHU-LT-02, PHU-YN-05 | Đang tìm hiểu ai đó: viết ba giá trị sống bạn cần ở người đồng hành; sau mỗi lần gặp, ghi người đó khớp mấy điều. | Có danh sách + ghi chép sau mỗi lần gặp | 3 tháng |
| TT-05 | PHU-YN-05, PHU-TS-02 | Trước khi tiến xa hơn, cùng nói chuyện về ba chủ đề thực tế: tiền bạc, nơi ở, kế hoạch vài năm tới. | Đủ 3 buổi, mỗi buổi một chủ đề | 3 tháng |
| TT-06 | MENH-VK-03 | Mỗi tuần chủ động kể với {nguoiLienQuan} một điều bạn đang nghĩ hay lo, không đợi được hỏi. | ≥ 10/12 tuần có | 3 tháng |

**Sức khỏe và nếp sống (`suc-khoe`)** — chỉ nếp sống và khám định kỳ; không nêu bộ phận, bệnh, thuốc, chế độ ăn (cổng an toàn).

| Mã | Bám quy tắc | Việc nên làm (câu mẫu) | Cách đo | Hạn |
|---|---|---|---|---|
| SK-01 | TAT-TV-02, TAT-VK-02, CHUNG-SP-17, CHUNG-HOA-03, NAM-MANG-05 | Nếu đã hơn 12 tháng chưa khám sức khỏe tổng quát, đặt lịch khám trong 3 tháng tới. | Đã đặt lịch / đã khám (có/không) | 3 tháng |
| SK-02 | TAT-LT-02 | Chọn một giờ đi ngủ cố định và giữ ít nhất 5 đêm mỗi tuần. | ≥ 6/8 tuần đạt 5 đêm | 2 tháng |
| SK-03 | TAT-TV-02, PHUC-YN-01 | Mỗi ngày làm việc, dành 15 phút nghỉ không màn hình vào cùng một khung giờ. | ≥ 4/5 ngày mỗi tuần, trong 8 tuần | 2 tháng |
| SK-04 | NAM-MANG-05, TAT-SP-04 | Ghi một dòng mỗi tối về mức năng lượng trong ngày (1–5); cuối tháng xem tuần nào thấp và vì sao. | ≥ 20 ngày ghi/tháng; 1 lần xem lại mỗi tháng | 3 tháng |

**Học tập (`hoc-tap`)**

| Mã | Bám quy tắc | Việc nên làm (câu mẫu) | Cách đo | Hạn |
|---|---|---|---|---|
| HT-01 | NAM-TH-04 (chỉ khi đủ điều kiện), *CHUNG-SP-01, MENH-HOA-03* | Chọn một kỹ năng hoặc chứng chỉ, chia lộ trình 12 tuần, học 3 buổi mỗi tuần. | ≥ 30/36 buổi | 3 tháng |
| HT-02 | MENH-CM-02, MENH-TCO-02 | Chọn một chủ đề duy nhất và học xong một khóa hoặc một cuốn sách trước khi mở cái mới. | Hoàn thành 1 khóa/1 cuốn, không mở mới giữa chừng | 3 tháng |
| HT-03 | *QUAN-HOA-02, TAI-HOA-03* | Mỗi tháng viết hoặc chia sẻ một bài ngắn về điều bạn giỏi trong chuyên môn. | 3 bài trong 3 tháng | 3 tháng |

**Gia đạo (`gia-dao`)**

| Mã | Bám quy tắc | Việc nên làm (câu mẫu) | Cách đo | Hạn |
|---|---|---|---|---|
| GD-01 | NAM-HOA-07 (Kỵ năm ở Phụ Mẫu), *PHUMAU-YN-01* | Đặt một cuộc gọi cố định mỗi tuần với {nguoiLienQuan}; việc cần quyết thì nhắn lại bằng chữ sau cuộc gọi. | ≥ 10/12 tuần có cuộc gọi | 3 tháng |
| GD-02 | HUYNH-HOA-02, HUYNH-TL-03 | Chuyện tiền bạc với anh chị em: mỗi khoản đều ghi lại bằng tin nhắn, ai góp bao nhiêu, dùng vào việc gì. | 100% khoản mới có ghi | 3 tháng |
| GD-03 | HUYNH-CC-04 | Khi cả nhà bàn chuyện chung, gửi trước nội dung cần bàn; trong buổi, mỗi người nói hết ý rồi mới quyết. | Áp dụng ở ≥ 2 buổi bàn chuyện chung | 3 tháng |
| GD-04 | DIEN-HOA-04 | Gom giấy tờ nhà ở vào một chỗ (bản giấy và bản chụp), kiểm tên, ngày, chỗ còn thiếu. | Xong danh mục, có/không | 1 tháng |
| GD-05 | *DIEN-HOA-03, PHUC-YN-01* | Chọn một góc trong nhà để sắp lại thành chỗ nghỉ ngơi hoặc làm việc yên tĩnh. | Xong trong tháng, dùng ≥ 3 lần/tuần | 1 tháng |

Bổ sung mẫu mới: Hạnh đề xuất qua Minh; mẫu nào bám quy tắc chưa có thì chờ Đức kiểm nguồn, không thêm thẳng vào bảng.

---

## 7. Đoạn đủ 4 phần (ví dụ trên lá số giả lập VN01, `docs/luan-giai/van-nam/du-lieu.md`)

### 7.1. Đoạn bản mệnh, chuyên đề Tình cảm

> **Phu Thê — Tử Vi, Thiên Phủ (miếu) tại Thân**
> Căn cứ trên lá số của bạn: Tử Vi và Thiên Phủ (miếu) ở cung Phu Thê (Thân), có Tuần (làm chậm, giảm lực); cùng cung có Hỏa Tinh, Linh Tinh (hãm).
> Tử Phủ ở cung người đồng hành cho thấy mối quan hệ có nền tảng vững, dễ gắn bó lâu dài. Tuần khiến bước đầu có thể chậm hoặc vướng, nhưng không cản chuyện thành đôi. Thiên Phủ gặp Tuần cũng làm tiền chung dễ hao, dễ bất đồng vì tiền; Hỏa Linh hãm thêm phần va chạm, nên càng cần tìm hiểu kỹ. Minh bạch chuyện tiền là điểm giữ cho nền tảng ấy bền.
> Nguồn: Tân Biên, Toàn Thư, Khảo Luận · Tam hợp phái Việt · nhận xét tổng hợp của xemtuvi.vn.
> Việc nên làm (3 tháng): mỗi khoản tiền chung với người đồng hành đều có một tin nhắn ghi số tiền, mục đích, hạn. Cách đo: 100% khoản mới trong 3 tháng có tin nhắn.
> `<!-- quy tắc: PHU-TV-01, PHU-SP-10, PHU-CC-07, PHU-SP-06, CHUNG-SP-02; việc: TC-04 bám PHU-CC-07; tongHop -->`

### 7.2. Đoạn vận năm 2027 và bản rút gọn cho bảng tháng

> **Sự nghiệp năm 2027 — Cự Môn (đắc) tại Hợi nhận Hóa Kỵ của năm**
> Căn cứ trên lá số của bạn: năm Đinh Mùi, cung tiểu hạn là Phụ Mẫu (Hợi), Cự Môn (đắc) ở đây mang Hóa Kỵ của năm.
> Năm nay, giấy tờ và trao đổi với cha mẹ, cấp trên là nơi dễ hiểu lầm nhất. Cự Môn sáng nên lời nói của bạn vẫn có sức thuyết phục, nếu nói rõ và có văn bản.
> Nguồn: Khảo Luận · Tam hợp phái Việt · nhận xét tổng hợp của xemtuvi.vn.
> Việc nên làm (2 tháng, bắt đầu từ tháng Giêng, tháng mốc): sau mỗi buổi trao đổi quan trọng với cấp trên, gửi lại 3 dòng chốt kết luận trong ngày. Cách đo: ≥ 80% buổi quan trọng có tin chốt.
> `<!-- quy tắc: NAM-HOA-07, CHUNG-HOA-CM-01, NAM-MANG-02; chuDe cong-viec (tiểu hạn ở Phụ Mẫu); việc: CV-01 bám NAM-HOA-07; tongHop -->`

Bảng 12 tháng (rút gọn, mỗi tháng ≤ 3 câu): (a) và (b) gộp một câu có tên sao, cung tháng; (c) gộp một dòng nguồn cuối bảng; (d) một việc làm được **trong tháng đó**, thước đo có/không. Ví dụ T1: "Cự Môn (đắc) ở Phụ Mẫu nhận Kỵ của năm: tháng dễ hiểu lầm trong trao đổi với cấp trên. Việc nên làm: chốt bằng chữ mọi thỏa thuận trong tháng."

### 7.3. Đoạn không đạt (để đối chiếu)

> Hóa Kỵ tại Mệnh là điểm nhạy cảm, dễ băn khoăn hoặc vướng mắc. Nên chuẩn bị kỹ và giao tiếp rõ ràng, chủ động nắm bắt cơ hội.

Thiếu (a) (không nói Kỵ hóa vào sao nào, độ sáng nào), (c) (không nguồn), (d) chung, không đo được. Bảng chấm: Cụ thể 2, Áp dụng 2 (phiếu chấm 2).

---

## 8. Tự kiểm 4 phần (trước khi gửi Thư)

**Cổng an toàn (mục 0 bảng chấm, một dòng sai là dừng)**
- [ ] Đầu bài có câu nội dung do hệ thống tạo (`GHI_CHU` hoặc NAM-CAM-04).
- [ ] Không từ trong `tu-cam.json`; không giải hạn, cúng, bùa, vật phẩm, "năm hạn", "phạm Thái Tuế".
- [ ] Không gây sợ, không phán cố định; (d) không là lời khuyên tài chính, y tế, pháp lý cụ thể.
- [ ] Không tên, ngày sinh thật của khách trong bài mẫu.

**(a) Căn cứ → tiêu chí 1.3 Cụ thể**
- [ ] Có tên sao, độ sáng, tên cung, địa chi khớp engine; Tứ hóa ghi rõ lớp gốc hay của năm.
- [ ] Vế loại trừ (`yeuToKhong`) có mặt thì đã nêu.
- [ ] Thử đổi sang lá số khác: dòng này sai ngay.

**(b) Nhận định → 1.3 Cụ thể (và 1.1 Đúng)**
- [ ] Mỗi ý truy được về mã trong `<!-- quy tắc -->`; điều kiện quy tắc đủ; cách cục đúng `mucCach`.
- [ ] Nói đúng chuyên đề (`chuDe`, `nguoiLienQuan`); không chép câu của đoạn/bài khác.
- [ ] Bỏ tên sao đi thì câu không còn đứng được.

**(c) Nguồn**
- [ ] Tên sách đúng danh sách; trường phái đúng; có ghi chú khi chạm TRANH; tổng hợp có đánh dấu.

**(d) Việc nên làm → tiêu chí 1.4 Áp dụng được**
- [ ] Đúng 1 việc, mở bằng động từ, ≤ 45 chữ, làm được trong đời thường.
- [ ] Gắn đúng điểm ở (b) (`maHuong` nằm trong `maNghienCuu` của đoạn).
- [ ] Có "Cách đo" tự kiểm được và thời hạn 1–3 tháng (bảng tháng: trong tháng).
- [ ] Không ép mua, không chọn ngày giờ, không vượt chuyên môn.

Đạt khi qua cổng và mọi ô đều tích. Ô nào không tích được vì thiếu quy tắc: ghi "chưa có quy tắc" trong mã ẩn, không viết đoạn đó cho bản trả phí.

---

## 9. Ghi chú cho bộ ghép (Kỹ thuật, không sửa engine)

1. Bộ khớp ghi lại `yeuToKhop[]`, `yeuToKhong[]`, `lopHoa` khi duyệt `dieuKien`/`khong`; (a) sinh từ đây bằng câu mẫu mục 3, không sinh từ `noiDung`.
2. Một điểm trên lá số → một đoạn; gom các quy tắc cùng `yeuToKhop` vào một đoạn, giữ tối đa 3 mã.
3. Chọn (d): lọc bảng `viec-nen-lam.json` theo `chuDe`, rồi theo giao giữa `maHuong` và `maNghienCuu` của đoạn; nhiều mẫu khớp thì lấy mẫu có mã quy tắc đứng trước trong thứ tự ưu tiên CHUNG-PP-10; không trùng `maMau` trong cùng một bài (tối đa 1 lần mỗi mẫu).
4. Không đoạn nào thiếu (a) hoặc (d) được xuất ra bản trả phí; thiếu thì xếp vào danh sách chờ người viết.
5. Kiểm máy đề xuất (mở rộng `tools/kiem-van-nam.cjs` hoặc test mới): đủ 4 nhãn; (a) chứa ít nhất một tên sao + một độ sáng có trong dữ liệu lá số; (d) có "Cách đo:"; độ dài từng phần đúng giới hạn; qua `tu-cam.json`.
