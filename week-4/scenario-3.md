# Scenario 3: Lỗi nghiêm trọng (Expedite). Nhiều tickets đang tràn vào. Manager team vận hành ping bạn trên Teams. Đây là sự cố Expedite đầu tiên của bạn.

## 1. Bản ghi phiếu Odoo

<img src="images/scenario-3/Screenshot 2026-03-14 231853.png" alt="Mô tả" width="600"/>

<img src="images/scenario-3/Screenshot 2026-03-14 231917.png" alt="Mô tả" width="600"/>

**Link ticket trên Odoo:** https://home50.odoo.com/odoo/all-tickets/18

## 1.5. Quy trình Chẩn đoán & Xử lý (Technical Diagnosis)
Sau khi tiếp nhận yêu cầu, tiến hành kiểm tra trạng thái trên hệ thống quản trị (Base System) để xác định nguyên nhân. Dưới đây là các hướng xử lý dựa trên kết quả kiểm tra:

### Kết quả kiểm tra hệ thống (Giả định):
* **Lỗi:** `System error` xuất hiện tại mọi yêu cầu nộp bài.
* **Azure App Insights:** Exception spike đạt đỉnh. Tỷ lệ lỗi nộp bài là 100%.
* **Phạm vi:** Toàn bộ hệ thống LMS (Multi-class).

### Các nhánh xử lý (Branching):
* **Nhánh 1: Lỗi do phía người dùng (Loại bỏ ngay): Vì 50 người từ nhiều vùng địa lý (HN, SG) cùng bị một lúc, không thể là lỗi mạng cá nhân.**
* **Nhánh 2: Lỗi Server/Code (Trường hợp thực tế): Hệ thống sập ngay sau một đợt cập nhật hoặc do tải trọng thi cuối kỳ quá lớn làm Database treo.**
    * *Hành động:* Triển khai giao thức Expedite -> Escalate toàn bộ Dev/DevOps -> Thực hiện Revert code hoặc Scale-up server.
  
## 2. Email Phản hồi (Email Drafts)

**Email xác nhận ban đầu (ACK)**

<img src="images/scenario-3/Screenshot 2026-03-14 232205.png" alt="Mô tả" width="600"/>

**Escalate cho Dev Team**

Do tính chất nghiêm trọng của sự cố (Expedite), em đã kích hoạt giao thức báo động khẩn cấp tới đội ngũ kỹ thuật cao cấp qua kênh chat nội bộ (#incident-response):

> ### 🔴 [ESCALATION] EXPEDITE - Hệ thống nộp bài thi DOWN
> **Mức độ ưu tiên:** Highest (Critical Incident)
> **Kênh gửi:** Microsoft Teams / Slack (#incident-response)
>
> **TÁC ĐỘNG NGHIÊM TRỌNG:**
> * **User bị ảnh hưởng:** 50+ học viên (Khối 18+ Hà Nội & SG).
> * **Trạng thái:** Tỷ lệ lỗi nộp bài 100% (Blocker).
> * **Tính chất:** Đang diễn ra giờ thi cuối kỳ (còn 30 phút cuối).
>
> **LỖI GHI NHẬN:** *"System error - please contact administrator"*
>
> **PHÁT HIỆN BAN ĐẦU (MONITORING):**
> * **Thời điểm bắt đầu:** Khoảng 14:30.
> * **Azure App Insights:** Exception spike tăng đột biến (Status Code 500).
> * **Logs:** Tràn `Database Connection Pool`. Liên tục xuất hiện lỗi `Timeout` khi gọi API `/api/v1/submissions`.
> * **Ghi chú:** Sự cố xảy ra ngay sau đợt cập nhật Hotfix lúc 14:15.
>
> **YÊU CẦU:** > 1. Điều tra nguyên nhân gốc (Root Cause).
> 2. Thực hiện **Revert (Khôi phục)** về version cũ nếu không xử lý được code trong 5 phút tới.
> 3. Hỗ trợ khẩn cấp để kịp tiến độ giờ thi.
>
> **CẬP NHẬT TRẠNG THÁI:** Support Team sẽ cập nhật Stakeholders mỗi 15 phút.
>
> **TICKET:** #00018 (Odoo)
>
> @senior-engineer @engineer-team @devops

**Email cập nhật điều tra**

<img src="images/scenario-3/Screenshot 2026-03-14 232326.png" alt="Mô tả" width="600"/>


**Email xác nhận giải quyết**

<img src="images/scenario-3/Screenshot 2026-03-14 232434.png" alt="Mô tả" width="600"/>

## 3. Giải thích phân loại

**Lý do chọn Expedite:**

- Quy mô: 53 học viên (Vượt ngưỡng 25 người của Priority).
- Tính chất: Chặn đứng chức năng quan trọng nhất (Thi cuối kỳ) - ảnh hưởng trực tiếp đến uy tín và vận hành của công ty.
- Stakeholder: Có sự can thiệp của Manager vận hành và CXO vùng.

**Độ ưu tiên:** Highest (Cần xử lý ngay lập tức, bỏ qua các công việc khác).

## 4. Ghi chú đúc kết

- **Quản lý Stakeholders:** Trong ca Expedite, áp lực từ Manager và CXO rất lớn. Kỹ năng quan trọng nhất là cung cấp Timeline dự kiến (VD: 15 phút cập nhật một lần) để ngăn chặn việc bị spam hỏi thăm, giúp team tập trung kỹ thuật.
- **Tốc độ vs Chính xác:** Không được đợi điều tra xong xuôi mới báo Dev. Quy trình đúng là: Báo Dev ngay -> Điều tra chi tiết song song.
- **Xác minh sau fix:** Support phải là người cuối cùng test thực tế (End-to-end test) trước khi thông báo cho khách hàng để tránh "báo động giả".