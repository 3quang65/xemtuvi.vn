// L-28bc46 phần 3 và 4: vô chính diệu nêu tên chính tinh được mượn, Tuần/Triệt chỉ nhắc khi cung có (cả cung chính);
// DH-Tuần-Ky / DH-Triệt-Ky chỉ áp khi Hóa Kỵ nằm cùng cung bị Tuần/Triệt.
const test = require('node:test');
const assert = require('node:assert/strict');
require('./_nap-ts.cjs');
const { lapLaSo } = require('../src/lib/tuvi/index.ts');
const AI = require('../src/lib/luan-giai/ai/index.ts');
const TC = require('../docs/nghien-cuu/tuvi-test-cases.json').cases;

const CUNG_CHINH = { menh: 'Mệnh', 'quan-loc': 'Quan Lộc', 'phu-the': 'Phu Thê' };
const CD = Object.keys(CUNG_CHINH);
const doi = (ls, c) => ls.cung.find((x) => x.chi === (c.chi + 6) % 12);
const nd = (bai) => bai.muc.flatMap((m) => m.nhanDinh);
function laSoNgauNhien(i) {
  return lapLaSo({ lich: 'duong', muiGio: 'UTC+7 (giờ địa phương Việt Nam)', ngay: 1 + ((i * 11) % 28), thang: 1 + ((i * 5) % 12), nam: 1940 + ((i * 7) % 70), gio: (i * 3) % 24, phut: 10, gioiTinh: i % 2 ? 'nam' : 'nu' });
}

test('vô chính diệu (cung chính và cung hợp chiếu): câu nêu tên chính tinh cung đối diện, không còn biến thừa', async () => {
  let dem = 0, chinh = 0;
  for (let i = 0; i < 120; i++) {
    const ls = laSoNgauNhien(i);
    for (const cd of CD) {
      const bai = await AI.sinhLuanGiai(ls, cd, { boQuaCache: true });
      for (const d of nd(bai)) {
        assert.ok(!/[{}]/.test(d.text), `biến chưa điền: ${d.text}`);
        if (!/^KHUNG-[a-z-]+-VCD-/.test(d.thamChieu.quyTacId)) continue;
        dem++;
        const goc = ls.cung.find((c) => c.ten === d.thamChieu.cungLienQuan[0]);
        assert.equal(goc.chinhTinh.length, 0);
        const d2 = doi(ls, goc);
        if (d2.chinhTinh.length) for (const s of d2.chinhTinh) assert.ok(d.text.includes(s.ten), `${d.thamChieu.quyTacId}: thiếu sao mượn ${s.ten} trong: ${d.text}`);
        else assert.ok(d.text.includes('cũng không có chính tinh'), d.text);
        // Tuần/Triệt chỉ được nhắc khi cung có
        assert.equal(/\bcó Tuần\b|\bgặp Tuần\b|nên gặp Tuần/.test(d.text), goc.tuan, `Tuần: ${d.text}`);
        assert.equal(/có Triệt|gặp Triệt|kỵ Triệt/.test(d.text), goc.triet, `Triệt: ${d.text}`);
        if (goc.ten === CUNG_CHINH[cd]) {
          chinh++;
          assert.ok(!bai.muc.some((m) => m.nhanDinh.some((n) => n.thamChieu.quyTacId.endsWith('-VCD'))), 'còn câu VCD chung của bộ cũ');
        }
      }
    }
  }
  assert.ok(dem > 10 && chinh > 0, `dem=${dem} chinh=${chinh}`);
});

test('cung chính vô chính diệu có Triệt (bản 08): nêu sao mượn và Triệt, đúng một câu VCD', async () => {
  const ls = lapLaSo(TC[7].input);
  const bai = await AI.sinhLuanGiai(ls, 'quan-loc', { boQuaCache: true });
  const v = nd(bai).filter((d) => /VCD/.test(d.thamChieu.quyTacId));
  assert.equal(v.length, 1, v.map((x) => x.thamChieu.quyTacId).join());
  assert.match(v[0].text, /Quan Lộc không có chính tinh/);
  assert.match(v[0].text, /Triệt/);
  const d2 = doi(ls, ls.cung.find((c) => c.ten === 'Quan Lộc'));
  for (const s of d2.chinhTinh) assert.ok(v[0].text.includes(s.ten));
});

test('bản 06 và 10: câu vô chính diệu nêu tên sao được mượn', async () => {
  for (const [i, cd] of [[5, 'phu-the'], [9, 'menh']]) {
    const ls = lapLaSo(TC[i % TC.length].input);
    const bai = await AI.sinhLuanGiai(ls, cd, { boQuaCache: true });
    const v = nd(bai).filter((d) => /VCD/.test(d.thamChieu.quyTacId));
    assert.ok(v.length >= 1, `bản ${i + 1} thiếu câu vô chính diệu`);
    for (const d of v) assert.match(d.text, /ở (Thiên Di|Tật Ách|Phu Thê|Quan Lộc|Tài Bạch|Phúc Đức|Mệnh|Phụ Mẫu|Điền Trạch|Nô Bộc|Tử Tức|Huynh Đệ)|cũng không có chính tinh/);
  }
});

test('DH-Tuần-Ky / DH-Triệt-Ky chỉ áp khi Hóa Kỵ cùng cung bị Tuần/Triệt (cung hợp chiếu)', async () => {
  let co = 0, vang = 0;
  for (let i = 0; i < 200; i++) {
    const ls = laSoNgauNhien(i);
    for (const cd of CD) {
      const goc = ls.cung.find((c) => c.ten === CUNG_CHINH[cd]);
      const hop = [6, 4, 8].map((k) => ls.cung.find((c) => c.chi === (goc.chi + k) % 12));
      const kyCung = (khoa) => hop.filter((c) => c[khoa] && [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh].some((s) => s.hoa === 'Hóa Kỵ'));
      const bai = await AI.sinhLuanGiai(ls, cd, { boQuaCache: true });
      const ids = new Set(nd(bai).map((d) => d.thamChieu.quyTacId));
      for (const [khoa, ten] of [['tuan', 'Tuần'], ['triet', 'Triệt']]) {
        const mong = kyCung(khoa).length > 0;
        assert.equal(ids.has(`KHUNG-${cd}-DH-${ten}-Ky`), mong, `lá số ${i} ${cd} ${ten}`);
        if (mong) { co++; const d = nd(bai).find((x) => x.thamChieu.quyTacId === `KHUNG-${cd}-DH-${ten}-Ky`); assert.ok(kyCung(khoa).some((c) => d.text.includes(c.ten)), d.text); } else vang++;
      }
    }
  }
  assert.ok(co > 0 && vang > 0, `co=${co} vang=${vang}`);
});
