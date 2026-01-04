import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import {
  ARTWORK_STATUSES,
  ArtworkStatus,
} from "src/artworks/enums/artwork-status.enum";

export type ArtworkDocument = HydratedDocument<Artwork>;

@Schema({ timestamps: true, _id: true, collection: "Artworks" })
export class Artwork {
  @Prop({
    type: Types.ObjectId,
    ref: "Artists",
    required: true,
    index: true,
  })
  artistId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: [String], default: [] })
  images?: string[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: "Techniques" }],
    default: [],
    index: true,
  })
  techniques?: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: "Styles" }],
    default: [],
    index: true,
  })
  styles?: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: "Categories" }],
    default: [],
    index: true,
  })
  categories?: Types.ObjectId[];

  @Prop({ type: [String], default: [], index: true })
  tags?: string[];

  @Prop({ type: Boolean, default: false })
  isScheduled?: boolean;

  @Prop({ type: Date })
  publishAt?: Date;

  @Prop({
    trim: true,
    enum: ARTWORK_STATUSES,
    default: ArtworkStatus.DRAFT,
  })
  status?: ArtworkStatus;

  createdAt: Date;

  updatedAt: Date;
}

export const ArtworkSchema = SchemaFactory.createForClass(Artwork);
