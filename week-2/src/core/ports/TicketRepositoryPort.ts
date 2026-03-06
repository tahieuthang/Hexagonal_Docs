import type { Ticket } from "../entites/Ticket";
import { CreateTicketInput, TicketFilters } from "./TicketServicePort";
import { TicketStatus } from "../entites/Ticket";

export interface TicketRepositoryPort {
  create(data: CreateTicketInput): Promise<Ticket>
  findById(id: string): Promise<Ticket | null>
  findAll(): Promise<Ticket[] | []>
  update(ticket: Ticket): Promise<Ticket>
}