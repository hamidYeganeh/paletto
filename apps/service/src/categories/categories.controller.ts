import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CategoryCreateDto } from "./dto/categories-create.dto";
import { CategoryDocument } from "./schemas/categories.schema";
import { CategoriesService } from "./categories.service";
import {
  CategoriesListQueryDto,
  CategoriesListResponseDto,
} from "./dto/categories-list.dto";
import { CategoryUpdateDto } from "./dto/categories-update.dto";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get("list")
  async getCategoriesList(
    @Query() query: CategoriesListQueryDto
  ): Promise<CategoriesListResponseDto> {
    return this.categoriesService.getCategoriesList(query);
  }

  @Get("details/:categoryId")
  async getCategoryById(
    @Param("categoryId") categoryId: string
  ): Promise<CategoryDocument> {
    return this.categoriesService.getCategoryById(categoryId);
  }

  @Post("create")
  async createCategory(
    @Body() dto: CategoryCreateDto
  ): Promise<CategoryDocument> {
    return this.categoriesService.createCategories(dto);
  }

  @Patch("update")
  async updateCategory(
    @Body() dto: CategoryUpdateDto
  ): Promise<CategoryDocument> {
    return this.categoriesService.updateCategories(dto);
  }
}
