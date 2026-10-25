# Lingua OS v2.0 — Thọ & Thương

Web app thuần HTML/CSS/JavaScript, miễn phí và không yêu cầu máy chủ/API trả phí.

## Có gì trong bản này?
- Hai hồ sơ độc lập: **Thọ** (tiếng Anh, tiếng Trung) và **Thương** (Y đa khoa).
- Dashboard, học phần, bài đọc, kiểm tra trắc nghiệm, lịch sử làm bài, ôn flashcards, ghi chú, thống kê.
- **Không có checkbox hoàn thành thủ công**: bài học chỉ hoàn thành khi nộp đủ câu trả lời và đạt ngưỡng điểm (mặc định 80%). Khi đạt mới tạo flashcards.
- Tạo bài học thủ công; nhập bộ học liệu JSON để mở rộng sau khi người dùng gửi giáo trình.
- Đính kèm và lưu tài liệu tham khảo dạng file trong IndexedDB (khuyến nghị file dưới 8 MB; giới hạn bộ nhớ trình duyệt có thể khác nhau).
- Sao lưu và khôi phục JSON gồm hai hồ sơ và tệp đính kèm. Chưa có đồng bộ tự động giữa các thiết bị.
- Offline cache cơ bản sau khi mở website lần đầu bằng HTTPS.

## Chạy thử
Dùng một máy chủ tĩnh tại thư mục dự án:

```bash
python -m http.server 8000
```

Mở http://localhost:8000. Không nên mở trực tiếp file:/// vì service worker/IndexedDB có thể hoạt động khác nhau.

## Đưa lên GitHub Pages
1. Tạo repository public trên GitHub, ví dụ `lingua-os`.
2. Đưa toàn bộ file trong thư mục này vào **root** của repository.
3. Settings → Pages → Deploy from a branch → main → /(root) → Save.
4. Mở URL GitHub Pages của repository.
5. Nếu cập nhật bản cũ, dùng đường dẫn mới hoặc refresh để lấy tài nguyên mới; không xoá dữ liệu trang khi chưa backup.

## Thêm bài học bằng JSON
Trong app, chọn hồ sơ → Học phần → Thêm học liệu → Tải mẫu JSON.
Cấu trúc:

```json
{"lessons":[{"subject":"Sinh lý", "title":"Bài 1", "description":"Mục tiêu", "minutes":20,
"material":"Nội dung bài...", "passScore":80,
"questions":[{"q":"Câu hỏi?","options":["A","B","C"],"answer":1,"explain":"Giải thích..."}],
"cards":[["Khái niệm","Định nghĩa"]]}]}
```

`answer` là chỉ số từ 0, không phải số thứ tự từ 1. Trình duyệt không tự trích xuất PDF/PPTX; khi gửi tài liệu cho ChatGPT để biên soạn, có thể tạo file JSON rồi nhập vào app. Nội dung y khoa cần được kiểm chứng trước khi dùng.

## Lưu ý dữ liệu
- IndexedDB lưu trong **trình duyệt và origin hiện tại**, có thể mất khi xóa dữ liệu trang web, chế độ riêng tư hoặc chính sách bộ nhớ của hệ thống.
- Hai hồ sơ tách dữ liệu *theo logic ứng dụng*, không có đăng nhập/mật khẩu hay phân quyền an toàn riêng.
- Bản sao lưu không được mã hóa. Không lưu thông tin bệnh nhân hay thông tin nhạy cảm trong học liệu và nhật ký.
- Không có AI tutor, đánh giá tự luận tự động, sync cloud, FSRS đầy đủ hoặc giáo trình chính thức ĐHQGHN.
- Lịch 72'/48' dành cho Thọ được ghi trong dashboard; bài mẫu chưa cấu thành trọn giáo trình 120 phút/ngày.
