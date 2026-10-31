// Kiểm thử công cụ "Sinh con 2027 hợp bố mẹ": 5 ca mục 8, bảng 6.2 (49 năm), so với bản kiểm tham chiếu kiem.py, lời khách.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const nap = require('./_nap-ts.cjs');
const sc = nap('lib/sinh-con-2027/index.ts');

const GOC = path.join(__dirname, '..');
const QUY_TAC = fs.readFileSync(path.join(GOC, 'docs/san-pham/sinh-con-2027-quy-tac.md'), 'utf8');
const MUC_VI = { 'Thuận': 'thuan', 'Cân bằng': 'can-bang', 'Khác nhịp': 'can-luu-y' };

test('5 ca mẫu mục 8 (ca 5: sinh 01/02/1991 dương = trước Tết, năm âm 1990)', () => {
  const ca = [
    [{ nam: 1980 }, { nam: 1984 }, 2, 'thuan'],
    [{ nam: 2002 }, { nam: 1993 }, 3, 'thuan'],
    [{ nam: 1990 }, { nam: 1992 }, 1, 'can-bang'],
    [{ nam: 1986 }, { nam: 1991 }, -2, 'can-luu-y'],
    [{ nam: 1986 }, { nam: 1991, thang: 2, ngay: 1 }, -1, 'can-bang'],
  ];
  for (const [b, m, t, muc] of ca) {
    const r = sc.danhGia(b, m);
    assert.equal(r.tong, t); assert.equal(r.muc, muc);
  }
  const me = sc.motNguoi({ nam: 1991, thang: 2, ngay: 1 });
  assert.equal(me.truocTet, true); assert.equal(me.namAm, 1990); assert.equal(`${me.can} ${me.chi}`, 'Canh Ngọ');
});

test('Bảng 6.2: đủ 49 năm 1960–2008 khớp can chi, hành, A, B, s', () => {
  const dong = [...QUY_TAC.matchAll(/^\| (19[6-9]\d|200\d) \| ([^|]+) \| (\S+) \| (-?\d|\+\d) \| (-?\d|\+\d) \| (-?\d|\+\d) \|$/gm)];
  assert.equal(dong.length, 49);
  for (const [, nam, cc, hanh, a, b, s] of dong) {
    const n = sc.motNguoi({ nam: Number(nam) });
    assert.equal(`${n.can} ${n.chi}`, cc.trim(), nam);
    assert.equal(n.hanh, hanh, nam);
    assert.equal(n.A, Number(a), nam); assert.equal(n.B, Number(b), nam); assert.equal(n.s, Number(s), nam);
  }
});

test('Khớp kiem.py: mọi năm 1960–2010 và mọi cặp 1960–2010 (51×51)', (t) => {
  const kiem = path.join(GOC, 'docs/san-pham/sinh-con-2027-kiem.py');
  const code = `import sys,json,importlib.util as u\nsp=u.spec_from_file_location('k',sys.argv[1]);k=u.module_from_spec(sp);sp.loader.exec_module(k)\n`
    + `print(json.dumps({'n':{y:k.mot_nguoi(y) for y in range(1960,2011)},'m':[[k.ket_qua(a,b)[3] for b in range(1960,2011)] for a in range(1960,2011)]}))`;
  const r = spawnSync('python3', ['-I', '-c', code, kiem], { encoding: 'utf8' });
  if (r.error || r.status !== 0) return t.skip('không có python3');
  const py = JSON.parse(r.stdout);
  for (let y = 1960; y <= 2010; y++) {
    const n = sc.motNguoi({ nam: y }), p = py.n[y];
    assert.deepEqual([`${n.can} ${n.chi}`, n.hanh, n.A, n.B, n.s], [p.canchi, p.hanh, p.A, p.B, p.s], String(y));
  }
  for (let a = 1960; a <= 2010; a++) for (let b = 1960; b <= 2010; b++)
    assert.equal(sc.danhGia({ nam: a }, { nam: b }).muc, MUC_VI[py.m[a - 1960][b - 1960]], `${a}/${b}`);
});

test('Bảng Tết trong mã khớp bảng mục 4 của tài liệu (51 năm 1960–2010)', () => {
  const muc4 = QUY_TAC.split('## 4.')[1].split('## 5.')[0];
  const cap = [...muc4.matchAll(/(19[6-9]\d|20[01]\d) \| (\d+)\/(\d+)/g)];
  assert.equal(cap.length, 51);
  for (const [, y, d, m] of cap) assert.deepEqual(sc.tetCuaNam(Number(y)), [Number(d), Number(m)], y);
});

test('Tết: sinh đúng mùng 1 thì thuộc năm mới, trước 1 ngày thì năm trước; tháng 3 trở đi không đổi', () => {
  assert.equal(sc.motNguoi({ nam: 1991, thang: 2, ngay: 15 }).namAm, 1991);
  assert.equal(sc.motNguoi({ nam: 1991, thang: 2, ngay: 14 }).namAm, 1990);
  assert.equal(sc.motNguoi({ nam: 1985, thang: 1, ngay: 21 }).namAm, 1985); // Tết Việt 21/1/1985
  assert.equal(sc.motNguoi({ nam: 1985, thang: 1, ngay: 20 }).namAm, 1984);
  assert.equal(sc.motNguoi({ nam: 1960, thang: 1, ngay: 1 }).namAm, 1959);
  assert.equal(sc.motNguoi({ nam: 1991 }).chuaBietTet, true);
});

test('Kiểm đầu vào', () => {
  for (const n of [{ nam: 1959 }, { nam: 2011 }, { nam: 1990.5 }, { nam: NaN }, { nam: 1990, thang: 2 }, { nam: 1990, ngay: 3 },
    { nam: 1990, thang: 3, ngay: 3 }, { nam: 1990, thang: 2, ngay: 30 }, { nam: 1991, thang: 2, ngay: 29 }, { nam: 1991, thang: 1, ngay: 0 }])
    assert.ok(sc.kiemNhap(n), JSON.stringify(n));
  assert.equal(sc.kiemNhap({ nam: 1992, thang: 2, ngay: 29 }), null);
  assert.throws(() => sc.motNguoi({ nam: 1950 }), RangeError);
});

test('Lời khách: nguyên văn đã duyệt, không Nguồn:, không tên sách cổ, không câu khắc bé', () => {
  const tat = JSON.stringify([sc.LOI_MUC, sc.CAU_TRUONG_PHAI, sc.GHI_CHU_BE, sc.GHI_CHU_BO_QUA_NGAY, sc.CTA_LA_SO, sc.CTA_VAN_2027]);
  const loi = fs.readFileSync(path.join(GOC, 'docs/san-pham/sinh-con-2027-loi.md'), 'utf8');
  for (const m of Object.values(sc.LOI_MUC)) assert.ok(loi.includes(m.loi), m.tieuDe);
  assert.ok(loi.includes(sc.CAU_TRUONG_PHAI.replace('không phải phép an sao Tử Vi Đẩu Số;', '**không phải phép an sao Tử Vi Đẩu Số**;')));
  assert.ok(loi.includes(sc.CTA_LA_SO.dan) && loi.includes(sc.CTA_VAN_2027.dan) && loi.includes(sc.GHI_CHU_BE) && loi.includes(sc.GHI_CHU_BO_QUA_NGAY));
  const dong = [];
  for (let y = 1960; y <= 2010; y++) { const n = sc.motNguoi({ nam: y }); dong.push(sc.dongNguoi(n, 'bố'), sc.dongNguoi(n, 'mẹ'), sc.canChiDaDung(n)); }
  assert.equal(sc.dongNguoi(sc.motNguoi({ nam: 1990 }), 'bố'), 'mệnh Lộ Bàng Thổ: tuổi Ngọ lục hợp với tuổi Mùi của bé; Thổ khắc Thủy, một điểm khác nhịp theo vòng ngũ hành.');
  const khach = tat + dong.join('\n');
  assert.doesNotMatch(khach, /Nguồn\s*:/i);
  assert.doesNotMatch(khach, /Tam Mệnh|Hiệp Kỷ|Thông Hội|Biện Phương|khắc bé|khắc con/i);
});
