import { Ticket } from "@entities/Ticket"
interface Employee {
    id: string
    name: string
    email: string
    department: string
    status: 'active' | 'resigned' | 'on_leave'
}

export interface IMailService {
  sendResolutionEmail(employee: Employee, ticket: Ticket): Promise<void>
}