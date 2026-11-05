// L-7214e2: cờ/giá trong goi.ts phải khớp bảng giá công bố (docs/san-pham/bang-gia.md). In "X/Y khớp" (Y = số gói trên bảng giá).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const nap = require('./_nap-ts.cjs');
const g = nap('lib/goi.ts');
const md = fs.readFileSync(path.join(__dirname, '../docs/san-pham/bang-gia.md'), 'utf8');
const tatCa = [...g.goiTheoBang().goi, ...g.goiTheoBang().vanNam];
const tien = (ma) => { const m = new RegExp('`' + ma + '`[^\\n]*?\\*\\*([\\d.]+)đ\\*\\*').exec(md); return m && Number(m[1].replace(/\./g, '')); };
const dong = (ma) => md.split('\n').find((l) => l.includes('`' + ma + '`')) || '';
const ngay = (iso) => g.ngayVN(iso);
const MA_TREN_BANG = ['mot-chu-de', 'tron-la-so', 'thanh-vien-nam', 'van-nam-2027', 'tron-la-so-kem-van-nam', 'goi-doi-valentine'];
const kiem = {
  'mot-chu-de': (c) => !/Tài chính|Gia đạo/.test(c.quyenLoi.join(' ')) && /mở khi qua kiểm duyệt/.test(dong(c.ma)),
  'tron-la-so': (c) => (/ba chủ đề/.test(c.quyenLoi[0]) === !g.CO_TAI_CHINH_GIA_DAO_DA_QUA_THU()) && /NOI_DUNG_TAI_CHINH_GIA_DAO_DA_QUA_THU=1/.test(dong(c.ma)),
  'thanh-vien-nam': (c) => c.an === true && /đang ẩn/.test(dong(c.ma)) && (g.LUU_NGUYET_SAN_SANG || (!/lưu nguyệt/i.test(c.quyenLoi.join(' ')) && /CHƯA công bố/.test(dong(c.ma)))),
  'van-nam-2027': () => /15\/12\/2026/.test(md) && g.MO_BAN_VAN_TU === '2026-12-15',
  'tron-la-so-kem-van-nam': (c) => c.banDen === g.BAN_DEN_GOI_GOP && md.includes(`bán đến hết ${ngay(c.banDen)}`),
  'goi-doi-valentine': (c) => c.banDen === g.BAN_DEN_GOI_DOI && md.includes(`bán đến hết ${ngay(c.banDen)}`) && g.GOI_DOI_CHUA_CAP_QUYEN === /chưa cấp quyền/.test(md),
};
test('mỗi gói trên bảng giá: giá + cờ/trạng thái khớp goi.ts; in X/Y khớp (protects: lệch cờ-bảng giá; fails_when: giá, cờ ẩn/hạn bán/chủ đề đổi mà bảng giá không đổi; no_claim: nội dung luận giải đúng)', () => {
  let khop = 0; const lech = [];
  for (const ma of MA_TREN_BANG) {
    const c = tatCa.find((x) => x.ma === ma);
    const ok = !!c && tien(ma) === c.gia && kiem[ma](c);
    if (ok) khop++; else lech.push(ma);
  }
  console.log(`${khop}/${MA_TREN_BANG.length} khớp` + (lech.length ? ` — lệch: ${lech.join(', ')}` : ''));
  assert.equal(MA_TREN_BANG.length, 6);
  assert.deepEqual(lech, []);
});
