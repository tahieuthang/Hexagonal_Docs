import type { TicketServicePort } from "@ports/inbound/TicketServicePort";

export class TicketCLIAdapter {
    constructor(private readonly ticketService: TicketServicePort) {}
  
    public async run(): Promise<void> {
      const args = process.argv.slice(2); 
      const command = args.join(' ');
  
      if (command.startsWith('ticket automate --scenario login-issue')) {
        await this.handleAutomate();
      } else {
        console.log('Lệnh không hợp lệ. Ví dụ: ticket automate --scenario login-issue');
      }
    }
  
    private async handleAutomate() {
      try {
        console.log('🚀 Đang bắt đầu quét và xử lý ticket...');
        await this.ticketService.execute();
        console.log('✅ Đã thực hiện xử lý tự động các ticket thuộc LOGIN ISSUES');
      } catch (err) {
        console.error('[CLI] Automation failed:', err);
      }
    }
  }
