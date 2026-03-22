export type EmailTemplate = 'RESOLUTION_SUCCESS' | 'ACCOUNT_RECREATED' | 'EMPLOYEE_NOT_FOUND' | 'EMPLOYEE_RESIGNED'

export interface IMailService {
  sendResolutionEmail(toEmail: string, template: EmailTemplate, data: { customer: string, ticketId: string, ticketTitle: string }): Promise<void>
}