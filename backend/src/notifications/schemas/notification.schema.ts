import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import * as mongoose from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  _id: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String })
  url: string;

  @Prop({ type: String, default: 'public' })
  channel: string;

  @Prop({ type: Date, default: Date.now() })
  created_at: Date;

  @Prop({ type: Date, default: null })
  read_at: Date;

  @Prop({ type: Object })
  target: object;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
