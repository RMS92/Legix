import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ScansService } from './scans.service';
import { CreateScanDto } from './dto/create-scan.dto';
import { UpdateScanDto } from './dto/update-scan.dto';
import { Scan } from './schemas/scan.schema';
import { AuthenticatedGuard } from '../auth/guards/authenticated-auth.guard';
import { Action } from '../security/enums/action.enum';
import { UsersPoliciesGuard } from '../security/guards/users-policies.guard';
import { CheckUsersPolicies } from '../security/decorators/check-users-policies.decorator';
import { UserAbility } from '../security/functions/user-ability.function';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  customStorage,
  imageFileFilter,
  renameFilename,
} from '../files/utils/file-upload.util';
import { User } from '../users/schemas/user.schema';
import { ConfirmScanDto } from './dto/confirm-scan.dto';

@Controller('scans')
export class ScansController {
  constructor(private readonly scansService: ScansService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 12, {
      storage: diskStorage({
        destination: customStorage,
        filename: renameFilename,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @UseGuards(AuthenticatedGuard)
  async create(
    @Req() req,
    @Body() createScanDto: CreateScanDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Scan> {
    const userId = req.user._id;
    return this.scansService.create(createScanDto, userId, files);
  }

  @Get()
  @CheckUsersPolicies((ability: UserAbility) => ability.can(Action.Read, 'all'))
  @UseGuards(AuthenticatedGuard, UsersPoliciesGuard)
  findAll(): Promise<Scan[]> {
    return this.scansService.findAll();
  }

  @Get('users/:id')
  @CheckUsersPolicies((ability: UserAbility) => ability.can(Action.Read, User))
  @UseGuards(AuthenticatedGuard, UsersPoliciesGuard)
  findAllByUser(@Param('id') id: string): Promise<Scan[]> {
    return this.scansService.findAllByUser(id);
  }

  @Get('latest')
  findLatest(): Promise<Scan[]> {
    return this.scansService.findLatest();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Scan> {
    return this.scansService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('files', 12, {
      storage: diskStorage({
        destination: customStorage,
        filename: renameFilename,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @CheckUsersPolicies((ability: UserAbility) =>
    ability.can(Action.Update, 'all'),
  )
  @UseGuards(AuthenticatedGuard, UsersPoliciesGuard)
  update(
    @Param('id') id: string,
    @Body() updateScanDto: UpdateScanDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Scan> {
    return this.scansService.update(id, updateScanDto, files);
  }

  @Patch(':id/confirm')
  @CheckUsersPolicies((ability: UserAbility) =>
    ability.can(Action.Update, 'all'),
  )
  @UseGuards(AuthenticatedGuard, UsersPoliciesGuard)
  confirm(
    @Param('id') id: string,
    @Body() confirmScanDto: ConfirmScanDto,
  ): Promise<Scan> {
    return this.scansService.confirm(id, confirmScanDto);
  }

  @Delete(':id')
  @CheckUsersPolicies((ability: UserAbility) =>
    ability.can(Action.Delete, 'all'),
  )
  @UseGuards(AuthenticatedGuard, UsersPoliciesGuard)
  remove(@Param('id') id: string): Promise<Scan> {
    return this.scansService.remove(id);
  }
}
