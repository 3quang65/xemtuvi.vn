// Làm sạch văn bản tự do của khách trước khi lưu: bỏ ký tự điều khiển (kể cả null byte), thẻ HTML/script, rồi cắt độ dài.
// eslint-disable-next-line no-control-regex
const DIEU_KHIEN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function lamSachVanBan(s: string, toiDa = 1000, nhieuDong = false): string {
  let t = s.normalize('NFC').replace(DIEU_KHIEN, '');
  t = t.replace(/<\s*(script|style)\b[\s\S]*?(<\s*\/\s*\1\s*>|$)/gi, ''); // cả khối script/style, kể cả chưa đóng
  t = t.replace(/<\/?[a-z!][^>]*>?/gi, ''); // thẻ còn lại, kể cả thẻ chưa đóng
  t = t.replace(/[<>]/g, ''); // không để sót dấu mở thẻ
  t = nhieuDong ? t.replace(/\r\n?/g, '\n') : t.replace(/\s+/g, ' ');
  return t.trim().slice(0, toiDa);
}
