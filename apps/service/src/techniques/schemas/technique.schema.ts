import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import {
  TECHNIQUE_STATUSES,
  type TechniqueStatus,
} from "src/techniques/enums/technique-status.enum";

export type TechniqueDocument = HydratedDocument<Technique>;

@Schema({ timestamps: true, _id: true, collection: "Techniques" })
export class Technique {
  @Prop({ required: true, trim: true, index: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, trim: true, index: true, unique: true })
  slug: string;

  @Prop({ required: true, trim: true, enum: TECHNIQUE_STATUSES })
  status: TechniqueStatus;

  createdAt: Date;

  updatedAt: Date;
}

export const TechniqueSchema = SchemaFactory.createForClass(Technique);
