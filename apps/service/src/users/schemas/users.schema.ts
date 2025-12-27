import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IUserRoles } from "../enums/users-role.enum";
import { IUserStatus } from "../enums/users-status.enum";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, _id: true, collection: "Users" })
export class User {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({
    enum: IUserRoles,
    type: String,
    required: true,
    default: IUserRoles.USER,
  })
  role: IUserRoles;

  @Prop({
    enum: IUserStatus,
    default: IUserStatus.ACTIVE,
    type: String,
    required: true,
  })
  status: IUserStatus;

  _id: string;

  createdAt: Date;

  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
