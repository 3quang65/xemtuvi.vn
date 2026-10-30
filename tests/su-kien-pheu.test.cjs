// Kiểm thử đo lường phễu: kiểm tra sự kiện gửi lên và tính tỉ lệ từ file JSONL.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { kiemTraSuKien, TEN_SU_KIEN, trangCua } = require('../src/lib/su-kien.js');
const { tinhPheu, docThuMuc } = require('../tools/pheu.cjs');

test('Sự kiện hợp lệ: đủ 11 tên, phiên 16–32 ký tự', () => {
  assert.equal(TEN_SU_KIEN.length, 11);
  for (const ten of TEN_SU_KIEN) assert.deepEqual(kiemTraSuKien({ ten, phien: 'a1b2c3d4e5f6a7b8' }), { ten, phien: 'a1b2c3d4e5f6a7b8' });
});

test('Từ chối: trường lạ, tên lạ, phiên sai độ dài/ký tự, không phải object', () => {
  const ok = { ten: 'vao_form', phien: 'a1b2c3d4e5f6a7b8' };
  assert.equal(kiemTraSuKien({ ...ok, ngaySinh: '1995-08-15' }), null);
  assert.equal(kiemTraSuKien({ ...ok, ten: 'xoa_het' }), null);
  assert.equal(kiemTraSuKien({ ...ok, phien: 'ngan' }), null);
  assert.equal(kiemTraSuKien({ ...ok, phien: 'a'.repeat(33) }), null);
  assert.equal(kiemTraSuKien({ ...ok, phien: 'a b c d e f g h i j k' }), null);
  assert.equal(kiemTraSuKien({ ten: 'vao_form' }), null);
  for (const x of [null, 'x', 5, [], undefined]) assert.equal(kiemTraSuKien(x), null);
});

test('Màn hình của từng sự kiện: 4 màn mua + trang luận giải (báo lỗi)', () => {
  assert.equal(new Set(TEN_SU_KIEN.map(trangCua)).size, 5);
  assert.equal(trangCua('bao_loi'), 'luan-giai');
  assert.equal(trangCua('thanh_toan_xong'), 'thanh-toan');
});

const dong = (phien, ten) => ({ t: 1, ten, phien, trang: trangCua(ten) });
const DAY = ['vao_form', 'lap_la_so', 'xem_tom_tat', 'bam_xem_sau', 'vao_chon_goi', 'chon_goi', 'vao_thanh_toan', 'dang_nhap', 'thanh_toan_xong'];

test('Tính phễu: số phiên, tỉ lệ, số màn trung bình', () => {
  const ds = [
    ...DAY.map((t) => dong('A', t)),
    ...DAY.slice(0, 4).map((t) => dong('B', t)),
    ...DAY.slice(0, 2).map((t) => dong('C', t)),
    dong('D', 'vao_form'),
    dong('D', 'vao_form'), // lặp trong cùng phiên chỉ tính 1
  ];
  const p = tinhPheu(ds);
  assert.equal(p.phien.vao_form, 4);
  assert.equal(p.phien.lap_la_so, 3);
  assert.equal(p.phien.bam_xem_sau, 2);
  assert.equal(p.phien.thanh_toan_xong, 1);
  assert.equal(p.tiLe.lapTrenVao, 3 / 4);
  assert.equal(p.tiLe.bamTrenLap, 2 / 3);
  assert.equal(p.tiLe.muaTrenBam, 1 / 2);
  assert.equal(p.soManTrungBinh, 4);
});

test('Chỉ số màn chào bán: bấm mua, bỏ thanh toán, khiếu nại; báo lỗi không tính thêm màn', () => {
  const ds = [
    ...DAY.map((t) => dong('A', t)), dong('A', 'bao_loi'),
    ...DAY.slice(0, 7).map((t) => dong('B', t)), // vào thanh toán rồi bỏ
    ...DAY.slice(0, 5).map((t) => dong('C', t)), // xem màn chào bán, không bấm
  ];
  const p = tinhPheu(ds);
  assert.equal(p.tiLe.chonTrenChaoBan, 2 / 3);
  assert.equal(p.tiLe.boThanhToan, 1 / 2);
  assert.equal(p.tiLe.baoLoiTrenDon, 1);
  assert.equal(p.soManTrungBinh, 4);
  assert.deepEqual(kiemTraSuKien({ ten: 'bao_loi', phien: 'a'.repeat(16), goi: 'tron-la-so' }), { ten: 'bao_loi', phien: 'a'.repeat(16), goi: 'tron-la-so' });
});

test('Không có dữ liệu: không chia cho 0', () => {
  const p = tinhPheu([]);
  assert.equal(p.tiLe.lapTrenVao, null);
  assert.equal(p.soManTrungBinh, null);
  assert.equal(p.tiLe.boThanhToan, null);
});

test('Đọc thư mục: bỏ dòng hỏng, gộp nhiều file', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'pheu-'));
  fs.writeFileSync(path.join(d, '2026-10-30.jsonl'), JSON.stringify(dong('A', 'vao_form')) + '\nrác\n');
  fs.writeFileSync(path.join(d, '2026-10-31.jsonl'), JSON.stringify(dong('B', 'vao_form')) + '\n');
  assert.equal(docThuMuc(d).length, 2);
  assert.deepEqual(docThuMuc(path.join(d, 'khong-co')), []);
});

// ---------- Bảng giá: đo lựa chọn từng bậc ----------
const { MA_GOI, MA_CHU_DE } = require('../src/lib/goi-ma.js');
const PH = 'a1b2c3d4e5f6a7b8';

test('Khoá goi/chuDe hợp lệ chỉ cho chon_goi, vao_thanh_toan, thanh_toan_xong', () => {
  assert.deepEqual(MA_GOI, ['mot-chu-de', 'tron-la-so', 'thanh-vien-nam']);
  assert.deepEqual(MA_CHU_DE, ['ban-than', 'tinh-cam', 'su-nghiep', 'tai-chinh', 'gia-dao']);
  for (const ten of ['chon_goi', 'vao_thanh_toan', 'thanh_toan_xong']) {
    for (const goi of MA_GOI) assert.deepEqual(kiemTraSuKien({ ten, phien: PH, goi }), { ten, phien: PH, goi });
    for (const chuDe of MA_CHU_DE) {
      assert.deepEqual(kiemTraSuKien({ ten, phien: PH, goi: 'mot-chu-de', chuDe }), { ten, phien: PH, goi: 'mot-chu-de', chuDe });
    }
  }
});

test('Từ chối goi/chuDe sai: mã lạ, chuDe với gói khác, chuDe không goi, sự kiện khác, giá từ máy khách', () => {
  const ok = { ten: 'chon_goi', phien: PH };
  assert.equal(kiemTraSuKien({ ...ok, goi: 'goi-la' }), null);
  assert.equal(kiemTraSuKien({ ...ok, goi: 5 }), null);
  assert.equal(kiemTraSuKien({ ...ok, goi: 'mot-chu-de', chuDe: 'xay-nha' }), null);
  assert.equal(kiemTraSuKien({ ...ok, goi: 'tron-la-so', chuDe: 'tinh-cam' }), null);
  assert.equal(kiemTraSuKien({ ...ok, goi: 'thanh-vien-nam', chuDe: 'tinh-cam' }), null);
  assert.equal(kiemTraSuKien({ ...ok, chuDe: 'tinh-cam' }), null);
  assert.equal(kiemTraSuKien({ ...ok, goi: 'tron-la-so', gia: 1 }), null);
  for (const ten of ['vao_form', 'lap_la_so', 'xem_tom_tat', 'bam_xem_sau', 'vao_chon_goi', 'dang_nhap']) {
    assert.equal(kiemTraSuKien({ ten, phien: PH, goi: 'tron-la-so' }), null, ten);
  }
});

test('Giá tra từ goi.ts: đúng bảng giá 29k / 99k / 299k', () => {
  const { tra } = require('./_goi-ts.cjs');
  assert.deepEqual(tra(), { 'mot-chu-de': 29000, 'tron-la-so': 99000, 'thanh-vien-nam': 299000 });
});

const dg = (phien, ten, goi, gia, chuDe) => ({ t: 1, ten, phien, trang: trangCua(ten), goi, gia, chuDe });

test('Tỉ lệ từng bậc, đơn trung bình (lần cuối mỗi phiên), gói năm, chủ đề nhiều nhất', () => {
  const ds = [
    // A: đổi ý từ chủ đề sang trọn lá số, mua trọn lá số
    dg('A', 'chon_goi', 'mot-chu-de', undefined, 'tinh-cam'), dg('A', 'chon_goi', 'tron-la-so'),
    dg('A', 'thanh_toan_xong', 'tron-la-so', 99000), dg('A', 'thanh_toan_xong', 'tron-la-so', 99000),
    dg('B', 'chon_goi', 'mot-chu-de', undefined, 'tinh-cam'), dg('B', 'thanh_toan_xong', 'mot-chu-de', 29000, 'tinh-cam'),
    dg('C', 'chon_goi', 'mot-chu-de', undefined, 'su-nghiep'), dg('C', 'thanh_toan_xong', 'mot-chu-de', 29000, 'su-nghiep'),
    dg('D', 'chon_goi', 'thanh-vien-nam'), dg('D', 'thanh_toan_xong', 'thanh-vien-nam', 299000),
    dg('E', 'chon_goi', 'tron-la-so'), // chọn nhưng chưa mua
    dong('F', 'vao_form'),
  ];
  const p = tinhPheu(ds);
  assert.equal(p.bac.soDon, 4);
  assert.deepEqual(p.bac.tiLeTrenDon, { 'mot-chu-de': 2 / 4, 'tron-la-so': 1 / 4, 'thanh-vien-nam': 1 / 4 });
  assert.equal(p.bac.soChon, 5);
  assert.deepEqual(p.bac.tiLeTrenChon, { 'mot-chu-de': 2 / 5, 'tron-la-so': 2 / 5, 'thanh-vien-nam': 1 / 5 });
  assert.equal(p.bac.donTrungBinh, (99000 + 29000 + 29000 + 299000) / 4);
  assert.equal(p.bac.tiLeGoiNam, 1 / 4);
  assert.deepEqual(p.bac.chuDe, { 'tinh-cam': 1, 'su-nghiep': 1 }); // theo lần chọn cuối mỗi phiên
  assert.equal(p.bac.chuDeNhieuNhat, 'tinh-cam');
});

test('Không có đơn: tỉ lệ bậc và đơn TB là null, không chia cho 0', () => {
  const p = tinhPheu([dong('A', 'vao_form')]);
  assert.equal(p.bac.tiLeTrenDon['tron-la-so'], null);
  assert.equal(p.bac.donTrungBinh, null);
  assert.equal(p.bac.tiLeGoiNam, null);
  assert.equal(p.bac.chuDeNhieuNhat, null);
});
