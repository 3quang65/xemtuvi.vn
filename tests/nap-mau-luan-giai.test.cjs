// L-f17d6e: nạp quét từ 1/10 — phải có Vận năm VN01–03, chạy lại không trùng.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const KHO = fs.mkdtempSync(path.join(os.tmpdir(), 'nap-'));
process.env.MAU_LUAN_GIAI_DIR = KHO;
const L = require('../tools/lib/mau-luan-giai.cjs');
const CLI = path.join(__dirname, '../tools/nap-mau-luan-giai.cjs');
const nap = () => spawnSync('node', [CLI], { encoding: 'utf8', env: { ...process.env, MAU_LUAN_GIAI_DIR: KHO } });

test('nạp Vận năm VN01–03: VN01, VN03 dương; VN02 âm (Đúng 6); chạy lại không trùng', () => {
  const r1 = nap();
  assert.equal(r1.status, 0, r1.stderr);
  const vn = L.docTatCa().filter((m) => m.chuyenDe === 'van-nam');
  assert.equal(vn.length, 3);
  assert.deepEqual(vn.map((m) => m.loai).sort(), ['am', 'duong', 'duong']);
  const tong = L.docTatCa().length;
  const r2 = nap();
  assert.equal(r2.status, 0, r2.stderr);
  assert.equal(L.docTatCa().length, tong);
});
