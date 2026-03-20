import { Ticket } from "@entities/Ticket";

export interface TicketFilter {
  title?: string[];
  tags?: string[];
  status?: string[];
}

export interface ITicketRepository {
  searchTickets(): Promise<Ticket[]>;
  updateTicket(id: string, data: Partial<Ticket>): Promise<void>;
}