import { IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(0, 50)
  full_name: string;
}
