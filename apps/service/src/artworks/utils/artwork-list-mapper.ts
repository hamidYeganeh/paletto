import { Types } from "mongoose";
import type {
  ArtistProfileDto,
  ArtworkListItemDto,
  TaxonomyListItemDto,
} from "../dto/list-artworks.dto";

export const PUBLIC_ARTWORKS_LIST_SELECT =
  "_id artistId title description images tags isScheduled publishAt status techniques styles categories createdAt updatedAt";
export const ARTIST_PROFILE_SELECT = "_id userId displayName techniques styles";
export const TAXONOMY_LIST_SELECT = "_id title slug status";

type TaxonomyListLean = Types.ObjectId | TaxonomyListItemDto;

export type ArtworkListLean = {
  _id: Types.ObjectId;
  artistId?: Types.ObjectId | ArtistProfileDto;
  techniques?: TaxonomyListLean[];
  styles?: TaxonomyListLean[];
  categories?: TaxonomyListLean[];
  title: string;
  description?: string;
  images?: string[];
  tags?: string[];
  isScheduled?: boolean;
  publishAt?: Date;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
};

const isArtistProfile = (
  value: Types.ObjectId | ArtistProfileDto | undefined
): value is ArtistProfileDto =>
  typeof value === "object" && value !== null && "_id" in value;

const isTaxonomyListItem = (
  value: TaxonomyListLean
): value is TaxonomyListItemDto =>
  typeof value === "object" && value !== null && "_id" in value;

const mapTaxonomyList = (
  items?: TaxonomyListLean[]
): TaxonomyListItemDto[] => {
  if (!Array.isArray(items)) return [];
  return items.filter(isTaxonomyListItem);
};

export const mapArtworkListItem = (
  artwork: ArtworkListLean
): ArtworkListItemDto => {
  const { artistId, techniques, styles, categories, ...rest } = artwork;

  return {
    ...rest,
    artist: isArtistProfile(artistId) ? artistId : undefined,
    techniques: mapTaxonomyList(techniques),
    styles: mapTaxonomyList(styles),
    categories: mapTaxonomyList(categories),
  };
};
