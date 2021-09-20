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
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated-auth.guard';
import { Comment } from './schemas/comment.schema';
import { CheckUsersPolicies } from '../security/decorators/check-users-policies.decorator';
import { UsersPoliciesGuard } from '../security/guards/users-policies.guard';
import { UserAbility } from '../security/functions/user-ability.function';
import { Action } from '../security/enums/action.enum';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  create(
    @Req() req,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const userId = req.user._id;
    return this.commentsService.create(createCommentDto, userId);
  }

  @Get()
  findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Get('scans/:id')
  findAllByScan(@Param('id') id: string): Promise<Comment[]> {
    return this.commentsService.findAllByScan(id);
  }

  @Get('users/:id')
  findAllByUser(@Param('id') id: string): Promise<Comment[]> {
    return this.commentsService.findAllByUser(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @CheckUsersPolicies((ability: UserAbility) =>
    ability.can(Action.Delete, Comment),
  )
  @UseGuards(AuthenticatedGuard, UsersPoliciesGuard)
  remove(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.remove(id);
  }
}
