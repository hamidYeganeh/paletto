import { Injectable } from "@nestjs/common";
import { CategoryCreateDto } from "./dto/categories-create.dto";
import { CategoryDocument } from "./schemas/categories.schema";
import { CategoriesCreateService } from "./services/categories-create.service";
import {
  CategoriesListQueryDto,
  CategoriesListResponseDto,
} from "./dto/categories-list.dto";
import { CategoriesListService } from "./services/categories-list.service";
import { CategoryUpdateDto } from "./dto/categories-update.dto";
import { CategoriesUpdateService } from "./services/categories-update.service";
import { CategoriesFindOneService } from "./services/categories-find-one.service";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesListService: CategoriesListService,
    private readonly categoriesCreateService: CategoriesCreateService,
    private readonly categoriesUpdateService: CategoriesUpdateService,
    private readonly categoriesFindOneService: CategoriesFindOneService
  ) {}

  async getCategoriesList(
    query: CategoriesListQueryDto
  ): Promise<CategoriesListResponseDto> {
    return this.categoriesListService.execute(query);
  }

  async getCategoryById(categoryId: string): Promise<CategoryDocument> {
    return this.categoriesFindOneService.execute(categoryId);
  }

  async createCategories(dto: CategoryCreateDto): Promise<CategoryDocument> {
    return this.categoriesCreateService.execute(dto);
  }

  async updateCategories(dto: CategoryUpdateDto): Promise<CategoryDocument> {
    return this.categoriesUpdateService.execute(dto);
  }
}
