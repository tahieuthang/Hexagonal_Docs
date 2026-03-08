# CLI Ticket Manager - Hexagonal Architecture

, đảm bảo Domain logic hoàn toàn độc lập với công nghệ lưu trữ và giao diện người dùng.
Công cụ CLI quản lý ticket được xây dựng theo kiến trúc **Hexagonal Architecture** tích hợp hệ thống Ticket với Odoo ERP thông qua giao thức JSON-RPC, tuân thủ nghiêm ngặt.

## Mục lục
- [CLI Ticket Manager - Hexagonal Architecture](#cli-ticket-manager---hexagonal-architecture)
  - [Mục lục](#mục-lục)
  - [I. Hướng dẫn cài đặt (Setup Instructions)](#i-hướng-dẫn-cài-đặt-setup-instructions)
    - [Cấu hình môi trường](#cấu-hình-môi-trường)
    - [Authentication](#authentication)
  - [II. Tài liệu luồng dữ liệu (Flow Documentation)](#ii-tài-liệu-luồng-dữ-liệu-flow-documentation)
  - [III. Các lệnh CLI Odoo (CLI Commands)](#iii-các-lệnh-cli-odoo-cli-commands)
  - [IV. Kiểm thử tích hợp (Integration Testing)](#iv-kiểm-thử-tích-hợp-integration-testing)
  - [V. Cấu trúc thư mục bổ sung (Week 3)](#v-cấu-trúc-thư-mục-bổ-sung-week-3)
    - [Các lệnh hỗ trợ](#các-lệnh-hỗ-trợ)
  - [VI. Demo sản phẩm](#vi-demo-sản-phẩm)
    - [Video demo:](#video-demo)

<a id="cài-đặt"></a>
## I. Hướng dẫn cài đặt (Setup Instructions)

### Cấu hình môi trường

- Dự án yêu cầu các biến môi trường sau để kết nối với Odoo. Vui lòng tạo/cập nhật file .env tại thư mục gốc:

```bash
# Địa chỉ instance Odoo
ODOO_URL=https://your-odoo-domain.com
# Tên cơ sở dữ liệu (Database name) hiển thị tại trang chọn DB hoặc trong trình quản lý DB của Odoo.
ODOO_DB=your_database_name
# Email hoặc Username đăng nhập vào hệ thống.
ODOO_USER=your_username_or_email
# API Key tạo trong Odoo
ODOO_PASS=your_password
```

### Authentication

Hệ thống sử dụng cơ chế xác thực 2 bước của Odoo:
- Gọi service `common` với phương thức `authenticate` để lấy UID.

```typescript
private async authenticate() {
  // 1. Caching: Trả về UID ngay nếu đã có để tối ưu hiệu năng
  if (this.uid) return this.uid;

  // 2. Auth Flow: Gọi service 'common' để lấy UID từ Odoo
  this.uid = await this.httpClient.callRPC<number>("call", {
    service: "common",
    method: "authenticate",
    args: [this.db, this.username, this.password, {}]
  });

  return this.uid;
}
```

- Sử dụng **UID** và **Password** cho các lần gọi service `object` (`execute_kw`) tiếp theo.


<a id="workflow"></a>
## II. Tài liệu luồng dữ liệu (Flow Documentation)

**Luồng thực thi lệnh (Data Flow)**

Khi người dùng nhập một lệnh (ví dụ: `ticket show 101`), luồng dữ liệu sẽ đi qua các lớp như sau:

1. Giao diện (Primary Adapter): `TicketCLIAdapter` nhận input, gọi `findById("101")` trên Service.
2. Nghiệp vụ (Domain Service): `TicketService` điều phối yêu cầu, gọi Port `TicketRepositoryPort`.
3. Kết nối (Secondary Adapter): `OdooTicketAdapter` thực hiện:

- Ép kiểu ID sang `Number`.
- Gọi `HttpClientAdapter` gửi request JSON-RPC đến Odoo.
- Nhận kết quả DTO (Data Transfer Object) từ Odoo.
  
4. Ánh xạ (Mapping): Hàm `toDomain()` chuyển đổi các trường dữ liệu Odoo (ví dụ: `stage_id`, `create_date`) về đúng định dạng Entity `Ticket` của Domain.
5. Hiển thị: Dữ liệu Entity được trả ngược lại CLI để in ra màn hình.

**Cơ chế Xử lý lỗi (Error Handling)**

Hệ thống xử lý lỗi theo 3 cấp độ:

- Lỗi Network/RPC: Được bắt tại `HttpClientAdapter` nếu server Odoo không phản hồi hoặc sai định dạng JSON.

```typescript
if (response.data.error) {
  // Bắt lỗi logic từ phía server Odoo trả về
  throw new Error(response.data.error.data?.message || "Unknown RPC error");
}
```

- Lỗi Nghiệp vụ Odoo: Bắt các lỗi như "Access Denied" (sai pass) hoặc "Model not found".

```typescript
try {
  const uid = await this.authenticate();
  // ... thực hiện call RPC
} catch (error: any) {
  throw new Error(`[Odoo] Không thể lấy dữ liệu: ${error.message}`);
}
```

- Lỗi Mapping: Đảm bảo nếu Odoo thiếu dữ liệu, hệ thống vẫn không bị crash (Graceful degradation).

```typescript
private mapStatus(stage: any): TicketStatus {
  const name = stage?.[0]
  return this.STAGE_STATUS_MAP[name] ?? "open"
}
```

<a id="cli-command"></a>
## III. Các lệnh CLI Odoo (CLI Commands)

| Command | Mô tả | Ví dụ |
| :--- | :--- | :--- |
| `ticket list` | Liệt kê tất cả ticket từ Odoo | `npx ts-node src/main.ts ticket list` |
| `ticket new` | Liệt kê các ticket mới từ Odoo | `npx ts-node src/main.ts ticket new` |
| `ticket unprocessed` | Liệt kê các ticket chưa xử lý từ Odoo | `npx ts-node src/main.ts ticket unprocessed` |
| `ticket show <id>` | Hiển thị thông tin chi tiết của ticket theo ID từ Odoo | `npx ts-node src/main.ts ticket show 123` |
| `ticket create` | Tạo ticket mới (JSON file hoặc Odoo tùy adapter) | `npx ts-node src/main.ts ticket create --title "Lỗi hệ thống" --description "Không thể đăng nhập" --status open --priority high` |
| `ticket update <id>` | Cập nhật thông tin ticket | `npx ts-node src/main.ts ticket update 123 --status done` |

<a id="integration-test"></a>
## IV. Kiểm thử tích hợp (Integration Testing)

Để đảm bảo tích hợp với Odoo API hoạt động đúng mà không cần kết nối thật mỗi lần test, ta sử dụng Mock Odoo API.

- Công cụ: `node:test` (thư viện mặc định của Node.js).
- Phạm vi test:
  - Giả lập phản hồi từ Odoo cho các lệnh `search_read`, `read`, `authenticate`.
  - Kiểm tra logic ánh xạ (Mapping) từ dữ liệu thô của Odoo sang Domain Entity.
  - Kiểm tra tính đúng đắn của tham số gửi đi (ví dụ: ID phải là kiểu số).
  
**Lệnh chạy test:**
```bash
npm run integration-test:odoo
```

<a id="cấu-trúc-dự-án"></a>
## V. Cấu trúc thư mục bổ sung (Week 3)

```
src/
├── adapters/
│   ├── primary/
│   │   └── HttpClientAdapter.ts  # Adapter tầng thấp xử lý Axios/RPC
│   └── secondary/
│       └── OdooTicketAdapter.ts  # Adapter chính kết nối Odoo
├── core/
│   └── enums/
│       └── OdooTicketDTO.ts      # Định nghĩa kiểu dữ liệu từ Odoo
└── tests/
    └── integration/
        └── adapters/
            └── OdooTicketAdapter.test.ts # File integration test
```

### Các lệnh hỗ trợ

| Command | Mô tả | Ví dụ |
| :--- | :--- | :--- |
| `ticket list` | Liệt kê tất cả ticket từ Odoo | `npx ts-node src/main.ts ticket list` |
| `ticket new` | Liệt kê các ticket mới từ Odoo | `npx ts-node src/main.ts ticket new` |
| `ticket unprocessed` | Liệt kê các ticket chưa xử lý từ Odoo | `npx ts-node src/main.ts ticket unprocessed` |
| `ticket show <id>` | Hiển thị thông tin chi tiết của ticket theo ID từ Odoo | `npx ts-node src/main.ts ticket show 123` |
| `ticket create` | Tạo ticket mới (JSON file hoặc Odoo tùy adapter) | `npx ts-node src/main.ts ticket create --title "Lỗi hệ thống" --description "Không thể đăng nhập" --status open --priority high` |
| `ticket update <id>` | Cập nhật thông tin ticket | `npx ts-node src/main.ts ticket update 123 --status done` |

Các bộ lọc (`--status`, `--priority`, `--tags`) là tùy chọn cho lệnh `list`.
Tags truyền dưới dạng chuỗi phân cách bởi dấu phẩy.

<a id="sản-phẩm"></a>
## VI. Demo sản phẩm

### Video demo:  
https://www.youtube.com/watch?v=Q5dS1OPMU9M&feature=youtu.be

Nội dung video bao gồm:
- Xem danh sách ticket
- Xem chi tiết ticket
- Xem danh sách ticket mới
- Xem danh sách ticket chưa xử lý

---