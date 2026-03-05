import type { TicketServicePort, CreateTicketInput } from "../../core/ports/TicketServicePort";
import type { TicketStatus, TicketPriority, TicketTag } from "../../core/entites/Ticket";

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
        case 'update':
          await this.update(args);
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

  private async list(args: string[]) {
    const opts = this.parseOptions(args);
    
    const filters = this.optionsToFilters(opts);
    const tickets = await this.ticketService.listTickets(filters);
    if (tickets.length > 0) {
      console.table(tickets);
    } else {
      console.log('No tickets found.');
    }
  }

  private async create(args: string[]) {
    const opts = this.parseOptions(args);
    const input: CreateTicketInput = {
      id: Math.random().toString(36).substr(2, 9),
      title: opts.title ?? '',
      description: opts.description ?? '',
      status: opts.status as TicketStatus,
      priority: opts.priority as TicketPriority,
      tags: opts.tags
        ? opts.tags.split(',').map((t) => t.trim()).filter(Boolean) as TicketTag[]
        : [],
    };
    try {
      const ticket = await this.ticketService.createTicket(input);
      console.log(`✅ Created ticket "${ticket.title}" success with ID ${ticket.id}`);
    } catch (error: any) {
      console.log(`${error.message}`);
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

  private async update(args: string[]) {
    const opts = this.parseOptions(args);
    try {
      const ticket = await this.ticketService.updateTicket(args[0] as string, {
        status: opts.status as TicketStatus
      });
      console.log(`✅ Update ticket "${ticket.title}" success with ID ${ticket.id}`);
    } catch (error: any) {
      console.log(`${error.message}`);
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

`);
  }
}
