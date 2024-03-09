import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import CreatedEmail from './emails/created';
import { renderAsync } from '@react-email/render';
import ForgetPasswordEmail from './emails/forget-password';
import { ConfigService } from '@nestjs/config';
import * as brevo from '@getbrevo/brevo';

const emailTemplates = {
  created: CreatedEmail,
  'forget-password': ForgetPasswordEmail,
};

@Injectable()
export class EmailService {
  private apiInstance: brevo.TransactionalEmailsApi;

  constructor(private readonly configService: ConfigService) {
    this.apiInstance = new brevo.TransactionalEmailsApi();

    this.apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      this.configService.get<string>('BREVO_API_KEY')!,
    );
  }

  async send(createEmailDto: CreateEmailDto) {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: 'Zapdiviser',
      email: this.configService.get<string>('EMAIL_FROM'),
    };
    sendSmtpEmail.to = [{ email: createEmailDto.to }];
    sendSmtpEmail.subject = createEmailDto.email_subject;
    const template = emailTemplates[createEmailDto.email_template](
      createEmailDto.params,
    );
    sendSmtpEmail.htmlContent = await renderAsync(template);
    sendSmtpEmail.textContent = await renderAsync(template, {
      plainText: true,
    });

    return await this.apiInstance.sendTransacEmail(sendSmtpEmail);
  }
}
