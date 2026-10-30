// L-d9246d: dòng "Căn cứ" dưới mỗi nhận định.
const test = require('node:test');
const assert = require('node:assert/strict');
const nap = require('./_nap-ts.cjs');
const { dongCanCu } = nap('lib/luan-giai/can-cu.ts');

test('đủ sao, yếu tố, cung, nguồn, trường phái', () => {
  assert.equal(
    dongCanCu({ sao: ['Thiên Cơ', 'Thái Âm'], yeuTo: ['Cách Cơ Nguyệt Đồng Lương'], cung: 'Mệnh', nguon: 'Toàn Thư', truongPhai: 'Tam hợp phái Việt' }),
    'Căn cứ: sao Thiên Cơ, Thái Âm; yếu tố Cách Cơ Nguyệt Đồng Lương; cung Mệnh; nguồn Toàn Thư; trường phái Tam hợp phái Việt');
});
test('không có sao/yếu tố (VAN-CUNG-00/13): chỉ in phần có, không chỗ trống', () => {
  const s = dongCanCu({ sao: [], cung: 'Phúc Đức', nguon: 'Tân Biên', truongPhai: 'Tam hợp phái Việt' });
  assert.equal(s, 'Căn cứ: cung Phúc Đức; nguồn Tân Biên; trường phái Tam hợp phái Việt');
  assert.ok(!/sao|yếu tố|;\s*;|:\s*;/.test(s.replace('trường phái', '')));
});
test('không có gì thì trả chuỗi rỗng', () => assert.equal(dongCanCu({ sao: [] }), ''));
test('mọi nhận định bài Bản thân đều có dòng căn cứ có cung', async () => {
  const { lapLaSo } = nap('lib/tuvi/index.ts');
  const AI = nap('lib/luan-giai/ai/index.ts');
  const ls = lapLaSo({ lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 5, phut: 30, gioiTinh: 'nu' });
  const bai = await AI.sinhLuanGiai(ls, 'menh', { boQuaCache: true });
  for (const m of bai.muc) for (const n of m.nhanDinh) assert.match(dongCanCu(n.thamChieu), /^Căn cứ: .*cung .*nguồn .*trường phái /);
});
// Lá số Phúc kiểm (ky-thuat/kiem-tra-luan-giai-tron-la-so.md): giờ ô thứ 6 = gio 4; tổng 65 nhận định (Vận 10 năm tăng sau khi thêm nhóm VAN-SP, VAN-PP, T-3d77b2; bớt 1 câu SP-08-DAC trùng ý DONGLUC, L-eabb8d).
test('L-6e89d7: mọi nhận định 4 chuyên đề gói Trọn lá số có căn cứ sao hoặc yếu tố (gồm VAN-CUNG cấp cung)', async () => {
  const { lapLaSo } = nap('lib/tuvi/index.ts');
  const AI = nap('lib/luan-giai/ai/index.ts');
  const ls = lapLaSo({ lich: 'duong', ngay: 15, thang: 8, nam: 1995, gio: 4, phut: 30, gioiTinh: 'nu' });
  let dem = 0;
  for (const cd of ['menh', 'phu-the', 'quan-loc', 'van-10-nam']) {
    const bai = await AI.sinhLuanGiai(ls, cd, { boQuaCache: true, namXem: 2026 });
    for (const m of bai.muc) for (const n of m.nhanDinh) {
      dem++;
      const t = n.thamChieu;
      assert.ok(t.sao.length || t.yeuTo?.length, `${cd} ${t.quyTacId} thiếu sao/yếu tố`);
      assert.match(dongCanCu(t), /^Căn cứ: (sao|yếu tố) /);
      if (/^VAN-CUNG-/.test(t.quyTacId)) assert.ok(t.sao.length, `${t.quyTacId} phải có sao`);
    }
    if (cd === 'van-10-nam') {
      const vc = bai.muc.flatMap((m) => m.nhanDinh).filter((n) => /^VAN-CUNG-/.test(n.thamChieu.quyTacId));
      assert.ok(vc.length >= 2, 'phải có VAN-CUNG-00 và câu riêng cung vận');
      // Phúc Đức vô chính diệu: mượn chính tinh cung xung chiếu, ghi yếu tố Vô Chính Diệu.
      const cung = ls.cung.find((c) => c.ten === bai.van.cung);
      assert.equal(cung.chinhTinh.length, 0);
      const xung = ls.cung.find((c) => c.chi === (cung.chi + 6) % 12);
      for (const n of vc) {
        assert.deepEqual(n.thamChieu.sao, xung.chinhTinh.map((s) => s.ten));
        assert.ok(n.thamChieu.sao.length && n.thamChieu.yeuTo.includes('Vô Chính Diệu'));
        assert.match(dongCanCu(n.thamChieu), /^Căn cứ: sao .+; yếu tố Vô Chính Diệu; cung Phúc Đức/);
      }
    }
  }
  // 65 -> 64 (L-28bc46): một câu hợp chiếu của sao Hãm không còn được phát khi chưa có câu C-HAM.
  assert.equal(dem, 64, `có ${dem} nhận định`);
});
