import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserRole } from '@workspace/shared';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, RequestUser } from '../../common/decorators/current-user.decorator';
import { ArtworksService } from './artworks.service';
import { CreateArtworkDto } from './dto/create-artwork.dto';
import { UpdateArtworkDto } from './dto/update-artwork.dto';
import { ArtworkQueryDto } from './dto/artwork-query.dto';

@Controller('artworks')
export class ArtworksController {
  constructor(private readonly artworksService: ArtworksService) {}

  @Public()
  @Get()
  findAll(@Query() query: ArtworkQueryDto) {
    return this.artworksService.findAll(query);
  }

  @Get('wishlist')
  listWishlist(@CurrentUser() user: RequestUser) {
    return this.artworksService.listWishlist(user.userId);
  }

  @Post('wishlist/:id')
  addToWishlist(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.artworksService.addToWishlist(user.userId, id);
  }

  @Delete('wishlist/:id')
  removeFromWishlist(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.artworksService.removeFromWishlist(user.userId, id);
  }

  @Roles(UserRole.ARTIST, UserRole.ADMIN)
  @Post()
  async create(@CurrentUser() user: RequestUser, @Body() dto: CreateArtworkDto) {
    const artwork = await this.artworksService.create(user.userId, dto);
    return this.artworksService.toDto(artwork);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const artwork = await this.artworksService.findByIdOrThrow(id);
    await this.artworksService.incrementViews(id);
    return this.artworksService.toDto(artwork);
  }

  @Roles(UserRole.ARTIST, UserRole.ADMIN)
  @Patch(':id')
  async update(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: UpdateArtworkDto) {
    const artwork = await this.artworksService.update(id, user.userId, user.role === UserRole.ADMIN, dto);
    return this.artworksService.toDto(artwork);
  }

  @Roles(UserRole.ARTIST, UserRole.ADMIN)
  @Delete(':id')
  async remove(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    await this.artworksService.remove(id, user.userId, user.role === UserRole.ADMIN);
    return { success: true };
  }
}
