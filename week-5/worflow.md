⚙️ Luồng Automation Tối Ưu cho Login Issue
**Bước 1: Check Employee Status (Xác thực)**

- Cầm tên/mã nhân viên từ Ticket đối soát với Mock HR JSON.

- Nếu không khớp: Update Note "Không tìm thấy nhân viên" -> Gắn Tag Manual_Review -> Dừng (Stop).

- Nếu khớp (Active): Đi tiếp bước 2.

**Bước 2: Update Stage = 'In Progress' (Đánh dấu đang xử lý)**

- Chuyển cột trên Kanban Odoo.

- Add Note: [Bot] Đã xác thực nhân viên: ${name}. Hệ thống đang tự động xử lý.

- Mục đích: Báo hiệu cho các Admin khác không can thiệp vào ticket này nữa.

**Bước 3: Send Automation Email (Hành động chính)**

- Lấy email từ Mock HR để gửi thông tin reset password/hướng dẫn.

- Đây là bước "giả lập" hành động xử lý lỗi.

**Bước 4: Update Stage = 'Solved' & Final Note (Hoàn tất)**

- Chuyển ticket sang cột "Đã xử lý" (hoặc Solved/Closed).

- Add Note: [Bot] Đã gửi email hướng dẫn đăng nhập thành công vào lúc ${time}. Ticket tự động đóng.

- Gắn thêm Tag: Auto_Resolved để sau này ông giáo làm báo cáo thống kê.