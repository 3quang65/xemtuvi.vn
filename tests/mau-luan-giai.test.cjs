// L-c8e74f: kho mẫu huấn luyện luận giải — lệnh lưu từ chối mẫu sai, đủ trường, mẫu âm có lý do, không lộ dữ liệu khách.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const KHO = fs.mkdtempSync(path.join(os.tmpdir(), 'mau-'));
process.env.MAU_LUAN_GIAI_DIR = KHO;
const L = require('../tools/lib/mau-luan-giai.cjs');
const CLI = path.join(__dirname, '../tools/luu-mau-luan-giai.cjs');
const TEP = path.join(KHO, 'loi-giai.md');
const BAI = '### Tổng quan\n- Tham Lang tại Mệnh: đa tài, nhiều ham muốn học hỏi, giỏi giao tiếp, nên phát huy chủ động và giữ sự chân thành với mọi người.\n  _↳ ML-S09-TOT · Mệnh · Tham Lang · Tân Biên · tam hợp phái Việt_\n';
fs.writeFileSync(TEP, BAI);
const DAU = '{"lich":"duong","ngay":30,"thang":12,"nam":1973,"gio":22,"phut":30,"gioiTinh":"nu"}';
const chay = (...a) => spawnSync('node', [CLI, '--tu', TEP, '--la-so', DAU, '--nguoi-cham', 'thu', '--nguoi-viet', 'hanh', '--nguon', 'hanh', '--chuyen-de', 'menh', '--ngay', '2026-10-31', ...a], { encoding: 'utf8', env: process.env });

test('mẫu đạt ngưỡng → dương, đủ trường, không có tên khách', () => {
  const r = chay('--dung', '9', '--sau', '8', '--giong', '8', '--an-toan', '10');
  assert.equal(r.status, 0, r.stderr);
  const [m] = L.docTatCa();
  assert.equal(m.loai, 'duong');
  assert.equal(m.diem, 8.75);
  assert.deepEqual(m.maQuyTac, ['ML-S09-TOT']);
  assert.equal(m.quyenSoHuu, 'xemtuvi.vn');
  assert.equal(m.laSo.tuoiMu, 54);
  assert.equal(m.laSo.cung.length, 12);
  assert.equal(m.laSo.daiVanHienTai.cung, 'Nô Bộc');
  assert.ok(!('ten' in m.laSo) && !('ten' in m.laSo.dauVao));
  for (const k of ['id', 'ngay', 'tang', 'laSo', 'cauHoi', 'loiGiai', 'maQuyTac', 'tyLeChuMau', 'nguoiViet', 'nguoiBienTap', 'nguoiCham', 'diem', 'diemThu', 'loai', 'phienBanQuyTac', 'phienBanKho', 'nguon', 'nguonGoc', 'quyenSoHuu']) assert.notEqual(m[k], undefined, k);
});
test('lưu lại cùng bài thì bỏ qua (idempotent)', () => {
  const r = chay('--dung', '9', '--sau', '8', '--giong', '8', '--an-toan', '10');
  assert.equal(r.status, 0);
  assert.equal(L.docTatCa().length, 1);
});
test('dưới ngưỡng (Đúng 7) → mẫu âm có lý do, nằm tệp riêng, không nâng điểm', () => {
  fs.writeFileSync(TEP, BAI + 'Câu thêm để khác bài trước, vẫn đủ dài và không có gì cấm trong nội dung này.\n');
  const r = chay('--dung', '7', '--sau', '8', '--giong', '8', '--an-toan', '10');
  assert.equal(r.status, 0, r.stderr);
  assert.ok(fs.existsSync(path.join(KHO, 'am-2026-10.jsonl')));
  const am = L.docTatCa().find((m) => m.loai === 'am');
  assert.match(am.lyDoAm, /dung-duoi-8/);
  assert.equal(am.diem, 8.25);
});
test('từ chối: thiếu điểm, điểm lệch, thiếu người chấm, SĐT, email, từ cấm', () => {
  const truoc = L.docTatCa().length;
  assert.notEqual(chay('--dung', '9', '--sau', '8', '--giong', '8').status, 0);
  assert.notEqual(chay('--dung', '9', '--sau', '8', '--giong', '8', '--an-toan', '10', '--diem', '5').status, 0);
  const khongCham = spawnSync('node', [CLI, '--tu', TEP, '--la-so', DAU, '--dung', '9', '--sau', '9', '--giong', '9', '--an-toan', '10', '--nguon', 'hanh'], { encoding: 'utf8', env: process.env });
  assert.notEqual(khongCham.status, 0);
  for (const them of ['Liên hệ 0912 345 678 để biết thêm chi tiết nhé.', 'Gửi về khach@example.com để được giải đáp thêm nhé.', 'Nên giải hạn bằng cách cúng sao giải hạn vào đầu năm nhé.']) {
    fs.writeFileSync(TEP, BAI + them + '\n');
    const r = chay('--dung', '9', '--sau', '9', '--giong', '9', '--an-toan', '10');
    assert.notEqual(r.status, 0, them);
  }
  assert.equal(L.docTatCa().length, truoc);
});
test('thống kê chạy được trên kho', () => {
  const r = spawnSync('node', [path.join(__dirname, '../tools/thong-ke-mau-luan-giai.cjs'), '--json'], { encoding: 'utf8', env: process.env });
  assert.equal(r.status, 0, r.stderr);
  const k = JSON.parse(r.stdout);
  assert.ok(k.tong >= 2);
  assert.ok(k.duong >= 1);
  assert.equal(k.am, 1);
  assert.ok(k.cungMenhChinhTinh && k.nhomTuoi && k.gioiTinh && k.tuanTriet);
});
test('L-9942a9: từ chối trích dẫn >40 từ; cờ sinh được lưu', () => {
  const dai = Array.from({ length: 45 }, (_, i) => 'chữ' + i).join(' ');
  fs.writeFileSync(TEP, BAI + '> ' + dai + '\n');
  assert.notEqual(chay('--dung', '9', '--sau', '9', '--giong', '9', '--an-toan', '10').status, 0);
  fs.writeFileSync(TEP, BAI + 'Câu kết do mô hình sinh, đủ dài để qua kiểm tra độ dài tối thiểu của bài.\n');
  assert.equal(chay('--dung', '9', '--sau', '9', '--giong', '9', '--an-toan', '10', '--sinh').status, 0);
  assert.ok(L.docTatCa().some((m) => m.sinh === true));
});
