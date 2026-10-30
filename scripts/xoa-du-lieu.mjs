#!/usr/bin/env node
// Xóa dữ liệu của một email theo yêu cầu của khách (cho hỗ trợ): cùng logic với nút "Xóa dữ liệu của tôi".
// Dùng: node scripts/xoa-du-lieu.mjs <email>   (chạy trên VPS, cần KHOA_DU_LIEU như khi chạy site; không in dữ liệu khách)
import { createRequire } from 'node:module';
import path from 'node:path';
const require = createRequire(import.meta.url);
const nap = require('../tests/_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { thuMucDuLieu } = nap('lib/may-chu/ma-hoa.ts');
const dv = nap('lib/may-chu/dich-vu.ts');

const email = (process.argv[2] ?? '').trim().toLowerCase();
if (!email.includes('@')) { console.error('Dùng: node scripts/xoa-du-lieu.mjs <email>'); process.exit(2); }
const db = moCsdl(process.env.CSDL_TEP || path.join(thuMucDuLieu(), 'csdl', 'xemtuvi.db'));
const hang = db.prepare('SELECT id FROM nguoi_dung WHERE email=? OR ma_ngoai=?').all(email, email);
if (!hang.length) {
  // Không có tài khoản vẫn xóa liên hệ / nhận tin ghi riêng theo email.
  const a = db.prepare("DELETE FROM lien_he WHERE loai='email' AND gia_tri=?").run(email).changes;
  const b = db.prepare('DELETE FROM nhan_tin_van_nam WHERE email=?').run(email).changes;
  console.log(`Không có tài khoản với email này. Đã xóa ${a} liên hệ, ${b} đăng ký nhận tin.`);
} else {
  for (const { id } of hang) dv.xoaTaiKhoan(db, id);
  console.log(`Đã xóa ${hang.length} tài khoản và dữ liệu kèm theo (lá số, quyền, phiên, liên hệ; đơn hàng giữ ẩn danh).`);
}
console.log('Lưu ý: bản sao lưu cũ hơn tồn tại tối đa 30 ngày rồi tự xóa.');
