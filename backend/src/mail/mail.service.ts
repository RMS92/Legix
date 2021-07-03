import { Injectable } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `http://localhost:3000/inscription/confirmation/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: '"Support Team" <support@legix.com>', // override default from
      subject: 'Welcome to Legix App! Confirm your Email',
      template: './confirmation',
      context: {
        // ✏️ filling curly brackets with content
        name: user.full_name,
        url,
      },
    });
  }
}
