# Scenario 2: Vấn đề Performance (Priority). Bạn nhận được một ticket từ CXO (Class Administrator) báo cáo rằng 15 học viên trong một lớp học trực tuyến đang gặp tình trạng tải trang cực kỳ chậm trong LMS.

## 1. Bản ghi phiếu Odoo

<img src="images/scenario-2/Screenshot 2026-03-14 224729.png" alt="Mô tả" width="600"/>

<img src="images/scenario-2/Screenshot 2026-03-14 224802.png" alt="Mô tả" width="600"/>

**Link ticket trên Odoo:** https://home50.odoo.com/odoo/all-tickets/17

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

<img src="images/scenario-2/Screenshot 2026-03-14 225026.png" alt="Mô tả" width="600"/>

**Escalate cho Dev Team**

Dựa trên các chỉ số bất thường từ hệ thống Monitoring, em đã thực hiện báo cáo và yêu cầu hỗ trợ từ đội ngũ Kỹ thuật (Dev/Backend) qua kênh truyền thông nội bộ:

> ### 🟡 [ESCALATION] PRIORITY - Sự cố hiệu năng LMS (Trang tải chậm)
> **Mức độ ưu tiên:** High (Priority Incident)
> **Kênh gửi:** Microsoft Teams / Slack (#tech-support-internal)
>
> **TÁC ĐỘNG:**
> * **User bị ảnh hưởng:** 15 học viên lớp WEB101-HN-2024.
> * **Trạng thái:** Trang tải cực chậm (> 30s), gây gián đoạn việc nộp bài tập.
> * **Tính chất:** Lớp học đang diễn ra trực tiếp.
>
> **KẾT QUẢ ĐIỀU TRA SƠ BỘ (MONITORING):**
> * **Azure App Insights:** Ghi nhận `Response Time` tăng vọt từ 2s lên 35s từ lúc 14:00.
> * **System Health:** `Database Connection Pool` đang ở trạng thái đầy (Saturation). Xuất hiện nhiều truy vấn treo (Long-running queries).
>
> **YÊU CẦU:** > 1. Kiểm tra và nới lỏng giới hạn `Connection Pool`.
> 2. Rà soát và kill các truy vấn đang bị treo để giải phóng tài nguyên hệ thống.
>
> **CẬP NHẬT TRẠNG THÁI:** Sẽ cập nhật tiến độ cho CXO mỗi 15 phút.
>
> **TICKET:** #00004 (Odoo)
>
> **Người theo dõi:** Tạ Hiếu Thắng (Support Team)
>
> @dev-team @backend-engineer

**Email cập nhật điều tra**

<img src="images/scenario-2/Screenshot 2026-03-14 225224.png" alt="Mô tả" width="600"/>


**Email xác nhận giải quyết**

<img src="images/scenario-2/Screenshot 2026-03-14 225328.png" alt="Mô tả" width="600"/>

## 3. Giải thích phân loại

**Lý do chọn Priority:**

- Số lượng ảnh hưởng: 15 học viên (nằm trong khung 5-25 người của Priority).
- Mức độ tác động: Trực tiếp chặn đứng hoạt động dạy và học (Blocker) trong thời gian thực.
- Mặc dù ticket có tính chất khẩn cấp (15 học viên bị tải trang chậm trong LMS) nhưng không chọn Expedite vì chưa đạt ngưỡng ảnh hưởng toàn hệ thống (> 25 người hoặc sập toàn bộ Server).

## 4. Ghi chú đúc kết

- **Về kỹ thuật:** Trong các ca Performance, việc quan trọng nhất là "Xác định phạm vi" (Scope). Phải biết lỗi là do mạng của khách hay do Server của mình trước khi gọi Dev Team.
- **Về phối hợp:** Khi Escalate cho Dev, thông tin gửi đi phải có "số liệu" (VD: Tăng từ 2s lên 35s) thay vì chỉ nói chung chung là "LMS chậm lắm". Điều này giúp Dev khoanh vùng lỗi nhanh hơn.
- **Về giao tiếp:** Việc gửi email cập nhật giữa chừng (Escalation Update) cực kỳ quan trọng để trấn an khách hàng rằng team vẫn đang làm việc tích cực.