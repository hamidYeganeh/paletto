import { MediaType } from '../enums';

export interface MediaAssetDto {
  id: string;
  type: MediaType;
  url: string;
  mimeType?: string;
  size?: number;
  createdAt: string;
}
