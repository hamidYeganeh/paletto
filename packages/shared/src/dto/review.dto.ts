import { ReviewStatus } from '../enums';

export interface ReviewDto {
  id: string;
  authorId: string;
  targetId: string;
  rating: number;
  comment?: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface CreateReviewDto {
  targetId: string;
  rating: number;
  comment?: string;
}
