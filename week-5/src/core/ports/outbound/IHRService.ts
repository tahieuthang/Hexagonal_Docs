import type { Employee } from "@entities/Employee";

export interface IHRService {
  checkEmployeeStatus(name: string): Promise<Employee | null>
}