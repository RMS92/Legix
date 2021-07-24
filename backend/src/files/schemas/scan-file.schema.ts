import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Scan } from '../../scans/schemas/scan.schema';

export type ScanFileDocument = ScanFile & Document;

@Schema()
export class ScanFile {
  _id: string;

  @Prop({ type: String, required: true, maxlength: 100 })
  original_filename: string;

  @Prop({ type: String, required: true, maxlength: 100 })
  current_filename: string;

  @Prop({ type: String, required: true, maxlength: 50 })
  extension: string;

  @Prop({ type: Number, required: true })
  size: number;

  @Prop({ type: Number, required: true })
  position: number;

  @Prop({ type: String, maxlength: 50 })
  category: string;

  @Prop({ type: Number, default: 1 })
  status: number;

  @Prop({ type: String, maxlength: 50 })
  orientation: string;

  @Prop({ type: Date, default: Date.now() })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Scan' })
  scan: Scan;
}

export const ScanFileSchema = SchemaFactory.createForClass(ScanFile);
