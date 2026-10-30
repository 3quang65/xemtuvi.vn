// Cờ mới của bộ khớp v2 (việc L-eabb8d): doSang cho điều kiện rải, sao chủ, mượn cung xung, tuổi vào vận tối thiểu.
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { khopDieuKien } = nap('lib/luan-giai/ai/khop-v2.ts');

// Bộ khớp: doSang với rai/toiThieu chỉ tính sao có độ sáng đó; chu = sao chủ (chính tinh đầu); muonXung = vô chính diệu mượn cung xung.
const sao = (ten, dacTinhTen) => ({ ten, dacTinhTen });
const cung = (chi, ten, chinhTinh = [], cat = []) => ({ chi, tenChi: 'x', ten, chinhTinh, catTinh: cat, hungTinh: [], phuTinh: [], tuan: false, triet: false });
const laSo = (cs) => ({ cung: cs });
const mau = () => laSo(Array.from({ length: 12 }, (_, i) => cung(i, 'C' + i)));
test('khop-v2: doSang trong điều kiện rải chỉ giữ sao đúng độ sáng và trả đúng tên sao khớp', () => {
  const ls = mau();
  ls.cung[0].catTinh = [sao('Văn Xương', 'Đắc'), sao('Văn Khúc', 'Hãm')];
  const k = { sao: ['Văn Xương', 'Văn Khúc'], toiThieu: 1, viTri: 'tam-phuong', doSang: ['Miếu', 'Vượng', 'Đắc'] };
  assert.deepEqual(khopDieuKien(ls, ls.cung[0], k), ['Văn Xương']);
  assert.deepEqual(khopDieuKien(ls, ls.cung[0], { ...k, doSang: ['Hãm'] }), ['Văn Khúc']);
  ls.cung[0].catTinh = [sao('Văn Khúc', 'Hãm')];
  assert.equal(khopDieuKien(ls, ls.cung[0], k), null);
});
test('khop-v2: chu chỉ xét chính tinh đầu của cung; muonXung lấy cung xung khi vô chính diệu', () => {
  const ls = mau();
  ls.cung[0].chinhTinh = [sao('Tử Vi', 'Miếu'), sao('Thất Sát', 'Miếu')];
  const A = { sao: ['Tử Vi'], toiThieu: 1, viTri: 'chinh', chu: true };
  const B = { sao: ['Thất Sát'], toiThieu: 1, viTri: 'chinh', chu: true };
  assert.deepEqual(khopDieuKien(ls, ls.cung[0], A), ['Tử Vi']);
  assert.equal(khopDieuKien(ls, ls.cung[0], B), null);
  ls.cung[0].chinhTinh = [sao('Tử Vi', 'Bình'), sao('Thất Sát', 'Miếu')];
  assert.deepEqual(khopDieuKien(ls, ls.cung[0], B), ['Thất Sát']);
  assert.equal(khopDieuKien(ls, ls.cung[0], A), null);
  ls.cung[1].chinhTinh = [];
  ls.cung[7].chinhTinh = [sao('Thiên Cơ', 'Đắc')];
  const C = { sao: ['Thiên Cơ'], toiThieu: 1, viTri: 'chinh', chu: true };
  assert.equal(khopDieuKien(ls, ls.cung[1], C), null);
  assert.deepEqual(khopDieuKien(ls, ls.cung[1], { ...C, muonXung: true }), ['Thiên Cơ']);
});
test('khop-v2: tuoiVanTuMin chặn vận có tuổi bắt đầu nhỏ hơn mức', () => {
  const ls = mau();
  ls.cung[0].daiVanTu = 6; ls.cung[1].daiVanTu = 16;
  const k = { tuoiVanTuMin: 16 };
  assert.equal(khopDieuKien(ls, ls.cung[0], k), null);
  assert.deepEqual(khopDieuKien(ls, ls.cung[1], k), []);
});
