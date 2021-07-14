import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from './schemas/notification.schema';
import { UsersModule } from '../users/users.module';
import { ScansModule } from '../scans/scans.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => ScansModule),
    forwardRef(() => CommentsModule),
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
