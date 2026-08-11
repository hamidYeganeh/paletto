import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserRole } from '@workspace/shared';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { ExhibitionsService } from './exhibitions.service';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';

@Controller('exhibitions')
export class ExhibitionsController {
  constructor(private readonly exhibitionsService: ExhibitionsService) {}

  @Public()
  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.exhibitionsService.findAll(page, limit);
  }

  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() dto: CreateExhibitionDto) {
    const exhibition = await this.exhibitionsService.create(dto);
    return this.exhibitionsService.toDto(exhibition);
  }

  @Public()
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const exhibition = await this.exhibitionsService.findBySlug(slug);
    return this.exhibitionsService.toDto(exhibition);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateExhibitionDto) {
    const exhibition = await this.exhibitionsService.update(id, dto);
    return this.exhibitionsService.toDto(exhibition);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.exhibitionsService.remove(id);
    return { success: true };
  }
}
