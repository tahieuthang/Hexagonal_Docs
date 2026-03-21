import type { IHRService } from "@ports/outbound/IHRService"
import { Employee } from "@entities/Employee";
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export class HRAdapter implements IHRService {
    private readonly filePath = path.resolve(process.cwd(), 'data', 'employee.json');

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
  
    public async checkEmployeeStatus(name: string): Promise<Employee | null> {
      const employees = await this.readRaw()
      const checkEmployee = employees.find((e: Employee) =>
        e.name.trim().toLowerCase() === name.trim().toLowerCase()
      )
      return checkEmployee ? Employee.fromRaw(checkEmployee) : null
    }
}