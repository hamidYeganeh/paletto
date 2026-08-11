import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, RequestUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { ArtistProfilesService } from './artist-profiles.service';
import { UpsertArtistProfileDto } from './dto/upsert-artist-profile.dto';

@Controller('artists')
export class ArtistProfilesController {
  constructor(
    private readonly artistProfilesService: ArtistProfilesService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.artistProfilesService.findAll(page, limit);
  }

  @Get('me')
  async me(@CurrentUser() user: RequestUser) {
    const profile = await this.artistProfilesService.findByUserId(user.userId);
    if (!profile) {
      throw new NotFoundException('Artist profile not found');
    }
    return this.artistProfilesService.toDto(profile);
  }

  @Post('me')
  async upsertMe(@CurrentUser() user: RequestUser, @Body() dto: UpsertArtistProfileDto) {
    const profile = await this.artistProfilesService.upsert(user.userId, dto);

    await this.usersService.promoteToArtist(user.userId);

    const auth = await this.authService.reissueToken(user.userId);

    return {
      profile: this.artistProfilesService.toDto(profile),
      accessToken: auth.accessToken,
      user: auth.user,
    };
  }

  @Public()
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const profile = await this.artistProfilesService.findBySlug(slug);
    if (!profile) {
      throw new NotFoundException('Artist profile not found');
    }
    return this.artistProfilesService.toDto(profile);
  }
}
