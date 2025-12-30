import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import {
  TAXONOMY_STATUSES,
  type TaxonomyStatus,
} from "src/common/enums/taxonomy-status.enum";

export type StyleDocument = HydratedDocument<Style>;

@Schema({ timestamps: true, _id: true, collection: "Styles" })
export class Style {
  @Prop({ required: true, trim: true, index: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, trim: true, index: true, unique: true })
  slug: string;

  @Prop({ required: true, trim: true, enum: TAXONOMY_STATUSES })
  status: TaxonomyStatus;

  createdAt: Date;

  updatedAt: Date;
}

export const StyleSchema = SchemaFactory.createForClass(Style);
