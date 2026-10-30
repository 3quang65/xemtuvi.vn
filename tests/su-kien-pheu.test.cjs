// Kiểm thử đo lường phễu: kiểm tra sự kiện gửi lên và tính tỉ lệ từ file JSONL.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { kiemTraSuKien, TEN_SU_KIEN, trangCua } = require('../src/lib/su-kien.js');
const { tinhPheu, docThuMuc } = require('../tools/pheu.cjs');

test('Sự kiện hợp lệ: đủ 9 tên, phiên 16–32 ký tự', () => {
  assert.equal(TEN_SU_KIEN.length, 9);
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

test('Màn hình của từng sự kiện: đúng 4 màn', () => {
  assert.equal(new Set(TEN_SU_KIEN.map(trangCua)).size, 4);
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

test('Không có dữ liệu: không chia cho 0', () => {
  const p = tinhPheu([]);
  assert.equal(p.tiLe.lapTrenVao, null);
  assert.equal(p.soManTrungBinh, null);
});

test('Đọc thư mục: bỏ dòng hỏng, gộp nhiều file', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'pheu-'));
  fs.writeFileSync(path.join(d, '2026-10-30.jsonl'), JSON.stringify(dong('A', 'vao_form')) + '\nrác\n');
  fs.writeFileSync(path.join(d, '2026-10-31.jsonl'), JSON.stringify(dong('B', 'vao_form')) + '\n');
  assert.equal(docThuMuc(d).length, 2);
  assert.deepEqual(docThuMuc(path.join(d, 'khong-co')), []);
});
