import { ArtworkMedium, ArtworkStatus } from '../enums';

export interface ArtworkDto {
  id: string;
  artistId: string;
  title: string;
  description?: string;
  medium: ArtworkMedium;
  price: number;
  currency: string;
  status: ArtworkStatus;
  images: string[];
  categoryIds: string[];
  tagIds: string[];
  width?: number;
  height?: number;
  depth?: number;
  year?: number;
  isFramed?: boolean;
  likesCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArtworkDto {
  title: string;
  description?: string;
  medium: ArtworkMedium;
  price: number;
  currency?: string;
  images: string[];
  categoryIds?: string[];
  tagIds?: string[];
  width?: number;
  height?: number;
  depth?: number;
  year?: number;
  isFramed?: boolean;
}

export interface UpdateArtworkDto extends Partial<CreateArtworkDto> {
  status?: ArtworkStatus;
}

export interface ArtworkQueryDto {
  page?: number;
  limit?: number;
  categoryId?: string;
  tagId?: string;
  artistId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ArtworkStatus;
  search?: string;
}
