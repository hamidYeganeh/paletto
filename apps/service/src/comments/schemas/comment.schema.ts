import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import {
  COMMENT_STATUSES,
  CommentStatus,
} from "../enums/comment-status.enum";
import { CommentTargetType } from "../enums/comment-target.enum";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true, _id: true, collection: "Comments" })
export class Comment {
  @Prop({
    enum: CommentTargetType,
    type: String,
    required: true,
    index: true,
  })
  targetType: CommentTargetType;

  @Prop({ required: true, trim: true })
  targetModel: string;

  @Prop({
    type: Types.ObjectId,
    refPath: "targetModel",
    required: true,
    index: true,
  })
  targetId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: "Users_profiles",
    required: true,
    index: true,
  })
  authorId: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 2000 })
  content: string;

  @Prop({
    enum: COMMENT_STATUSES,
    default: CommentStatus.DRAFT,
    type: String,
    index: true,
  })
  status: CommentStatus;

  createdAt: Date;

  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
