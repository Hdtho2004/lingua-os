# Lingua OS v4 — Thọ & Thương

Bản thiết kế lại theo phản hồi: trang chào chỉ chọn Thọ/Thương; **Learning Journey xuất hiện bên trong Tổng quan của Thọ**, không xuất hiện ở trang chọn người. Môn > bài học > lý thuyết > thực hành > kết quả. Không biến sustain/maintain thành môn riêng.

## Chức năng
- 2 hồ sơ độc lập, lưu bằng IndexedDB, sao lưu/khôi phục JSON.
- Thọ: English Foundations, Communication Lab, Mandarin Foundations, Mandarin Everyday. Thương: học phần Y đa khoa để trống chờ tài liệu có nguồn.
- 8 bài học mẫu có nội dung và **10 hoạt động/bài** (80 hoạt động), 4 kiểu: trắc nghiệm, ghép cặp, sắp xếp câu, điền từ. Mốc đạt mặc định ≥80%.
- Tự động ghi tiến độ và tạo flashcard sau khi vượt bài. Flashcard ôn lại giãn cách theo mức độ nhớ (thuật toán giản lược, **không phải FSRS**).
- Nhập gói bài học JSON mới vào các môn hiện có, giữ nguyên dữ liệu học tập qua các lần tải lại. Gói bài học import phải theo cấu trúc như `content.js`.
- Responsive, PWA và service worker cache để chạy offline sau lần mở mạng đầu tiên thành công. Font dùng từ Google Fonts khi có mạng; tự fallback khi offline.

## Triển khai GitHub Pages
1. Tải toàn bộ các tệp trong ZIP vào gốc repository GitHub công khai.
2. Settings → Pages → Deploy from branch → main → root.
3. Truy cập `https://USERNAME.github.io/REPOSITORY/`. Không cần API trả phí.
4. Sao lưu JSON định kỳ. **Không có tự đồng bộ** giữa hai trình duyệt/thiết bị.

## Dữ liệu từ v3
Bản v4 dùng cơ sở dữ liệu **`lingua-os-v4` riêng** để không vô tình ghi đè dữ liệu v3. Sao lưu của v3 không nhập trực tiếp vào v4 (cấu trúc đã thay đổi); cần chuyển đổi dữ liệu nếu bạn đã có nhiều tiến độ cũ. Trước khi thay bản cũ, nên xuất bản sao lưu v3.

## Nội dung học
Đây là nền bài học minh họa tự biên soạn và có độ bao phủ lớn hơn phiên bản trước, không thay thế bộ giáo trình đầy đủ hoặc kiểm tra 4 kỹ năng. Chưa tích hợp nghe chuẩn, nhận diện giọng nói hay chấm bài tự luận. Sẽ nhập tài liệu của Thọ và Thương theo từng học phần ở các bản sau.
