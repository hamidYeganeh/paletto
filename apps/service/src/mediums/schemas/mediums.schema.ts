import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MediumStatus } from "../enums/mediums-status.enum";
import { HydratedDocument } from "mongoose";

export type MediumDocument = HydratedDocument<Medium>;

@Schema({ _id: true, timestamps: true })
export class Medium {
  @Prop({ required: true, index: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({
    required: true,
    type: String,
    enum: MediumStatus,
    default: MediumStatus.ACTIVE,
  })
  status: MediumStatus;

  _id: string;

  createdAt: Date;

  updatedAt: Date;
}

export const MediumSchema = SchemaFactory.createForClass(Medium);
