import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReviewDto } from '@workspace/shared';
import { parsePagination } from '../../common/utils/pagination.util';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>) {}

  async create(authorId: string, dto: CreateReviewDto): Promise<ReviewDocument> {
    const created = new this.reviewModel({
      authorId: new Types.ObjectId(authorId),
      targetId: new Types.ObjectId(dto.targetId),
      rating: dto.rating,
      comment: dto.comment,
    });
    return created.save();
  }

  async findForTarget(targetId: string, page?: number, limit?: number) {
    const { page: p, limit: l, skip } = parsePagination(page, limit);
    const filter = { targetId: new Types.ObjectId(targetId) };
    const [items, total] = await Promise.all([
      this.reviewModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
      this.reviewModel.countDocuments(filter).exec(),
    ]);

    const averageRating =
      items.length > 0 ? items.reduce((sum, review) => sum + review.rating, 0) / items.length : 0;

    return { items: items.map((item) => this.toDto(item)), total, page: p, limit: l, averageRating };
  }

  toDto(review: ReviewDocument): ReviewDto {
    return {
      id: review._id.toString(),
      authorId: review.authorId.toString(),
      targetId: review.targetId.toString(),
      rating: review.rating,
      comment: review.comment,
      status: review.status,
      createdAt: (review.createdAt ?? new Date()).toISOString(),
    };
  }
}
