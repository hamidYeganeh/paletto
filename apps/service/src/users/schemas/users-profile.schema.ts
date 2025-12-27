import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type UserProfileDocument = HydratedDocument<UserProfile>;

@Schema({ timestamps: true, collection: "Users_profiles" })
export class UserProfile {
  @Prop({
    type: Types.ObjectId,
    ref: "User",
    unique: true,
    index: true,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  bio?: string;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
