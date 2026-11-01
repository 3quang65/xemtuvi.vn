// L-03928b: giọng giao diện — không mê tín, không "giải hạn"; xưng hô nhất quán.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

function tep(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return tep(p);
    return /\.(tsx?|css)$/.test(e.name) ? [p] : [];
  });
}
const goc = path.join(__dirname, '..', 'src');
const files = [...tep(path.join(goc, 'components')), ...tep(path.join(goc, 'app'))];

test('giao diện không có từ cấm (mê tín / giải hạn)', () => {
  const cam = /giải hạn|cúng|cầu an|hóa giải|trừ tà|yểm|bùa|giải sao|dâng sao|linh nghiệm|cầu duyên/i;
  const vi_pham = [];
  for (const f of files) fs.readFileSync(f, 'utf8').split('\n').forEach((d, i) => { if (cam.test(d)) vi_pham.push(`${path.relative(goc, f)}:${i + 1}`); });
  assert.deepStrictEqual(vi_pham, []);
});

test('giao diện xưng hô nhất quán: không dùng "chúng mình"', () => {
  const vi_pham = files.filter((f) => /chúng mình/i.test(fs.readFileSync(f, 'utf8'))).map((f) => path.relative(goc, f));
  assert.deepStrictEqual(vi_pham, []);
});
