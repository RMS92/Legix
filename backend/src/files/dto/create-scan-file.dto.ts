import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateScanFileDto {
  @IsNotEmpty()
  @IsString()
  @Length(0, 150)
  original_filename: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 150)
  current_filename: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 150)
  extension: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;
}
