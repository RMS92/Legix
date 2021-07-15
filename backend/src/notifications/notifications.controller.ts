import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Sse,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { interval, Observable, Subject } from 'rxjs';
import { Notification } from './schemas/notification.schema';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationCreatedEvent } from './events/notification-created.event';
import { AuthenticatedGuard } from '../auth/guards/authenticated-auth.guard';
import { UsersPoliciesGuard } from '../security/guards/users-policies.guard';
import { CheckUsersPolicies } from '../security/decorators/check-users-policies.decorator';
import { UserAbility } from '../security/functions/user-ability.function';
import { Action } from '../security/enums/action.enum';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Sse('sse')
  sse(): Observable<{ data: Notification }> {
    return this.notificationsService.sse();
  }

  @OnEvent('notification.created')
  handleNotificationCreatedEvent(
    notificationCreatedEvent: NotificationCreatedEvent,
  ) {
    return this.notificationsService.handleNotificationCreatedEvent(
      notificationCreatedEvent,
    );
  }

  @Post()
  @CheckUsersPolicies((ability: UserAbility) => ability.can(Action.Read, 'all'))
  @UseGuards(AuthenticatedGuard, UsersPoliciesGuard)
  create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Post('read')
  markAsRead(): Promise<Notification[]> {
    return this.notificationsService.markAsRead();
  }

  @Get()
  @CheckUsersPolicies((ability: UserAbility) => ability.can(Action.Read, 'all'))
  @UseGuards(AuthenticatedGuard, UsersPoliciesGuard)
  findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Get('users')
  @UseGuards(AuthenticatedGuard)
  findAllByUser(@Req() req): Promise<Notification[]> {
    const userId = req.user._id;
    return this.notificationsService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
