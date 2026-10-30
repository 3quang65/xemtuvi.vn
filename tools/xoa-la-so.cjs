#!/usr/bin/env node
// Xóa lá số theo yêu cầu xóa dữ liệu của khách (L-14d05a).
//   node tools/xoa-la-so.cjs --email <e> [--la-so <id>] [--that]
// Mặc định chạy thử: chỉ in số dòng sẽ xóa. --that: làm thật trong MỘT giao dịch.
// Làm: don_hang.la_so_id = NULL (đơn còn); xóa quyen_xem, ma_moi_dung theo lá số (gói thành viên có la_so_id NULL nên còn nguyên);
// xóa luan_giai_luu tính từ lá số (mọi chuyên đề, phiên bản, cung đại vận); xóa la_so.
// Khóa chuyên đề = HMAC(khoaCache|<cung đại vận hoặc rỗng>), riêng Vận năm không có hậu tố. luan_giai_luu chỉ có khoa_cache = HMAC nên không tra ngược được: ta tính lại khóa từ lá số cho mọi (chuyên đề, phiên bản)
// đang có trong bảng, kèm hậu tố "|<cung>" của đại vận. Bản đệm cùng ngày giờ sinh của người khác cũng bị xóa (chỉ là đệm, sinh lại được).
// Nhật ký chỉ ghi mã tài khoản, mã lá số và số dòng: không email, không ngày sinh.
const fs = require('fs'), path = require('path');
const nap = require('../tests/_nap-ts.cjs');

function xoaLaSo(db, k, { email, laSoId, that = false }) {
  const { lapLaSo } = nap('lib/tuvi/index.ts');
  const { khoaCache } = nap('lib/luan-giai/ai/index.ts');
  const { giaiMaJson, khoaTim } = nap('lib/may-chu/ma-hoa.ts');
  const nds = db.prepare('SELECT id FROM nguoi_dung WHERE lower(email)=lower(?)').all(email);
  if (!nds.length) throw new Error('Không có tài khoản với email này.');
  let ls = db.prepare(`SELECT id, nguoi_dung_id, sinh_ma_hoa FROM la_so WHERE nguoi_dung_id IN (${nds.map(() => '?').join(',')}) ORDER BY id`).all(...nds.map((n) => n.id));
  if (laSoId != null) ls = ls.filter((h) => h.id === laSoId);
  if (!ls.length) throw new Error('Không có lá số nào khớp.');
  const ids = ls.map((h) => h.id), cho = ids.map(() => '?').join(',');
  const cap = db.prepare('SELECT DISTINCT chuyen_de, phien_ban FROM luan_giai_luu').all();
  const khoaDem = new Set();
  for (const h of ls) {
    const la = lapLaSo(giaiMaJson(h.sinh_ma_hoa, k)); // sai khóa → ném lỗi, dừng, chưa xóa gì
    const cungs = ['', '|', ...la.cung.map((c) => '|' + c.ten)];
    for (const { chuyen_de, phien_ban } of cap) {
      const goc = khoaCache(la, chuyen_de, phien_ban);
      for (const h2 of cungs) khoaDem.add(khoaTim(goc + h2, k));
    }
  }
  const dsKhoa = [...khoaDem];
  const dem = (sql, ...a) => db.prepare(sql).get(...a).n;
  const nKhoa = dsKhoa.length ? dem(`SELECT COUNT(*) n FROM luan_giai_luu WHERE khoa_cache IN (${dsKhoa.map(() => '?').join(',')})`, ...dsKhoa) : 0;
  const so = {
    la_so: ids.length,
    don_hang_bo_lien_ket: dem(`SELECT COUNT(*) n FROM don_hang WHERE la_so_id IN (${cho})`, ...ids),
    quyen_xem: dem(`SELECT COUNT(*) n FROM quyen_xem WHERE la_so_id IN (${cho})`, ...ids),
    ma_moi_dung: dem(`SELECT COUNT(*) n FROM ma_moi_dung WHERE la_so_id IN (${cho})`, ...ids),
    luan_giai_luu: nKhoa,
  };
  if (that) {
    db.transaction(() => {
      db.prepare(`UPDATE don_hang SET la_so_id=NULL WHERE la_so_id IN (${cho})`).run(...ids);
      db.prepare(`DELETE FROM quyen_xem WHERE la_so_id IN (${cho})`).run(...ids);
      db.prepare(`DELETE FROM ma_moi_dung WHERE la_so_id IN (${cho})`).run(...ids);
      for (let i = 0; i < dsKhoa.length; i += 500) {
        const phan = dsKhoa.slice(i, i + 500);
        db.prepare(`DELETE FROM luan_giai_luu WHERE khoa_cache IN (${phan.map(() => '?').join(',')})`).run(...phan);
      }
      db.prepare(`DELETE FROM la_so WHERE id IN (${cho})`).run(...ids);
    })();
  }
  return { that, nguoiDung: nds.map((n) => n.id), laSo: ids, so };
}

function ghiNhatKy(kq) {
  const dir = process.env.NHAT_KY_DIR || path.join(nap('lib/may-chu/ma-hoa.ts').thuMucDuLieu(), 'nhat-ky');
  fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(path.join(dir, 'xoa-la-so.jsonl'), JSON.stringify({ t: new Date().toISOString(), nguoi_dung: kq.nguoiDung, la_so: kq.laSo, ...kq.so }) + '\n');
}

function main(argv) {
  const lay = (t) => { const i = argv.indexOf(t); return i >= 0 ? argv[i + 1] : undefined; };
  const email = lay('--email'), ls = lay('--la-so');
  if (!email || (argv.includes('--la-so') && !/^\d+$/.test(ls || ''))) { console.error('Dùng: node tools/xoa-la-so.cjs --email <e> [--la-so <id>] [--that]'); return 2; }
  const { moCsdl } = nap('lib/may-chu/csdl.ts');
  const { taoBoKhoa, thuMucDuLieu } = nap('lib/may-chu/ma-hoa.ts');
  const db = moCsdl(process.env.CSDL_TEP || path.join(thuMucDuLieu(), 'csdl', 'xemtuvi.db'));
  try {
    const kq = xoaLaSo(db, taoBoKhoa(), { email, laSoId: ls ? Number(ls) : undefined, that: argv.includes('--that') });
    console.log((kq.that ? 'ĐÃ XÓA' : 'CHẠY THỬ (chưa xóa; thêm --that để xóa thật)') + ': ' + JSON.stringify(kq.so));
    if (kq.that) ghiNhatKy(kq);
    return 0;
  } catch (e) { console.error('Lỗi: ' + e.message); return 1; } finally { db.close(); }
}

module.exports = { xoaLaSo };
if (require.main === module) process.exit(main(process.argv.slice(2)));
