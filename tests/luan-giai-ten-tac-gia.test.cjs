// T-a4504a: tên tác giả Tân Biên là "Vân Đằng Thái Thứ Lang" (SPEC mục 13), không "Thái Thúc".
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const dir = path.join(__dirname, '../src/lib/luan-giai/ai');

test('mọi bộ quy tắc luận giải ghi đúng tên tác giả Tân Biên', () => {
  for (const f of ['quy-tac.json', 'quy-tac-khung.json', 'quy-tac-van/van-10-nam.json', 'quy-tac-van/van-nam-2027.json', 'quy-tac-van/tai-bach.json']) {
    const p = path.join(dir, f);
    if (!fs.existsSync(p)) continue;
    assert.ok(!fs.readFileSync(p, 'utf8').includes('Thái Thúc'), `${f} còn "Thái Thúc"`);
  }
});
