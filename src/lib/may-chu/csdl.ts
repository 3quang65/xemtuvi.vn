// Lớp CSDL duy nhất (SQLite). Mọi nơi khác gọi qua đây; đổi sang PostgreSQL sau chỉ thay file này.
import Database from 'better-sqlite3';
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { taoBoKhoa, thuMucDuLieu, type BoKhoa } from './ma-hoa';

export type Csdl = Database.Database;

const THU_MUC_MIGRATIONS = () => path.join(process.cwd(), 'src', 'lib', 'may-chu', 'migrations');

/** Chạy các migrations/NNN-*.sql chưa chạy, theo thứ tự, mỗi tệp một giao dịch. */
export function chayMigrations(db: Csdl, thuMuc = THU_MUC_MIGRATIONS()) {
  db.exec('CREATE TABLE IF NOT EXISTS migrations (ten TEXT PRIMARY KEY, luc INTEGER NOT NULL)');
  const da = new Set((db.prepare('SELECT ten FROM migrations').all() as { ten: string }[]).map((r) => r.ten));
  for (const ten of readdirSync(thuMuc).filter((t) => /^\d+-.*\.sql$/.test(t)).sort()) {
    if (da.has(ten)) continue;
    const sql = readFileSync(path.join(thuMuc, ten), 'utf8');
    db.transaction(() => { db.exec(sql); db.prepare('INSERT INTO migrations (ten, luc) VALUES (?, ?)').run(ten, Date.now()); })();
  }
}

export function moCsdl(duongDan: string, thuMuc?: string): Csdl {
  if (duongDan !== ':memory:') mkdirSync(path.dirname(duongDan), { recursive: true });
  const db = new Database(duongDan);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');
  chayMigrations(db, thuMuc);
  return db;
}

export interface MayChu { db: Csdl; khoa: BoKhoa }
const g = globalThis as unknown as { __xtvMayChu?: MayChu };

/** CSDL dùng chung của tiến trình. Thiếu KHOA_DU_LIEU → ném LoiKhoa, không chạy. */
export function layMayChu(): MayChu {
  if (!g.__xtvMayChu) {
    const khoa = taoBoKhoa(); // kiểm khóa trước khi mở dữ liệu
    g.__xtvMayChu = { db: moCsdl(path.join(thuMucDuLieu(), 'csdl', 'xemtuvi.db')), khoa };
  }
  return g.__xtvMayChu;
}
