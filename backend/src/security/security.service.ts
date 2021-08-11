import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import { RegistrationConfirmDto } from './dto/registration-confirm.dto';
import { TokenExpiredException } from './exceptions/token-expired.exception';
import { EmailAlreadyUsedException } from './exceptions/email-already-used.exception';
import { UsernameAlreadyUsedException } from './exceptions/username-already-used.exception';
import { PasswordsDoNotMatchException } from './exceptions/passwords-do-not-match.exception';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class SecurityService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    return this.authService.generateJwt(user);
  }

  async register(createUserDTO: CreateUserDto): Promise<Object> {
    const emailExists = await this.usersService.mailExists(createUserDTO.email);
    if (!emailExists) {
      const usernameExists = await this.usersService.usernameExists(
        createUserDTO.username,
      );
      if (!usernameExists) {
        if (createUserDTO.password2 === createUserDTO.password) {
          createUserDTO.password = await this.authService.hashPassword(
            createUserDTO.password,
          );
          // Send confirmation email
          const token = await this.authService.generateToken(75);
          createUserDTO.confirmation_token = token;

          const newUser = await this.usersService.create(createUserDTO);

          await this.mailService.sendUserConfirmation(newUser, token);
          //
          return {
            status: HttpStatus.OK,
            message: 'Un email de confirmation vous a été envoyé.',
            success: true,
          };
        } else {
          throw new PasswordsDoNotMatchException();
        }
      } else {
        throw new UsernameAlreadyUsedException();
      }
    } else {
      throw new EmailAlreadyUsedException();
    }
  }

  async registrationConfirm(
    registrationConfirmDto: RegistrationConfirmDto,
  ): Promise<Object> {
    const user = await this.usersService.findOne(registrationConfirmDto.id);
    // Calculate hour differences between user created_at and now
    const isExpired = this.mailService.isTokenExpired(
      user.created_at,
      Date.now(),
      2,
    );
    if (user.confirmation_token === registrationConfirmDto.token && isExpired) {
      await this.usersService.updateField(user._id, {
        confirmation_token: '',
      });
      return {
        status: HttpStatus.OK,
        message: 'Votre compte a bien été validé',
        success: true,
      };
    } else {
      throw new TokenExpiredException();
    }
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<Object> {
    if (updatePasswordDto.password === updatePasswordDto.password2) {
      const hashPassword = await this.authService.hashPassword(
        updatePasswordDto.password,
      );
      await this.usersService.updateField(id, {
        password: hashPassword,
      });
      return {
        status: HttpStatus.OK,
        message: 'Votre mot de passe a bien été modifié.',
        success: true,
      };
    } else {
      throw new PasswordsDoNotMatchException();
    }
  }
}
