import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ScanFileSchema } from './schemas/scan-file.schema';
import { ConfigModule } from '@nestjs/config';
import { AvatarFile, AvatarFileSchema } from './schemas/avatar-file.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: 'ScanFile', schema: ScanFileSchema },
      { name: 'AvatarFile', schema: AvatarFileSchema },
    ]),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
