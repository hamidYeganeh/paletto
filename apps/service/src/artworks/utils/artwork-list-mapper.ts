import { Types } from "mongoose";
import type {
  ArtistProfileDto,
  ArtworkListItemDto,
  ArtworkLookupItemDto,
} from "../dto/list-artworks.dto";

export const PUBLIC_ARTWORKS_LIST_SELECT =
  "_id artistId title description images tags status techniques styles categories createdAt updatedAt";
export const ARTIST_PROFILE_SELECT = "_id userId displayName techniques styles";
export const ARTWORK_LOOKUP_SELECT = "_id title slug status";

type ArtworkLookupLean = Types.ObjectId | ArtworkLookupItemDto;

export type ArtworkListLean = {
  _id: Types.ObjectId;
  artistId?: Types.ObjectId | ArtistProfileDto;
  techniques?: ArtworkLookupLean[];
  styles?: ArtworkLookupLean[];
  categories?: ArtworkLookupLean[];
  title: string;
  description?: string;
  images?: string[];
  tags?: string[];
  status?: string;
  createdAt: Date;
  updatedAt: Date;
};

const isArtistProfile = (
  value: Types.ObjectId | ArtistProfileDto | undefined
): value is ArtistProfileDto =>
  typeof value === "object" && value !== null && "_id" in value;

const isArtworkLookupItem = (
  value: ArtworkLookupLean
): value is ArtworkLookupItemDto =>
  typeof value === "object" && value !== null && "_id" in value;

const mapLookupList = (
  items?: ArtworkLookupLean[]
): ArtworkLookupItemDto[] => {
  if (!Array.isArray(items)) return [];
  return items.filter(isArtworkLookupItem);
};

export const mapArtworkListItem = (
  artwork: ArtworkListLean
): ArtworkListItemDto => {
  const { artistId, techniques, styles, categories, ...rest } = artwork;

  return {
    ...rest,
    artist: isArtistProfile(artistId) ? artistId : undefined,
    techniques: mapLookupList(techniques),
    styles: mapLookupList(styles),
    categories: mapLookupList(categories),
  };
};
