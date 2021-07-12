import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../users/schemas/user.schema';

export class CreateNotificationDto {
  _id: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  channel: string;

  target: object;

  created_at: Date;

  read_at: Date;

  user: string;
}
