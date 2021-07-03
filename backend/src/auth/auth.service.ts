import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schemas/user.schema';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    const validated = await this.comparePasswords(password, user.password);
    if (validated) {
      return user;
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Adresse email ou mot de passe incorrect',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async generateJwt(user: any): Promise<string> {
    const payload = {
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        roles: user.roles,
      },
    };
    return await this.jwtService.signAsync(payload);
  }

  async hasPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async comparePasswords(
    password: string,
    storedHashPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, storedHashPassword);
  }

  async generateToken (): Promise<string> {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
