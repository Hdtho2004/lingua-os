# Lingua OS — Personal Learning Journey

Web app **100% tĩnh**, không cần backend, database trả phí hay API key. Tối ưu cho lịch 120 phút/ngày: **English 72 phút (60%)** và **Mandarin 48 phút (40%)**.

## Có gì trong MVP?
- Dashboard responsive cho mobile và desktop.
- Kế hoạch học 7 ngày, đánh dấu nhiệm vụ và thống kê tiến độ.
- Flashcards tiếng Anh / Trung, lịch ôn cách quãng đơn giản theo hiệu suất.
- Nhật ký lỗi / bài học / mục tiêu.
- IndexedDB trên thiết bị, xuất / nhập JSON để sao lưu.
- PWA và service worker giúp mở lại khi offline sau lần tải đầu tiên.
- Không tracking, không analytics, không AI API trả phí.

## Chạy trên máy
Không cần cài package:

```bash
cd lingua-os
python -m http.server 8000
```

Mở `http://localhost:8000` trong Chrome/Edge/Firefox. Không nên mở trực tiếp `index.html` bằng `file://` vì IndexedDB và service worker có thể hoạt động không ổn định.

## Đưa lên GitHub Pages miễn phí
1. Tạo tài khoản GitHub nếu chưa có, rồi tạo **public repository** tên `lingua-os`.
2. Tải các file trong thư mục này lên **gốc** repository (Add file → Upload files → Commit).
3. Trong repository chọn **Settings → Pages → Build and deployment**.
4. Chọn **Deploy from a branch**, branch `main`, folder `/(root)`, rồi Save.
5. Link thường có dạng `https://TEN-TAI-KHOAN.github.io/lingua-os/` (thay theo tài khoản thực tế; kiểm tra URL GitHub hiển thị).
6. Trên điện thoại, vào link HTTPS để thêm app vào màn hình chính (nếu trình duyệt hỗ trợ).

## Quyền riêng tư, sao lưu và hạn chế
- Dữ liệu lưu bằng **IndexedDB của riêng trình duyệt và origin**, KHÔNG tự đồng bộ giữa các thiết bị. Nút **Cài đặt → Xuất dữ liệu JSON** và **Nhập bản sao lưu** dùng để chuyển dữ liệu.
- Xóa dữ liệu site, chuyển origin hoặc dùng chế độ ẩn danh có thể khiến dữ liệu không còn. Sao lưu định kỳ.
- Import thay thế dữ liệu hiện tại: sao lưu trước khi import. Không chia sẻ JSON nếu ghi chú chứa thông tin cá nhân.
- App cung cấp **spaced repetition đơn giản**, KHÔNG khẳng định đã tích hợp thuật toán FSRS chuẩn. Chưa có AI tutor, chấm phát âm tự động hay đồng bộ tài khoản.
- Font có thể tải qua Google Fonts khi có mạng, nhưng có font hệ thống dự phòng; những tài sản lõi được lưu trong cache.
- Nếu định sử dụng công khai, lưu ý GitHub Pages cho repository công khai sẽ công khai **mã nguồn và nội dung bài mẫu**; dữ liệu IndexedDB của từng người dùng không được commit lên GitHub.

## Cấu trúc
`index.html` (entry), `styles.css` (responsive UI), `app.js` (giao diện + IndexedDB + logic học), `sw.js` (offline caching), `manifest.webmanifest` / `icon.svg` (PWA).

## Phiên bản tiếp theo (tùy chọn)
Kiểm tra đầu vào tùy trình độ, bài nghe và phát âm có âm thanh mẫu, hệ thống mục tiêu dài hạn, học liệu theo cấp độ, thuật toán FSRS chính xác, xuất bảng thống kê và khả năng đồng bộ khi người dùng chủ động cho phép.
