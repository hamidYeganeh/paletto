import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { IBlogsStatus } from "../enums/blogs-status.enum";

export type BlogDocument = HydratedDocument<Blog>;

@Schema({
  timestamps: true,
  _id: true,
  collection: "Blogs",
})
export class Blog {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ type: [String], default: [], index: true })
  tags?: string[];

  @Prop({ type: Boolean, default: false })
  isScheduled?: boolean;

  @Prop({ type: Date })
  publishAt?: Date;

  @Prop({
    enum: IBlogsStatus,
    default: IBlogsStatus.DRAFT,
    type: String,
    trim: true,
    required: true,
  })
  status: IBlogsStatus;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  cover: string;

  @Prop({
    type: Types.ObjectId,
    ref: "Users_profiles",
    required: true,
    index: true,
  })
  authorId: Types.ObjectId;

  _id: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
