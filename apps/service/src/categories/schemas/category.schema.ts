import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import {
  CATEGORY_STATUSES,
  type CategoryStatus,
} from "src/categories/enums/category-status.enum";

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, _id: true, collection: "Categories" })
export class Category {
  @Prop({ required: true, trim: true, index: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, trim: true, index: true, unique: true })
  slug: string;

  @Prop({ required: true, trim: true, enum: CATEGORY_STATUSES })
  status: CategoryStatus;

  createdAt: Date;

  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
