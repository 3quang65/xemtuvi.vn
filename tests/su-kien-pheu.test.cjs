// Kiểm thử đo lường phễu: kiểm tra sự kiện gửi lên và tính tỉ lệ từ file JSONL.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { kiemTraSuKien, nhomNguon, TEN_SU_KIEN, CHI_MAY_CHU, trangCua } = require('../src/lib/su-kien.js');
const { tinhPheu, docThuMuc, tinhTheoNguon, taoGiaLap, bangNguon, bangDonGoi, docGio, locGio, docChi } = require('../tools/pheu.cjs');

test('Sự kiện hợp lệ: đủ 25 tên (3 tên chỉ máy chủ ghi, 3 tên khảo sát và 3 tên A/B kiểm chứng có test riêng), phiên 16–32 ký tự', () => {
  assert.equal(TEN_SU_KIEN.length, 25);
  for (const ten of TEN_SU_KIEN.filter((t) => !CHI_MAY_CHU.includes(t) && t !== 'vao_trang' && !t.endsWith('_khao_sat') && !['kiem_chung_xem', 'xem_truoc_mo', 'bam_mua'].includes(t))) // vao_trang cần thêm dich, may: có test riêng
    assert.deepEqual(kiemTraSuKien({ ten, phien: 'a1b2c3d4e5f6a7b8' }), { ten, phien: 'a1b2c3d4e5f6a7b8' });
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
  assert.equal(new Set(TEN_SU_KIEN.map(trangCua)).size, 7); // thêm 'vao' (vao_trang)
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
  assert.deepEqual(MA_GOI, ['mot-chu-de', 'tron-la-so', 'thanh-vien-nam', 'van-nam-2027', 'tron-la-so-kem-van-nam', 'goi-doi-valentine']);
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
  assert.deepEqual(p.bac.tiLeTrenDon, { 'mot-chu-de': 2 / 4, 'tron-la-so': 1 / 4, 'thanh-vien-nam': 1 / 4, 'van-nam-2027': 0, 'tron-la-so-kem-van-nam': 0, 'goi-doi-valentine': 0 });
  assert.equal(p.bac.soChon, 5);
  assert.deepEqual(p.bac.tiLeTrenChon, { 'mot-chu-de': 2 / 5, 'tron-la-so': 2 / 5, 'thanh-vien-nam': 1 / 5, 'van-nam-2027': 0, 'tron-la-so-kem-van-nam': 0, 'goi-doi-valentine': 0 });
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

const P = 'a1b2c3d4e5f6a7b8';
const vt = (o) => kiemTraSuKien({ ten: 'vao_trang', phien: P, dich: '/', may: 'dien-thoai', ...o });

test('vao_trang: nhận UTM + nơi giới thiệu + trang đích + loại máy; từ chối trường lạ/giá trị lạ', () => {
  assert.deepEqual(vt({ utm_source: 'meta', utm_medium: 'cpc', utm_campaign: 'lap-la-so-202701', utm_content: 'qc-001', utm_term: 'tu-vi' }),
    { ten: 'vao_trang', phien: P, utm_source: 'meta', utm_medium: 'cpc', utm_campaign: 'lap-la-so-202701', utm_content: 'qc-001', utm_term: 'tu-vi', dich: '/', may: 'dien-thoai' });
  assert.equal(vt({ email: 'a@b.vn' }), null); // trường lạ
  assert.equal(vt({ utm_source: 'Meta Ads' }), null); // chưa chuẩn hóa
  assert.equal(vt({ utm_source: 'a@b.vn' }), null);
  assert.equal(vt({ ref: 'https://x.vn/duong-dan?email=a' }), null); // chỉ nhận tên máy chủ
  assert.equal(vt({ may: 'tivi' }), null);
  assert.equal(vt({ dich: '/lp?ngay=1995-08-15' }), null);
  assert.equal(kiemTraSuKien({ ten: 'vao_trang', phien: P }), null); // thiếu dich/may
  assert.equal(kiemTraSuKien({ ten: 'vao_form', phien: P, utm_source: 'meta' }), null); // sự kiện khác không mang nguồn
});

test('vao_trang: trang mời chỉ giữ "/moi", không lộ mã mời', () => {
  assert.equal(vt({ dich: '/moi/AbC123xyz' }).dich, '/moi');
  assert.equal(vt({ dich: '/lp/van-nam-2027' }).dich, '/lp/van-nam-2027');
});

test('dang_ky_thanh_vien: nhận (kèm gói tùy chọn), không nhận trường lạ', () => {
  assert.deepEqual(kiemTraSuKien({ ten: 'dang_ky_thanh_vien', phien: P }), { ten: 'dang_ky_thanh_vien', phien: P });
  assert.equal(kiemTraSuKien({ ten: 'dang_ky_thanh_vien', phien: P, goi: 'tron-la-so' }).goi, 'tron-la-so');
  assert.equal(kiemTraSuKien({ ten: 'dang_ky_thanh_vien', phien: P, email: 'a@b.vn' }), null);
});

test('Nhóm nguồn: UTM thắng; không UTM suy từ trang giới thiệu', () => {
  assert.equal(nhomNguon({ utm_source: 'tuvi-vn', utm_medium: 'site' }), 'tuvi-vn');
  assert.equal(nhomNguon({ utm_source: 'facebook', utm_medium: 'social' }), 'social');
  assert.equal(nhomNguon({ utm_source: 'meta', utm_medium: 'cpc' }), 'paid');
  assert.equal(nhomNguon({ utm_source: 'email', utm_medium: 'email' }), 'email');
  assert.equal(nhomNguon({ utm_source: 'doi-tac-a', utm_medium: 'partner' }), 'partner');
  assert.equal(nhomNguon({ utm_source: 'meta', utm_medium: 'cpc', ref: 'l.facebook.com' }), 'paid'); // UTM thắng referrer
  assert.equal(nhomNguon({}), 'direct');
  assert.equal(nhomNguon({ ref: 'xemtuvi.vn' }), 'direct');
  assert.equal(nhomNguon({ ref: 'www.google.com.vn' }), 'organic');
  assert.equal(nhomNguon({ ref: 'com.google.android.gm' }), 'referral'); // không nhầm ứng dụng Gmail với Google Search
  assert.equal(nhomNguon({ ref: 'blog.example.vn' }), 'referral');
});

test('Báo cáo theo nhóm nguồn: tách nhóm, chưa đủ mẫu < 100 phiên, phiên cũ vào "chưa rõ"', () => {
  const ds = [];
  const phien = (i) => 'p' + String(i).padStart(15, '0');
  for (let i = 0; i < 100; i++) { // 100 phiên paid: 50 lập, 10 chọn, 5 trả
    ds.push({ t: 1, ten: 'vao_trang', phien: phien(i), nhom: 'paid' });
    if (i < 50) ds.push(dong(phien(i), 'lap_la_so'));
    if (i < 10) ds.push(dong(phien(i), 'chon_goi'));
    if (i < 5) ds.push(dong(phien(i), 'thanh_toan_xong'));
  }
  for (let i = 100; i < 105; i++) { ds.push({ t: 1, ten: 'vao_trang', phien: phien(i), nhom: 'social' }); ds.push(dong(phien(i), 'lap_la_so')); }
  ds.push(dong('cu', 'vao_form')); ds.push(dong('cu', 'lap_la_so')); // không có vao_trang
  const t = tinhTheoNguon(ds);
  assert.equal(t.nhom.paid.phien, 100);
  assert.equal(t.nhom.paid.duMau, true);
  assert.equal(t.nhom.paid.lapTrenVao, 0.5);
  assert.equal(t.nhom.paid.chonTrenLap, 0.2);
  assert.equal(t.nhom.paid.traTrenChon, 0.5);
  assert.equal(t.nhom.paid.cpa, null);
  assert.equal(t.nhom.social.duMau, false);
  assert.equal(t.nhom['chưa rõ'].phien, 1);
  assert.equal(t.tong, 106);
});

test('vao_trang không tính thành màn hình mua; vao_chon_goi hiện là xem_trang_gia', () => {
  const ds = [dong('A', 'vao_form'), { t: 1, ten: 'vao_trang', phien: 'A', trang: 'vao' }, dong('A', 'thanh_toan_xong')];
  assert.equal(tinhPheu(ds).soManTrungBinh, 2);
});

test('Số giả lập: đủ 8 nhóm, ổn định theo hạt, ≥ 3 nhóm đủ mẫu có đủ chỉ số', () => {
  const a = tinhTheoNguon(taoGiaLap(7)), b = tinhTheoNguon(taoGiaLap(7));
  assert.deepEqual(a, b);
  const du = Object.values(a.nhom).filter((r) => r.duMau);
  assert.ok(du.length >= 3);
  for (const r of du) for (const k of ['phien', 'tiLePhien', 'lapTrenVao', 'chonTrenLap', 'traTrenChon']) assert.notEqual(r[k], null);
  assert.equal(Object.keys(a.nhom).length, 8);
});

test('bảng utm_content tách theo bộ UTM; mua lại tính theo thiết bị, không lộ mã', () => {
  const { tinhTheoUtm, tinhMuaLai, dongMuaLai } = require('../tools/pheu.cjs');
  const v = (phien, content) => ({ t: 1, ten: 'vao_trang', phien, nhom: 'paid', utm_source: 'meta', utm_medium: 'cpc', ...(content ? { utm_content: content } : {}) });
  const u = tinhTheoUtm([v('A', 'video-a'), v('B', 'anh-b'), v('C'), { ...dong('A', 'lap_la_so') }]);
  assert.deepEqual(Object.keys(u).sort(), ['meta / cpc / (không có)', 'meta / cpc / anh-b', 'meta / cpc / video-a']);
  assert.equal(u['meta / cpc / video-a'].lap, 1);
  const don = (phien, thietBi, ngay) => ({ t: 1 + ngay * 86400000, ten: 'thanh_toan_xong', phien, thietBi });
  const m = tinhMuaLai([don('P1', 'tbKhachMot', 0), don('P2', 'tbKhachMot', 10), don('P3', 'tbKhachHai', 0)]);
  assert.equal(m.khach, 2); assert.equal(m.muaLai, 1); assert.equal(m.ngayTrungVi, 10);
  assert.ok(!dongMuaLai(m).includes('tbKhach'));
});

test('Đo 24 giờ đầu: bước 3/vào thanh toán theo nguồn, bao_loi gắn nguồn, CPA, đơn theo gói, lọc giờ', () => {
  const T0 = Date.parse('2026-12-15T00:00:00+07:00'), H = 3600_000;
  const ds = [];
  const them = (t, ten, phien, extra = {}) => ds.push({ t, ten, phien, ...extra });
  // phiên p1 (paid): vào → lá số → tóm tắt → thanh toán → xong (Vận 2027); thiết bị d1
  them(T0 + H, 'vao_trang', 'p1', { nhom: 'paid', thietBi: 'd1' });
  for (const [i, ten] of ['lap_la_so', 'xem_tom_tat', 'vao_chon_goi', 'chon_goi', 'vao_thanh_toan'].entries()) them(T0 + H + i + 1, ten, 'p1');
  them(T0 + 2 * H, 'thanh_toan_xong', 'p1', { goi: 'van-nam-2027' });
  // bao_loi ở phiên sau, không có vao_trang: tra theo thiết bị d1 → paid; một dòng khác tự mang nhom=social
  them(T0 + 3 * H, 'bao_loi', 'p9', { thietBi: 'd1' });
  them(T0 + 3 * H, 'bao_loi', 'p8', { nhom: 'social' });
  // sau 24 giờ: bị lọc
  them(T0 + 30 * H, 'vao_trang', 'p2', { nhom: 'paid', thietBi: 'd2' });
  them(T0 + 30 * H, 'thanh_toan_xong', 'p2', { goi: 'tron-la-so' });
  const dong24 = locGio(ds, T0, T0 + 24 * H);
  assert.equal(dong24.length, ds.length - 2);
  const t = tinhTheoNguon(dong24, { chi: docChi(['--chi=paid:600000']) });
  const p = t.nhom.paid;
  assert.deepEqual([p.lap, p.tomTat, p.xemGia, p.chon, p.vaoTT, p.tra, p.don, p.baoLoi], [1, 1, 1, 1, 1, 1, 1, 1]);
  assert.equal(p.cpa, 600000);
  assert.equal(p.baoLoiTrenDon, 1);
  assert.equal(t.nhom.social.baoLoi, 1);
  assert.equal(t.nhom['chưa rõ'], undefined); // không còn rơi vào 'chưa rõ'
  assert.deepEqual(p.donGoi, { 'van-nam-2027': 1 });
  assert.match(bangNguon(t, false), /600\.000đ/);
  assert.match(bangDonGoi(t, { riengGoi: 'van-nam-2027' }), /paid +1 +1/);
  assert.equal(tinhTheoNguon(dong24).nhom.paid.cpa, null); // không nhập chi: không tự bịa CPA
});

test('docChi/docGio: nhập sai thì báo lỗi; giờ không múi giờ = +07', () => {
  assert.deepEqual(docChi(['--chi=paid:1.500.000', '--chi=paid:500000']), { paid: 2000000 });
  assert.throws(() => docChi(['--chi=facebook:100']));
  assert.throws(() => docChi(['--chi=paid:0']));
  assert.equal(docGio('2026-12-15T09:00'), Date.parse('2026-12-15T09:00:00+07:00'));
  assert.equal(docGio('xyz'), null);
});
