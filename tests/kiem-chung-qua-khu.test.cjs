// Kiểm chứng năm đã qua (2025, 2026) trước phần khóa của bản xem trước Vận 2027: cờ KIEM_CHUNG_QUA_KHU mặc định tắt,
// A/B theo phiên 50/50, không lộ mã quy tắc / nội dung 2027, kiemTraNamXem chỉ nới cho đường kiểm chứng.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => {
  m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText, f);
};
const { lapLaSo } = require('../src/lib/tuvi/index.ts');
const VN = require('../src/lib/luan-giai/ai/van-nam.ts');
const KC = require('../src/lib/luan-giai/ai/kiem-chung.ts');
const NHOM = require('../src/lib/kiem-chung-nhom.ts');
const SK = require('../src/lib/su-kien.js');
const TU_CAM = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/luan-giai/ai/tu-cam.json'), 'utf8')).tuCam;

const ls = lapLaSo({ lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 10, phut: 30, gioiTinh: 'nu' });
const voiCo = (v, f) => { const cu = process.env.KIEM_CHUNG_QUA_KHU; if (v === undefined) delete process.env.KIEM_CHUNG_QUA_KHU; else process.env.KIEM_CHUNG_QUA_KHU = v; try { return f(); } finally { if (cu === undefined) delete process.env.KIEM_CHUNG_QUA_KHU; else process.env.KIEM_CHUNG_QUA_KHU = cu; } };

test('kiemTraNamXem: năm quá khứ bị chặn ở đường thường, chỉ 2025/2026 được nới cho đường kiểm chứng', () => {
  for (const n of [2024, 2025, 2026, 2028]) assert.throws(() => VN.kiemTraNamXem(n, ls), /chưa có bộ quy tắc/);
  assert.doesNotThrow(() => VN.kiemTraNamXem(2027, ls));
  assert.doesNotThrow(() => VN.kiemTraNamXem(2025, ls, { kiemChung: true }));
  assert.doesNotThrow(() => VN.kiemTraNamXem(2026, ls, { kiemChung: true }));
  for (const n of [2023, 2024, 2027, 2028, 2025.5, NaN]) assert.throws(() => VN.kiemTraNamXem(n, ls, { kiemChung: true }));
  // Các hàm công khai khác vẫn chặn năm quá khứ.
  assert.throws(() => VN.xemTruocVanNam(ls, { namXem: 2025 }), /chưa có bộ quy tắc/);
});

test('kiemChungQuaKhu: 2–3 nhận định cho 2025 và 2026, mỗi câu nêu cung/sao làm căn cứ, không khẳng định sự kiện', () => {
  const kc = KC.kiemChungQuaKhu(ls);
  assert.deepEqual(kc.map((x) => x.nam), [2025, 2026]);
  assert.deepEqual(kc.map((x) => x.canChi), ['Ất Tỵ', 'Bính Ngọ']);
  const cau = kc.flatMap((x) => x.nhanDinh);
  assert.ok(cau.length >= 2 && cau.length <= 3, `số câu ${cau.length}`);
  for (const c of cau) {
    assert.ok(/cung (Mệnh|Phụ Mẫu|Phúc Đức|Điền Trạch|Quan Lộc|Nô Bộc|Thiên Di|Tật Ách|Tài Bạch|Tử Tức|Phu Thê|Huynh Đệ)/.test(c.text), `không nêu cung: ${c.text}`);
    assert.ok(c.canCu.length > 10);
    assert.ok(!/chắc chắn|nhất định|sẽ xảy ra|đã xảy ra|bạn đã (từng )?(mất|gặp|bị)/i.test(c.text), c.text);
  }
  const het = JSON.stringify(kc).toLowerCase();
  for (const t of TU_CAM) assert.ok(!het.includes(t.toLowerCase()), `từ cấm: ${t}`);
  assert.ok(!/mua|giảm giá|chỉ còn|bỏ lỡ|giải hạn/i.test(het));
  assert.equal(new Set(cau.map((c) => c.text)).size, cau.length, 'có câu trùng');
});

test('Cờ tắt (mặc định) thì bản xem trước không có kiemChung; cờ bật có đủ 2025 và 2026', () => {
  voiCo(undefined, () => { assert.equal(KC.kiemChungBat(), false); assert.ok(!('kiemChung' in KC.xemTruocCoKiemChung(ls))); });
  voiCo('0', () => assert.ok(!('kiemChung' in KC.xemTruocCoKiemChung(ls))));
  voiCo('', () => assert.equal(KC.kiemChungBat(), false));
  voiCo('1', () => { const xt = KC.xemTruocCoKiemChung(ls); assert.equal(xt.kiemChung.length, 2); assert.equal(xt.namXem, 2027); });
});

test('Không lộ mã quy tắc, không lộ nội dung 2027 trả phí; phần cũ của bản xem trước không đổi', () => {
  const goc = VN.xemTruocVanNam(ls);
  voiCo('1', () => {
    const xt = KC.xemTruocCoKiemChung(ls);
    const { kiemChung, ...con } = xt;
    assert.deepEqual(con, goc);
    const s = JSON.stringify(kiemChung);
    assert.ok(!/NAM-[A-Z0-9-]+|quyTacId|thamChieu|VAN-CT|2027|Đinh Mùi/.test(s), 'lộ mã quy tắc hoặc 2027');
    // Không chứa nguyên văn bất kỳ câu nào của bài 2027 (đầu bài, thái tuế, điểm thuận, tên cung tháng).
    for (const c of [...goc.dauBai.cau, ...goc.thaiTue, goc.diemThuan].filter(Boolean)) assert.ok(!s.includes(c), `lộ câu 2027: ${c.slice(0, 40)}`);
    // Mã nghiên cứu / quy tắc không nằm ở bất kỳ khóa nào.
    assert.deepEqual(Object.keys(kiemChung[0]).sort(), ['canChi', 'nam', 'nhanDinh']);
    assert.deepEqual(Object.keys(kiemChung[0].nhanDinh[0]).sort(), ['canCu', 'text']);
  });
});

test('Nhóm A/B theo phiên: ổn định, xấp xỉ 50/50, chỉ a hoặc b', () => {
  const ngau = () => Array.from({ length: 24 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
  let a = 0; const N = 4000;
  for (let i = 0; i < N; i++) { const p = ngau(); const g = NHOM.nhomKiemChung(p); assert.ok(g === 'a' || g === 'b'); assert.equal(NHOM.nhomKiemChung(p), g); if (g === 'a') a++; }
  assert.ok(a / N > 0.46 && a / N < 0.54, `tỉ lệ A ${a / N}`);
  assert.equal(NHOM.nhomKiemChung('a1b2c3d4e5f6a7b8c9d0e1f2'), NHOM.nhomKiemChung('a1b2c3d4e5f6a7b8c9d0e1f2'));
});

test('Sự kiện kiem_chung_xem, xem_truoc_mo, bam_mua: nhận nhom_ab a/b, từ chối trường sinh/lạ', () => {
  const phien = 'a1b2c3d4e5f6a7b8c9d0e1f2';
  for (const ten of ['kiem_chung_xem', 'xem_truoc_mo', 'bam_mua']) {
    assert.ok(SK.TEN_SU_KIEN.includes(ten));
    assert.ok(!SK.CHI_MAY_CHU.includes(ten));
    assert.equal(SK.trangCua(ten), 'luan-giai');
    for (const g of ['a', 'b']) assert.deepEqual(SK.kiemTraSuKien({ ten, phien, nhom_ab: g }), { ten, phien, nhom_ab: g });
    assert.equal(SK.kiemTraSuKien({ ten, phien }), null, 'thiếu nhóm');
    assert.equal(SK.kiemTraSuKien({ ten, phien, nhom_ab: 'c' }), null);
    assert.equal(SK.kiemTraSuKien({ ten, phien, nhom_ab: 'a', ngaySinh: '1995-08-15' }), null);
  }
  assert.equal(SK.kiemTraSuKien({ ten: 'vao_form', phien, nhom_ab: 'a' }), null, 'nhom_ab chỉ dành cho ba sự kiện này');
});
