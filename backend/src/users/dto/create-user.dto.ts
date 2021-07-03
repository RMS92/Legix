import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { Role } from '../../security/enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Length(0, 50)
  email: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  @Length(0, 50)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(0, 50)
  full_name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  password2: string;

  roles?: Role[];

  confirmation_token: string;
}
