import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePasswordResetTokenDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
