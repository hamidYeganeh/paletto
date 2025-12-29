import { Types } from "mongoose";
import type {
  ArtistProfileDto,
  ArtworkListItemDto,
} from "../dto/list-artworks.dto";

export const PUBLIC_ARTWORKS_LIST_SELECT =
  "_id artistId title description images status createdAt updatedAt";

export const ARTIST_PROFILE_SELECT = "_id userId displayName techniques styles";

export type ArtworkListLean = {
  _id: Types.ObjectId;
  artistId?: Types.ObjectId | ArtistProfileDto;
  title: string;
  description?: string;
  images?: string[];
  status?: string;
  createdAt: Date;
  updatedAt: Date;
};

const isArtistProfile = (
  value: Types.ObjectId | ArtistProfileDto | undefined
): value is ArtistProfileDto =>
  typeof value === "object" && value !== null && "_id" in value;

export const mapArtworkListItem = (
  artwork: ArtworkListLean
): ArtworkListItemDto => {
  const { artistId, ...rest } = artwork;

  return {
    ...rest,
    artist: isArtistProfile(artistId) ? artistId : undefined,
  };
};
