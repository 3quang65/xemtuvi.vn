// Kiểm thử màn chào bán: đoạn mẫu đúng lá số khách, một nguồn giá, không từ cấm.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const T = require('../src/lib/tuvi/tuvi-raw.js');
const { chonDoanMau, tachDoanMau, khop } = require('../src/lib/luan-giai/doan-mau.js');
const DM = require('../src/lib/luan-giai/doan-mau.json');

const cungCua = (ls) => ls.cung.map((c) => ({ ten: c.ten, chi: c.chi, tenChi: c.tenChi, chinhTinh: c.chinhTinh.map((s) => s.ten) }));
const cung = (ten, chi, ...sao) => ({ ten, chi, tenChi: '', chinhTinh: sao });

test('Khớp điều kiện: sao đơn đúng chi, cặp sao đúng cả hai, luận chung chỉ cần có sao', () => {
  assert.ok(khop({ sao: ['Thái Âm'], chi: [9, 10, 11] }, cung('Phu Thê', 9, 'Thái Âm')));
  assert.ok(!khop({ sao: ['Thái Âm'], chi: [9, 10, 11] }, cung('Phu Thê', 3, 'Thái Âm')));
  assert.ok(!khop({ sao: ['Thái Âm'], chi: [9] }, cung('Phu Thê', 9, 'Thái Âm', 'Thiên Đồng'))); // đồng cung thì không áp quy tắc sao đơn
  assert.ok(khop({ sao: ['Phá Quân', 'Tử Vi'], chi: [1, 7] }, cung('Phu Thê', 7, 'Tử Vi', 'Phá Quân')));
  assert.ok(khop({ sao: ['Tử Vi'], chi: null, chung: true }, cung('Quan Lộc', 2, 'Tử Vi', 'Thiên Phủ')));
});

test('Ưu tiên luận chung Quan Lộc; Quan Lộc vô chính diệu thì sang Phu Thê', () => {
  const r = chonDoanMau([cung('Quan Lộc', 2, 'Thất Sát'), cung('Phu Thê', 9, 'Thái Âm')]);
  assert.equal(r.ma, 'QUAN-TS-04');
  const r2 = chonDoanMau([cung('Quan Lộc', 2), cung('Phu Thê', 9, 'Thái Âm')]);
  assert.equal(r2.ma, 'PHU-TA-01');
  assert.equal(chonDoanMau([cung('Quan Lộc', 2), cung('Phu Thê', 9)]), null);
});

test('Lá số thật: đoạn mẫu luôn nói về sao có thật trong cung được nêu, có nguồn, tách được phần rõ và mờ', () => {
  let co = 0;
  for (let i = 0; i < 600; i++) {
    const ls = T.anLaSo({ lich: 'duong', ngay: 1 + (i * 7) % 28, thang: 1 + i % 12, nam: 1965 + i % 40, gio: (i * 5) % 24, gioiTinh: i % 2 ? 'nam' : 'nu' });
    const cc = cungCua(ls);
    const r = chonDoanMau(cc);
    if (!r) continue;
    co++;
    const c = cc.find((x) => x.ten === r.cung);
    assert.deepEqual(r.chinhTinh, c.chinhTinh);
    const quyTac = DM[r.cung].find((x) => x.ma === r.ma);
    assert.ok(quyTac.dieuKien.some((d) => khop(d, c)), r.ma);
    assert.ok(r.nguon.length > 0, r.ma);
    const t = tachDoanMau(r.cau);
    assert.ok(t.ro.length >= 15 && t.mo.length > 0, r.ma);
    assert.doesNotMatch(t.ro + t.mo, /\b(TT|TB)\b|đã trung tính hóa|⚑/);
    assert.equal(t.ro[0], t.ro[0].toLocaleUpperCase('vi'), r.ma);
  }
  assert.ok(co / 600 > 0.8, `độ phủ ${co}/600`);
});

const docSrc = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? docSrc(p) : /\.(tsx?|json)$/.test(e.name) ? [p] : [];
});
const SRC = path.join(__dirname, '../src');
// tu-cam.json là danh sách từ bị CẤM (không hiện cho khách) nên phải liệt kê chính các từ đó.
const GIAO_DIEN = docSrc(SRC).filter((f) => !f.includes(`${path.sep}tuvi${path.sep}`) && !f.endsWith('tu-cam.json'));

test('Một nguồn giá: không trang nào ghi số tiền ngoài src/lib/goi.ts', () => {
  for (const f of GIAO_DIEN) {
    if (f.endsWith(path.join('lib', 'goi.ts'))) continue;
    assert.doesNotMatch(fs.readFileSync(f, 'utf8'), /\d{1,3}[.,]000\s*(đ|₫|VND)|\b\d{2,3}k\b/i, path.relative(SRC, f));
  }
});

test('Không từ cấm "hóa giải", "giải hạn" trong giao diện và dữ liệu hiện cho khách', () => {
  for (const f of GIAO_DIEN) assert.doesNotMatch(fs.readFileSync(f, 'utf8').normalize('NFC'), /h[óo]a gi[ảa]i|hoá giải|giải hạn/i, path.relative(SRC, f));
});
