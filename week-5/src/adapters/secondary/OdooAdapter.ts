import type { ITicketRepository, TicketFilter } from "@ports/outbound/ITicketRepository"
import type { OdooTicketDTO } from "@enums/OdooTicketDTO";
import { Ticket, TicketStatus, TicketPriority } from "@entities/Ticket";
import { HttpClientAdapter } from "@adapters/primary/HttpClientAdapter";

export class OdooAdapter implements ITicketRepository {

  private uid: number | null = null

  constructor(
    private readonly httpClient: HttpClientAdapter,
    private readonly db: string,
    private readonly username: string,
    private readonly password: string
  ) {}

  // Mapping từ Odoo sang domain
  private STAGE_STATUS_MAP: Record<string, TicketStatus> = {
    "1": TicketStatus.NEW,
    "2": TicketStatus.IN_PROGRESS,
    "3": TicketStatus.ON_HOLD,
    "4": TicketStatus.RESOLVED,
    "5": TicketStatus.CANCELLED
  };

  private PRIORITY_MAP: Record<string, TicketPriority> = {
    "0": TicketPriority.LOW,
    "1": TicketPriority.MEDIUM,
    "2": TicketPriority.HIGH,
    "3": TicketPriority.URGENT
  };

  private mapStatus(stage: any): TicketStatus {
    // Odoo trả về stage_id là [id, name], nên lấy stage[0] là ID
    const stageId = stage?.[0]?.toString();
    return this.STAGE_STATUS_MAP[stageId] ?? TicketStatus.NEW;
  }
  
  private mapPriority(priority: string): TicketPriority {
    return this.PRIORITY_MAP[priority] ?? TicketPriority.LOW;
  }

  // Mapping từ domain sang Odoo
  private STATUS_STAGE_MAP: Record<TicketStatus, number> = {
    "new": 1,
    "in_progress": 2,
    "on_hold": 3,
    "resolved": 4,
    "cancelled": 5
  }
  
  private PRIORITY_VALUE_MAP: Record<TicketPriority, string> = {
    "low": "0",
    "medium": "1",
    "high": "2",
    "urgent": "3"
  }

  private mapStatusToStage(status: TicketStatus): number {
    return this.STATUS_STAGE_MAP[status] ?? 1
  }

  private mapPriorityToOdoo(priority: TicketPriority): string {
    return this.PRIORITY_VALUE_MAP[priority] ?? "0"
  }

  private toDomain(dto: OdooTicketDTO): Ticket {
    return new Ticket(
      String(dto.id),
      dto.name,
      dto.description,
      this.mapStatus(dto.stage_id),
      this.mapPriority(dto.priority),
      new Date(dto.create_date),
      dto.write_date ? new Date(dto.write_date) : undefined
    )
  }

  private async authenticate() {
    if (this.uid) return this.uid

    const uid = await this.httpClient.callRPC<number>("call", {
      service: "common",
      method: "authenticate",
      args: [
        this.db,
        this.username,
        this.password,
        {}
      ]
    })

    this.uid = uid
    return uid
  }

  async searchTickets(): Promise<Ticket[]> {
    try {
      const uid = await this.authenticate()
  
      const result = await this.httpClient.callRPC<OdooTicketDTO[]>("call", {
        service: "object",
        method: "execute_kw",
        args: [
          this.db,
          uid,
          this.password,
          "helpdesk.ticket",
          "search_read",
          [[]],
          {
            fields: ["id", "name", "description", "stage_id", "priority", "tag_ids", "create_date", "write_date"]
          }
        ]
      })
  
      return result.map((t) => new Ticket(
        String(t.id),
        t.name,
        t.description || "",
        this.mapStatus(t.stage_id),
        this.mapPriority(t.priority),
        new Date(t.create_date),
        t.write_date ? new Date(t.write_date) : undefined
      ))
    } catch (error: any) {
      throw new Error(`Lỗi ${error.message}`)
    }
  }

  public async updateTicket(id: string, data: Partial<{ status: TicketStatus; note: string }>): Promise<void> {
    const uid = await this.authenticate();
    const ticketId = parseInt(id);
    const updateFields: any = {};

    if (data.status) {
      updateFields.stage_id = this.mapStatusToStage(data.status);
      updateFields.kanban_state = data.status === TicketStatus.RESOLVED ? 'done' : 'normal';
    }

    if (Object.keys(updateFields).length > 0) {
      await this.httpClient.callRPC("call", {
        service: "object",
        method: "execute_kw",
        args: [this.db, uid, this.password, "helpdesk.ticket", "write", [[ticketId], updateFields]]
      });
    }

    if (data.note) {
      await this.httpClient.callRPC("call", {
        service: "object",
        method: "execute_kw",
        args: [this.db, uid, this.password, "helpdesk.ticket", "message_post", [[ticketId]], { body: data.note }]
      });
    }
  }
}