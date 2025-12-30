import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import {
  TAXONOMY_STATUSES,
  type TaxonomyStatus,
} from "src/common/enums/taxonomy-status.enum";

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, _id: true, collection: "Categories" })
export class Category {
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

export const CategorySchema = SchemaFactory.createForClass(Category);
