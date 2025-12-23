import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type MediaDocument = HydratedDocument<Media>;

@Schema({ timestamps: true, _id: true })
export class Media {
  @Prop({ required: true, unique: true, index: true })
  hash: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  relativePath: string;

  _id: string;

  createdAt?: Date;

  updatedAt?: Date;
}

export const MediaSchema = SchemaFactory.createForClass(Media);

