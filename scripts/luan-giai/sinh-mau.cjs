// Sinh N bản luận giải mẫu (stub, không mạng) ra docs/luan-giai/<thư mục>/ để kiểm duyệt.
// Dùng: node scripts/luan-giai/sinh-mau.cjs [thu-muc=mau-1] [so-ban=10]
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => {
  m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText, f);
};
const ROOT = path.join(__dirname, '../..');
const { lapLaSo, tomTatLaSo } = require(path.join(ROOT, 'src/lib/tuvi/index.ts'));
const AI = require(path.join(ROOT, 'src/lib/luan-giai/ai/index.ts'));
const TC = require(path.join(ROOT, 'docs/nghien-cuu/tuvi-test-cases.json')).cases;
const CD = ['menh', 'quan-loc', 'phu-the'];
const CUNG = { menh: ['Mệnh', 'Thiên Di', 'Quan Lộc', 'Tài Bạch'], 'quan-loc': ['Quan Lộc', 'Phu Thê', 'Mệnh', 'Tài Bạch'], 'phu-the': ['Phu Thê', 'Quan Lộc', 'Thiên Di', 'Phúc Đức'] };
const out = path.join(ROOT, 'docs/luan-giai', process.argv[2] || 'mau-1');
const n = Number(process.argv[3] || 10);
fs.mkdirSync(out, { recursive: true });
const saoStr = (s) => s.ten + (s.dacTinhTen ? `(${s.dacTinhTen})` : '') + (s.hoa ? `[${s.hoa}]` : '');
(async () => {
  for (let i = 0; i < n; i++) {
    const tc = TC[i % TC.length]; const cd = CD[i % 3];
    const ls = lapLaSo(tc.input);
    const bai = await AI.sinhLuanGiai(ls, cd, { boQuaCache: true });
    const L = [`# Bản ${String(i + 1).padStart(2, '0')} — ${tc.id} × ${cd}`, '', `Đầu vào: \`${JSON.stringify(tc.input)}\``, '', `Tóm tắt: ${tomTatLaSo(ls)}`, '', '## Sao các cung liên quan (để đối chiếu)'];
    for (const ten of CUNG[cd]) {
      const c = ls.cung.find((x) => x.ten === ten);
      if (!c) continue;
      const ds = [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh].map(saoStr).filter((x, j, a) => a.indexOf(x) === j).join(', ');
      L.push(`- **${ten}**${c.chinhTinh.length ? '' : ' (Vô Chính Diệu)'}${c.tuan ? ' [Tuần]' : ''}${c.triet ? ' [Triệt]' : ''}: ${ds}`);
    }
    L.push('', '## Bài luận giải (đúng như khách nhận)');
    for (const m of bai.muc) {
      L.push('', `### ${m.tieuDe}`);
      for (const d of m.nhanDinh) L.push(`- ${d.text}  \n  _↳ ${d.thamChieu.quyTacId} · ${d.thamChieu.cung} · ${d.thamChieu.sao.join('+') || '—'} · ${d.thamChieu.nguon} · ${d.thamChieu.truongPhai}_`);
    }
    L.push('', `> ${bai.ghiChu}`, '');
    fs.writeFileSync(path.join(out, `ban-${String(i + 1).padStart(2, '0')}.md`), L.join('\n'));
  }
  console.log('đã sinh', n, 'bản vào', out);
})();
