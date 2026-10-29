import LapLaSo from '@/components/LapLaSo';

export default function TrangChu() {
  return (
    <>
      <header className="dau-trang">
        <a href="/" className="ten-trang">xemtuvi<span>.vn</span></a>
      </header>

      <main>
        <LapLaSo />

        <section className="gioi-thieu">
          <h2>Lá số được an như thế nào</h2>
          <p>
            Lá số được an theo cách của các sách Tử Vi Việt Nam: đổi ngày sinh sang âm lịch theo múi giờ Việt Nam,
            an cung Mệnh – Thân theo tháng và giờ sinh, định Cục theo nạp âm cung Mệnh, rồi an 14 chính tinh,
            các phụ tinh, tứ hóa theo can năm, Tuần – Triệt, vòng Tràng Sinh và đại vận 10 năm.
          </p>
          <p>
            Mỗi sao kèm độ sáng tại cung: Miếu, Vượng, Đắc, Bình hòa, Hãm. Các điểm mà những trường phái an khác nhau
            sẽ được ghi chú rõ trong phần luận giải.
          </p>
        </section>
      </main>

      <footer className="chan-trang">
        <p>
          Nội dung trên xemtuvi.vn mang tính tham khảo văn hóa và tự tìm hiểu bản thân. Mọi quyết định trong cuộc sống
          nên dựa trên hoàn cảnh thực tế và ý kiến của người có chuyên môn.
        </p>
        <p>© {new Date().getFullYear()} xemtuvi.vn</p>
      </footer>
    </>
  );
}
