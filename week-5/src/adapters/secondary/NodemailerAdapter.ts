import type { IMailService, EmailTemplate } from "@ports/outbound/IMailService"
import nodemailer from 'nodemailer';

export class NodemailerAdapter implements IMailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
  }

  public async sendResolutionEmail(toEmail: string, template: EmailTemplate, data: { customer: string, ticketId: string, ticketTitle: string }): Promise<void> {
    const subject = `[Support #${data.ticketId}] ${data.ticketTitle}`
    let htmlContent = ""

    switch (template) {
      case 'RESOLUTION_SUCCESS':
        htmlContent = `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <p>Chào anh/chị <b>${data.customer}</b>,</p>
            <p>Yêu cầu <b>#${data.ticketId}</b> về việc <b>${data.ticketTitle}</b> đã được xử lý thành công.</p>
            <p>Mật khẩu của anh/chị đã được khôi phục về mặc định là <b>MindX@2026</b>. Bước tiếp theo, Anh/chị vui lòng đăng nhập và <b>thay đổi mật khẩu ngay lập tức</b></p>
            <p>Nếu vẫn không thể truy cập, anh/chị vui lòng phản hồi trực tiếp email này.</p>
            <p>Trân trọng,<br><b>MindX IT Automation Team.</b></p>
          </div>
        `;
        break;

      case 'ACCOUNT_RECREATED':
        htmlContent = `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <p>Chào anh/chị <b>${data.customer}</b>,</p>
            <p>Tài khoản liên quan đến yêu cầu <b>#${data.ticketId}</b> đã được cấp lại/kích hoạt thành công.</p>
            <p>Tài khoản của anh/chị hiện đã có thể truy cập lại hệ thống. <b>Lưu ý:</b> Vui lòng sử dụng email công ty để đăng nhập.</p>
            <p>Nếu vẫn không thể truy cập, anh/chị vui lòng phản hồi trực tiếp email này.</p>
            <p>Trân trọng,<br><b>MindX IT Automation Team.</b></p>
          </div>`;
        break;

      case 'EMPLOYEE_RESIGNED':
        htmlContent = `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <p>Chào anh/chị <b>${data.customer}</b>,</p>
            <p>Hệ thống Support Bot đã tiếp nhận yêu cầu <b>#${data.ticketId}</b> về việc <b>${data.ticketTitle}</b>.</p>
            
            <p>Tuy nhiên, Bot không thể xử lý tự động do ghi nhận tài khoản của anh/chị đang ở trạng thái <b>"Nghỉ việc"</b> trên hệ thống nhân sự.</p>
            
            <p>Yêu cầu này đã được chuyển đến bộ phận kỹ thuật để kiểm tra lại thông tin thủ công. Chúng tôi sẽ phản hồi lại anh/chị trong vòng 1 giờ tới.</p>
            
            <p>Trân trọng,<br>
            <b>MindX IT Automation Team</b></p>
          </div>
        `;
        break;

      case 'EMPLOYEE_NOT_FOUND':
        htmlContent = `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <p>Chào anh/chị <b>${data.customer}</b>,</p>
            <p>Bot không thể xử lý tự động yêu cầu <b>#${data.ticketId}</b> do <b>không tìm thấy thông tin nhân viên</b> khớp với dữ liệu mô tả.</p>
            
            <div style="padding: 10px; border: 1px solid #ddd;">
              <b>Lưu ý:</b> Anh/chị vui lòng kiểm tra lại <b>Mã nhân viên</b> hoặc <b>Email</b> đã cung cấp trong ticket có chính xác hay không.
            </div>

            <p>Yêu cầu này đã được chuyển cho kỹ thuật viên kiểm tra thủ công. Chúng tôi sẽ phản hồi lại anh/chị trong vòng 1 giờ tới.</p>
            <p>Trân trọng,<br>MindX IT Automation Team.</p>
          </div>
        `;
        break;
      default:
        return;
    }

    await this.transporter.sendMail({
      from: `"IT Support Bot" <${process.env.MAIL_USER}>`,
      to: toEmail,
      subject: subject,
      html: htmlContent
    });
  }
}