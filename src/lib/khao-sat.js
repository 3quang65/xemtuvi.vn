// Lời góp ý (b) của khảo sát 'đáng tiền' (khao-sat-dang-tien_v1.md mục 5). Lưu riêng, ngoài thư mục sự kiện; KHÔNG chứa dữ liệu sinh.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { MA_GOI } = require('./goi-ma.js');
const { MA_BAI } = require('./su-kien.js');

const TOI_DA = 300;

/** Thư mục lưu phản hồi (KHAO_SAT_DIR, mặc định ~/xemtuvi-data/khao-sat); khác hẳn thư mục sự kiện mà pheu.cjs đọc. */
const thuMuc = () => process.env.KHAO_SAT_DIR || path.join(os.homedir(), 'xemtuvi-data', 'khao-sat');
const tepPhanHoi = () => path.join(thuMuc(), 'phan-hoi.jsonl');

/** Nhận {bai, goi, diem_a, loi}; trả bản sạch (lời đã cắt cứng 300 ký tự, bỏ khoảng trắng đầu/cuối) hoặc null. Lời trống cũng là sai: không có gì để lưu. */
function kiemPhanHoi(b) {
  if (!b || typeof b !== 'object' || Array.isArray(b)) return null;
  if (Object.keys(b).some((k) => !['bai', 'goi', 'diem_a', 'loi'].includes(k))) return null;
  if (!MA_BAI.includes(b.bai) || !MA_GOI.includes(b.goi)) return null;
  if (![1, 2, 3, 4, 5].includes(b.diem_a)) return null;
  if (typeof b.loi !== 'string') return null;
  const loi = Array.from(b.loi.trim()).slice(0, TOI_DA).join('');
  if (!loi) return null;
  return { bai: b.bai, goi: b.goi, diem_a: b.diem_a, loi };
}

let hang = Promise.resolve(); // nối tuần tự trong một tiến trình để mã PH không trùng
/** Ghi một phản hồi; trả mã PH-xxx tăng dần (đọc mã lớn nhất trong tệp). */
function luuPhanHoi(p, bayGio = Date.now()) {
  const lam = async () => {
    fs.mkdirSync(thuMuc(), { recursive: true });
    let max = 0;
    if (fs.existsSync(tepPhanHoi())) {
      for (const l of fs.readFileSync(tepPhanHoi(), 'utf8').split('\n')) {
        const m = /"ma":"PH-(\d+)"/.exec(l);
        if (m) max = Math.max(max, Number(m[1]));
      }
    }
    const ma = 'PH-' + String(max + 1).padStart(3, '0');
    fs.appendFileSync(tepPhanHoi(), JSON.stringify({ ma, t: bayGio, ...p }) + '\n', { mode: 0o600 });
    return ma;
  };
  const kq = hang.then(lam);
  hang = kq.catch(() => {});
  return kq;
}

module.exports = { TOI_DA, thuMuc, tepPhanHoi, kiemPhanHoi, luuPhanHoi };
