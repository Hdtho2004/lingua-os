# Lingua OS v11 — Thọ & Thương

Web app tĩnh: GitHub Pages + IndexedDB, không có phí máy chủ.

- Trang đầu: chọn Thọ/Thương, không hiển thị roadmap chung.
- Mỗi người một mục Tutor với lịch sử hoàn toàn riêng. **Chế độ Tutor hiện tại chỉ tra cứu nội dung học có sẵn**, chưa phải LLM thật và chưa gửi dữ liệu lên dịch vụ bên ngoài. Có nút sao chép câu hỏi và mở ChatGPT nếu người học muốn.
- Phát âm thử nghiệm bằng Web Speech API của trình duyệt cho ví dụ tiếng Anh và tiếng Trung; chất lượng, voice và khả năng offline phụ thuộc nền tảng. Không xem TTS là thước đo phát âm chuẩn Pinyin.
- Giữ lại các bài học, 30 hoạt động/bài trong bộ mẫu, sửa sai bắt buộc của v10.
- Giữ tên IndexedDB `lingua-os-v7` để không tự mất dữ liệu từ v7–v10. Sao lưu JSON trước khi cập nhật.
- Bản v11 không đăng ký Service Worker; muốn hỗ trợ offline hoàn chỉnh và cập nhật tự động cần triển khai PWA/cache phiên bản có kiểm thử.

## Triển khai
Upload **các file bên trong thư mục này** vào root của repository (cùng cấp `index.html`). GitHub Pages: main / root.
