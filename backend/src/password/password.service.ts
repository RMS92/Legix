import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PasswordResetToken,
  PasswordResetTokenDocument,
} from './schemas/password-reset-token.schema';
import { AuthService } from '../auth/auth.service';
import { CreatePasswordResetTokenDto } from './dto/create-password-reset-token.dto';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PasswordService {
  constructor(
    @InjectModel('PasswordResetToken')
    private readonly passwordResetTokenModel: Model<PasswordResetTokenDocument>,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  async reset(createPasswordResetTokenDto: CreatePasswordResetTokenDto) {
    const user = await this.usersService.findByEmail(
      createPasswordResetTokenDto.email,
    );
    if (user) {
      const token = await this.authService.generateToken(75);
      const data = {
        created_at: Date.now(),
        token,
        user: user._id,
      };
      const newPasswordResetToken = new this.passwordResetTokenModel(data);
      await newPasswordResetToken.save();
      await this.mailService.sendUserResetPassword(user, token);
      return {
        status: HttpStatus.OK,
        message:
          'Les instructions pour réinitialiser votre mot de passe vous ont été envoyées.',
        success: true,
      };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Aucun compte ne correspond à cet email.',
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async resetConfirm() {}
}
