import type { ITicketRepository, TicketFilter } from "@ports/outbound/ITicketRepository"
import type { IHRService } from "@ports/outbound/IHRService"
import type { IMailService } from "@ports/outbound/IMailService"
import type { TicketServicePort } from "@ports/inbound/TicketServicePort"
import { Ticket, TicketStatus } from "@entities/Ticket"
import { formatCustomerName } from  "@utils/formatCustomerName"
import { TicketNotFoundError } from "@errors/TicketNotFoundError"
import { title } from "node:process"

export class TicketService implements TicketServicePort {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly hrService: IHRService,
    private readonly mailService: IMailService
  ) {}

  public async execute(): Promise<void> {
    let tickets = await this.ticketRepository.searchTickets()
    if(tickets) {
      tickets = tickets.filter(ticket => {
        if (ticket.status !== 'new') return false

        const title = ticket.title.toLowerCase()
        const desc = ticket.description?.toLowerCase() || ""
        const content = `${title} ${desc}`

        const loginKeywords = /mật khẩu|password|login|đăng nhập|reset|truy cập|tài khoản|account|cấp lại|lấy lại|quên/g
        if (!loginKeywords.test(content)) return false
    
        const exclusionKeywords = /feature|góp ý|tuyển dụng|nhân viên mới|outlook|nội bộ|hiển thị|không thấy|không hiện|sai thông tin|thanh toán|hủy/g
        if (exclusionKeywords.test(content)) return false
    
        let score = 0

        if (/cấp lại mật khẩu|quên mật khẩu|reset password|không đăng nhập/.test(content)) score += 2

        if (/mật khẩu|password|login|đăng nhập|reset/.test(content)) score += 1

        if (/tài khoản|account|truy cập|lấy lại|quên/.test(content)) score += 0.5

        return score >= 1.5
      });
      for(const ticket of tickets) {
        const employee = await this.hrService.checkEmployeeStatus(ticket.description)
        // Case 1: Không tìm thấy
        if(!employee) {
          await this.ticketRepository.updateTicket(ticket.id, {
            note: "Không tìm thấy nhân viên trong hệ thống HR, cần bộ phận HR review thủ công",
          })
          await this.mailService.sendResolutionEmail('tahieuthang.ngot@gmail.com', 'EMPLOYEE_NOT_FOUND', {
            customer: formatCustomerName(ticket.description ?? "khách hàng"),
            ticketId: ticket.id,
            ticketTitle: ticket.title
          })
          console.warn(`[Ticket #${ticket.id}] Skip: Employee not found in HR system.`);
          continue
        }
  
        // Case 2: Account đang active
        if(employee.status === "active") {
          Ticket.update({
            status: ticket.status
          })
          await this.ticketRepository.updateTicket(ticket.id, {
            status: TicketStatus.IN_PROGRESS
          })
          await this.mailService.sendResolutionEmail(employee.email, 'RESOLUTION_SUCCESS', {
            customer: formatCustomerName(employee.name ?? "khách hàng"),
            ticketId: ticket.id,
            ticketTitle: ticket.title
          })
          await this.ticketRepository.updateTicket(ticket.id, {
            status: TicketStatus.RESOLVED,
            note: "[Bot] Đã xử lý xong và gửi mail xử lý thành công."
          })
          continue
        }
  
        // Case 3: Đã nghỉ việc
        if(employee.status === "resigned") {
          await this.ticketRepository.updateTicket(ticket.id, {
            note: "Tình trạng: nhân viên đã nghỉ việc trong hệ thống HR, cần bộ phận HR review thủ công",
          })
          continue
        }
      }
    }
  }
}