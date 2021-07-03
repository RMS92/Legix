import { forwardRef, Module } from '@nestjs/common';
import { ScansService } from './scans.service';
import { ScansController } from './scans.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ScanSchema } from './schemas/scan.schema';
import { UsersModule } from '../users/users.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    FilesModule,
    MongooseModule.forFeature([{ name: 'Scan', schema: ScanSchema }]),
  ],
  controllers: [ScansController],
  providers: [ScansService],
  exports: [ScansService],
})
export class ScansModule {}
