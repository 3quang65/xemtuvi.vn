// Hỏi đáp về lá số (docs/san-pham/hoi-dap-la-so.md): hạn mức 5 câu/tháng, quyền, từ chối, mã quy tắc, xóa theo tài khoản.
const test = require('node:test');
process.env.MO_GOI_AN = '1'; // gói Thành viên năm đang ẩn; test này kiểm luồng gói năm
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const x = nap('lib/may-chu/xu-ly.ts');
const dv = nap('lib/may-chu/dich-vu.ts');
const hd = nap('lib/may-chu/hoi-dap.ts');
require('./_dang-nhap.cjs')(x);

process.env.DANG_NHAP_THU = '1'; process.env.EMAIL_THU_CHO_PHEP = '@example.vn';
process.env.CONG_THANH_TOAN = 'gia_lap';
process.env.NHAT_KY_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'nhat-ky-'));
const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
const HOST = 'xemtuvi.test';
const SINH = { lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 10, phut: 30, gioiTinh: 'nu' };
const tuCam = require('../src/lib/luan-giai/ai/tu-cam.json');

function yc(url, { method = 'GET', body, cookie } = {}) {
  const h = { host: HOST };
  if (method === 'POST') { h['content-type'] = 'application/json'; h.origin = 'https://' + HOST; }
  if (cookie) h.cookie = cookie;
  return new Request('https://' + HOST + url, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
}
const j = (r) => r.json();
async function khach(email, goi, soLaSo = 1) {
  const r = await x.dangNhap(yc('/api/dang-nhap', { method: 'POST', body: { email } }), M);
  const cookie = 'xtv_phien=' + /xtv_phien=([^;]+)/.exec(r.headers.get('set-cookie'))[1];
  const ids = [];
  for (let i = 0; i < soLaSo; i++) ids.push((await j(await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie, body: { thongTinSinh: { ...SINH, nam: 1990 + i } } }), M))).id);
  if (goi) {
    const don = await j(await x.donHangTao(yc('/api/don-hang', { method: 'POST', cookie, body: { maGoi: goi, laSoId: ids[0] } }), M));
    await x.thanhToanGiaLap(yc('/api/thanh-toan/gia-lap', { method: 'POST', cookie, body: { donHangId: don.id } }), M);
  }
  return { cookie, laSo: ids[0], ids, nd: M.db.prepare('SELECT id FROM nguoi_dung WHERE ma_ngoai=?').get(email).id };
}
const hoi = (k, cau, laSoId = k.laSo) => x.hoiDapGhi(yc('/api/hoi-dap', { method: 'POST', cookie: k.cookie, body: { laSoId, cau } }), M);
const CAU_TRA_LOI_DUOC = 'Tính cách của tôi có điểm mạnh nào?';

test('chưa đăng nhập 401; gói khác thành viên 403 chua_mua và không kèm nội dung', async () => {
  assert.equal((await x.hoiDapGhi(yc('/api/hoi-dap', { method: 'POST', body: { laSoId: 1, cau: 'x' } }), M)).status, 401);
  const a = await khach('chua-mua@example.vn');
  const r = await hoi(a, CAU_TRA_LOI_DUOC);
  assert.equal(r.status, 403); assert.equal((await j(r)).loi, 'chua_mua');
  const b = await khach('tron@example.vn', 'tron-la-so');
  assert.equal((await hoi(b, CAU_TRA_LOI_DUOC)).status, 403);
  assert.equal((await x.hoiDapDoc(yc(`/api/hoi-dap?laSoId=${b.laSo}`, { cookie: b.cookie }), M)).status, 403);
});

test('gói năm: hỏi 5 câu OK, câu 6 bị chặn 429 het_luot kèm ngày làm mới; xem lại lịch sử không tốn lượt', async () => {
  const k = await khach('nam5@example.vn', 'thanh-vien-nam');
  for (let i = 1; i <= 5; i++) {
    const r = await hoi(k, CAU_TRA_LOI_DUOC);
    assert.equal(r.status, 200);
    const b = await j(r);
    assert.equal(b.ket_qua, 'tra_loi');
    assert.equal(b.con_lai, 5 - i);
    assert.ok(b.tra_loi.doan_dan && b.tra_loi.nhanDinh.length >= 1 && b.tra_loi.nhanDinh.length <= 3);
    assert.ok(b.tra_loi.ghiChu);
  }
  const r6 = await hoi(k, CAU_TRA_LOI_DUOC);
  assert.equal(r6.status, 429);
  const b6 = await j(r6);
  assert.equal(b6.loi, 'het_luot'); assert.match(b6.thongDiep, /\d+\/\d+\/\d{4}/);
  const ls = await j(await x.hoiDapDoc(yc(`/api/hoi-dap?laSoId=${k.laSo}`, { cookie: k.cookie }), M));
  assert.equal(ls.lich_su.length, 5); assert.equal(ls.con_lai, 0);
  assert.equal((await j(await x.hoiDapDoc(yc(`/api/hoi-dap?laSoId=${k.laSo}`, { cookie: k.cookie }), M))).con_lai, 0);
});

test('sang tháng mới (giả lập giờ) lại còn 5; hạn mức theo tài khoản, không theo lá số', async () => {
  const k = await khach('thang@example.vn', 'thanh-vien-nam', 2);
  const t = Date.UTC(2026, 10, 20, 5); // 20/11/2026 giờ VN
  for (let i = 0; i < 3; i++) await hd.hoiLaSo(M.db, M.khoa, k.nd, k.ids[i % 2], CAU_TRA_LOI_DUOC, t);
  assert.equal(hd.conLai(M.db, k.nd, t).con_lai, 2);
  assert.equal(hd.conLai(M.db, k.nd, t).lam_moi, '1/12/2026');
  await hd.hoiLaSo(M.db, M.khoa, k.nd, k.ids[1], 'Tình cảm của tôi ra sao?', t);
  await hd.hoiLaSo(M.db, M.khoa, k.nd, k.ids[0], 'Tài chính của tôi ra sao?', t);
  await assert.rejects(hd.hoiLaSo(M.db, M.khoa, k.nd, k.ids[1], CAU_TRA_LOI_DUOC, t), (e) => e.ma === 'het_luot' && e.trangThai === 429);
  const t2 = Date.UTC(2026, 11, 1, -6); // 0h ngày 1/12 giờ VN = 17h ngày 30/11 UTC
  assert.equal(hd.conLai(M.db, k.nd, t2).con_lai, 5);
  assert.equal((await hd.hoiLaSo(M.db, M.khoa, k.nd, k.ids[0], CAU_TRA_LOI_DUOC, t2)).con_lai, 4);
  assert.equal(hd.conLai(M.db, k.nd, Date.UTC(2026, 10, 30, 16)).con_lai, 0); // 23h ngày 30/11 giờ VN vẫn là tháng 11
  assert.equal(hd.conLai(M.db, k.nd, Date.UTC(2026, 11, 15)).lam_moi, '1/1/2027');
});

test('câu bị từ chối hoặc không khớp không trừ lượt, không ghi vào hoi_dap', async () => {
  const k = await khach('tuchoi@example.vn', 'thanh-vien-nam');
  const cac = [['Tôi bị bệnh gì, sống được bao lâu?', 'tu_choi', 'HD-TC-SUCKHOE'], ['Vợ chồng tôi có ly hôn không?', 'tu_choi', 'HD-TC-LYHON'],
    ['Chọn ngày giờ tốt để khai trương', 'tu_choi', 'HD-TC-NGAYGIO'], ['Làm sao để giải hạn năm nay?', 'tu_choi', 'HD-TC-GIAIHAN'],
    ['Chồng tôi tính cách thế nào?', 'tu_choi', 'HD-TC-NGUOIKHAC'], ['Hôm nay ăn gì?', 'khong_khop', 'HD-KHONG-KHOP']];
  for (const [cau, kq, ma] of cac) {
    const b = await j(await hoi(k, cau));
    assert.equal(b.ket_qua, kq, cau); assert.equal(b.tra_loi.ma, ma, cau); assert.equal(b.con_lai, 5, cau); assert.deepEqual(b.tra_loi.nhanDinh, []);
  }
  assert.equal(M.db.prepare('SELECT COUNT(*) n FROM hoi_dap WHERE nguoi_dung_id=?').get(k.nd).n, 0);
  // Hết lượt thì câu từ chối vẫn được giải thích (200), chỉ câu trả lời được mới bị 429.
  for (let i = 0; i < 5; i++) await hoi(k, CAU_TRA_LOI_DUOC);
  assert.equal((await hoi(k, 'Có ly hôn không?')).status, 200);
  assert.equal((await hoi(k, CAU_TRA_LOI_DUOC)).status, 429);
});

test('2 yêu cầu song song ở câu 5: chỉ 1 thành công', async () => {
  const k = await khach('songsong@example.vn', 'thanh-vien-nam');
  for (let i = 0; i < 4; i++) await hoi(k, CAU_TRA_LOI_DUOC);
  const kq = await Promise.all([hoi(k, 'Sự nghiệp của tôi ra sao?'), hoi(k, 'Tài chính của tôi ra sao?'), hoi(k, 'Gia đạo của tôi ra sao?')]);
  assert.deepEqual(kq.map((r) => r.status).sort(), [200, 429, 429]);
  assert.equal(M.db.prepare('SELECT COUNT(*) n FROM hoi_dap WHERE nguoi_dung_id=?').get(k.nd).n, 5);
});

test('lá số thứ 4 và lá số của người khác: 403', async () => {
  const k = await khach('bon-la-so@example.vn', 'thanh-vien-nam', 4);
  assert.equal((await hoi(k, CAU_TRA_LOI_DUOC, k.ids[2])).status, 200);
  assert.equal((await hoi(k, CAU_TRA_LOI_DUOC, k.ids[3])).status, 403);
  assert.equal((await x.hoiDapDoc(yc(`/api/hoi-dap?laSoId=${k.ids[3]}`, { cookie: k.cookie }), M)).status, 403);
  const khac = await khach('nguoi-khac@example.vn', 'thanh-vien-nam');
  const r = await hoi(khac, CAU_TRA_LOI_DUOC, k.ids[0]);
  assert.equal(r.status, 403); assert.ok(!(await r.text()).includes('nhanDinh'));
});

test('đầu vào: thiếu/quá dài/sai kiểu không trừ lượt; sai Origin 403', async () => {
  const k = await khach('dauvao@example.vn', 'thanh-vien-nam');
  for (const cau of ['', '   ', 5, null, 'a'.repeat(201)]) assert.equal((await hoi(k, cau)).status, 400);
  assert.equal((await hoi(k, 'a'.repeat(200))).status, 200);
  assert.equal(hd.conLai(M.db, k.nd).con_lai, 5);
  const sai = new Request('https://' + HOST + '/api/hoi-dap', { method: 'POST', headers: { host: HOST, 'content-type': 'application/json', origin: 'https://noi-khac.vn', cookie: k.cookie }, body: JSON.stringify({ laSoId: k.laSo, cau: CAU_TRA_LOI_DUOC }) });
  assert.equal((await x.hoiDapGhi(sai, M)).status, 403);
});

test('mọi câu trả lời: mọi nhận định có quyTacId, không chứa từ cấm; câu hỏi/trả lời lưu mã hóa', async () => {
  const k = await khach('maquytac@example.vn', 'thanh-vien-nam');
  const cap = ['Tính cách của tôi thế nào', 'Chuyện tình cảm của tôi ra sao', 'Sự nghiệp của tôi nên đi hướng nào', 'Tôi giữ tiền thế nào', 'Gia đạo nhà cửa của tôi', 'Vận 10 năm tới của tôi', 'Năm nay 2027 của tôi'];
  const gop = (s) => s.toLowerCase().replace(/\s+/g, '');
  for (let i = 0; i < cap.length; i++) {
    const t = Date.UTC(2026, 10 + (i > 4 ? 1 : 0), 20); // dàn ra hai tháng để không vướng hạn mức
    const b = await hd.hoiLaSo(M.db, M.khoa, k.nd, k.laSo, cap[i], t);
    assert.equal(b.ket_qua, 'tra_loi', cap[i]);
    assert.ok(b.tra_loi.nhanDinh.length >= 1, cap[i]);
    for (const n of b.tra_loi.nhanDinh) {
      assert.ok(n.quyTacId, cap[i]);
      for (const c of tuCam.tuCam) assert.ok(!gop(n.text + n.canCu + b.tra_loi.doan_dan).includes(gop(c)), `${cap[i]}: có từ cấm "${c}"`);
    }
  }
  const ma = M.db.prepare('SELECT noi_dung_ma_hoa FROM hoi_dap WHERE nguoi_dung_id=?').all(k.nd);
  assert.ok(ma.length >= 5);
  for (const m of ma) assert.ok(!/Tính cách|tình cảm|nhanDinh|quyTacId/.test(Buffer.from(m.noi_dung_ma_hoa, 'base64').toString('latin1')));
});

test('câu hỏi hiểu đúng chuyên đề', () => {
  const cd = (c) => { const h = hd.hieuCauHoi(c); return h.loai === 'chu_de' ? h.chuDe : h.loai; };
  assert.equal(cd('Điểm yếu của tôi là gì?'), 'ban-than');
  assert.equal(cd('Bao giờ tôi lấy chồng?'), 'tu_choi'); // mốc thời gian chắc chắn
  assert.equal(cd('Tôi lấy chồng thì cách gắn bó thế nào?'), 'tinh-cam');
  assert.equal(cd('Công việc của tôi nên theo hướng nào?'), 'su-nghiep');
  assert.equal(cd('Tôi kiếm tiền và tiết kiệm ra sao?'), 'tai-chinh');
  assert.equal(cd('Nhà cửa gia đình của tôi?'), 'gia-dao');
  assert.equal(cd('Đại vận hiện tại của tôi?'), 'van-10-nam');
  assert.equal(cd('Năm nay sự nghiệp của tôi?'), 'van-nam-2027');
  assert.equal(cd('Hôm nay trời đẹp'), 'khong_khop');
});

test('bộ chọn luôn có ý chính tinh cung chủ đề (+ Phụ Mẫu với gia đạo), có Tóm lại; không còn đuôi khuôn', async () => {
  const k = await khach('xetomlại@example.vn', 'thanh-vien-nam');
  const cac = ['Điểm mạnh và điều cần lưu ý trong tính cách của tôi là gì?', 'Công việc nào hợp với cách làm việc của tôi?', 'Tôi kiếm và giữ tiền theo kiểu nào?', 'Quan hệ với cha mẹ và nhà cửa của tôi có gì đáng chú ý?', 'Năm nay 2027 tôi nên tập trung vào điều gì?', 'Cách yêu của tôi ra sao?', 'Đại vận hiện tại của tôi nổi bật điều gì?'];
  const gop = (s) => s.toLowerCase().replace(/\s+/g, '');
  for (let i = 0; i < cac.length; i++) {
    const t = Date.UTC(2026, 10 + (i > 4 ? 1 : 0), 20);
    const b = await hd.hoiLaSo(M.db, M.khoa, k.nd, k.laSo, cac[i], t);
    assert.equal(b.ket_qua, 'tra_loi', cac[i]);
    assert.ok(b.tra_loi.tom_lai && b.tra_loi.tom_lai.startsWith('Tóm lại: '), cac[i]);
    assert.ok(b.tra_loi.nhanDinh.length >= 1 && b.tra_loi.nhanDinh.length <= 3, cac[i]);
    for (const n of b.tra_loi.nhanDinh) {
      assert.ok(n.quyTacId, `${cac[i]}: thiếu quyTacId`);
      for (const c of tuCam.tuCam) assert.ok(!gop(n.text).includes(gop(c)), `${cac[i]}: có từ cấm "${c}"`);
    }
    const text = (b.tra_loi.nhanDinh.map((n) => n.text).join(' ') + b.tra_loi.tom_lai).toLowerCase();
    assert.ok(!text.includes('mỗi người cảm nhận'), `${cac[i]}: còn đuôi "mỗi người cảm nhận"`);
    assert.ok(!/ảnh hưởng đến [^.]*:/.test(text), `${cac[i]}: còn đuôi "ảnh hưởng đến ...:"`);
  }
  const k2 = await khach('xetomlai2@example.vn', 'thanh-vien-nam');
  const t = Date.UTC(2026, 10, 20, 5);
  const b1 = await hd.hoiLaSo(M.db, M.khoa, k2.nd, k2.laSo, 'Điểm mạnh và điều cần lưu ý trong tính cách của tôi là gì?', t);
  assert.ok(b1.tra_loi.nhanDinh.some((n) => n.cung === 'Mệnh' && n.sao.includes('Thiên Tướng')), 'câu 1: thiếu chính tinh Mệnh = Thiên Tướng');
  const b4 = await hd.hoiLaSo(M.db, M.khoa, k2.nd, k2.laSo, 'Tôi kiếm và giữ tiền theo kiểu nào?', t);
  assert.ok(b4.tra_loi.nhanDinh.some((n) => n.cung === 'Tài Bạch' && n.sao.includes('Thiên Phủ')), 'câu 4: thiếu chính tinh Tài Bạch = Thiên Phủ');
  const b5 = await hd.hoiLaSo(M.db, M.khoa, k2.nd, k2.laSo, 'Quan hệ với cha mẹ và nhà cửa của tôi có gì đáng chú ý?', t);
  assert.ok(b5.tra_loi.nhanDinh.some((n) => n.cung === 'Phụ Mẫu'), 'câu 5: thiếu ý Phụ Mẫu');
});

test('xóa tài khoản xóa hoi_dap', async () => {
  const k = await khach('xoa-hd@example.vn', 'thanh-vien-nam');
  await hoi(k, CAU_TRA_LOI_DUOC);
  assert.equal(M.db.prepare('SELECT COUNT(*) n FROM hoi_dap WHERE nguoi_dung_id=?').get(k.nd).n, 1);
  dv.xoaTaiKhoan(M.db, k.nd);
  assert.equal(M.db.prepare('SELECT COUNT(*) n FROM hoi_dap WHERE nguoi_dung_id=?').get(k.nd).n, 0);
});
