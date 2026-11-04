// L-e1dfa2: 2 test tối thiểu cho script đo trong tools/ (chạy trên chính cây repo).
const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const ROOT = path.join(__dirname, '..');
const chay = (tep, ...args) => execFileSync('node', [path.join(ROOT, 'tools', tep), '--root', ROOT, ...args], { encoding: 'utf8', cwd: ROOT, timeout: 120000 });

test('dem-quy-tac.cjs trả về 4 dòng chỉ tiêu', () => {
  const dong = chay('dem-quy-tac.cjs').split('\n').filter((l) => /^\| (Quy tắc cung|Cặp cung|Số câu)/.test(l));
  assert.strictEqual(dong.length, 4, dong.join('\n'));
});

test('do-dai-chu-mau.cjs --n 1 chạy không lỗi và có cột "Đạt 65–75%"', () => {
  const out = chay('do-dai-chu-mau.cjs', '--n', '1');
  assert.match(out, /Đạt 65–75%/);
});
