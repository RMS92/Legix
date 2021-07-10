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

  handleNotificationCreatedEvent(payload: Notification): void {
    this.event.next({ data: payload });
  }

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const data = {
      created_at: Date.now(),
      ...createNotificationDto,
    };
    const newNotification = new this.notificationModel(data);
    this.eventEmitter.emit('notification.created', {
      payload: newNotification,
    });
    return newNotification.save();
  }

  findAll() {
    return `This action returns all notifications`;
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
