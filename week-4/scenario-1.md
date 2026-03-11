# Scenario 1: Vấn đề đăng nhập

## 1. Bản ghi phiếu Odoo

<img src="images/Screenshot 2026-03-10 223955.png" alt="Mô tả" width="600"/>

**Link ticket tren Odoo:** https://home50.odoo.com/odoo/all-tickets/3

## 1.5. Quy trình Chẩn đoán & Xử lý (Technical Diagnosis)
Sau khi tiếp nhận yêu cầu, tiến hành kiểm tra trạng thái trên hệ thống quản trị (Base System) để xác định nguyên nhân. Dưới đây là các hướng xử lý dựa trên kết quả kiểm tra:

### Kết quả kiểm tra hệ thống (Giả định):
* **Trạng thái tài khoản:** Deactivated (Vô hiệu hóa).
* **Trạng thái nhân sự:** Đang làm việc (Xác nhận từ HR).
* **Email trong Base:** nguyen.van.a@mindx.edu.vn.
* **Lần cuối update:** 2 tuần trước.

### Các nhánh xử lý (Branching):
* **Nhánh 1: Tài khoản bị Deactivated (Trường hợp thực hiện thực tế):**
    * *Hành động:* Liên hệ HR xác minh nhân sự -> Thực hiện **Reactivate** -> Reset password tạm thời.
    * *Lý do:* Khắc phục lỗi đồng bộ dữ liệu khiến tài khoản bị khóa nhầm.
* **Nhánh 2: Tài khoản đang Active (Trường hợp dự phòng):**
    * *Hành động:* Hướng dẫn User tự reset password qua email hoặc Support thực hiện reset thủ công nếu User gặp khó khăn.
    * *Lý do:* User quên mật khẩu hoặc nhập sai nhiều lần dẫn đến bị lock tạm thời.
* **Nhánh 3: Nhân sự đã nghỉ việc:**
    * *Hành động:* Từ chối kích hoạt lại tài khoản và giải thích quy định bảo mật thông tin của công ty.

## 2. Email Phản hồi (Email Drafts)

**Email xác nhận ban đầu (ACK)**

<img src="images/Screenshot 2026-03-10 225321.png" alt="Mô tả" width="600"/>

**Email giải quyết (Resolution)**

<img src="images/Screenshot 2026-03-10 225334.png" alt="Mô tả" width="600"/>

## 3. Giải thích phân loại

- **Lý do chọn Standard:** Dựa trên khung Class of Service, vấn đề này chỉ ảnh hưởng đến 01 người dùng đơn lẻ (Teacher A).
- **Độ ưu tiên:** Mặc dù khách hàng có tính chất khẩn cấp (có lớp học hôm nay), nhưng về quy mô hệ thống, đây không phải lỗi diện rộng ảnh hưởng đến vận hành của cơ sở hay công ty, nên việc phân loại Standard là chính xác theo quy trình.

## 4. Ghi chú đúc kết

- **Về quy trình:** Việc tuân thủ bước Diagnosis (Chẩn đoán) kiểm tra Base System trước khi hành động giúp tránh sai lầm nghiêm trọng. Nếu tài khoản bị Deactivate do nhân sự đã nghỉ việc mà mình tự ý kích hoạt lại sẽ vi phạm chính sách bảo mật thông tin.
- **Về giao tiếp:** Việc đưa ra một mốc thời gian cụ thể (30 phút) giúp giáo viên yên tâm hơn để chuẩn bị phương án dự phòng cho lớp học, thay vì im lặng để khách hàng chờ đợi trong vô vọng.
- **Bài học:** Luôn cần phối hợp với các bộ phận liên quan (như HR hoặc Quản lý trực tiếp) khi xử lý các vấn đề liên quan đến trạng thái tài khoản để đảm bảo tính đúng đắn của dữ liệu nhân sự.