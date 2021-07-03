import { IsMongoId, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateScanDto {
  @IsNotEmpty()
  @IsString()
  @Length(0, 150)
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
