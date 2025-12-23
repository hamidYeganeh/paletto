import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ _id: false })
export class ArtistProfile {
  /* ---------- CLASSIFICATION ---------- */

  @Prop({ type: [{ type: Types.ObjectId, ref: "Technique" }], default: [] })
  techniques: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "Categories" }], default: [] })
  categories: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "Styles" }], default: [] })
  styles: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "Mediums" }], default: [] })
  mediums: Types.ObjectId[];

  /* ---------- PROFESSIONAL INFO ---------- */

  @Prop({ default: 0 })
  yearsOfExperience: number;

  @Prop({ trim: true })
  displayName?: string;

  /* ---------- MARKETPLACE METRICS ---------- */

  @Prop({ default: 0 })
  artworksCount: number;

  @Prop({ default: 0 })
  totalSales: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewsCount: number;

  /* ---------- COMMERCIAL ---------- */

  @Prop({ default: false })
  acceptsCommissions: boolean;

  @Prop()
  commissionStartingPrice?: number;

  @Prop({ maxlength: 500 })
  commissionNotes?: string;

  /* ---------- STATUS & VISIBILITY ---------- */

  @Prop({ default: false })
  isVerified: boolean;
}

export const ArtistProfileSchema = SchemaFactory.createForClass(ArtistProfile);
