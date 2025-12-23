import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ _id: false })
export class UserProfile {
  /* ---------- PURCHASE BEHAVIOR ---------- */

  @Prop({ default: false })
  hasBoughtBefore: boolean;

  @Prop({ default: 0 })
  totalPurchases: number;

  @Prop({ default: 0 })
  totalSpent: number;

  @Prop()
  lastPurchaseAt?: Date;

  /* ---------- FAVORITES ---------- */

  @Prop({ type: [{ type: Types.ObjectId, ref: "Artworks" }], default: [] })
  favoriteArtworks: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "Categories" }], default: [] })
  favoriteCategories: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "Technique" }], default: [] })
  favoriteTechniques: Types.ObjectId[];

  @Prop({
    type: {
      min: Number,
      max: Number,
    },
    _id: false,
  })
  preferredPriceRange?: {
    min: number;
    max: number;
  };

  /* ---------- ENGAGEMENT ---------- */

  @Prop({ default: 0 })
  reviewsGiven: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: "User" }], default: [] })
  followedArtists: Types.ObjectId[];
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
