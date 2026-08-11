import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, RequestUser } from '../../common/decorators/current-user.decorator';
import { SocialService } from './social.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post('follow/:userId')
  async follow(@CurrentUser() user: RequestUser, @Param('userId') userId: string) {
    await this.socialService.follow(user.userId, userId);
    return { success: true };
  }

  @Delete('follow/:userId')
  async unfollow(@CurrentUser() user: RequestUser, @Param('userId') userId: string) {
    await this.socialService.unfollow(user.userId, userId);
    return { success: true };
  }

  @Public()
  @Get('followers/:userId')
  listFollowers(@Param('userId') userId: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.socialService.listFollowers(userId, page, limit);
  }

  @Public()
  @Get('following/:userId')
  listFollowing(@Param('userId') userId: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.socialService.listFollowing(userId, page, limit);
  }

  @Post('artworks/:artworkId/like')
  async like(@CurrentUser() user: RequestUser, @Param('artworkId') artworkId: string) {
    await this.socialService.like(user.userId, artworkId);
    return { success: true };
  }

  @Delete('artworks/:artworkId/like')
  async unlike(@CurrentUser() user: RequestUser, @Param('artworkId') artworkId: string) {
    await this.socialService.unlike(user.userId, artworkId);
    return { success: true };
  }

  @Public()
  @Get('artworks/:artworkId/comments')
  listComments(
    @Param('artworkId') artworkId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.socialService.listComments(artworkId, page, limit);
  }

  @Post('artworks/:artworkId/comments')
  async addComment(
    @CurrentUser() user: RequestUser,
    @Param('artworkId') artworkId: string,
    @Body() dto: CreateCommentDto,
  ) {
    const comment = await this.socialService.addComment(user.userId, artworkId, dto);
    return this.socialService.commentToDto(comment);
  }
}
