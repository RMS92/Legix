import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PasswordResetToken,
  PasswordResetTokenSchema,
} from './schemas/password-reset-token.schema';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MailModule,
    MongooseModule.forFeature([
      { name: 'PasswordResetToken', schema: PasswordResetTokenSchema },
    ]),
  ],
  controllers: [PasswordController],
  providers: [PasswordService],
})
export class PasswordModule {}
