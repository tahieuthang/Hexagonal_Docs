# Scenario 4: Yêu cầu có deadline - Báo cáo cần gấp (Fixed Deadline)

## 1. Bản ghi phiếu Odoo

<img src="images/scenario-6/Screenshot 2026-03-15 212127.png" alt="Mô tả" width="600"/>

**Link ticket trên Odoo:** https://home50.odoo.com/odoo/all-tickets/23

## 1.5. Nhánh xử lý khi có vấn đề phát sinh (Branching)

* **Dữ liệu bị lệch hoặc Query bị treo (Lỗi kỹ thuật).**
    * *Xử lý:* Thông báo ngay cho Director: "Hiện tại dữ liệu doanh thu đang bị lệch so với hệ thống kế toán do lỗi đồng bộ. Team xin phép gửi báo cáo Enrollment (Số lượng) trước để Director họp, phần Doanh thu (Revenue) sẽ cập nhật sau khi kỹ thuật fix xong".
  
## 2. Email Phản hồi (Email Drafts)

**Email xác nhận ban đầu (ACK)**

<img src="images/scenario-6/Screenshot 2026-03-15 212602.png" alt="Mô tả" width="600"/>

**Email Cập nhật (Escalation Update)**

<img src="images/scenario-6/Screenshot 2026-03-15 212649.png" alt="Mô tả" width="600"/>

<img src="images/scenario-6/Screenshot 2026-03-15 212853.png" alt="Mô tả" width="600"/>

**Email Thông báo lộ trình & Workaround (Follow-up)**

<img src="images/scenario-6/Screenshot 2026-03-15 212954.png" alt="Mô tả" width="600"/>

## 3. Giải thích phân loại

**Lý do chọn Class Fixed Deadline:** 
- Tính chất thời gian: Yêu cầu này gắn liền với một cột mốc không thể thay đổi (Cuộc họp chiến lược lúc 09:00 sáng). Khác với các Ticket thông thường có thể linh hoạt SLA, loại vé này có giá trị giảm dần về 0 ngay sau khi deadline trôi qua.
- Mức độ tác động (Impact): Người yêu cầu là cấp Director và dữ liệu phục vụ mục đích ra quyết định kinh doanh. Bất kỳ sự chậm trễ nào cũng ảnh hưởng trực tiếp đến uy tín của Support Team và tiến độ của tổ chức.
- Đặc thù xử lý: Đòi hỏi quy trình phối hợp liên phòng ban (Manager duyệt, Dev/BI trích xuất) dưới áp lực thời gian cực lớn, cần lộ trình cập nhật (Update timeline) dày đặc hơn bình thường.

## 4. Ghi chú đúc kết

- **Quản lý kỳ vọngNghệ thuật đàm phán (Negotiation):** Việc chủ động đặt câu hỏi Clarify giúp loại bỏ các phần "Nice-to-have" và tập trung nguồn lực vào phần "Must-have" (MVP). Điều này giúp team kiểm soát được rủi ro kỹ thuật và đảm bảo bàn giao đúng hạn.
- **Quản trị rủi ro dữ liệu:** Việc hướng Director sử dụng dữ liệu tổng hợp thay vì PII (thông tin nhạy cảm) không chỉ giúp bỏ qua các thủ tục phê duyệt bảo mật phức tạp mà còn bảo vệ Support Team khỏi các rủi ro pháp lý liên quan đến dữ liệu cá nhân học viên.
- **Tầm quan trọng của giao tiếp chủ động:** Việc gửi bản Draft và các email update tiến độ giúp xây dựng lòng tin với Stakeholder, khiến họ cảm thấy an tâm rằng yêu cầu của mình đang được xử lý đúng hướng và luôn nằm trong tầm kiểm soát.