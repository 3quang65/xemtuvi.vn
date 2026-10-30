// Thử nghiệm giá (thu-gia_v1.md): công tắc, nhánh theo thiết bị, giá do máy chủ tính, sự kiện mang nhanh, báo cáo theo nhánh.
const test = require('node:test');
process.env.MO_GOI_AN = '1'; // gói Thành viên năm đang ẩn; test này kiểm luồng gói năm nên mở lại
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const nap = require('./_nap-ts.cjs');
const { moCsdl } = nap('lib/may-chu/csdl.ts');
const { taoBoKhoa } = nap('lib/may-chu/ma-hoa.ts');
const x = nap('lib/may-chu/xu-ly.ts');
require('./_dang-nhap.cjs')(x);
const tg = nap('lib/may-chu/thu-gia.ts');
const { GOI, GOI_VAN_NAM, goiTheoBang, layGoi } = nap('lib/goi.ts');
const { kiemTraSuKien } = require('../src/lib/su-kien.js');
const { tinhTheoNhanh, bangNhanh, taoGiaLap, phienChonGoi, bootstrap, csvNhanh } = require('../tools/pheu.cjs');
const gia = nap('app/api/gia/route.ts');
const apiSuKien = nap('app/api/su-kien/route.ts');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'thu-gia-'));
process.env.THU_GIA_FILE = path.join(tmp, 'thu-gia.json');
process.env.DATA_DIR = path.join(tmp, 'su-kien');
process.env.DANG_NHAP_THU = '1'; process.env.EMAIL_THU_CHO_PHEP = '@example.vn,@x.vn,@b.vn,@test.vn';
process.env.CONG_THANH_TOAN = 'gia_lap';
const M = { db: moCsdl(':memory:'), khoa: taoBoKhoa('khoa-tam-chi-dung-cho-test-0123456789') };
const HOST = 'xemtuvi.test';
const CFG = (bat, thu = 'a') => JSON.stringify({ bat, thu, thuNghiem: { a: { 'tron-la-so': 129000 }, b: { 'thanh-vien-nam': 199000 } } });
const datCfg = (noiDung) => { if (noiDung === null) fs.rmSync(process.env.THU_GIA_FILE, { force: true }); else fs.writeFileSync(process.env.THU_GIA_FILE, noiDung); tg.xoaNhoCauHinh(); };
const yc = (url, { method = 'GET', body, cookie } = {}) => new Request('https://' + HOST + url, {
  method, headers: { host: HOST, ...(method === 'POST' ? { 'content-type': 'application/json', origin: 'https://' + HOST } : {}), ...(cookie ? { cookie } : {}) },
  body: body === undefined ? undefined : JSON.stringify(body),
});
const P = 'a1b2c3d4e5f6a7b8c9';
const docSk = () => fs.readdirSync(process.env.DATA_DIR).flatMap((f) => fs.readFileSync(path.join(process.env.DATA_DIR, f), 'utf8').trim().split('\n')).map((l) => JSON.parse(l));
const cookieNhanh = (r) => (/xtv_nhanh=([^;]+)/.exec(r.headers.get('set-cookie') || '') || [])[1];

test('Mặc định TẮT: không có tệp, bat=false hoặc cấu hình sai đều ra giá hiện hành, không đặt cookie', async () => {
  for (const nd of [null, CFG(false), '{hỏng', JSON.stringify({ bat: true, thu: 'a', thuNghiem: { a: { 'tron-la-so': -5 } } }), JSON.stringify({ bat: true, thu: 'z', thuNghiem: {} }), JSON.stringify({ bat: true, thu: 'a', thuNghiem: { a: { 'ma-la': 1000 } } })]) {
    datCfg(nd);
    const r = await gia.GET(yc('/api/gia'));
    const b = await r.json();
    assert.equal(b.nhanh, null); assert.equal(b.thuDangBat, false);
    assert.equal(b.gia['tron-la-so'], 99000); assert.equal(b.gia['thanh-vien-nam'], 299000);
    assert.equal(r.headers.get('set-cookie'), null);
  }
});

test('Giá hiện hành trong goi.ts không đổi; goiTheoBang áp giá nhánh và tự tính dòng so sánh', () => {
  assert.equal(GOI.find((g) => g.ma === 'tron-la-so').gia, 99000);
  assert.equal(GOI.find((g) => g.ma === 'thanh-vien-nam').gia, 299000);
  assert.deepEqual(GOI.find((g) => g.ma === 'thanh-vien-nam').soSanh, ['≈ 25.000đ/tháng', 'Mua lẻ 3 lá số đã là 297.000đ']);
  assert.equal(GOI_VAN_NAM.length, 2);
  const a = goiTheoBang({ 'tron-la-so': 129000 }).goi;
  assert.equal(a.find((g) => g.ma === 'tron-la-so').gia, 129000);
  assert.equal(a.find((g) => g.ma === 'thanh-vien-nam').gia, 299000);
  assert.match(a.find((g) => g.ma === 'thanh-vien-nam').soSanh[1], /387\.000đ/);
  const b = goiTheoBang({ 'thanh-vien-nam': 199000 }).goi.find((g) => g.ma === 'thanh-vien-nam');
  assert.equal(b.gia, 199000); assert.deepEqual(b.soSanh, ['≈ 17.000đ/tháng', 'Mua lẻ 3 lá số đã là 297.000đ']);
  assert.equal(layGoi('tron-la-so', { 'tron-la-so': 129000 }).gia, 129000);
  assert.equal(layGoi('tron-la-so').gia, 99000);
});

test('Bật: cùng thiết bị luôn một giá qua 5 lần tải; hai nhánh chia ~50/50', async () => {
  datCfg(CFG(true));
  const dem = { goc: 0, thu: 0 };
  for (let i = 0; i < 200; i++) {
    const r1 = await gia.GET(yc('/api/gia'));
    const ck = cookieNhanh(r1), b1 = await r1.json();
    assert.match(ck, /^a\.(goc|thu)\.[A-Za-z0-9_-]{16,32}$/); assert.equal(b1.nhanh, ck.split('.')[1]);
    assert.equal(b1.gia['tron-la-so'], b1.nhanh === 'thu' ? 129000 : 99000);
    dem[b1.nhanh]++;
    for (let k = 0; k < 5; k++) {
      const r = await gia.GET(yc('/api/gia', { cookie: 'xtv_nhanh=' + ck }));
      const b = await r.json();
      assert.equal(b.nhanh, b1.nhanh); assert.equal(b.gia['tron-la-so'], b1.gia['tron-la-so']);
      assert.equal(r.headers.get('set-cookie'), null, 'đã có nhánh thì không đặt lại cookie');
    }
  }
  assert.ok(dem.goc > 70 && dem.thu > 70, JSON.stringify(dem));
  assert.match(tg.nhanhCuaYeuCau(yc('/'), tg.cauHinhThuGia(), () => 0.1).setCookie, /xtv_nhanh=a\.goc\.[A-Za-z0-9_-]{16}; Path=\/; HttpOnly; Secure; SameSite=Lax/);
  assert.equal(tg.nhanhCuaYeuCau(yc('/'), tg.cauHinhThuGia(), () => 0.9).nhanh, 'thu');
});

test('Đổi sang thử nghiệm khác thì chia lại; cookie giả/sai bị bỏ qua', async () => {
  datCfg(CFG(true, 'b'));
  const r = await gia.GET(yc('/api/gia', { cookie: 'xtv_nhanh=a.thu' }));
  assert.match(cookieNhanh(r), /^b\./);
  for (const ck of ['xtv_nhanh=b.vang', 'xtv_nhanh=b', 'xtv_nhanh=']) assert.ok(cookieNhanh(await gia.GET(yc('/api/gia', { cookie: ck }))));
  const g = await (await gia.GET(yc('/api/gia', { cookie: 'xtv_nhanh=b.thu' }))).json();
  assert.equal(g.gia['thanh-vien-nam'], 199000); assert.equal(g.gia['tron-la-so'], 99000);
});

test('kiemTraSuKien: nhanh chỉ ở sự kiện có gói, chỉ goc/thu', () => {
  for (const ten of ['chon_goi', 'vao_thanh_toan', 'thanh_toan_xong', 'bao_loi'])
    assert.deepEqual(kiemTraSuKien({ ten, phien: P, goi: 'tron-la-so', nhanh: 'thu' }), { ten, phien: P, goi: 'tron-la-so', nhanh: 'thu' });
  assert.equal(kiemTraSuKien({ ten: 'chon_goi', phien: P, goi: 'tron-la-so', nhanh: 'vang' }), null);
  assert.equal(kiemTraSuKien({ ten: 'chon_goi', phien: P, goi: 'tron-la-so', nhanh: 5 }), null);
  assert.equal(kiemTraSuKien({ ten: 'vao_form', phien: P, nhanh: 'thu' }), null);
  assert.equal(kiemTraSuKien({ ten: 'chon_goi', phien: P, goi: 'tron-la-so', gia: 1 }), null);
});

test('Sự kiện: máy chủ gắn nhanh + thu + gia từ cookie, bỏ qua nhanh/giá trình duyệt tự khai', async () => {
  datCfg(CFG(true));
  const g = (phien, goi, ck, them = {}) => apiSuKien.POST(yc('/api/su-kien', { method: 'POST', cookie: ck, body: { ten: 'chon_goi', phien, goi, ...them } }));
  assert.equal((await g('p1' + P, 'tron-la-so', 'xtv_nhanh=a.thu')).status, 204);
  assert.equal((await g('p2' + P, 'tron-la-so', 'xtv_nhanh=a.goc', { nhanh: 'thu' })).status, 204); // khai thu nhưng cookie goc
  assert.equal((await g('p3' + P, 'tron-la-so', undefined, { nhanh: 'thu' })).status, 204); // chưa có cookie
  assert.equal((await g('p4' + P, 'tron-la-so', 'xtv_nhanh=a.thu', { nhanh: 'xau' })).status, 400);
  const ds = docSk();
  const l = (p) => ds.find((d) => d.phien === p + P);
  assert.deepEqual([l('p1').nhanh, l('p1').thu, l('p1').gia], ['thu', 'a', 129000]);
  assert.deepEqual([l('p2').nhanh, l('p2').gia], ['goc', 99000]);
  assert.deepEqual([l('p3').nhanh, l('p3').gia], [undefined, 99000]);
  assert.equal(l('p4'), undefined);
  // tắt công tắc: cookie cũ không còn ảnh hưởng, sự kiện về giá hiện hành, không nhanh
  datCfg(CFG(false));
  assert.equal((await g('p5' + P, 'tron-la-so', 'xtv_nhanh=a.thu')).status, 204);
  const l5 = docSk().find((d) => d.phien === 'p5' + P);
  assert.deepEqual([l5.nhanh, l5.gia], [undefined, 99000]);
});

test('Mua giả lập thu đúng số tiền nhánh; tắt công tắc về giá hiện hành', async () => {
  const dn = await x.dangNhap(yc('/api/dang-nhap', { method: 'POST', body: { nhaCungCap: 'google', email: 'a@b.vn' } }), M);
  const ck = 'xtv_phien=' + /xtv_phien=([^;]+)/.exec(dn.headers.get('set-cookie'))[1];
  const ls = await (await x.laSoGhi(yc('/api/la-so', { method: 'POST', cookie: ck, body: { thongTinSinh: { lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 10, phut: 30, gioiTinh: 'nu' } } }), M)).json();
  const mua = async (goi, nhanh, soTienGia = undefined) => {
    const r = await x.donHangTao(yc('/api/don-hang', { method: 'POST', cookie: ck + (nhanh ? '; xtv_nhanh=' + nhanh : ''), body: { maGoi: goi, laSoId: ls.id, soTien: soTienGia } }), M);
    const don = await r.json();
    const t = await x.thanhToanGiaLap(yc('/api/thanh-toan/gia-lap', { method: 'POST', cookie: ck, body: { donHangId: don.id } }), M);
    assert.equal(t.status, 200);
    return M.db.prepare('SELECT so_tien AS s FROM don_hang WHERE id=?').get(don.id).s;
  };
  datCfg(CFG(true, 'a'));
  assert.equal(await mua('tron-la-so', 'a.thu'), 129000);
  assert.equal(await mua('tron-la-so', 'a.goc'), 99000);
  assert.equal(await mua('tron-la-so', undefined), 99000);
  assert.equal(await mua('tron-la-so', 'a.thu', 1), 129000); // số tiền trình duyệt gửi bị bỏ qua
  datCfg(CFG(true, 'b'));
  assert.equal(await mua('thanh-vien-nam', 'b.thu'), 100000); // 199000 trừ 99000 (đã mua Trọn lá số ở trên, trần = giá Trọn lá số)
  assert.equal(await mua('tron-la-so', 'b.thu'), 99000);
  datCfg(CFG(false));
  assert.equal(await mua('tron-la-so', 'a.thu'), 99000);
  assert.equal(await mua('thanh-vien-nam', 'b.thu'), 200000); // giá hiện hành 299000 trừ trần 99000 (lại có Trọn lá số mua sau lần nâng trước)
});

test('Báo cáo theo nhánh: đúng mẫu số, doanh thu/phiên, tỉ trọng gói, bao_loi, nhóm nguồn', () => {
  const ev = [];
  const e = (ten, phien, x = {}) => ev.push({ t: 1, ten, phien, ...x });
  const nh = (n, goi, gia) => ({ goi, gia, nhanh: n, thu: 'a' });
  e('vao_trang', 'P1', { nhom: 'paid' }); e('chon_goi', 'P1', nh('goc', 'tron-la-so', 99000)); e('thanh_toan_xong', 'P1', nh('goc', 'tron-la-so', 99000));
  e('vao_trang', 'P2', { nhom: 'paid' }); e('chon_goi', 'P2', nh('goc', 'thanh-vien-nam', 299000));
  e('vao_trang', 'P3', { nhom: 'tuvi-vn' }); e('chon_goi', 'P3', nh('thu', 'tron-la-so', 129000)); e('thanh_toan_xong', 'P3', nh('thu', 'tron-la-so', 129000));
  e('vao_trang', 'P4', { nhom: 'tuvi-vn' }); e('chon_goi', 'P4', nh('thu', 'tron-la-so', 129000));
  e('thanh_toan_xong', 'P5', nh('thu', 'tron-la-so', 129000)); // không có chon_goi: không tính
  e('bao_loi', 'P9', nh('thu', 'tron-la-so')); // báo lỗi ở phiên khác vẫn tính đúng nhánh
  const t = tinhTheoNhanh(ev);
  assert.deepEqual(Object.keys(t), ['a/goc', 'a/thu']);
  assert.equal(t['a/goc'].chon, 2); assert.equal(t['a/goc'].don, 1); assert.equal(t['a/goc'].doanhThuMoiPhien, 49500);
  assert.equal(t['a/thu'].chon, 2); assert.equal(t['a/thu'].doanhThu, 129000); assert.equal(t['a/thu'].doanhThuMoiPhien, 64500);
  assert.equal(t['a/goc'].tiTrongGoi['thanh-vien-nam'], 0.5);
  assert.equal(t['a/thu'].baoLoi, 1); assert.equal(t['a/thu'].baoLoiTrenDon, 1); assert.equal(t['a/goc'].baoLoi, 0);
  assert.deepEqual(t['a/goc'].nguon.paid, { chon: 2, don: 1, doanhThu: 99000 });
  assert.match(bangNhanh(t, true), /\| a\/thu \| paid|\| a\/thu \| tuvi-vn/);
});

test('Số giả lập hai nhánh: báo cáo in đủ cột cho cả hai nhánh', () => {
  const md = bangNhanh(tinhTheoNhanh(taoGiaLap(7, true)), true);
  for (const c of ['Phiên chon_goi', 'Doanh thu / phiên', 'Tỉ trọng tron-la-so', 'bao_loi / đơn', 'Nhóm nguồn', 'a/goc', 'a/thu']) assert.ok(md.includes(c), c);
  assert.equal(bangNhanh(tinhTheoNhanh(taoGiaLap(7, false)), true).startsWith('Chưa có'), true);
});

const TB = 'tbAAAAAAAAAAAAAAAA', TB2 = 'tbBBBBBBBBBBBBBBBB';

test('Mã thiết bị: cấp một lần, giữ nguyên qua các lần tải; cookie cũ chưa có mã giữ nhánh và được cấp mã', async () => {
  datCfg(CFG(true));
  const ck = cookieNhanh(await gia.GET(yc('/api/gia')));
  const tb = ck.split('.')[2];
  for (let i = 0; i < 3; i++) assert.equal((await gia.GET(yc('/api/gia', { cookie: 'xtv_nhanh=' + ck }))).headers.get('set-cookie'), null);
  assert.equal(tg.nhanhDaGan(yc('/', { cookie: 'xtv_nhanh=' + ck })).thietBi, tb);
  const cu = cookieNhanh(await gia.GET(yc('/api/gia', { cookie: 'xtv_nhanh=a.thu' })));
  assert.match(cu, /^a\.thu\.[A-Za-z0-9_-]{16,32}$/);
  assert.notEqual(cu.split('.')[2], tb);
  assert.equal(tg.nhanhDaGan(yc('/', { cookie: 'xtv_nhanh=a.thu.ngan' })).thietBi, undefined); // mã sai định dạng không nhận
  assert.equal(tg.nhanhDaGan(yc('/', { cookie: 'xtv_nhanh=a.thu.' + TB + '.x' })), null);
});

test('kiemTraSuKien: thietBi kiểm định dạng, cho mọi sự kiện', () => {
  assert.deepEqual(kiemTraSuKien({ ten: 'vao_form', phien: P, thietBi: TB }), { ten: 'vao_form', phien: P, thietBi: TB });
  assert.deepEqual(kiemTraSuKien({ ten: 'bao_loi', phien: P, thietBi: TB }), { ten: 'bao_loi', phien: P, thietBi: TB });
  for (const xau of ['ngan', 'có dấu!!!!!!!!!!!!!!', 'a'.repeat(40), 5, null]) assert.equal(kiemTraSuKien({ ten: 'vao_form', phien: P, thietBi: xau }), null);
});

test('Sự kiện: thietBi từ cookie gắn mọi sự kiện; bao_loi (không gói) mang nhanh theo thiết bị', async () => {
  datCfg(CFG(true));
  const ck = 'xtv_nhanh=a.thu.' + TB;
  const gui = (body, cookie = ck) => apiSuKien.POST(yc('/api/su-kien', { method: 'POST', cookie, body }));
  assert.equal((await gui({ ten: 'bao_loi', phien: 'q1' + P })).status, 204);
  assert.equal((await gui({ ten: 'vao_form', phien: 'q2' + P, thietBi: TB2 })).status, 204); // mã khai bị thay bằng mã cookie
  assert.equal((await gui({ ten: 'vao_form', phien: 'q3' + P }, null)).status, 204); // chưa có cookie: không thietBi
  assert.equal((await gui({ ten: 'vao_trang', phien: 'q4' + P, dich: '/', may: 'dien-thoai' })).status, 204);
  const ds = docSk(), l = (p) => ds.find((d) => d.phien === p + P);
  assert.deepEqual([l('q1').ten, l('q1').nhanh, l('q1').thu, l('q1').thietBi], ['bao_loi', 'thu', 'a', TB]);
  assert.equal(l('q2').thietBi, TB); assert.equal(l('q2').nhanh, undefined);
  assert.equal(l('q3').thietBi, undefined);
  assert.equal(l('q4').thietBi, TB);
  datCfg(CFG(false));
  await gui({ ten: 'bao_loi', phien: 'q5' + P });
  assert.deepEqual([docSk().find((d) => d.phien === 'q5' + P)].map((d) => [d.nhanh, d.thietBi]), [[undefined, undefined]]);
});

test('Doanh thu chỉ tính phiên có chon_goi; giá trị phiên = tổng mọi thanh_toan_xong', () => {
  const ev = [], e = (ten, phien, x = {}) => ev.push({ t: 1, ten, phien, ...x });
  const nh = (n, gia, tb) => ({ goi: 'tron-la-so', gia, nhanh: n, thu: 'a', thietBi: tb });
  e('chon_goi', 'S1', nh('goc', 99000, 'd1')); e('thanh_toan_xong', 'S1', nh('goc', 29000, 'd1')); e('thanh_toan_xong', 'S1', nh('goc', 99000, 'd1')); // mua hai lần: 128000
  e('thanh_toan_xong', 'S2', nh('goc', 99000, 'd2')); // chỉ có thanh_toan_xong: không vào doanh thu, không vào mẫu số
  e('chon_goi', 'S3', nh('goc', 99000, 'd3'));
  const t = tinhTheoNhanh(ev)['a/goc'];
  assert.equal(t.chon, 2); assert.equal(t.don, 1); assert.equal(t.doanhThu, 128000); assert.equal(t.doanhThuMoiPhien, 64000);
  assert.deepEqual(phienChonGoi(ev).hang.map((h) => h.phien), ['S1', 'S3']);
});

test('Thiết bị xuất hiện ở cả hai nhánh bị loại khỏi báo cáo, bootstrap và CSV (kể cả bao_loi)', () => {
  const ev = [], e = (ten, phien, x = {}) => ev.push({ t: 1, ten, phien, ...x });
  const nh = (n, tb) => ({ goi: 'tron-la-so', gia: 99000, nhanh: n, thu: 'a', thietBi: tb });
  e('chon_goi', 'T1', nh('goc', 'x1')); e('chon_goi', 'T2', nh('thu', 'x1')); // x1 thấy cả hai nhánh
  e('chon_goi', 'T3', nh('goc', 'x2')); e('thanh_toan_xong', 'T3', nh('goc', 'x2'));
  e('chon_goi', 'T4', nh('thu', 'x3'));
  e('bao_loi', 'T9', nh('thu', 'x1')); e('bao_loi', 'T8', nh('thu', 'x3'));
  const pc = phienChonGoi(ev);
  assert.deepEqual(pc.hang.map((h) => h.phien).sort(), ['T3', 'T4']);
  const t = tinhTheoNhanh(ev);
  assert.equal(t['a/goc'].chon, 1); assert.equal(t['a/thu'].chon, 1); assert.equal(t['a/thu'].baoLoi, 1);
  const csv = csvNhanh(pc.hang).split('\n');
  assert.equal(csv[0], 'phien,thietBi,nhanh,doanhThu'); assert.deepEqual(csv.slice(1).sort(), ['T3,x2,a/goc,99000', 'T4,x3,a/thu,0']);
});

// Dữ liệu giả hai nhánh biết trước: gốc 1000 phiên, 25% trả 99.000đ (TB 24.750đ); thử 1000 phiên, 30% trả 129.000đ (TB 38.700đ) → chênh thật 13.950đ.
const hangBiet = () => {
  const h = [];
  for (let i = 0; i < 1000; i++) h.push({ phien: 'g' + i, thietBi: 'dg' + i, nhanh: 'a/goc', goi: 'tron-la-so', doanhThu: i < 250 ? 99000 : 0, tra: i < 250 ? 1 : 0, nam: i < 50 ? 1 : 0 });
  for (let i = 0; i < 1000; i++) h.push({ phien: 't' + i, thietBi: 'dt' + i, nhanh: 'a/thu', goi: 'tron-la-so', doanhThu: i < 300 ? 129000 : 0, tra: i < 300 ? 1 : 0, nam: i < 100 ? 1 : 0 });
  return h;
};

test('Bootstrap: hạt cố định lặp lại y hệt; hạt khác cho số khác', () => {
  const a = bootstrap(hangBiet(), { lan: 2000, hat: 42 }), b = bootstrap(hangBiet(), { lan: 2000, hat: 42 }), c = bootstrap(hangBiet(), { lan: 2000, hat: 43 });
  assert.deepEqual(a, b);
  assert.notEqual(a.a.doanhThu.thap, c.a.doanhThu.thap);
});

test('Bootstrap: khoảng 95% chứa đúng giá trị biết trước và kết luận đúng', () => {
  const r = bootstrap(hangBiet(), { lan: 10000, hat: 42 }).a;
  assert.equal(r.lan, 10000); assert.equal(r.hat, 42); assert.deepEqual(r.co, { goc: 1000, thu: 1000 });
  assert.equal(r.doanhThu.goc, 24750); assert.equal(r.doanhThu.thu, 38700); assert.equal(r.doanhThu.chenh, 13950);
  assert.ok(r.doanhThu.thap < 13950 && 13950 < r.doanhThu.cao, JSON.stringify(r.doanhThu));
  assert.ok(r.doanhThu.thap > 0 && r.doanhThu.ketLuan === 'thắng');
  assert.ok(Math.abs(r.tra.chenh - 0.05) < 1e-9 && r.tra.thap < 0.05 && 0.05 < r.tra.cao && r.tra.thap > 0);
  assert.ok(Math.abs(r.nam.chenh - 0.05) < 1e-9 && r.nam.thap < 0.05 && 0.05 < r.nam.cao);
  // không chênh lệch thật → hòa; chênh âm → thua
  const hoa = hangBiet().map((h) => (h.nhanh === 'a/thu' ? { ...h, doanhThu: h.phien === 't0' ? 0 : h.doanhThu } : h)).map((h, i) => (h.nhanh === 'a/thu' ? { ...h, doanhThu: [99000, 0, 0, 0][i % 4], tra: [1, 0, 0, 0][i % 4] } : h));
  assert.equal(bootstrap(hoa, { lan: 3000, hat: 1 }).a.doanhThu.ketLuan, 'hòa');
  const thua = hangBiet().map((h) => (h.nhanh === 'a/thu' ? { ...h, doanhThu: 0, tra: 0 } : h));
  assert.equal(bootstrap(thua, { lan: 3000, hat: 1 }).a.doanhThu.ketLuan, 'thua');
  assert.equal(bootstrap(hangBiet().filter((h) => h.nhanh === 'a/goc'), { lan: 10, hat: 1 }).a.thieu, true);
});
