import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { UpdateScanFileDto } from './dto/update-scan-file.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter, renameFilename } from './utils/file-upload.util';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get('scans')
  findAllByScan() {
    return this.filesService.findAllByScan();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScanFileDto: UpdateScanFileDto,
  ) {
    return this.filesService.update(id, updateScanFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
