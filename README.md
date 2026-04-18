# Gemini Auto Prompt Extension

Tiện ích mở rộng Chrome giúp tự động hóa quá trình prompt trên Gemini để tạo bài viết Facebook và ảnh minh họa từ một video YouTube.

## Tính năng

- **Tự động quy trình Prompt:** Không cần thao tác copy - paste thủ công. Tiện ích sẽ tự động gửi chuỗi prompt yêu cầu Gemini thực hiện các tác vụ.
- **Tạo bài viết Facebook:** Yêu cầu Gemini tạo một bài đăng Facebook (500-1000 chữ) từ video YouTube với 5 phần:
  1. Câu Hook viết hoa thu hút sự chú ý.
  2. Giới thiệu nguồn hoặc tên kênh.
  3. Nội dung chính.
  4. Nhận định cá nhân sâu sắc.
  5. Kết luận hướng người đọc xuống phần bình luận để lấy link video.
- **Tự tạo ảnh minh họa 16:9:** Sau khi Gemini hoàn thành bài viết, tiện ích tự động yêu cầu tạo một bức ảnh (tỷ lệ 16:9) bám sát nội dung vừa tạo để đăng Facebook.

## Cài đặt

1. Tải toàn bộ mã nguồn của repository này về máy tính.
2. Mở trình duyệt (Google Chrome / Microsoft Edge / Brave...), truy cập vào đường dẫn: `chrome://extensions/`
3. Nhấn bật **Developer mode** (Chế độ cho nhà phát triển) ở góc trên bên phải.
4. Nhấn nút **Load unpacked** (Tải tiện ích đã giải nén).
5. Trỏ tới thư mục chứa mã nguồn tiện ích của bạn.

## Cách sử dụng

1. Truy cập vào trang [Gemini](https://gemini.google.com/) và đăng nhập bằng tài khoản Google.
2. Nhấn vào biểu tượng của tiện ích "Gemini Auto Prompt" trên thanh công cụ của trình duyệt.
3. Nhập đường link (URL) của video YouTube.
4. Bấm bắt đầu và chờ tiện ích tự động nhập prompt cũng như đợi kết quả từ AI.

> **Lưu ý:** Việc tạo ảnh có thể yêu cầu tài khoản Gemini Advanced hoặc tính năng tạo ảnh (Imagen) không bị hạn chế tại vùng của bạn.

## Cấu ​​trúc tệp

- `manifest.json`: File cấu hình, khai báo phiên bản và quyền (Permissions).
- `popup.html` & `popup.js`: Giao diện của tiện ích (chứa ô nhập link và nút bấm).
- `content.js`: Đoạn mã tiêm trực tiếp vào `gemini.google.com` để focus vào ô text, điền nội dung và bấm gửi.
