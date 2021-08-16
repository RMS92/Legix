import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRolesUserDto } from './dto/updateRoles-user.dto';
import { Action } from '../security/enums/action.enum';
import { User } from './schemas/user.schema';
import { UsersPoliciesGuard } from '../security/guards/users-policies.guard';
import { CheckUsersPolicies } from '../security/decorators/check-users-policies.decorator';
import { UserAbility } from '../security/functions/user-ability.function';
import { AuthenticatedGuard } from '../auth/guards/authenticated-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  customAvatarFileStorage,
  imageFileFilter,
  renameFilename,
} from '../files/utils/file-upload.util';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @CheckUsersPolicies((ability: UserAbility) => ability.can(Action.Read, 'all'))
  @UseGuards(AuthenticatedGuard, UsersPoliciesGuard)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @CheckUsersPolicies((ability: UserAbility) => ability.can(Action.Read, User))
  @UseGuards(AuthenticatedGuard, UsersPoliciesGuard)
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @CheckUsersPolicies((ability: UserAbility) =>
    ability.can(Action.Update, User),
  )
  @UseGuards(AuthenticatedGuard, UsersPoliciesGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/roles')
  @CheckUsersPolicies((ability: UserAbility) =>
    ability.can(Action.Update, 'all'),
  )
  @UseGuards(AuthenticatedGuard, UsersPoliciesGuard)
  updateRoles(
    @Param('id') id: string,
    @Body() updateRolesUserDto: UpdateRolesUserDto,
  ): Promise<User> {
    return this.usersService.updateRoles(id, updateRolesUserDto);
  }

  @Patch(':id/avatarFile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: customAvatarFileStorage,
        filename: renameFilename,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @CheckUsersPolicies((ability: UserAbility) =>
    ability.can(Action.Update, User),
  )
  @UseGuards(AuthenticatedGuard, UsersPoliciesGuard)
  updateAvatarFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    return this.usersService.updateAvatarFile(id, file);
  }

  @Delete(':id')
  @CheckUsersPolicies((ability: UserAbility) =>
    ability.can(Action.Delete, User),
  )
  @UseGuards(AuthenticatedGuard, UsersPoliciesGuard)
  remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }
}
