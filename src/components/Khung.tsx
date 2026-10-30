export function DauTrang() {
  return (
    <header className="dau-trang">
      <a href="/" className="ten-trang">xemtuvi<span>.vn</span></a>
    </header>
  );
}

export function ChanTrang() {
  return (
    <footer className="chan-trang">
      <p>
        Nội dung trên xemtuvi.vn mang tính tham khảo văn hóa và tự tìm hiểu bản thân. Mọi quyết định trong cuộc sống
        nên dựa trên hoàn cảnh thực tế và ý kiến của người có chuyên môn.
      </p>
      <p>© {new Date().getFullYear()} xemtuvi.vn</p>
    </footer>
  );
}
