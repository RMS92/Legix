import { Role } from '../../security/enums/role.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: string;

  @Prop({ type: String, required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  full_name: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Array, default: [Role.ROLE_USER] })
  roles: Role[];

  @Prop({type: String})
  confirmation_token: string

  @Prop({ type: Date, default: Date.now() })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
