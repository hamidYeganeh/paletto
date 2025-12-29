import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

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

  @Prop({ trim: true })
  status?: string;

  createdAt: Date;

  updatedAt: Date;
}

export const ArtworkSchema = SchemaFactory.createForClass(Artwork);
