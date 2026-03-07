import type { TicketServicePort, CreateTicketInput, TicketFilters } from "@ports/TicketServicePort";
import type { TicketStatus, TicketPriority, TicketTag, Ticket } from "@entities/Ticket";
import { CreateTicketTag } from "@enums/OdooTicketDTO";
import { formatTimestamp } from "@utils/formatTime";

export class TicketCLIAdapter {
  constructor(private readonly ticketService: TicketServicePort) {}

  public async run(): Promise<void> {
    const [, , resource, action, ...args] = process.argv;

    if (resource !== 'ticket') {
      this.showHelp();
      return;
    }

    try {
      switch (action) {
        case 'list':
          await this.list(args);
          break;
        case 'create':
          await this.create(args);
          break;
        case 'show':
          await this.show(args);
          break;
        case 'new':
          await this.itemNew(args);
          break;
        case 'unprocessed':
          await this.itemUnprocessed(args);
          break;
        case 'update':
          await this.update(args);
          break;
        case 'createtags':
          await this.createTag(args);
          break;
        default:
          this.showHelp();
      }
    } catch (error: any) {
      console.error(`[ERROR]: ${error.message}`);
    }
  }

  private parseOptions(args: string[]): Record<string, string> {
    const options: Record<string, string> = {};
    for (let i = 0; i < args.length; i++) {
      const token = args[i]?.trim();
      if (!token) continue;
      if (token.startsWith('--')) {
        const key = token.slice(2);
        const value = args[i + 1];
        if (value !== undefined && !value.startsWith('--')) {
          options[key] = value;
          i++;
        } else {
          options[key] = '';
        }
      }
    }
    return options;
  }

  private optionsToFilters(opts: Record<string, string>) {
    const filters: any = {};
    if (opts.status) filters.status = opts.status;
    if (opts.priority) filters.priority = opts.priority;
    if (opts.tags) {
      filters.tags = opts.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }
    return filters;
  }

  private formatTicket(tickets: Ticket[]) {
    return tickets.map(t => {
      return {
        ID: t.id,
        Title: t.title,
        Description: t.description.replace(/<\/?[^>]+(>|$)/g, ""),
        Status: t.status,
        Priority: t.priority,
        Tags: t.tags ? t.tags.join(', ') : "-",
        CreatedAt: formatTimestamp(t.createdAt),
        UpdatedAt: t.updatedAt ? formatTimestamp(t.updatedAt) : "-",
      }
    })
  }

  private async list(args: string[]) {
    try {
      const opts = this.parseOptions(args);
      const filters = this.optionsToFilters(opts);
      const tickets = await this.ticketService.listTickets(filters);
      
      if (tickets.length > 0) {
        const formatTickets = this.formatTicket(tickets)
        console.log("--- DANH SÁCH TICKET ---");
        console.table(formatTickets);
      } else {
        console.log('No tickets found.');
      }
    } catch (err) {
      console.error('[CLI] List command failed:', err);
      throw err;
    }
  }

  private async create(args: string[]) {
    try {
      const opts = this.parseOptions(args);
      const input: CreateTicketInput = {
        title: opts.title ?? '',
        description: opts.description ?? '',
        status: opts.status as TicketStatus,
        priority: opts.priority as TicketPriority,
        tags: opts.tags
          ? opts.tags.split(' ').map((t) => t.trim()).filter(Boolean) as TicketTag[]
          : [],
      };
      
      const ticket = await this.ticketService.createTicket(input);
      console.log(`✅ Created ticket "${ticket.title}" success with ID ${ticket.id}`);
    } catch (error: any) {
      console.error('[CLI] Create command failed:', error.message || error);
      throw error;
    }
  }

  private async show(args: string[]) {
    const id = args[0];
    if (!id) {
      console.log('You must provide a ticket id to show.');
      return;
    }
    try {
      const ticket = await this.ticketService.getTicket(id);
      console.table([ticket]);
    } catch(error: any) {
      console.log(`${error.message}`);
    }
  }

  private async itemNew(args: string[]) {
    try {
      const now = new Date()
      const filter: TicketFilters = {
        currentDate: now
      }
      const tickets = await this.ticketService.listTickets(filter);
      if (tickets.length > 0) {
        const formatTickets = this.formatTicket(tickets)
        console.log("--- DANH SÁCH TICKET MỚI NHẤT ---");
        console.table(formatTickets);
      } else {
        console.log('No tickets found.');
      }
    } catch(error: any) {
      console.log(`${error.message}`);
    }
  }

  private async itemUnprocessed(args: string[]) {
    try {
      const filter: TicketFilters = {
        status: 'open'
      }
      const tickets = await this.ticketService.listTickets(filter);
      if (tickets.length > 0) {
        const formatTickets = this.formatTicket(tickets)
        console.log("--- DANH SÁCH TICKET CHƯA XỬ LÝ ---");
        console.table(formatTickets);
      } else {
        console.log('No tickets found.');
      }
    } catch(error: any) {
      console.log(`${error.message}`);
    }
  }

  private async update(args: string[]) {
    const id = args[0];
    const opts = this.parseOptions(args.slice(1));
    if (!id) {
      console.log('You must provide a ticket id to update.');
      return;
    }
    if (!opts.status) {
      console.log('You must provide --status to update.');
      return;
    }
    try {
      const updatedTicket = await this.ticketService.updateTicket(id, { status: opts.status as TicketStatus });
      console.log(`✅ Updated ticket "${updatedTicket.title}" status to ${updatedTicket.status}`);
    } catch (error: any) {
      console.log(`${error.message}`);
    }
  }

  private async createTag(args: string[]) {
    try {
      const opts = this.parseOptions(args);
      const input: CreateTicketTag = {
        tag: opts.tags as TicketTag
      };
      await this.ticketService.createTag(input);
      console.log(`✅ Create Ticket Tag successfully!!!`);
    } catch (error: any) {
      console.error('[CLI] Create ticket command failed:', error.message || error);
      throw error;
    }
  }

  private showHelp() {
    console.log(`
Usage: npx ts-node src/main.ts -- ticket <command> [options]

Commands:
  list                                  List all tickets
        --status <status>               Filter by status
        --priority <priority>           Filter by priority
        --tags <tag1,tag2>              Filter by tags (comma-separated)

  create                                Create a new ticket
        --title <text>                  Title (required)
        --description <text>            Description (required)
        --status <status>               Status (optional)
        --priority <priority>           Priority (optional)
        --tags <tag1,tag2>              Tags (optional, comma-separated)

  show <id>                             Show ticket details by id

  update <id>                           Update ticket status
        --status <status>               New status (required)

`);
  }
}
