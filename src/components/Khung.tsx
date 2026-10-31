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
      <p><a href="/tro-giup">Trợ giúp</a> · <a href="/phuong-phap">Phương pháp &amp; nguồn</a> · <a href="/quyen-rieng-tu">Quyền riêng tư</a></p>
      <p>© {new Date().getFullYear()} xemtuvi.vn</p>
    </footer>
  );
}
