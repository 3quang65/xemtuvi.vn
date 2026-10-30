// Vận năm 2027 trả phí: mỗi đoạn đủ 4 phần (căn cứ, nhận định, nguồn, việc nên làm + cách đo) theo
// docs/luan-giai/khung-doan-tra-phi.md (việc L-7c8b01). Đối chiếu mã bám việc với 12 đoạn mẫu của Hạnh.
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
const VIEC = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/luan-giai/ai/quy-tac-van/viec-nen-lam.json'), 'utf8'));
const DIR = path.join(__dirname, '../docs/luan-giai/van-nam/');
const soChu = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const MA_QUY_TAC = /\b[A-Z]{2,6}(?:-[A-Z0-9]+)+-\d{1,2}\b/;

const DU_LIEU = fs.readFileSync(DIR + 'du-lieu.md', 'utf8').split(/\n(?=## VN)/).slice(1);
const DAU_VAO = DU_LIEU.map((k) => JSON.parse(k.match(/Đầu vào: `(\{.*\})`/)[1]));
// Lá số tuổi Canh (1970, 1980, 1990, 2000, 2010; sinh sau Tết) đủ giới tính và nhiều giờ.
const CANH = [];
for (const nam of [1970, 1980, 1990, 2000, 2010]) for (const [thang, gio, gioiTinh] of [[4, 9, 'nam'], [5, 5, 'nu'], [7, 15, 'nam'], [10, 21, 'nu'], [12, 1, 'nu']]) CANH.push({ lich: 'duong', ngay: 12, thang, nam, gio, phut: 0, gioiTinh });

const tatCaDoan = (bai) => bai.muc.flatMap((m) => m.nhanDinh);
const doanDu = (bai) => tatCaDoan(bai).filter((n) => !n.cauDan);

test('danh mục việc nên làm: 33 mẫu, đủ trường, mỗi việc ≤ 45 chữ, có thước đo, không lời khuyên ép mua', () => {
  assert.equal(VIEC.length, 33);
  assert.equal(new Set(VIEC.map((v) => v.maMau)).size, 33);
  for (const v of VIEC) {
    assert.ok(v.chuDe && v.maHuong.length && v.cau && v.thuocDo && v.thoiHanThang >= 1 && v.thoiHanThang <= 3, v.maMau);
    assert.ok(soChu(v.cau) <= 45, `${v.maMau} dài ${soChu(v.cau)} chữ`);
    assert.ok(!/mua gói|xem thêm luận giải/i.test(v.cau), v.maMau);
  }
});

for (const [i, inp] of DAU_VAO.entries()) {
  test(`VN0${i + 1}: mọi đoạn trong bài có đủ 4 phần, qua từ cấm, đúng giới hạn độ dài, mã việc không lộ`, async (t) => {
    const ls = lapLaSo(inp);
    const bai = await VN.sinhVanNam(ls, { boQuaCache: true });
    const ds = doanDu(bai);
    assert.ok(ds.length >= 3, `quá ít đoạn đủ 4 phần: ${ds.length}`);
    t.diagnostic(`VN0${i + 1}: ${ds.length} đoạn đủ 4 phần, ${tatCaDoan(bai).length - ds.length} câu dẫn`);
    const daDung = new Set();
    for (const n of ds) {
      const ma = n.thamChieu.quyTacId;
      assert.ok(n.canCu && n.canCu.length > 10, `${ma}: thiếu căn cứ`);
      assert.ok(soChu(n.canCu) <= 35, `${ma}: căn cứ dài ${soChu(n.canCu)} chữ`);
      assert.ok(n.canCu.includes(n.thamChieu.cung === 'Lưu Thái Tuế' ? '' : n.thamChieu.cung), `${ma}: căn cứ không nêu cung`);
      assert.ok(/\((?:Tý|Sửu|Dần|Mão|Thìn|Tỵ|Ngọ|Mùi|Thân|Dậu|Tuất|Hợi)\)/.test(n.canCu), `${ma}: căn cứ thiếu địa chi`);
      for (const s of n.thamChieu.sao.slice(0, 3)) assert.ok(n.canCu.includes(s.replace(/^L\. /, '')), `${ma}: căn cứ thiếu sao ${s}`);
      assert.ok(soChu(n.text) <= 110, `${ma}: nhận định dài ${soChu(n.text)} chữ`);
      assert.ok(n.nguon && soChu(n.nguon) <= 25, `${ma}: nguồn thiếu/dài (${n.nguon})`);
      const v = n.viecNenLam;
      assert.ok(v, `${ma}: thiếu việc nên làm`);
      assert.ok(v.cau && v.thuocDo && v.thoiHanThang >= 1 && v.thoiHanThang <= 3 && v.maMau && v.maHuong, `${ma}: việc thiếu trường`);
      assert.ok(soChu(v.cau) <= 45, `${ma}: việc dài ${soChu(v.cau)} chữ`);
      assert.ok(!/[{}]/.test(v.cau + v.thuocDo), `${ma}: còn biến chưa điền`);
      assert.ok(!daDung.has(v.maMau), `${v.maMau} xuất hiện hai lần trong một bài`);
      daDung.add(v.maMau);
      // mã bám phải nằm trong mã nghiên cứu của đoạn (hoặc chính mã đoạn)
      const tap = new Set([...n.thamChieu.maNghienCuu, n.thamChieu.quyTacId]);
      assert.ok(tap.has(v.maHuong.split('/')[0]), `${ma}: mã bám ${v.maHuong} không thuộc đoạn`);
      // chuỗi khách thấy không chứa mã quy tắc/mã mẫu/điều kiện
      const khach = [n.text, n.canCu, n.nguon, n.ghiChuTruongPhai ?? '', v.cau, v.thuocDo].join('\n');
      assert.ok(!MA_QUY_TAC.test(khach), `${ma}: lộ mã quy tắc trong chuỗi khách thấy`);
      assert.ok(!/\b(?:CV|TC|TT|SK|HT|GD)-0\d\b/.test(khach), `${ma}: lộ mã mẫu việc`);
    }
    // toàn bộ đoạn không phải câu dẫn đều có đủ (a) và (d): đoạn thiếu đã bị loại, không còn đoạn nửa vời
    for (const n of tatCaDoan(bai)) assert.ok(n.cauDan || (n.canCu && n.viecNenLam), `${n.thamChieu.quyTacId}: đoạn nửa vời`);
    assert.equal(bai.phienBan, VN.PHIEN_BAN_VAN_NAM);
  });
}

test('lá số tuổi Canh: không còn chuỗi "Trung Châu" trong JSON bài khách thấy', async () => {
  for (const inp of [DAU_VAO[1], ...CANH]) {
    const ls = lapLaSo(inp);
    assert.match(ls.canChi.nam, /^Canh /);
    const bai = await VN.sinhVanNam(ls, { boQuaCache: true });
    // Nguồn gốc nội bộ (thamChieu.nguon) của đoạn dẫn Phúc Đức vẫn ghi sách Trung Châu (NAM-TT/TH-01-PHUC): đúng nguồn của câu đó,
    // không phải câu Tứ hóa tuổi Canh. Mọi chuỗi còn lại trong bài (nhận định, căn cứ, nguồn hiển thị, ghi chú, việc) phải sạch.
    const json = JSON.stringify(bai, (k, v) => (k === 'nguon' && typeof v === 'string' && v.includes('; ') ? undefined : v));
    assert.ok(!/Trung\s*Châu/i.test(json), `${JSON.stringify(inp)} còn "Trung Châu"`);
    for (const n of tatCaDoan(bai)) if (/Trung\s*Châu/.test(n.thamChieu.nguon)) assert.match(n.thamChieu.quyTacId, /^NAM-(TT|TH)-01-PHUC$/, 'chỉ đoạn dẫn Phúc Đức được ghi nguồn Trung Châu');
    assert.ok(doanDu(bai).length >= 2, 'bài Canh quá ít đoạn đủ 4 phần');
  }
});

test('danh sách chờ: đoạn thiếu (a) hoặc (d) không có trong bài trả phí, nằm trong doanChoVanNam', async () => {
  const ls = lapLaSo(DAU_VAO[0]);
  const cho = await VN.doanChoVanNam(ls);
  const bai = await VN.sinhVanNam(ls, { boQuaCache: true });
  assert.ok(cho.length > 0, 'bảng 6.1 chỉ 33 mẫu nên phải có đoạn chờ');
  for (const n of doanDu(bai)) assert.ok(n.viecNenLam && n.canCu);
  assert.ok(Array.isArray(cho));
  for (const c of cho) assert.ok(c.quyTacId && c.cung && c.lyDo, JSON.stringify(c));
});

test('đối chiếu mã bám việc với 12 đoạn mẫu (mau-khung-4-phan.md): liệt kê lệch, không ép', async (t) => {
  const mau = fs.readFileSync(DIR + 'mau-khung-4-phan.md', 'utf8');
  const bai3 = await Promise.all(DAU_VAO.map((d) => VN.sinhVanNam(lapLaSo(d), { boQuaCache: true })));
  const khoiBai = mau.split(/\n(?=## Bài VN)/).slice(1);
  const dong = [];
  khoiBai.forEach((khoi, bi) => {
    const doans = khoi.split(/\n(?=### Đoạn )/).slice(1);
    for (const dn of doans) {
      const so = dn.match(/^### Đoạn (\d+)/)[1];
      const qt = dn.match(/<!-- quy tắc: ([\s\S]*?) -->/);
      if (!qt) continue;
      const viec = qt[1].match(/việc: ([A-Z]{2}-\d\d)[^;]*?bám ([A-Z0-9-]+(?:\/[^\s;(]+)?)/);
      if (!viec) { dong.push(`Đ${so} (VN0${bi + 1}): mẫu không có "việc: … bám …" (bảng tháng) — bỏ qua`); continue; }
      const ids = new Set([...qt[1].matchAll(/\b[A-Z]{2,6}(?:-[A-Z0-9]+)+\b/g)].map((m) => m[0]));
      const gan = tatCaDoan(bai3[bi]).filter((n) => ids.has(n.thamChieu.quyTacId) || n.thamChieu.maNghienCuu.some((m) => ids.has(m)));
      const co = gan.filter((n) => n.viecNenLam?.maMau === viec[1]);
      const chon = [...new Set(gan.filter((n) => n.viecNenLam).map((n) => `${n.viecNenLam.maMau} bám ${n.viecNenLam.maHuong} (đoạn ${n.thamChieu.quyTacId})`))];
      dong.push(`Đ${so} (VN0${bi + 1}): mẫu ${viec[1]} bám ${viec[2]} → ${co.length ? 'KHỚP' : 'LỆCH'}${co.length ? '' : '; máy chọn: ' + (chon.join(' | ') || 'không đoạn nào có việc')}`);
    }
  });
  t.diagnostic('\n' + dong.join('\n'));
  if (process.env.DOI_CHIEU_OUT) fs.writeFileSync(process.env.DOI_CHIEU_OUT, dong.join('\n') + '\n');
  assert.ok(dong.length >= 11);
});
