import { ExhibitionStatus } from '../enums';

export interface ExhibitionDto {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  status: ExhibitionStatus;
  artworkIds: string[];
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExhibitionDto {
  title: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  artworkIds?: string[];
  startDate?: string;
  endDate?: string;
  status?: ExhibitionStatus;
}

export interface UpdateExhibitionDto extends Partial<CreateExhibitionDto> {}
