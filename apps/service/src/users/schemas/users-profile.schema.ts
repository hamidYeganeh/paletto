import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type UserProfileDocument = HydratedDocument<UserProfile>;

@Schema({ timestamps: true, collection: "Users_profiles" })
export class UserProfile {
  @Prop({
    type: Types.ObjectId,
    ref: "Users",
    unique: true,
    index: true,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true, default: "" })
  name: string;

  @Prop()
  bio?: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: "Blogs" }],
    default: [],
    index: true,
  })
  blogs?: Types.ObjectId[];
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
