import { TicketTag } from "@entities/Ticket"

export interface OdooTicketDTO {
  id: number
  name: string
  description: string
  stage_id: [number, string]
  priority: string
  tag_ids: number[]
  create_date: string
  write_date?: string
}

export type CreateTicketTag = {
  tag: TicketTag
}