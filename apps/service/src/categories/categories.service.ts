import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { GetCategoryDto } from "./dto/get-category.dto";
import {
  ListCategoriesQueryDto,
  ListCategoriesResponseDto,
} from "./dto/list-categories.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { UpdateCategoryStatusDto } from "./dto/update-category-status.dto";
import { CategoryDocument } from "./schemas/category.schema";
import { CreateCategoryService } from "./services/create-category.service";
import { GetCategoryService } from "./services/get-category.service";
import { ListCategoriesService } from "./services/list-categories.service";
import { UpdateCategoryService } from "./services/update-category.service";
import { UpdateCategoryStatusService } from "./services/update-category-status.service";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly createCategoryService: CreateCategoryService,
    private readonly getCategoryService: GetCategoryService,
    private readonly listCategoriesService: ListCategoriesService,
    private readonly updateCategoryService: UpdateCategoryService,
    private readonly updateCategoryStatusService: UpdateCategoryStatusService
  ) {}

  async createCategory(dto: CreateCategoryDto): Promise<CategoryDocument> {
    return this.createCategoryService.execute(dto);
  }

  async getCategory(dto: GetCategoryDto): Promise<CategoryDocument> {
    return this.getCategoryService.execute(dto);
  }

  async listCategories(
    dto: ListCategoriesQueryDto
  ): Promise<ListCategoriesResponseDto> {
    return this.listCategoriesService.execute(dto);
  }

  async updateCategory(dto: UpdateCategoryDto): Promise<CategoryDocument> {
    return this.updateCategoryService.execute(dto);
  }

  async updateCategoryStatus(
    dto: UpdateCategoryStatusDto
  ): Promise<CategoryDocument> {
    return this.updateCategoryStatusService.execute(dto);
  }
}
