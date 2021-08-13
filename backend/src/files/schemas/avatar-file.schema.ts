import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AvatarFileDocument = AvatarFile & Document;

@Schema()
export class AvatarFile {
  _id: string;

  @Prop({ type: String, required: true, maxlength: 100 })
  original_filename: string;

  @Prop({ type: String, required: true, maxlength: 100 })
  current_filename: string;

  @Prop({ type: String, required: true, maxlength: 50 })
  extension: string;

  @Prop({ type: Number, required: true })
  size: number;

  @Prop({ type: Date, default: Date.now() })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const AvatarFileSchema = SchemaFactory.createForClass(AvatarFile);
