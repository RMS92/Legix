import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import * as mongoose from 'mongoose';
import { Scan } from '../../scans/schemas/scan.schema';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  _id: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Date, default: Date.now() })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  parent: Comment;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  replies: Comment[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Scan' })
  scan: Scan;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
