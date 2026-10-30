// Khảo sát 'đáng tiền' (L-74938a): sự kiện, lời (b) 300 ký tự, báo cáo pheu.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { kiemTraSuKien, TEN_SU_KIEN, trangCua } = require('../src/lib/su-kien.js');
const { kiemPhanHoi, luuPhanHoi, TOI_DA } = require('../src/lib/khao-sat.js');
const { tinhKhaoSat, bangKhaoSat, taoGiaLapKhaoSat, tinhPheu } = require('../tools/pheu.cjs');

const P = 'a1b2c3d4e5f6a7b8';
const goc = { phien: P, bai: 'ban-than', goi: 'tron-la-so' };

test('Sự kiện khảo sát hợp lệ giữ đúng trường', () => {
  assert.deepEqual(kiemTraSuKien({ ten: 'hien_khao_sat', ...goc, cach: 'cuoi_bai' }), { ten: 'hien_khao_sat', ...goc, cach: 'cuoi_bai' });
  assert.equal(kiemTraSuKien({ ten: 'hien_khao_sat', ...goc, cach: 'doc_xong' }).cach, 'doc_xong');
  assert.deepEqual(kiemTraSuKien({ ten: 'tra_loi_khao_sat', ...goc, diem_a: 5, diem_c: 3, co_loi_b: true }), { ten: 'tra_loi_khao_sat', ...goc, diem_a: 5, diem_c: 3, co_loi_b: true });
  assert.equal(kiemTraSuKien({ ten: 'tra_loi_khao_sat', ...goc, diem_a: 1, co_loi_b: false }).diem_c, undefined); // (c) để trống
  assert.deepEqual(kiemTraSuKien({ ten: 'bo_qua_khao_sat', ...goc }), { ten: 'bo_qua_khao_sat', ...goc });
  assert.equal(kiemTraSuKien({ ten: 'bo_qua_khao_sat', ...goc, thietBi: 'a1b2c3d4e5f6a7b8c9' }).thietBi, 'a1b2c3d4e5f6a7b8c9');
});

test('Sự kiện khảo sát không hợp lệ bị từ chối', () => {
  const tl = { ten: 'tra_loi_khao_sat', ...goc, diem_a: 4, co_loi_b: false };
  for (const x of [
    { ...tl, diem_a: 0 }, { ...tl, diem_a: 6 }, { ...tl, diem_a: '5' }, { ...tl, diem_a: 4.5 }, { ...tl, diem_a: undefined },
    { ...tl, diem_c: 9 }, { ...tl, co_loi_b: 'co' }, { ...tl, bai: 'la-so-123' }, { ...tl, goi: 'goi-la' },
    { ten: 'hien_khao_sat', ...goc }, { ten: 'hien_khao_sat', ...goc, cach: 'tu_dong' },
    { ten: 'bo_qua_khao_sat', phien: P, goi: 'tron-la-so' }, { ...tl, phien: 'ngan' },
    { ten: 'hien_khao_sat', ...goc, cach: 'cuoi_bai', diem_a: 5 }, // trường của sự kiện khác
  ]) assert.equal(kiemTraSuKien(x), null, JSON.stringify(x));
});

test('Trường cá nhân bị từ chối ở cả ba sự kiện', () => {
  const co = { hien_khao_sat: { cach: 'cuoi_bai' }, tra_loi_khao_sat: { diem_a: 5, co_loi_b: false }, bo_qua_khao_sat: {} };
  for (const ten of Object.keys(co)) {
    for (const k of ['ngaySinh', 'gioSinh', 'ten_khach', 'email', 'loi', 'loi_b', 'laSo', 'laSoId', 'chuDe', 'sdt'])
      assert.equal(kiemTraSuKien({ ten, ...goc, ...co[ten], [k]: 'x' }), null, ten + ' ' + k);
  }
});

test('Khảo sát thuộc màn luận giải, không phá đếm màn; client không tự tạo tên lạ', () => {
  for (const t of ['hien_khao_sat', 'tra_loi_khao_sat', 'bo_qua_khao_sat']) { assert.equal(trangCua(t), 'luan-giai'); assert.ok(TEN_SU_KIEN.includes(t)); }
  assert.equal(new Set(TEN_SU_KIEN.map(trangCua)).size, 7);
  // phiên đã trả tiền + khảo sát vẫn đếm đúng 4 màn
  const ds = ['vao_form', 'xem_tom_tat', 'vao_chon_goi', 'vao_thanh_toan', 'thanh_toan_xong', 'hien_khao_sat'].map((ten) => ({ t: 1, ten, phien: 'A', trang: trangCua(ten) }));
  assert.equal(tinhPheu(ds).soManTrungBinh, 4);
});

test('Lời (b): kiểm, cắt cứng 300 ký tự, từ chối trường lạ', () => {
  const ok = { bai: 'tinh-cam', goi: 'mot-chu-de', diem_a: 5, loi: '  Rất rõ ràng.  ' };
  assert.deepEqual(kiemPhanHoi(ok), { ...ok, loi: 'Rất rõ ràng.' });
  assert.equal(Array.from(kiemPhanHoi({ ...ok, loi: 'ạ'.repeat(500) }).loi).length, TOI_DA);
  assert.equal(TOI_DA, 300);
  for (const x of [{ ...ok, loi: '   ' }, { ...ok, loi: 5 }, { ...ok, diem_a: 7 }, { ...ok, ngaySinh: '1990-1-1' }, { ...ok, bai: 'x' }, { ...ok, phien: P }, null, []])
    assert.equal(kiemPhanHoi(x), null);
});

test('Lời (b) lưu riêng, mã PH tăng dần, không dữ liệu sinh, ngoài thư mục sự kiện', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ks-'));
  process.env.KHAO_SAT_DIR = path.join(dir, 'khao-sat');
  const suKien = path.join(dir, 'su-kien'); fs.mkdirSync(suKien);
  const [a, b] = await Promise.all([luuPhanHoi({ bai: 'ban-than', goi: 'tron-la-so', diem_a: 2, loi: 'Chưa vừa ý' }, 5), luuPhanHoi({ bai: 'ban-than', goi: 'tron-la-so', diem_a: 5, loi: 'Hay' }, 6)]);
  assert.deepEqual([a, b], ['PH-001', 'PH-002']);
  const dong = fs.readFileSync(path.join(process.env.KHAO_SAT_DIR, 'phan-hoi.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  assert.deepEqual(Object.keys(dong[0]).sort(), ['bai', 'diem_a', 'goi', 'loi', 'ma', 't']);
  assert.deepEqual(fs.readdirSync(suKien), []);
  delete process.env.KHAO_SAT_DIR;
});

const ks = (ten, goi, x = {}) => ({ t: 1730000000000, ten, phien: 'p' + Math.random(), trang: 'luan-giai', bai: 'ban-than', goi, ...x });

test('pheu: điểm (a), (c), tỉ lệ trả lời/bỏ qua theo gói; < 30 → chưa đủ mẫu', () => {
  const ds = [];
  for (let i = 0; i < 40; i++) ds.push(ks('hien_khao_sat', 'tron-la-so', { cach: 'cuoi_bai' }));
  for (let i = 0; i < 30; i++) ds.push(ks('tra_loi_khao_sat', 'tron-la-so', { diem_a: i < 15 ? 5 : 4, ...(i < 20 ? { diem_c: 4 } : {}), co_loi_b: i < 3 }));
  for (let i = 0; i < 10; i++) ds.push(ks('bo_qua_khao_sat', 'tron-la-so'));
  for (let i = 0; i < 10; i++) ds.push(ks('hien_khao_sat', 'mot-chu-de', { cach: 'doc_xong' }));
  for (let i = 0; i < 29; i++) ds.push(ks('tra_loi_khao_sat', 'mot-chu-de', { diem_a: 5, co_loi_b: false }));
  const t = tinhKhaoSat(ds);
  const r = t['tron-la-so'];
  assert.equal(r.diemA, 4.5); assert.equal(r.diemC, 4); assert.equal(r.tiLeTraLoi, 30 / 40); assert.equal(r.tiLeBoQua, 10 / 40);
  assert.equal(r.duMau, true); assert.equal(r.datMucTieu, true); assert.equal(r.coLoi, 3);
  assert.equal(t['mot-chu-de'].duMau, false);
  const chu = bangKhaoSat(t, false);
  assert.match(chu, /chưa đủ mẫu/); assert.match(chu, /4\.50 \(đạt/);
  assert.equal(bangKhaoSat({}, false).startsWith('Chưa có sự kiện'), true);
});

test('pheu: số giả lập ra bảng có cả số lẫn chưa đủ mẫu; theo tuần tách nhóm', () => {
  const ds = taoGiaLapKhaoSat(7);
  for (const d of ds) assert.ok(kiemTraSuKien({ ten: d.ten, phien: d.phien.padEnd(16, '0'), ...Object.fromEntries(['bai', 'goi', 'cach', 'diem_a', 'diem_c', 'co_loi_b'].filter((k) => k in d).map((k) => [k, d[k]])) }), JSON.stringify(d));
  const t = tinhKhaoSat(ds);
  assert.equal(t['tron-la-so'].duMau, true); assert.ok(t['tron-la-so'].diemA > 1 && t['tron-la-so'].diemA <= 5);
  assert.equal(t['mot-chu-de'].duMau, false);
  assert.ok(Object.keys(tinhKhaoSat(ds, { theoTuan: true })).length > 2);
});

test('Thời điểm hiện: 1 lần/bài, khách đã thấy thì 7 ngày sau mới hỏi, chỉ bài khác', () => {
  const { nenHoi, danhDauDaHoi, BAY_NGAY_MS, GIU_MS } = require('../src/lib/khao-sat-hien.js');
  const T = 1_800_000_000_000;
  assert.equal(GIU_MS, 2000);
  assert.equal(nenHoi(null, 'ban-than', T), true);
  assert.equal(nenHoi('hỏng', 'ban-than', T), true);
  const da = danhDauDaHoi(null, 'ban-than', T);
  assert.equal(nenHoi(da, 'ban-than', T + 30 * BAY_NGAY_MS), false); // cùng bài: không bao giờ hỏi lại
  assert.equal(nenHoi(da, 'tinh-cam', T + BAY_NGAY_MS - 1), false);
  assert.equal(nenHoi(da, 'tinh-cam', T + BAY_NGAY_MS), true);
  assert.deepEqual(Object.keys(da).sort(), ['baiDaHoi', 'lanCuoi']); // chỉ mã bài và giờ
});

test('Quyết định hiện theo vị trí mốc cuối bài: trong khung đợi 2 giây, đã cuộn qua thì hiện ngay', () => {
  const { cachHien } = require('../src/lib/khao-sat-hien.js');
  assert.equal(cachHien({ giaoNhau: true, canhDuoi: 400 }), 'doi'); // đang ở trong khung nhìn
  assert.equal(cachHien({ giaoNhau: false, canhDuoi: -50 }), 'ngay'); // mốc nằm phía trên khung nhìn (cuộn qua, nhảy xuống chân trang)
  assert.equal(cachHien({ giaoNhau: false, canhDuoi: -0.5 }), 'ngay');
  assert.equal(cachHien({ giaoNhau: false, canhDuoi: 900 }), 'khong'); // mốc còn ở phía dưới: chưa đọc tới
  assert.equal(cachHien({ giaoNhau: false, canhDuoi: 0 }), 'ngay'); // sát mép trên, đã ra khỏi khung
  assert.equal(cachHien({ giaoNhau: true, canhDuoi: -10 }), 'doi'); // giao nhau thì luôn theo luật 2 giây
  assert.equal(cachHien(null), 'khong');
  assert.equal(cachHien({}), 'khong');
});

test('Loại trừ sự kiện thử: theo khoảng giờ, mã phiên, email mẫu; --gom-thu giữ lại; không sửa dữ liệu gốc', () => {
  const { loaiTruThu, tinhKhaoSat: tks } = require('../tools/pheu.cjs');
  const cfg = {
    khoang: [{ tu: '2026-10-30T00:00:00+07:00', den: '2026-10-31T00:00:00+07:00' }],
    phien: ['aaaaaaaaaaaaaaaa'],
    emailMau: ['pt-*@example.com'],
  };
  const t0 = Date.parse('2026-10-30T12:00:00+07:00');
  const t1 = Date.parse('2026-11-02T12:00:00+07:00');
  const mk = (o) => ({ ten: 'hien_khao_sat', phien: 'p1', goi: 'tron-la-so', cach: 'cuoi_bai', t: t1, ...o });
  const ds = [mk({ t: t0 }), mk({ phien: 'aaaaaaaaaaaaaaaa' }), mk({ email: 'pt-an@example.com' }), mk({ email: 'khach@gmail.com' }), mk({})];
  const goc = JSON.stringify(ds);
  const r = loaiTruThu(ds, cfg);
  assert.equal(r.giu.length, 2);
  assert.equal(r.bo, 3);
  assert.equal(JSON.stringify(ds), goc);
  assert.equal(tks(r.giu)['tron-la-so'].hien, 2);
  assert.equal(loaiTruThu(ds, null).giu.length, 5); // không có danh sách: giữ hết
  assert.equal(loaiTruThu(ds, { khoang: [{ tu: 'hỏng', den: 'hỏng' }] }).giu.length, 5); // cấu hình hỏng không làm mất số thật
});

test('Danh sách loại trừ thật bao trùm ngày thử 30/10', () => {
  const { docLoaiTru, loaiTruThu } = require('../tools/pheu.cjs');
  const cfg = docLoaiTru();
  assert.ok(cfg && cfg.emailMau.includes('pt-*@example.com'));
  const r = loaiTruThu([{ ten: 'hien_khao_sat', phien: 'x', t: Date.parse('2026-10-30T23:59:00+07:00') }, { ten: 'hien_khao_sat', phien: 'y', t: Date.parse('2026-11-01T09:00:00+07:00') }], cfg);
  assert.equal(r.giu.length, 1);
});
