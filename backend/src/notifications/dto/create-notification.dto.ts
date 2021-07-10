import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../users/schemas/user.schema';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  channel: string;

  target: object;

  created_at: Date;

  user: User;
}
