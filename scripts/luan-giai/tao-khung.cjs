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
  'tai-bach': { cung: 'Tài Bạch', chuDe: 'cách kiếm tiền và giữ tiền', hau: ' Về tiền bạc, xu hướng này ảnh hưởng đến cách bạn kiếm, tiêu và tích lũy.', mucCl: 'cung-lien-quan' },
  'dien-trach': { cung: 'Điền Trạch', chuDe: 'nhà cửa và gia đạo', hau: ' Trong gia đạo, xu hướng này ảnh hưởng đến nếp nhà và cách bạn vun vén tổ ấm.', mucCl: 'cung-lien-quan' },
};
const VT = { xung: 'cung xung chiếu', 'tam-hop': 'cung tam hợp' };
const MUC_HOA = 'tu-hoa';
const MUC_PT = 'phu-tinh';

const ID_SAO_KY = (x) => x.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').replace(/[^A-Za-z0-9]+/g, '');
const ra = [];
const them = (q) => ra.push({ phaCach: undefined, ...q });

// --- Tứ hóa ở cung xung chiếu / tam hợp (hóa ở chính cung do quy-tac.json lo).
const HOA = {
  'Hóa Lộc': { menh: 'mở thêm cơ hội và nguồn lực cho bản thân, nên chủ động nắm bắt', 'quan-loc': 'mở thêm cơ hội và nguồn lực cho công việc, nên chủ động nắm bắt', 'phu-the': 'thêm duyên và điều kiện thuận lợi để vun đắp quan hệ, nên chủ động trân trọng', 'tai-bach': 'mở thêm nguồn thu và cơ hội tích lũy, nên chủ động nắm bắt và giữ kỷ luật chi tiêu', 'dien-trach': 'thêm điều kiện thuận lợi cho nhà cửa và sự gắn kết trong nhà, nên chủ động vun vén' },
  'Hóa Quyền': { menh: 'tăng khả năng dẫn dắt và quyết định, cần giữ sự cân bằng', 'quan-loc': 'tăng quyền chủ động và vai trò dẫn dắt trong công việc, cần giữ sự cân bằng với người cùng làm', 'phu-the': 'thêm mong muốn giữ vai trò chủ động trong quan hệ, nên lắng nghe để hai bên cùng cân bằng', 'tai-bach': 'tăng khả năng tự quyết và quản lý tiền bạc, cần cân nhắc kỹ trước các khoản lớn', 'dien-trach': 'thêm vai trò quán xuyến việc nhà và quyết định chuyện chung, nên bàn bạc để cả nhà cùng đồng thuận' },
  'Hóa Khoa': { menh: 'thêm sự thanh nhã, danh tiếng tốt và người giúp đỡ đúng lúc', 'quan-loc': 'thêm danh tiếng tốt, cơ hội học hỏi và quý nhân trong công việc', 'phu-the': 'thêm sự tinh tế, nhã nhặn và được người xung quanh quý trọng trong quan hệ', 'tai-bach': 'thêm uy tín trong chuyện tiền bạc và người hiểu biết giúp đỡ khi cần, nên giữ sự minh bạch', 'dien-trach': 'thêm nếp nhà nền nã, giấy tờ nhà cửa rõ ràng và được họ hàng quý trọng' },
  'Hóa Kỵ': { menh: 'là lĩnh vực cần đầu tư công sức và dễ vướng bận; nên nhìn rõ mong muốn của mình và chủ động chuẩn bị', 'quan-loc': 'là điểm cần đầu tư công sức trong công việc và dễ vướng bận; nên làm rõ mục tiêu, giữ giao tiếp rõ ràng', 'phu-the': 'là điểm cần đầu tư công sức trong quan hệ và dễ để tâm; nên trao đổi thẳng thắn và kiên nhẫn', 'tai-bach': 'là điểm cần để tâm trong tiền bạc và dễ vướng bận; nên ghi chép thu chi, giữ dự phòng và tránh quyết vội', 'dien-trach': 'là điểm cần đầu tư công sức trong việc nhà và dễ để tâm; nên giữ giấy tờ rõ ràng, trao đổi thẳng thắn với người trong nhà' },
};
// Hóa Lộc đồng cung Địa Không / Địa Kiếp thì dễ hao tán (MENH-HOA-01, TAI-CC-08): câu "nên chủ động nắm bắt" chỉ dùng khi không có Không Kiếp đồng cung.
const KK = ['Địa Không', 'Địa Kiếp'];
const HAO_TAN = {
  menh: 'cơ hội có mở ra nhưng dễ hụt hoặc tan nhanh nếu hành động vội; nên chia việc thành bước nhỏ và chốt phần chắc trước',
  'quan-loc': 'cơ hội việc có nhưng dễ đổi hướng hoặc hụt giữa chừng; nên đặt mốc rõ và giữ phần việc chắc tay',
  'phu-the': 'duyên và điều kiện thuận nhưng dễ nghĩ khác lạ hoặc muốn đổi hướng; nên nói rõ điều mình cần và giữ cam kết',
  'tai-bach': 'dám chi để thu, nhưng thu chi dễ lên xuống; nên đặt quỹ dự phòng trước khi mở rộng',
  'dien-trach': 'điều kiện nhà cửa có thuận nhưng dễ hao phí khi sửa sang hay đổi chỗ ở; nên tính kỹ chi phí trước khi quyết',
};
const BIEN_KK = [
  { id: 'Khong', ten: 'Địa Không', co: ['Địa Không'], khong: [['Địa Kiếp']] },
  { id: 'Kiep', ten: 'Địa Kiếp', co: ['Địa Kiếp'], khong: [['Địa Không']] },
  { id: 'KhongKiep', ten: 'Địa Không và Địa Kiếp', co: KK, khong: [] },
];
for (const [cd, c] of Object.entries(CD)) {
  for (const vt of ['xung', 'tam-hop']) {
    for (const b of BIEN_KK) {
      them({
        id: `KHUNG-${cd}-HOA-Lộc-HT-${b.id}-${vt}`, chuyenDe: cd, cung: c.cung, loai: 'HOA',
        maNghienCuu: ['MENH-HOA-01', 'TAI-CC-08', 'CHUNG-SP-02'], dieuKien: [{ hoa: 'Hóa Lộc', viTri: vt, cungCoSao: b.co }],
        khong: b.khong.map((ds) => ({ hoa: 'Hóa Lộc', viTri: vt, cungCoSao: ds })), muc: MUC_HOA,
        noiDung: `{sao} mang Hóa Lộc ở {cung} (${VT[vt]} của ${c.cung}) nhưng có ${b.ten} đồng cung, nên cái lợi dễ hao tán về ${c.chuDe}: ${HAO_TAN[cd]}.`,
        nguon: [TT, TB], nguonChiTiet: 'TT (Hóa Lộc: gặp Kiếp, Không thì hao tán); TB (Hóa Lộc)', truongPhai: TP, yeuTo: [],
      });
    }
  }
}
for (const [cd, c] of Object.entries(CD)) {
  for (const [hoa, ys] of Object.entries(HOA)) {
    for (const vt of ['xung', 'tam-hop']) {
      them({
        id: `KHUNG-${cd}-HOA-${hoa.split(' ')[1]}-${vt}`, chuyenDe: cd, cung: c.cung, loai: 'HOA',
        maNghienCuu: ['CHUNG-HOA-02', 'CHUNG-HOA-03'], dieuKien: [{ hoa, viTri: vt }],
        ...(hoa === 'Hóa Lộc' ? { khong: KK.map((k) => ({ hoa, viTri: vt, cungCoSao: [k] })) } : {}), muc: MUC_HOA,
        noiDung: `{sao} mang ${hoa} ở {cung} (${VT[vt]} của ${c.cung}) ảnh hưởng đến ${c.chuDe}: ${ys[cd]}.`,
        nguon: [TT, TB], nguonChiTiet: 'TT (Thái Vi phú); TB (Tứ hóa)', truongPhai: TP, yeuTo: [],
      });
    }
  }
}

// --- Thế giáp Khoa Quyền (CHUNG-PP-09, CHUNG-CC-10): hai cung kề mang Khoa và Quyền; cung chính có Hóa Kỵ tọa thủ thì lợi ích giảm.
// (Vế "sát tinh hãm tọa thủ cũng làm giảm" của CC-10 chưa áp, ghi nhận để làm sau.)
const GIAP_Y = {
  menh: 'thêm người uy tín sẵn lòng giúp và danh tiếng đến cùng sự chủ động của bản thân',
  'quan-loc': 'trong công việc dễ có người uy tín nâng đỡ, cơ hội học hỏi và quyền chủ động',
  'phu-the': 'trong quan hệ, bạn được người xung quanh quý trọng và có chỗ dựa tinh thần',
  'tai-bach': 'trong tiền bạc, có người đáng tin giúp và cơ hội giữ quyền chủ động khi chi tiêu',
  'dien-trach': 'trong chuyện nhà, có người trong họ hàng hoặc láng giềng sẵn lòng giúp',
};
for (const [cd, c] of Object.entries(CD)) {
  const gk = { giapHoa: ['Hóa Khoa', 'Hóa Quyền'] };
  const ky = { hoa: 'Hóa Kỵ', viTri: 'chinh' };
  them({
    id: `KHUNG-${cd}-GIAP-KhoaQuyen`, chuyenDe: cd, cung: c.cung, loai: 'HOA',
    maNghienCuu: ['CHUNG-PP-09', 'CHUNG-CC-10'], dieuKien: [gk], khong: [ky], muc: MUC_HOA,
    noiDung: `${c.cung} nằm giữa hai cung kề ({cung}) mang Hóa Khoa và Hóa Quyền, một thế giáp cát: ${GIAP_Y[cd]}.`,
    nguon: [TT, TB], nguonChiTiet: 'TT (Luận cách tinh số cao hạ: "giáp quyền giáp khoa thế sở nghi"); TB', truongPhai: TP, yeuTo: ['Giáp Khoa Quyền'],
  });
  them({
    id: `KHUNG-${cd}-GIAP-KhoaQuyen-Ky`, chuyenDe: cd, cung: c.cung, loai: 'HOA',
    maNghienCuu: ['CHUNG-PP-09', 'CHUNG-CC-10'], dieuKien: [gk, ky], muc: MUC_HOA,
    noiDung: `${c.cung} nằm giữa hai cung kề mang Hóa Khoa và Hóa Quyền (thế giáp cát), nhưng chính cung có Hóa Kỵ tọa thủ nên lợi ích từ thế giáp giảm đi: có người uy tín sẵn lòng giúp bạn về ${c.chuDe}, nhưng bạn cần chủ động đón nhận.`,
    nguon: [TT, TB], nguonChiTiet: 'TT (Luận cách tinh số cao hạ, tam giáp); TB (Hóa Kỵ)', truongPhai: TP, yeuTo: ['Giáp Khoa Quyền'],
  });
}

// --- Hóa Kỵ tại cung chính: nói rõ Kỵ hóa vào sao nào (CHUNG-HOA-06: hóa mang tính của sao bị hóa; MENH-HOA-04 cho Mệnh).
// Bộ ghép (index.ts) bỏ câu chung "Hóa Kỵ tại <cung> là điểm nhạy cảm" của bộ quy tắc cũ khi có câu theo sao này.
const KY_SAO = {
  'Tham Lang': ['CHUNG-HOA-THL-01', 'mong muốn nhiều, kỳ vọng cao nên dễ thấy chưa thỏa; chạy theo ham muốn hay tiền bạc quá thì mệt'],
  'Thái Dương': ['CHUNG-HOA-TDU-01', 'dễ bị ganh khi tỏ ra hơn người; khiêm tốn trong cách thể hiện sẽ nhẹ hơn'],
  'Thái Âm': ['CHUNG-HOA-TA-01', 'dễ lo nghĩ, nặng chuyện tiền bạc và cảm xúc; nên chăm đời sống tinh thần'],
  'Liêm Trinh': ['CHUNG-HOA-LT-01', 'dễ bị chê nếu nóng vội hoặc xen vào việc người; giữ nguyên tắc nhưng mềm trong cách nói'],
  'Cự Môn': ['CHUNG-HOA-CM-01', 'tranh cãi, nói nhiều dễ bị ghét; chú ý lời nói sẽ nhẹ hơn'],
  'Thiên Cơ': ['CHUNG-HOA-TCO-01', 'nghĩ nhiều, hay đổi ý, tính toán chi li; nên chốt kế hoạch và làm đến cùng'],
  'Vũ Khúc': ['CHUNG-HOA-VK-01', 'quá tính toán lợi lộc thì khó thành, tiền bạc dễ vướng; nên rõ ràng trong chuyện tiền'],
  'Văn Xương': ['CHUNG-HOA-XK-01', 'học hành, giấy tờ dễ trục trặc, khôn ngoan quá thì bị ghét; nên kiểm kỹ giấy tờ, bài vở'],
  'Văn Khúc': ['CHUNG-HOA-XK-01', 'học hành, giấy tờ dễ trục trặc, khôn ngoan quá thì bị ghét; nên kiểm kỹ giấy tờ, bài vở'],
};
const KY_DUOI = {
  menh: 'Đây là điểm cần đầu tư công sức nơi bản thân; đặt kỳ vọng vừa phải ("làm việc chỉ cầu bảy phần") và chuẩn bị kỹ sẽ nhẹ gánh hơn.',
  'quan-loc': 'Trong công việc, đây là điểm cần đầu tư công sức; làm rõ mục tiêu và giữ giao tiếp rõ ràng sẽ giảm vướng mắc.',
  'phu-the': 'Trong quan hệ, đây là điểm cần đầu tư công sức; trao đổi thẳng thắn và kiên nhẫn sẽ giảm hiểu lầm.',
  'tai-bach': 'Về tiền bạc, đây là điểm cần để tâm; ghi chép thu chi, giữ dự phòng và tránh quyết vội.',
  'dien-trach': 'Trong việc nhà, đây là điểm cần để tâm; giữ giấy tờ rõ ràng và trao đổi thẳng thắn với người trong nhà.',
};
for (const [cd, c] of Object.entries(CD)) {
  for (const [sao, [ma, y]] of Object.entries(KY_SAO)) {
    them({
      id: `KHUNG-${cd}-KY-${ID_SAO_KY(sao)}`, chuyenDe: cd, cung: c.cung, loai: 'HOA',
      maNghienCuu: [...(cd === 'menh' ? ['MENH-HOA-04'] : []), 'CHUNG-HOA-03', 'CHUNG-HOA-06', ma], dieuKien: [{ sao: [sao], hoa: 'Hóa Kỵ', viTri: 'chinh' }], muc: MUC_HOA,
      noiDung: `Hóa Kỵ ở ${c.cung} hóa vào ${sao}: ${y}. ${KY_DUOI[cd]}`,
      nguon: [TT, KL], nguonChiTiet: 'TT (quyển 2, Hóa Kỵ); KL (Sao Tứ hóa)', truongPhai: TP, yeuTo: [],
    });
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
// Mỗi cách: `core` (sao và vị trí, mọi chuyên đề dùng chung), `ud` (xu hướng của cách trong TỪNG chuyên đề: câu cách cục của các bài
// khác chuyên đề không được chép y hệt nhau, vòng 2 T-a4504a), `khu` (lời cho mức "có khuyết"), `them` (ý thêm cho mức thành cách).
const CACH = [
  { ten: 'Tử Phủ Vũ Tướng', kieu: 'on', dk: [{ sao: ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng'], rai: true, viTri: 'tam-phuong' }], ma: ['CHUNG-CC-01', 'CHUNG-CC-08'],
    core: 'Tử Vi, Thiên Phủ, Vũ Khúc, Thiên Tướng cùng hội trong tam phương, tạo thế Tử Phủ Vũ Tướng', them: 'phát huy tốt khi có thêm Tả Phù, Hữu Bật và Tam Hóa',
    khu: 'cần thêm nỗ lực và sự cẩn trọng để giữ vững',
    ud: { menh: 'nền nếp, biết tổ chức, giữ vai trò đáng tin trong nhóm và khi cần quyết định', 'quan-loc': 'hợp vị trí quản lý, điều phối, nơi cần quy trình và trách nhiệm rõ ràng', 'phu-the': 'trong quan hệ, bạn coi trọng sự bền vững và cùng người đồng hành chia việc gánh vác', 'tai-bach': 'tiền bạc thiên về tích lũy đều, quản lý chặt và biết dành quỹ dự phòng', 'dien-trach': 'nhà cửa theo hướng an cư lâu dài, có kế hoạch từng giai đoạn' } },
  { ten: 'Sát Phá Tham', kieu: 'bien', dk: [{ sao: ['Thất Sát', 'Phá Quân', 'Tham Lang'], rai: true, viTri: 'tam-phuong' }], ma: ['CHUNG-CC-02', 'MENH-CC-07'],
    core: 'Thất Sát, Phá Quân, Tham Lang cùng hội trong tam phương, tạo thế Sát Phá Tham', them: 'hợp hơn khi các sát tinh đắc địa',
    khu: 'nhịp biến động cao hơn nên cần cân nhắc kỹ trước quyết định lớn',
    ud: { menh: 'chủ động hành động, dám khai phá và chấp nhận thay đổi, nhịp sống nhiều chuyển biến', 'quan-loc': 'hợp môi trường cạnh tranh, việc mới và phải đi nhiều, dám nhận vai trò mở đường', 'phu-the': 'quan hệ tình cảm có nhịp nhanh, cảm xúc mạnh, dễ đến dễ đi nếu thiếu nền tin cậy', 'tai-bach': 'thu chi có biên độ lớn, dám đầu tư và mở nguồn thu mới nhưng dễ lên xuống', 'dien-trach': 'chuyện nhà cửa dễ có lần đổi chỗ ở hoặc sửa sang lớn, ít khi đứng yên lâu' } },
  { ten: 'Cơ Nguyệt Đồng Lương', kieu: 'tri', dk: [{ sao: ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'], rai: true, viTri: 'tam-phuong' }], ma: ['CHUNG-CC-03', 'MENH-CC-08'],
    core: 'Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương cùng hội trong tam phương, tạo thế Cơ Nguyệt Đồng Lương', them: 'hợp thêm Tam Hóa, Văn Xương, Văn Khúc',
    khu: 'cần chủ động hơn để không dừng ở lối quen',
    ud: { menh: 'suy xét kỹ, thiên về trí tuệ và chuyên môn, thích sự ổn định', 'quan-loc': 'hợp công việc ổn định trong tổ chức (hành chính, giáo dục, dịch vụ, nghiên cứu), thăng tiến nhờ chuyên môn', 'phu-the': 'trong tình cảm, bạn nghĩ nhiều, trọng sự hòa thuận và êm ấm hơn là kịch tính', 'tai-bach': 'tiền bạc đều đặn, nguồn thu ổn định từ chuyên môn hơn là đầu cơ', 'dien-trach': 'gia đạo hòa thuận, nhà cửa thiên về ổn định và tiện nghi vừa đủ' } },
  { ten: 'Cự Nhật', kieu: 'ngon', dk: [{ sao: ['Cự Môn', 'Thái Dương'], viTri: 'tam-phuong' }], ma: ['CHUNG-CC-04', 'CHUNG-CC-08'],
    core: 'Cự Môn và Thái Dương đồng cung, tạo thế Cự Nhật', them: 'Thái Dương sáng thì Cự Môn bớt thị phi',
    khu: 'cần giữ lời nói rõ ràng để tránh hiểu lầm',
    ud: { menh: 'mạnh ở lời nói, truyền đạt và tạo ảnh hưởng bằng ngôn luận', 'quan-loc': 'hợp nghề cần giao tiếp, ngoại giao, thuyết phục; danh tiếng đến từ cách trình bày', 'phu-the': 'lời nói quyết định không khí trong quan hệ; nói thẳng và rõ thì hai người gần nhau hơn', 'tai-bach': 'thu nhập gắn với danh tiếng và quan hệ; điều khoản rõ ràng thì giữ được tiền', 'dien-trach': 'trao đổi trong gia đình là chìa khóa của nếp nhà; bàn bạc rõ thì nhà êm' } },
  { ten: 'Tử Phá', kieu: 'bien', dk: [{ sao: ['Tử Vi', 'Phá Quân'], viTri: 'tam-phuong' }], ma: ['CHUNG-CC-07', 'CHUNG-CC-08'],
    core: 'Tử Vi và Phá Quân đồng cung, tạo thế Tử Phá', them: 'hợp con đường tự thân lập nghiệp',
    khu: 'cần cân nhắc kỹ trước quyết định lớn',
    ud: { menh: 'vừa coi trọng vị thế vừa thích đổi mới, đời sống nhiều chuyển biến', 'quan-loc': 'hợp vai trò dẫn dắt việc đổi mới hoặc cải tổ cách làm cũ', 'phu-the': 'muốn quan hệ có vị thế và sự tôn trọng nhưng cũng dễ đổi ý; cần thống nhất hướng đi chung', 'tai-bach': 'tiền bạc đi theo các cuộc cải tổ, đầu tư mới; có thể lớn nhưng cần kiểm soát', 'dien-trach': 'dễ có kế hoạch cải tạo, đổi mới nhà cửa theo ý riêng' } },
  { ten: 'Cơ Lương', kieu: 'tri', dk: [{ sao: ['Thiên Cơ', 'Thiên Lương'], rai: true, viTri: 'tam-phuong' }], khong0: [{ sao: ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'], rai: true, viTri: 'tam-phuong' }], ma: ['MENH-TCO-03', 'CHUNG-CC-08'],
    core: 'Thiên Cơ và Thiên Lương hội trong tam phương, tạo thế Cơ Lương', them: '',
    khu: 'cần chủ động hành động để ý tưởng thành kết quả',
    ud: { menh: 'giỏi bàn mưu, phân tích, hợp vai trò cố vấn', 'quan-loc': 'hợp công việc cần suy xét kỹ, tham mưu và hoạch định', 'phu-the': 'trong tình cảm, bạn là người bàn bạc và quan tâm chu đáo hơn là nói lời ngọt', 'tai-bach': 'tiền bạc thiên về tính toán kỹ, tiết kiệm có kế hoạch', 'dien-trach': 'chuyện nhà cửa cân nhắc nhiều, thường nhờ lời khuyên người từng trải' } },
  { ten: 'Nhật Nguyệt', kieu: 'on', dk: [{ sao: ['Thái Dương', 'Thái Âm'], rai: true, viTri: 'tam-phuong' }], ma: ['CHUNG-CC-05', 'CHUNG-CC-08'],
    core: 'Thái Dương và Thái Âm cùng hội trong tam phương, tạo thế Nhật Nguyệt', them: '',
    khu: 'cần bền bỉ và tự tạo cơ hội để phát huy ánh sáng của hai sao',
    ud: { menh: 'cùng sáng là cách tốt, chủ hiển đạt; nếu một trong hai kém sáng thì cần thêm nỗ lực và sự bền bỉ', 'quan-loc': 'cùng sáng thì công việc có tiếng, được cấp trên lẫn đồng nghiệp tin; kém sáng thì cần bền bỉ hơn', 'phu-the': 'cùng sáng thì quan hệ ấm áp, quan tâm hai chiều; kém sáng thì cần chủ động hỏi han nhau', 'tai-bach': 'cùng sáng thì thu nhập khá đều từ nhiều nguồn; kém sáng thì cần kiên trì tích lũy', 'dien-trach': 'cùng sáng thì nhà cửa thuận lợi, có chỗ ở tốt; kém sáng thì cần chủ động tạo dựng' } },
];
// Hỏa Tham / Linh Tham: `ud` khi Tham Lang sáng (thành cách), `udPha` khi Tham Lang chưa đủ sáng (chỉ luận "Tham Lang gặp Hỏa/Linh", CHUNG-CC-09).
const HOA_THAM = {
  ma: ['CHUNG-CC-09', 'MENH-CC-06'],
  ud: { menh: 'năng lượng bứt phá mạnh, có uy danh, hợp những việc cần quyết đoán', 'quan-loc': 'sức bật mạnh trong kinh doanh và những lĩnh vực cạnh tranh', 'phu-the': 'trong tình cảm, cảm xúc đến nhanh và nồng nhiệt, cần giữ nhịp để quan hệ bền', 'tai-bach': 'tiền bạc có thể phát nhanh nhờ dám làm, nhưng cũng dễ chi mạnh tay', 'dien-trach': 'chuyện nhà cửa quyết nhanh, dám mua sắm hoặc đổi chỗ ở' },
  udPha: { menh: 'xem là năng lượng nhanh và nóng, cần tiết chế cảm xúc khi quyết định', 'quan-loc': 'xem là sức bật trong công việc nhưng dễ nóng vội, nên cân nhắc trước khi nhận việc lớn', 'phu-the': 'xem là cảm xúc đến nhanh và nóng trong quan hệ, cần tiết chế khi hai người bất đồng', 'tai-bach': 'xem là tay chi nhanh, tiền dễ lên xuống; nên đặt hạn mức chi trước khi quyết', 'dien-trach': 'xem là quyết định nhanh trong chuyện nhà đất; nên chờ một nhịp rồi mới ký kết' },
};
// Lời áp dụng theo chuyên đề (kiểu cách × chuyên đề): để câu cách cục của các bài khác chuyên đề không chép y hệt nhau (T-a4504a, Phiếu 3).
const UNG = {
  on: { menh: 'Với bản thân, đây là điểm tựa để sống nề nếp và giữ vai trò đáng tin trong nhóm.', 'quan-loc': 'Trong công việc, hợp vị trí cần tính tổ chức và trách nhiệm; nên tìm môi trường có quy trình rõ.', 'phu-the': 'Trong tình cảm, bạn trân trọng sự bền vững; hãy nói rõ kỳ vọng để hai người cùng đi đường dài.', 'tai-bach': 'Về tiền bạc, hợp cách tích lũy đều đặn; nên chia quỹ chi tiêu và quỹ dự phòng ngay từ đầu.', 'dien-trach': 'Về nhà cửa, hợp hướng ổn định lâu dài; nên đặt kế hoạch an cư theo từng giai đoạn.' },
  bien: { menh: 'Với bản thân, đời sống nhiều chuyển biến; nên chọn một mục tiêu chính mỗi giai đoạn để không dàn trải.', 'quan-loc': 'Trong công việc, hợp môi trường cạnh tranh và thay đổi; nên thử việc mới có tính toán chứ không bốc đồng.', 'phu-the': 'Trong tình cảm, nhịp quan hệ dễ lên xuống; trước khi gắn bó lâu dài, hãy cùng nói rõ điều mỗi người cần, và khi nóng thì hẹn lúc khác nói.', 'tai-bach': 'Về tiền bạc, thu chi dễ biến động; nên giữ một khoản dự phòng và tránh quyết định lớn khi đang nóng vội.', 'dien-trach': 'Về nhà cửa, dễ có lần đổi chỗ ở hoặc sửa sang; nên cân nhắc kỹ chi phí trước khi quyết.' },
  tri: { menh: 'Với bản thân, mạnh ở suy xét và chuyên môn; nên biến ý tưởng thành việc làm cụ thể theo từng bước.', 'quan-loc': 'Trong công việc, hợp nghề cần phân tích và chuyên môn; nên chủ động nhận việc để năng lực được thấy.', 'phu-the': 'Trong tình cảm, bạn thiên về suy nghĩ kỹ; hãy chia sẻ điều mình nghĩ thay vì giữ trong lòng.', 'tai-bach': 'Về tiền bạc, hợp quản lý cẩn trọng; nên ghi chép thu chi và so sánh kỹ trước khi đầu tư.', 'dien-trach': 'Về nhà cửa, bạn cân nhắc kỹ trước khi quyết; nên đặt hạn chốt để không trì hoãn việc lớn.' },
  ngon: { menh: 'Với bản thân, mạnh ở lời nói và truyền đạt; nên giữ lời rõ ràng, tránh nói khi đang nóng.', 'quan-loc': 'Trong công việc, hợp nghề cần giao tiếp và thuyết phục; nên viết lại thỏa thuận quan trọng cho rõ.', 'phu-the': 'Trong tình cảm, lời nói quyết định không khí; khi nóng, hẹn lúc bình tĩnh để bàn chuyện khó.', 'tai-bach': 'Về tiền bạc, thu nhập gắn với danh tiếng và quan hệ; nên ghi rõ điều khoản khi hợp tác.', 'dien-trach': 'Về nhà cửa, trao đổi trong gia đình là chìa khóa; nên bàn bạc rõ ràng trước các quyết định chung.' },
};
// Phá cách mức 3 (CHUNG-CC-08): chỉ nói "có dáng dấp của cách …", không gọi như thế mạnh.
// GHI CHÚ (chờ Đức chốt): lý do "yếu tố hung ở tứ chính nặng" theo CC-08; SP-03 coi sát tinh đắc địa hội bộ Sát Phá Tham là trợ lực. Chưa đổi cách đọc sát tinh đắc địa.
const PHA3 = (ten, ud, cung) => `Có dáng dấp của thế ${ten}: ${ud}; nhưng yếu tố hung ở tứ chính (bốn cung chiếu vào ${cung}) nặng nên chưa thể coi là cách vững, cần nỗ lực nhiều hơn để phát huy.`;
const nguonCc = [TT, TB];
const ccBase = (cd, c, ten, ma, dk, noiDung, o) => ({
  id: `KHUNG-${cd}-CC-${ten.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').replace(/[^A-Za-z0-9]+/g, '')}${o.hau}`,
  chuyenDe: cd, cung: c.cung, loai: 'CC', maNghienCuu: ma, dieuKien: dk, ...(o.khong ? { khong: o.khong } : {}), cachCuc: ten,
  ...(o.pha ? { phaCach: true } : {}), uuTien: o.uuTien, muc: 'cach-cuc', noiDung,
  nguon: nguonCc, nguonChiTiet: 'TT (Cốt tủy phú; Luận cách tinh số cao hạ); TB', truongPhai: TP, yeuTo: [`Cách ${ten}`],
});
for (const [cd, c] of Object.entries(CD)) {
  const dau = '';
  // Hỏa Tham / Linh Tham: thành cách khi Tham Lang miếu hoặc vượng; ngược lại chỉ luận "Tham Lang gặp Hỏa/Linh" (CHUNG-CC-09).
  for (const [s, n, hau] of [['Hỏa Tinh', 'Hỏa Tham', 'Hoa'], ['Linh Tinh', 'Linh Tham', 'Linh']]) {
    const dk = (ds) => [{ sao: ['Tham Lang', s], doSang: ds, viTri: 'tam-phuong' }];
    const base = (cl) => ({ id: `KHUNG-${cd}-CC-HoaThamLinhTham-${hau}${cl}`, ten: 'Hỏa Tham / Linh Tham' });
    them(ccBase(cd, c, 'Hỏa Tham / Linh Tham', HOA_THAM.ma, dk(['Miếu', 'Vượng']), `${dau}Tham Lang sáng đồng cung ${s}, tạo thế ${n}: ${HOA_THAM.ud[cd]}.`, { hau: `-${hau}`, uuTien: 100 }));
    them(ccBase(cd, c, 'Hỏa Tham / Linh Tham', HOA_THAM.ma, dk(['Đắc', 'Bình', 'Hãm']), `${dau}Tham Lang đồng cung ${s} nhưng Tham Lang chưa đủ sáng, nên chưa đủ điều kiện gọi trọn cách ${n}: ${HOA_THAM.udPha[cd]}.`, { hau: `-${hau}-PHA`, uuTien: 90, pha: true }));
  }
  for (const cach of CACH) {
    const ud = cach.ud[cd];
    // Ba mức theo CC-08 (điểm phá; Sát Phá Tham: sát tinh đắc địa = 0, TRANH-13): thành cách / có khuyết (điểm > 0) / phá cách (mức 3).
    const saoCach = [...new Set(cach.dk.flatMap((k) => k.sao))];
    const phaCach = (tuMuc) => ({ phaCach: { tuMuc, saoCach, ...(cach.ten === 'Sát Phá Tham' ? { dacLaTroLuc: true } : {}) } });
    const khong0 = cach.khong0 ?? [];
    them(ccBase(cd, c, cach.ten, cach.ma, cach.dk, `${dau}${cach.core}: ${ud}${cach.them ? `; ${cach.them}` : ''}.`, { hau: '', uuTien: 100, khong: [phaCach(2), ...khong0] }));
    them(ccBase(cd, c, cach.ten, cach.ma, [...cach.dk, phaCach(2)], `${dau}${cach.core} (thành cách nhưng có khuyết): ${ud}; ${cach.khu}.`, { hau: '-PHA', uuTien: 90, pha: true, khong: [phaCach(3), ...khong0] }));
    them(ccBase(cd, c, cach.ten, cach.ma, [...cach.dk, phaCach(3)], dau + PHA3(cach.ten, ud, c.cung), { hau: '-PHA3', uuTien: 85, pha: true, ...(khong0.length ? { khong: khong0 } : {}) }));
    if (cach.ten === 'Sát Phá Tham') { // Phiếu 3: cả ba sao chủ cách đều hãm thì nêu rõ (một câu mỗi bài)
      them({ id: `KHUNG-${cd}-CC-SatPhaTham-DeuHam`, chuyenDe: cd, cung: c.cung, loai: 'CC', maNghienCuu: ['CHUNG-CC-02', 'CHUNG-CC-08'],
        dieuKien: [{ ...cach.dk[0], deuDoSang: ['Hãm'] }], cachCuc: cach.ten, uuTien: 75, muc: 'cach-cuc',
        noiDung: `Cả ba sao chủ cách Sát Phá Tham (Thất Sát, Phá Quân, Tham Lang) đều hãm, nên khi luận ${c.chuDe}, nhịp biến động thiên về thử thách và cần nhiều lần điều chỉnh hơn.`,
        nguon: nguonCc, nguonChiTiet: 'TT (Luận cách tinh số cao hạ); TB', truongPhai: TP, yeuTo: [`Cách ${cach.ten}`] });
    }
    if (cach.ten === 'Sát Phá Tham') { // TRANH-13: từ ba sát tinh đắc địa mà thiếu Lộc → thêm một câu, không hạ mức
      them({ id: `KHUNG-${cd}-CC-SatPhaTham-TRANH13`, chuyenDe: cd, cung: c.cung, loai: 'CC', maNghienCuu: ['CHUNG-CC-08', 'CHUNG-TRANH-13'],
        dieuKien: [...cach.dk, { satDac: 3, viTri: 'tam-phuong' }], khong: [{ sao: ['Lộc Tồn'], viTri: 'tam-phuong' }, { hoa: 'Hóa Lộc', viTri: 'tam-phuong' }],
        cachCuc: cach.ten, uuTien: 80, muc: 'cach-cuc',
        noiDung: `Thế Sát Phá Tham có từ ba sát tinh đắc địa hội trong tam phương mà chưa có Lộc đi kèm, nên sức bứt phá lớn, cần nhịp nghỉ và tích lũy để không làm rồi lại đổ (khi luận ${c.chuDe}).`,
        nguon: nguonCc, nguonChiTiet: 'TB; KL (Sát Phá Tham, sát tinh đắc địa); mức cần chuyên gia duyệt (TRANH-13)', truongPhai: TP, yeuTo: [`Cách ${cach.ten}`] });
    }
  }
  // Không Kiếp giáp / chiếu: vốn đã là thế cần thực tế hóa, nên chỉ có một mức.
  const kk = ['Địa Không', 'Địa Kiếp'];
  them({ id: `KHUNG-${cd}-CC-KhongKiepGiap`, chuyenDe: cd, cung: c.cung, loai: 'CC', maNghienCuu: ['CHUNG-TP-06', 'CHUNG-SP-02'], dieuKien: [{ sao: kk, rai: true, viTri: 'giap' }], cachCuc: 'Không Kiếp giáp / chiếu', uuTien: 80, muc: 'cach-cuc',
    noiDung: `Địa Không và Địa Kiếp nằm ở hai cung kề ${c.cung} (thế Không Kiếp giáp): dễ nghĩ khác lạ và muốn đổi hướng, hữu ích khi biến thành sáng tạo có kế hoạch; nên thực tế hóa ý tưởng và cân nhắc kỹ trước quyết định lớn.`,
    nguon: nguonCc, nguonChiTiet: 'TT (Luận cách tinh số cao hạ, "tam giáp")', truongPhai: TP, yeuTo: ['Cách Không Kiếp giáp / chiếu'] });
  them({ id: `KHUNG-${cd}-CC-KhongKiepChieu`, chuyenDe: cd, cung: c.cung, loai: 'CC', maNghienCuu: ['CHUNG-TP-06', 'CHUNG-SP-02'], dieuKien: [{ sao: kk, rai: true, viTri: 'hop-chieu' }], khong: [{ sao: kk, rai: true, viTri: 'giap' }], cachCuc: 'Không Kiếp giáp / chiếu', uuTien: 70, muc: 'cach-cuc',
    noiDung: `Địa Không và Địa Kiếp cùng hội chiếu vào ${c.cung} (thế Không Kiếp chiếu): sát tinh thành cặp hội vào tứ chính làm bức tranh nhiều biến đổi hơn; nên thực tế hóa ý tưởng, cân nhắc trước khi đổi hướng và giữ dự phòng.`,
    nguon: nguonCc, nguonChiTiet: 'TT (Luận cách tinh số cao hạ)', truongPhai: TP, yeuTo: ['Cách Không Kiếp giáp / chiếu'] });
}

// --- Kiểm tại chỗ: mỗi chuyên đề có câu Tứ hóa riêng.
for (const [hoa, ys] of Object.entries(HOA)) for (const cd of Object.keys(CD)) if (!ys[cd]) { console.error(`thiếu câu ${hoa} cho ${cd}`); process.exit(1); }
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
