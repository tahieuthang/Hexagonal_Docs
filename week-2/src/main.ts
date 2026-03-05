import { JsonFileTicketAdapter } from "./adapters/secondary/JsonFileTicketAdapter";
import { TicketService } from "./core/services/TicketService";
import { TicketCLIAdapter } from "./adapters/primary/TicketCLIAdapter";

async function main() {
  const ticketRepository = new JsonFileTicketAdapter();
  const ticketService = new TicketService(ticketRepository);

  const cli = new TicketCLIAdapter(ticketService);
  try {
    await cli.run();
  } catch (err) {
    console.error("❌ Ticket CLI encountered an error:", err);
    process.exit(1);
  }
}

main();