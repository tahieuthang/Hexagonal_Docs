# REPORT: TICKET PATTERN ANALYSIS & IMPACT ASSESSMENT

**Project:** Helpdesk Automation System (MindX Training Week 4)  
**Engineer:** Tạ Hiếu Thắng  

---

## 1. Odoo Reporting Overview

Dựa trên các công cụ báo cáo của Odoo, em đã trích xuất dữ liệu dựa trên **131 tickets** được import từ hệ thống thực tế.

### Key Visualizations:

- **Category Distribution (Pie Chart):** Phân tích tỷ trọng các loại lỗi dựa trên Tag.  
- **Priority Distribution (Bar Chart):** Đánh giá mức độ khẩn cấp của các vấn đề.  
- **Trend Analysis:** Theo dõi biến động lượng ticket theo thời gian xử lý.  

---

## 2. Top 5 Recurring Issues Identify (Phân tích lỗi lặp lại)

Dựa vào thống kê số lượng (Count) từ cao xuống thấp trong biểu đồ Tag, tôi xác định 5 nhóm lỗi trọng tâm:

| Issue Category (Tag)   | Ticket Count | Primary Impact |
|------------------------|--------------|----------------|
| CRM Issues             | ~28          | Gián đoạn quy trình kinh doanh, không chốt được Lead. |
| LMS (Login/Access)     | ~14          | Học viên không thể vào học, gây bức xúc cao. |
| TMS (Training Mgmt)    | ~11          | Lỗi dữ liệu vận hành lớp học. |
| Bug/System Error       | ~5           | Các lỗi kỹ thuật phát sinh đột xuất. |
| E-learning Content     | ~3           | Ảnh hưởng trực tiếp đến trải nghiệm người dùng. |

---

## 3. Impact Assessment (Đánh giá tác động)

### 3.1. Phân tích mức độ ưu tiên (Priority)

Dựa trên biểu đồ Priority (`Screenshot 2026-03-19 105213.png`), ta thấy:

- **Urgent (Khẩn cấp):**
  - Chiếm ~40 tickets  
  - Đây là những lỗi cần xử lý ngay lập tức để tránh thiệt hại về doanh thu  

- **High/Medium:**
  - Chiếm đa số (~80 tickets)  
  - Gây tắc nghẽn luồng xử lý của Operating Engineer nếu làm thủ công  

---

### 3.2. Ước tính lãng phí thời gian (Time Spent)

- **Thao tác thủ công:**
  - Trung bình **10 phút/ticket**

- **Tổng thời gian lãng phí:**
  - Riêng nhóm CRM và LMS (~42 tickets)  
  - → Tổng thời gian mất trắng là **420 phút (~7 giờ làm việc)** mỗi chu kỳ lỗi lặp lại 

## 4. Deliverables (Minh chứng đính kèm)

**Báo cáo phân loại lỗi (Tag Chart):**

<img src="images/tags/Screenshot 2026-03-19 104720.png" alt="Mô tả" width="600"/>

<img src="images/tags/Screenshot 2026-03-19 104744.png" alt="Mô tả" width="600"/>

<img src="images/tags/Screenshot 2026-03-19 104756.png" alt="Mô tả" width="600"/>

**Báo cáo mức độ ưu tiên (Priority Chart):**

<img src="images/priority/Screenshot 2026-03-19 105221.png" alt="Mô tả" width="600"/>

<img src="images/priority/Screenshot 2026-03-19 105229.png" alt="Mô tả" width="600"/>

<img src="images/priority/Screenshot 2026-03-19 105213.png" alt="Mô tả" width="600"/>