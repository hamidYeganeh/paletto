import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { TechniquesStatus } from "../enums/techniques-status.enum";

export type TechniqueDocument = HydratedDocument<Technique>;

@Schema({ _id: true, timestamps: true })
export class Technique {
  @Prop({ required: true, index: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({
    required: true,
    type: String,
    enum: TechniquesStatus,
    default: TechniquesStatus.ACTIVE,
  })
  status: TechniquesStatus;

  _id: string;

  createdAt: Date;

  updatedAt: Date;
}

export const TechniqueSchema = SchemaFactory.createForClass(Technique);

