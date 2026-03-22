import "dotenv/config"
import { OdooAdapter } from "@adapters/secondary/OdooAdapter";
import { HttpClientAdapter } from "@adapters/primary/HttpClientAdapter";
import { HRAdapter } from "@adapters/secondary/HRAdapter";
import { NodemailerAdapter } from "@adapters/secondary/NodemailerAdapter";
import { TicketService } from "@services/TicketService";
import { TicketCLIAdapter } from "@adapters/primary/TicketCLIAdapter";

async function main() {
  // 1. Cấu hình Odoo
  const baseURL = process.env.ODOO_URL || "http://localhost:8069"
  const db = process.env.ODOO_DB || "mydb"
  const username = process.env.ODOO_USER || "admin"
  const password = process.env.ODOO_PASS || "admin"

  const httpClient = new HttpClientAdapter(baseURL)

  const ticketRepository = new OdooAdapter(
    httpClient,
    db,
    username,
    password
  )

  const hrService = new HRAdapter()
  const mailService = new NodemailerAdapter()

  const ticketService = new TicketService(
    ticketRepository, 
    hrService, 
    mailService
  );

  const cli = new TicketCLIAdapter(ticketService);

  try {
    console.log("🚀 Starting Automation Bot...");
    await cli.run();
    console.log("✅ Automation task finished.");
  } catch (err) {
    console.error("❌ Ticket CLI encountered an error:", err);
    process.exit(1);
  }
}

main();