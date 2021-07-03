import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import * as mongoose from 'mongoose';
import { ScanFile } from '../../files/schemas/scan-file.schema';

export type ScanDocument = Scan & Document;

@Schema()
export class Scan {
  _id: string;

  @Prop({ type: String, required: true, lowercase: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, default: 1 })
  status: number;

  @Prop({ type: Boolean, default: false })
  is_visible: boolean;

  @Prop({ type: Date, default: Date.now() })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ScanFile' }] })
  scanFiles: ScanFile[];
}

export const ScanSchema = SchemaFactory.createForClass(Scan);
