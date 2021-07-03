import { IsNotEmpty, IsString } from 'class-validator';

export class RegistrationConfirmDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
