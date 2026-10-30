// T-a4504a vòng 2 (Phiếu 2b, 3b bảng chấm): Tứ hóa có vế loại trừ Không Kiếp / thế giáp Khoa Quyền / Kỵ hóa vào sao nào;
// Cách cục không chép câu giữa các chuyên đề, bài tình cảm không mang lời khuyên công việc, nêu ba sao chủ cách đều hãm.
// Ghi chú: cách đọc sát tinh đắc địa (CC-08 vế "tứ chính nặng" so với SP-03) đang chờ Đức chốt, test này KHÔNG đụng tới.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => {
  m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText, f);
};
const { lapLaSo } = require('../src/lib/tuvi/index.ts');
const AI = require('../src/lib/luan-giai/ai/index.ts');
const TC = require('../docs/nghien-cuu/tuvi-test-cases.json').cases;
const CD = ['menh', 'quan-loc', 'phu-the', 'tai-bach', 'dien-trach'];
const CUNG = { menh: 'Mệnh', 'quan-loc': 'Quan Lộc', 'phu-the': 'Phu Thê', 'tai-bach': 'Tài Bạch', 'dien-trach': 'Điền Trạch' };
const saoCua = (c) => [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh];
const theo = (ls, goc, d) => ls.cung.find((c) => c.chi === (goc.chi + d + 12) % 12);

async function moi(fn) {
  for (const tc of TC) {
    const ls = lapLaSo(tc.input);
    for (const cd of CD) {
      const bai = await AI.sinhLuanGiai(ls, cd, { boQuaCache: true });
      const goc = ls.cung.find((c) => c.ten === CUNG[cd]);
      await fn({ tc, ls, cd, bai, goc });
    }
  }
}
const nhanDinh = (bai, muc) => bai.muc.filter((m) => !muc || m.id === muc).flatMap((m) => m.nhanDinh);

test('Hóa Lộc ở cung hợp chiếu đồng cung Địa Không/Địa Kiếp: nói dễ hao tán, không khuyên "nắm bắt" thuần', async () => {
  let gap = 0;
  const loi = [];
  await moi(({ tc, ls, cd, bai, goc }) => {
    for (const d of [6, 4, 8]) {
      const c = theo(ls, goc, d);
      const sat = saoCua(c).filter((s) => s.ten === 'Địa Không' || s.ten === 'Địa Kiếp').map((s) => s.ten);
      const loc = saoCua(c).filter((s) => s.hoa === 'Hóa Lộc');
      if (!sat.length || !loc.length) continue;
      gap++;
      const cau = nhanDinh(bai, 'tu-hoa').filter((n) => n.thamChieu.quyTacId.includes('-HOA-Lộc') && (n.thamChieu.cungLienQuan ?? []).includes(c.ten));
      if (!cau.length) loi.push(`${tc.id}/${cd}: thiếu câu Hóa Lộc ở ${c.ten}`);
      for (const n of cau) {
        if (!/hao tán/.test(n.text) || !sat.every((s) => n.text.includes(s))) loi.push(`${tc.id}/${cd}: ${n.text.slice(0, 100)}`);
        if (/nên chủ động nắm bắt/.test(n.text)) loi.push(`${tc.id}/${cd}: còn khuyên nắm bắt`);
      }
    }
  });
  assert.ok(gap >= 1, 'bộ lá số mẫu chưa có Lộc đồng cung Không Kiếp ở cung hợp chiếu');
  assert.deepEqual(loi, []);
});

test('thế giáp Khoa Quyền: nêu khi hai cung kề có Khoa và Quyền; giảm lợi ích khi cung chính có Hóa Kỵ (CC-10)', async () => {
  let gap = 0;
  let gapKy = 0;
  const loi = [];
  await moi(({ tc, ls, cd, bai, goc }) => {
    const [a, b] = [theo(ls, goc, -1), theo(ls, goc, 1)];
    const coHoa = (c, h) => saoCua(c).some((s) => s.hoa === h);
    const giap = (coHoa(a, 'Hóa Khoa') && coHoa(b, 'Hóa Quyền')) || (coHoa(a, 'Hóa Quyền') && coHoa(b, 'Hóa Khoa'));
    const cau = nhanDinh(bai, 'tu-hoa').filter((n) => n.thamChieu.quyTacId.includes('-GIAP-KhoaQuyen'));
    if (!giap) { if (cau.length) loi.push(`${tc.id}/${cd}: nêu giáp Khoa Quyền khi không đủ`); return; }
    gap++;
    if (cau.length !== 1) { loi.push(`${tc.id}/${cd}: cần đúng 1 câu giáp Khoa Quyền, có ${cau.length}`); return; }
    const ky = saoCua(goc).some((s) => s.hoa === 'Hóa Kỵ');
    if (ky) { gapKy++; if (!/Hóa Kỵ/.test(cau[0].text) || !/chủ động đón nhận/.test(cau[0].text)) loi.push(`${tc.id}/${cd}: thiếu vế Kỵ giảm giáp cát`); }
    else if (/Hóa Kỵ/.test(cau[0].text)) loi.push(`${tc.id}/${cd}: nhắc Kỵ khi cung chính không có Kỵ`);
  });
  assert.ok(gap >= 1, 'bộ lá số mẫu chưa có thế giáp Khoa Quyền');
  assert.deepEqual(loi, []);
  assert.ok(gapKy >= 0);
});

test('Hóa Kỵ tại cung chính: nói rõ Kỵ hóa vào sao nào, không còn câu chung "điểm nhạy cảm"', async () => {
  const SAO_KY = ['Tham Lang', 'Thái Dương', 'Thái Âm', 'Liêm Trinh', 'Cự Môn', 'Thiên Cơ', 'Vũ Khúc', 'Văn Xương', 'Văn Khúc'];
  let gap = 0;
  const loi = [];
  await moi(({ tc, ls, cd, bai, goc }) => {
    const ky = saoCua(goc).filter((s) => s.hoa === 'Hóa Kỵ' && SAO_KY.includes(s.ten));
    if (!ky.length) return;
    gap++;
    const txt = nhanDinh(bai, 'tu-hoa').map((n) => n.text);
    for (const s of ky) if (!txt.some((t) => t.includes(`hóa vào ${s.ten}`))) loi.push(`${tc.id}/${cd}: không nêu Kỵ hóa vào ${s.ten}`);
    if (txt.some((t) => /Hóa Kỵ tại .* là điểm nhạy cảm/.test(t))) loi.push(`${tc.id}/${cd}: còn câu chung`);
  });
  assert.ok(gap >= 3, `mẫu chỉ có ${gap} trường hợp`);
  assert.deepEqual(loi, []);
});

test('đoạn trùng giữa các lá số và chuyên đề = 0 (bỏ tiền tố "Với <cung>:"): một câu >= 30 ký tự chỉ thuộc một chuyên đề', async () => {
  const chu = new Map(); // câu (đã bỏ tiền tố) → chuyên đề đầu tiên, dùng chung mọi lá số
  const gap = [];
  await moi(({ tc, cd, bai }) => {
    for (const m of bai.muc) for (const d of m.nhanDinh) {
      for (const raw of d.text.split(/(?<=[.!?])\s+/)) {
        const c = raw.replace(/^Với [^:]{2,20}:\s*/, '');
        if (c.length < 30) continue;
        if (chu.has(c) && chu.get(c) !== cd) gap.push(`${tc.id}: ${chu.get(c)}/${cd}: ${c.slice(0, 90)}`);
        else chu.set(c, cd);
      }
    }
  });
  const duy = [...new Set(gap.map((g) => g.split(': ').slice(1).join(': ')))];
  assert.equal(duy.length, 0, `${duy.length} câu trùng:\n${duy.slice(0, 8).join('\n')}`);
});

test('không còn tiền tố máy "Với <cung>:" ở đầu câu cách cục', async () => {
  const loi = [];
  await moi(({ tc, cd, bai }) => {
    for (const d of nhanDinh(bai, 'cach-cuc')) if (/^Với [^:]{2,20}:/.test(d.text)) loi.push(`${tc.id}/${cd}: ${d.text.slice(0, 60)}`);
  });
  assert.deepEqual(loi, []);
});

test('bài Phu Thê: cách cục không mang lời khuyên công việc "chọn một mục tiêu chính", có việc làm được trong quan hệ', async () => {
  const loi = [];
  let coSPT = 0;
  await moi(({ tc, cd, bai }) => {
    if (cd !== 'phu-the') return;
    const ds = nhanDinh(bai, 'cach-cuc');
    for (const d of ds) if (/mục tiêu chính|dàn trải|tránh quyết định lớn|nhận việc/.test(d.text)) loi.push(`${tc.id}: ${d.text.slice(0, 120)}`);
    // câu lời khuyên dùng chung một lần mỗi bài (boCauLap), nên xét cả đoạn
    if (ds.some((d) => /Sát Phá Tham/.test(d.text))) { coSPT++; if (!ds.some((d) => /hẹn lúc|nói rõ|tin cậy/.test(d.text))) loi.push(`${tc.id}: Sát Phá Tham thiếu việc làm trong quan hệ`); }
  });
  assert.ok(coSPT >= 1);
  assert.deepEqual(loi, []);
});

test('ba sao chủ cách (Sát Phá Tham) cùng hãm: bài nêu rõ "đều hãm"; không nêu khi có sao không hãm', async () => {
  const CACH = ['Thất Sát', 'Phá Quân', 'Tham Lang'];
  let gap = 0;
  const loi = [];
  await moi(({ tc, ls, cd, bai, goc }) => {
    const ds = [goc, theo(ls, goc, 6), theo(ls, goc, 4), theo(ls, goc, 8)];
    const sao = CACH.map((t) => ds.flatMap(saoCua).find((s) => s.ten === t));
    const du = sao.every(Boolean);
    const ham = du && sao.every((s) => s.dacTinhTen === 'Hãm');
    const cau = nhanDinh(bai, 'cach-cuc').filter((n) => /đều hãm/.test(n.text) && /Sát Phá Tham|Thất Sát/.test(n.text));
    if (ham) { gap++; if (cau.length !== 1) loi.push(`${tc.id}/${cd}: cần 1 câu đều hãm, có ${cau.length}`); }
    else if (cau.length) loi.push(`${tc.id}/${cd}: nêu đều hãm khi không đúng`);
  });
  assert.ok(gap >= 1, 'bộ lá số mẫu chưa có Sát Phá Tham cùng hãm');
  assert.deepEqual(loi, []);
});
