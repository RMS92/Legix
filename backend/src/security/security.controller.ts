import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SecurityService } from './security.service';
import { User } from '../users/schemas/user.schema';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { AuthenticatedGuard } from '../auth/guards/authenticated-auth.guard';
import { RegistrationConfirmDto } from './dto/registration-confirm.dto';

@Controller()
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  async passportLogin(@Req() req): Promise<User> {
    return req.user;
  }

  @Post('jwt-login')
  @HttpCode(200)
  async jwtLogin(@Body() loginUserDto: LoginUserDto): Promise<Object> {
    const jwt = await this.securityService.login(loginUserDto);
    return {
      access_token: jwt,
    };
  }

  @Post('register')
  @HttpCode(201)
  register(@Body() createUserDTO: CreateUserDto) {
    return this.securityService.register(createUserDTO);
  }

  @Post('register/confirm')
  registrationConfirm(@Body() registrationConfirmDto: RegistrationConfirmDto) {
    return this.securityService.registrationConfirm(registrationConfirmDto);
  }

  @Get('me')
  @UseGuards(AuthenticatedGuard)
  me(@Req() req) {
    return req.user;
  }

  @Get('logout')
  logout(@Req() req) {
    req.logout();
    return false;
  }
}
