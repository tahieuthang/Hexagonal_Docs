import { test, describe, beforeEach, mock } from 'node:test';
import * as assert from 'node:assert';
import { OdooTicketAdapter } from '@adapters/secondary/OdooTicketAdapter';
import { HttpClientAdapter } from '@adapters/primary/HttpClientAdapter';
import { Ticket } from "@entities/Ticket"
import type { OdooTicketDTO } from "@enums/OdooTicketDTO";

describe('OdooTicketAdapter Integration Tests (Mock Odoo API)', () => {
  let httpClient: HttpClientAdapter;
  let adapter: OdooTicketAdapter;

  const mockOdooDTO = {
      id: 101,
      name: "Printer Error",
      description: "<p>Cannot print</p>",
      stage_id: [1, "New"],
      priority: "2",
      tag_ids: [6, 7],
      create_date: "2024-03-07 10:00:00",
      write_date: "2024-03-07 11:00:00"
  };

  beforeEach(() => {
      httpClient = new HttpClientAdapter("http://mock-odoo.local");
      adapter = new OdooTicketAdapter(httpClient, "test_db", "admin", "password");

      mock.restoreAll();
  });
  test('findAll: fetch all tickets and map correctly to Domain', async () => {
    const callRPCMock = mock.method(httpClient, 'callRPC');
    
    callRPCMock.mock.mockImplementation((async (method: string, params: any): Promise<any> => {
      if (params.service === "common" && params.method === "authenticate") {
          return 1; 
      }

      if (params.method === "execute_kw" && params.args.includes("search_read")) {
          return [mockOdooDTO];
      }

      return null;
    }) as any);

    const tickets = await adapter.findAll();

    assert.strictEqual(tickets.length, 1);
    assert.ok(tickets[0] instanceof Ticket);
    assert.strictEqual(tickets[0].id, "101");
  });

  test('findById: fetch a single ticket by numeric ID', async () => {
    const callRPCMock = mock.method(httpClient, 'callRPC')
    callRPCMock.mock.mockImplementation((async (method: string, params: any): Promise<any> => {
      if (params.service === "common" && params.method === "authenticate") {
        return 1; 
      }
      if (params.method === "execute_kw" && params.args.includes("read")) {
        return [mockOdooDTO];
      }

      return null;
    }) as any)

    const result = await adapter.findById("101")

    assert.ok(result)
    assert.strictEqual(result?.id, "101")
    assert.strictEqual(result?.title, "Printer Error")

    const lastCall = callRPCMock.mock.calls[1];
    const idPassedToOdoo = lastCall?.arguments[1]?.args[5][0];
    assert.strictEqual(typeof idPassedToOdoo[0], 'number');
  });

  test('toDomain: should correctly parse Odoo date strings to JS Date objects', async () => {
    const callRPCMock = mock.method(httpClient, 'callRPC');
    callRPCMock.mock.mockImplementation((async (method: string, params: any): Promise<any> => {
        if (params.service === "common") return 1;
        if (params.method === "execute_kw" && params.args.includes("search_read")) {
          return [mockOdooDTO];
      }
        return [];
    }) as any);

    const tickets = await adapter.findAll();
    
    const firstTicket = tickets[0];
    assert.ok(firstTicket, "Phải có ít nhất 1 ticket trả về");
    assert.ok(firstTicket.createdAt instanceof Date, "createdAt phải là một instance của Date");
    assert.strictEqual(firstTicket.createdAt.getFullYear(), 2024);
  });

  test('should throw error when authenticate fails', async () => {
    const callRPCMock = mock.method(httpClient, 'callRPC');
    callRPCMock.mock.mockImplementation((async () => false) as any);

    await assert.rejects(async () => {
        await adapter.findAll();
    }, (err: Error) => {
        return err instanceof Error;
    });
  });
})

