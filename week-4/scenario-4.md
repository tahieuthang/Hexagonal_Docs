# Scenario 4: Feature Request. Người dùng gửi yêu cầu tính năng mới, nhưng nằm ngoài scope hiện tại của sản phẩm.

## 1. Bản ghi phiếu Odoo

<img src="images/scenario-4/Screenshot 2026-03-14 235015.png" alt="Mô tả" width="600"/>

<img src="images/scenario-4/Screenshot 2026-03-14 235030.png" alt="Mô tả" width="600"/>

**Link ticket trên Odoo:** https://home50.odoo.com/odoo/all-tickets/19

## 1.5. Quy trình Chẩn đoán & Xử lý (Technical Diagnosis)

### Kết quả kiểm tra hệ thống (Giả định):
* **Tính năng hiện tại:** Hệ thống đã có nút "Export Excel" thủ công cho từng lớp.
* **Hạ tầng:** Chưa hỗ trợ dịch vụ "Mail Scheduler" (gửi tự động định kỳ) và "PDF Generator" từ dữ liệu động.
* **Phạm vi:** Đây là yêu cầu thay đổi logic sản phẩm (Product Change), không phải lỗi kỹ thuật (Bug).

### Các nhánh xử lý (Branching):
* **Nhánh 1: Tính năng đã có sẵn nhưng khách không biết: Hướng dẫn khách sử dụng.**
* **Nhánh 2: Tính năng nằm trong Roadmap sắp tới: Thông báo thời gian dự kiến ra mắt.**
* **Nhánh 3: Tính năng hoàn toàn mới/Ngoài Scope - [Trường hợp thực tế]:**
    * *Hành động:* Ghi nhận -> Chuyển Product Team -> Đề xuất giải pháp tạm thời (Workaround) bằng cách dùng nút Export Excel hiện có.
  
## 2. Email Phản hồi (Email Drafts)

**Email xác nhận ban đầu (ACK)**

<img src="images/scenario-4/Screenshot 2026-03-14 235153.png" alt="Mô tả" width="600"/>

**Email Thông báo lộ trình & Workaround (Follow-up)**

<img src="images/scenario-4/Screenshot 2026-03-14 235245.png" alt="Mô tả" width="600"/>

## 3. Giải thích phân loại

**Lý do chọn Standard:** Đây là yêu cầu mang tính chất đóng góp ý tưởng, không ảnh hưởng đến vận hành hiện tại của hệ thống (không có lỗi, không chặn người dùng).
**Độ ưu tiên:** Low (Xử lý theo trình tự thời gian, không yêu cầu khẩn cấp).

## 4. Ghi chú đúc kết

- **Quản lý kỳ vọng:** Tuyệt đối không hứa hẹn thời gian cụ thể (VD: "Tuần sau sẽ có") nếu chưa có xác nhận từ Dev/Product. Việc nói "đưa vào Backlog" là cách từ chối khéo léo nhưng vẫn giữ được sự gắn kết của khách hàng.
- **Giá trị cộng thêm:** Thay vì chỉ nói "Không làm được", việc đưa ra một giải pháp tạm thời (Workaround như xuất Excel) giúp khách hàng thấy mình vẫn đang cố gắng hỗ trợ họ hết mức.
- **Vai trò trung gian:** Support là cầu nối giữa Khách hàng và Sản phẩm. Cần ghi chép đầy đủ feedback để bộ phận Sản phẩm có dữ liệu thực tế nhằm cải tiến LMS tốt hơn.