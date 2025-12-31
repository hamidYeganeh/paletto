import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import {
  STYLE_STATUSES,
  type StyleStatus,
} from "src/styles/enums/style-status.enum";

export type StyleDocument = HydratedDocument<Style>;

@Schema({ timestamps: true, _id: true, collection: "Styles" })
export class Style {
  @Prop({ required: true, trim: true, index: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, trim: true, index: true, unique: true })
  slug: string;

  @Prop({ required: true, trim: true, enum: STYLE_STATUSES })
  status: StyleStatus;

  createdAt: Date;

  updatedAt: Date;
}

export const StyleSchema = SchemaFactory.createForClass(Style);
