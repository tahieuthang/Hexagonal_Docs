# Nghiên cứu Hexagonal Architecture (Ports & Adapters)

Tài liệu này là một bản nghiên cứu về Hexagonal Architecture (Ports & Adapters). Nội dung được chia thành các phần: nguyên tắc cốt lõi, các thành phần, cách hoạt động, ví dụ minh họa, kiểm chứng/contract, ưu/nhược điểm, khi nào nên áp dụng, so sánh với các mẫu kiến trúc khác và kết luận.

## Bằng chứng quy trình & cách xác thực (Research → Summary → Example → Confirmation)

- Research: xem "Giới thiệu" và "I. Nguyên tắc cốt lõi" — thu thập khái niệm, nguyên tắc và semantic của Ports/Adapters.
- Summary: xem "II. Ưu điểm và nhược điểm" và "III. Khi nào nên áp dụng" — tóm tắt quyết định áp dụng và trade‑offs.
- Example: xem "Ví dụ thực tế: thao tác hệ thống tập tin" — code minh họa ports, core và adapters (Node FS + InMemory).
- Confirmation: xem "Kiểm chứng Hexagonal Architecture" và "Enforcing Behavioral Equivalence" — bao gồm ví dụ test và đề xuất shared contract test suite để kiểm tra tính compliant của các adapter.

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

### 4. Ứng dụng phải độc lập với nguồn kích hoạt (actor)

Lõi ứng dụng không được phụ thuộc vào cách nó được kích hoạt.

Ứng dụng có thể được điều khiển bởi:
- giao diện người dùng
- kiểm thử tự động
- batch job
- hệ thống bên ngoài
- API khác

Tất cả tương tác với lõi phải đi qua inbound port.

### 5. Không ưu tiên một chiều phụ thuộc kiểu “tầng” (Layered)

Khác với mô hình phân tầng truyền thống (UI → Service → DB), Hexagonal tổ chức theo boundary Inside ↔ Outside. Layer vẫn có thể tồn tại bên trong Core hoặc Adapter nhưng không phải trục kiến trúc chính.

---

## Các thành phần chính của Hexagonal Architecture

1. Core Application (Bên trong ứng dụng)
- Chứa domain logic và use cases.
- Core định nghĩa các ports và không phụ thuộc vào UI, database hay framework.
- Mọi dependency đều phải hướng vào Core.
  
2. Ports (Cổng kết nối)
- Là abstraction (thường ở dạng interface) do Core định nghĩa
- Không chứa logic kỹ thuật hay chi tiết implementation
- Không chứa logic kỹ thuật hay chi tiết implementation
  • Inbound ports: được Core triển khai (implement) để nhận yêu cầu từ bên ngoài và thực thi logic nghiệp vụ.
  • Outbound ports: được Core sử dụng để gọi ra bên ngoài (ví dụ: persistence, external service), nhưng implementation cụ thể nằm ở adapter.

1. Adapters (Bộ chuyển đổi)
- Là implementation của Port theo một công nghệ, thư viện hoặc hệ thống cụ thể (SQL, REST, Redis, AWS S3...).
- Adapters không chứa business logic.
- Adapters phụ thuộc vào port (abstraction) do Core định nghĩa
- Chuyển đổi dữ liệu và protocol giữa môi trường bên ngoài sang ngôn ngữ của Core.

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

Port do core định nghĩa, không có code kỹ thuật. Port chỉ biết interface, không import fs, không biết ổ đĩa là gì

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

FileService không biết dữ liệu được lưu ở đâu, dễ test, dễ thay thế adapter

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

Adapter biết fs, path, chịu toàn bộ chi tiết kỹ thuật và có thể bị thay thế mà core không đổi

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

Controller có nhiệm vụ nhận input, gọi use case và không chứa business logic

```ts
// adapters/FileController.ts
import { FileService } from '../application/FileService'
import { NodeFileSystemAdapter } from './NodeFileSystemAdapter'

const fileStorage = new NodeFileSystemAdapter()
const fileService = new FileService(fileStorage)

async function run() {
	await fileService.saveNote('hexagonal', 'Ports and Adapters are awesome!')
	const content = await fileService.readNote('hexagonal')
}
run()
```

---

## Kiểm chứng Hexagonal Architecture

Hexagonal cho phép test core mà không cần file system thật bằng cách dùng adapters in-memory hoặc mock. Tạo 1 adapter hợp lệ khác giúp ta test mà không cần disk, chạy cực nhanh bằng cách lưu file vào RAM

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

Test core mà không dùng file system: giúp ta test core không phụ thuộc vào IO, không mock fs và không cần setup hay phụ thuộc vào framework

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

Giả sử Business Logic đưa ra yêu cầu: 
> *"Sau khi lưu file, hệ thống phải đảm bảo dữ liệu tồn tại vĩnh viễn (persist after restart)."*

Khi đó, hai Adapter khác nhau sẽ cho ra kết quả khác nhau:

* **Adapter 1 (File System):**
    * **Hành vi:** Ghi dữ liệu trực tiếp xuống ổ cứng.
    * **Kết quả:** Dữ liệu tồn tại sau khi restart process $\rightarrow$ **ĐẠT** yêu cầu.
* **Adapter 2 (RAM Adapter):**
    * **Hành vi:** Lưu dữ liệu vào bộ nhớ đệm (In-memory).
    * **Kết quả:** Dữ liệu bị xóa sạch ngay khi restart process $\rightarrow$ **VI PHẠM** tính bền vững.

Nguyên nhân của vấn đề: Vấn đề nảy sinh khi Port chỉ được định nghĩa dựa trên các tham số kỹ thuật mà bỏ qua các ràng buộc về mặt nghiệp vụ.

```ts
interface FileStoragePort {
  save(path: string, data: Buffer): void
}
```

Port trên chỉ mô tả hành động kỹ thuật “save”, nhưng không mô tả:

-	Tính bền vững (Persistence): Dữ liệu có tồn tại sau khi hệ thống restart không?
-	Tính nhất quán (Consistency): Có đảm bảo dữ liệu được ghi thành công toàn bộ hay không?
-	Độ tin cậy: Cơ chế xử lý khi ổ đĩa đầy hoặc lỗi bộ nhớ là gì?

Khi constact không đúng về mặt ngữ nghĩa thì mọi adapter đều trông có vẻ hợp lệ nhưng không phải adapter nào cũng đúng về mặt business

### Làm sao để tránh các ngoại lệ trong Hexagonal Architecture?

1. Thiết kế (Design)

- Thiết kế port ở cùng abstraction level với domain model (business capability), không mô tả infrastructure.
- Port phải định nghĩa rõ semantic guarantees (durability, atomicity, failure model, types of errors, idempotency, v.v.).
- Adapter phải bảo toàn Semantic Contract của Port, các adapter implement cùng port thì đều phải tương đương về hành vi theo đúng semantic contract của port (behavioral equivalence), không chỉ tương đường về signature method.

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

2. Thực thi (Enforcement)

Mục tiêu: đảm bảo các nguyên tắc thiết kế không bị phá vỡ trong quá trình triển khai.

Cơ chế thực thi:

- Ghi rõ semantic contract trong documentation.
- Định nghĩa rõ exception types và failure model.
- Xây dựng contract test suite dùng chung cho mỗi port; mọi adapter phải pass test này

---

## II. Ưu điểm và nhược điểm

### 1. Ưu điểm

- Tách biệt rõ business và infrastructure.
- Khả năng testability cao: core test độc lập bằng mock/fake adapter.
- Dễ thay đổi công nghệ bên ngoài mà không ảnh hưởng core.
- Dễ bảo trì và mở rộng (nhiều adapter cho cùng port).
- Hệ thống cho phép mọi Actor (UI, CLI, Test, Batch Jobs) dùng chung một Logic nghiệp vụ duy nhất thông qua các Port.
- Phù hợp cho hệ thống lớn hoặc microservices.

Ví dụ: đổi DB từ MySQL sang MongoDB chỉ cần thay adapter, không thay core.

### 2. Nhược điểm

- Độ phức tạp ban đầu cao: nhiều abstraction, interface.
- Có thể là over-engineering cho ứng dụng nhỏ hoặc prototype.
- Quản lý nhiều adapter có thể khá nặng, cần quản lý tốt.
- Thay đổi port contract có thể khiến nhiều adapter phải cập nhật.
- Nhiều abstraction khiến codebase rộng hơn (nhiều file/interface), có thể gây khó khăn khi trace lỗi

Ví dụ: ứng dụng CRUD nhỏ có thể bị thừa abstraction và tăng chi phí phát triển.

---

## III. Khi nào nên áp dụng Hexagonal Architecture

### 1. Hệ thống có business phức tạp và thay đổi thường xuyên
 
Khi hệ thống yêu cầu nhiều nghiệp vụ, nhiều use case, dễ biến động theo thời gian, lúc này Hexagonal giúp:

-	Tách rõ ràng logic nghiệp vụ khỏi công nghệ
-	Giúp core ổn định lâu dài
-	Giảm rủi ro khi thay đổi yêu cầu nghiệp vụ

Trong các hệ thống như tài chính, e-commerce hoặc các nền tảng có nhiều bước xử lý nghiệp vụ, logic thường phức tạp và dễ biến động. Nếu business logic bị trộn lẫn với framework, database hoặc API layer, mỗi thay đổi nhỏ có thể ảnh hưởng dây chuyền.

### 2. Yêu cầu test automation và isolate test
 
Hexagonal cho phép test core độc lập với Framework/UI/DB bằng mock/fake adapter

- Test business logic không cần DB thật.
- Không cần HTTP server để test các use case.

### 3. Có nhiều external interfaces / multiple actors (REST, CLI, message, batch…)

Một hệ thống cần phục vụ nhiều đường vào:

-	REST API
-	CLI tool
-	Message consumer
-	Batch jobs

Hexagonal cho phép nhiều adapter cùng kết nối đến 1 inbound port, giúp nhiều actor sử dụng chung 1 business logic mà không làm thay đổi core.

### 4. Cần thay đổi hoặc mở rộng công nghệ bên ngoài thường xuyên.

### 5. Muốn di chuyển hoặc áp dụng Domain-Driven Design (DDD).

- Nếu hệ thống có domain phức tạp, nhiều quy tắc nghiệp vụ, nhiều khái niệm cần mô hình hóa rõ ràng và có nhiều team cùng phát triển → Hexagonal giúp tạo nền tảng phù hợp để áp dụng DDD.
- Trong những hệ thống mà business logic là trung tâm và cần được thiết kế cẩn thận (entity, value object, domain service, bounded context…), việc tách domain khỏi framework và hạ tầng là điều bắt buộc

Không nên dùng khi:

- Ứng dụng nhỏ, đơn giản, chỉ CRUD.
- Prototype ngắn hạn, cần time-to-market nhanh, không maintain lâu dài.
- Team chưa sẵn sàng với mức độ abstraction cao.
- Hệ thống cực kỳ nhạy cảm với latency/overhead của abstraction.

---

## IV. So sánh Hexagonal Architecture với các mẫu kiến trúc khác

### 1. Layered Architecture (N-Tier)

- Cấu trúc: Presentation → Application → Domain → infraconstructure
- Điểm mạnh: Đơn giản, dễ triển khai, phù hợp CRUD, dễ tiếp cận
- Hạn chế: Domain dễ phụ thuộc infraconstructure, Khó test isolate, business logic dễ bị rò rỉ sang layer khác
- Phù hợp: Hệ thống CRUD đơn giản, business logic không phức tạp
- So sánh: Layered tổ chức theo tầng, domain có thể phụ thuộc infra; Hexagonal tổ chức theo boundary, domain không phụ thuộc trực tiếp infraconstructure.

### 2. Clean Architecture

- Cấu trúc: Entities → Use Cases → Interface Adapters → Frameworks.
- Điểm mạnh: Dependency rule rõ ràng, phù hợp DDD, tách domain khỏi framework.
- Hạn chế: Nhiều layer, phức tạp hơn, Có thể over-engineering với hệ thống nhỏ.
- Phù hợp: Hệ thống lớn, domain phức tạp, nhiều use case.
- So sánh: Clean ≈ Hexagonal về mục tiêu; Clean có cấu trúc layer chi tiết hơn; Hexagonal đơn giản hơn, tập trung vào khái niệm Port & Adapter.

### 3. Onion Architecture

- Cấu trúc: Domain Core ở trung tâm → Application → infraconstructure ở ngoài.
- Điểm mạnh: Nhấn mạnh domain purity và vòng đồng tâm.
- Hạn chế: Không mô tả explicit inbound/outbound port.
- So sánh: Onion và Hexagonal gần như cùng triết lý; Onion nhấn mạnh “layer đồng tâm”; Hexagonal nhấn mạnh Ports & Adapters.

### 4. Monolithic MVC

- Cấu trúc phổ biến: Controller → Service → Repository
- Điểm mạnh: Rất dễ tiếp cận, framework hỗ trợ mạnh (Spring, Rails, Laravel…), tốc độ phát triển cao
- Hạn chế: domain dễ bị rò rỉ vào controller/service/repository, khó thay đổi hạ tầng lớn
- Phù hợp: Ứng dụng CRUD, startup cần time-to-market nhanh và hệ thống không có domain phức tạp
- So sánh: MVC phù hợp hệ thống nhỏ; Hexagonal phù hợp domain phức tạp, nhiều actor và cần isolate business logic, 

---

## V. Kết luận

Hexagonal Architecture không phải là kiến trúc duy nhất hoặc "tốt nhất" cho mọi tình huống. Đây là lựa chọn phù hợp khi hệ thống có domain phức tạp, cần bảo vệ business logic khỏi hạ tầng, cần test isolate và phải phục vụ nhiều actor hoặc thay đổi công nghệ thường xuyên. Lựa chọn kiến trúc nên dựa trên độ phức tạp domain, khả năng thay đổi công nghệ và năng lực đội ngũ.

## Tài liệu tham khảo / Ghi chú

- Thuật ngữ: Hexagonal Architecture ≡ Ports & Adapters.
- Các ví dụ code trên là minh họa bằng TypeScript; có thể chuyển thể sang ngôn ngữ khác.

