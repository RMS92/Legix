import { IsNumber, IsString, Length } from 'class-validator';

export class UpdateScanFileDto {
  @IsString()
  @Length(0, 50)
  category: string;

  status: number;

  @IsString()
  @Length(0, 50)
  orientation: string;
}
