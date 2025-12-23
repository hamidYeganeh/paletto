import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CategoriesStatus } from "../enums/categories-status.enum";

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ _id: true, timestamps: true })
export class Category {
  @Prop({ required: true, index: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({
    required: true,
    type: String,
    enum: CategoriesStatus,
    default: CategoriesStatus.ACTIVE,
  })
  status: CategoriesStatus;

  _id: string;

  createdAt: Date;

  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
