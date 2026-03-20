export interface TicketServicePort {
  execute(): Promise<void>
}