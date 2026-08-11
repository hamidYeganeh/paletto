import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ArtistProfileDocument = ArtistProfile & Document;

@Schema({ timestamps: true })
export class ArtistProfile {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  displayName!: string;

  @Prop({ required: true, unique: true, index: true })
  slug!: string;

  @Prop()
  bio?: string;

  @Prop()
  coverImageUrl?: string;

  @Prop()
  location?: string;

  @Prop({ type: Object, default: {} })
  socialLinks?: Record<string, string>;

  @Prop({ default: 0 })
  followersCount!: number;

  @Prop({ default: 0 })
  followingCount!: number;

  @Prop({ default: false })
  isVerified!: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ArtistProfileSchema = SchemaFactory.createForClass(ArtistProfile);
