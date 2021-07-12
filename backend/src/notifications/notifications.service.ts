import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, Subject } from 'rxjs';
import { NotificationCreatedEvent } from './events/notification-created.event';

@Injectable()
export class NotificationsService {
  private event = new Subject<{ data: Notification }>();

  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  sse(): Observable<{ data: Notification }> {
    return this.event.asObservable();
  }

  handleNotificationCreatedEvent(
    notificationCreatedEvent: NotificationCreatedEvent,
  ): void {
    this.event.next({ data: notificationCreatedEvent.getNotification() });
  }

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const data = {
      created_at: Date.now(),
      ...createNotificationDto,
    };
    const newNotification = new this.notificationModel(data);
    this.eventEmitter.emit(
      'notification.created',
      new NotificationCreatedEvent(newNotification),
    );
    return newNotification.save();
  }

  async markAsRead(): Promise<Notification[]> {
    const notifications = await this.notificationModel.find({
      read_at: null,
    });
    for (let notification of notifications) {
      await this.notificationModel.findByIdAndUpdate(
        { _id: notification._id },
        { read_at: new Date(Date.now()) },
      );
    }
    return notifications;
  }

  async findAllByUser(userId: string): Promise<Notification[]> {
    return (
      this.notificationModel
        // @ts-ignore
        .find({ $or: [{ user: null }, { user: userId }] }, {}, {})
        .sort({ created_at: -1 })
        .limit(10)
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
