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

  @Prop({
    type: [{ type: Types.ObjectId, ref: "Artworks" }],
    default: [],
    index: true,
  })
  savedArtworks?: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: "Blogs" }],
    default: [],
    index: true,
  })
  savedBlogs?: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: "Artworks" }],
    default: [],
    index: true,
  })
  likedArtworks?: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: "Blogs" }],
    default: [],
    index: true,
  })
  likedBlogs?: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: "Artworks" }],
    default: [],
    index: true,
  })
  commentedArtworks?: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: "Blogs" }],
    default: [],
    index: true,
  })
  commentedBlogs?: Types.ObjectId[];
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
