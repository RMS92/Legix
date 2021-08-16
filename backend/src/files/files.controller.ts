import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { FilesService } from './files.service';
import { UpdateScanFileDto } from './dto/update-scan-file.dto';
import { AvatarFile } from './schemas/avatar-file.schema';

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

  @Get(':id/avatarFile')
  findOneAvatarFile(@Param('id') id: string): Promise<AvatarFile> {
    return this.filesService.findOneAvatarFile(id);
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
