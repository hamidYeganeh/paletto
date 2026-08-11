import { CollectionVisibility } from '../enums';

export interface CollectionDto {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  visibility: CollectionVisibility;
  artworkIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionDto {
  name: string;
  description?: string;
  visibility?: CollectionVisibility;
}

export interface UpdateCollectionDto extends Partial<CreateCollectionDto> {}
