import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { GetCategoryDto } from "../dto/get-category.dto";
import { ListCategoriesQueryDto } from "../dto/list-categories.dto";
import { CategoriesService } from "../categories.service";

const PUBLIC_CATEGORY_STATUS = "active";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post("get")
  async getCategory(@Body() dto: GetCategoryDto) {
    return this.categoriesService.getCategory(dto);
  }

  @Get("list")
  async listCategories(@Query() query: ListCategoriesQueryDto) {
    return this.categoriesService.listCategories({
      ...query,
      status: PUBLIC_CATEGORY_STATUS,
    });
  }
}
