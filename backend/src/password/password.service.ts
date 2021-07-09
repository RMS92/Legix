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
import { ResetPasswordConfirmDto } from './dto/reset-password-confirm.dto';
import {AccountNotFoundException} from "./exceptions/account-not-found.exception";
import {PasswordsDoNotMatchException} from "../security/exceptions/passwords-do-not-match.exception";
import {TokenExpiredException} from "../security/exceptions/token-expired.exception";
import {UserNotFoundException} from "../security/exceptions/user-not-found.exception";

@Injectable()
export class PasswordService {
  constructor(
    @InjectModel('PasswordResetToken')
    private readonly passwordResetTokenModel: Model<PasswordResetTokenDocument>,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  async reset(createPasswordResetTokenDto: CreatePasswordResetTokenDto): Promise<Object> {
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
      throw new AccountNotFoundException()
    }
  }

  async resetConfirm(resetPasswordConfirmDto: ResetPasswordConfirmDto): Promise<Object> {
    const user = await this.usersService.findOne(resetPasswordConfirmDto.id);
    // Find user
    if (user) {
      const passwordResetToken = await this.passwordResetTokenModel.findOne({
        token: resetPasswordConfirmDto.token,
      });
      const isExpired = this.mailService.isTokenExpired(
        passwordResetToken.created_at,
        Date.now(),
        1,
      );
      // Find token reset model && check if it is not expired ( < 2 hours)
      if (passwordResetToken && isExpired) {
        // Passwords match
        if (
          resetPasswordConfirmDto.password === resetPasswordConfirmDto.password2
        ) {
          // Hash new password
          const hashPassword = await this.authService.hashPassword(
            resetPasswordConfirmDto.password,
          );
          // Update user
          await this.usersService.updateField(user._id, {
            password: hashPassword,
          });

          // Delete token reset model
          await this.passwordResetTokenModel.findByIdAndRemove({
            _id: passwordResetToken._id,
          });
          return {
            status: HttpStatus.OK,
            message: 'Votre mot de passe a bien été modifié.',
            success: true,
          };
        } else {
          throw new PasswordsDoNotMatchException()
        }
      } else {
        // Delete token reset model
        await this.passwordResetTokenModel.findByIdAndRemove({
          _id: passwordResetToken._id,
        });
        throw new TokenExpiredException()
      }
    } else {
      throw new UserNotFoundException()
    }
  }
}
