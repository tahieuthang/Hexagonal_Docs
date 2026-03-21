import type { Employee } from "@enums/EmployeeDTO";

export interface IHRService {
  checkEmployeeStatus(name: string): Promise<Employee | null>
}