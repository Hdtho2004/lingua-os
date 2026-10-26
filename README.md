# Lingua OS v9 — UI & study flow fix

- Trang đầu chỉ hiển thị câu hỏi “Ai đang học hôm nay?” và hai hồ sơ.
- Avatar Thọ: 文, Thương: biểu tượng trái tim vector.
- Câu hỏi đọc hiểu hiển thị đoạn văn ngay phía trên câu hỏi. Không cần quay lại phần lý thuyết.
- Mỗi bài mẫu có 30 hoạt động, đã thay phần lớn câu ôn lặp bằng bài khác.
- Lộ trình chỉ xuất hiện sau khi chọn Thọ.
- Giữ IndexedDB `lingua-os-v7` để không đổi nơi lưu dữ liệu so với bản v8; dữ liệu cũ trên phiên bản v4/v5 cần sao lưu riêng.
- GitHub Pages: upload nội dung *bên trong* thư mục này lên root của repository. Không upload cả thư mục mẹ.
- Dùng query version trên CSS/JS; bản này không đăng ký Service Worker mới.
- Vẫn có hạn chế: phần nghe nói chưa tích hợp và chấm tự động; chưa có bộ giáo trình toàn diện.
