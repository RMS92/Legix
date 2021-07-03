import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import { RegistrationConfirmDto } from './dto/registration-confirm.dto';

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

  async register(createUserDTO: CreateUserDto) {
    const emailExists = await this.usersService.mailExists(createUserDTO.email);
    if (!emailExists) {
      const usernameExists = await this.usersService.usernameExists(
        createUserDTO.username,
      );
      if (!usernameExists) {
        if (createUserDTO.password2 === createUserDTO.password) {
          createUserDTO.password = await this.authService.hasPassword(
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
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              message: 'Les mots de passe ne correspondent pas.',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: "Le nom d'utilisateur est déjà utilisé.",
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: "L'email est déjà utilisé.",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async registrationConfirm(registrationConfirmDto: RegistrationConfirmDto) {
    const user = await this.usersService.findOne(registrationConfirmDto.id);
    // Calculate hour differences between user created_at and now
    const expires = this.mailService.isTokenExpired(
      user.created_at,
      Date.now(),
    );
    console.log(expires);
    if (user.confirmation_token === registrationConfirmDto.token && expires) {
      await this.usersService.updateField(user._id, {
        confirmation_token: '',
      });
      return {
        status: HttpStatus.OK,
        message: 'Votre compte a bien été validé',
        success: true,
      };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: "Le token n'est pas valide",
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
