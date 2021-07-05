import { Controller, Post, Body } from '@nestjs/common';
import { PasswordService } from './password.service';
import { CreatePasswordResetTokenDto } from './dto/create-password-reset-token.dto';
import { ResetPasswordConfirmDto } from './dto/reset-password-confirm.dto';

@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post('reset')
  reset(@Body() createPasswordResetTokenDto: CreatePasswordResetTokenDto) {
    return this.passwordService.reset(createPasswordResetTokenDto);
  }

  @Post('reset/confirm')
  resetConfirm(@Body() resetPasswordConfirmDto: ResetPasswordConfirmDto) {
    return this.passwordService.resetConfirm(resetPasswordConfirmDto);
  }
}
