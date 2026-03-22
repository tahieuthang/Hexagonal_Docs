import { Ticket, TicketStatus } from "@entities/Ticket";

export interface TicketFilter {
  title?: string[];
  tags?: string[];
  status?: string[];
}

export interface ITicketRepository {
  searchTickets(): Promise<Ticket[]>;
  updateTicket(id: string, data: Partial<{ status: TicketStatus; note: string }>): Promise<void>;
}