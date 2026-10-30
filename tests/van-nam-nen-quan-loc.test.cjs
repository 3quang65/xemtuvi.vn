// L-5e7bce / L-608305: đoạn nền Quan Lộc của Vận 2027: S5 (sao thứ hai đồng cung), S4 (vô chính diệu mượn sao hãm / Hóa Kỵ), nenVcd, thứ tự nguồn N1.
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { lapLaSo } = nap('lib/tuvi/index.ts');
const VN = nap('lib/luan-giai/ai/van-nam.ts');

const lap = (nam, gioiTinh, thang, gio) => lapLaSo({ lich: 'duong', ngay: 12, thang, nam, gio, phut: 0, gioiTinh });
const nen = async (ls) => (await VN.sinhVanNam(ls, { boQuaCache: true })).muc.find((m) => m.id === 'su-nghiep').nhanDinh.find((d) => d.phan === 'nen');
const quanLoc = (ls) => ls.cung.find((c) => c.ten === 'Quan Lộc');

test('S5: sao thứ hai đồng cung sáng thì nối "cùng cung thêm nét"', async () => {
  const d = await nen(lap(2000, 'nu', 5, 5));
  assert.equal(d.thamChieu.quyTacId, 'QL-S06-TOT');
  assert.match(d.text, /Thiên Tướng cùng cung thêm nét: /);
});

test('S5: sao thứ hai đồng cung hãm thì nối "cùng cung ở thế hãm"', async () => {
  const ls = structuredClone(lap(2000, 'nu', 5, 5));
  const tuong = quanLoc(ls).chinhTinh.find((s) => s.ten === 'Thiên Tướng');
  tuong.dacTinhTen = 'Hãm';
  const d = await nen(ls);
  assert.match(d.text, /Thiên Tướng cùng cung ở thế hãm: /);
  assert.doesNotMatch(d.text, /Thiên Tướng cùng cung thêm nét/);
});

test('S4: vô chính diệu, sao mượn ở thế hãm có câu nhẹ hơn và mã CHUNG-VCD-01', async () => {
  const d = await nen(lap(1990, 'nu', 12, 1));
  assert.equal(d.thamChieu.quyTacId, 'QL-VCD');
  assert.match(d.text, /Thái Dương mượn về ở thế hãm, nên mang theo mặt cần chú ý của sao này, ở mức nhẹ hơn so với khi sao đóng ngay tại Quan Lộc: /);
  assert.ok(d.thamChieu.maNghienCuu.includes('CHUNG-VCD-01'));
});

test('S4: vô chính diệu, sao mượn mang Hóa Kỵ có câu nhẹ hơn và mã QUAN-HOA-03', async () => {
  const d = await nen(lap(1970, 'nu', 5, 5));
  assert.match(d.text, /Thái Âm mang Hóa Kỵ chiếu sang: .*ở mức nhẹ hơn so với khi Hóa Kỵ đóng ngay tại Quan Lộc\./);
  assert.ok(d.thamChieu.maNghienCuu.includes('QUAN-HOA-03'));
});

test('S4: Nhật Nguyệt đồng cung Sửu/Mùi mang Kỵ là ngoại lệ, không có câu Kỵ chiếu sang', async () => {
  const ls = structuredClone(lap(1970, 'nu', 5, 5));
  const doi = ls.cung[(quanLoc(ls).chi + 6) % 12];
  doi.tenChi = 'Sửu';
  doi.chinhTinh = [{ ...doi.chinhTinh[0], ten: 'Thái Dương', hoa: 'Hóa Kỵ' }, { ...doi.chinhTinh[0], ten: 'Thái Âm', hoa: undefined }];
  const d = await nen(ls);
  assert.doesNotMatch(d.text, /mang Hóa Kỵ chiếu sang/);
});

test('nenVcd: Quan Lộc vô chính diệu vẫn có đoạn nền QL-VCD, đủ 4 phần (a) căn cứ', async () => {
  const ls = lap(1970, 'nu', 5, 5);
  assert.equal(quanLoc(ls).chinhTinh.length, 0);
  const d = await nen(ls);
  assert.equal(d.thamChieu.quyTacId, 'QL-VCD');
  assert.match(d.canCu, /^Cung Quan Lộc \(.+\): vô chính diệu/);
});

test('N1: VCD có Triệt/Tuần có CHUNG-VCD-03 và nguồn web đứng ngay sau nguồn đoạn nền; không Tuần/Triệt thì bỏ mã', async () => {
  const co = await nen(lap(1970, 'nu', 5, 5));
  assert.ok(quanLoc(lap(1970, 'nu', 5, 5)).triet || quanLoc(lap(1970, 'nu', 5, 5)).tuan);
  assert.ok(co.thamChieu.maNghienCuu.includes('CHUNG-VCD-03'));
  const ten = co.thamChieu.nguon.split('; ');
  assert.match(ten[1], /^Tư liệu web: WC6/);
  const ls = structuredClone(lap(1970, 'nu', 5, 5));
  quanLoc(ls).tuan = false; quanLoc(ls).triet = false;
  const khong = await nen(ls);
  assert.ok(!khong.thamChieu.maNghienCuu.includes('CHUNG-VCD-03'));
});
