import { Injectable } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `http://localhost:3000/inscription/confirmation/${user._id}?token=${token}`;

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

  // https://bearnithi.com/2019/11/10/how-to-calculate-the-time-difference-days-hours-minutes-between-two-dates-in-javascript/
  isTokenExpired(createdAt: Date, now): boolean {
    let diffInMilliSeconds = Math.abs(createdAt.getTime() - now) / 1000;
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    console.log(hours);
    return hours <= 2;
  }
}
