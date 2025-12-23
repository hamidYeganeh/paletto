import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { ArtworksStatus } from "../enums/artworks-status.enum";

export type ArtworkDocument = HydratedDocument<Artwork>;

@Schema({ timestamps: true, _id: true })
export class Artwork {
  @Prop({ required: true, index: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, type: Types.ObjectId, ref: "User", index: true })
  artistID: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Category" }], default: [] })
  categories: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "Technique" }], default: [] })
  techniques: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "Material" }], default: [] })
  materials: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "Medium" }], default: [] })
  mediums: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Number, min: 0 })
  year?: number;

  @Prop({ type: Number, min: 0 })
  widthCm?: number;

  @Prop({ type: Number, min: 0 })
  heightCm?: number;

  @Prop({ type: Number, min: 0 })
  depthCm?: number;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ type: String, trim: true, uppercase: true, default: "USD" })
  currency: string;

  @Prop({ default: false })
  isNegotiable: boolean;

  @Prop({ type: Date })
  soldAt?: Date;

  @Prop({
    enum: ArtworksStatus,
    type: String,
    required: true,
    default: ArtworksStatus.ACTIVE,
  })
  status: ArtworksStatus;

  _id: string;

  createdAt?: Date;

  updatedAt?: Date;
}

export const ArtworkSchema = SchemaFactory.createForClass(Artwork);

ArtworkSchema.index({ status: 1, createdAt: -1 });
ArtworkSchema.index({ artistID: 1, status: 1, createdAt: -1 });
ArtworkSchema.index({ title: "text", description: "text", tags: "text" });

ArtworkSchema.virtual("artist", {
  ref: "User",
  localField: "artistID",
  foreignField: "_id",
  justOne: true,
});

ArtworkSchema.set("toJSON", { virtuals: true });
ArtworkSchema.set("toObject", { virtuals: true });
