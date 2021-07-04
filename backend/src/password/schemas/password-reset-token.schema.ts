import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import * as mongoose from 'mongoose';

export type PasswordResetTokenDocument = PasswordResetToken & Document;

@Schema({ collection: 'passwordResetTokens' })
export class PasswordResetToken {
  _id: string;

  @Prop({ type: Date, default: Date.now() })
  created_at: Date;

  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const PasswordResetTokenSchema =
  SchemaFactory.createForClass(PasswordResetToken);
