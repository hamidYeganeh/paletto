import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserRole } from '@workspace/shared';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { TaxonomyService } from './taxonomy.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('taxonomy')
export class TaxonomyController {
  constructor(private readonly taxonomyService: TaxonomyService) {}

  @Public()
  @Get('categories')
  findAllCategories() {
    return this.taxonomyService.findAllCategories();
  }

  @Roles(UserRole.ADMIN)
  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.taxonomyService.createCategory(dto);
  }

  @Public()
  @Get('tags')
  findAllTags() {
    return this.taxonomyService.findAllTags();
  }

  @Roles(UserRole.ADMIN)
  @Post('tags')
  createTag(@Body() dto: CreateTagDto) {
    return this.taxonomyService.createTag(dto);
  }
}
