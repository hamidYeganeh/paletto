import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole, UserStatus } from '@workspace/shared';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id!: Types.ObjectId;

  @Prop({ required: true, unique: true, index: true })
  phone!: string;

  @Prop()
  name?: string;

  @Prop()
  email?: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.CUSTOMER })
  role!: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status!: UserStatus;

  @Prop()
  avatarUrl?: string;

  @Prop()
  passwordHash?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
