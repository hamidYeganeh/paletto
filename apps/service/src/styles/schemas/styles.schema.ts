import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { StylesStatus } from "../enums/styles-status.enum";

export type StyleDocument = HydratedDocument<Style>;

@Schema({ _id: true, timestamps: true })
export class Style {
  @Prop({ required: true, index: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({
    required: true,
    type: String,
    enum: StylesStatus,
    default: StylesStatus.ACTIVE,
  })
  status: StylesStatus;

  _id: string;

  createdAt: Date;

  updatedAt: Date;
}

export const StyleSchema = SchemaFactory.createForClass(Style);

