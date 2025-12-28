import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type ArtistDocument = HydratedDocument<Artist>;

@Schema({ timestamps: true, collection: "Artists" })
export class Artist {
  @Prop({
    type: Types.ObjectId,
    ref: "Users",
    required: true,
    unique: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({ trim: true })
  displayName?: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: "Artworks" }],
    default: [],
    index: true,
  })
  artworks: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: "Techniques" }],
    default: [],
    index: true,
  })
  techniques: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: "Styles" }],
    default: [],
    index: true,
  })
  styles: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: "Users" }],
    default: [],
    index: true,
  })
  followers: Types.ObjectId[];
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
