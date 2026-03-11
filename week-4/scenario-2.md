# Scenario 1: Vấn đề Performance

## 1. Bản ghi phiếu Odoo

<img src="images/scenario-2/Screenshot 2026-03-11 105508.png" alt="Mô tả" width="600"/>

**Link ticket trên Odoo:** https://home50.odoo.com/odoo/all-tickets/4

## 1.5. Quy trình Chẩn đoán & Xử lý (Technical Diagnosis)
Sau khi tiếp nhận yêu cầu, tiến hành kiểm tra trạng thái trên hệ thống quản trị (Base System) để xác định nguyên nhân. Dưới đây là các hướng xử lý dựa trên kết quả kiểm tra:

### Kết quả kiểm tra hệ thống (Giả định):
* **Server Response Time:** Tăng đột biến từ 2s lên 35s (bắt đầu từ 14:00).
* **Error Rate:** Xuất hiện hàng loạt lỗi 504 Gateway Timeout và Slow Queries.
* **Database Connection Pool:** Trạng thái 98% (Gần như không còn chỗ cho kết nối mới).
* **Phạm vi:** Chỉ ảnh hưởng đến các tác vụ liên quan đến Database của lớp WEB101, các dịch vụ tĩnh khác vẫn hoạt động.

### Các nhánh xử lý (Branching):
* **Nhánh 1: Lỗi cục bộ (Local/Network Issue):**
    * *Giả định:* Nếu kết quả Monitoring (Azure App Insights) cho thấy server vẫn phản hồi tốt (< 2s), nhưng chỉ lớp WEB101 bị chậm.
    * *Hành động:* Hướng dẫn CXO kiểm tra đường truyền tại cơ sở, yêu cầu học viên reset lại kết nối Wifi hoặc đổi sang mạng 4G để kiểm tra.
* **Nhánh 2: Lỗi hệ thống tầng ứng dụng/Database (System Issue) - [Trường hợp thực tế thực hiện]:**
    * *Giả định:* Monitoring báo chỉ số Server Response Time tăng vọt (> 30s) và tràn Connection Pool.
    * *Hành động:* Ghi nhận tính nghiêm trọng -> Escalate sang Dev Team -> Theo dõi và cập nhật tình hình cho khách hàng mỗi 15 phút.
* **Nhánh 3: Lỗi phía người dùng cá biệt (User Issue):**
    * *Giả định:* Chỉ 1-2 học viên trong lớp bị chậm, những người còn lại vẫn nộp bài bình thường.
    * *Hành động:* Hướng dẫn học viên xóa cache trình duyệt, nộp bài qua ẩn danh.
  
## 2. Email Phản hồi (Email Drafts)

**Email xác nhận ban đầu (ACK)**

<img src="images/scenario-2/Screenshot 2026-03-11 105901.png" alt="Mô tả" width="600"/>

**Escalate cho Dev Team**

[PRIORITY] Sự cố hiệu năng LMS - Ticket #00004
- Tác động: 15 học viên lớp WEB101-HN-2024 bị chặn (Trang tải > 30s).
- Hiện trạng: Lớp học đang diễn ra.
- Kết quả điều tra: Azure App Insights báo Response Time tăng vọt, Database Connection Pool đầy.
- Yêu cầu: Nhờ team check nới lỏng Connection Pool hoặc tối ưu các truy vấn đang bị treo.
- Nhạy cảm về thời gian: Lớp học đang diễn ra.
- Người theo dõi: Tạ Hiếu Thắng (Support Team).

**Email Cập nhật (Escalation Update)**

<img src="images/scenario-2/Screenshot 2026-03-11 110014.png" alt="Mô tả" width="600"/>


**Email giải quyết (Resolution)**

<img src="images/scenario-2/Screenshot 2026-03-11 110114.png" alt="Mô tả" width="600"/>

## 3. Giải thích phân loại

**Lý do chọn Priority:**

- Số lượng ảnh hưởng: 15 học viên (nằm trong khung 5-25 người của Priority).
- Mức độ tác động: Trực tiếp chặn đứng hoạt động dạy và học (Blocker) trong thời gian thực.

**Độ ưu tiên:** Mặc dù ticket có tính chất khẩn cấp (15 học viên bị tải trang chậm trong LMS) nhưng không chọn Expedite vì chưa đạt ngưỡng ảnh hưởng toàn hệ thống (> 25 người hoặc sập toàn bộ Server).

## 4. Ghi chú đúc kết

- **Về kỹ thuật:** Trong các ca Performance, việc quan trọng nhất là "Xác định phạm vi" (Scope). Phải biết lỗi là do mạng của khách hay do Server của mình trước khi gọi Dev Team.
- **Về phối hợp:** Khi Escalate cho Dev, thông tin gửi đi phải có "số liệu" (VD: Tăng từ 2s lên 35s) thay vì chỉ nói chung chung là "LMS chậm lắm". Điều này giúp Dev khoanh vùng lỗi nhanh hơn.
- **Về giao tiếp:** Việc gửi email cập nhật giữa chừng (Escalation Update) cực kỳ quan trọng để trấn an khách hàng rằng team vẫn đang làm việc tích cực.