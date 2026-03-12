# Scenario 5: Sự cố nhiều người dùng - Video không xem được (Priority)

## I. Branch A: Vấn đề "Nội dung" (Asset/Permission)

* **Giả định: Chỉ lỗi bài 3, API trả lỗi 403 Forbidden. Monitoring cho thấy file video bị mất Signed URL.**

### 1. Bản ghi phiếu Odoo

<img src="images/scenario-5/Screenshot 2026-03-12 144632.png" alt="Mô tả" width="600"/>

**Link ticket trên Odoo:** https://home50.odoo.com/odoo/all-tickets/10

### 2. Step-by-step xử lý (theo 7-step)

**Reception (Tiếp nhận):** Hệ thống ghi nhận 3 phản hồi cùng lúc từ lớp JS-ADV-HN-2412. Thực hiện khởi tạo Ticket chính #00010 trên Odoo và liên kết (Relate) các ticket con để quản lý tập trung trong vòng 10 phút.

**Initial Response (Phản hồi ban đầu):** Gửi email xác nhận (ACK) cho CXO trong vòng 15 phút. Thông báo team đang ưu tiên xử lý theo diện Priority và cung cấp giải pháp tạm thời (Workaround) là xem tài liệu PDF để không gián đoạn giờ học.

**Diagnosis (Chẩn đoán):** Kiểm tra API Gateway Logs và Monitoring. Phát hiện mã lỗi 403 Forbidden tập trung duy nhất tại Lesson ID: JS-ADV-L3. Xác định nguyên nhân do lỗi phân quyền Asset (Signed URL hết hạn), không phải do đường truyền của người dùng.

**Resolution (Giải quyết):**
- Escalation: Chuyển thông tin kỹ thuật cho bộ phận Content Ops/Dev để cấp lại quyền truy cập (Renew Asset).
- Fix: Dev thực hiện cập nhật lại cấu hình Permission trên Storage. Support Team kiểm tra lại link video trong môi trường ẩn danh -> Video phát ổn định.

**Communication (Giao tiếp/Cập nhật):** Gửi email cập nhật tiến độ cho CXO báo cáo rằng team đã tìm ra nguyên nhân và đang đợi bộ phận kỹ thuật cấu hình lại (dự kiến 15 phút).

**Follow-up (Theo dõi):** Sau khi có xác nhận từ Dev, gửi email thông báo kết quả cho CXO. Nhờ CXO xác nhận lại tình trạng xem video của 12 học viên tại lớp. Ghi nhận phản hồi: "100% học viên đã xem được".

**Trend Analysis (Phân tích xu hướng):** Ghi chép vào hệ thống kiến thức nội bộ (Internal Wiki/Note) về lỗi hết hạn Signed URL khi cập nhật khóa học mới. Đề xuất với team Dev/Content định kỳ kiểm tra hiệu lực của Asset trước khi mở lớp (Release check).
  
### 3. Email Phản hồi (Email Drafts)

**Email xác nhận ban đầu (ACK)**

<img src="images/scenario-5/Screenshot 2026-03-12 144855.png" alt="Mô tả" width="600"/>

**Escalate cho Dev Team**

> ### 🟡 [ESCALATION] PRIORITY - Lỗi truy cập Video bài học (403 Forbidden)
> **Mức độ ưu tiên:** High (Priority Incident)
> **Kênh gửi:** Microsoft Teams / Slack (#tech-support-internal)
>
> **TÁC ĐỘNG:**
> * **User bị ảnh hưởng:** 12 học viên lớp JS-ADV-HN-2412.
> * **Trạng thái:** Video không tải được, hiển thị lỗi "Cannot load media".
> * **Tính chất:** Sự cố cục bộ tại Lesson 3 khóa Advanced JavaScript.
>
> **KẾT QUẢ ĐIỀU TRA SƠ BỘ (MONITORING):**
> * **API Gateway Logs:** Ghi nhận mã lỗi `403 Forbidden` khi gọi endpoint lấy video asset bài 3.
> * **Phạm vi:** Chỉ xảy ra tại Lesson 3. Nghi vấn Signed URL hết hạn hoặc sai cấu hình Permission trên Storage.
>
> **YÊU CẦU:** > 1. Kiểm tra và làm mới (Renew) mã truy cập video cho Lesson ID: `JS-ADV-L3`.
> 2. Rà soát lại phân quyền Folder Asset của khóa học này.
>
> **TICKET:** #00010 (Odoo) | **Người theo dõi:** Tạ Hiếu Thắng
> @content-ops @backend-dev

**Email Cập nhật (Escalation Update)**

<img src="images/scenario-5/Screenshot 2026-03-12 145042.png" alt="Mô tả" width="600"/>

**Email giải quyết (Resolution)**

<img src="images/scenario-5/Screenshot 2026-03-12 145159.png" alt="Mô tả" width="600"/>

## II. Branch B: Vấn đề Hệ thống/CDN (Lỗi 5xx/Timeout)

* **Giả định: Lỗi lan sang cả các khóa khác. Monitoring báo CDN spike lỗi 504.**

### 1. Bản ghi phiếu Odoo

<img src="images/scenario-5/Screenshot 2026-03-12 153104.png" alt="Mô tả" width="600"/>

**Link ticket trên Odoo:** https://home50.odoo.com/odoo/all-tickets/13

### 2. Step-by-step xử lý (theo 7-step)

**Reception (Tiếp nhận):** Hệ thống ghi nhận 3 phản hồi cùng lúc từ lớp JS-ADV-HN-2412. Thực hiện khởi tạo Ticket chính #00013 trên Odoo và liên kết (Relate) các ticket con để quản lý tập trung trong vòng 10 phút.

**Initial Response (Phản hồi ban đầu):** Gửi email xác nhận (ACK) cho CXO trong vòng 15 phút. Thông báo team đang ưu tiên xử lý theo diện Priority và cung cấp giải pháp tạm thời (Workaround) là xem tài liệu PDF để không gián đoạn giờ học.

**Diagnosis (Chẩn đoán):** Phát hiện lỗi không chỉ nằm ở một thiết bị mà xảy ra trên cả Web và Mobile của 12 học viên này. Ghi nhận mã lỗi 504 Gateway Timeout tăng spike. Xác định nguyên nhân do hạ tầng CDN khu vực gặp sự cố đường truyền, gây nghẽn kết nối đến video asset.

**Resolution (Giải quyết):**
- Escalation: Báo động khẩn cấp cho đội ngũ DevOps/Infra về tình trạng nghẽn CDN.
- Fix: DevOps thực hiện điều hướng (Failover) luồng traffic sang cụm máy chủ dự phòng. Support Team kiểm tra lại lỗi trên cả 2 thiết bị (Web/Mobile) giả định -> Video đã phát ổn định trở lại.

**Communication (Giao tiếp/Cập nhật):** Cập nhật trạng thái cho CXO lớp JS-ADV-HN-2412 mỗi 15 phút về tiến độ điều hướng hạ tầng, giúp giáo viên và học viên tại lớp an tâm chờ đợi.

**Follow-up (Theo dõi):** Sau khi có xác nhận từ Dev, gửi email thông báo kết quả cho CXO. Nhờ CXO xác nhận lại tình trạng xem video của 12 học viên tại lớp. Ghi nhận phản hồi: "100% học viên đã xem được".

**Trend Analysis (Phân tích xu hướng):** Ghi nhận sự cố CDN vào nhật ký vận hành. Đề xuất với team Infra kiểm tra lại tính ổn định của nhà cung cấp CDN tại khu vực này và xây dựng kịch bản tự động chuyển hướng nếu xảy ra lỗi tương tự để giảm thiểu ảnh hưởng cho các lớp học sau.
  
### 3. Email Phản hồi (Email Drafts)

**Email xác nhận ban đầu (ACK)**

<img src="images/scenario-5/Screenshot 2026-03-12 153422.png" alt="Mô tả" width="600"/>

**Escalate cho Dev Team**

> ### 🟠 [ESCALATION] PRIORITY - CDN Gateway Timeout (Sự cố hạ tầng video)
> **Mức độ ưu tiên:** High (Major Incident)
> **Kênh gửi:** Microsoft Teams / Slack (#incident-response)
>
> **TÁC ĐỘNG:**
> * **User bị ảnh hưởng:** 20+ học viên từ nhiều lớp/khóa học khác nhau.
> * **Trạng thái:** Video loading vô hạn, hệ thống không phản hồi.
> * **Tính chất:** Lỗi diện rộng trên toàn hệ thống LMS (System-wide).
>
> **KẾT QUẢ ĐIỀU TRA SƠ BỘ (MONITORING):**
> * **CDN Metrics:** Error rate tăng đột biến, spike lỗi `504 Gateway Timeout`.
> * **Network Health:** Nghi vấn nghẽn đường truyền tại hạ tầng đối tác CDN hoặc lỗi Gateway điều hướng.
>
> **YÊU CẦU:** > 1. Kiểm tra trạng thái kết nối tới CDN Provider.
> 2. Thực hiện **Failover (Chuyển hướng)** sang cụm máy chủ dự phòng ngay lập tức.
>
> **TICKET:** #00007 (Odoo) | **Người theo dõi:** Tạ Hiếu Thắng
> @devops @infra-team @cto

**Email Cập nhật (Escalation Update)**

<img src="images/scenario-5/Screenshot 2026-03-12 153506.png" alt="Mô tả" width="600"/>

**Email giải quyết (Resolution)**

<img src="images/scenario-5/Screenshot 2026-03-12 153550.png" alt="Mô tả" width="600"/>

## III. Branch C: Vấn đề Hệ thống/CDN (Lỗi 5xx/Timeout)

* **Giả định: Ẩn danh xem được. Mobile xem được nhưng Web lỗi.**
  
### 1. Bản ghi phiếu Odoo

<img src="images/scenario-5/Screenshot 2026-03-12 161341.png" alt="Mô tả" width="600"/>

**Link ticket trên Odoo:** https://home50.odoo.com/odoo/all-tickets/14

### 2. Step-by-step xử lý (theo 7-step)

**Reception (Tiếp nhận):** Hệ thống ghi nhận 3 phản hồi cùng lúc từ lớp JS-ADV-HN-2412. Thực hiện khởi tạo Ticket chính #00014 trên Odoo và liên kết (Relate) các ticket con để quản lý tập trung trong vòng 10 phút.

**Initial Response (Phản hồi ban đầu):** Gửi email xác nhận (ACK) cho CXO trong vòng 15 phút. Thông báo team đang ưu tiên xử lý theo diện Priority và cung cấp giải pháp tạm thời (Workaround) là xem tài liệu PDF để không gián đoạn giờ học.

**Diagnosis (Chẩn đoán):** Tiến hành kiểm tra chéo (Cross-check): Xác định lỗi chỉ xuất hiện trên Chrome phiên bản Desktop của 8 học viên. Nguyên nhân do tiện ích "Adblock Plus" nhận diện nhầm trình phát video mới của LMS là quảng cáo và chặn thực thi script.

**Resolution (Giải quyết):** Soạn tài liệu hướng dẫn nhanh cách tắt Adblock cho tên miền mindx.edu.vn hoặc hướng dẫn học viên sử dụng Tab ẩn danh để học tiếp ngay lập tức.

**Communication (Giao tiếp/Cập nhật):** Gửi email và nhắn tin trực tiếp cho CXO đại diện lớp, hướng dẫn các bước xử lý phía người dùng. Đề nghị giáo viên hỗ trợ học viên thao tác tại chỗ để kịp tiến độ buổi học.

**Follow-up (Theo dõi):** Sau khi có xác nhận từ Dev, gửi email thông báo kết quả cho CXO. Nhờ CXO xác nhận lại tình trạng xem video của 12 học viên tại lớp. Ghi nhận phản hồi: "100% học viên đã xem được".

**Trend Analysis (Phân tích xu hướng):** Ghi nhận xung đột giữa Player video và Adblock vào cơ sở dữ liệu lỗi thường gặp (FAQ). Kiến nghị bộ phận Product kiểm tra lại đoạn mã nhúng video để tối ưu hóa, tránh bị các trình chặn quảng cáo nhận diện nhầm trong tương lai, đồng thời bổ sung cảnh báo "Tắt Adblock" ngay trên giao diện video của LMS.
  
### 3. Email Phản hồi (Email Drafts)

**Email xác nhận ban đầu (ACK)**

<img src="images/scenario-5/Screenshot 2026-03-12 161431.png" alt="Mô tả" width="600"/>

**Email Cập nhật (Escalation Update)**

<img src="images/scenario-5/Screenshot 2026-03-12 161510.png" alt="Mô tả" width="600"/>

**Email giải quyết (Resolution)**

<img src="images/scenario-5/Screenshot 2026-03-12 161616.png" alt="Mô tả" width="600"/>

## III. Giải thích phân loại

**Lý do chọn Priority:** Ảnh hưởng đến 12 học viên (nằm trong khung 5-25 người). Lỗi gây gián đoạn hoàn toàn việc học (Critical function).
**Pattern Recognition:** Việc gom 3 ticket vào 1 ticket chính giúp Support không bị rối và phản hồi đồng nhất thông tin cho tất cả CXO liên quan.

## IV. Ghi chú đúc kết

- **Dữ liệu là chìa khóa:** Trong các ca video, việc giả định đúng Branch dựa trên mã lỗi (403 vs 504 vs 0) giúp tiết kiệm nhiều thời gian Escalate nhầm bộ phận.
- **Quản lý Stakeholder:** Việc đưa ra "Workaround" (đọc PDF trước) ngay trong email ACK giúp khách hàng có phương án xử lý dự phòng tạm thời trong khi kỹ thuật đang điều tra.