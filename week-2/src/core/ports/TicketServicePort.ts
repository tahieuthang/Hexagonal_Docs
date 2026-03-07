import { CreateTicketTag } from "@enums/OdooTicketDTO";
import type { Ticket, TicketStatus, TicketPriority, TicketTag } from "../entites/Ticket";

export type CreateTicketInput = {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  tags?: TicketTag[];
};

export type UpdateTicketInput = {
  status: TicketStatus;
};

export type TicketFilters = {
  status?: string;
  priority?: string;
  tags?: string[];
  fromDate?: Date;
}

export interface TicketServicePort {
  createTicket(data: CreateTicketInput): Promise<Ticket>
  getTicket(id: string): Promise<Ticket | null>
  listTickets(filters?: TicketFilters): Promise<Ticket[] | []>
  updateTicket(id: string, data: UpdateTicketInput): Promise<Ticket>
  createTag(data: CreateTicketTag): Promise<void>
}