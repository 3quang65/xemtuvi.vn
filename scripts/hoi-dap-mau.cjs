// Chạy 10 câu mẫu hỏi đáp trên lá số mẫu (15/8/1995 10:30 nữ, dương lịch) và ghi docs/san-pham/hoi-dap-mau.md.
// Dùng: node scripts/hoi-dap-mau.cjs   (CSDL tạm trong bộ nhớ, khóa tạm; không đụng dữ liệu khách, không gọi ngoài)
process.env.MO_GOI_AN = '1';
const fs = require('node:fs');
const path = require('node:path');
const nap = require('../tests/_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const dv = nap('lib/may-chu/dich-vu.ts');
const hd = nap('lib/may-chu/hoi-dap.ts');

const db = moCsdl(':memory:'), k = taoBoKhoa('khoa-tam-chi-dung-cho-hoi-dap-mau-0123456789');
const SINH = { lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 10, phut: 30, gioiTinh: 'nu' };
const nd = dv.dangNhapThu(db, 'mau@example.vn');
const laSo = dv.luuLaSo(db, k, nd, SINH);
const don = dv.taoDon(db, nd, { maGoi: 'thanh-vien-nam', laSoId: laSo });
dv.xacNhanDaTra(db, don.id, 'gia_lap', 'mau-1');

const CAU = [
  ['Bản thân', 'Điểm mạnh và điều cần lưu ý trong tính cách của tôi là gì?'],
  ['Tình cảm', 'Tôi có xu hướng gắn bó thế nào trong tình cảm?'],
  ['Sự nghiệp', 'Công việc nào hợp với cách làm việc của tôi?'],
  ['Tài chính', 'Tôi kiếm và giữ tiền theo kiểu nào?'],
  ['Gia đạo', 'Quan hệ với cha mẹ và nhà cửa của tôi có gì đáng chú ý?'],
  ['Vận 10 năm', 'Giai đoạn 10 năm hiện tại của tôi nổi bật điều gì?'],
  ['Vận năm', 'Năm nay 2027 tôi nên tập trung vào điều gì?'],
  ['Từ chối: ly hôn', 'Vợ chồng tôi sau này có ly hôn không?'],
  ['Từ chối: sức khỏe', 'Tôi sẽ sống được bao lâu và bị bệnh gì?'],
  ['Ngoài phạm vi', 'Hôm nay nên ăn gì?'],
];
(async () => {
  // 7 câu trả lời được > 5 lượt/tháng nên dàn ra hai tháng (giả lập giờ): 4 câu đầu tháng 11, còn lại tháng 12/2026.
  const ra = ['# Hỏi đáp về lá số: 10 câu mẫu', '',
    'Chạy bằng `node scripts/hoi-dap-mau.cjs` (L-2f3742) trên lá số mẫu 15/8/1995 10:30 nữ, tài khoản Thành viên năm giả lập. Mọi câu trả lời ghép từ nhận định có mã quy tắc, không gọi AI/dịch vụ ngoài. Câu từ chối và câu không khớp không trừ lượt.', ''];
  for (const [i, [nhom, cau]] of CAU.entries()) {
    const kq = await hd.hoiLaSo(db, k, nd, laSo, cau, i < 4 ? Date.UTC(2026, 10, 20, 5) : Date.UTC(2026, 11, 5, 5));
    ra.push(`## ${i + 1}. ${nhom}`, '', `**Câu hỏi:** ${cau}`, '', `**Kết quả:** ${kq.ket_qua} (còn ${kq.con_lai}/5 câu)`, '');
    if (kq.ket_qua === 'tra_loi') {
      ra.push(`**Trả lời:** ${kq.tra_loi.doan_dan}`, '');
      for (const n of kq.tra_loi.nhanDinh) ra.push(`- ${n.text} _${n.canCu}_ — mã \`${n.quyTacId}\``);
      ra.push('', `Mã quy tắc: ${kq.tra_loi.nhanDinh.map((n) => '`' + n.quyTacId + '`').join(', ')}`);
    } else {
      ra.push(`**Trả lời:** ${kq.tra_loi.doan_dan}`, '', `Mã quy tắc: \`${kq.tra_loi.ma}\``);
    }
    ra.push('');
  }
  fs.writeFileSync(path.join(__dirname, '../docs/san-pham/hoi-dap-mau.md'), ra.join('\n'));
  console.log('Đã ghi docs/san-pham/hoi-dap-mau.md');
})();
