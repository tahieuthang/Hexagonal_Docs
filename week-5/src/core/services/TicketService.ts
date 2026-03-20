import type { ITicketRepository, TicketFilter } from "@ports/outbound/ITicketRepository"
import type { IHRService } from "@ports/outbound/IHRService"
import type { IMailService } from "@ports/outbound/IMailService"
import type { TicketServicePort } from "@ports/inbound/TicketServicePort"
import { Ticket, TicketStatus } from "@entities/Ticket"
import { TicketNotFoundError } from "@errors/TicketNotFoundError"

export class TicketService implements TicketServicePort {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly hrService: IHRService,
    private readonly mailService: IMailService
  ) {}

  async execute(): Promise<void> {
    let tickets = await this.ticketRepository.searchTickets()
    for(const ticket of tickets) {
        const employee = await this.hrService.checkEmployeeStatus(ticket.name)
        if(!employee) {
            await this.ticketRepository.updateTicket(ticket.id, {
                note: "Không tìm thấy nhân viên trong hệ thống HR",
                tags: ["Manual Review"]
            })
            await this.mailService.sendResolutionEmail(ticket.description, ticket)
            return
        }
        if(employee.status === "active") {
            await this.ticketRepository.updateTicket(ticket.id, {
                status: TicketStatus.In_Progress
            })
            await this.mailService.sendResolutionEmail(employee, ticket)
            return
        }
        if(employee.status === "resigned") {
            await this.ticketRepository.updateTicket(ticket.id, {
                note: "Nhân viên đã nghỉ",
                tags: ["Resigned"]
            })
            await this.mailService.sendResolutionEmail(employee, ticket)
            return
        }
    }
    // if(filters) {
    //   if(filters?.status) {
    //     tickets = tickets.filter(t => t.status === filters.status)
    //   }
    //   if(filters?.priority) {
    //     tickets = tickets.filter(t => t.priority === filters.priority)
    //   }
    //   if(filters?.tags && filters?.tags?.length > 0) {
    //     tickets = tickets.filter(t => t.tags?.some((tag: string) => filters?.tags?.includes(tag)))
    //   }
    //   if(filters?.currentDate) {
    //     const currentTime = filters?.currentDate?.getTime()
    //     const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000
        
    //     tickets = tickets.filter(t => { 
    //       const ticketTime = t.createdAt.getTime()
    //       const timeDiff = currentTime - ticketTime
    //       return timeDiff >= 0 && timeDiff <= TWENTY_FOUR_HOURS_MS
    //     })
    //   }
    // }
    // return tickets
  }
}