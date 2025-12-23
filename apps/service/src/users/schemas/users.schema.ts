import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UserRoles } from "../enums/users-roles.enum";
import { UserProfile, UserProfileSchema } from "./users-user-profile.schema";
import {
  ArtistProfile,
  ArtistProfileSchema,
} from "./users-artist-profile.schema";
import { UserStatus } from "../enums/users-status.enum";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, _id: true })
export class User {
  /* ---------------- AUTH ---------------- */

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: String,
    unique: true,
    lowercase: true,
    index: true,
  })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  /* ---------------- ROLE ---------------- */

  @Prop({
    required: true,
    type: String,
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role: UserRoles;

  /* ---------------- PROFILE ---------------- */

  @Prop({
    type: UserProfileSchema,
    default: null,
    // required: function (this: User) {
    //   return this.role === UserRoles.USER;
    // },
  })
  userProfile?: UserProfile | null;

  @Prop({
    type: ArtistProfileSchema,
    default: null,
    // required: function (this: User) {
    //   return this.role === UserRoles.ARTIST;
    // },
  })
  artistProfile?: ArtistProfile | null;

  /* ---------- STATUS & VISIBILITY ---------- */

  @Prop({ type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  _id: string;

  createdAt?: Date;

  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
