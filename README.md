# Nghiên cứu Hexagonal Architecture (Ports & Adapters)

Tài liệu này là một bản nghiên cứu về Hexagonal Architecture (Ports & Adapters). Nội dung được chia thành các phần: nguyên tắc cốt lõi, các thành phần, cách hoạt động, ví dụ minh họa, kiểm chứng/contract, ưu/nhược điểm, khi nào nên áp dụng, so sánh với các mẫu kiến trúc khác và kết luận.

## Mục lục

- [Giới thiệu](#gi%E1%BB%9Bi-thi%E1%BB%87u)
- [I. Nguyên tắc cốt lõi](#i-nguy%E1%BB%85n-t%E1%BA%A7c-c%E1%BB%91t-l%C3%A2n)
	- [Hexagonal Architecture là gì?](#hexagonal-architecture-l%C3%A0-g%C3%AC)
	- [Tách biệt lõi nghiệp vụ và công nghệ bên ngoài](#t%C3%A1ch-bi%E1%BB%87t-l%C3%B3i-nghi%E1%BB%87p-v%E1%BB%A5-v%C3%A0-c%C3%B4ng-ngh%E1%BB%87-b%C3%AAn-ngo%C3%A0i)
	- [Ports (Cổng kết nối)](#ports-c%E1%BB%93ng-k%E1%BA%BFt-n%E1%BB%91i)
	- [Adapters (Bộ chuyển đổi)](#adapters-b%E1%BB%98-chuy%E1%BB%83n-%C4%91%E1%BB%95i)
	- [Ứng dụng có thể được điều khiển bởi bất kỳ actor nào](#%C3%BAng-d%E1%BB%A5ng-c%C3%B3-th%E1%BB%83-%C4%91i%E1%BB%81u-khi%E1%BB%83n-b%E1%BA%A5t-k%E1%BB%B3-actor-n%C3%A0o)
	- [Không ưu tiên chiều phụ thuộc kiểu "tầng"](#kh%C3%B4ng-%C6%B0u-ti%C3%AAn-chi%E1%BB%81u-ph%E1%BB%A5-thu%E1%BB%91c-k%E1%BB%B9-t%E1%BA%BFng)
- [II. Ưu điểm và nhược điểm](#ii-%C6%B0u-%C4%91i%E1%BB%83m-v%C3%A0-nh%C6%B0%E1%BB%A3c-%C4%91i%E1%BB%83m)
- [III. Khi nào nên áp dụng](#iii-khi-n%C3%A0o-n%C3%AAn-%C3%A1p-d%E1%BB%A5ng)
- [IV. So sánh với các kiến trúc khác](#iv-so-s%C3%A1nh-v%E1%BB%9Bi-c%C3%A1c-ki%E1%BA%BFn-tr%C3%BAc-kh%C3%A1c)
- [V. Kết luận](#v-k%E1%BA%BFt-lu%E1%BA%ADn)
- [Tài liệu tham khảo / Ghi chú](#t%C3%A0i-li%E1%BB%87u-tham-kh%E1%BB%A3)

## Giới thiệu

Hexagonal Architecture (Ports & Adapters) là một mẫu kiến trúc giúp tách lõi nghiệp vụ (business/application core) khỏi chi tiết công nghệ bên ngoài (UI, DB, framework, network, v.v.). Mục tiêu là làm cho core ổn định, dễ kiểm thử và dễ thay đổi công nghệ bên ngoài mà không ảnh hưởng đến business logic.

---

## I. Nguyên tắc cốt lõi

### Hexagonal Architecture là gì?

Hexagonal Architecture (Ports & Adapters) là mẫu thiết kế nhằm tổ chức hệ thống sao cho logic nghiệp vụ đứng độc lập hoàn toàn với công nghệ bên ngoài. Điểm cốt lõi:

- Không phụ thuộc trực tiếp vào UI, DB hay framework.
- Tương tác giữa lõi và bên ngoài chỉ qua các giao diện trừu tượng (ports).
- Mỗi port có thể có nhiều adapter theo công nghệ khác nhau.

### 1. Tách biệt lõi nghiệp vụ và công nghệ bên ngoài

Core phải tồn tại hoàn toàn độc lập với UI, database, network, framework hoặc bất kỳ chi tiết kỹ thuật nào.

Nguyên tắc bắt buộc:

- Core không được phép phụ thuộc vào bất kỳ chi tiết kỹ thuật nào.
- Mọi dependency phải hướng vào Core (Dependency Inversion ở cấp kiến trúc).
- Infrastructure phụ thuộc vào Core, không phải ngược lại.

Lợi ích:

- Core có thể được kiểm thử độc lập bằng mock adapter.
- Có thể thay đổi UI, database, framework hoặc external service mà không ảnh hưởng logic nghiệp vụ.
- Tránh việc business logic bị rò rỉ vào UI hoặc infrastructure code.

Hexagonal Architecture không chỉ tách UI/DB ra khỏi business logic, mà còn đảo chiều phụ thuộc để bảo vệ Core như trung tâm ổn định của hệ thống.

### 2. Mọi tương tác với lõi đều qua "Ports"

- Port là Architectural Boundary giữa Inside (Core) và Outside (UI, DB, Framework, …).
- Port không chỉ định nghĩa method signature, mà còn định nghĩa semantic contract (ai gọi ai, ai chịu trách nhiệm, guarantees …).
- Port thuộc về Core; adapters phụ thuộc vào port và triển khai port.

### 3. "Adapters" là các triển khai cụ thể của các port

Adapter là lớp kết nối thực tế giữa port và thế giới bên ngoài.

- Chuyển yêu cầu từ UI/HTTP/CLI thành các gọi port.
- Chuyển dữ liệu từ core sang database, queue hoặc external service.
- Có thể có nhiều adapter cho cùng một port.
- Adapter không chứa business rule; mọi logic nghiệp vụ phải nằm trong Core.

Kết quả:

- Adapter có thể thay thế dễ dàng.
- Mở rộng tính năng bằng adapter mới thay vì sửa core.

### 4. Ứng dụng có thể được điều khiển bởi bất kỳ “actor” nào

Các actor: automated tests, batch scripts, hệ thống khác, UI khác. Tất cả đều thông qua ports/adapters.

### 5. Không ưu tiên một chiều phụ thuộc kiểu “tầng” (Layered)

Khác với mô hình phân tầng truyền thống (UI → Service → DB), Hexagonal tổ chức theo boundary Inside ↔ Outside. Layer vẫn có thể tồn tại bên trong Core hoặc Adapter nhưng không phải trục kiến trúc chính.

---

## Các thành phần chính của Hexagonal Architecture

1. Core Application (Bên trong ứng dụng): chứa domain logic, use cases và định nghĩa ports.
2. Ports (Cổng kết nối): interface do Core định nghĩa; có inbound và outbound port.
3. Adapters: triển khai cụ thể của ports để tích hợp với UI, DB, files, message queue, v.v.

---

## Cách thức hoạt động

Quy trình điển hình khi có sự kiện bên ngoài gọi vào:

1. Adapter nhận input từ UI/CLI/API…
2. Adapter dịch dữ liệu và gọi inbound port.
3. Core (triển khai inbound port) xử lý logic nghiệp vụ.
4. Core dùng outbound ports nếu cần gọi DB hoặc service bên ngoài.
5. Adapter tương ứng thực thi outbound port và trả kết quả.
6. Output quay lại adapter rồi trả ra thế giới ngoài.

Dependency Direction (Rất quan trọng): mặc dù runtime flow là Outside → Inside → Outside, chiều dependency luôn hướng vào Core: Adapter phụ thuộc port; port thuộc Core; Core không phụ thuộc adapter.

---

## Ví dụ thực tế: thao tác hệ thống tập tin (File System)

Ứng dụng: Lưu và đọc nội dung note.

### 5.1 Port — định nghĩa contract với hệ thống tập tin

Ví dụ (minh họa):

```ts
// ports/FileStoragePort.ts
export interface FileStoragePort {
	write(path: string, content: string): Promise<void>
	read(path: string): Promise<string>
}
```

Ghi chú: ví dụ này minh họa ý tưởng nhưng nên cân nhắc thiết kế port ở mức semantic (ví dụ DocumentPersistencePort) để tránh rò rỉ detail kỹ thuật vào core.

### 5.2 Core / Application Service (Use Case)

```ts
// application/FileService.ts
import { FileStoragePort } from '../ports/FileStoragePort'

export class FileService {
	constructor(private fileStorage: FileStoragePort) {}

	async saveNote(title: string, content: string) {
		const path = `notes/${title}.txt`
		await this.fileStorage.write(path, content)
	}

	async readNote(title: string): Promise<string> {
		const path = `notes/${title}.txt`
		return this.fileStorage.read(path)
	}
}
```

### 5.3 Adapter — File System thật (Node.js)

```ts
// adapters/NodeFileSystemAdapter.ts
import { promises as fs } from 'fs'
import path from 'path'
import { FileStoragePort } from '../ports/FileStoragePort'

export class NodeFileSystemAdapter implements FileStoragePort {
	async write(filePath: string, content: string): Promise<void> {
		const fullPath = path.resolve(filePath)
		await fs.mkdir(path.dirname(fullPath), { recursive: true })
		await fs.writeFile(fullPath, content, 'utf-8')
	}

	async read(filePath: string): Promise<string> {
		const fullPath = path.resolve(filePath)
		return fs.readFile(fullPath, 'utf-8')
	}
}
```

### 5.4 Inbound Adapter — Controller (ví dụ CLI / API)

```ts
// adapters/FileController.ts
import { FileService } from '../application/FileService'
import { NodeFileSystemAdapter } from './NodeFileSystemAdapter'

const fileStorage = new NodeFileSystemAdapter()
const fileService = new FileService(fileStorage)

async function run() {
	await fileService.saveNote('hexagonal', 'Ports and Adapters are awesome!')
	const content = await fileService.readNote('hexagonal')
	console.log(content)
}
run()
```

---

## Kiểm chứng Hexagonal Architecture

Hexagonal cho phép test core mà không cần file system thật bằng cách dùng adapters in-memory hoặc mock.

Ví dụ adapter in-memory để test:

```ts
// adapters/InMemoryFileStorageAdapter.ts
import { FileStoragePort } from '../ports/FileStoragePort'

export class InMemoryFileStorageAdapter implements FileStoragePort {
	private storage = new Map<string, string>()

	async write(path: string, content: string): Promise<void> {
		this.storage.set(path, content)
	}

	async read(path: string): Promise<string> {
		const content = this.storage.get(path)
		if (!content) throw new Error('File not found')
		return content
	}
}
```

Ví dụ test đơn giản:

```ts
// tests/FileService.test.ts
import { FileService } from '../application/FileService'
import { InMemoryFileStorageAdapter } from '../adapters/InMemoryFileStorageAdapter'

test('save and read note', async () => {
	const storage = new InMemoryFileStorageAdapter()
	const service = new FileService(storage)

	await service.saveNote('test', 'Hello Hexagonal')
	const content = await service.readNote('test')

	expect(content).toBe('Hello Hexagonal')
})
```

### Trường hợp ngoại lệ: Behavioral Non-Equivalence

Một cạm bẫy: nếu port không định nghĩa semantic guarantees rõ ràng, các adapter khác nhau có thể có hành vi không tương đương (ví dụ: in-memory không survive restart). Điều này dẫn tới "architectural illusion": interface đúng nhưng behavior không đúng.

### Thiết kế port để tránh ngoại lệ

- Thiết kế port ở cùng abstraction level với domain model (business capability), không mô tả infrastructure.
- Port phải định nghĩa rõ semantic guarantees (durability, atomicity, failure model, types of errors, idempotency, v.v.).

Ví dụ tốt (semantic port):

```ts
interface DocumentPersistencePort {
	/**
	 * Persists document durably.
	 * Must survive process restart.
	 * Must be atomic.
	 * Must not partially commit.
	 */
	save(document: Document): Promise<void>
	get(id: DocumentId): Promise<Document>
}
```

### Enforcing Behavioral Equivalence

- Ghi rõ semantic contract trong documentation và exception types.
- Xây dựng shared contract test suite cho mỗi port. Mọi adapter phải pass test suite này để được coi là compliant.

---

## II. Ưu điểm và nhược điểm

### 1. Ưu điểm

- Tách biệt rõ business và infrastructure.
- Khả năng testability cao: core test độc lập bằng mock/fake adapter.
- Dễ thay đổi công nghệ bên ngoài mà không ảnh hưởng core.
- Dễ bảo trì và mở rộng (nhiều adapter cho cùng port).
- Phù hợp cho hệ thống lớn hoặc microservices.

Ví dụ: đổi DB từ MySQL sang MongoDB chỉ cần thay adapter, không thay core.

### 2. Nhược điểm

- Độ phức tạp ban đầu cao: nhiều abstraction, interface.
- Có thể là over-engineering cho ứng dụng nhỏ hoặc prototype.
- Quản lý nhiều adapter tốn công.
- Thay đổi port contract có thể khiến nhiều adapter phải cập nhật.

Ví dụ: ứng dụng CRUD nhỏ có thể bị thừa abstraction và tăng chi phí phát triển.

---

## III. Khi nào nên áp dụng Hexagonal Architecture

1. Hệ thống có business phức tạp và thay đổi thường xuyên.
2. Yêu cầu test automation và isolate test (không dùng DB thật trong unit tests).
3. Có nhiều external interfaces / multiple actors (REST, CLI, message, batch…).
4. Cần thay đổi hoặc mở rộng công nghệ bên ngoài thường xuyên.
5. Muốn di chuyển hoặc áp dụng Domain-Driven Design (DDD).

Không nên dùng khi:

- Ứng dụng nhỏ, đơn giản, chỉ CRUD.
- Prototype ngắn hạn, cần time-to-market nhanh.
- Team chưa sẵn sàng với mức độ abstraction cao.
- Hệ thống cực kỳ nhạy cảm với latency/overhead của abstraction.

---

## IV. So sánh Hexagonal Architecture với các mẫu kiến trúc khác

### 1. Layered Architecture (N-Tier)

- Tổ chức theo tầng: Presentation → Application → Domain → Infrastructure.
- Phù hợp CRUD nhỏ, nhưng domain dễ bị phụ thuộc infra.

So sánh: Layered tổ chức theo tầng; Hexagonal tổ chức theo boundary. Nếu CRUD đơn giản thì Layered đủ, nếu cần bảo vệ domain nghiêm ngặt thì Hexagonal tốt hơn.

### 2. Clean Architecture

- Entities → Use Cases → Interface Adapters → Frameworks.
- Giống Hexagonal ở chỗ dependency hướng vào trong. Clean Architecture chia layer chi tiết hơn.

### 3. Onion Architecture

- Domain core ở trung tâm, infrastructure ở ngoài.
- Rất giống triết lý với Hexagonal; khác biệt chính là cách nhấn mạnh (layer đồng tâm vs ports & adapters).

### 4. Monolithic MVC

- Controller → Service → Repository. Dễ tiếp cận, nhanh cho CRUD, nhưng domain thường phụ thuộc ORM và business logic có thể rò rỉ.

So sánh: MVC phù hợp hệ thống nhỏ; Hexagonal phù hợp domain phức tạp cần isolate business logic.

---

## V. Kết luận

Hexagonal Architecture không phải là kiến trúc duy nhất hoặc "tốt nhất" cho mọi tình huống. Đây là lựa chọn phù hợp khi hệ thống có domain phức tạp, cần bảo vệ business logic khỏi hạ tầng, cần test isolate và phải phục vụ nhiều actor hoặc thay đổi công nghệ thường xuyên. Lựa chọn kiến trúc nên dựa trên độ phức tạp domain, khả năng thay đổi công nghệ và năng lực đội ngũ.

## Tài liệu tham khảo / Ghi chú

- Thuật ngữ: Hexagonal Architecture ≡ Ports & Adapters.
- Các ví dụ code trên là minh họa bằng TypeScript; có thể chuyển thể sang ngôn ngữ khác.

