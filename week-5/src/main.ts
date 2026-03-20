import { OdooAdapter } from "@adapters/secondary/OdooAdapter";
import { HttpClientAdapter } from "@adapters/primary/HttpClientAdapter";
import { TicketService } from "@services/TicketService";
import { TicketCLIAdapter } from "@adapters/primary/TicketCLIAdapter";
import { env } from "node:process"; 
import "dotenv/config"

async function main() {
  const baseURL = process.env.ODOO_BASE_URL || "http://localhost:8069"
  const db = process.env.ODOO_DB || "mydb"
  const username = process.env.ODOO_USERNAME || "admin"
  const password = process.env.ODOO_PASSWORD || "admin"

  const httpClient = new HttpClientAdapter(baseURL)

  const ticketRepository = new OdooTicketAdapter(
    httpClient,
    db,
    username,
    password
  )

  const ticketService = new TicketService(ticketRepository)

  const cli = new TicketCLIAdapter(ticketService)
  try {
    await cli.run();
  } catch (err) {
    console.error("❌ Ticket CLI encountered an error:", err);
    process.exit(1);
  }
}

main();