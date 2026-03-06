import type { TicketRepositoryPort } from "@ports/TicketRepositoryPort"
import { Ticket, TicketStatus } from "@entities/Ticket"
import { TicketFilters } from "@ports/TicketServicePort";
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { error } from "node:console";
import { TicketNotFoundError } from "@errors/TicketNotFoundError";

export class JsonFileTicketAdapter implements TicketRepositoryPort {
  private readonly filePath = path.resolve(process.cwd(), 'data', 'tickets.json');

  private async readRaw(): Promise<any[]> {
    try {
      const rawData = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(rawData || '[]');
    } catch(error: any) {
      if(error.code === 'ENOENT') {
        return [] 
      }
      throw new Error(`Read file error ${error.message}`)
    }
  }

  async create(ticket: Ticket): Promise<Ticket> {
    const tickets = await this.readRaw()
    if (tickets.some(t => t.id === ticket.id)) {
      throw new Error(`Ticket ID ${ticket.id} đã tồn tại!`);
    }
    tickets.push({ ...ticket })
    try{
      await fs.writeFile(this.filePath, JSON.stringify(tickets, null, 2), 'utf-8')
      return ticket
    } catch(error: any) {
      throw new Error(`Create file error ${error.message}`)
    }
  }

  async findById(id: string): Promise<Ticket | null> {
    const tickets = await this.readRaw()
    const searchTicket = tickets.find((t: Ticket) => t.id === id)
    return searchTicket ? Ticket.formRaw(searchTicket) : null
  }

  async findAll(): Promise<Ticket[] | []> {
    let tickets = await this.readRaw()
    return tickets.map((ticket) => Ticket.formRaw(ticket))
  }

  async update(ticket: Ticket): Promise<Ticket> {
    let tickets = await this.readRaw()
    let index = tickets.findIndex(t => t.id === ticket.id)
    if (index === -1) {
      throw new Error(`Storage không đồng bộ: Không tìm thấy ID ${ticket.id} để cập nhật.`)
    }
    tickets[index] = { ...ticket }
    try {
      await fs.writeFile(this.filePath, JSON.stringify(tickets, null, 2), 'utf-8')
      return ticket
    } catch(error: any) {
      throw new Error(`Update file error ${error.message}`)
    }
  }
}