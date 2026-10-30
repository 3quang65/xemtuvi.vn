// Sinh bộ quy tắc "khung" cho bộ ghép bản 2 (việc T-66d481, bước 3 của docs/luan-giai/kiem-duyet-1.md):
// cách cục, Tứ hóa / Tuần / Triệt / sát tinh / Thiên Không / Lộc Tồn / vô chính diệu ở cung hợp chiếu, câu dung hòa.
// Định dạng quy tắc: docs/luan-giai/quy-tac-v2/DINH-DANG.md (thêm trường `yeuTo`, `vaoCau` — xem index.ts).
// Câu chữ chỉ là khung an toàn lấy từ docs/nghien-cuu/luan-giai-12-cung.md; Hạnh viết lại sâu hơn ở quy-tac-v2/.
// Chạy: node scripts/luan-giai/tao-khung.cjs  → src/lib/luan-giai/ai/quy-tac-khung.json (KHÔNG sửa tay file đó).
const fs = require('node:fs');
const path = require('node:path');
const GOC = path.join(__dirname, '../..');
const NC = fs.readFileSync(path.join(GOC, 'docs/nghien-cuu/luan-giai-12-cung.md'), 'utf8');
const MA_NC = new Set([...NC.matchAll(/^- \*\*\[([A-Z]+(?:-[A-Z0-9]+)+)\]\*\*/gm)].map((m) => m[1]));

const TT = 'Tử Vi Đẩu Số Toàn Thư (Hy Di Trần Đoàn)';
const TB = 'Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)';
const NL = 'Tử Vi Nghiệm Lý Toàn Thư (Thiên Lương)';
const KL = 'Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)';
const TP = 'Tam hợp phái Việt';

const CD = {
  menh: { cung: 'Mệnh', chuDe: 'tính cách và hướng đi của bạn', hau: ' Đây là nét nền trong cách bạn hành xử và chọn hướng đi.', mucCl: 'cung-lien-quan' },
  'quan-loc': { cung: 'Quan Lộc', chuDe: 'công việc và sự nghiệp', hau: ' Trong công việc, nên chọn môi trường và vai trò hợp với xu hướng này.', mucCl: 'cung-lien-quan' },
  'phu-the': { cung: 'Phu Thê', chuDe: 'chuyện tình cảm và hôn nhân', hau: ' Trong tình cảm, xu hướng này ảnh hưởng đến cách bạn chọn và gìn giữ mối quan hệ.', mucCl: 'cung-lien-quan' },
};
const VT = { xung: 'cung xung chiếu', 'tam-hop': 'cung tam hợp' };
const MUC_HOA = 'tu-hoa';
const MUC_PT = 'phu-tinh';

const ra = [];
const them = (q) => ra.push({ phaCach: undefined, ...q });

// --- Tứ hóa ở cung xung chiếu / tam hợp (hóa ở chính cung do quy-tac.json lo).
const HOA = {
  'Hóa Lộc': { menh: 'mở thêm cơ hội và nguồn lực cho bản thân, nên chủ động nắm bắt', 'quan-loc': 'mở thêm cơ hội và nguồn lực cho công việc, nên chủ động nắm bắt', 'phu-the': 'thêm duyên và điều kiện thuận lợi để vun đắp quan hệ, nên chủ động trân trọng' },
  'Hóa Quyền': { menh: 'tăng khả năng dẫn dắt và quyết định, cần giữ sự cân bằng', 'quan-loc': 'tăng quyền chủ động và vai trò dẫn dắt trong công việc, cần giữ sự cân bằng với người cùng làm', 'phu-the': 'thêm mong muốn giữ vai trò chủ động trong quan hệ, nên lắng nghe để hai bên cùng cân bằng' },
  'Hóa Khoa': { menh: 'thêm sự thanh nhã, danh tiếng tốt và người giúp đỡ đúng lúc', 'quan-loc': 'thêm danh tiếng tốt, cơ hội học hỏi và quý nhân trong công việc', 'phu-the': 'thêm sự tinh tế, nhã nhặn và được người xung quanh quý trọng trong quan hệ' },
  'Hóa Kỵ': { menh: 'là lĩnh vực cần đầu tư công sức và dễ vướng bận; nên nhìn rõ mong muốn của mình và chủ động chuẩn bị', 'quan-loc': 'là điểm cần đầu tư công sức trong công việc và dễ vướng bận; nên làm rõ mục tiêu, giữ giao tiếp rõ ràng', 'phu-the': 'là điểm cần đầu tư công sức trong quan hệ và dễ để tâm; nên trao đổi thẳng thắn và kiên nhẫn' },
};
for (const [cd, c] of Object.entries(CD)) {
  for (const [hoa, ys] of Object.entries(HOA)) {
    for (const vt of ['xung', 'tam-hop']) {
      them({
        id: `KHUNG-${cd}-HOA-${hoa.split(' ')[1]}-${vt}`, chuyenDe: cd, cung: c.cung, loai: 'HOA',
        maNghienCuu: ['CHUNG-HOA-02', 'CHUNG-HOA-03'], dieuKien: [{ hoa, viTri: vt }], muc: MUC_HOA,
        noiDung: `{sao} mang ${hoa} ở {cung} (${VT[vt]} của ${c.cung}) ảnh hưởng đến ${c.chuDe}: ${ys[cd]}.`,
        nguon: [TT, TB], nguonChiTiet: 'TT (Thái Vi phú); TB (Tứ hóa)', truongPhai: TP, yeuTo: [],
      });
    }
  }
}

// --- Tuần, Triệt ở cung hợp chiếu (CHUNG-TP-04: Tuần Triệt không chiếu; chỉ làm dịu sao trong chính hai cung đó).
const TT_TEXT = {
  tuan: 'Tuần đóng ở {cung} (%VT% của %C%): Tuần chỉ tác động hai cung nó đứng giữa, không chiếu sang %C%, nhưng các sao tại {cung} bị giảm cường độ nên phần đóng góp của cung này cho %CD% đến chậm và dịu hơn; ảnh hưởng thường rõ dần về sau, mỗi người cảm nhận khác nhau tùy hoàn cảnh và nỗ lực.',
  triet: 'Triệt đóng ở {cung} (%VT% của %C%): Triệt chỉ tác động hai cung nó tách đôi, không chiếu sang %C%, nhưng các sao tại {cung} bị giảm cường độ nên phần đóng góp của cung này cho %CD% dịu hơn; ảnh hưởng thường rõ hơn ở giai đoạn đầu đời rồi nhẹ dần, mỗi người cảm nhận khác nhau tùy hoàn cảnh và nỗ lực.',
};
for (const [cd, c] of Object.entries(CD)) {
  for (const [k, ten, cuoi] of [['tuan', 'Tuần', 'TUAN'], ['triet', 'Triệt', 'TRIET']]) {
    for (const vt of ['xung', 'tam-hop']) {
      them({
        id: `KHUNG-${cd}-${cuoi}-${vt}`, chuyenDe: cd, cung: c.cung, loai: cuoi,
        maNghienCuu: ['CHUNG-TP-04', 'CHUNG-TUAN-02', 'CHUNG-TUAN-09'], dieuKien: [{ [k]: true, viTri: vt }], muc: MUC_PT,
        noiDung: TT_TEXT[k].replaceAll('%VT%', VT[vt]).replaceAll('%C%', c.cung).replaceAll('%CD%', c.chuDe),
        nguon: [NL, KL], nguonChiTiet: 'NL (tập 1, Tuần Triệt); KL (Tuần Triệt)', truongPhai: TP, yeuTo: [ten],
      });
    }
  }
}

// --- Sát tinh, Thiên Không, Lộc Tồn ở cung xung chiếu / tam hợp (+ Thiên Không ở chính cung).
const SAO = {
  'Kình Dương': 'nghị lực mạnh, quyết liệt, nên kiểm soát sự nóng vội',
  'Đà La': 'kiên trì, bền bỉ nhưng dễ chần chừ, nên chủ động hơn',
  'Hỏa Tinh': 'nhiệt huyết, phản ứng nhanh, nên tiết chế cảm xúc',
  'Linh Tinh': 'nhạy bén nhưng dễ căng thẳng, nên giữ nhịp nghỉ ngơi',
  'Địa Không': 'hay nghĩ khác lạ, cần thực tế hóa ý tưởng',
  'Địa Kiếp': 'hay muốn đổi hướng, nên cân nhắc trước khi quyết',
  'Thiên Không': 'ý nghĩ thoáng, nhiều ý tưởng nhưng khó nắm chắc, nên cụ thể hóa bằng kế hoạch',
  'Lộc Tồn': 'biết tích lũy, thận trọng với tài chính, nên linh hoạt vừa đủ để không bỏ lỡ cơ hội',
};
const MA_SAO = { 'Lộc Tồn': ['CHUNG-SP-04'], 'Thiên Không': ['CHUNG-TP-04', 'CHUNG-VCD-03'] };
const ID_SAO = (s) => s.replaceAll(' ', '');
for (const [cd, c] of Object.entries(CD)) {
  for (const [sao, y] of Object.entries(SAO)) {
    for (const vt of ['xung', 'tam-hop']) {
      them({
        id: `KHUNG-${cd}-SP-${ID_SAO(sao)}-${vt}`, chuyenDe: cd, cung: c.cung, loai: 'SP',
        maNghienCuu: MA_SAO[sao] ?? ['CHUNG-SP-02', 'CHUNG-TP-06'], dieuKien: [{ sao: [sao], viTri: vt }], muc: MUC_PT,
        noiDung: `${sao} ở {cung} (${VT[vt]} của ${c.cung}) ảnh hưởng đến ${c.chuDe}: ${y}.`,
        nguon: [TT, TB], nguonChiTiet: 'TT (Luận cách tinh số cao hạ); TB (sao phụ)', truongPhai: TP, yeuTo: [],
      });
    }
  }
  them({
    id: `KHUNG-${cd}-SP-ThienKhong-chinh`, chuyenDe: cd, cung: c.cung, loai: 'SP',
    maNghienCuu: ['CHUNG-TP-04', 'CHUNG-VCD-03'], dieuKien: [{ sao: ['Thiên Không'], viTri: 'chinh' }], muc: MUC_PT,
    noiDung: `Thiên Không đồng cung ${c.cung}: ${SAO['Thiên Không']}.`,
    nguon: [TT, TB], nguonChiTiet: 'TT (Cốt tủy phú, không vong); TB (sao phụ)', truongPhai: TP, yeuTo: [],
  });
}

// --- Vô chính diệu ở cung hợp chiếu.
for (const [cd, c] of Object.entries(CD)) {
  for (const vt of ['xung', 'tam-hop']) {
    them({
      id: `KHUNG-${cd}-VCD-${vt}`, chuyenDe: cd, cung: c.cung, loai: 'VCD',
      maNghienCuu: ['CHUNG-VCD-01', 'CHUNG-VCD-03'], dieuKien: [{ voChinhDieu: true, viTri: vt }], muc: c.mucCl,
      noiDung: `{cung} (${VT[vt]} của ${c.cung}) không có chính tinh (vô chính diệu): khi luận ${c.chuDe}, nên mượn chính tinh của cung đối diện để xem, lực yếu hơn chính tinh tọa thủ, và xét thêm sao phụ tại cung; phái Việt coi gặp Tuần hoặc Triệt là thuận hơn.`,
      nguon: [TT, TB], nguonChiTiet: 'TT (Luận cách tinh số cao hạ); TB, NL (vô chính diệu)', truongPhai: TP, yeuTo: ['Vô Chính Diệu'],
    });
  }
}

// --- Câu dung hòa (CHUNG-TUAN-06, CHUNG-HOA-07): cung có cả mặt thuận lẫn mặt vướng thì không chọn một chiều.
for (const [cd, c] of Object.entries(CD)) {
  for (const [k, ten] of [['tuan', 'Tuần'], ['triet', 'Triệt']]) {
    them({
      id: `KHUNG-${cd}-DH-${ten}-Ky`, chuyenDe: cd, cung: c.cung, loai: 'YN',
      maNghienCuu: ['CHUNG-TUAN-06', 'CHUNG-TUAN-02'], dieuKien: [{ [k]: true, viTri: 'chinh' }, { hoa: 'Hóa Kỵ', viTri: 'tam-phuong' }], muc: MUC_PT,
      noiDung: `${c.cung} có ${ten} trong khi tam phương có Hóa Kỵ: ${ten} làm cả mặt mạnh lẫn mặt vướng đều dịu đi, nên biên độ hẹp lại, ít bứt phá lớn nhưng cũng ít vấp lớn; điểm mạnh cần thời gian để bộc lộ, điểm vướng cũng nhẹ hơn.`,
      nguon: [NL, KL], nguonChiTiet: 'NL, KL (Tuần Triệt)', truongPhai: TP, yeuTo: [],
    });
  }
  for (const hoa of ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa']) {
    them({
      id: `KHUNG-${cd}-DH-${hoa.split(' ')[1]}-Ky`, chuyenDe: cd, cung: c.cung, loai: 'YN',
      maNghienCuu: ['CHUNG-HOA-07', 'CHUNG-PP-11'], dieuKien: [{ hoa, viTri: 'tam-phuong' }, { hoa: 'Hóa Kỵ', viTri: 'tam-phuong' }], muc: MUC_HOA,
      noiDung: `Tam phương của ${c.cung} vừa có ${hoa} vừa có Hóa Kỵ: thuận lợi và điểm vướng cùng tồn tại, kết quả có lúc lên lúc xuống; nên tận dụng mặt thuận, giữ nhịp đều, dự phòng và chủ động xử lý chỗ vướng thay vì chỉ nhìn một chiều.`,
      nguon: [TT, KL], nguonChiTiet: 'TT (quyển 2, Hóa Kỵ); KL (Hóa Kỵ)', truongPhai: TP, yeuTo: [],
    });
  }
}

// --- Cách cục (10 cách ưu tiên). Xét ở tam phương của cung chính chuyên đề. Phá cách = từ 2 sát tinh trở lên hội tam phương (CHUNG-PP-11).
const PHA = { sao: ['Địa Không', 'Địa Kiếp', 'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'], toiThieu: 2, viTri: 'tam-phuong' };
const SAC_THAI = {
  menh: 'Đây là nét nền trong cách bạn hành xử và chọn hướng đi.',
  'quan-loc': 'Trong công việc, nên chọn môi trường và vai trò hợp với xu hướng này.',
  'phu-the': 'Trong tình cảm, xu hướng này ảnh hưởng đến cách bạn chọn và gìn giữ mối quan hệ.',
};
const CACH = [
  { ten: 'Tử Phủ Vũ Tướng', dk: [{ sao: ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng'], rai: true, viTri: 'tam-phuong' }], ma: ['CHUNG-CC-01', 'CHUNG-CC-08'],
    t: 'Tử Vi, Thiên Phủ, Vũ Khúc, Thiên Tướng cùng hội trong tam phương, tạo thế Tử Phủ Vũ Tướng: thiên về ổn định, quản lý, tổ chức và tài chính; phát huy tốt khi có thêm Tả Phù, Hữu Bật và Tam Hóa.',
    k: 'Thế Tử Phủ Vũ Tướng có đủ sao nhưng tam phương có từ hai sát tinh hội chiếu (thành cách nhưng có khuyết): xu hướng ổn định, quản lý, tổ chức vẫn còn, cần thêm nỗ lực và sự cẩn trọng để giữ vững.' },
  { ten: 'Sát Phá Tham', dk: [{ sao: ['Thất Sát', 'Phá Quân', 'Tham Lang'], rai: true, viTri: 'tam-phuong' }], ma: ['CHUNG-CC-02', 'MENH-CC-07'],
    t: 'Thất Sát, Phá Quân, Tham Lang cùng hội trong tam phương, tạo thế Sát Phá Tham: thiên về hành động, khai phá và thay đổi, hợp môi trường cạnh tranh và đi xa; hợp hơn khi các sát tinh đắc địa.',
    k: 'Thế Sát Phá Tham có đủ sao và tam phương có từ hai sát tinh hội chiếu (thành cách nhưng có khuyết): nhịp biến động cao hơn, nên chọn mục tiêu rõ và tránh dàn trải sức lực.' },
  { ten: 'Cơ Nguyệt Đồng Lương', dk: [{ sao: ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'], rai: true, viTri: 'tam-phuong' }], ma: ['CHUNG-CC-03', 'MENH-CC-08'],
    t: 'Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương cùng hội trong tam phương, tạo thế Cơ Nguyệt Đồng Lương: thiên về trí tuệ, chuyên môn, công việc ổn định trong tổ chức (hành chính, giáo dục, dịch vụ, nghiên cứu); hợp thêm Tam Hóa, Văn Xương, Văn Khúc.',
    k: 'Thế Cơ Nguyệt Đồng Lương có đủ sao nhưng tam phương có từ hai sát tinh hội chiếu (thành cách nhưng có khuyết): xu hướng ổn định, chuyên môn vẫn còn, cần chủ động hơn để không dừng ở lối quen.' },
  { ten: 'Cự Nhật', dk: [{ sao: ['Cự Môn', 'Thái Dương'], viTri: 'tam-phuong' }], ma: ['CHUNG-CC-04', 'CHUNG-CC-08'],
    t: 'Cự Môn và Thái Dương đồng cung, tạo thế Cự Nhật: thiên về ngôn luận, truyền đạt, ngoại giao và danh tiếng; Thái Dương sáng thì Cự Môn bớt thị phi.',
    k: 'Thế Cự Nhật (Cự Môn và Thái Dương đồng cung) có từ hai sát tinh hội chiếu ở tam phương (thành cách nhưng có khuyết): thế mạnh ngôn luận, truyền đạt vẫn còn, cần giữ lời nói rõ ràng để tránh hiểu lầm.' },
  { ten: 'Hỏa Tham / Linh Tham', bien: [['Hỏa Tinh', 'Hỏa Tham'], ['Linh Tinh', 'Linh Tham']], ma: ['CHUNG-CC-09', 'MENH-CC-06'],
    t: (s, n) => `Tham Lang sáng đồng cung ${s}, tạo thế ${n}: năng lượng bứt phá mạnh, có uy danh, hợp kinh doanh và những lĩnh vực cạnh tranh.`,
    k: (s, n) => `Tham Lang đồng cung ${s} nhưng Tham Lang chưa đủ sáng, nên chưa đủ điều kiện gọi trọn cách ${n}: xem là năng lượng nhanh và nóng, cần tiết chế cảm xúc và chọn một mục tiêu chính.` },
  { ten: 'Tử Phá', dk: [{ sao: ['Tử Vi', 'Phá Quân'], viTri: 'tam-phuong' }], ma: ['CHUNG-CC-07', 'CHUNG-CC-08'],
    t: 'Tử Vi và Phá Quân đồng cung, tạo thế Tử Phá: vừa coi trọng vị thế vừa thích đổi mới, đời sống nhiều chuyển biến, hợp con đường tự thân lập nghiệp.',
    k: 'Thế Tử Phá (Tử Vi và Phá Quân đồng cung) có từ hai sát tinh hội chiếu ở tam phương (thành cách nhưng có khuyết): xu hướng đổi mới và chuyển biến cao hơn, nên chọn hướng đi rõ và cân nhắc kỹ trước quyết định lớn.' },
  { ten: 'Cơ Lương', dk: [{ sao: ['Thiên Cơ', 'Thiên Lương'], rai: true, viTri: 'tam-phuong' }], khong0: [{ sao: ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'], rai: true, viTri: 'tam-phuong' }], ma: ['MENH-TCO-03', 'CHUNG-CC-08'],
    t: 'Thiên Cơ và Thiên Lương hội trong tam phương, tạo thế Cơ Lương: giỏi bàn mưu lược và phân tích, hợp công việc cần suy xét kỹ.',
    k: 'Thế Cơ Lương (Thiên Cơ và Thiên Lương hội trong tam phương) có từ hai sát tinh hội chiếu (thành cách nhưng có khuyết): khả năng phân tích, bàn mưu vẫn còn, cần chủ động hành động để ý tưởng thành kết quả.' },
  { ten: 'Nhật Nguyệt', dk: [{ sao: ['Thái Dương', 'Thái Âm'], rai: true, viTri: 'tam-phuong' }], ma: ['CHUNG-CC-05', 'CHUNG-CC-08'],
    t: 'Thái Dương và Thái Âm cùng hội trong tam phương, tạo thế Nhật Nguyệt: cùng sáng là cách tốt, chủ hiển đạt; nếu một trong hai kém sáng thì cần thêm nỗ lực và sự bền bỉ.',
    k: 'Thế Nhật Nguyệt (Thái Dương và Thái Âm cùng hội trong tam phương) có từ hai sát tinh hội chiếu (thành cách nhưng có khuyết): cần bền bỉ và tự tạo cơ hội để phát huy được ánh sáng của hai sao.' },
  { ten: 'Tham Đào', dk: [{ sao: ['Tham Lang', 'Đào Hoa'], viTri: 'tam-phuong' }], ma: ['CHUNG-SP-06', 'CHUNG-CT-THL-01'],
    t: 'Tham Lang đồng cung Đào Hoa, tạo thế Tham Đào: sức hút và duyên giao tiếp lớn, nhiều ham muốn và thích cái mới; nên cân bằng giữa duyên và nguyên tắc cá nhân.',
    k: 'Thế Tham Đào (Tham Lang đồng cung Đào Hoa) có từ hai sát tinh hội chiếu ở tam phương (thành cách nhưng có khuyết): sức hút vẫn còn, nên rõ ràng về điều mình muốn để tránh phân tán.' },
];
const nguonCc = [TT, TB];
const ccBase = (cd, c, ten, ma, dk, noiDung, o) => ({
  id: `KHUNG-${cd}-CC-${ten.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').replace(/[^A-Za-z0-9]+/g, '')}${o.hau}`,
  chuyenDe: cd, cung: c.cung, loai: 'CC', maNghienCuu: ma, dieuKien: dk, ...(o.khong ? { khong: o.khong } : {}), cachCuc: ten,
  ...(o.pha ? { phaCach: true } : {}), uuTien: o.uuTien, muc: 'cach-cuc', noiDung: `${noiDung} ${SAC_THAI[cd]}`,
  nguon: nguonCc, nguonChiTiet: 'TT (Cốt tủy phú; Luận cách tinh số cao hạ); TB', truongPhai: TP, yeuTo: [`Cách ${ten}`],
});
for (const [cd, c] of Object.entries(CD)) {
  for (const cach of CACH) {
    if (cach.bien) { // Hỏa Tham / Linh Tham: thành cách khi Tham Lang miếu hoặc vượng; ngược lại ghi nhận có khuyết
      for (const [s, n] of cach.bien) {
        const dk = (ds) => [{ sao: ['Tham Lang', s], doSang: ds, viTri: 'tam-phuong' }];
        const hau = s === 'Hỏa Tinh' ? 'Hoa' : 'Linh';
        them(ccBase(cd, c, cach.ten, cach.ma, dk(['Miếu', 'Vượng']), cach.t(s, n), { hau: `-${hau}`, uuTien: 100 }));
        them(ccBase(cd, c, cach.ten, cach.ma, dk(['Đắc', 'Bình', 'Hãm']), cach.k(s, n), { hau: `-${hau}-PHA`, uuTien: 90, pha: true }));
      }
      continue;
    }
    const khong = [PHA, ...(cach.khong0 ?? [])];
    them(ccBase(cd, c, cach.ten, cach.ma, cach.dk, cach.t, { hau: '', uuTien: 100, khong }));
    them(ccBase(cd, c, cach.ten, cach.ma, [...cach.dk, PHA], cach.k, { hau: '-PHA', uuTien: 90, pha: true, khong: cach.khong0 }));
  }
  // Không Kiếp giáp / chiếu: vốn đã là thế cần thực tế hóa, nên chỉ có một mức.
  const kk = ['Địa Không', 'Địa Kiếp'];
  const sacThai = SAC_THAI[cd];
  them({ id: `KHUNG-${cd}-CC-KhongKiepGiap`, chuyenDe: cd, cung: c.cung, loai: 'CC', maNghienCuu: ['CHUNG-TP-06', 'CHUNG-SP-02'], dieuKien: [{ sao: kk, rai: true, viTri: 'giap' }], cachCuc: 'Không Kiếp giáp / chiếu', uuTien: 80, muc: 'cach-cuc',
    noiDung: `Địa Không và Địa Kiếp nằm ở hai cung kề ${c.cung} (thế Không Kiếp giáp): dễ nghĩ khác lạ và muốn đổi hướng, hữu ích khi biến thành sáng tạo có kế hoạch; nên thực tế hóa ý tưởng và cân nhắc kỹ trước quyết định lớn. ${sacThai}`,
    nguon: nguonCc, nguonChiTiet: 'TT (Luận cách tinh số cao hạ, "tam giáp")', truongPhai: TP, yeuTo: ['Cách Không Kiếp giáp / chiếu'] });
  them({ id: `KHUNG-${cd}-CC-KhongKiepChieu`, chuyenDe: cd, cung: c.cung, loai: 'CC', maNghienCuu: ['CHUNG-TP-06', 'CHUNG-SP-02'], dieuKien: [{ sao: kk, rai: true, viTri: 'hop-chieu' }], khong: [{ sao: kk, rai: true, viTri: 'giap' }], cachCuc: 'Không Kiếp giáp / chiếu', uuTien: 70, muc: 'cach-cuc',
    noiDung: `Địa Không và Địa Kiếp cùng hội chiếu vào ${c.cung} (thế Không Kiếp chiếu): sát tinh thành cặp hội vào tứ chính làm bức tranh nhiều biến đổi hơn; nên thực tế hóa ý tưởng, cân nhắc trước khi đổi hướng và giữ dự phòng. ${sacThai}`,
    nguon: nguonCc, nguonChiTiet: 'TT (Luận cách tinh số cao hạ)', truongPhai: TP, yeuTo: ['Cách Không Kiếp giáp / chiếu'] });
}

// --- Kiểm tại chỗ: mã nghiên cứu có thật, id không trùng, câu đủ dài.
const loi = [];
const ids = new Set();
for (const q of ra) {
  if (ids.has(q.id)) loi.push(`trùng id ${q.id}`);
  ids.add(q.id);
  for (const m of q.maNghienCuu) if (!MA_NC.has(m)) loi.push(`${q.id}: mã ${m} không có trong nghiên cứu`);
  if (q.noiDung.length < 40) loi.push(`${q.id}: câu ngắn`);
}
if (loi.length) { console.error(loi.join('\n')); process.exit(1); }
const dich = path.join(GOC, 'src/lib/luan-giai/ai/quy-tac-khung.json');
fs.writeFileSync(dich, JSON.stringify(ra.map((q) => JSON.parse(JSON.stringify(q))), null, 1) + '\n');
console.log(`Đã ghi ${ra.length} quy tắc khung → ${path.relative(GOC, dich)}`);
