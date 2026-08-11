import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, RequestUser } from '../../common/decorators/current-user.decorator';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(@CurrentUser() user: RequestUser, @Body() dto: CreateReviewDto) {
    const review = await this.reviewsService.create(user.userId, dto);
    return this.reviewsService.toDto(review);
  }

  @Public()
  @Get('target/:targetId')
  findForTarget(
    @Param('targetId') targetId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reviewsService.findForTarget(targetId, page, limit);
  }
}
