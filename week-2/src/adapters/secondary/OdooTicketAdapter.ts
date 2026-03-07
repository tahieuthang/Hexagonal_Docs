import type { TicketRepositoryPort } from "@ports/TicketRepositoryPort"
import { Ticket, TicketStatus } from "@entities/Ticket"
import { CreateTicketInput, TicketFilters } from "@ports/TicketServicePort";
import { HttpClientAdapter } from "@adapters/primary/HttpClientAdapter";
import type { CreateTicketTag, OdooTicketDTO } from "@enums/OdooTicketDTO";
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { error, log } from "node:console";
import { TicketNotFoundError } from "@errors/TicketNotFoundError";
import { TicketPriority, TicketTag } from "@entities/Ticket";
import { title } from "node:process";
import { TIMEOUT } from "node:dns";

export class OdooTicketAdapter implements TicketRepositoryPort {

  private uid: number | null = null

  constructor(
    private readonly httpClient: HttpClientAdapter,
    private readonly db: string,
    private readonly username: string,
    private readonly password: string
  ) {}

  // Mapping từ Odoo sang domain
  private STAGE_STATUS_MAP: Record<string, TicketStatus> = {
    "1": "open",
    "2": "in-progress",
    "3": "done",
    "4": "done",
    "5": "cancelled"
  }

  private PRIORITY_MAP: Record<string, TicketPriority> = {
    "0": "low",
    "1": "medium",
    "2": "high",
    "3": "urgent"
  }

  private TAG_MAP: Record<number, TicketTag> = {
    7: "bug",
    6: "feature",
    9: "task",
    8: "fix"
  }

  private mapStatus(stage: any): TicketStatus {
    const name = stage?.[0]
    return this.STAGE_STATUS_MAP[name] ?? "open"
  }
  
  private mapPriority(priority: string): TicketPriority {
    return this.PRIORITY_MAP[priority] ?? "low"
  }
  
  private mapTags(tagIds: number[]): TicketTag[] {
    return tagIds
      .map(id => this.TAG_MAP[id])
      .filter((tag): tag is TicketTag => Boolean(tag))
  }

  // Mapping từ domain sang Odoo
  private STATUS_STAGE_MAP: Record<TicketStatus, number> = {
    "open": 1,
    "in-progress": 2,
    "done": 3 ,
    "cancelled": 5
  }
  
  private PRIORITY_VALUE_MAP: Record<TicketPriority, string> = {
    "low": "0",
    "medium": "1",
    "high": "2",
    "urgent": "3"
  }
  
  private TAG_ID_MAP: Record<TicketTag, number> = {
    "bug": 7,
    "feature": 6,
    "task": 9,
    "fix": 8
  }

  private mapStatusToStage(status: TicketStatus): number {
    return this.STATUS_STAGE_MAP[status] ?? 1
  }

  private mapPriorityToOdoo(priority: TicketPriority): string {
    return this.PRIORITY_VALUE_MAP[priority] ?? "0"
  }

  private mapTagsToOdoo(tags: TicketTag[]): number[] {
    return tags
      .map(tag => this.TAG_ID_MAP[tag])
      .filter((id): id is number => Boolean(id))
  }

  private toDomain(dto: OdooTicketDTO): Ticket {
    return new Ticket(
      String(dto.id),
      dto.name,
      dto.description,
      this.mapStatus(dto.stage_id),
      this.mapPriority(dto.priority),
      new Date(dto.create_date),
      dto.write_date ? new Date(dto.write_date) : undefined,
      this.mapTags(dto.tag_ids)
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

  async findAll(): Promise<Ticket[]> {
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
        t.description,
        this.mapStatus(t.stage_id),
        this.mapPriority(t.priority),
        new Date(t.create_date),
        t.write_date ? new Date(t.write_date) : undefined,
        this.mapTags(t.tag_ids)
      ))
    } catch (error: any) {
      throw new Error(`Lỗi ${error.message}`)
    }

  }

  async create(data: CreateTicketInput): Promise<Ticket> {
    try {
      const uid = await this.authenticate()
  
      const id = await this.httpClient.callRPC<number>("call", {
        service: "object",
        method: "execute_kw",
        args: [
          this.db,
          uid,
          this.password,
          "helpdesk.ticket",
          "create",
          [{
            name: data.title,
            description: data.description,
            stage_id: this.mapStatusToStage(data.status),
            priority: this.mapPriorityToOdoo(data.priority),
            tag_ids: data?.tags?.length ? [[6, 0, this.mapTagsToOdoo(data.tags)]] : []
          }]
        ]
      })
  
      const [ticket] = await this.httpClient.callRPC<any[]>("call", {
        service: "object",
        method: "execute_kw",
        args: [
          this.db,
          uid,
          this.password,
          "helpdesk.ticket",
          "read",
          [[id]],
          { fields: ["id","name","description","priority","stage_id","create_date","write_date","tag_ids"] }
        ]
      })
      
      return this.toDomain(ticket)
    } catch (error: any) {
      throw new Error(`Lỗi ${error.message}`)
    }

  }

  async findById(id: string): Promise<Ticket | null> {
    try {
      const uid = await this.authenticate()
  
      const result = await this.httpClient.callRPC<any[]>("call", {
        service: "object",
        method: "execute_kw",
        args: [
          this.db,
          uid,
          this.password,
          "helpdesk.ticket",
          "read",
          [[Number(id)]],
          {
            fields: ["id","name","description","priority","stage_id","create_date","write_date","tag_ids"]
          }
        ]
      })
  
      if (!result.length) return null
      return this.toDomain(result[0])
    } catch (error: any) {
      throw new Error(`Lỗi ${error.message}`)
    }
  }

  async update(ticket: Ticket): Promise<Ticket> {
    try {
      const uid = await this.authenticate()
  
      const result = await this.httpClient.callRPC<boolean>("call", {
        service: "object",
        method: "execute_kw",
        args: [
          this.db,
          uid,
          this.password,
          "helpdesk.ticket",
          "write",
          [
            [Number(ticket.id)],
            {
              stage_id: this.mapStatusToStage(ticket.status),
            }
          ]
        ]
      })
      return ticket
    } catch (error: any) {
      throw new Error(`Lỗi ${error.message}`)
    }
  }

  async createTag(data: CreateTicketTag): Promise<void> {
    try {
      const uid = await this.authenticate()
  
      await this.httpClient.callRPC<number>("call", {
        service: "object",
        method: "execute_kw",
        args: [
          this.db,
          uid,
          this.password,
          "helpdesk.tag",
          "create",
          [{
            name: data.tag
          }]
        ]
      })
    } catch (error: any) {
      throw new Error(`Lỗi ${error.message}`)
    }
  }
}