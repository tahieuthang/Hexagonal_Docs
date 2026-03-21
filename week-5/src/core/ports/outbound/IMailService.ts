export type EmailTemplate = 'RESOLUTION_SUCCESS' | 'EMPLOYEE_NOT_FOUND' | 'EMPLOYEE_RESIGNED'

export interface IMailService {
  sendResolutionEmail(toEmail: string, template: EmailTemplate, data: { name: string, ticketId: string }): Promise<void>
}