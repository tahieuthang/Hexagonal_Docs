import { InvalidDataError } from "@errors/InvalidDataError"
import { TicketNotFoundError } from "@errors/TicketNotFoundError";
export enum TicketStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  RESOLVED = 'resolved',
  CANCELLED = 'cancelled'
}
export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export class Ticket {
  public readonly id: string
  public title: string
  public description: string
  public status: TicketStatus
  public priority: TicketPriority
  public createdAt: Date
  public updatedAt?: Date | undefined
  constructor(
    id: string,
    title: string,
    description: string,
    status: TicketStatus,
    priority: TicketPriority,
    createdAt: Date,
    updatedAt?: Date | undefined,
  ) {
    this.id = id
    this.title = title.trim()
    this.description = description.trim()
    this.status = status
    this.priority = priority
    this.createdAt = createdAt
    this.updatedAt = updatedAt || undefined
    this.validate()
  }

  private validate() {
    if(!this.title || this.title.trim() === '') {
      throw new InvalidDataError('Tiêu đề ticket không được để trống hoặc chỉ chứa dấu cách')
    }
    if(!this.description || this.description.trim() === '') {
      throw new InvalidDataError('Mô tả ticket không được để trống hoặc chỉ chứa dấu cách')
    }
  }

  static formRaw(data: any): Ticket {
    return new Ticket(
      data.id,
      data.title,
      data.description,
      data.status as TicketStatus,
      data.priority as TicketPriority,
      data.createdAt,
      data.updatedAt,
    )
  }

  public update(data: Partial<{ status: string; tags: string[] }>): void {
    if(data.status !== undefined) this.status = data.status as TicketStatus
    this.updatedAt = new Date()
    this.validate()
  }
}