// Kiểm thử chuyên đề "Vận 10 năm" (T-6eb009): đại vận đang đi của lá số mẫu khớp 10 bản Hạnh viết (DV01–DV10),
// mỗi nhận định truy về quy tắc VAN- có thật, sao nằm đúng cung vận / hợp chiếu, sạch từ cấm, có đệm cache theo năm xem.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => {
  m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText, f);
};
const { lapLaSo } = require('../src/lib/tuvi/index.ts');
const AI = require('../src/lib/luan-giai/ai/index.ts');
// Đầu vào 10 lá số mẫu lấy từ dữ liệu đại vận do engine sinh (docs/luan-giai/dai-van/du-lieu.md).
const CASES = [...fs.readFileSync(path.join(__dirname, '../docs/luan-giai/dai-van/du-lieu.md'), 'utf8').matchAll(/Đầu vào: `(\{.*\})`/g)].map((m) => ({ input: JSON.parse(m[1]) }));
assert.equal(CASES.length, 10);
const TU_CAM = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/luan-giai/ai/tu-cam.json'), 'utf8'));
const docQV = (t) => JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/luan-giai/ai/quy-tac-van/', t), 'utf8'));
const QV = [...docQV('van-10-nam.json'), ...docQV('van-10-nam-sp.json'), ...docQV('van-10-nam-pp.json')];
const chuan = (s) => s.toLowerCase().replace(/\s+/g, '');
const tatCa = (ls, ten) => { const c = ls.cung.find((x) => x.ten === ten); return [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh]; };
// Năm âm lịch xem cố định = 2026 (dữ liệu mẫu DV sinh với năm xem 2026).
const NAM_XEM = 2026;

CASES.forEach((tc, i) => {
  const ma = 'DV' + String(i + 1).padStart(2, '0');
  const md = fs.readFileSync(path.join(__dirname, `../docs/luan-giai/dai-van/${ma}.md`), 'utf8');
  const [, tu, den, cungMau] = md.match(/— (\d+)–(\d+) tuổi, cung ([^(]+?) \(/);
  test(`${ma}: đại vận ${tu}–${den} cung ${cungMau} khớp bản mẫu, nhận định truy được`, async () => {
    const ls = lapLaSo(tc.input);
    const bai = await AI.sinhLuanGiai(ls, 'van-10-nam', { boQuaCache: true, namXem: NAM_XEM });
    assert.equal(bai.chuyenDe, 'van-10-nam');
    assert.ok(bai.van, 'phải có thông tin vận');
    assert.equal(bai.van.cung, cungMau);
    assert.equal(bai.van.tuoiTu, +tu);
    assert.equal(bai.van.tuoiDen, +den);
    assert.equal(bai.van.namTu, ls.am.nam + +tu - 1);
    assert.equal(bai.van.namDen, ls.am.nam + +den - 1);
    assert.match(bai.ghiChu, /do hệ thống xemtuvi\.vn tạo tự động/);
    const nd = bai.muc.flatMap((m) => m.nhanDinh);
    assert.ok(nd.length >= 3, `${ma} chỉ có ${nd.length} nhận định`);
    assert.ok(bai.muc[0].nhanDinh.some((d) => d.thamChieu.quyTacId.startsWith('VAN-CUNG-')), 'mục đầu nêu chủ đề cung vận');
    for (const d of nd) {
      const q = QV.find((x) => x.id === d.thamChieu.quyTacId);
      assert.ok(q, `quy tắc ${d.thamChieu.quyTacId} không tồn tại`);
      assert.match(q.id, /^VAN-/);
      assert.ok(d.thamChieu.nguon && d.thamChieu.truongPhai);
      assert.equal(d.thamChieu.cung, cungMau, 'cung gốc là cung vận');
      const cungs = d.thamChieu.cungLienQuan ?? [d.thamChieu.cung];
      const sao = cungs.flatMap((c) => tatCa(ls, c));
      for (const s of d.thamChieu.sao) assert.ok(sao.some((x) => x.ten === s), `${s} không ở ${cungs.join(', ')}`);
    }
    const het = chuan(JSON.stringify(bai));
    for (const c of TU_CAM.tuCam) assert.ok(!het.includes(chuan(c)), `còn từ cấm: ${c}`);
  });
});

test('Quy tắc VAN-: id duy nhất, nội dung ≥ 40 ký tự, có nguồn và trường phái', () => {
  assert.ok(QV.length >= 40);
  assert.equal(new Set(QV.map((q) => q.id)).size, QV.length);
  for (const q of QV) {
    assert.equal(q.chuyenDe, 'van-10-nam');
    assert.ok(q.noiDung.length >= 40, q.id);
    assert.ok(q.nguon.length && q.truongPhai && q.maNghienCuu.length, q.id);
  }
});

test('Chưa tới tuổi vào đại vận: không có vận, không có nhận định, không lỗi', async () => {
  const ls = lapLaSo(CASES[0].input);
  const bai = await AI.sinhLuanGiai(ls, 'van-10-nam', { boQuaCache: true, namXem: ls.am.nam });
  assert.equal(bai.van, null);
  assert.deepEqual(bai.muc, []);
});

test('Cache tách theo đại vận: xem năm khác cùng đại vận trùng khóa, khác đại vận khác khóa', async () => {
  const ls = lapLaSo(CASES[0].input);
  const a = await AI.sinhLuanGiai(ls, 'van-10-nam', { boQuaCache: true, namXem: 2026 });
  const b = await AI.sinhLuanGiai(ls, 'van-10-nam', { boQuaCache: true, namXem: 2029 });
  const c = await AI.sinhLuanGiai(ls, 'van-10-nam', { boQuaCache: true, namXem: 2036 });
  assert.deepEqual(a, b);
  assert.notEqual(a.van.cung, c.van.cung);
  assert.notEqual(AI.khoaVan(ls, a.van.cung), AI.khoaVan(ls, c.van.cung));
});

test('Ba chuyên đề cũ không đổi: Mệnh vẫn có nhận định', async () => {
  const ls = lapLaSo(CASES[0].input);
  const bai = await AI.sinhLuanGiai(ls, 'menh', { boQuaCache: true });
  assert.ok(bai.muc.flatMap((m) => m.nhanDinh).length >= 5);
  assert.equal(bai.van, undefined);
});

// Nhóm VAN-SP (sao phụ ở vận, T-3d77b2): điều kiện máy đọc từ docs/nghien-cuu/luan-giai/dai-van.md mục 3.
test('VAN-SP: có ≥ 20 quy tắc, id VAN-SP-, mục hợp lệ, mã nghiên cứu có thật trong tài liệu', () => {
  const sp = QV.filter((q) => q.id.startsWith('VAN-SP-'));
  assert.ok(sp.length >= 20, `chỉ có ${sp.length}`);
  const md = fs.readFileSync(path.join(__dirname, '../docs/nghien-cuu/luan-giai/dai-van.md'), 'utf8');
  const hopLe = new Set(['thuan-loi', 'chu-y', 'xung-quanh', 'goi-y']);
  for (const q of sp) {
    assert.ok(hopLe.has(q.muc), `${q.id} mục ${q.muc}`);
    assert.ok(q.dieuKien.length, `${q.id} phải có điều kiện`);
    for (const m of q.maNghienCuu) assert.ok(md.includes(`[${m}]`), `${q.id}: ${m} không có trong tài liệu`);
  }
});

test('Mục chuyên đề van-10-nam theo cấu trúc DV: chu-de, thuan-loi, chu-y, xung-quanh, goi-y', () => {
  const cd = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/luan-giai/ai/chuyen-de.json'), 'utf8'))['van-10-nam'];
  assert.deepEqual(cd.muc.map((m) => m.id), ['chu-de', 'thuan-loi', 'chu-y', 'xung-quanh', 'goi-y']);
  for (const q of QV) assert.ok(cd.muc.some((m) => m.id === q.muc), `${q.id} mục ${q.muc} không tồn tại`);
});

test('10 mẫu: mỗi bài có ≥ 1 nhận định ở mục thuan-loi; sao VAN-SP nằm đúng cung tam phương của vận', async () => {
  for (const [i, tc] of CASES.entries()) {
    const ls = lapLaSo(tc.input);
    const bai = await AI.sinhLuanGiai(ls, 'van-10-nam', { boQuaCache: true, namXem: NAM_XEM });
    const tl = bai.muc.find((m) => m.id === 'thuan-loi');
    assert.ok(tl && tl.nhanDinh.length >= 1, `DV${i + 1} thiếu mục thuận lợi`);
    const goc = ls.cung.find((c) => c.ten === bai.van.cung);
    const tp = [0, 6, 4, 8].map((d) => ls.cung.find((c) => c.chi === (goc.chi + d) % 12));
    for (const d of bai.muc.flatMap((m) => m.nhanDinh).filter((x) => x.thamChieu.quyTacId.startsWith('VAN-SP-'))) {
      const co = tp.flatMap((c) => [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh]);
      for (const s of d.thamChieu.sao) assert.ok(co.some((x) => x.ten === s), `DV${i + 1} ${d.thamChieu.quyTacId}: ${s} không ở tam phương vận`);
    }
  }
});

test('Độ dài bài sinh ≥ 80% bản Hạnh (DV01–DV10), trung bình ≥ 85%', async () => {
  const tl = [];
  for (const [i, tc] of CASES.entries()) {
    const ma = 'DV' + String(i + 1).padStart(2, '0');
    const md = fs.readFileSync(path.join(__dirname, `../docs/luan-giai/dai-van/${ma}.md`), 'utf8').replace(/<!--.*?-->/g, '');
    const bai = await AI.sinhLuanGiai(lapLaSo(tc.input), 'van-10-nam', { boQuaCache: true, namXem: NAM_XEM });
    const len = bai.muc.flatMap((m) => m.nhanDinh).map((n) => n.text).join(' ').length;
    tl.push(len / md.length);
    assert.ok(len / md.length >= 0.8, `${ma}: ${(len / md.length * 100).toFixed(0)}%`);
  }
  assert.ok(tl.reduce((a, b) => a + b, 0) / tl.length >= 0.85, 'trung bình < 85%');
});

// Nhân hòa (VAN-PP-12/14/15): chính tinh vận cùng nhóm hay khác nhóm chính tinh Mệnh (tính độc lập trong test).
const NHOM = {
  A: ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng'],
  B: ['Thất Sát', 'Phá Quân', 'Liêm Trinh', 'Tham Lang'],
  C: ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương', 'Cự Môn', 'Thái Dương'],
};
// Sao chủ của cung = chính tinh sáng nhất (bằng nhau thì sao đứng trước); Mệnh/vận vô chính diệu mượn chính tinh cung xung (L-eabb8d).
const THU_TU = ['Miếu', 'Vượng', 'Đắc', 'Bình', 'Hãm'];
const nhomChu = (ls, c) => {
  const nguon = c.chinhTinh.length ? c : ls.cung.find((x) => x.chi === (c.chi + 6) % 12);
  const chu = [...nguon.chinhTinh].sort((a, b) => THU_TU.indexOf(a.dacTinhTen) - THU_TU.indexOf(b.dacTinhTen))[0];
  return chu ? { nhom: Object.keys(NHOM).find((k) => NHOM[k].includes(chu.ten)), sang: chu.dacTinhTen } : null;
};
test('Nhân hòa VAN-PP: khớp theo nhóm của sao chủ Mệnh và sao chủ vận (mượn cung xung nếu vô chính diệu); cùng nhóm mà sao vận hãm thì không khen', async () => {
  let dem = 0;
  for (const [i, tc] of CASES.entries()) {
    const ls = lapLaSo(tc.input);
    const bai = await AI.sinhLuanGiai(ls, 'van-10-nam', { boQuaCache: true, namXem: NAM_XEM });
    const van = ls.cung.find((c) => c.ten === bai.van.cung);
    const nm = nhomChu(ls, ls.cung.find((c) => c.ten === 'Mệnh'));
    const nv = nhomChu(ls, van);
    const co = bai.muc.flatMap((m) => m.nhanDinh).filter((x) => /^VAN-PP-1[245]-/.test(x.thamChieu.quyTacId));
    const mong = nm && nv && !(nm.nhom === nv.nhom && nv.sang === 'Hãm') ? 1 : 0;
    assert.equal(co.length, mong, `DV${i + 1}: Mệnh ${nm?.nhom} vận ${nv?.nhom} (${nv?.sang})`);
    if (co.length) { dem++; assert.ok(co[0].thamChieu.cungLienQuan.includes('Mệnh')); }
  }
  assert.ok(dem >= 4, `chỉ ${dem}/10 mẫu có nhân hòa`);
});

// ── 4 chỉ số chống quay lại lỗi Vận 10 năm (phiếu Thư, việc L-eabb8d mục 4) ─────────────────────────────────────────
// Đo ĐỘC LẬP với tests/luan-giai-van-dieu-kien.test.cjs: dựa trên CHỮ trong bài (không dựa mã quy tắc), tam phương tự tính từ chi,
// chủ tinh vận tự định nghĩa (vận "hãm" khi mọi chính tinh nguồn đều Hãm). 200 lá số = DV01–DV10 + 190 ngẫu nhiên 1965–2009.
const CHI200 = [...CASES.map((c) => c.input)];
{
  let s = 20261030;
  const r = (n) => { s = (s * 1103515245 + 12345) % 2147483648; return (s >>> 8) % n; };
  for (let i = 0; i < 190; i++) CHI200.push({ ...CHI200[0], nam: 1965 + r(45), thang: 1 + r(12), ngay: 1 + r(28), gio: r(24), gioiTinh: r(2) ? 'nam' : 'nu', phut: 0 });
}
const sao4 = (c) => [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh];
const CAP_SAO = ['Văn Xương', 'Văn Khúc', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp', 'Đại Hao', 'Tiểu Hao', 'Thiên Khốc', 'Thiên Hư'];
const SANG_T = ['Miếu', 'Vượng', 'Đắc'];
let do200;
async function đo200() {
  if (do200) return do200;
  const kq = { n: 0, saoLac: [], mauThuan: [], pqHam: [], nhanHoaHam: [], coNhanHoa: 0 };
  for (const [i, inp] of CHI200.entries()) {
    const ls = lapLaSo(inp);
    const bai = await AI.sinhLuanGiai(ls, 'van-10-nam', { boQuaCache: true, namXem: NAM_XEM });
    if (!bai.van) continue;
    kq.n++;
    const nhan = `#${i} ${JSON.stringify({ n: inp.nam, t: inp.thang, d: inp.ngay, g: inp.gio, gt: inp.gioiTinh })}`;
    const van = ls.cung.find((c) => c.ten === bai.van.cung);
    const tp = [0, 4, 6, 8].map((o) => ls.cung.find((c) => c.chi === (van.chi + o) % 12));
    const saoTP = tp.flatMap(sao4);
    const tenTP = new Set(saoTP.map((x) => x.ten));
    const cau = bai.muc.flatMap((m) => m.nhanDinh).map((d) => ({ id: d.thamChieu.quyTacId, t: d.text }));
    const cauSao = cau.filter((c) => /^VAN-SP-/.test(c.id));
    // (1) mọi tên sao phụ/hung/cát có trong lá số mà bài nêu trong câu VAN-SP- phải nằm trong tam phương vận
    const moiSao = [...new Set(ls.cung.flatMap((c) => [...c.catTinh, ...c.hungTinh, ...c.phuTinh]).map((x) => x.ten))];
    // sao thế vào mẫu câu (cặp Xương Khúc, Hỏa Linh, Không Kiếp, Hao, Khốc Hư) mà câu không phải liệt kê phương án ("hoặc", "cùng"):
    // mọi sao thuộc các cặp ấy được nêu phải có mặt trong tam phương. Câu liệt kê phương án có sao thuộc cặp: cần ≥ 1 sao nêu có mặt.
    // (Câu cố định kiểu "Hồng Loan, Đào Hoa, Thiên Hỷ cùng các sao đi kèm" nêu tên cả khi chỉ Long Trì/Phượng Các có mặt: ngoài phạm vi phiếu, báo riêng.)
    for (const c of cauSao) {
      const nua = moiSao.filter((ten) => c.t.includes(ten));
      const lac = nua.filter((ten) => !tenTP.has(ten));
      const lietKe = /hoặc|cùng/.test(c.t);
      const loi = lietKe ? nua.some((t) => CAP_SAO.includes(t)) && lac.length === nua.length : lac.some((t) => CAP_SAO.includes(t));
      if (loi) kq.saoLac.push(`${nhan}: ${lac.join(',')} ngoài tam phương — ${c.t.slice(0, 60)}`);
    }
    // (2) hai câu cùng nhắc một tên sao, một câu nói sáng/đắc địa, một câu nói hãm
    const dsSang = cauSao.filter((c) => /(sáng|đắc địa) ở thế/.test(c.t));
    const dsHam = cauSao.filter((c) => /hãm (ở|trong) /.test(c.t));
    for (const a of dsSang) for (const b of dsHam) {
      const chung = moiSao.filter((t) => a.t.includes(t) && b.t.includes(t));
      if (chung.length) kq.mauThuan.push(`${nhan}: ${chung.join(',')}`);
    }
    // câu "sáng" thì ít nhất một sao nêu phải không hãm; câu "hãm" thì ít nhất một sao nêu phải hãm (đối chiếu độ sáng thật)
    for (const c of cauSao) {
      const dung = saoTP.filter((x) => c.t.includes(x.ten));
      if (!dung.length) continue;
      if (/(sáng|đắc địa) ở thế/.test(c.t) && dung.every((x) => x.dacTinhTen === 'Hãm')) kq.mauThuan.push(`${nhan}: câu sáng nhưng sao hãm — ${c.t.slice(0, 50)}`);
      if (/hãm (ở|trong) /.test(c.t) && dung.every((x) => SANG_T.includes(x.dacTinhTen))) kq.mauThuan.push(`${nhan}: câu hãm nhưng sao sáng — ${c.t.slice(0, 50)}`);
    }
    // (3) câu "Địa Không/Địa Kiếp gặp Phá Quân ... thế ngoại lệ" (khen) chỉ khi Phá Quân trong tam phương không hãm
    const pq = saoTP.filter((x) => x.ten === 'Phá Quân');
    if (cau.some((c) => /gặp Phá Quân/.test(c.t) && /ngoại lệ/.test(c.t)) && !(pq.length && pq.every((x) => SANG_T.includes(x.dacTinhTen)))) kq.pqHam.push(nhan);
    // (4) câu nhân hòa (khen) khi mọi chính tinh nguồn của vận đều Hãm; nguồn = cung vận, trống thì cung xung
    const nguon = van.chinhTinh.length ? van : tp[2];
    const nhanHoa = cau.filter((c) => /\(nhân hòa\)/.test(c.t));
    if (nhanHoa.length && nguon.chinhTinh.length && nguon.chinhTinh.every((x) => x.dacTinhTen === 'Hãm')) kq.nhanHoaHam.push(nhan);
    // phủ nhân hòa: bài có câu so khí chất Mệnh gốc với môi trường vận (cùng nhóm hoặc khác nhóm)
    if (cau.some((c) => /\(nhân hòa\)|Mệnh gốc thuộc nhóm/.test(c.t))) kq.coNhanHoa++;
  }
  return (do200 = kq);
}
test('Vận 10 năm (200 lá số): đo đủ ≥ 195 bài có vận', async (t) => {
  const k = await đo200();
  t.diagnostic(`n=${k.n} saoLac=${k.saoLac.length} mauThuan=${k.mauThuan.length} pqHam=${k.pqHam.length} nhanHoaHam=${k.nhanHoaHam.length} coNhanHoa=${k.coNhanHoa}`);
  assert.ok((await đo200()).n >= 195, `chỉ ${(await đo200()).n}/200`);
});
test('Vận 10 năm (200 lá số) chỉ số 1: bài nêu sao không có trong tam phương = 0', async () => {
  assert.deepEqual((await đo200()).saoLac, []);
});
test('Vận 10 năm (200 lá số) chỉ số 2: bài mâu thuẫn sáng/hãm = 0', async () => {
  assert.deepEqual((await đo200()).mauThuan, []);
});
test('Vận 10 năm (200 lá số) chỉ số 3: Phá Quân hãm mà câu Không/Kiếp gặp Phá Quân khen = 0', async () => {
  assert.deepEqual((await đo200()).pqHam, []);
});
test('Vận 10 năm (200 lá số) chỉ số 4: nhân hòa khen khi chính tinh của vận hãm = 0', async () => {
  assert.deepEqual((await đo200()).nhanHoaHam, []);
});
test('Vận 10 năm (200 lá số) chỉ số 5: tỉ lệ bài có câu nhân hòa ≥ 85%', async () => {
  const k = await đo200();
  assert.ok(k.coNhanHoa / k.n >= 0.85, `${k.coNhanHoa}/${k.n} = ${((100 * k.coNhanHoa) / k.n).toFixed(1)}%`);
});
