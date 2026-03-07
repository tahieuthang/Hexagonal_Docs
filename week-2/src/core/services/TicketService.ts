import type { TicketRepositoryPort } from "@ports/TicketRepositoryPort"
import type { CreateTicketInput, TicketServicePort, UpdateTicketInput, TicketFilters } from "@ports/TicketServicePort"
import { Ticket, TicketStatus } from "@entities/Ticket"
import { TicketNotFoundError } from "@errors/TicketNotFoundError"
import { CreateTicketTag } from "@enums/OdooTicketDTO"

export class TicketService implements TicketServicePort {
  constructor(private readonly ticketRepository: TicketRepositoryPort) {}

  async createTicket(data: CreateTicketInput): Promise<Ticket> {
    return await this.ticketRepository.create(data)
  }

  async getTicket(id: string): Promise<Ticket | null> {
    const ticket = await this.ticketRepository.findById(id)
    if(!ticket) {
      throw new TicketNotFoundError(id)
    }
    return ticket
  }

  async listTickets(filters?: TicketFilters): Promise<Ticket[] | []> {
    let tickets = await this.ticketRepository.findAll()
    if(filters) {
      if(filters?.status) {
        tickets = tickets.filter(t => t.status === filters.status)
      }
      if(filters?.priority) {
        tickets = tickets.filter(t => t.priority === filters.priority)
      }
      if(filters?.tags && filters?.tags?.length > 0) {
        tickets = tickets.filter(t => t.tags?.some((tag: string) => filters?.tags?.includes(tag)))
      }
      if(filters?.fromDate) {
        const fromTime = filters?.fromDate?.getTime()
        const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000
        tickets = tickets.filter(t => { 
          const ticketTime = t.createdAt.getTime()
          const isWithin24Hours = (ticketTime - fromTime) <= TWENTY_FOUR_HOURS_MS
          return isWithin24Hours && ticketTime > fromTime
        })
      }
    }
    return tickets
  }

  async updateTicket(id: string, data: UpdateTicketInput): Promise<Ticket> {
    const checkTicket = await this.ticketRepository.findById(id)
    if(!checkTicket) throw new TicketNotFoundError(id)
    const hasChange = checkTicket.update(data.status)
    if(!hasChange) {
      throw new Error("Đây đã là status hiện tại của ticket!")
    }
    return await this.ticketRepository.update(checkTicket)
  }

  async createTag(data: CreateTicketTag): Promise<void> {
    await this.ticketRepository.createTag(data)
  }
}