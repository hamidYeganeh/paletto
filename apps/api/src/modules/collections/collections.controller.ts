import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, RequestUser } from '../../common/decorators/current-user.decorator';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Public()
  @Get()
  findPublic(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.collectionsService.findPublic(page, limit);
  }

  @Get('me')
  findMine(@CurrentUser() user: RequestUser, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.collectionsService.findForOwner(user.userId, page, limit);
  }

  @Post()
  async create(@CurrentUser() user: RequestUser, @Body() dto: CreateCollectionDto) {
    const collection = await this.collectionsService.create(user.userId, dto);
    return this.collectionsService.toDto(collection);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const collection = await this.collectionsService.findByIdOrThrow(id);
    return this.collectionsService.toDto(collection);
  }

  @Patch(':id')
  async update(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    const collection = await this.collectionsService.update(id, user.userId, dto);
    return this.collectionsService.toDto(collection);
  }

  @Post(':id/artworks/:artworkId')
  async addArtwork(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Param('artworkId') artworkId: string,
  ) {
    const collection = await this.collectionsService.addArtwork(id, user.userId, artworkId);
    return this.collectionsService.toDto(collection);
  }

  @Delete(':id/artworks/:artworkId')
  async removeArtwork(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Param('artworkId') artworkId: string,
  ) {
    const collection = await this.collectionsService.removeArtwork(id, user.userId, artworkId);
    return this.collectionsService.toDto(collection);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    await this.collectionsService.remove(id, user.userId);
    return { success: true };
  }
}
